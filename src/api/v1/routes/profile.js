const express = require("express");
const router = express.Router();

const profileController = require("../controllers/profileController");

router.patch("/updateProfile/:uid", profileController.updateProfileHandler);
router.patch("/updateWater/:uid", profileController.updateWaterHandler);

module.exports = router;