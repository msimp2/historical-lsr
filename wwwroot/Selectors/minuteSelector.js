export function setupMinuteSelector() {
    const container = document.getElementById('minute-selector');
    if (!container) return;

    // Clear any previous content
    container.innerHTML = '';

    // Create minute dropdown
    const minuteSelect = document.createElement('select');
    minuteSelect.id = 'minuteSelect';
    minuteSelect.style.width = '60px';
    for (let i = 0; i < 60; i++) {
        const option = document.createElement('option');
        option.value = option.textContent = String(i).padStart(2, '0');
        minuteSelect.appendChild(option);
    }
    minuteSelect.value = '00';

    // Create plain text label
    const minuteLabel = document.createElement('span');
    minuteLabel.textContent = 'Select Minute';
    minuteLabel.style.marginLeft = '8px';
    minuteLabel.style.fontSize = '1em';

    // Inject into container: dropdown to the left, text to the right
    container.appendChild(minuteSelect);
    container.appendChild(minuteLabel);
}

// Utility to get the selected minute value
export function getSelectedminute() {
    const minuteSelect = document.getElementById('minuteSelect');
    return minuteSelect ? minuteSelect.value : '00';
}