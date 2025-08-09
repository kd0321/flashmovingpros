// netlify/functions/intent.js
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: CORS, body: "" };
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: "Missing Stripe secret key" }) };
  }

  try {
    const { amount, currency = "usd", name = "", email = "" } = JSON.parse(event.body || "{}");

    if (!amount || isNaN(Number(amount))) {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: "Missing or invalid amount" }) };
    }

    const unitAmount = Math.max(50, Math.round(Number(amount))); // already cents
    const params = {
      amount: unitAmount,
      currency,
      automatic_payment_methods: { enabled: true },
    };
    if (name) params.description = name;
    if (email) params.receipt_email = email;

    const pi = await stripe.paymentIntents.create(params);

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({ success: true, id: pi.id, clientSecret: pi.client_secret, status: pi.status }),
    };
  } catch (err) {
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ success: false, error: err.message }) };
  }
};
