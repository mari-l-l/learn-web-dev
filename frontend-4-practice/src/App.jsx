import { useState, useEffect } from "react";
import Header from "./components/Header";
import Steps from "./components/Steps";
import Calendar from "./components/Calendar";
import TimeSlots from "./components/TimeSlots";
import BottomBar from "./components/BottomBar";
import Footer from "./components/Footer";
import { fetchToday, fetchSlots } from "./api";
import { MONTHS_GENITIVE, DAYS_OF_WEEK_ACCUSATIVE, isDateSelectable } from "./date";

export default function App() {
  const [today, setToday] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [slots, setSlots] = useState([]);

  const [loadingToday, setLoadingToday] = useState(true);
  const [errorToday, setErrorToday] = useState(null);

  const [loadingSlots, setLoadingSlots] = useState(false);
  const [errorSlots, setErrorSlots] = useState(null);

  useEffect(() => {
    async function loadToday() {
      try {
        setLoadingToday(true);
        setErrorToday(null);
        const data = await fetchToday();
        setToday(data);
        setCurrentMonth(data.month);
        setCurrentYear(data.year);
        setSelectedDay(data.day);
      } catch (err) {
        setErrorToday(err.message);
      } finally {
        setLoadingToday(false);
      }
    }
    loadToday();
  }, []);

  useEffect(() => {
    if (selectedDay === null) return;

    let isCancelled = false;

    async function loadSlots() {
      try {
        setLoadingSlots(true);
        setErrorSlots(null);
        setSlots([]);
        const data = await fetchSlots({ day: selectedDay, month: currentMonth, year: currentYear });

        if (isCancelled) return;
        if (
          data.date.day !== selectedDay ||
          data.date.month !== currentMonth ||
          data.date.year !== currentYear
        ) {
          return;
        }
        setSlots(data.slots);
      } catch (err) {
        if (!isCancelled) {
          setErrorSlots(err.message);
          setSlots([]);
        }
      } finally {
        if (!isCancelled) setLoadingSlots(false);
      }
    }
    loadSlots();

    return () => {
      isCancelled = true;
    };
  }, [selectedDay, currentMonth, currentYear]);

  const handleDayClick = (day) => {
    setSelectedDay(day);
    setSelectedTime(null);
    setSlots([]);
  };

  const handleTimeClick = (time) => {
    setSelectedTime(time);
  };

  const handlePrevMonth = () => {
    let newMonth = currentMonth - 1;
    let newYear = currentYear;
    if (newMonth < 0) { newMonth = 11; newYear--; }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    setSelectedDay(null);
    setSelectedTime(null);
    setSlots([]);
  };

  const handleNextMonth = () => {
    let newMonth = currentMonth + 1;
    let newYear = currentYear;
    if (newMonth > 11) { newMonth = 0; newYear++; }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    setSelectedDay(null);
    setSelectedTime(null);
    setSlots([]);
  };

  const handleNextButton = () => {
    if (!selectedDay || !selectedTime) return;
    if (!isDateSelectable(selectedDay, currentMonth, currentYear, today)) {
      alert("Выбранная дата недоступна для записи.");
      return;
    }
    const dateObj = new Date(currentYear, currentMonth, selectedDay);
    const dayNameAccusative = DAYS_OF_WEEK_ACCUSATIVE[dateObj.getDay()];
    alert(`Успешно! Вы записаны на ${dayNameAccusative}, ${selectedDay} ${MONTHS_GENITIVE[currentMonth]} в ${selectedTime}.`);
  };

  if (loadingToday) {
    return (
      <div className="page">
        <Header />
        <div className="main-content" style={{ textAlign: "center", padding: "100px 0", flex: 1 }}>
          <h2>Загрузка...</h2>
        </div>
        <Footer />
      </div>
    );
  }

  if (errorToday) {
    return (
      <div className="page">
        <Header />
        <div className="main-content" style={{ textAlign: "center", padding: "100px 0", color: "red", flex: 1 }}>
          <h2>Ошибка сервера: {errorToday}</h2>
        </div>
        <Footer />
      </div>
    );
  }

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
              today={today}
              onDayClick={handleDayClick}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
            />
            <TimeSlots
              slots={slots}
              selectedTime={selectedTime}
              loading={loadingSlots}
              error={errorSlots}
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