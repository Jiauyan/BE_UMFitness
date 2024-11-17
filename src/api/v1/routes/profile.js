const express = require("express");
const router = express.Router();
const multer = require('multer');
const profileController = require("../controllers/profileController");

const upload = multer({ storage: multer.memoryStorage() });

// Define the routes
router.patch("/updateProfile/:uid", profileController.updateProfileHandler);
router.patch("/updateWater/:uid", profileController.updateWaterHandler);
router.patch("/updateSleep/:uid", profileController.updateSleepHandler);
router.post("/uploadProfileImage/:uid", upload.single('profileImage'), profileController.uploadProfileImage);
router.patch("/updateCurrentMotivationalQuote/:uid", profileController.updateCurrentMotivationalQuote);

module.exports = router;