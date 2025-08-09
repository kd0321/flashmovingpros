// transfer.js — include on every service page
(function () {
  // Map filenames -> YOUR service IDs
  var map = {
    'commercial.html':  'commercial-moving',
    'loading.html':     'loading-unloading',
    'packing.html':     'packing-unpacking',
    'residential.html': 'residential-moving',
    'appliance.html':   'appliance-moving',
    'speciality.html':  'specialty-items'
  };

  function detectServiceId() {
    var path = location.pathname.toLowerCase();
    var file = path.substring(path.lastIndexOf('/') + 1);
    return map[file] || 'residential-moving';
  }

  function normalizeCrew(val, label) {
    var v = String(val || '').toLowerCase();
    if (v === '3' || v.includes('3')) return '3';
    var t = String(label || '').toLowerCase();
    return t.includes('3') ? '3' : '1-2';
  }

  function checkoutUrl() {
    // if we're inside /service_pages/, go up one level
    return location.pathname.indexOf('/service_pages/') > -1 ? '../checkout.html' : './checkout.html';
  }

  function init() {
    var btn = document.getElementById('book-services-button');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var sel = document.getElementById('crew-size');
      var opt = sel && sel.options ? sel.options[sel.selectedIndex] : null;
      var crew = normalizeCrew(sel ? sel.value : '', opt ? (opt.text || opt.label) : '');
      var serviceId = detectServiceId();
      try {
        localStorage.setItem('service', serviceId);
        localStorage.setItem('crew-size', crew);
      } catch (_) {}

      
      location.href = checkoutUrl() + '?service=' + encodeURIComponent(serviceId) + '&crew=' + encodeURIComponent(crew);
    });
  }

  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
})();
