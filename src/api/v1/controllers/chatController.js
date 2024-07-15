const chatService = require('../services/chatService');

const getAllUsers = async (req, res) => {
    try {
      const users = await chatService.getAllUsersWithInfo(); // Call user service function
      res.status(200).json(users); // Send JSON response with all users
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getAllUsers
};
