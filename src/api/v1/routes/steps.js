const express = require("express");
const router = express.Router();

const stepsController = require("../controllers/stepsController");

router.post('/storeSteps', stepsController.storeStepsCount);
router.get("/getStepCountByUid/:uid", stepsController.getStepsCount);

module.exports = router;