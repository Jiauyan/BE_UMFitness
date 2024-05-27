const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');

const profileController = require("../controllers/profileController");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/api/v1/uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Define the routes
router.patch("/updateProfile/:uid", profileController.updateProfileHandler);
router.patch("/updateWater/:uid", profileController.updateWaterHandler);
router.post("/uploadProfileImage/:uid", upload.single('profileImage'), profileController.uploadProfileImage);

module.exports = router;