const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const tipsController = require("../controllers/tipsController");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/api/v1/uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: multer.memoryStorage() });

// Routing
router.get("/getAllTips", tipsController.getAllTips);
router.get("/getAllUserTips/:uid", tipsController.getAllTipsOfUser);
router.get("/getTipById/:id", tipsController.getTipById);
router.post("/addTip",upload.single('tipImage'), tipsController.addTip);
router.delete("/deleteTip/:id", tipsController.deleteTip);
router.patch("/updateTip/:id", upload.single('tipImage'), tipsController.updateTip);
//router.post("/uploadTipImage", upload.single('tipImage'), tipsController.uploadTipImage);

module.exports = router;
