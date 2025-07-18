import { showGrid, hideGrid, getCurrentGridColor } from './latlon.js';
import { setupBasemapSelector } from './basemap.js';
import { addStatesLayer, removeStatesLayer, updateStatesLayerColor } from './states.js';
import { addCountiesLayer, removeCountiesLayer, updateCountiesLayerColor, updateCountiesNamesVisibility } from './counties.js';
import { addNexradLayer, removeNexradLayer } from './nexrad.js';
import { addTdwrLayer, removeTdwrLayer } from './tdwr.js';

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


// Calendar popup logic for datePickerBtn
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('datePickerBtn');

    // Create year, month, day inputs ONCE, to the left of the button
    let yearInput = document.getElementById('yearInput');
    let monthInput = document.getElementById('monthInput');
    let dayInput = document.getElementById('dayInput');

    if (!yearInput || !monthInput || !dayInput) {
        yearInput = document.createElement('input');
        yearInput.type = 'number';
        yearInput.id = 'yearInput';
        yearInput.placeholder = 'YYYY';
        yearInput.style.width = '60px';
        yearInput.min = '1900';
        yearInput.max = '2100';

        monthInput = document.createElement('input');
        monthInput.type = 'number';
        monthInput.id = 'monthInput';
        monthInput.placeholder = 'MM';
        monthInput.style.width = '40px';
        monthInput.min = '1';
        monthInput.max = '12';

        dayInput = document.createElement('input');
        dayInput.type = 'number';
        dayInput.id = 'dayInput';
        dayInput.placeholder = 'DD';
        dayInput.style.width = '40px';
        dayInput.min = '1';
        dayInput.max = '31';

        // Insert inputs to the left of the button
        btn.parentNode.insertBefore(yearInput, btn);
        btn.parentNode.insertBefore(monthInput, btn);
        btn.parentNode.insertBefore(dayInput, btn);
    }

    let calendarInput = null;

    btn.addEventListener('click', (e) => {
        // Remove any existing calendar
        if (calendarInput) {
            calendarInput.remove();
            calendarInput = null;
        }

        // Create the calendar input (native date picker)
        calendarInput = document.createElement('input');
        calendarInput.type = 'date';
        calendarInput.style.position = 'absolute';
        calendarInput.style.zIndex = '1000';

        document.body.appendChild(calendarInput);
        calendarInput.focus();

        // When a date is picked, update year/month/day fields and hide the calendar
        calendarInput.addEventListener('change', () => {
            if (calendarInput.value) {
                const [yyyy, mm, dd] = calendarInput.value.split('-');
                yearInput.value = yyyy;
                monthInput.value = mm;
                dayInput.value = dd;
            }
            calendarInput.remove();
            calendarInput = null;
        });

        // Hide if clicking outside
        document.addEventListener('mousedown', function hideCalendar(ev) {
            if (calendarInput && !calendarInput.contains(ev.target) && ev.target !== btn) {
                calendarInput.remove();
                calendarInput = null;
                document.removeEventListener('mousedown', hideCalendar);
            }
        });
    });
});