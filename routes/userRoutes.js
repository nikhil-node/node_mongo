const express = require("express");

const userController = require("../controllers/useController");
const authController = require("../controllers/authController");

const router = express.Router();
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgotpassword", authController.forgotPassword);
router.patch("/resetpassword/:token", authController.resetPassword);

router.use(authController.protect); // Below all route will pass through protect middleware

router.delete("/deleteme", userController.deleteMe);
router.post("/changepassword", authController.changePassword);
router.post(
  "/updateme",
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.get("/me", userController.getMe, userController.getUser);

router.use(authController.restrictTo("admin"));
router
  .route("/")
  .get(userController.getAllUser)
  .post(userController.createUser);

module.exports = router;
