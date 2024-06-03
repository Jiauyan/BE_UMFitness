const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authFirebaseController = require("../controllers/authController");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/api/v1/uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

//router.get("/getAccount", authFirebaseController.getAllAccount); //Get All Acc
//router.get("/getToken", authController.authenticateToken); //Get Token Check Exp. Date
//router.post("/refreshToken", authController.refreshToken); //Create New Token (If Old Token Expired)
router.post("/registerAccount", authFirebaseController.registerAccountHandler); //Register Account
router.post("/loginAccount", authFirebaseController.loginAccountHandler ); //Login Account
router.delete("/deleteAccount/:uid", authFirebaseController.deleteAccountHandler); //Delete Account
router.post("/logoutAccount", authFirebaseController.logoutAccountHandler); //Log Out Account
//router.patch("/editAccount/:id", authController.editAccount); //Edit Account
router.post("/forgotPassword", authFirebaseController.forgotPasswordHandler); //Forgot Password Account
// router.post("/forgotPassword/:id", authController.forgotPassword); //Forgot Password Account

router.post("/registerAcc", upload.single('profileImage'), authFirebaseController.registerAccHandler); //Register Account
router.post("/loginAcc", authFirebaseController.loginAccHandler); 
router.post("/signInWithGoogle", authFirebaseController.signInWithGoogle); 
router.post("/completeProfile/:uid", authFirebaseController.completeProfileHandler);
router.post("/fitnessLevel/:uid", authFirebaseController.fitnessLevelHandler);
router.post("/fitnessGoal/:uid", authFirebaseController.fitnessGoalHandler);
router.post("/favClass/:uid", authFirebaseController.favClassHandler);
router.get("/getUserById/:uid", authFirebaseController.getUserByIdHandler);

module.exports = router;
