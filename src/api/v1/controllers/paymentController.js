const paymentService = require('../services/paymentService');

const createPaymentIntent = async (req, res) => {
  try {
    const { amount, email, name } = req.body; // Expect amount from the request body
    if (!amount || !email || !name) return res.status(400).json({ error: 'Amount is required' });

    const clientSecret = await paymentService.createPaymentIntent(amount, email, name);
    res.status(200).json({ clientSecret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const storePaymentStatus = async (req, res) => {
  try {
    const { uid, paymentStatus, amount, transactionId, trainingProgramTitle, trainingProgramID } = req.body;
    
    // Basic validation to check for required fields
    if (!uid || !paymentStatus || !amount || !transactionId || !trainingProgramTitle || !trainingProgramID ) {
      return res.status(400).json({ message: "All fields are required except timestamp." });
    }

    // Call service to store payment status
    const storedPaymentStatus = await paymentService.storePaymentStatus(
      uid,
      paymentStatus,
      amount,
      transactionId,
      trainingProgramTitle,
      trainingProgramID
    );

    // Return success response
    return res.status(200).json(storedPaymentStatus);
  } catch (err) {
    // Log the error for debugging
    console.error("Error storing payment status:", err);

    // Return error response
    res.status(500).json({ message: "An error occurred while storing payment status." });
  }
};


const getAllPaymentsByUid= async (req, res) => {
  try {
    const { uid } = req.params;
    const allPaymentsByUid = await paymentService.getAllPaymentsByUid(uid);
    return res.status(200).json(allPaymentsByUid);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  createPaymentIntent,
  storePaymentStatus,
  getAllPaymentsByUid
};
