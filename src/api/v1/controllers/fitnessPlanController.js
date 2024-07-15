const fitnessPlanService = require("../services/fitnessPlanService");

// add fitness plan - title & date
const addFitnessPlan = async (req, res) => {
    try {
        const { uid, title, date } = req.body;

      
        const completeCount = 0;
        const totalCount = 0;

        const addNewFitnessPlan = await fitnessPlanService.createFitnessPlan(
            uid,
            title,
            date,
            completeCount,
            totalCount
        );

        return res.status(200).json(addNewFitnessPlan);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// edit fitness plan
const updateFitnessPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const { uid, title, date, completeCount, totalCount, createdAt } = req.body;
        const updateFitnessPlan = await fitnessPlanService.updateFitnessPlan(
            id,
            uid,
            title,
            date,
            completeCount,
            totalCount,
            createdAt
        );
        return res.status(200).json(updateFitnessPlan);
    }catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// get all fitness plans by uid
const getAllFitnessPlanByUid = async (req, res) => {
    try {
      const { uid } = req.params;
      const allFitnessPlansByUid = await fitnessPlanService.getFitnessPlanByUid(uid);
      return res.status(200).json(allFitnessPlansByUid);
    } catch (err) {
      console.error('Error fetching user fitness plans:', err);
      return res.status(400).json({ message: err.message });
    }
};

// get fitness plan by id
const getFitnessPlanById= async (req, res) => {
    try {
      const { id } = req.params;
      const findOneFitnessPlan= await fitnessPlanService.getFitnessPlanById(id);
      return res.status(200).json(findOneFitnessPlan);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
};

// delete fitness plan
const deleteFitnessPlan = async (req, res) => {
    try {
      const { id } = req.params;
      const deleteFitnessPlan= await fitnessPlanService.deleteFitnessPlan(id);
      return res.status(200).json(deleteFitnessPlan);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
};

module.exports = {
    addFitnessPlan,
    updateFitnessPlan,
    getAllFitnessPlanByUid,
    getFitnessPlanById,
    deleteFitnessPlan
};

