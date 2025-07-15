import { showGrid, hideGrid, getCurrentGridColor } from './latlon.js';

var map = L.map('map').setView([40, -100], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);


// Lat - lon grid information
let gridVisible = false;
let gridColor = 'red';

// Lat/Lon Grid Modal elements
const latlonGridModal = document.getElementById('colorModal');
const latlonGridOptionsBtn = document.getElementById('showGridBtn');
const latlonGridModalClose = document.getElementById('closeModal');
const latlonGridUpdateColorBtn = document.getElementById('updateGridColorBtn');
const latlonGridColorInput = document.getElementById('gridColorInput');
const latlonGridColorError = document.getElementById('colorError');
const latlonGridToggleCheckbox = document.getElementById('toggleGridCheckbox');

// Show the lat/lon grid modal and set input to current color
latlonGridOptionsBtn.addEventListener('click', () => {
    latlonGridColorInput.value = gridColor;
    latlonGridColorError.textContent = '';
    latlonGridModal.style.display = 'block';
});

// Close the lat/lon grid modal
latlonGridModalClose.addEventListener('click', () => {
    latlonGridModal.style.display = 'none';
});

// Close the lat/lon grid modal when clicking outside content
window.addEventListener('click', (event) => {
    if (event.target === latlonGridModal) {
        latlonGridModal.style.display = 'none';
    }
});

// Validate color utility for the lat/lon grid
function isValidColor(strColor) {
    const s = new Option().style;
    s.color = strColor;
    return s.color !== '';
}

// Update lat/lon grid color and show grid if visible
latlonGridUpdateColorBtn.addEventListener('click', () => {
    const color = latlonGridColorInput.value.trim();
    if (!isValidColor(color)) {
        latlonGridColorError.textContent = 'Invalid color. Please check your input.';
        return;
    }
    gridColor = color;
    if (gridVisible) {
        showGrid(map, gridColor);
    }
    latlonGridModal.style.display = 'none';
});

// Checkbox toggles lat/lon grid visibility
latlonGridToggleCheckbox.addEventListener('change', function () {
    gridVisible = this.checked;
    if (gridVisible) {
        showGrid(map, gridColor);
    } else {
        hideGrid(map);
    }
});

// Show lat/lon grid when map moves, if visible
map.on('moveend', function () {
    if (gridVisible) {
        showGrid(map, gridColor);
    }
});