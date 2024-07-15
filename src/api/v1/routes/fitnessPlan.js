const express = require("express");
const router = express.Router();

const fitnessPlanController = require("../controllers/fitnessPlanController");


router.post("/addFitnessPlan", fitnessPlanController.addFitnessPlan);
router.patch("/updateFitnessPlan/:id", fitnessPlanController.updateFitnessPlan);
router.get("/getAllFitnessPlanByUid/:uid", fitnessPlanController.getAllFitnessPlanByUid);
router.get("/getFitnessPlanById/:id", fitnessPlanController.getFitnessPlanById);
router.delete("/deleteFitnessPlan/:id", fitnessPlanController.deleteFitnessPlan);

module.exports = router;