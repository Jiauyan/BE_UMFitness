const { 
  authService,
  registerAcc,
  loginAcc,
  completeProfile,
  fitnessLevelService,
  fitnessGoalService,
  favClassService,
  getUserByIdService,
  registerAccount, 
  saveUserDetails, 
  getUserDetails, 
  loginAccount, 
  logoutAccount, 
  forgotPassword 
} = require("../services/authService");

const registerAccountHandler = async (req, res, next) => {
    try {
        const { email, password, username, role, name, gender, dateOfBirth, height, weight, fitnessLevel, favClass, fitnessGoal } = req.body;

        // Register account with Firebase Authentication
        const account = await registerAccount(email, password);

        // Parse height and weight as integers
        const parsedHeight = parseInt(height, 10);
        const parsedWeight = parseInt(weight, 10);

         // Prepare user details
        const userDetails = {
            username,
            role,
            name,
            gender,
            dateOfBirth,
            height: parsedHeight,
            weight: parsedWeight,
            fitnessLevel,
            favClass: Array.isArray(favClass) ? favClass : favClass.split(',').map(item => item.trim()),
            fitnessGoal
        };

        // Save additional details to Firestore
        await saveUserDetails(account.uid, userDetails);

        // Fetch the saved user details from Firestore
        const savedUserDetails = await getUserDetails(account.uid);

        return res.status(201).json({ message: 'Account created successfully', account, userDetails: savedUserDetails });
    } catch (err) {
        return res.status(500).send(`Error while registering account, Error: ${err}`);
    }
};

const loginAccountHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const login = await loginAccount(email,password);

    // Fetch the saved user details from Firestore
    const savedUserDetails = await getUserDetails(login.uid);

    return res.status(201).json({ message: 'Account created successfully', login, userDetails: savedUserDetails });
  } catch (error) {
    console.error('Authentication failed:', error);
    return res.status(401).json({ error: "Authentication failed", details: error.message });
  }
};

const logoutAccountHandler = async (req, res, next) => {
  try {
    const logout = await logoutAccount();
    return res.status(201).json(logout);
  } catch (error){
    console.error('Authentication failed:', error);
    return res.status(401).json({ error: "Authentication failed", details: error.message });
  }
};

const forgotPasswordHandler = async(req, res, next) => {
     try {
        const { email } = req.body;
        const result = await forgotPassword(email);
        return res.status(201).json(result);
      } catch (error){
        console.error('Sending password reset email failed:', error);
        return res.status(401).json({ error: "Sending password reset email failed", details: error.message });
      }
}

const registerAccHandler = async (req, res, next) => {
  try {

    const { email, password } = req.body;
    const account = await registerAcc(
      email,
      password
    );

    return res.status(201).json(account);
  } catch (err) {
      return res.status(500).send(`Error while registering Account, Error :${err} `);
  }
};

const loginAccHandler = async (req, res, next) => {
try {
  const { email, password } = req.body;
  const login = await loginAcc(
    email,
    password
  );
  return res.status(201).json(login);
} catch (error) {
  console.error('Authentication failed:', error);
  return res.status(401).json({ error: "Authentication failed", details: error.message });
}
};

const completeProfileHandler = async (req, res) => {
  try {
    const { uid } = req.params;
    const {role, name, username, age, gender, dateOfBirth, weight, height} = req.body;
    const addUserInfo= await completeProfile(
      uid,
      role,
      name,
      username,
      age,
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

const fitnessLevelHandler = async (req, res) => {
  try {
    const { uid } = req.params;
    const {fitnessLevel} = req.body;
    const addFitnessLevel = await fitnessLevelService(
      uid,
      fitnessLevel
    );
    return res.status(200).json(addFitnessLevel);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const fitnessGoalHandler = async (req, res) => {
  try {
    const { uid } = req.params;
    const {fitnessGoal} = req.body;
    const addFitnessGoal = await fitnessGoalService(
      uid,
      fitnessGoal
    );
    return res.status(200).json(addFitnessGoal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const favClassHandler = async (req, res) => {
  try {
    const { uid } = req.params;
    const {favClass} = req.body;
    const addFavClass = await favClassService(
      uid,
      favClass
    );
    return res.status(200).json(addFavClass);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getUserByIdHandler = async (req, res) => {
  try {
    const { uid } = req.params;
    const findUser= await getUserByIdService(uid);
    return res.status(200).json(findUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};



  module.exports = {
    registerAccountHandler,
    loginAccountHandler,
    logoutAccountHandler,
    forgotPasswordHandler,
    registerAccHandler,
    loginAccHandler,
    completeProfileHandler,
    fitnessLevelHandler,
    fitnessGoalHandler,
    favClassHandler,
    getUserByIdHandler
  };