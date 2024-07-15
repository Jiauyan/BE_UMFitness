const fitnessActivityService = require("../services/fitnessActivityService");

// Add fitness activity
const addFitnessActivity = async (req, res) => {
  try {
      const { uid, task, duration, fitnessPlanID } = req.body;
      const status = false;

      const addNewFitnessActivity = await fitnessActivityService.addFitnessActivity(
          uid,
          task,
          duration,
          status,
          fitnessPlanID
      );

      return res.status(200).json(addNewFitnessActivity);
  } catch (err) {
      res.status(400).json({ message: err.message });
  }
};

// Edit fitness activity
const updateFitnessActivity = async (req, res) => {
  try {
      const { id } = req.params;
      const { uid, task, duration, fitnessPlanID, status, createdAt } = req.body;

      const updateFitnessActivity = await fitnessActivityService.updateFitnessActivity(
          id,
          uid,
          task,
          duration,
          status,
          fitnessPlanID,
          createdAt
      );

      return res.status(200).json(updateFitnessActivity);
  } catch (err) {
      res.status(400).json({ message: err.message });
  }
};

// get all fitness plans by uid and fitnessPlanID
const getAllFitnessActivitiesByUidAndPlanID = async (req, res) => {
  try {
    const { uid, fitnessPlanID } = req.params;
    const allFitnessActivities = await fitnessActivityService.getFitnessActivityByUidAndPlanID(uid, fitnessPlanID);
    return res.status(200).json(allFitnessActivities);
  } catch (err) {
    console.error('Error fetching user fitness activities:', err);
    return res.status(400).json({ message: err.message });
  }
};

// get fitness plan by id
const getFitnessActivityById= async (req, res) => {
    try {
      const { id } = req.params;
      const findOneFitnessActivity = await fitnessActivityService.getFitnessActivityById(id);
      return res.status(200).json(findOneFitnessActivity);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
};

// delete fitness plan
const deleteFitnessActivity = async (req, res) => {
    try {
      const { id } = req.params;
      const deleteFitnessActivity = await fitnessActivityService.deleteFitnessActivity(id);
      return res.status(200).json(deleteFitnessActivity);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
};

module.exports = {
    addFitnessActivity,
    updateFitnessActivity,
    getAllFitnessActivitiesByUidAndPlanID,
    getFitnessActivityById,
    deleteFitnessActivity
};