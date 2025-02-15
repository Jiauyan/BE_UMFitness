const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Ensure your secret key is correctly configured
const {db} = require('../../../configs/firebaseDB');
const { collection, getDocs, addDoc, query, where, setDoc } = require("firebase/firestore");

const createCheckoutSession = async (data) => {
    try {
        // Create a customer
        const customer = await stripe.customers.create({
            email: data.customerEmail,  // Email address for the customer
            name: data.customerName,    // Optional: add name if provided
        });

        // Create the checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'myr',
                    product_data: {
                        name: data.trainingProgram,
                    },
                    unit_amount: Math.round(data.feeAmount * 100), // Convert to cents
                },
                quantity: 1,
            }],
            mode: 'payment',
            customer: customer.id, // Attach the customer to the session
            success_url: `${data.origin}/paymentSuccess`,
            cancel_url: `${data.origin}/paymentCancel`,
        });
        return session;
    } catch (error) {
        console.error("Stripe Checkout Session Error:", error);
        throw error;
    }
};

const completeCheckout = async (sessionId) => {
    try {
        if (typeof sessionId !== 'string') {
            throw new Error("Session ID must be a string");
        }
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        return session;
    } catch (error) {
        console.error("Stripe Checkout Session Error:", error);
        throw error;
    }
};

const refundPayment = async (paymentIntentId) => {
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        // Use `latest_charge` instead of checking `paymentIntent.charges.data`
        const chargeId = paymentIntent.latest_charge;
        if (!chargeId) {
            throw new Error("No charges found to refund.");
        }
        const refund = await stripe.refunds.create({
            charge: chargeId,
        });
            // Find the document by transactionId
        const paymentsRef = collection(db, 'Payment');
        const querySnapshot = await getDocs(query(paymentsRef, where("transactionId", "==", paymentIntentId)));

        if (querySnapshot.empty) {
        throw new Error("No matching payment document found for the given transactionId.");
        }

        // Get the first matching document (assuming transactionId is unique)
        const paymentDoc = querySnapshot.docs[0];
        
        // Update the refundStatus field
        const refundStatus = await setDoc(paymentDoc.ref, { refundStatus: true }, { merge: true });

        return {refund, refundStatus};
    } catch (error) {
        console.error('Stripe Refund Error:', error);
        throw error;
    }
};

module.exports = {
    createCheckoutSession,
    completeCheckout,
    refundPayment
};
