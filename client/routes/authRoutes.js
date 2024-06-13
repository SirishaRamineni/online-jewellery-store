import express from 'express'
import { forgotPasswordController, getAllOrdersController, getOrdersController, loginController, orderStatusController, registerController, updateProfileController } from '../controllers/authController.js'
import { requireSignin,isAdmin } from './../middlewares/authMiddleware.js';

const router=express.Router()

router.post("/register",registerController)

router.post("/login",loginController)

router.post("/forgot-password",forgotPasswordController)

router.post("/update-profile",requireSignin,updateProfileController)

router.get("/user-auth", requireSignin, (req, res) => {
    res.status(200).send({ ok: true });
  });
  //protected Admin route auth

  router.get("/admin-auth", requireSignin, isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
  });


  router.put("/profile", requireSignin, updateProfileController);

  router.get("/orders", requireSignin, getOrdersController);

//all orders
router.get("/all-orders", requireSignin, isAdmin, getAllOrdersController);

// order status update
router.put(
  "/order-status/:orderId",
  requireSignin,
  isAdmin,
  orderStatusController
);

export default router