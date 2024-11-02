const express = require("express");
const router = express.Router();

const checkoutController = require("../controllers/checkoutController");


router.post("/createCheckoutSession", checkoutController.createCheckoutSession);

module.exports = router;