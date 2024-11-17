const tipsService = require("../services/tipsService");
const { db, storage } = require('../../../configs/firebaseDB');
const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const { format } = require('date-fns');

// get all tips
const getAllTips= async (req, res) => {
    try {
      res.set('Cache-Control', 'no-store');
      const findAllTips= await tipsService.getAllTips();
      return res.status(200).json(findAllTips);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

const getAllTipsOfUser = async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store');
    const { uid } = req.params;
    const allUserTips = await tipsService.getAllUserTips(uid);
    return res.status(200).json(allUserTips);
  } catch (err) {
    console.error('Error fetching user tips:', err);
    return res.status(400).json({ message: err.message });
  }
};

const getTipById= async (req, res) => {
    try {
      res.set('Cache-Control', 'no-store');
      const { id } = req.params;
      const findOneTip= await tipsService.getTipById(id);
      return res.status(200).json(findOneTip);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
};


const addTip= async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store');
    const { uid, title, desc, shortDesc, username, userImageUrl } = req.body;
    let downloadUrl = null; // Default to null if no file is uploaded

        // Check if the file was uploaded and process it
        if (req.file) {
            downloadUrl = await tipsService.uploadTipImage(req.file);
        }

        // Proceed to add the tip with the data provided in the request
        const addNewTip = await tipsService.addTip(
            uid, title, desc, downloadUrl, shortDesc, username, userImageUrl
        );
    return res.status(200).json(addNewTip);
  } catch (err) {
    console.error("Error in addTip:", err.message);
    return res.status(400).json({ message: err.message });
  }
  };

  const updateTip= async (req, res) => {
    try {
      res.set('Cache-Control', 'no-store');
      const { id } = req.params;
      const updates = req.body;
      let downloadUrl = null;  
  
       // Check if the file was uploaded and process it
       if (req.file) {
        downloadUrl = await tipsService.uploadTipImage(req.file);
      }
  
      // Include the downloadUrl in updates only if a new image was uploaded
      if (downloadUrl) {
        updates.tipImage = downloadUrl;
      }
  
      const updatedTip = await tipsService.updateTip(id, updates);
      return res.status(200).json(updatedTip);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  const deleteTip= async (req, res) => {
    try {
      const { id } = req.params;
      const deleteTip= await tipsService.deleteTip(id);
      return res.status(200).json(deleteTip);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  module.exports = {
    getAllTips,
    getAllTipsOfUser,
    getTipById,
    addTip,
    updateTip,
    deleteTip
  };