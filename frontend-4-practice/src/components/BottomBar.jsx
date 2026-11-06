import { DAYS_OF_WEEK, MONTHS_GENITIVE } from '../date';

export default function BottomBar({
  selectedDay,
  selectedTime,
  currentMonth,
  currentYear,
  onNextClick,
}) {
  let dateText = 'Выберите дату';
  let timeText = 'Выберите время';

  if (selectedDay) {
    const dateObj = new Date(currentYear, currentMonth, selectedDay);
    const dayName = DAYS_OF_WEEK[dateObj.getDay()];
    dateText = `${dayName}, ${selectedDay} ${MONTHS_GENITIVE[currentMonth]} ${currentYear}`;
  }

  if (selectedTime) {
    timeText = selectedTime;
  }

  const isButtonDisabled = !selectedDay || !selectedTime;

  return (
    <div className="actions">
      <div className="selected-info">
        <span className="label">Выбранная дата и время:</span>
        <span className="value">
          {selectedDay ? `${dateText} • ${timeText}` : dateText}
        </span>
      </div>
      <button
        type="button"
        className="btn-next"
        disabled={isButtonDisabled}
        onClick={onNextClick}
      >
        Далее
      </button>
    </div>
  );
}