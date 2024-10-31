const express = require('express');
const paymentController = require('../controllers/paymentController');

const router = express.Router();

router.post('/create-payment-intent', paymentController.createPaymentIntent);
router.post('/storePaymentStatus', paymentController.storePaymentStatus);
router.get("/getAllPaymentsByUid/:uid", paymentController.getAllPaymentsByUid);

module.exports = router;
