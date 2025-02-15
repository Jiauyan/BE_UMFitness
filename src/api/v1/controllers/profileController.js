const profileService = require("../services/profileService");
const { db, storage } = require('../../../configs/firebaseDB');
const { doc, updateDoc } = require("firebase/firestore");
const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const fs = require('fs');

const updateProfileHandler = async (req, res) => {
    try {
      const { uid } = req.params;
      const { username, gender, age, height, weight, photoURL, currentMotivationalQuote } = req.body;
      const updates = req.body;

       // Log the received data for debugging
       console.log('Received data for update:', updates);
       const updateProfile = await profileService.updateProfile(uid, updates, photoURL);

      return res.status(201).json(updateProfile);
    } catch (err) {
      console.error('Error in updateProfileHandler:', err);
      res.status(500).json({ message: err.message });
    }
};

const updateWaterHandler = async (req, res) => {
    try {
      const { uid } = req.params;
      const { todayWater } = req.body;

       // Log the received data for debugging
      console.log('Received data for water update:', { uid, todayWater });

      const updateWater = await profileService.updateWater(uid, todayWater);

      return res.status(201).json(updateWater);
    } catch (err) {
      console.error('Error in updateWaterHandler:', err);
      res.status(500).json({ message: err.message });
    }
};

const updateSleepHandler = async (req, res) => {
  try {
    const { uid } = req.params;
    const { startTime, endTime, duration, date } = req.body;

     // Log the received data for debugging
    console.log('Received data for sleep update:', { uid, startTime, endTime, duration, date });

    const updateSleep = await profileService.updateSleep(uid, startTime, endTime, duration, date);

    return res.status(201).json(updateSleep);
  } catch (err) {
    console.error('Error in updateSleepHandler:', err);
    res.status(500).json({ message: err.message });
  }
};

const uploadProfileImage = async (req, res) => {
  try {
    const { uid } = req.params;
    const {updates} = req.body;
    const updatedProfile = await profileService.updateProfileInfo(uid, updates);
    return res.status(200).json(updatedProfile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateCurrentMotivationalQuote = async (req, res) => {
  try {
    const { uid } = req.params;
    const { currentMotivationalQuote } = req.body;
    //const update = req.body;

     // Log the received data for debugging
    // console.log('Received data for update:', currentMotivationalQuote);
     const updateCurrentMotivationalQuote = await profileService.updateCurrentMotivationalQuote(uid, currentMotivationalQuote);

    return res.status(201).json(currentMotivationalQuote);
  } catch (err) {
    console.error('Error in updateCurrentMotivationalQuote:', err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
    updateProfileHandler,
    updateWaterHandler,
    updateSleepHandler,
    uploadProfileImage,
    updateCurrentMotivationalQuote
}