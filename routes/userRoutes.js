const express = require("express");
const userController = require("../controllers/useController");
const authController = require("../controllers/authController");

const router = express.Router();
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgotpassword", authController.forgotPassword);
router.patch("/resetpassword/:token", authController.resetPassword);
router.delete("/deleteme", authController.protect, userController.deleteMe);
router.post(
  "/changepassword",
  authController.protect,
  authController.changePassword
);
router.post("/updateme", authController.protect, userController.updateMe);
router
  .route("/")
  .get(userController.getAllUser)
  .post(userController.createUser);

module.exports = router;
