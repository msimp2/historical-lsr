export function setupDateSelector() {
    // No setup needed if input is in HTML
    // Optionally, you can set today's date as default:
    const dateInput = document.getElementById('datePicker');
    if (dateInput && !dateInput.value) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        dateInput.value = `${yyyy}-${mm}-${dd}`;
    }
}

export function getSelectedDate() {
    const dateInput = document.getElementById('datePicker');
    if (!dateInput || !dateInput.value) return '';
    return dateInput.value; // returns 'yyyy-mm-dd'
}