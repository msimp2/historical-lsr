// Import custom icons if needed (assumes customIcons.js is loaded globally)

// Utility to build the LSR URL
function buildLSRUrl(date, hour, minute) {
    const sts = `${date}T${hour}:${minute}Z`;
    // Default: 1 hour window
    const endDateObj = new Date(`${date}T${hour}:${minute}:00Z`);
    endDateObj.setUTCHours(endDateObj.getUTCHours() + 1);
    const endDate = endDateObj.toISOString().slice(0, 10);
    const endHour = String(endDateObj.getUTCHours()).padStart(2, '0');
    const endMinute = String(endDateObj.getUTCMinutes()).padStart(2, '0');
    const ets = `${endDate}T${endHour}:${endMinute}Z`;
    return `https://mesonet.agron.iastate.edu/geojson/lsr.geojson?west=-130&east=-60&north=50&south=20&sts=${sts}&ets=${ets}`;
}

// Fetch and extract LSR data
async function fetchAndExtractLSRData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const geojson = await response.json();
        return geojson.features.map(feature => ({
            magf: feature.properties.magf,
            typetext: feature.properties.typetext,
            time: feature.properties.valid,
            lat: feature.properties.lat,
            lon: feature.properties.lon,
        }));
    } catch (error) {
        console.error("Failed to fetch or process GeoJSON:", error);
        return [];
    }
}

// Plot LSR data on the map
function plotLSRData(map, markersLayer, data) {
    markersLayer.clearLayers();
    data.forEach(item => {
        if (item.lat && item.lon) {
            const marker = getMarkerForType(item);
            marker.bindPopup(`<strong>${item.typetext}</strong><br/>${item.time}<br/>value: ${item.magf}`);
            markersLayer.addLayer(marker);
        }
    });
}


// getMarkerForType function (relies on customIcons.js loaded globally)
function getMarkerForType(item) {
    if (item.typetext && item.typetext.toUpperCase() === 'DEBRIS FLOW') return L.marker([item.lat, item.lon], { icon: window.debrisflowIcon });
    if (item.typetext && item.typetext.toUpperCase() === 'DUST STORM') return L.marker([item.lat, item.lon], { icon: window.duststormIcon });
    if (item.typetext && item.typetext.toUpperCase() === 'EXTREME COLD') return L.marker([item.lat, item.lon], { icon: window.extremecoldIcon });
    if (item.typetext && item.typetext.toUpperCase() === 'EXTREME HEAT') return L.marker([item.lat, item.lon], { icon: window.heatIcon });
    if (item.typetext && item.typetext.toUpperCase() === 'FLOOD') return L.marker([item.lat, item.lon], { icon: window.floodIcon });
    if (item.typetext && item.typetext.toUpperCase() === 'FLASH FLOOD') return L.marker([item.lat, item.lon], { icon: window.flashfloodIcon });
    if (item.typetext && item.typetext.toUpperCase() === 'FOG') return L.marker([item.lat, item.lon], { icon: window.fogIcon });
    if (item.typetext && item.typetext.toUpperCase() === 'FUNNEL CLOUD') return L.marker([item.lat, item.lon], { icon: window.funnelcloudIcon });
    if (item.typetext && item.typetext.toUpperCase() === 'HAIL') return L.marker([item.lat, item.lon], { icon: window.hailIcon });
    if (item.typetext && item.typetext.toUpperCase() === 'LIGHTNING') return L.marker([item.lat, item.lon], { icon: window.lightningIcon });
    if (item.typetext && item.typetext.toUpperCase() === 'MARINE TSTM WIND') return L.marker([item.lat, item.lon], { icon: window.marinewindIcon });
    if (item.typetext && item.typetext.toUpperCase() === 'NON-TSTM WND GST') return L.marker([item.lat, item.lon], { icon: window.windnotstmIcon });
    if (item.typetext && item.typetext.toUpperCase() === 'RAIN') return L.marker([item.lat, item.lon], { icon: window.rainIcon });
    if (item.typetext && item.typetext.toUpperCase() === 'RIP CURRENTS') return L.marker([item.lat, item.lon], { icon: window.ripcurrentIcon });
    if (item.typetext && item.typetext.toUpperCase() === 'SNOW') return L.marker([item.lat, item.lon], { icon: window.snowIcon });
    if (item.typetext && item.typetext.toUpperCase() === 'TORNADO') return L.marker([item.lat, item.lon], { icon: window.tornadoIcon });
    if (item.typetext && item.typetext.toUpperCase() === 'TSTM WND GST') return L.marker([item.lat, item.lon], { icon: window.tstmwndgstIcon });
    if (item.typetext && item.typetext.toUpperCase() === 'TSTM WND DMG') return L.marker([item.lat, item.lon], { icon: window.tstmwnddmgIcon });
    if (item.typetext && item.typetext.toUpperCase() === 'WATERSPOUT') return L.marker([item.lat, item.lon], { icon: window.waterspoutIcon });
    if (item.typetext && item.typetext.toUpperCase() === 'WILDFIRE') return L.marker([item.lat, item.lon], { icon: window.wildfireIcon });

    // Default: black circle marker
    return L.circleMarker([item.lat, item.lon], {
        radius: 7,
        color: '#000000',
        fillColor: '#000000',
        fillOpacity: 0.8,
        weight: 2
    });
}