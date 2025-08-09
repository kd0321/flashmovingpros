function saveFields() {
  const standard = ["full-name", "phone-number", "email", "business-name"];
  const extra = [];

  // Get the address from Mapbox input if it exists
  let address = "";
  const mapboxInput = document.querySelector('.mapboxgl-ctrl-geocoder input[type="text"]');
  if (mapboxInput) {
    address = mapboxInput.value.trim();
  } else {
    // fallback if geocoder input wasn't found
    address = document.getElementById("address-search")?.value || "";
  }

  // Save to localStorage
  localStorage.setItem("name", document.getElementById("full-name")?.value || "");
  localStorage.setItem("phone", document.getElementById("phone-number")?.value || "");
  localStorage.setItem("email", document.getElementById("email")?.value || "");
  localStorage.setItem("address", address);
  localStorage.setItem("business", document.getElementById("business-name")?.value || "");

  // Save only relevant custom questions
  document.querySelectorAll("input, textarea, select").forEach((el) => {
    const id = el.id?.trim();
    const name = el.name?.trim();
    const isStandard = standard.includes(id);
    const isPackage = name === "package" || (id && id.toLowerCase().includes("package"));
    const isAddress = el.closest(".mapboxgl-ctrl-geocoder") !== null;

    if (!isStandard && !isPackage && !isAddress && el.value.trim() !== "") {
      const label = document.querySelector(`label[for="${el.id}"]`);
      const labelText = label?.innerText || el.name || el.id;
      extra.push(`${labelText}: ${el.value}`);
    }
  });

  localStorage.setItem("description", extra.join(" | "));

    // Save total price from service page (includes mileage + package)
  const totalText = document.getElementById("total-price")?.textContent || "";
  const totalAmount = totalText.replace(/[^\d.]/g, ""); // Remove non-numeric text
  localStorage.setItem("finalTotal", totalAmount);

}

window.saveFields = saveFields;
