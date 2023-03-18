export function getDate(): string {
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
  const formattedDate = `${dayOfWeek} ${month} ${dayOfMonth}  ${standardTime}`;
  return formattedDate;
}
