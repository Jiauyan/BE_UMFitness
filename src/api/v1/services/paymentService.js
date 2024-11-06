// services/paymentService.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Secret key from environment variables
const {db} = require('../../../configs/firebaseDB');
const { collection, getDocs, addDoc, query, where, setDoc } = require("firebase/firestore");

const createPaymentIntent = async (amount, email, name) => {
  try {
     // Create a customer
     const customer = await stripe.customers.create({
      email: email,
      name: name,
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents (e.g., 1000 for RM10.00)
      currency: 'myr', // Set currency to MYR
      payment_method_types: ['card'],
      customer: customer.id
    });
    return {
      clientSecret: paymentIntent.client_secret,
      transactionId: paymentIntent.id,  // This is the transaction ID from Stripe
    };
  } catch (error) {
    console.error("Stripe error:", error.message); // Log the detailed error for debugging
    throw new Error(`Error creating payment intent: ${error.message}`); // Pass a more specific error message to the response
  }
};

// store payment
const storePaymentStatus = async (uid, paymentStatus, amount, transactionId, trainingProgramTitle, trainingProgramID, refundStatus) => {
  try {
      const timestamp = new Date().toISOString();
      const storePayment = await addDoc(collection(db, 'Payment'), {
        uid, 
        paymentStatus, 
        amount, 
        transactionId,
        trainingProgramTitle,
        trainingProgramID,
        timestamp,
        refundStatus
      });

      return { id:storePayment.id, uid, paymentStatus, amount, transactionId, trainingProgramTitle, trainingProgramID, timestamp, refundStatus };
  }catch (error) {
      console.log('Error storing payment status:', error);
      throw new Error("Failed to store payment status.");
  }
}

const getAllPaymentsByUid = async (uid) => {
  try {
    const paymentsRef = collection(db, 'Payment');
    const q = query(paymentsRef, where('uid', '==', uid));
    const querySnapshot = await getDocs(q);

    const payments = querySnapshot.docs.map(doc => ({ id:doc.id, ...doc.data() }));
    return payments;
  }catch (error) {
      console.error('Error fetching payments of the user:', error);
      throw error;
  }
}

const createRefund = async (transactionId) => {
  try {
    // Create a refund using the Stripe API
    const refund = await stripe.refunds.create({
      payment_intent: transactionId,
    });

    // Find the document by transactionId
    const paymentsRef = collection(db, 'Payment');
    const querySnapshot = await getDocs(query(paymentsRef, where("transactionId", "==", transactionId)));

    if (querySnapshot.empty) {
      throw new Error("No matching payment document found for the given transactionId.");
    }

    // Get the first matching document (assuming transactionId is unique)
    const paymentDoc = querySnapshot.docs[0];
    
    // Update the refundStatus field
    await setDoc(paymentDoc.ref, { refundStatus: true }, { merge: true });

    return { success: true, refund };
  } catch (error) {
    console.error('Refund error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  createPaymentIntent,
  storePaymentStatus,
  getAllPaymentsByUid,
  createRefund
};
