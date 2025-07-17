import { showGrid, hideGrid, getCurrentGridColor } from './latlon.js';

var map = L.map('map').setView([40, -100], 6);

const tileLayerUrls = {
    default: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
};

let currentTileLayer = L.tileLayer(tileLayerUrls.default, {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let gridVisible = false;
let gridColor = '#888888';

const basemapSelector = document.getElementById('basemap-selector');
const latlonGridUpdateColorBtn = document.getElementById('updateGridColorBtn');
const latlonGridColorInput = document.getElementById('gridColorInput');
const latlonGridToggleCheckbox = document.getElementById('toggleGridCheckbox');

// Checkbox toggles lat/lon grid visibility
latlonGridToggleCheckbox.addEventListener('change', function () {
    gridVisible = this.checked;
    if (gridVisible) {
        showGrid(map, gridColor);
    } else {
        hideGrid(map);
    }
});

// Update grid color and show grid if visible
latlonGridUpdateColorBtn.addEventListener('click', () => {
    const color = latlonGridColorInput.value;
    gridColor = color;
    if (gridVisible) {
        showGrid(map, gridColor);
    }
});

// Show lat/lon grid when map moves, if visible
map.on('moveend', function () {
    if (gridVisible) {
        showGrid(map, gridColor);
    }
});

// Basemap selector
basemapSelector.addEventListener('change', function () {
    const mode = basemapSelector.value;

    // Remove the current tile layer
    if (currentTileLayer) {
        map.removeLayer(currentTileLayer);
    }
    // Add the new tile layer
    const url = tileLayerUrls[mode] || tileLayerUrls.default;
    currentTileLayer = L.tileLayer(url, {
        attribution: mode === 'dark'
            ? '&copy; OpenStreetMap contributors &copy; CARTO'
            : '&copy; OpenStreetMap contributors'
    }).addTo(map);
});