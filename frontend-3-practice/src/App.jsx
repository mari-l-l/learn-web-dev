import { useState } from 'react';
import Header from './components/Header';
import Steps from './components/Steps';
import Calendar from './components/Calendar';
import TimeSlots from './components/TimeSlots';
import BottomBar from './components/BottomBar';
import Footer from './components/Footer';
import { 
  TODAY, MONTHS_GENITIVE, DAYS_OF_WEEK_ACCUSATIVE, 
  fetchSlotsForDay, isDateSelectable 
} from './date';

export default function App() {
  const [currentMonth, setCurrentMonth] = useState(TODAY.month);
  const [currentYear, setCurrentYear] = useState(TODAY.year);
  const [selectedDay, setSelectedDay] = useState(TODAY.day);
  const [selectedTime, setSelectedTime] = useState(null);
  const [slots, setSlots] = useState(fetchSlotsForDay(TODAY.day));

  const handleDayClick = (day) => {
    setSelectedDay(day);
    setSelectedTime(null);
    setSlots(fetchSlotsForDay(day));
  };

  const handleTimeClick = (time) => {
    setSelectedTime(time);
  };

  const handlePrevMonth = () => {
    let newMonth = currentMonth - 1;
    let newYear = currentYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    setSelectedDay(null);
    setSelectedTime(null);
    setSlots([]);
  };

  const handleNextMonth = () => {
    let newMonth = currentMonth + 1;
    let newYear = currentYear;
    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    setSelectedDay(null);
    setSelectedTime(null);
    setSlots([]);
  };

  const handleNextButton = () => {
    if (!selectedDay || !selectedTime) return;
    if (!isDateSelectable(selectedDay, currentMonth, currentYear)) {
      alert("Выбранная дата недоступна для записи.");
      return;
    }
    const dateObj = new Date(currentYear, currentMonth, selectedDay);
    const dayNameAccusative = DAYS_OF_WEEK_ACCUSATIVE[dateObj.getDay()];
    alert(`Успешно! Вы записаны на ${dayNameAccusative}, ${selectedDay} ${MONTHS_GENITIVE[currentMonth]} в ${selectedTime}.`);
  };

  return (
    <div className="page">
      <div className="container">
        <Header />
        <Steps />
        
        <main className="main-content">
          <h1 className="page-title">Выбор даты и времени</h1>
          
          <div className="booking-wrapper">
            <Calendar 
              currentMonth={currentMonth}
              currentYear={currentYear}
              selectedDay={selectedDay}
              onDayClick={handleDayClick}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
            />
            <TimeSlots 
              slots={slots}
              selectedTime={selectedTime}
              onTimeClick={handleTimeClick}
            />
          </div>

          <BottomBar 
            selectedDay={selectedDay}
            selectedTime={selectedTime}
            currentMonth={currentMonth}
            currentYear={currentYear}
            onNextClick={handleNextButton}
          />
        </main>
      </div>
      <Footer />
    </div>
  );
}