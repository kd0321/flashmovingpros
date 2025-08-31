// clj-caculator.js — Cleanouts & Junk Removal (fixed single prices)
(function () {
  const SURCHARGE_AMOUNT = 200;

  // Your fixed prices
  const PRICE = {
    'few': 150,
    'quarter': 300,
    'half': 500,
    'three-quarter': 650,
    'full': 850
  };

  function getTitleText() {
    return (document.querySelector('header h1, h1')?.textContent || document.title || '').toLowerCase();
  }

  function isOnsitePage() {
    const t = getTitleText();
    return /hoarder/.test(t) || /full\s*estate/.test(t);
  }

  // Garage, post-construction, renovation debris, shed & deck → +$200
  function isSurchargePage() {
  // 1) filename/slug check
  const slug = location.pathname.toLowerCase().split('/').pop().replace(/\.html?$/,'') || 'index';
  const SURCHARGE_SLUGS = new Set([
    'garage-cleanout',
    'renovation-debris',
    'shed-deck-cleanout',
    'post-construction',              // common
    'post-construction-cleanup',      // variation
    'postconstruction-cleanup',       // variation
    'postconstruction'                // variation
  ]);
  if (SURCHARGE_SLUGS.has(slug)) return true;

  // 2) title/H1 keywords (lowercased)
  const t = (document.querySelector('header h1, h1')?.textContent || document.title || '').toLowerCase();

  // Match: "garage", "renovation debris", "shed & deck", and robust "post construction" variants
  if (/\bgarage\b/.test(t)) return true;
  if (/renovation/.test(t) && /debris/.test(t)) return true;
  if (/(shed.*deck|deck.*shed)/.test(t)) return true;

  // Post-construction: "post construction", "post-construction", "construction cleanup/clean up/cleaning"
  if (/post[\s-]*construction/.test(t)) return true;
  if (/construction\s*clean\s*up/.test(t)) return true;   // "construction clean up"
  if (/construction\s*cleanup/.test(t)) return true;      // "construction cleanup"
  if (/construction\s*cleaning/.test(t)) return true;     // "construction cleaning"

  return false;
}


  function setDisplayTotal(txt) {
    sessionStorage.setItem('total', txt);
    sessionStorage.setItem('finalTotal', txt);
    const preview = document.getElementById('total-price');
    if (preview) preview.textContent = txt;
  }

  function appendDesc(lines) {
    const prev = sessionStorage.getItem('description') || '';
    const add = lines.filter(Boolean).join(' | ');
    sessionStorage.setItem('description', [prev, add].filter(Boolean).join(' | '));
  }

  function compute() {
    const vol = document.getElementById('volume');

    // On-site estimate pages ignore truckload and show $1500+
    if (isOnsitePage()) {
      const msg = '$1500+ (on-site estimate required)';
      setDisplayTotal(msg);
      appendDesc(['On-site estimate required: $1500+ starting price']);
      return;
    }

    if (!vol) return; // not a truckload page

    const opt = vol.selectedOptions && vol.selectedOptions[0];
    const val = vol.value || '';
    const label = (opt ? opt.text.split('—')[0].trim() : '').trim(); // e.g., "1/4 Truck"

    if (!val) {
      setDisplayTotal('Priced by truckload');
      appendDesc(['Truckload: not selected']);
      return;
    }

    // Base price from your fixed map
    let base = PRICE[val];
    if (typeof base !== 'number') {
      // fallback: if value unknown, default to 'Priced by truckload'
      setDisplayTotal('Priced by truckload');
      appendDesc([`Truckload (unknown option "${val}")`]);
      return;
    }

    // Apply surcharge if needed
    const surcharge = isSurchargePage() ? SURCHARGE_AMOUNT : 0;
    const total = base + surcharge;

    // Build display like: "1/4 Truck — $300" (or "$500 +$200" → "$500" + applied)
    const display = `${label || 'Truckload'} — $${total.toFixed(0)}`;

    setDisplayTotal(display);
    appendDesc([
      `Truckload: ${label || val}`,
      surcharge ? `Debris surcharge applied: $${SURCHARGE_AMOUNT}` : ''
    ]);
  }

  function wire() {
    compute(); // on load

    const vol = document.getElementById('volume');
    if (vol) {
      vol.addEventListener('change', compute);
      vol.addEventListener('input', compute);
    }

    const book = document.getElementById('book-services-button');
    if (book) book.addEventListener('click', compute);

    document.addEventListener('submit', (e) => {
      const action = (e.target.getAttribute('action') || '').toLowerCase();
      if (action.includes('checkout.html')) compute();
    }, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }
})();
