const express = require("express");
const router = express.Router();

const fitnessActivityController = require("../controllers/fitnessActivityController");


router.post("/addFitnessActivity", fitnessActivityController.addFitnessActivity);
router.patch("/updateFitnessActivity/:id", fitnessActivityController.updateFitnessActivity);
router.get('/getAllFitnessActivitiesByUidAndPlanID/:uid/:fitnessPlanID', fitnessActivityController.getAllFitnessActivitiesByUidAndPlanID);
router.get("/getFitnessActivityById/:id", fitnessActivityController.getFitnessActivityById);
router.delete("/deleteFitnessActivity/:id", fitnessActivityController.deleteFitnessActivity);

module.exports = router;