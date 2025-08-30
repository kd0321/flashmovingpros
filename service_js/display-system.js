// service_js/display-system.js — cleaned display for checkout page
document.addEventListener('DOMContentLoaded', () => {
  // Optional: guard against stale data from a different page
  let refPath = '';
  try { refPath = new URL(document.referrer).pathname; } catch {}
  const src = sessionStorage.getItem('__source') || '';

  if (src && refPath && src !== refPath) {
    console.warn('[ss] ignoring stale data from', src, 'referrer is', refPath);
    // If you want to hard-clear: 
    // ['name','email','phone','business','address','drop off address','dropoff-address','service','description','photosList','__source'].forEach(k => sessionStorage.removeItem(k));
  }

  const get = (k) => sessionStorage.getItem(k) || '';
  const set = (id, val, fallback = '') => {
    const el = document.getElementById(id);
    if (el) el.textContent = (val && String(val).trim()) ? val : fallback;
  };

  const drop = get('drop off address') || get('dropoff-address') || '';

  set('summary-name',        get('name'),        'N/A');
  set('summary-business',    get('business'),    '');
  set('summary-email',       get('email'),       'N/A');
  set('summary-phone',       get('phone'),       'N/A');
  set('summary-address',     get('address'),     '');
  set('summary-dropoff',     drop,               'N/A');
  set('summary-service',     get('service') || (document.querySelector('h1')?.textContent || document.title), 'N/A');
  set('summary-description', get('description'), 'None');
});
