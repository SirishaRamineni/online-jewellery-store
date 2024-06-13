
import { comparepassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from 'jsonwebtoken'
import orderModel from "../models/orderModel.js"

export const registerController=async(req,res)=>{
    try{
        const {name,email,password,answer,phone,address}=req.body
        if(!name){
            return res.status(400).send({message:"name is required"})
        }
        if(!email){
            return res.status(400).send({message:"email is required"})
        }
        if(!password){
            return res.status(400).send({message:"password is required"})
        }
        if(!answer){
            return res.status(400).send({message:"answer is required"})
        }
        if (!phone) {
            return res.send({ message: "Phone no is Required" });
          }
          if (!address) {
            return res.send({ message: "Address is Required" });
          }
       
        const existingUser=await userModel.findOne({email})
        if(existingUser){
            return res.status(200).send({
                success:false,
                message:"user already exists"
            })
        }
         const hashed=await hashPassword(password)
        const user=await new userModel({
            name,
            email,
            password:hashed,
            address,
            phone,
            answer,
        }).save()

        res.status(201).send({
            success:true,
            message:"user registered successfully",
            user
        })
    }catch(error){
        console.log(error)
        res.status(404).send({
            success:false,
            message:"something went wrong in registration",
            error
        })
    }
}


export const loginController=async(req,res)=>{
    try{
        const {email,password}=req.body
        if(!email || !password){
            return res.status(200).send({
                success:false,
                message:"email or password is required"
            })
        }
        const user=await userModel.findOne({email})
            if(!user){
            return res.status(400).send({
                success:false,
                message:"user not found,please register"
            })
            }
        const match=await comparepassword(password,user.password)
        if(!match){
            return res.status(400).send({
                success:false,
                message:"password doesnot match"
            })
        }

        const token=await JWT.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"})
        res.status(201).send({
            success:true,
            message:"user login successfully",
            user:{
                _id:user._id,
                name:user.name,
                email:user.email,
                phone: user.phone,
                address: user.address,
                role:user.role,
             },
             token
        })
    }catch(error){
        console.log(error)
        res.status(404).send({
            success:false,
            message:"error in logging",
            error
        })

    }
}

export const forgotPasswordController=async(req,res)=>{
    try{
        const {email,answer,newPassword}=req.body
        if(!email){
            return res.status(400).send({message:"email is required"})
        }
        if(!newPassword){
            return res.status(400).send({message:"newPassword is required"})
        }
        if(!answer){
            return res.status(400).send({message:"answer is required"})
        }
  
        const user=await userModel.findOne({email,answer})
            if(!user){
            return res.status(400).send({
                success:false,
                message:"user not found,please register"
            })
            }
         const hashed=await hashPassword(newPassword)
        await userModel.findByIdAndUpdate(user._id,{password:hashed})
        res.status(201).send({
            success:true,
            message:"password reset successfully",
        })
    }catch(error){
        console.log(error)
        res.status(404).send({
            success:false,
            message:"error in changing password",
            error
        })
}
}

export const updateProfileController=async(req,res)=>{
    try{
        const {name,email,password,answer,address,phone}=req.body
        const user=await userModel.findById(req.user._id)
          if(!user){
                return res.status(400).send({
                    success:false,
                    message:"user not found,please register"
                })
           }
        
           const hashed=password ? await hashPassword(password) : Undefined

           const updatedUser=await userModel.findByIdAndUpdate(req.user._id,{
            name: name || user.name,
            password:hashed || user.password ,
            address:address || user.address,
            phone:phone || user.phone,
            answer:answer || user.answer
           },{new:true})
           return res.status(201).send({
            success:false,
            message:"user updated successfullyr",
            updatedUser
    })
 }catch(error){
    console.log(error)
    res.status(404).send({
        success:false,
        message:"error in updating profile",
        error
    })
}
}

export const getOrdersController=async(req,res)=>{
    try{
        const orders=await orderModel.find({buyer:req.user._id})
                                     .populate("products","-photo")
                                     .populate("buyer","name")
                                     res.json(orders)
    }catch(error){
        console.log(error)
        res.status(404).send({
            success:false,
            message:"error while getting orders",
            error
        }) 
    }
}


export const getAllOrdersController=async(req,res)=>{
    try{
        const orders=await orderModel.find({})
                                     .populate("products","-photo")
                                     .populate("buyer","name")
                                     .sort({createdAt:-1})
                                     res.json(orders)
    }catch(error){
        console.log(error)
        res.status(404).send({
            success:false,
            message:"error while getting orders",
            error
        }) 
    }
}


export const orderStatusController=async(req,res)=>{
    try{
        const {orderId}=req.params
        const {status}=req.body
        const orders=await orderModel.findByIdAndUpdate(orderId,{status},{new:true})
        res.json(orders)
    }catch(error){
        console.log(error)
        res.status(404).send({
            success:false,
            message:"error while updating orders",
            error
        }) 
    }
}