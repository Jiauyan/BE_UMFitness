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
      const {uid,title,fitnessLevel, fitnessGoal, typeOfExercise, desc, slots} = req.body;
      const trainingProgramImage = req.file;
      const trainingProgramImageRef = ref(storage, `trainingProgramImages/${trainingProgramImage.filename}`);
      const uploadResult = await trainingProgramsService.uploadTrainingProgramImage(trainingProgramImage);
      const downloadUrl = await getDownloadURL(trainingProgramImageRef);
      
      //const createdAt = format(new Date(), 'MMMM d, yyyy')

      const addNewTrainingProgram= await trainingProgramsService.addTrainingProgram(
        uid,
        title,
        downloadUrl,
        fitnessLevel, 
        fitnessGoal, 
        typeOfExercise,
        desc,
        slots
      );
      return res.status(200).json(addNewTrainingProgram);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  const updateTrainingProgram= async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      let downloadUrl;
  
      if (req.file) {
        const trainingProgramImage = req.file;
        const trainingProgramImageRef = ref(storage, `trainingProgramImages/${trainingProgramImage.filename}`);
        const uploadResult = await trainingProgramsService.uploadTrainingProgramImage(trainingProgramImage);
        downloadUrl = await getDownloadURL(trainingProgramImageRef);
      }
  
      // Include the downloadUrl in updates only if a new image was uploaded
      if (downloadUrl) {
        updates.downloadUrl = downloadUrl;
      }
  
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

  const uploadTrainingProgramImage = async (req, res) => {
    try {
      const trainingProgramImage = req.file;
      const uploadResult = await trainingProgramsService.uploadTrainingProgramImage(trainingProgramImage);
      res.status(200).json({ message: 'Uploaded successfully', data: uploadResult });
  } catch (err) {
      console.error(err); 
      res.status(500).json({ message: "Internal Server Error", error: err.toString() });
  }
  };

  module.exports = {
    getAllTrainingPrograms,
    getAllTrainingProgramsOfUser,
    getTrainingProgramById,
    addTrainingProgram,
    updateTrainingProgram,
    deleteTrainingProgram,
    uploadTrainingProgramImage,
    getRecommendedTrainingPrograms
  };