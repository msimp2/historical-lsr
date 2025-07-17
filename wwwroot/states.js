let statesLayer = null;

export function addStatesLayer(map) {
    if (statesLayer) return;
    statesLayer = L.geoJSON(null, {
        style: {
            color: '#3388ff',
            weight: 2,
            fill: false
        }
    });
    fetch('GeoJSON/States.json')
        .then(response => response.json())
        .then(data => {
            statesLayer.addData(data);
            statesLayer.addTo(map);
        });
}

export function removeStatesLayer(map) {
    if (statesLayer) {
        map.removeLayer(statesLayer);
        statesLayer = null;
    }
}