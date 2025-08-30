document.addEventListener('DOMContentLoaded', function() {
  fetch('service_pages/footer.html')
    .then(response => response.text())
    .then(html => {
      document.body.insertAdjacentHTML('beforeend', html);
    });
});