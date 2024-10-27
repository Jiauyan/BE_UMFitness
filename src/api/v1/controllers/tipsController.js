const tipsService = require("../services/tipsService");
const { db, storage } = require('../../../configs/firebaseDB');
const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const { format } = require('date-fns');

// get all tips
const getAllTips= async (req, res) => {
    try {
      const findAllTips= await tipsService.getAllTips();
      return res.status(200).json(findAllTips);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

const getAllTipsOfUser = async (req, res) => {
  try {
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
      const { id } = req.params;
      const findOneTip= await tipsService.getTipById(id);
      return res.status(200).json(findOneTip);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
};


const addTip= async (req, res) => {
    try {
      const {uid,title,desc,shortDesc, username, userImageUrl} = req.body;
      const tipImage = req.file;
      const tipImageRef = ref(storage, `tipImages/${tipImage.filename}`);
      const uploadResult = await tipsService.uploadTipImage(tipImage);
      const downloadUrl = await getDownloadURL(tipImageRef);
      

      const addNewTip= await tipsService.addTip(
        uid,
        title,
        desc,
        downloadUrl,
        shortDesc, 
        username, 
        userImageUrl
      );
      return res.status(200).json(addNewTip);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  const updateTip= async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      let downloadUrl;
  
      if (req.file) {
        const tipImage = req.file;
        const tipImageRef = ref(storage, `tipImages/${tipImage.filename}`);
        const uploadResult = await tipsService.uploadTipImage(tipImage);
        downloadUrl = await getDownloadURL(tipImageRef);
      }
  
      // Include the downloadUrl in updates only if a new image was uploaded
      if (downloadUrl) {
        updates.downloadUrl = downloadUrl;
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

  const uploadTipImage = async (req, res) => {
    try {
      const tipImage = req.file;
      const uploadResult = await tipsService.uploadTipImage(tipImage);
      res.status(200).json({ message: 'Uploaded successfully', data: uploadResult });
  } catch (err) {
      console.error(err); 
      res.status(500).json({ message: "Internal Server Error", error: err.toString() });
  }
  };

  module.exports = {
    getAllTips,
    getAllTipsOfUser,
    getTipById,
    addTip,
    updateTip,
    deleteTip,
    uploadTipImage
  };