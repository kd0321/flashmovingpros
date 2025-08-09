document.addEventListener('DOMContentLoaded', () => {
  // Helper: get localStorage value for multiple possible keys
  const val = (...keys) => {
    for (const k of keys) {
      const v = localStorage.getItem(k);
      if (v && v.trim() !== '') return v.trim();
    }
    return '';
  };

  // Name / Business / Email / Phone
  document.getElementById("summary-name").innerText =
    val("name", "full-name", "cust_name") || "N/A";

  document.getElementById("summary-business").innerText =
    val("business", "business-name", "cust_business") || "";

  document.getElementById("summary-email").innerText =
    val("email", "cust_email") || "N/A";

  document.getElementById("summary-phone").innerText =
    val("phone", "phone-number", "cust_phone") || "N/A";

  // Pickup address
  document.getElementById("summary-address").textContent =
    val("pickup-address", "address", "pickup_address");

  // Drop-off address
  const drop = val("dropoff-address", "dropoff_address");
  const dropSpan = document.getElementById("summary-dropoff");
  if (dropSpan) dropSpan.textContent = drop || "N/A";

  // Service
  document.getElementById("summary-service").innerText =
    val("service") || "N/A";

  // Description
  document.getElementById("summary-description").innerText =
    val("description") || "None";

  // Total is handled by checkout.js
});

