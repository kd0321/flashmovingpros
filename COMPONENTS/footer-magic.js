document.addEventListener('DOMContentLoaded', () => {
  // Figure out if current page lives inside /service_pages/
  const inServicePages = window.location.pathname.includes('/service_pages/');

  // Pick the right relative path to footer.html
  const footerPath = inServicePages
    ? '../service_pages/footer.html'   // page is already in /service_pages/
    : 'service_pages/footer.html';     // page is at root (like /index.html)

  fetch(footerPath, { cache: "no-store" })
    .then(r => {
      if (!r.ok) throw new Error(r.status + " " + r.statusText);
      return r.text();
    })
    .then(html => {
      document.body.insertAdjacentHTML('beforeend', html);
    })
    .catch(err => {
      console.error("Footer load failed:", err, "Tried path:", footerPath);
    });
});
