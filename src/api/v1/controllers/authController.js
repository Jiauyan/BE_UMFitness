const authService = require("../services/authService");

const registerAccount = async (req, res, next) => {
    try {
 
      const { email, password } = req.body;
      const account = await authService.registerAccount(
        //username,
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

  module.exports = {
    registerAccount,
    loginAccount,
    logoutAccount
  };