const express = require("express");
const router = express.Router();

const goalsController = require("../controllers/goalsController");


router.get("/getAllGoals", goalsController.getAllGoals);
router.get("/getGoalById/:id", goalsController.getGoalById);
router.post("/addGoal", goalsController.addGoal);
router.delete("/deleteGoal/:id", goalsController.deleteGoal);
router.patch("/updateGoal/:id", goalsController.updateGoal);
//router.patch("/completeGoal/:id", goalsController.completeGoal);

module.exports = router;