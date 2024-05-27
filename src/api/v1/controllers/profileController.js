const profileService = require("../services/profileService");
const { db, storage } = require('../../../configs/firebaseDB');
const { doc, updateDoc } = require("firebase/firestore");
const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const fs = require('fs');

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

const uploadProfileImage = async (req, res) => {
  try {
    console.log(req.file);
    const { uid } = req.params;
    const updates = req.body;
    const profileImage = req.file;
    const profileImageRef = ref(storage, `profileImages/${profileImage.filename}`);
    const uploadResult = await profileService.uploadProfileImage(profileImage);
    const downloadUrl = await getDownloadURL(profileImageRef);

    await profileService.updateProfile(uid, updates, downloadUrl);

    return res.status(200).json(uploadResult);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


module.exports = {
    updateProfileHandler,
    updateWaterHandler,
    uploadProfileImage,
}