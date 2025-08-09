    const stripe = Stripe('pk_test_51RmJnBRf7persv2c8nPKNnNbRefcsjecMySuaIHHpyb6Wx7PuRxoMG3cfyfMNqdySHme4QlhNoB6vVks2oKvPCIc00FbbVfrud'); // Replace with your public Stripe key
   
const elements = stripe.elements();
const card = elements.create("card");
card.mount("#card-element");

document.getElementById("payment-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Grab name/email from your current inputs (IDs from your HTML)
  const name = document.getElementById("cardholder-name")?.value?.trim() || "";
  const email = document.getElementById("cardholder-email")?.value?.trim() || "";

  // Amount: prefer the on-page summary, else localStorage fallback
  const summaryText = document.getElementById("summary-total")?.textContent || "";
  const lsFallback = localStorage.getItem("selectedService") || "100";
  const amountDollars = Number(summaryText) || Number(lsFallback) || 100;
  const amountCents = Math.max(50, Math.round(amountDollars * 100)); // min 50¢ safety

  // Create a PaymentIntent on your server
  let piResp;
  try {
    piResp = await fetch("/.netlify/functions/intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: amountCents,   // cents
        currency: "usd",
        name,
        email
      })
    });
  } catch (err) {
    document.getElementById("card-errors").textContent = "Network error creating payment.";
    return;
  }

  const piJson = await piResp.json().catch(() => ({}));
  if (!piResp.ok || !piJson?.clientSecret) {
    document.getElementById("card-errors").textContent = piJson.error || "Server error creating payment.";
    return;
  }

  // Confirm card payment on the client (handles 3DS if required)
  const { error, paymentIntent } = await stripe.confirmCardPayment(piJson.clientSecret, {
    payment_method: {
      card,
      billing_details: {
        name: name || undefined,
        email: email || undefined,
      },
    },
  });

  if (error) {
    document.getElementById("card-errors").textContent = error.message || "Payment failed.";
    return;
  }

  if (paymentIntent && paymentIntent.status === "succeeded") {
    // Success
    alert("Booking and payment successful!");
    window.location.href = "/thank-you";
  } else {
    document.getElementById("card-errors").textContent =
      `Payment status: ${paymentIntent?.status || "unknown"}.`;
  }
});