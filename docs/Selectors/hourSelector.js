export function setupHourSelector() {
    const container = document.getElementById('hour-selector');
    if (!container) return;

    // Clear any previous content
    container.innerHTML = '';

    // Create hour dropdown
    const hourSelect = document.createElement('select');
    hourSelect.id = 'hourSelect';
    hourSelect.style.width = '60px';
    for (let i = 0; i < 24; i++) {
        const option = document.createElement('option');
        option.value = option.textContent = String(i).padStart(2, '0');
        hourSelect.appendChild(option);
    }
    hourSelect.value = '00';

    // Create plain text label
    const hourLabel = document.createElement('span');
    hourLabel.textContent = 'Select Hour';
    hourLabel.style.marginLeft = '8px';
    hourLabel.style.fontSize = '1em';

    // Inject into container: dropdown to the left, text to the right
    container.appendChild(hourSelect);
    container.appendChild(hourLabel);
}

// Utility to get the selected hour value
export function getSelectedHour() {
    const hourSelect = document.getElementById('hourSelect');
    return hourSelect ? hourSelect.value : '00';
}