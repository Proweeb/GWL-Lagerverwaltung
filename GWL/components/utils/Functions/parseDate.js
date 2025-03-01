export default function stringToDate(_date, _format, _delimiter) {
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
