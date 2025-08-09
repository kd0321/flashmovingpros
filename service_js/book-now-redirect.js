document.addEventListener("DOMContentLoaded", function () {
  const bookBtn = document.getElementById("book-services-button");
  if (bookBtn) {
    bookBtn.addEventListener("click", function (e) {
      e.preventDefault();
      if (typeof window.saveFields === "function") {
        window.saveFields();
      }
      setTimeout(() => {
        window.location.href = "/service_pages/checkout.html";
      }, 300);
    });
  }
});
