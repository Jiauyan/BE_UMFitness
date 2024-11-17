const express = require("express");
const router = express.Router();
const trainingProgramsController = require("../controllers/trainingProgramsController");

// Routing
router.get("/getAllTrainingPrograms", trainingProgramsController.getAllTrainingPrograms);
router.get("/getAllUserTrainingPrograms/:uid", trainingProgramsController.getAllTrainingProgramsOfUser);
router.get("/getTrainingProgramById/:id", trainingProgramsController.getTrainingProgramById);
router.post("/addTrainingProgram",trainingProgramsController.addTrainingProgram);
router.delete("/deleteTrainingProgram/:id", trainingProgramsController.deleteTrainingProgram);
router.patch("/updateTrainingProgram/:id",trainingProgramsController.updateTrainingProgram);
router.post("/getRecommendedTrainingPrograms", trainingProgramsController.getRecommendedTrainingPrograms);
router.post("/getStudentBySlot", trainingProgramsController.getStudentBySlot);
router.post("/deleteSlot", trainingProgramsController.deleteSlot);

module.exports = router;
