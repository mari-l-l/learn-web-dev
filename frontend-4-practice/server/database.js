export const database = {
  today: { day: new Date().getDate(), month: new Date().getMonth(), year: new Date().getFullYear() },
  slots: {
    even: [
      { time: "10:00", available: true }, { time: "11:00", available: false },
      { time: "12:00", available: true }, { time: "13:00", available: false },
      { time: "14:00", available: true }, { time: "15:00", available: true },
      { time: "16:00", available: true }, { time: "17:00", available: true }
    ],
    odd: [
      { time: "10:00", available: true }, { time: "11:00", available: true },
      { time: "12:00", available: false }, { time: "13:00", available: true },
      { time: "14:00", available: true }, { time: "15:00", available: false },
      { time: "16:00", available: true }, { time: "17:00", available: true }
    ]
  }
};