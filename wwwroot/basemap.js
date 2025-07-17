// Add this after your existing code, or in your initialization logic
document.addEventListener('DOMContentLoaded', () => {
    const gridColorMode = document.getElementById('gridColorMode');
    if (gridColorMode) {
        gridColorMode.addEventListener('change', (e) => {
            const mode = e.target.value;
            const color = gridColors[mode] || gridColors.default;
            // Assuming you have a reference to your map instance
            if (enabled) {
                showGrid(window.leafletMapInstance, color);
            }
        });
    }
});