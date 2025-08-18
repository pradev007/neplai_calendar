document.addEventListener('DOMContentLoaded', function() {
    // Current date display
    updateCurrentDate();
    
    // Calendar setup
    setupCalendar();
    
    // Date converter setup
    setupDateConverter();
    
    // Update current date every minute
    setInterval(updateCurrentDate, 60000);
});

function updateCurrentDate() {
    const now = new Date();
    
    // English date
    const englishDateStr = formatEnglishDate(now);
    document.getElementById('english-date').textContent = englishDateStr;
    
    // Nepali date
    const nepaliDate = englishToNepali(now);
    if (nepaliDate) {
        const nepaliDateStr = formatNepaliDate(nepaliDate.year, nepaliDate.month, nepaliDate.day);
        document.getElementById('nepali-date').textContent = nepaliDateStr;
    }
    
    // Day of week
    const dayIndex = getDayOfWeek(now);
    const nepaliDay = nepaliDays[dayIndex];
    const englishDay = englishDays[dayIndex];
    document.getElementById('day').textContent = `${nepaliDay} / ${englishDay}`;
}

function setupCalendar() {
    const calendarEl = document.getElementById('calendar');
    const monthYearEl = document.getElementById('month-year');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    
    let currentDate = new Date();
    let currentNepaliDate = englishToNepali(currentDate);
    
    // Display current month initially
    renderCalendar(currentNepaliDate.year, currentNepaliDate.month);
    
    // Previous month button
    prevMonthBtn.addEventListener('click', function() {
        if (currentNepaliDate.month === 1) {
            currentNepaliDate.year--;
            currentNepaliDate.month = 12;
        } else {
            currentNepaliDate.month--;
        }
        renderCalendar(currentNepaliDate.year, currentNepaliDate.month);
    });
    
    // Next month button
    nextMonthBtn.addEventListener('click', function() {
        if (currentNepaliDate.month === 12) {
            currentNepaliDate.year++;
            currentNepaliDate.month = 1;
        } else {
            currentNepaliDate.month++;
        }
        renderCalendar(currentNepaliDate.year, currentNepaliDate.month);
    });
    
    function renderCalendar(year, month) {
        // Clear previous calendar
        calendarEl.innerHTML = '';
        
        // Set month-year title
        monthYearEl.textContent = `${nepaliMonths[month - 1]} ${year}`;
        
        // Get first day of month and total days in month
        const firstDayDate = nepaliToEnglish(year, month, 1);
        const firstDay = getDayOfWeek(firstDayDate);
        const totalDays = nepaliDateData[year][month - 1];
        
        // Get today's date for highlighting
        const today = new Date();
        const todayNepali = englishToNepali(today);
        
        // Add day headers
        const dayHeaders = ['आइत', 'सोम', 'मंगल', 'बुध', 'बिहि', 'शुक्र', 'शनि'];
        dayHeaders.forEach(day => {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day-header';
            dayEl.textContent = day;
            calendarEl.appendChild(dayEl);
        });
        
        // Add empty cells for days before first day of month
        for (let i = 0; i < firstDay; i++) {
            const emptyEl = document.createElement('div');
            emptyEl.className = 'calendar-day empty';
            calendarEl.appendChild(emptyEl);
        }
        
        // Add days of month
        for (let day = 1; day <= totalDays; day++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day';
            dayEl.textContent = day;
            
            // Highlight today
            if (todayNepali && 
                year === todayNepali.year && 
                month === todayNepali.month && 
                day === todayNepali.day) {
                dayEl.classList.add('today');
            }
            
            // Add click event to show date details
            dayEl.addEventListener('click', function() {
                const clickedDate = nepaliToEnglish(year, month, day);
                if (clickedDate) {
                    const englishDateStr = formatEnglishDate(clickedDate);
                    const nepaliDateStr = formatNepaliDate(year, month, day);
                    const dayIndex = getDayOfWeek(clickedDate);
                    const nepaliDay = nepaliDays[dayIndex];
                    const englishDay = englishDays[dayIndex];
                    
                    alert(`Nepali Date: ${nepaliDateStr}\nEnglish Date: ${englishDateStr}\nDay: ${nepaliDay} / ${englishDay}`);
                }
            });
            
            calendarEl.appendChild(dayEl);
        }
    }
}

function setupDateConverter() {
    const conversionType = document.getElementById('conversion-type');
    const englishDateInput = document.getElementById('english-date-input');
    const nepaliInputs = document.getElementById('nepali-date-inputs');
    const nepYear = document.getElementById('nep-year');
    const nepMonth = document.getElementById('nep-month');
    const nepDay = document.getElementById('nep-day');
    const convertBtn = document.getElementById('convert-btn');
    const resultEl = document.getElementById('conversion-result');
    
    // Populate Nepali year dropdown (2000-2090 BS)
    for (let year = 2000; year <= 2090; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        nepYear.appendChild(option);
    }
    
    // Populate Nepali month dropdown
    nepaliMonths.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = index + 1;
        option.textContent = month;
        nepMonth.appendChild(option);
    });
    
    // Update Nepali day dropdown when year or month changes
    function updateNepaliDays() {
        const year = parseInt(nepYear.value);
        const month = parseInt(nepMonth.value);
        
        // Clear previous days
        nepDay.innerHTML = '';
        
        // Add days based on selected year and month
        const daysInMonth = nepaliDateData[year][month - 1];
        for (let day = 1; day <= daysInMonth; day++) {
            const option = document.createElement('option');
            option.value = day;
            option.textContent = day;
            nepDay.appendChild(option);
        }
    }
    
    nepYear.addEventListener('change', updateNepaliDays);
    nepMonth.addEventListener('change', updateNepaliDays);
    
    // Initialize Nepali days
    updateNepaliDays();
    
    // Toggle between English to Nepali and Nepali to English conversion
    conversionType.addEventListener('change', function() {
        if (this.value === 'eng-to-nep') {
            englishDateInput.style.display = 'block';
            nepaliInputs.style.display = 'none';
        } else {
            englishDateInput.style.display = 'none';
            nepaliInputs.style.display = 'flex';
        }
    });
    
    // Convert button click handler
    convertBtn.addEventListener('click', function() {
        if (conversionType.value === 'eng-to-nep') {
            // English to Nepali conversion
            if (!englishDateInput.value) {
                resultEl.textContent = 'Please select an English date';
                return;
            }
            
            const engDate = new Date(englishDateInput.value);
            const nepDate = englishToNepali(engDate);
            
            if (nepDate) {
                const dayIndex = getDayOfWeek(engDate);
                const nepaliDay = nepaliDays[dayIndex];
                resultEl.innerHTML = `
                    <strong>English Date:</strong> ${formatEnglishDate(engDate)}<br>
                    <strong>Nepali Date:</strong> ${formatNepaliDate(nepDate.year, nepDate.month, nepDate.day)}<br>
                    <strong>Day:</strong> ${nepaliDay}
                `;
            } else {
                resultEl.textContent = 'Invalid date or conversion not possible';
            }
        } else {
            // Nepali to English conversion
            const year = parseInt(nepYear.value);
            const month = parseInt(nepMonth.value);
            const day = parseInt(nepDay.value);
            
            const engDate = nepaliToEnglish(year, month, day);
            
            if (engDate) {
                const dayIndex = getDayOfWeek(engDate);
                const englishDay = englishDays[dayIndex];
                resultEl.innerHTML = `
                    <strong>Nepali Date:</strong> ${formatNepaliDate(year, month, day)}<br>
                    <strong>English Date:</strong> ${formatEnglishDate(engDate)}<br>
                    <strong>Day:</strong> ${englishDay}
                `;
            } else {
                resultEl.textContent = 'Invalid Nepali date';
            }
        }
    });
    
    // Initialize with English to Nepali conversion
    englishDateInput.style.display = 'block';
    nepaliInputs.style.display = 'none';
}