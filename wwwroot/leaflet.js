// Initialize the Leaflet map
document.addEventListener('DOMContentLoaded', function () {
    var map = L.map('map').setView([40, -100], 6); // Centered on Kansas(ish)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
});