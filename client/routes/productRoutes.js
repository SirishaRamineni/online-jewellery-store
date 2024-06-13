import express from 'express'
import { isAdmin, requireSignin } from './../middlewares/authMiddleware.js';
import { brainTreePaymentController, braintreeTokenController, createProductController, deleteProductController, getProductController, getSingleProductController, productCategoryController, productCountController, productFiltersController, productListController, productPhotoController, relatedProductController, searchProductController, updateProductController } from '../controllers/productController.js';
import formidable from 'express-formidable'

const router=express.Router()

router.post("/create-product",requireSignin,isAdmin,formidable(),createProductController)

router.get("/get-product",getProductController)

router.get("/get-product/:slug",getSingleProductController)

router.delete("/delete-product/pid",requireSignin,isAdmin,deleteProductController)

router.post("/update-product/:pid",requireSignin,isAdmin,formidable(),updateProductController)

router.get("/product-photo/:pid", productPhotoController);

router.post("/product-filters",productFiltersController)

router.get("/product-count",productCountController)

router.get("/product-list/:page",productListController)

router.get("/search/:keyword",searchProductController)

router.get("/related-product/:pid/:cid",relatedProductController)

router.get("/product-category/:slug",productCategoryController)

//payments routes
//token
router.get("/braintree/token", braintreeTokenController);

//payments
router.post("/braintree/payment",requireSignin, brainTreePaymentController);


export default router






