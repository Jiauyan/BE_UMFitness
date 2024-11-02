const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Ensure your secret key is correctly configured

const createCheckoutSession = async (data) => {
    try {
        console.log(data);

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

module.exports = {
    createCheckoutSession
};
