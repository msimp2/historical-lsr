export function setupDateSelector() {
    const btn = document.getElementById('datePickerBtn');

    // Create year, month, day inputs ONCE, to the left of the button
    let yearInput = document.getElementById('yearInput');
    let monthInput = document.getElementById('monthInput');
    let dayInput = document.getElementById('dayInput');

    if (!yearInput || !monthInput || !dayInput) {
        yearInput = document.createElement('input');
        yearInput.type = 'number';
        yearInput.id = 'yearInput';
        yearInput.placeholder = 'YYYY';
        yearInput.style.width = '60px';
        yearInput.min = '1900';
        yearInput.max = '2100';

        monthInput = document.createElement('input');
        monthInput.type = 'number';
        monthInput.id = 'monthInput';
        monthInput.placeholder = 'MM';
        monthInput.style.width = '40px';
        monthInput.min = '1';
        monthInput.max = '12';

        dayInput = document.createElement('input');
        dayInput.type = 'number';
        dayInput.id = 'dayInput';
        dayInput.placeholder = 'DD';
        dayInput.style.width = '40px';
        dayInput.min = '1';
        dayInput.max = '31';

        // Insert inputs to the left of the button
        btn.parentNode.insertBefore(yearInput, btn);
        btn.parentNode.insertBefore(monthInput, btn);
        btn.parentNode.insertBefore(dayInput, btn);
    }

    let calendarInput = null;

    btn.addEventListener('click', (e) => {
        // Remove any existing calendar
        if (calendarInput) {
            calendarInput.remove();
            calendarInput = null;
        }

        // Create the calendar input (native date picker)
        calendarInput = document.createElement('input');
        calendarInput.type = 'date';
        calendarInput.style.position = 'absolute';
        calendarInput.style.zIndex = '1000';

        // Position above the button
        const rect = btn.getBoundingClientRect();
        calendarInput.style.left = `${rect.left + window.scrollX}px`;
        calendarInput.style.top = `${rect.top + window.scrollY - 40}px`; // 40px above

        document.body.appendChild(calendarInput);
        calendarInput.focus();

        // When a date is picked, update year/month/day fields and hide the calendar
        calendarInput.addEventListener('change', () => {
            if (calendarInput.value) {
                const [yyyy, mm, dd] = calendarInput.value.split('-');
                yearInput.value = yyyy;
                monthInput.value = mm;
                dayInput.value = dd;
            }
            calendarInput.remove();
            calendarInput = null;
        });

        // Hide if clicking outside
        document.addEventListener('mousedown', function hideCalendar(ev) {
            if (calendarInput && !calendarInput.contains(ev.target) && ev.target !== btn) {
                calendarInput.remove();
                calendarInput = null;
                document.removeEventListener('mousedown', hideCalendar);
            }
        });
    });
}