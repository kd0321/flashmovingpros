// cost-caculator.js — Fixed totals per service with "$" and "2.5 hr minimum"
(function () {
  // ---- HARD GUARD: bail out on junk/cleanout/onsite pages or if truckload selector exists
  const pageKey = location.pathname.toLowerCase().split('/').pop().replace(/\.html?$/,'') || 'index';
  const titleLC = (document.querySelector('header h1, h1')?.textContent || document.title || '').toLowerCase();
  const hasTruckloadSelect = !!document.getElementById('volume');

  const isCleanoutLike =
    hasTruckloadSelect ||
    /junk|cleanout|post[-\s]*construction|renovation|foreclosure|eviction|storage|garage|attic|basement|shed.*deck|deck.*shed/.test(titleLC) ||
    /junk-removal|attic-cleanout|basement-cleanout|garage-cleanout|storage-unit-cleanout|office-cleanout|shed-deck-cleanout|renovation-debris|post-construction|foreclosure-cleanout|eviction-cleanout|hoarder-cleanout|full-estate-cleanout/.test(pageKey);

  if (isCleanoutLike || window.SKIP_FIXED_TOTALS === true) {
    return; // DO NOT write totals here
  }
  // ---- END GUARD

  // ---------- helpers ----------
  function getFileKey() {
    const path = location.pathname.toLowerCase();
    return path.substring(path.lastIndexOf('/') + 1).replace(/\.html?$/, '') || 'index';
  }
  function normTitle(s) {
    return (s || '').toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, ' ').trim();
  }
  function detectServiceName() {
    const h1 = document.querySelector('header h1, header .title, h1');
    return (h1?.textContent || document.title || '').trim();
  }

  // ---------- filename aliases ----------
  const fileToKey = {
    'residential'               : 'residential-moving',
    'residential-moving'        : 'residential-moving',
    'appliance-moving'          : 'appliance-moving',
    'furniture-delivery'        : 'furniture-delivery',
    'local-delivery'            : 'local-delivery',

    'loading-unloading'         : 'loading-unloading',
    'loading-and-unloading'     : 'loading-unloading',
    'loading_and_unloading'     : 'loading-unloading',
    'loadingunloading'          : 'loading-unloading',
    'loading'                   : 'loading-unloading', // if the file is just loading.html

    'packing-unpacking'         : 'packing-and-unpacking',

    'commercial'                : 'commercial-moving',
    'commercial-moving'         : 'commercial-moving',

    'specialty'                 : 'specialty-item-moving',
    'specialty-items'           : 'specialty-item-moving',

    // Hauling is fixed-price here (NOT a truckload page)
    'hauling'                   : 'hauling'
  };

  // ---------- totals ----------
  const keyToTotal = {
    'residential-moving'           : 375,
    'commercial-moving'            : 438,
    'loading-unloading'            : 375,
    'packing-and-unpacking'        : 375,
    'appliance-moving'             : 375,
    'specialty-item-moving'        : 500,
    'furniture-delivery'           : 375,
    'event-and-equipment-delivery' : 438,
    'local-delivery'               : 375,
    'hauling'                      : 375
  };

  // ---------- robust detection ----------
  function detectServiceKey() {
    // A) filename wins first
    const fk = fileToKey[getFileKey()];
    if (fk) return fk;

    // B) then heading/title with explicit overrides first
    const t = normTitle(detectServiceName());

    // Hard overrides BEFORE any "commercial" match
    if (/\bloading\b/.test(t) && /\bunloading\b/.test(t)) return 'loading-unloading';
    if (/\bhaul(?:ing)?\b/.test(t))                       return 'hauling';

    // Specific mappings
    if (/\bpacking\b/.test(t) && /\bunpacking\b/.test(t))                 return 'packing-and-unpacking';
    if (/\bfurniture\b/.test(t) && /\bdelivery\b/.test(t))                return 'furniture-delivery';
    if (/\bevent\b/.test(t) && /\bequipment\b/.test(t) && /\bdelivery\b/.test(t))
                                                                          return 'event-and-equipment-delivery';
    if (/\bresidential\b/.test(t) && /\bmoving\b/.test(t))                return 'residential-moving';
    if (/\bappliance\b/.test(t)   && /\bmoving\b/.test(t))                return 'appliance-moving';
    if (/\blocal\b/.test(t)       && /\bdelivery\b/.test(t))              return 'local-delivery';

    // LAST: commercial (so it can’t steal loading/unloading or hauling)
    if (/\bcommercial\b/.test(t)  && /\bmoving\b/.test(t))                return 'commercial-moving';

    return null;
  }

  function setFixedTotalForService() {
    const svcKey = detectServiceKey();
    if (!svcKey) return;
    const total = keyToTotal[svcKey];
    if (typeof total !== 'number') return;

    const val = `$${total} (2.5 hr minimum)`;
    sessionStorage.setItem('total', val);
    sessionStorage.setItem('finalTotal', val);

    const preview = document.getElementById('total-price');
    if (preview) preview.textContent = val;
  }

  function wire() {
    setFixedTotalForService();

    const btn = document.getElementById('book-services-button');
    if (btn) btn.addEventListener('click', setFixedTotalForService);

    document.addEventListener('submit', function (e) {
      const action = (e.target.getAttribute('action') || '').toLowerCase();
      if (action.includes('checkout.html')) setFixedTotalForService();
    }, true);
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', wire)
    : wire();
})();
