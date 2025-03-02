export function stringToDate(_date, _format, _delimiter) {
  var formatLowerCase = _format.toLowerCase(); // Make format lowercase to avoid case sensitivity issues
  var formatItems = formatLowerCase.split(_delimiter); // Split format into parts (e.g. ["dd", "mm", "yyyy"])
  var dateItems = _date.split(_delimiter); // Split the date into parts (e.g. ["12", "2", "2025"])

  var dayIndex = formatItems.indexOf("dd"); // Find the index of the day
  var monthIndex = formatItems.indexOf("mm"); // Find the index of the month
  var yearIndex = formatItems.indexOf("yyyy"); // Find the index of the year

  // Convert date parts into integers
  var day = parseInt(dateItems[dayIndex], 10);
  var month = parseInt(dateItems[monthIndex], 10) - 1; // Month is 0-indexed in JavaScript Date
  var year = parseInt(dateItems[yearIndex], 10);

  // Create and return the date object
  var formattedDate = new Date(year, month, day);

  return formattedDate;
}

export function parseCustomDate(dateString, format) {
  const formatItems = format.toLowerCase().split(".");
  const dateParts = dateString.split(" ");

  // Split date (day, month, year) and time (hour, minute)
  const dateComponents = dateParts[0].split(".");
  const timeComponents = dateParts[1].split(":");

  // Extract date components
  const day = parseInt(dateComponents[0], 10);
  const month = parseInt(dateComponents[1], 10) - 1; // Month is 0-indexed
  const year = parseInt(dateComponents[2], 10);

  // Extract time components
  const hour = parseInt(timeComponents[0], 10);
  const minute = parseInt(timeComponents[1], 10);

  // Create and return a Date object
  return new Date(year, month, day, hour, minute);
}

const dateStr = "12.02.2026 14:30";
const format = "dd.mm.yyyy hh:mm";
const parsedDate = parseCustomDate(dateStr, format);
console.log(parsedDate); // Output: Thu Feb 12 2026 14:30:00 GMT (in your local time zone)
