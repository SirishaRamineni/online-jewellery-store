import CategoryModel from "../models/CategoryModel.js";
import productModel from "../models/productModel.js";
import orderModel from "../models/orderModel.js"
import slugify from "slugify";
import fs from 'fs'
import braintree from "braintree";
import dotenv from 'dotenv'

dotenv.config()

var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const createProductController = async (req, res) => {
  try {
    const {  description, price, category, quantity, name} =
      req.fields;
    const { photo } = req.files;
    //alidation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const products = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in crearing product",
    });
  }
};


export const getProductController=async(req,res)=>{
    try{
        const products=await productModel.find({})
                                          .sort({createdAt:-1})
                                          .populate("category")
                                          .limit(12)
                                          .select("-photo")
                                          res.status(201).send({
                                            success:true,
                                            message:"Products fetched successfully",
                                            products
                                        })
                                   
        }catch(error){
            console.log(error)
            res.status(500).send({
               success:false,
               message:"error in fetching products",
                error
             })
     } 
    }

export const productPhotoController=async(req,res)=>{
      try{
        const product=await productModel.findById(req.params.pid).select("photo")
        if (product.photo.data) {
            res.set("Content-type", product.photo.contentType);
            return res.status(200).send(product.photo.data);
          }

}catch(error){
console.log(error)
res.status(500).send({
success:false,
message:"error in getting photo",
error
})
    }
    }

export const getSingleProductController=async(req,res)=>{
  try{
    const product=await productModel.findOne({slug:req.params.slug})
                                    .select("-photo")
                                    .populate("category")

     res.status(201).send({
                success:true,
                message:"Product fetched successfully",
                product
                  })
                               
         }catch(error){
              console.log(error)
              res.status(500).send({
                success:false,
                 message:"error in creatng product",
                   error
                  })
            }
  }

  export const deleteProductController=async(req,res)=>{
    try{
        const product=await productModel.findByIdAndDelete(req.params.pId).select("-photo")
        res.status(201).send({
            success:true,
            message:"Product deleted successfully",
            product
              })
                           
     }catch(error){
          console.log(error)
          res.status(500).send({
            success:false,
             message:"error in deleting product",
               error
              })
        }
    
    }
  

    export const updateProductController=async(req,res)=>{
        try{
            const {name,description,price,quantity,shipping,category}=req.fields
            const {photo}=req.files
            switch(true){
                case !name:
                  return res.status(500).send({error:"name is required"})
                case !description:
                    return res.status(500).send({error:"description is required" })
                case !price:
                        return res.status(500).send({error:"price is required"})
                case !quantity:
                          return res.status(500).send({error:"quantity is required" })
                case !shipping:
                            return res.status(500).send({error:"shipping is required"})
                case !category:
                              return res.status(500).send({error:"category is required" })
                case photo && photo.size>1000000:
                                return res.status(500).send({error:"photo is required and should be less than 1mb" })
           }

           const products=await productModel.findByIdAndUpdate(req.params.pid,{...req.fields,slug:slugify(name)},{new:true})
           if(photo){
            products.photo.data=fs.readFileSync()
            products.photo.contentType=photo.type
           }
           await products.save()
           res.status(201).send({
            success:true,
            message:"Product in updating successfully",
            products
              })
                           
     }catch(error){
          console.log(error)
          res.status(500).send({
            success:false,
             message:"error in updating product",
               error
              })
        }
        }

    export const productFiltersController=async(req,res)=>{
        try{
            const {checked,radio}=req.body
            let args={}
            if(checked.length>0) args.category=checked
            if(radio.length) args.price={$gte:radio[0],$lte:radio[1]}
            const products=await productModel.find(args)
            res.status(201).send({
                success:true,
               
                products
                  })
                               
         }catch(error){
              console.log(error)
              res.status(500).send({
                success:false,
                 message:"error in fetching product",
                   error
                  })
            }
    }

    export const productCountController=async(req,res)=>{
        try{
            const total=await productModel.find({}).estimatedDocumentCount()
            res.status(201).send({
                success:true,
                 total
                  })
                               
         }catch(error){
              console.log(error)
              res.status(500).send({
                success:false,
                 message:"error in fetching product",
                   error
                  })
            }
        }

    export const productListController=async(req,res)=>{
        try{
            const perPage=6
            const page=req.params.page ? req.params.page : undefined
            const products=await productModel.find({})
                                              .skip((page-1)*perPage)
                                              .limit(perPage)
                                              .select("-photo")
                                              .sort({createdAt:-1})

            res.status(201).send({
              success:true,
               products
               })
                                                               
         }catch(error){
            console.log(error)
             res.status(500).send({
              success:false,
               message:"error in per page control",
                 error
                   })
                   }
    }

    export const searchProductController=async(req,res)=>{
        try{
            const {keyword}=req.params
            const results=await productModel.find({
                $or:[
                    {name:{$regex:keyword,$options:"i"}},
                    {description:{$regex:keyword,$options:"i"}}
                ]
            })
            .select("-photo")
            res.json(results)
        }catch(error){
            console.log(error)
             res.status(500).send({
              success:false,
               message:"error in searching product",
                 error
                   })
                   }
    }


    export const relatedProductController=async(req,res)=>{
        try{
            const {pid,cid}=req.params
            const products=await productModel.find({category:cid,
                                                     _id:{$ne:pid}
            })
                                             .select("-photo")
                                             .limit(3)
                                             .populate("category")

            res.status(201).send({
                                success:true,
                                products
                                })
        }catch(error){
            console.log(error)
            res.status(500).send({
                success:false,
                 message:"error while getting related product",
                   error
                     })
                     }
        }

    export const productCategoryController=async(req,res)=>{
        try{
            const category=await CategoryModel.find({slug:req.params.slug})
            const products=await productModel.find({category}).populate("category")
        
            res.status(201).send({
                success:true,
                category,
                products
                })
}catch(error){
console.log(error)
res.status(500).send({
success:false,
 message:"error while getting  products",
   error
     })
     }
        }
        
    //payment gateway api
//token
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//payment
export const brainTreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
