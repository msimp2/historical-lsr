import { showGrid, hideGrid, getCurrentGridColor } from './latlon.js';

var map = L.map('map').setView([40, -100], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let gridVisible = false;
let gridColor = '#888888';

// Lat/Lon Grid Modal elements
const latlonGridModal = document.getElementById('colorModal');
const latlonGridOptionsBtn = document.getElementById('showGridBtn');
const latlonGridModalClose = document.getElementById('closeModal');
const latlonGridUpdateColorBtn = document.getElementById('updateGridColorBtn');
const latlonGridColorInput = document.getElementById('gridColorInput');
const latlonGridColorError = document.getElementById('colorError');
const latlonGridToggleCheckbox = document.getElementById('toggleGridCheckbox');
const latlonGridColorPickerBtn = document.getElementById('colorPickerBtn');

// Show the lat/lon grid modal and set input to current color
latlonGridOptionsBtn.addEventListener('click', () => {
    latlonGridColorInput.value = gridColor;
    latlonGridColorPickerBtn.style.background = gridColor;
    latlonGridColorError.textContent = '';
    latlonGridModal.style.display = 'block';
});

// Open color picker when button is clicked
latlonGridColorPickerBtn.addEventListener('click', () => {
    latlonGridColorInput.click();
});

// Update button background when color is picked
latlonGridColorInput.addEventListener('input', () => {
    latlonGridColorPickerBtn.style.background = latlonGridColorInput.value;
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

// Update grid color and show grid if visible
latlonGridUpdateColorBtn.addEventListener('click', () => {
    const color = latlonGridColorInput.value;
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