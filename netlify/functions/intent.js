const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  console.log("Function triggered");

  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("Missing Stripe secret key");
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: "Missing Stripe secret key" }),
    };
  }

  try {
    const data = JSON.parse(event.body || '{}');

    const { amount, payment_method } = data;

    if (!payment_method || !amount) {
      console.error("Missing payment_method or amount");
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: "Missing payment_method or amount" }),
      };
    }

    console.log("Creating payment intent for", email, "amount:", amount);

    const paymentIntent = await stripe.paymentIntents.create({
  amount: parseInt(amount) * 100,
  currency: 'usd',
  payment_method,
  automatic_payment_methods: {
    enabled: true,
    allow_redirects: 'never'
  },
  description: `${name}`,
  receipt_email: email
});


    console.log("PaymentIntent created:", paymentIntent.id);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, paymentIntent }),
    };
  } catch (error) {
    console.error("Error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
