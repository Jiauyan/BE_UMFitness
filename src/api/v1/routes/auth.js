const express = require("express");
const router = express.Router();

//Validation

//Controller
const authFirebaseController = require("../controllers/authController");
//auth

//router.get("/getAccount", authFirebaseController.getAllAccount); //Get All Acc
//router.get("/getToken", authController.authenticateToken); //Get Token Check Exp. Date
//router.post("/refreshToken", authController.refreshToken); //Create New Token (If Old Token Expired)
router.post("/registerAccount", authFirebaseController.registerAccountHandler); //Register Account
router.post("/loginAccount", authFirebaseController.loginAccountHandler ); //Login Account
//router.delete("/deleteAccount/:id", authController.deleteAccount); //Delete Account
router.post("/logoutAccount", authFirebaseController.logoutAccountHandler); //Log Out Account
//router.patch("/editAccount/:id", authController.editAccount); //Edit Account
router.post("/forgotPassword", authFirebaseController.forgotPasswordHandler); //Forgot Password Account
// router.post("/forgotPassword/:id", authController.forgotPassword); //Forgot Password Account

module.exports = router;
