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

      res.status(200).json({ sessionId: session.id });
  } catch (err) {
      res.status(500).json({ message: err.message });  // Changed status code to 500 to reflect server errors
  }
};

module.exports = {
    createCheckoutSession
};
