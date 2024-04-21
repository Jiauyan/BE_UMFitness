// const { validateUser } = require("../validations/authValidation");
const authService = require("../services/authService");
// const authServiceLogin = require('../../../configs/firebaseDB'); 

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
    //const { email, password } = req.body;
    const logout = await authService.logoutAccount(
      //email,
      //password
    );
    return res.status(201).json(logout);
  } catch (error){
    console.error('Authentication failed:', error);
    return res.status(401).json({ error: "Authentication failed", details: error.message });
  }
};

  
// get all account
const getAllAccount = async (req, res) => {
    try {
      const findUserAll = await authService.getAllAccount();
      res.status(200).json(findUserAll);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  module.exports = {
    getAllAccount,
    registerAccount,
    loginAccount,
    logoutAccount
  };