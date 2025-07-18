import { TDWR } from '../Reference/TDWR.js';

let tdwrLayer = null;

export function addTdwrLayer(map) {
    if (tdwrLayer) {
        map.removeLayer(tdwrLayer);
        tdwrLayer = null;
    }
    tdwrLayer = L.layerGroup();

    TDWR.forEach(station => {
        // Circle marker
        const marker = L.circleMarker([station.Latitude, station.Longitude], {
            radius: 6,
            fillColor: '#00AA00',
            color: '#00AA00',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.9
        }).bindPopup(
            `<strong>${station.Name}</strong><br>
            Latitude: ${station.Latitude}<br>
            Longitude: ${station.Longitude}<br>
            MSL Height: ${station.MSLHeight}`
        );
        tdwrLayer.addLayer(marker);

        // Label marker above the circle
        const label = L.marker([station.Latitude, station.Longitude], {
            icon: L.divIcon({
                className: 'tdwr-label',
                html: `<span>${station.Name}</span>`,
                iconSize: [60, 18],
                iconAnchor: [30, 30] // center bottom
            }),
            interactive: false
        });
        tdwrLayer.addLayer(label);
    });

    tdwrLayer.addTo(map);
}

export function removeTdwrLayer(map) {
    if (tdwrLayer) {
        map.removeLayer(tdwrLayer);
        tdwrLayer = null;
    }
}