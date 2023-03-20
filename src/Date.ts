const dateWrappers = document.querySelectorAll(".rest_of_date_str");
const dayWrapper = document.querySelectorAll(".day");
type CurrDate = {
  day: string;
  formattedDate: string;
};
function getDate(): CurrDate {
  const date = new Date();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dayOfWeek = days[date.getDay()];
  const month = months[date.getMonth()];
  const dayOfMonth = date.getDate();
  const standardTime = date
    .toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      hourCycle: "h23",
    })
    .replace(/AM|PM/, "")
    .trim();
  const formattedDate = ` ${month} ${dayOfMonth}  ${standardTime}`;
  return {
    day: dayOfWeek,
    formattedDate: formattedDate,
  };
}

function displayDate(formattedDate: string): void {
  dateWrappers.forEach((el) => (el.textContent = formattedDate));
}

function displayDay(day: string): void {
  dayWrapper.forEach((el) => (el.textContent = day));
}

export function runClock() {
  const dateDetails = getDate();
  displayDate(dateDetails.formattedDate);
  displayDay(dateDetails.day);
  setInterval(() => {
    const dateDetails = getDate();
    if (dateDetails.formattedDate != dateWrappers[0].textContent) {
      displayDate(dateDetails.formattedDate);
      displayDay(dateDetails.day);
    }
  }, 5000);
}

export const TESTING = { getDate };
