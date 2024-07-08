const express = require("express");
const router = express.Router();

const motivationalQuotesController = require("../controllers/motivationalQuotesController");


router.get("/getAllMotivationalQuotes", motivationalQuotesController.getAllMotivationalQuotes);
router.get("/getAllUserMotivationalQuotes/:uid", motivationalQuotesController.getAllMotivationalQuotesOfUser);
router.get("/getMotivationalQuoteById/:id", motivationalQuotesController.getMotivationalQuoteById);
router.post("/addMotivationalQuote", motivationalQuotesController.addMotivationalQuote);
router.delete("/deleteMotivationalQuote/:id", motivationalQuotesController.deleteMotivationalQuote);
router.patch("/updateMotivationalQuote/:id", motivationalQuotesController.updateMotivationalQuote);
router.get("/getRandomMotivationalQuote/:id", motivationalQuotesController.getRandomMotivationalQuote);

module.exports = router;