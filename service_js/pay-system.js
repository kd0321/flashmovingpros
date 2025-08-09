    const stripe = Stripe('pk_test_51RmJnBRf7persv2c8nPKNnNbRefcsjecMySuaIHHpyb6Wx7PuRxoMG3cfyfMNqdySHme4QlhNoB6vVks2oKvPCIc00FbbVfrud'); // Replace with your public Stripe key
    const elements = stripe.elements();
    const card = elements.create("card");
    card.mount("#card-element");



    document.addEventListener('DOMContentLoaded', () => {
        const servicePrice = localStorage.getItem("selectedService") || "100";
        const serviceName = localStorage.getItem("selectedServiceName") || "Selected Service";
        
    });

    document.getElementById("payment-form").addEventListener("submit", async function(e) {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const servicePrice = localStorage.getItem("selectedService") || "100";

       

        const { paymentMethod, error } = await stripe.createPaymentMethod({
            type: "card",
            card: card,
            billing_details: {
                name: name,
                email: email
            }
        });

        if (error) {
            document.getElementById("card-errors").textContent = error.message;
        } else {
            const response = await fetch("/.netlify/functions/intent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email,
                    amount: servicePrice,
                    payment_method: paymentMethod.id
                })
            });

            const result = await response.json();

            if (result.success) {
                alert("Booking and Payment successful!");
                window.location.href = "/thank-you";
            } else {
                document.getElementById("card-errors").textContent = result.error || "Payment failed.";
            }
        }
    });