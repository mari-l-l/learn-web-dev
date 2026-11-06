import { buildCalendarGrid, MONTHS, isDateSelectable } from '../date';

export default function Calendar({
  currentMonth,
  currentYear,
  selectedDay,
  today,
  onDayClick,
  onPrevMonth,
  onNextMonth,
}) {
  const cells = buildCalendarGrid(currentYear, currentMonth);

  return (
    <section className="calendar-card">
      <div className="calendar-header">
        <h2>
          {MONTHS[currentMonth]} {currentYear}
        </h2>
        <div className="arrows">
          <button type="button" onClick={onPrevMonth} aria-label="Предыдущий месяц">
            &lt;
          </button>
          <button type="button" onClick={onNextMonth} aria-label="Следующий месяц">
            &gt;
          </button>
        </div>
      </div>

      <div className="calendar-grid">
        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((d) => (
          <div key={d} className="weekday">
            {d}
          </div>
        ))}

        {cells.map((cell, index) => {
          let classes = 'day';

          const isOtherMonth = cell.otherMonth;
          const selectable =
            !isOtherMonth &&
            today &&
            isDateSelectable(cell.day, currentMonth, currentYear, today);

          if (!selectable) classes += ' disabled';
          if (!isOtherMonth && selectedDay !== null && cell.day === selectedDay) {
            classes += ' active';
          }

          return (
            <button
              key={index}
              type="button"
              className={classes}
              disabled={!selectable}
              onClick={() => {
                if (selectable) onDayClick(cell.day);
              }}
            >
              {cell.day}
            </button>
          );
        })}
      </div>
    </section>
  );
}