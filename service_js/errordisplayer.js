function validateBookingForm() {
  const errors = [];

  const fullName = document.getElementById("full-name");
  const phoneNumber = document.getElementById("phone-number");
  const emailAddress = document.getElementById("email-address");
  const address = document.getElementById("address");
 

  if (!fullName || fullName.value.trim() === "") {
    errors.push("Full Name is required.");
  }

  if (!phoneNumber || phoneNumber.value.trim() === "") {
    errors.push("Phone Number is required.");
  }

  if (!emailAddress || emailAddress.value.trim() === "") {
    errors.push("Email Address is required.");
  }


  if (errors.length > 0) {
    alert("Please fix the following:\n\n" + errors.join("\n"));
    return false; // block form
  }

  return true; // allow form
}

// Hook it to the "Ready to Book Your Services" button
document.addEventListener("DOMContentLoaded", () => {
  const checkoutButton = document.getElementById("book-services-button");
  if (checkoutButton) {
    checkoutButton.addEventListener("click", (e) => {
      if (!validateBookingForm()) {
        e.preventDefault();
      }
    });
  }
});

      
 