// /service_js/end-redirect.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('payment-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault(); // keep it here so we can run our logic first

    // terms gate
    const terms = document.getElementById('disclaimer');
    if (!terms || !terms.checked) {
      alert('Please read the Terms and check the box before continuing.');
      return;
    }

    // save any fields if your page defines it (sessionStorage/localStorage etc.)
    try {
      if (typeof window.saveFields === 'function') {
        window.saveFields();
      }
    } catch (err) {
      console.warn('saveFields() error:', err);
    }

    // redirect to Thanks page (same tab)
    window.location.assign('/service_pages/Thanks.html');
  });
});
