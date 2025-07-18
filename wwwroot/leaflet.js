import { showGrid, hideGrid, getCurrentGridColor } from './Overlay/latlon.js';
import { setupBasemapSelector } from './Overlay/basemap.js';
import { addStatesLayer, removeStatesLayer, updateStatesLayerColor } from './Overlay/states.js';
import { addCountiesLayer, removeCountiesLayer, updateCountiesLayerColor, updateCountiesNamesVisibility } from './Overlay/counties.js';
import { addNexradLayer, removeNexradLayer } from './Overlay/nexrad.js';
import { addTdwrLayer, removeTdwrLayer } from './Overlay/tdwr.js';
import { setupDateSelector } from './Selectors/dateSelector.js';
import { setupHourSelector } from './Selectors/hourSelector.js';
import { setupMinuteSelector } from './Selectors/minuteSelector.js';

var map = L.map('map').setView([40, -100], 6);
setupBasemapSelector(map);
window.map = map;

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

// Counties
const countiesCheckbox = document.getElementById('counties-checkbox');
const countiesColorInput = document.getElementById('countiesColorInput');
const countiesNamesCheckbox = document.getElementById('counties-names-checkbox');

countiesCheckbox.addEventListener('change', function () {
    if (countiesCheckbox.checked) {
        addCountiesLayer(map, countiesColorInput.value, countiesNamesCheckbox.checked);
    } else {
        removeCountiesLayer(map);
    }
});

countiesColorInput.addEventListener('input', function () {
    if (countiesCheckbox.checked) {
        updateCountiesLayerColor(map, countiesColorInput.value);
    }
});

countiesNamesCheckbox.addEventListener('change', function () {
    if (countiesCheckbox.checked) {
        updateCountiesNamesVisibility(map, countiesNamesCheckbox.checked);
    }
});

// NEXRAD
const nexradCheckbox = document.getElementById('nexrad-checkbox');
nexradCheckbox.addEventListener('change', function () {
    if (nexradCheckbox.checked) {
        addNexradLayer(map);
    } else {
        removeNexradLayer(map);
    }
});

// TDWR
const tdwrCheckbox = document.getElementById('tdwr-checkbox');
tdwrCheckbox.addEventListener('change', function () {
    if (tdwrCheckbox.checked) {
        addTdwrLayer(map);
    } else {
        removeTdwrLayer(map);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    setupDateSelector();
    setupHourSelector();
    setupMinuteSelector();
});