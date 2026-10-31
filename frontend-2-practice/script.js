const now = new Date();
const TODAY = { day: now.getDate(), month: now.getMonth(), year: now.getFullYear() };

const MONTHS = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];

const MONTHS_GENITIVE = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря"
];

const DAYS_OF_WEEK = [
  "Воскресенье", "Понедельник", "Вторник", "Среда", 
  "Четверг", "Пятница", "Суббота"
];

const DAYS_OF_WEEK_ACCUSATIVE = [
  "Воскресенье", "Понедельник", "Вторник", "Среду", 
  "Четверг", "Пятницу", "Субботу"
];

function fetchSlotsForDay(day) {
  if (day % 2 === 0) {
    return [
      { time: "10:00", available: true }, { time: "11:00", available: false },
      { time: "12:00", available: true }, { time: "13:00", available: false },
      { time: "14:00", available: true }, { time: "15:00", available: true },
      { time: "16:00", available: true }, { time: "17:00", available: true }
    ];
  } else {
    return [
      { time: "10:00", available: true }, { time: "11:00", available: true },
      { time: "12:00", available: false }, { time: "13:00", available: true },
      { time: "14:00", available: true }, { time: "15:00", available: false },
      { time: "16:00", available: true }, { time: "17:00", available: true }
    ];
  }
}

let state = {
  currentMonth: TODAY.month,
  currentYear: TODAY.year,
  selectedDay: TODAY.day,
  selectedTime: null,
  slots: []
};

function buildCalendarGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();
  const offset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
  const prevMonthLastDay = new Date(year, month, 0).getDate();

  const cells = [];
  for (let i = offset - 1; i >= 0; i--) {
    cells.push({ day: prevMonthLastDay - i, otherMonth: true });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, otherMonth: false });
  }
  const totalCells = Math.ceil(cells.length / 7) * 7;
  let nextDay = 1;
  while (cells.length < totalCells) {
    cells.push({ day: nextDay, otherMonth: true });
    nextDay++;
  }
  return cells;
}

function compareDates(date1, date2) {
  const d1 = new Date(date1.year, date1.month, date1.day);
  const d2 = new Date(date2.year, date2.month, date2.day);
  if (d1 < d2) return -1;
  if (d1 > d2) return 1;
  return 0;
}

function isDateSelectable(day, month, year) {
  const cellDate = { day: day, month: month, year: year };
  return compareDates(cellDate, TODAY) >= 0; 
}

function updateNextButtonState() {
  const nextBtn = document.querySelector(".btn-next");
  if (nextBtn) {
    if (!state.selectedDay || !state.selectedTime) {
      nextBtn.disabled = true;
    } else {
      nextBtn.disabled = false;
    }
  }
}

function renderCalendar() {
  const grid = document.getElementById("calendarGrid");
  const title = document.getElementById("monthTitle");
  
  title.textContent = `${MONTHS[state.currentMonth]} ${state.currentYear}`;

  const cells = buildCalendarGrid(state.currentYear, state.currentMonth);
  
  let html = `
    <div class="weekday">Пн</div><div class="weekday">Вт</div>
    <div class="weekday">Ср</div><div class="weekday">Чт</div>
    <div class="weekday">Пт</div><div class="weekday">Сб</div>
    <div class="weekday">Вс</div>
  `;

  cells.forEach(cell => {
    let classes = "day";
    if (cell.otherMonth) classes += " disabled";
    if (!cell.otherMonth && !isDateSelectable(cell.day, state.currentMonth, state.currentYear)) {
      classes += " disabled"; 
    }
    if (!cell.otherMonth && state.selectedDay !== null && cell.day === state.selectedDay) {
      classes += " active"; 
    }

    html += `<div class="${classes}" data-day="${cell.day}" data-other="${cell.otherMonth}">${cell.day}</div>`;
  });

  grid.innerHTML = html;

  const activeDays = grid.querySelectorAll(".day:not(.disabled)");
  activeDays.forEach(dayEl => {
    dayEl.addEventListener("click", onDayClick);
  });
}

function renderTimeSlots() {
  const timeGrid = document.getElementById("timeGrid");
  timeGrid.innerHTML = "";

  state.slots.forEach(slot => {
    const btn = document.createElement("button");
    btn.className = "time-slot";
    btn.textContent = slot.time;

    if (!slot.available) {
      btn.classList.add("disabled");
      btn.disabled = true;
    } else if (slot.time === state.selectedTime) {
      btn.classList.add("selected");
    }

    if (slot.available) {
      btn.addEventListener("click", () => onTimeSlotClick(slot.time));
    }
    timeGrid.appendChild(btn);
  });
}

function updateBottomBar() {
  const valueEl = document.getElementById("selectedDateTime");
  
  if (!state.selectedDay) {
    valueEl.textContent = "Выберите дату";
    return;
  }

  const dateObj = new Date(state.currentYear, state.currentMonth, state.selectedDay);
  const dayName = DAYS_OF_WEEK[dateObj.getDay()];
  const timePart = state.selectedTime ? state.selectedTime : "время не выбрано";

  valueEl.textContent = `${dayName}, ${state.selectedDay} ${MONTHS_GENITIVE[state.currentMonth]} ${state.currentYear} • ${timePart}`;
}

function onDayClick(event) {
  const day = parseInt(event.currentTarget.dataset.day);
  
  state.selectedDay = day;
  state.selectedTime = null; 
  state.slots = fetchSlotsForDay(day);

  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
  updateNextButtonState();
}

function onTimeSlotClick(time) {
  state.selectedTime = time;
  renderTimeSlots();
  updateBottomBar();
  updateNextButtonState();
}

function setupMonthNavigation() {
  function handleMonthChange() {
    state.selectedDay = null;
    state.selectedTime = null;
    state.slots = [];
    
    renderCalendar();
    renderTimeSlots();
    updateBottomBar(); 
    updateNextButtonState();
  }

  document.getElementById("prevMonthBtn").addEventListener("click", () => {
    state.currentMonth--;
    if (state.currentMonth < 0) { state.currentMonth = 11; state.currentYear--; }
    handleMonthChange();
  });

  document.getElementById("nextMonthBtn").addEventListener("click", () => {
    state.currentMonth++;
    if (state.currentMonth > 11) { state.currentMonth = 0; state.currentYear++; }
    handleMonthChange();
  });
}

function setupNextButton() {
  const nextBtn = document.querySelector(".btn-next");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (!state.selectedDay || !state.selectedTime) return;
      
      if (!isDateSelectable(state.selectedDay, state.currentMonth, state.currentYear)) {
        alert("Выбранная дата недоступна для записи.");
        return;
      }

      const dateObj = new Date(state.currentYear, state.currentMonth, state.selectedDay);
      const dayNameAccusative = DAYS_OF_WEEK_ACCUSATIVE[dateObj.getDay()];

      alert(`Успешно! Вы записаны на ${dayNameAccusative}, ${state.selectedDay} ${MONTHS_GENITIVE[state.currentMonth]} в ${state.selectedTime}.`);
    });
  }
}

function init() {
  state.slots = fetchSlotsForDay(state.selectedDay);
  
  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
  updateNextButtonState();

  setupMonthNavigation();
  setupNextButton();
}

document.addEventListener("DOMContentLoaded", init);