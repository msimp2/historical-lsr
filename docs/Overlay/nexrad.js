import { NEXRAD } from '../Reference/NEXRAD.js';

let nexradLayer = null;

export function addNexradLayer(map) {
    if (nexradLayer) {
        map.removeLayer(nexradLayer);
        nexradLayer = null;
    }
    nexradLayer = L.layerGroup();

    NEXRAD.forEach(station => {
        // Circle marker
        const marker = L.circleMarker([station.Latitude, station.Longitude], {
            radius: 6,
            fillColor: '#0074D9',
            color: '#0074D9',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.9
        }).bindPopup(
            `<strong>${station.Name}</strong><br>
            Latitude: ${station.Latitude}<br>
            Longitude: ${station.Longitude}<br>
            MSL Height: ${station.MSLHeight}`
        );
        nexradLayer.addLayer(marker);

        // Label marker (slightly offset to appear above the circle)
        const label = L.marker([station.Latitude, station.Longitude], {
            icon: L.divIcon({
                className: 'nexrad-label',
                html: `<span>${station.Name}</span>`,
                iconSize: [60, 18],
                iconAnchor: [30, 30] // center bottom
            }),
            interactive: false
        });
        nexradLayer.addLayer(label);
    });

    nexradLayer.addTo(map);
}

export function removeNexradLayer(map) {
    if (nexradLayer) {
        map.removeLayer(nexradLayer);
        nexradLayer = null;
    }
}