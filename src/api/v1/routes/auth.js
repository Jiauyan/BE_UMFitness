const express = require("express");
const router = express.Router();

//Validation

//Controller
const authFirebaseController = require("../controllers/authController");
//auth

//router.get("/getAccount", authFirebaseController.getAllAccount); //Get All Acc
//router.get("/getToken", authController.authenticateToken); //Get Token Check Exp. Date
//router.post("/refreshToken", authController.refreshToken); //Create New Token (If Old Token Expired)
router.post("/registerAccount", authFirebaseController.registerAccount); //Register Account
router.post("/loginAccount", authFirebaseController.loginAccount); //Login Account
//router.delete("/deleteAccount/:id", authController.deleteAccount); //Delete Account
router.post("/logoutAccount", authFirebaseController.logoutAccount); //Log Out Account
//router.patch("/editAccount/:id", authController.editAccount); //Edit Account
// router.post("/forgotPassword", authController.forgotPassword); //Forgot Password Account
// router.post("/forgotPassword/:id", authController.forgotPassword); //Forgot Password Account
router.post("/completeProfile/:uid", authFirebaseController.completeProfile);
router.post("/fitnessLevel/:uid", authFirebaseController.fitnessLevel);
router.post("/fitnessGoal/:uid", authFirebaseController.fitnessGoal);
router.post("/exerciseType/:uid", authFirebaseController.exerciseType);
router.get("/getUserById/:uid", authFirebaseController.getUserById);

module.exports = router;

