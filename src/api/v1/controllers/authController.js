const { authService, registerAccount, saveUserDetails, getUserDetails, loginAccount, logoutAccount, forgotPassword } = require("../services/authService");

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

  module.exports = {
    registerAccountHandler,
    loginAccountHandler,
    logoutAccountHandler,
    forgotPasswordHandler
  };