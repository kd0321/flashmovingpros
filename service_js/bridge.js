// service_js/bridge.js — cleaned universal saver for all service pages
(function () {
  function saveFields() {
    // Clear the keys we manage so old page data can't leak
    const KEYS = ['name','email','phone','business','address','drop off address','dropoff-address','service','description','photosList','__source'];
    KEYS.forEach(k => sessionStorage.removeItem(k));

    // Stamp source page
    sessionStorage.setItem('__source', location.pathname);

    const get = (sel) => (document.querySelector(sel)?.value || '').trim();

    // Core fields
    sessionStorage.setItem('name',     get('#full-name') || get('[name="full-name"]') || get('[name="name"]'));
    sessionStorage.setItem('email',    get('#email') || get('[name="email"]') || get('[name="email-address"]'));
    sessionStorage.setItem('phone',    get('#phone-number') || get('[name="phone-number"]') || get('[name="phone"]'));
    sessionStorage.setItem('business', get('#business-name') || get('[name="business-name"]') || get('[name="business"]'));

    // Addresses
    const mapbox = document.querySelector('.mapboxgl-ctrl-geocoder input[type="text"]');
    const address = (mapbox?.value || get('#address-search') || '').trim();
    sessionStorage.setItem('address', address);

    const drop = get('#dropoff-address') || get('[name="dropoff-address"]') || get('[name="dropoff"]');
    sessionStorage.setItem('drop off address', drop);
    sessionStorage.setItem('dropoff-address',  drop);

    // Service — prefer visible header, else #service/#service-type/name, else <title>
    const svcEl = document.getElementById('service') || document.getElementById('service-type') || document.querySelector('[name="service"]');
    const header = document.querySelector('header h1, header .title, h1');
    const service = (header?.textContent || svcEl?.value || document.title || '').trim();
    sessionStorage.setItem('service', service);

    // Extras (optional, robust)
    const form = document.getElementById('booking-form') || document.querySelector('form');
    if (form) {
      const extras = [];
      form.querySelectorAll('input, textarea, select').forEach((el) => {
        const type = (el.type || '').toLowerCase();
        const id = (el.id || '').trim();
        const name = (el.name || '').trim();

        // Skip known fields/mapbox/hidden/service
        const isStd = ['full-name','phone-number','email','business-name','dropoff-address','address-search'].includes(id);
        if (isStd) return;
        if (name === 'service' || id === 'service' || id === 'service-type') return;
        if (el.closest('.mapboxgl-ctrl-geocoder')) return;
        if (type === 'hidden') return;

        let val = '';
        if (type === 'checkbox' || type === 'radio') {
          if (el.checked) val = el.value || 'Yes';
        } else if (type === 'file') {
          if (el.files && el.files.length) {
            val = Array.from(el.files).map(f => f.name).join(', ');
          }
        } else {
          val = (el.value || '').trim();
        }
        if (!val) return;

        let labelText = '';
        if (id) {
          const lbl = form.querySelector(`label[for="${CSS.escape(id)}"]`);
          if (lbl) labelText = (lbl.innerText || '').trim();
        }
        if (!labelText) {
          labelText = el.getAttribute('aria-label')?.trim() ||
                      el.placeholder?.trim() ||
                      name || id || 'Additional Info';
        }
        extras.push(`${labelText}: ${val}`);
      });
      sessionStorage.setItem('description', extras.join(' | '));
    }
  }

  // Expose
  window.saveFields = saveFields;

  // Save on any form submit that goes to checkout.html (works across all pages)
  document.addEventListener('submit', function (e) {
    const form = e.target;
    const action = (form.getAttribute('action') || '').toLowerCase();
    if (!action.includes('checkout.html')) return;
    form.removeAttribute('target'); // same tab
    try { saveFields(); } catch (err) { console.error('saveFields error:', err); }
  }, true);

  // Put at least the service name in storage on load so it's available early
  document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header h1, header .title, h1');
    const title = (header?.textContent || document.title || '').trim();
    if (title) sessionStorage.setItem('service', title);
  });
})();
