let gridLayer = null;
let labelOverlay = null;
let enabled = false;

function injectLatLonGridCss() {
    if (!document.getElementById('latlon-grid-style')) {
        const style = document.createElement('style');
        style.id = 'latlon-grid-style';
        style.textContent = `
            .latlon-labels {
                pointer-events: none;
            }
            .latlon-labels .lat-label,
            .latlon-labels .lon-label {
                position: absolute;
                background: rgba(255,255,255,0.8);
                color: #333;
                font-size: 12px;
                padding: 1px 4px;
                border-radius: 3px;
                z-index: 1200;
                pointer-events: none;
                font-family: sans-serif;
            }
            .latlon-labels .lat-label {
                left: 2px;
                transform: translateY(-50%);
                text-align: right;
            }
            .latlon-labels .lon-label {
                bottom: 2px;
                transform: translateX(-50%);
                text-align: center;
            }
        `;
        document.head.appendChild(style);
    }
}

export function enableLatLonGrid(map) {
    if (enabled) return;
    injectLatLonGridCss();
    gridLayer = drawLatLonGrid(map);
    labelOverlay = addLatLonLabels(map);
    map.on('move', updateLatLonLabels);
    map.on('zoom', updateLatLonLabels);
    enabled = true;

    function updateLatLonLabels() {
        if (labelOverlay) {
            labelOverlay.remove();
            labelOverlay = addLatLonLabels(map);
        }
    }
    // Store the handler for later removal
    enableLatLonGrid._updateHandler = updateLatLonLabels;
}

export function disableLatLonGrid(map) {
    if (!enabled) return;
    if (gridLayer) {
        map.removeLayer(gridLayer);
        gridLayer = null;
    }
    if (labelOverlay) {
        labelOverlay.remove();
        labelOverlay = null;
    }
    if (enableLatLonGrid._updateHandler) {
        map.off('move', enableLatLonGrid._updateHandler);
        map.off('zoom', enableLatLonGrid._updateHandler);
    }
    enabled = false;
}

export function isLatLonGridEnabled() {
    return enabled;
}

function drawLatLonGrid(map) {
    const bounds = map.getBounds();
    const minLat = Math.floor(bounds.getSouth());
    const maxLat = Math.ceil(bounds.getNorth());
    const minLng = Math.floor(bounds.getWest());
    const maxLng = Math.ceil(bounds.getEast());
    const lines = [];

    // Draw latitude lines
    for (let lat = minLat; lat <= maxLat; lat++) {
        lines.push(L.polyline([
            [lat, minLng],
            [lat, maxLng]
        ], { color: '#888', weight: 1, opacity: 0.5, interactive: false }));
    }

    // Draw longitude lines
    for (let lng = minLng; lng <= maxLng; lng++) {
        lines.push(L.polyline([
            [minLat, lng],
            [maxLat, lng]
        ], { color: '#888', weight: 1, opacity: 0.5, interactive: false }));
    }

    // Group all lines into a single layer group
    return L.layerGroup(lines).addTo(map);
}

function addLatLonLabels(map) {
    // Remove any existing label container
    const old = document.querySelector('.latlon-labels');
    if (old) old.remove();

    const mapContainer = map.getContainer();
    const bounds = map.getBounds();
    const minLat = Math.floor(bounds.getSouth());
    const maxLat = Math.ceil(bounds.getNorth());
    const minLng = Math.floor(bounds.getWest());
    const maxLng = Math.ceil(bounds.getEast());

    // Create overlay container
    const overlay = document.createElement('div');
    overlay.className = 'latlon-labels';
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.pointerEvents = 'none';

    // Add latitude labels (left side)
    for (let lat = minLat; lat <= maxLat; lat++) {
        const latPoint = map.latLngToContainerPoint([lat, bounds.getWest()]);
        const label = document.createElement('div');
        label.className = 'lat-label';
        label.style.top = `${latPoint.y}px`;
        label.textContent = lat;
        overlay.appendChild(label);
    }

    // Add longitude labels (bottom)
    for (let lng = minLng; lng <= maxLng; lng++) {
        const lngPoint = map.latLngToContainerPoint([bounds.getSouth(), lng]);
        const label = document.createElement('div');
        label.className = 'lon-label';
        label.style.left = `${lngPoint.x}px`;
        label.textContent = lng;
        overlay.appendChild(label);
    }

    // Append overlay to map container
    mapContainer.appendChild(overlay);

    // Return overlay for later removal
    return {
        remove: () => {
            if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        }
    };
}