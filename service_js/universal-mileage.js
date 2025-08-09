// universal-mileage.js
// This script assumes mapboxgl and geocoder are already initialized on the page

document.addEventListener("DOMContentLoaded", () => {
  const hqCoords = [-74.3024, 40.4593]; // HQ in Parlin, NJ

  const checkGeocoderInterval = setInterval(() => {
    if (typeof geocoder !== 'undefined') {
      clearInterval(checkGeocoderInterval);

      geocoder.on('result', function (e) {
        const destCoords = e.result.geometry.coordinates;

        const toRad = deg => deg * Math.PI / 180;
        const R = 3958.8; // Earth radius in miles
        const [lon1, lat1] = hqCoords;
        const [lon2, lat2] = destCoords;

        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) ** 2 +
                  Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                  Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const miles = R * c;

        // Update visible mileage
        const mileageText = document.getElementById("mileage-distance");
        if (mileageText) {
          mileageText.textContent = `Distance from HQ: ${miles.toFixed(1)} miles`;
        }

        // Calculate mileage charge
        const threshold = 30;
        const ratePerMile = 2;
        window.globalMileageCharge = miles > threshold ? (miles - threshold) * ratePerMile : 0;

        // Recalculate total with mileage added
        if (typeof calculateTotal === "function") {
          calculateTotal();
        }
      });
    }
  }, 300);
});
