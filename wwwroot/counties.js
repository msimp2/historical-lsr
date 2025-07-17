let countiesLayer = null;
let lastColor = '#ff8800';

export function addCountiesLayer(map, color = '#ff8800') {
    lastColor = color;
    if (countiesLayer) {
        map.removeLayer(countiesLayer);
        countiesLayer = null;
    }
    countiesLayer = L.geoJSON(null, {
        style: {
            color: color,
            weight: 1.5,
            fill: false
        }
    });
    fetch('GeoJSON/Counties.json')
        .then(response => response.json())
        .then(data => {
            countiesLayer.addData(data);
            countiesLayer.addTo(map);
        });
}

export function removeCountiesLayer(map) {
    if (countiesLayer) {
        map.removeLayer(countiesLayer);
        countiesLayer = null;
    }
}

export function updateCountiesLayerColor(map, color) {
    if (countiesLayer) {
        addCountiesLayer(map, color);
    }
}