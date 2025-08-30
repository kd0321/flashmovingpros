// cost-caculator.js — NO CREW SIZE + 2.5 hr minimum for hourly only
(function () {
  // Page filename -> pricing bucket
  var pageToBucket = {
    // Hourly: Residential ($150/hr)
    'residential': 'residential',
    'residential-moving': 'residential',
    'appliance-moving': 'residential',
    'furniture-delivery': 'residential',
    'local-delivery': 'residential',
    'loading-unloading': 'residential',
    'packing-unpacking': 'residential',
    'yard-cleaning': 'residential', // if you use hourly for yard cleaning

    

    // Hourly: Commercial ($175/hr)
    'commercial': 'commercial',
    'commercial-moving': 'commercial',

    // Hourly: Specialty ($200/hr)
    'specialty': 'specialty',
    'specialty-items': 'specialty',
    'event-equipment-delivery': 'specialty',
    'furniture-assembly': 'specialty',

    // Junk removal = by truckload (no hour min)
    'junk-removal': 'junk',
    'hauling': 'junk',

    // Cleanouts/debris/post-construction = truckload (no hour min)
    'attic-cleanout': 'truckload',
    'basement-cleanout': 'truckload',
    'garage-cleanout': 'truckload',
    'storage-unit-cleanout': 'truckload',
    'office-cleanout': 'truckload',
    'shed-cleanout': 'truckload',
    'deck-cleanout': 'truckload',
    'shed-deck-cleanout': 'truckload',
    'renovation-debris': 'truckload',
    'post-construction': 'truckload',
    'foreclosure-cleanout': 'truckload',
    'eviction-cleanout': 'truckload',

    // On-site estimate (starts at $1500+) — no hour min
    'hoarder-cleanout': 'onsite',
    'estate-cleanout': 'onsite',
    'full-estate-cleanout': 'onsite'
  };

  // Pricing buckets + min hours where applicable
  var pricing = {
    residential: { type: 'hourly',  rate: 150, label: '$150/hr', minHours: 2.5 },
    commercial:  { type: 'hourly',  rate: 175, label: '$175/hr', minHours: 2.5 },
    specialty:   { type: 'hourly',  rate: 200, label: '$200/hr', minHours: 2.5 },

    // No hourly minimums for these:
    junk:        { type: 'truckload', label: 'Priced by truckload' },
    truckload:   { type: 'truckload', label: 'Priced by truckload (+$50/hr labor/surcharges if needed)' },
    onsite:      { type: 'onsite',   min: 1500, label: 'On-site estimate required (starts at $1500+)' }
  };

  function detectPageKey() {
    var path = location.pathname.toLowerCase();
    var file = path.substring(path.lastIndexOf('/') + 1).replace(/\.html?$/, '');
    return file || 'index';
  }

  function detectBucket() {
    var key = detectPageKey();
    return pageToBucket[key] || 'residential';
  }

  function getCheckoutUrl() {
    return location.pathname.indexOf('/service_pages/') > -1 ? '../checkout.html' : './checkout.html';
  }

  function getSelectedTruckload() {
    var sel = document.getElementById('volume');
    if (!sel) return null;
    var val = sel.value || '';
    var text = (sel.options && sel.selectedIndex >= 0) ? sel.options[sel.selectedIndex].text : '';
    return { value: val, text: text };
  }

  function init() {
    var btn = document.getElementById('book-services-button');
    if (!btn) return;

    btn.addEventListener('click', function () {
      var bucket = detectBucket();
      var rule = pricing[bucket] || pricing.residential;

      var load = getSelectedTruckload(); // only exists on truckload/junk pages

      try {
        localStorage.setItem('serviceBucket', bucket);
        localStorage.setItem('pricingRule', JSON.stringify(rule));
        if (load) localStorage.setItem('truckload', JSON.stringify(load));
        else localStorage.removeItem('truckload');
      } catch (_) {}

      var params = new URLSearchParams();
      params.set('service', bucket);
      if (load && load.value) params.set('volume', load.value);

      location.href = getCheckoutUrl() + '?' + params.toString();
    });
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
