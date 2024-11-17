const express = require("express");
const router = express.Router();
const tipsController = require("../controllers/tipsController");

// Routing
router.get("/getAllTips", tipsController.getAllTips);
router.get("/getAllUserTips/:uid", tipsController.getAllTipsOfUser);
router.get("/getTipById/:id", tipsController.getTipById);
router.post("/addTip", tipsController.addTip);
router.delete("/deleteTip/:id", tipsController.deleteTip);
router.patch("/updateTip/:id", tipsController.updateTip);

module.exports = router;
