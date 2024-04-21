const express = require("express");
const router = express.Router();

//Validation

//Controller
const authFirebaseController = require("../controllers/authController");
//auth

router.get("/getAccount", authFirebaseController.getAllAccount); //Get All Acc
//router.get("/getToken", authController.authenticateToken); //Get Token Check Exp. Date
//router.post("/refreshToken", authController.refreshToken); //Create New Token (If Old Token Expired)
router.post("/registerAccount", authFirebaseController.registerAccount); //Register Account
router.post("/loginAccount", authFirebaseController.loginAccount); //Login Account
//router.delete("/deleteAccount/:id", authController.deleteAccount); //Delete Account
router.delete("/logoutAccount", authFirebaseController.logoutAccount); //Log Out Account
//router.patch("/editAccount/:id", authController.editAccount); //Edit Account
// router.post("/forgotPassword", authController.forgotPassword); //Forgot Password Account
// router.post("/forgotPassword/:id", authController.forgotPassword); //Forgot Password Account

module.exports = router;
