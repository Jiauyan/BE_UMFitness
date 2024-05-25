const express = require("express");
const router = express.Router();

const tipsController = require("../controllers/tipsController");

//router.patch("//:uid", tipsController);
//router.patch("/", tipsController);
router.get("/getAllTips", tipsController.getAllTips);
router.get("/getAllUserTips/:uid", tipsController.getAllTipsOfUser);
router.get("/getTipById/:id", tipsController.getTipById);
router.post("/addTip", tipsController.addTip);
router.delete("/deleteTip/:id", tipsController.deleteTip);
router.patch("/updateTip/:id", tipsController.updateTip);
//router.patch("/completeGoal/:id", goalsController.completeGoal);

module.exports = router;