// checkout.js
(function () {
  function q(n){ try{ return (new URL(location.href)).searchParams.get(n) || ''; }catch(_){ return ''; } }
  function text(el){ return (el && el.textContent || '').trim().toLowerCase(); }

  // Get service ID & crew from URL > localStorage > visible summary (as last resort)
  function detectServiceId() {
    var s = (q('service') || localStorage.getItem('service') || '').toLowerCase();
    if (!s) {
      // Try to read visible summary if your other script filled it
      s = text(document.getElementById('summary-service'));
    }
    // Normalize a few possible variants to YOUR IDs
    if (s.includes('special')) return 'specialty-items';
    if (s.includes('commercial')) return 'commercial-moving';
    if (s.includes('loading')) return 'loading-unloading';
    if (s.includes('packing')) return 'packing-unpacking';
    if (s.includes('residential')) return 'residential-moving';
    if (s.includes('appliance')) return 'appliance-moving';
    if (s.includes('specialty-items')) return 'specialty-items';
    return 'residential-moving';
  }

  function detectCrew() {
    var c = (q('crew') || localStorage.getItem('crew-size') || '').toLowerCase();
    if (c === '3' || c.includes('3')) return '3';
    // last-ditch: look for a hint in description (if you ever place it there)
    var desc = text(document.getElementById('summary-description'));
    return desc.includes('3 mover') ? '3' : '1-2';
  }

  function computeDeposit(serviceId, crew) {
    // Only specialty-items is higher
    var isSpecialty = (serviceId === 'specialty-items');
    var rate = isSpecialty
      ? (crew === '3' ? 300 : 200)  // specialty: 1–2=$200/hr, 3=$300/hr
      : (crew === '3' ? 225 : 150); // others:   1–2=$150/hr, 3=$225/hr
    return rate * 2.5; // 2.5-hr minimum
  }

  

  function setTotal(deposit) {
    var span = document.getElementById('summary-total');
    if (span) span.textContent = deposit.toFixed(2);
    // Optional hidden cents fields if your payment script uses them
    var cents = Math.round(deposit * 100);
    var dep = document.getElementById('deposit_cents'); if (dep) dep.value = String(cents);
    var tot = document.getElementById('total_cents');   if (tot) tot.value = String(cents); // total == deposit
  }

  function apply() {
    var serviceId = detectServiceId();  // e.g. "specialty-items"
    var crew = detectCrew();            // "1-2" or "3"
    var deposit = computeDeposit(serviceId, crew);
    setTotal(deposit);
  }

  // Run and re-run in case other scripts overwrite the total after load
  function boot(){
    apply();
    setTimeout(apply, 120);
    setTimeout(apply, 400);
  }

  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', boot) : boot();
})();
