const express = require("express");
const router = express.Router();
const multer = require('multer');
const tipsController = require("../controllers/tipsController");

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Routing
router.get("/getAllTips", tipsController.getAllTips);
router.get("/getAllUserTips/:uid", tipsController.getAllTipsOfUser);
router.get("/getTipById/:id", tipsController.getTipById);
router.post("/addTip",upload.single('tipImage'), tipsController.addTip);
router.delete("/deleteTip/:id", tipsController.deleteTip);
router.patch("/updateTip/:id", upload.single('tipImage'), tipsController.updateTip);

module.exports = router;
