import { showGrid, hideGrid, getCurrentGridColor } from './latlon.js';
import { setupBasemapSelector } from './basemap.js';
import { addStatesLayer, removeStatesLayer, updateStatesLayerColor } from './states.js';


var map = L.map('map').setView([40, -100], 6);
setupBasemapSelector(map);

const tileLayerUrls = {
    default: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
};

let currentTileLayer = L.tileLayer(tileLayerUrls.default, {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let gridVisible = false;
let gridColor = '#888888';

const basemapSelector = document.getElementById('basemap-selector');
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

// Update grid color and show grid if visible when color input changes
latlonGridColorInput.addEventListener('input', () => {
    gridColor = latlonGridColorInput.value;
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

// States
const statesCheckbox = document.getElementById('states-checkbox');
const statesColorInput = document.getElementById('statesColorInput');

statesCheckbox.addEventListener('change', function () {
    if (statesCheckbox.checked) {
        addStatesLayer(map, statesColorInput.value);
    } else {
        removeStatesLayer(map);
    }
});

statesColorInput.addEventListener('input', function () {
    if (statesCheckbox.checked) {
        updateStatesLayerColor(map, statesColorInput.value);
    }
});