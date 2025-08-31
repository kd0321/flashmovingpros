// fa-calculator.js — Furniture Assembly calculator (sessionStorage only)
// Small $70, Medium $120, Large $200

(function () {
  const rates = { small: 70, medium: 120, large: 200 };

  // Try multiple id/name variants so it works across pages
  const pickNum = (selectors) => {
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (!el) continue;
      const v = (el.value || '').trim();
      const n = parseFloat(v);
      if (isFinite(n)) return n;
    }
    return 0;
  };

  function compute() {
    const s = pickNum(['#fa-small','[name="fa-small"]','#small-items','[name="small-items"]']);
    const m = pickNum(['#fa-medium','[name="fa-medium"]','#medium-items','[name="medium-items"]']);
    const l = pickNum(['#fa-large','[name="fa-large"]','#large-items','[name="large-items"]']);

    const total = (s * rates.small) + (m * rates.medium) + (l * rates.large);
    const fixed = total.toFixed(2);

    // Save to sessionStorage so checkout can read it
    // Store WITH leading "$" so it prints exactly as desired on checkout
    sessionStorage.setItem('assemblyCost', fixed);           // raw number as string "123.00"
    sessionStorage.setItem('total', `$${fixed}`);            // used by display-system.js
    sessionStorage.setItem('finalTotal', `$${fixed}`);       // legacy key some pages use

    // Human-readable breakdown for your Description field
    const parts = [];
    if (s) parts.push(`${s}× Small ($${rates.small})`);
    if (m) parts.push(`${m}× Medium ($${rates.medium})`);
    if (l) parts.push(`${l}× Large ($${rates.large})`);
    const breakdown = parts.join(' + ');
    sessionStorage.setItem('assemblyBreakdown', breakdown);

    // Append note to existing description (don’t overwrite)
    const prev = sessionStorage.getItem('description') || '';
    const note = breakdown ? `Furniture assembly: ${breakdown}` : '';
    sessionStorage.setItem('description', [prev, note].filter(Boolean).join(' | '));

    // Optional: update an on-page preview, if you have <span id="total-price">
    const preview = document.getElementById('total-price');
    if (preview) preview.textContent = `$${fixed}`;
  }

  function wire() {
    // Recompute whenever any assembly input changes
    [
      '#fa-small','[name="fa-small"]','#small-items','[name="small-items"]',
      '#fa-medium','[name="fa-medium"]','#medium-items','[name="medium-items"]',
      '#fa-large','[name="fa-large"]','#large-items','[name="large-items"]'
    ].forEach(sel => {
      const el = document.querySelector(sel);
      if (el) el.addEventListener('input', compute);
    });

    // Initial compute on load
    compute();

    // Recompute right before you navigate/submit
    const btn = document.getElementById('book-services-button');
    if (btn) btn.addEventListener('click', compute);

    document.addEventListener('submit', (e) => {
      const action = (e.target.getAttribute('action') || '').toLowerCase();
      if (action.includes('checkout.html')) compute();
    }, true);
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', wire)
    : wire();
})();
