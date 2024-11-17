const express = require("express");
const router = express.Router();
const multer = require('multer');
const trainingProgramsController = require("../controllers/trainingProgramsController");

const upload = multer({ storage: multer.memoryStorage() });

// Routing
router.get("/getAllTrainingPrograms", trainingProgramsController.getAllTrainingPrograms);
router.get("/getAllUserTrainingPrograms/:uid", trainingProgramsController.getAllTrainingProgramsOfUser);
router.get("/getTrainingProgramById/:id", trainingProgramsController.getTrainingProgramById);
router.post("/addTrainingProgram",upload.single('trainingProgramImage'), trainingProgramsController.addTrainingProgram);
router.delete("/deleteTrainingProgram/:id", trainingProgramsController.deleteTrainingProgram);
router.patch("/updateTrainingProgram/:id", upload.single('trainingProgramImage'), trainingProgramsController.updateTrainingProgram);
router.post("/getRecommendedTrainingPrograms", trainingProgramsController.getRecommendedTrainingPrograms);
router.post("/getStudentBySlot", trainingProgramsController.getStudentBySlot);
router.post("/deleteSlot", trainingProgramsController.deleteSlot);

module.exports = router;
