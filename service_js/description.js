// description.js — collect NON-core fields from #form-container into sessionStorage.description
(function () {
  // Turn on logs in console with: window.DEBUG_EXTRAS = true
  const log = (...a) => { if (window.DEBUG_EXTRAS) console.log('[extras]', ...a); };

  // Where to look (no <form> required)
  function root() {
    return document.getElementById('form-container') || document.body;
  }

  // Skip core fields (we don't include these in description)
  const CORE_IDS = new Set([
    'full-name','phone-number','email','business-name',
    'dropoff-address','address-search','service','service-type'
  ]);
  const CORE_NAMES = new Set([
    'name','full-name','phone','phone-number','email','email-address',
    'business','business-name','dropoff','dropoff-address','service'
  ]);

  function labelFor(el) {
    const id = el.id?.trim();
    if (id) {
      // search document-wide for label[for=id]
      const lbl = document.querySelector(`label[for="${CSS.escape(id)}"]`);
      if (lbl) return (lbl.innerText || '').trim();
    }
    return (
      el.getAttribute('aria-label')?.trim() ||
      el.placeholder?.trim() ||
      el.name?.trim() ||
      el.id?.trim() ||
      'Additional Info'
    );
  }

  function collectExtras() {
    const container = root();
    const extras = [];
    const photos = [];
    if (!container) return { extras, photos };

    const fields = container.querySelectorAll('input, textarea, select');

    fields.forEach((el) => {
      const tag  = (el.tagName || '').toLowerCase();
      const type = (el.type || '').toLowerCase();
      const id   = (el.id || '').trim();
      const name = (el.name || '').trim();

      // Skip core/hidden/mapbox geocoder
      if (CORE_IDS.has(id) || CORE_NAMES.has(name)) return;
      if (type === 'hidden') return;
      if (el.closest('.mapboxgl-ctrl-geocoder')) return;

      let val = '';
      if (type === 'checkbox' || type === 'radio') {
        if (!el.checked) return;
        val = el.value || 'Yes';
      } else if (type === 'file') {
        if (el.files && el.files.length) {
          const names = Array.from(el.files).map(f => f.name);
          photos.push(...names);
          val = names.join(', ');
        }
      } else if (tag === 'select') {
        const opt = el.selectedOptions && el.selectedOptions[0];
        val = (opt ? opt.text : el.value || '').trim();
      } else {
        val = (el.value || '').trim();
      }

      if (!val) return;

      const label = labelFor(el);
      extras.push(`${label}: ${val}`);
    });

    return { extras, photos };
  }

  function saveExtras() {
    const { extras, photos } = collectExtras();

    const desc = extras.join(' | ');
    log('saving desc=', desc);
    if (desc) {
      sessionStorage.setItem('description', desc);
    } else {
      // if nothing, clear so you can see it change
      sessionStorage.removeItem('description');
    }

    if (photos.length) {
      const list = photos.join(', ');
      log('saving photosList=', list);
      sessionStorage.setItem('photosList', list);
    } else {
      sessionStorage.removeItem('photosList');
    }
  }

  function wire() {
    // expose manual trigger
    window.__extrasSave = saveExtras;

    // auto-save on user edits
    const container = root();
    if (container) {
      container.addEventListener('input',  saveExtras);
      container.addEventListener('change', saveExtras);
    }

    // save on “book” button click
    const bookBtn = document.getElementById('book-services-button');
    if (bookBtn) bookBtn.addEventListener('click', saveExtras);

    // initial attempt (so you can test right away)
    saveExtras();
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', wire)
    : wire();
})();
