export function getInitialPeriod() {
  const today = new Date();
  const year = Math.min(Math.max(today.getFullYear(), 2025), 2040);
  return { year, month: today.getMonth() };
}

export function isEntryInPeriod(entry, period) {
  const date = new Date(`${entry.date}T00:00:00`);
  return date.getFullYear() === Number(period.year) && date.getMonth() === Number(period.month);
}

export function getDaysInMonth(year, month) {
  return new Date(Number(year), Number(month) + 1, 0).getDate();
}

export function toDateInputValue(year, month, day = 1) {
  const safeDay = String(day).padStart(2, '0');
  const safeMonth = String(Number(month) + 1).padStart(2, '0');
  return `${year}-${safeMonth}-${safeDay}`;
}
