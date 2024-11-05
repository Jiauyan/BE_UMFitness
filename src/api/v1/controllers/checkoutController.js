const checkoutService = require("../services/checkoutService");

// Create checkout session
const createCheckoutSession = async (req, res) => {
  try {
      const feeAmount  = req.body.feeAmount;
      const trainingProgram = req.body.trainingProgram;
      const customerName = req.body.customerName;
      const customerEmail = req.body.customerEmail;
      const origin = req.headers.origin;
      const session = await checkoutService.createCheckoutSession({
        trainingProgram,
        feeAmount,
        origin,
        customerEmail,
        customerName
      });

      res.status(200).json({ sessionId: session.id , session: session});
  } catch (err) {
      res.status(500).json({ message: err.message });  // Changed status code to 500 to reflect server errors
  }
};

const completeCheckout = async (req, res) => {
  try {
      const { sessionId } = req.body;  // Correctly extract sessionId directly from req.body
      const session = await checkoutService.completeCheckout(sessionId);  // Pass the sessionId correctly

      res.status(200).json({ session });
  } catch (err) {
      console.log(err);  // Good practice to log the actual error for better debugging
      res.status(500).json({ message: err.message });
  }
};

const refundPayment = async (req, res) => {
  try {
      const { paymentIntentId } = req.body; // Extract payment intent ID from request body
      if (!paymentIntentId) {
          return res.status(400).json({ message: 'Payment Intent ID is required' });
      }
      const refund = await checkoutService.refundPayment(paymentIntentId);
      res.status(200).json({ message: 'Refund processed successfully', refund });
  } catch (error) {
      res.status(500).json({ message: 'Failed to process refund', error: error.message });
  }
};

module.exports = {
    createCheckoutSession,
    completeCheckout,
    refundPayment
};
