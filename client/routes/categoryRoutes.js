import express from 'express'
import { UpdateCategoryController, categoryController, createCategoryController, deletecategoryController, getSingleCategoryController } from '../controllers/categoryController.js'
import { isAdmin, requireSignin } from './../middlewares/authMiddleware.js';


const router=express.Router()

router.post("/create-category",requireSignin,isAdmin,createCategoryController)

router.put("/update-category/:id",requireSignin,isAdmin,UpdateCategoryController)

router.get("/get-category",categoryController)

router.delete("/delete-category/:id",requireSignin,isAdmin,deletecategoryController)

router.get("/single-category/:slug",getSingleCategoryController)

export default router
