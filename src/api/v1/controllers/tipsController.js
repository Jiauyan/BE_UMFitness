const tipsService = require("../services/tipsService");


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
      const {uid,title,desc,pic } = req.body;
      const addNewTip= await tipsService.addTip(
        uid,
        title,
        desc,
        //pic
      );
      return res.status(200).json(addNewTip);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  const updateTip= async (req, res) => {
    try {
      const { id } = req.params;
      const { title, uid, desc, pic } = req.body;
      const updateTip= await tipsService.updateTip(
        id,
        uid,
        title,
        desc,
        //pic
      );
      return res.status(200).json(updateTip);
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
    deleteTip,
  };