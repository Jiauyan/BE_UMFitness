const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");

// Define the routes
router.patch("/updateProfile/:uid", profileController.updateProfileHandler);
router.patch("/updateWater/:uid", profileController.updateWaterHandler);
router.patch("/updateSleep/:uid", profileController.updateSleepHandler);
router.post("/uploadProfileImage/:uid", profileController.uploadProfileImage);
router.patch("/updateCurrentMotivationalQuote/:uid", profileController.updateCurrentMotivationalQuote);

module.exports = router;