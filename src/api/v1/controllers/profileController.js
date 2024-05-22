const profileService = require("../services/profileService");

const updateProfileHandler = async (req, res) => {
    try {
      const { uid } = req.params;
      const { username, name, gender, dateOfBirth, height, weight, photoURL } = req.body;
      const updates = req.body;

       // Log the received data for debugging
       console.log('Received data for update:', updates);
       const updateProfile = await profileService.updateProfile(uid, updates);

      return res.status(201).json(updateProfile);
    } catch (err) {
      console.error('Error in updateProfileHandler:', err);
      res.status(500).json({ message: err.message });
    }
};

const updateWaterHandler = async (req, res) => {
    try {
      const { uid } = req.params;
      const { currentHydration } = req.body;

       // Log the received data for debugging
      console.log('Received data for water update:', { uid, currentHydration });

      const updateWater = await profileService.updateWater(uid, currentHydration);

      return res.status(201).json(updateWater);
    } catch (err) {
      console.error('Error in updateWaterHandler:', err);
      res.status(500).json({ message: err.message });
    }
};

module.exports = {
    updateProfileHandler,
    updateWaterHandler
}