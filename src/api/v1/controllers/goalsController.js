const goalsService = require("../services/goalsService");


// get all goals
const getAllGoals= async (req, res) => {
    try {
      const findAllGoals= await goalsService.getAllGoals();
      return res.status(200).json(findAllGoals);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

const getGoalById= async (req, res) => {
    try {
      const { id } = req.params;
      const findOneGoal= await goalsService.getGoalById(id);
      return res.status(200).json(findOneGoal);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
};


const addGoal= async (req, res) => {
    try {
      const {title} = req.body;
      const addNewGoal= await goalsService.addGoal(
        title
      );
      return res.status(200).json(addNewGoal);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };


  const updateGoal= async (req, res) => {
    try {
      const { id } = req.params;
      const { title } = req.body;
      const updateGoal= await goalsService.updateGoal(
        id,
        title
      );
      return res.status(200).json(updateGoal);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  const deleteGoal= async (req, res) => {
    try {
      const { id } = req.params;
      const deleteGoal= await goalsService.deleteGoal(id);
      return res.status(200).json(deleteGoal);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  module.exports = {
    getAllGoals,
    getGoalById,
    addGoal,
    updateGoal,
    deleteGoal
  };