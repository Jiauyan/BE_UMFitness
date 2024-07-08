const motivationalQuotesService = require("../services/motivationalQuotesService");


// get all motivationalQuotes
const getAllMotivationalQuotes= async (req, res) => {
    try {
      const findAllMotivationalQuotes= await motivationalQuotesService.getAllMotivationalQuotes();
      return res.status(200).json(findAllMotivationalQuotes);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

const getAllMotivationalQuotesOfUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const allUserMotivationalQuotes = await motivationalQuotesService.getAllUserMotivationalQuotes(uid);
    return res.status(200).json(allUserMotivationalQuotes);
  } catch (err) {
    console.error('Error fetching user motivationalQuotes:', err);
    return res.status(400).json({ message: err.message });
  }
};

const getMotivationalQuoteById= async (req, res) => {
    try {
      const { id } = req.params;
      const findOneMotivationalQuote= await motivationalQuotesService.getMotivationalQuoteById(id);
      return res.status(200).json(findOneMotivationalQuote);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
};


const addMotivationalQuote= async (req, res) => {
    try {
      const { uid, motivationalQuote } = req.body;
      const addNewMotivationalQuote= await motivationalQuotesService.addMotivationalQuote(
        uid,
        motivationalQuote
      );
      return res.status(200).json(addNewMotivationalQuote);
    } catch (err) {
      res.status(400).json({ message: "error" });
    }
  };

  const updateMotivationalQuote= async (req, res) => {
    try {
      const { id } = req.params;
      const { motivationalQuote, uid } = req.body;
      const updateMotivationalQuote= await motivationalQuotesService.updateMotivationalQuote(
        id,
        uid,
        motivationalQuote
      );
      return res.status(200).json(updateMotivationalQuote);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  const deleteMotivationalQuote= async (req, res) => {
    try {
      const { id } = req.params;
      const deleteMotivationalQuote= await motivationalQuotesService.deleteMotivationalQuote(id);
      return res.status(200).json(deleteMotivationalQuote);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  const getRandomMotivationalQuote= async (req, res) => {
    try {
      const { id } = req.params;
      const findRandomMotivationalQuote= await motivationalQuotesService.getRandomMotivationalQuote(id);
      return res.status(200).json(findRandomMotivationalQuote);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  
  module.exports = {
    getAllMotivationalQuotes,
    getAllMotivationalQuotesOfUser,
    getMotivationalQuoteById,
    addMotivationalQuote,
    updateMotivationalQuote,
    deleteMotivationalQuote,
    getRandomMotivationalQuote
  };