const express = require("express");
const router = express.Router();

const stepsController = require("../controllers/stepsController");

router.post('/storeSteps', stepsController.storeStepsCount);
router.get("/getStepCountByUid/:uid", stepsController.getStepsCount);
router.patch("/updateStepGoal/:uid", stepsController.updateStepGoal);
router.get("/getStepGoalByUid/:uid", stepsController.getStepGoal);

module.exports = router;