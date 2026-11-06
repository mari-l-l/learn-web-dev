export default function TimeSlots({ slots, selectedTime, loading, error, onTimeClick }) {
  return (
    <section className="time-card">
      <h2>Доступное время</h2>

      {loading && <p className="slots-status">Загрузка слотов…</p>}

      {!loading && error && (
        <p className="slots-status slots-status--error">Ошибка: {error}</p>
      )}

      {!loading && !error && slots.length === 0 && (
        <p className="slots-status">Выберите день, чтобы увидеть доступное время</p>
      )}

      {!loading && !error && slots.length > 0 && (
        <div className="time-grid">
          {slots.map((slot) => {
            let classes = 'time-slot';
            if (!slot.available) classes += ' disabled';
            if (slot.time === selectedTime) classes += ' selected';

            return (
              <button
                key={slot.time}
                type="button"
                className={classes}
                disabled={!slot.available}
                onClick={() => onTimeClick(slot.time)}
              >
                {slot.time}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}