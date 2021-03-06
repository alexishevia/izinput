const dayStrRegex = /^\d{4}-\d{2}-\d{2}$/;

// from a Date object to a day string 'YYYY-MM-DD'
export function dateToDayStr(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// from a day string 'YYYY-MM-DD' to a Date object
export function dayStrToDate(dateStr, endOfDay) {
  const [year, month, day] = dateStr.split("-");
  const date = new Date(year, month - 1, day);
  if (endOfDay) {
    date.setHours(23, 59, 59, 999);
  }
  return date;
}

export function isValidDayStr(str) {
  return str && str.match(dayStrRegex);
}
