const authService = require("../services/authService");

const registerAccount = async (req, res, next) => {
    try {
 
      const { email, password } = req.body;
      const account = await authService.registerAccount(
        email,
        password
      );
  
      return res.status(201).json(account);
    } catch (err) {
        return res.status(500).send(`Error while registering Account, Error :${err} `);
    }
};

const loginAccount = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const login = await authService.loginAccount(
      email,
      password
    );
    return res.status(201).json(login);
  } catch (error) {
    console.error('Authentication failed:', error);
    return res.status(401).json({ error: "Authentication failed", details: error.message });
  }
};

const logoutAccount = async (req, res, next) => {
  try {
    const logout = await authService.logoutAccount();
    return res.status(201).json(logout);
  } catch (error){
    console.error('Authentication failed:', error);
    return res.status(401).json({ error: "Authentication failed", details: error.message });
  }
};

const completeProfile = async (req, res) => {
  try {
    const { uid } = req.params;
    const {role, username, gender, age, dateOfBirth, weight, height} = req.body;
    const addUserInfo= await authService.completeProfile(
      uid,
      role,
      age, 
      username,
      gender, 
      dateOfBirth, 
      weight, 
      height
    );
    return res.status(200).json(addUserInfo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const fitnessLevel = async (req, res) => {
  try {
    const { uid } = req.params;
    const {fitnessLevel} = req.body;
    const addFitnessLevel = await authService.fitnessLevel(
      uid,
      fitnessLevel
    );
    return res.status(200).json(addFitnessLevel);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const fitnessGoal = async (req, res) => {
  try {
    const { uid } = req.params;
    const {fitnessGoal} = req.body;
    const addFitnessGoal = await authService.fitnessGoal(
      uid,
      fitnessGoal
    );
    return res.status(200).json(addFitnessGoal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const exerciseType = async (req, res) => {
  try {
    const { uid } = req.params;
    const {exerciseType} = req.body;
    const addExerciseType = await authService.exerciseType(
      uid,
      exerciseType
    );
    return res.status(200).json(addExerciseType);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { uid } = req.params;
    const findUser= await authService.getUserById(uid);
    return res.status(200).json(findUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

  module.exports = {
    registerAccount,
    loginAccount,
    logoutAccount,
    completeProfile,
    fitnessLevel,
    fitnessGoal,
    exerciseType,
    getUserById
  };