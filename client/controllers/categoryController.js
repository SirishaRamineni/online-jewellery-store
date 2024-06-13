import CategoryModel from "../models/CategoryModel.js";
import slugify from 'slugify'
export const createCategoryController=async(req,res)=>{
    try{
        const {name}=req.body
        if(!name){
            return res.status(400).send({message:"category name is required"})
        }
        const existingCategory=await CategoryModel.findOne({name})
        if(existingCategory){
            return res.status(200).send({
                success:false,
                message:"user already exists"
            })
        }

      const category=await new CategoryModel({
        name,
        slug:slugify(name)
      }).save()
      res.status(201).send({
        success:true,
        message: "new category created",
        category,
       })
      
     }catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          error,
          message: "Error in creating Category",
        });
      }
}

export const UpdateCategoryController=async(req,res)=>{
    try{
        const {name}=req.body
        const {id}=req.params
        const category=await CategoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true})
        res.status(201).send({
            success:true,
            message: "category updated successfully",
            category,
           })
     }catch(error){
        console.log(error);
        res.status(500).send({
          success: false,
          error,
          message: "Error in updating Category",
        });
     }
}

export const categoryController=async(req,res)=>{
    try{
       const category=await CategoryModel.find({})
       res.status(200).send({
        success:true,
        message: "category found successfully",
            category,
       })
    }catch(error){
        console.log(error);
        res.status(500).send({
          success: false,
          error,
          message: "category while getting categories"
        });
     }
}


export const getSingleCategoryController=async(req,res)=>{
    try{
        const category=await  CategoryModel.find({slug:req.params.slug})
        res.status(200).send({
            success: true,
            message: "Get SIngle Category SUccessfully",
            category,
          });
        } catch (error) {
          console.log(error);
          res.status(500).send({
            success: false,
            error,
            message: "Error While getting Single Category",
          });
        }
    }

    export const deletecategoryController=async(req,res)=>{
        try{
            const {id}=req.params
            await CategoryModel.findByIdAndDelete(id)
            res.status(200).send({
                success: true,
                message: "Categry Deleted Successfully",
              });
            } catch (error) {
              console.log(error);
              res.status(500).send({
                success: false,
                message: "error while deleting category",
                error,
              });
        }
    }
