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

router.post("/registerAcc", authFirebaseController.registerAccHandler); //Register Account
router.post("/loginAcc", authFirebaseController.loginAccHandler); //Login Account
router.post("/completeProfile/:uid", authFirebaseController.completeProfileHandler);
router.post("/fitnessLevel/:uid", authFirebaseController.fitnessLevelHandler);
router.post("/fitnessGoal/:uid", authFirebaseController.fitnessGoalHandler);
router.post("/favClass/:uid", authFirebaseController.favClassHandler);
router.get("/getUserById/:uid", authFirebaseController.getUserByIdHandler);

module.exports = router;
