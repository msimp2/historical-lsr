import { getSelectedHour } from './Selectors/hourSelector.js';
import { getSelectedMinute } from './Selectors/minuteSelector.js';
import { getSelectedDate } from './Selectors/dateSelector.js';

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
    const url = `https://mesonet.agron.iastate.edu/geojson/lsr.geojson?west=-130&east=-60&north=50&south=20&sts=${sts}&ets=${ets}`;
    return url;
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

document.addEventListener('DOMContentLoaded', () => {
    // Assumes map is initialized in leaflet.js and available as window.map
    const map = window.map;
    if (!map) {
        console.error("Map instance not found. Ensure map is initialized before lsr.js runs.");
        return;
    }
    const markersLayer = L.layerGroup();
    map.addLayer(markersLayer);

    // Get selectors
    const dateInput = document.getElementById('datePicker');
    const plotLsrBtn = document.getElementById('plotLsrBtn');

    plotLsrBtn.addEventListener('click', async () => {
        const selectedDate = getSelectedDate();
        const selectedHour = getSelectedHour();
        const selectedMinute = getSelectedMinute();

        if (!selectedDate || !selectedHour || !selectedMinute) {
            alert("Please select date, hour, and minute.");
            return;
        }

        const url = buildLSRUrl(selectedDate, selectedHour, selectedMinute);
        const data = await fetchAndExtractLSRData(url);
        plotLSRData(map, markersLayer, data);
    });
});

//Avalanche,Blizzard,Blowing Dust,Coastal Flood,Debris Flow,Downburst,Drought,Dust Storm,Extreme Cold,Extreme Heat,Flash Flood,Flood,Fog,
//Freezing Rain,Funnel Cloud,Hail,High Surf,High Sust Winds,Ice Jam,Ice Jam Flooding,Landslide,Landspout,Lightning,Marine Hail,Marine Tstm Wind,Misc Mrn / Srf Hzd
//Non - Tstm Wnd Dmg,Non - Tstm Wnd Gst,Rain,Rip Currents,Seiche,Sleet,Sneaker Wave,Snow,Snow Squall,Snow / Ice Dmg,Storm Surge,Tornado,Tropical Cyclone,Tstm Wnd Dmg
//Tstm Wnd Gst,Tsunami,Vog,Volcanic Ash,Waterspout,Wildfire,Wind Chill,
function getMarkerForType(item) {
    if (item.typetext && item.typetext.toUpperCase() === 'DEBRIS FLOW') return L.marker([item.lat, item.lon], { icon: debrisflowIcon });
    if (item.typetext && item.typetext.toUpperCase() === 'DUST STORM') return L.marker([item.lat, item.lon], { icon: duststormIcon });
    if (item.typetext && item.typetext.toUpperCase() === 'EXTREME COLD') return L.marker([item.lat, item.lon], { icon: extremecoldIcon });
    if (item.typetext && item.typetext.toUpperCase() === 'EXTREME HEAT') return L.marker([item.lat, item.lon], { icon: heatIcon });
    if (item.typetext && item.typetext.toUpperCase() === 'FLOOD') return L.marker([item.lat, item.lon], { icon: floodIcon });
    if (item.typetext && item.typetext.toUpperCase() === 'FLASH FLOOD') return L.marker([item.lat, item.lon], { icon: flashfloodIcon });
    if (item.typetext && item.typetext.toUpperCase() === 'FOG') return L.marker([item.lat, item.lon], { icon: fogIcon });
    if (item.typetext && item.typetext.toUpperCase() === 'FUNNEL CLOUD') return L.marker([item.lat, item.lon], { icon: funnelcloudIcon });
    if (item.typetext && item.typetext.toUpperCase() === 'HAIL') return L.marker([item.lat, item.lon], { icon: hailIcon });
    if (item.typetext && item.typetext.toUpperCase() === 'LIGHTNING') return L.marker([item.lat, item.lon], { icon: lightningIcon });
    if (item.typetext && item.typetext.toUpperCase() === 'MARINE TSTM WIND') return L.marker([item.lat, item.lon], { icon: marinewindIcon });
    if (item.typetext && item.typetext.toUpperCase() === 'NON-TSTM WND GST') return L.marker([item.lat, item.lon], { icon: windnotstmIcon });
    if (item.typetext && item.typetext.toUpperCase() === 'RAIN') return L.marker([item.lat, item.lon], { icon: rainIcon });
    if (item.typetext && item.typetext.toUpperCase() === 'RIP CURRENTS') return L.marker([item.lat, item.lon], { icon: ripcurrentIcon });
    if (item.typetext && item.typetext.toUpperCase() === 'SNOW') return L.marker([item.lat, item.lon], { icon: snowIcon });
    if (item.typetext && item.typetext.toUpperCase() === 'TORNADO') return L.marker([item.lat, item.lon], { icon: tornadoIcon });
    if (item.typetext && item.typetext.toUpperCase() === 'TSTM WND GST') return L.marker([item.lat, item.lon], { icon: tstmwndgstIcon });
    if (item.typetext && item.typetext.toUpperCase() === 'TSTM WND DMG') return L.marker([item.lat, item.lon], { icon: tstmwnddmgIcon });
    if (item.typetext && item.typetext.toUpperCase() === 'WATERSPOUT') return L.marker([item.lat, item.lon], { icon: waterspoutIcon });
    if (item.typetext && item.typetext.toUpperCase() === 'WILDFIRE') return L.marker([item.lat, item.lon], { icon: wildfireIcon });

    else {
        console.log("else");
        // Default: black circle marker
        return L.circleMarker([item.lat, item.lon], {
            radius: 7,
            color: '#000000',
            fillColor: '#000000',
            fillOpacity: 0.8,
            weight: 2
        });
    }
}


// Custom icon for DEBRIS FLOW
const debrisflowIcon = L.icon({
    iconUrl: 'icons/debris.png',
    iconSize: [20, 20],
    iconAnchor: [0, 0],
    popupAnchor: [0, -32]
});

// Custom icon for DUST STORM
const duststormIcon = L.icon({
    iconUrl: 'icons/duststorm.png',
    iconSize: [20, 20],
    iconAnchor: [0, 0],
    popupAnchor: [0, -32]
});

// Custom icon for EXTREME COLD
const extremecoldIcon = L.icon({
    iconUrl: 'icons/extremecold.png',
    iconSize: [20, 20],
    iconAnchor: [0, 0],
    popupAnchor: [0, -32]
});

// Custom icon for EXTREME HEAT
const heatIcon = L.icon({
    iconUrl: 'icons/heat.png', // Adjust path if needed
    iconSize: [20, 20],        // Set to your image size or desired size
    iconAnchor: [0, 0],      // Point of the icon which will correspond to marker's location
    popupAnchor: [0, -32]      // Point from which the popup should open relative to the iconAnchor
});

// Custom icon for FLOOD
const floodIcon = L.icon({
    iconUrl: 'icons/flood.png',
    iconSize: [20, 20],
    iconAnchor: [0, 0],
    popupAnchor: [0, -32]
});

// Custom icon for FLASH FLOOD
const flashfloodIcon = L.icon({
    iconUrl: 'icons/flood.png',
    iconSize: [20, 20],
    iconAnchor: [0, 0],
    popupAnchor: [0, -32]
});

// Custom icon for FOG
const fogIcon = L.icon({
    iconUrl: 'icons/fog.png',
    iconSize: [20, 20],
    iconAnchor: [0, 0],
    popupAnchor: [0, -32]
});

// Custom icon for FUNNEL CLOUD
const funnelcloudIcon = L.icon({
    iconUrl: 'icons/funnel.png',
    iconSize: [20, 20],
    iconAnchor: [0, 0],
    popupAnchor: [0, -32]
});

// Custom icon for HAIL
const hailIcon = L.icon({
    iconUrl: 'icons/hail.png',
    iconSize: [20, 20],
    iconAnchor: [0, 0],
    popupAnchor: [0, -32]
});

// Custom icon for LIGHTNING
const lightningIcon = L.icon({
    iconUrl: 'icons/lightning.png',
    iconSize: [20, 20],
    iconAnchor: [0, 0],
    popupAnchor: [0, -32]
});

// Custom icon for MARINE TSTM WIND
const marinewindIcon = L.icon({
    iconUrl: 'icons/wind.png',
    iconSize: [20, 20],
    iconAnchor: [0, 0],
    popupAnchor: [0, -32]
});

// Custom icon for NON-TSTM WND GST
const windnotstmIcon = L.icon({
    iconUrl: 'icons/wind.png',
    iconSize: [20, 20],
    iconAnchor: [0, 0],
    popupAnchor: [0, -32]
});

// Custom icon for RAIN
const rainIcon = L.icon({
    iconUrl: 'icons/rain.png',
    iconSize: [20, 20],
    iconAnchor: [0, 0],
    popupAnchor: [0, -32]
});

// Custom icon for RIP CURRENTS
const ripcurrentIcon = L.icon({
    iconUrl: 'icons/ripcurrent.png',
    iconSize: [20, 20],
    iconAnchor: [0, 0],
    popupAnchor: [0, -32]
});

// Custom icon for SNOW
const snowIcon = L.icon({
    iconUrl: 'icons/snow.png',
    iconSize: [20, 20],
    iconAnchor: [0, 0],
    popupAnchor: [0, -32]
});

// Custom icon for TORNADO
const tornadoIcon = L.icon({
    iconUrl: 'icons/tornado.png',
    iconSize: [20, 20],
    iconAnchor: [0, 0],
    popupAnchor: [0, -32]
});

// Custom icon for TSTM WND DMG
const tstmwnddmgIcon = L.icon({
    iconUrl: 'icons/winddmg.png',
    iconSize: [20, 20],
    iconAnchor: [0, 0],
    popupAnchor: [0, -32]
});

// Custom icon for TSTM WND GUST
const tstmwndgstIcon = L.icon({
    iconUrl: 'icons/wind.png',
    iconSize: [20, 20],
    iconAnchor: [0, 0],
    popupAnchor: [0, -32]
});

// Custom icon for WATERSPOUT
const waterspoutIcon = L.icon({
    iconUrl: 'icons/waterspout.png',
    iconSize: [20, 20],
    iconAnchor: [0, 0],
    popupAnchor: [0, -32]
});

// Custom icon for WILDFIRE
const wildfireIcon = L.icon({
    iconUrl: 'icons/wildfire.png',
    iconSize: [20, 20],
    iconAnchor: [0, 0],
    popupAnchor: [0, -32]
});