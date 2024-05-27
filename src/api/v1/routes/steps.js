const express = require("express");
const router = express.Router();

const stepsController = require("../controllers/stepsController");

router.post('/storeSteps', stepsController.storeStepsCount);

module.exports = router;