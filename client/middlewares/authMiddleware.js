import userModel from "../models/userModel.js";
import JWT from 'jsonwebtoken'

export const requireSignin=async(req,res,next)=>{
    try{
        const decode= JWT.verify(req.headers.authorization,process.env.JWT_SECRET)
        req.user=decode
        next()
    }catch(error){
        console.log(error)
    }


}

export const isAdmin=async(req,res,next)=>{
    try{
        const user=await userModel.findById(req.user._id)
        if(user.role!==1){
            res.status(200).send({
                success:true,
                message: "unAuthorised access",
                   
               })
            }else{
                next()
            }
        }catch(error){
            console.log(error);
            res.status(500).send({
              success: false,
              error,
              message: "error in admin middleware"
            });  
    }
}