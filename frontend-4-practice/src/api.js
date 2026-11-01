export async function fetchToday() {
  const response = await fetch("/api/booking/today");
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return await response.json();
}

export async function fetchSlots(date) {
  const query = `?day=${date.day}&month=${date.month}&year=${date.year}`;
  const response = await fetch(`/api/slots${query}`);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return await response.json();
}