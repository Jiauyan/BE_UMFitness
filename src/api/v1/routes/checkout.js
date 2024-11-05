const express = require("express");
const router = express.Router();

const checkoutController = require("../controllers/checkoutController");


router.post("/createCheckoutSession", checkoutController.createCheckoutSession);
router.post("/completeCheckout", checkoutController.completeCheckout);
router.post("/refundPayment", checkoutController.refundPayment);


module.exports = router;