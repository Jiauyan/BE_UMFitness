const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const trainingProgramsController = require("../controllers/trainingProgramsController");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/api/v1/uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Routing
router.get("/getAllTrainingPrograms", trainingProgramsController.getAllTrainingPrograms);
router.get("/getAllUserTrainingPrograms/:uid", trainingProgramsController.getAllTrainingProgramsOfUser);
router.get("/getTrainingProgramById/:id", trainingProgramsController.getTrainingProgramById);
router.post("/addTrainingProgram",upload.single('trainingProgramImage'), trainingProgramsController.addTrainingProgram);
router.delete("/deleteTrainingProgram/:id", trainingProgramsController.deleteTrainingProgram);
router.patch("/updateTrainingProgram/:id", upload.single('trainingProgramImage'), trainingProgramsController.updateTrainingProgram);
//router.post("/uploadTrainingProgramImage", upload.single('trainingProgramImage'), trainingProgramsController.uploadTrainingProgramImage);

module.exports = router;
