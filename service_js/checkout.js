// checkout.js — reads pricing info saved by cost-caculator.js and populates summary
document.addEventListener('DOMContentLoaded', () => {
  // Pull what we stored on the service page
  const bucket      = localStorage.getItem('serviceBucket');          // 'residential' | 'commercial' | 'specialty' | 'junk' | 'truckload' | 'onsite'
  const rule        = JSON.parse(localStorage.getItem('pricingRule') || '{}'); // { type, rate?, minHours?, label?, min? }
  const truckload   = JSON.parse(localStorage.getItem('truckload') || 'null'); // { value, text } if a load was selected

  // Target elements on your checkout page
  const elService   = document.getElementById('summary-service');
  const elTotal     = document.getElementById('summary-total');
  const minNoteCell = (() => {
    // Try to find the cell that currently shows "(2.5 hr minimum deposit)"
    // If you change the markup later, give this cell id="min-note" and this will fall back to that.
    return document.getElementById('min-note') ||
           Array.from(document.querySelectorAll('#order-summary td')).find(td =>
             (td.textContent || '').includes('2.5 hr') || (td.textContent || '').includes('minimum')
           );
  })();

  // --- Compose the pricing line and total/deposit ---
  let pricingLine = '';
  let depositText = '';   // what to show in that little note cell
  let totalValue  = '';   // number/string to drop into #summary-total

  if (rule.type === 'hourly') {
    // 2.5 hr minimum applies to hourly buckets only
    const minHours = rule.minHours || 2.5;
    const rate = rule.rate || 0;
    const minDue = (rate * minHours);
    pricingLine = `${rule.label} (minimum ${minHours} hrs)`;
    totalValue  = minDue.toFixed(0); // show as whole dollars (e.g., 375)
    depositText = `(2.5 hr minimum deposit)`;
  } else if (rule.type === 'truckload') {
    pricingLine = truckload && truckload.text
      ? `${rule.label} — Selected: ${truckload.text}`
      : `${rule.label}`;
    totalValue  = '';            // leave blank or put TBD
    depositText = '';            // no hourly minimum note for truckloads
  } else if (rule.type === 'onsite') {
    // Hoarder / Full Estate
    pricingLine = `${rule.label}`;
    totalValue  = '';            // no upfront total here
    depositText = '';            // no hourly minimum note
  } else {
    pricingLine = 'Standard rate applies.';
    totalValue  = '';
    depositText = '';
  }

  // --- Write to the page ---
  if (elService) elService.textContent = pricingLine;
  if (elTotal)   elTotal.textContent   = totalValue;

  // Update/clear the “2.5 hr minimum deposit” note cell
  if (minNoteCell) {
    if (depositText) {
      minNoteCell.textContent = depositText;
      minNoteCell.style.display = '';
    } else {
      minNoteCell.textContent = '';
      minNoteCell.style.display = 'none';
    }
  }
});
