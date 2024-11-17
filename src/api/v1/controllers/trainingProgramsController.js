const trainingProgramsService = require("../services/trainingProgramsService");
const { db, storage } = require('../../../configs/firebaseDB');
const { ref, getDownloadURL } = require("firebase/storage");
const { format } = require('date-fns');

// get all trainingPrograms
const getAllTrainingPrograms= async (req, res) => {
    try {
      const findAllTrainingPrograms= await trainingProgramsService.getAllTrainingPrograms();
      return res.status(200).json(findAllTrainingPrograms);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

const getAllTrainingProgramsOfUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const allUserTrainingPrograms = await trainingProgramsService.getAllUserTrainingPrograms(uid);
    return res.status(200).json(allUserTrainingPrograms);
  } catch (err) {
    console.error('Error fetching user trainingPrograms:', err);
    return res.status(400).json({ message: err.message });
  }
};

const getRecommendedTrainingPrograms = async (req, res) => {
  try {
    const { fitnessLevel, fitnessGoal, favClass } = req.body;

    const recommendedTrainingPrograms = await trainingProgramsService.getRecommendedTrainingPrograms(fitnessLevel, fitnessGoal, favClass);
    return res.status(200).json(recommendedTrainingPrograms);
  } catch (err) {
    console.error('Error fetching recommended training programs:', err);
    return res.status(500).json({ message: err.message });
  }
};

const getTrainingProgramById= async (req, res) => {
    try {
      const { id } = req.params;
      const findOneTrainingProgram= await trainingProgramsService.getTrainingProgramById(id);
      return res.status(200).json(findOneTrainingProgram);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
};


const addTrainingProgram= async (req, res) => {
    try {
      const {
        uid,
        contactNum,
        title,
        typeOfTrainingProgram,
        capacity,
        feeType,
        feeAmount,
        venueType,
        venue,
        fitnessLevel, 
        fitnessGoal, 
        typeOfExercise, 
        desc, 
        slots,
        downloadUrl
      } = req.body;
      const addNewTrainingProgram= await trainingProgramsService.addTrainingProgram(
        uid,
        contactNum,
        title,
        typeOfTrainingProgram,
        capacity,
        feeType,
        feeAmount,
        venueType,
        venue,
        fitnessLevel, 
        fitnessGoal, 
        typeOfExercise,
        desc,
        slots,
        downloadUrl,
      );
      return res.status(200).json(addNewTrainingProgram);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  const updateTrainingProgram= async (req, res) => {
    try {
      const { id } = req.params;
      const {updates} = req.body;
      const updatedTrainingProgram = await trainingProgramsService.updateTrainingProgram(id, updates);
      return res.status(200).json(updatedTrainingProgram);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  const deleteTrainingProgram= async (req, res) => {
    try {
      const { id } = req.params;
      const deleteTrainingProgram= await trainingProgramsService.deleteTrainingProgram(id);
      return res.status(200).json(deleteTrainingProgram);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  const getStudentBySlot= async (req, res) => {
    try {
      //const { id } = req.params;
      const {id, slot} = req.body;
      const findStudents = await trainingProgramsService.getStudentBySlot(id, slot);
      return res.status(200).json(findStudents);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  const deleteSlot = async (req, res) => {
    try {
      const {id, slotToDelete} = req.body;
      const deleteSlot = await trainingProgramsService.deleteSlot(id, slotToDelete);
      return res.status(200).json(deleteSlot);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  module.exports = {
    getAllTrainingPrograms,
    getAllTrainingProgramsOfUser,
    getTrainingProgramById,
    addTrainingProgram,
    updateTrainingProgram,
    deleteTrainingProgram,
    getRecommendedTrainingPrograms,
    getStudentBySlot,
    deleteSlot
  };