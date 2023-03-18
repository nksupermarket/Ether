import { getDate } from "./date";
import * as MainImage from "./image";
import "./styles/style.css";

function displayDate(formattedDate: string): void {
  const dateWrappers = document.querySelectorAll(".date");
  dateWrappers.forEach((el) => (el.textContent = formattedDate));
}

function runClock() {
  const formattedDate = getDate();
  displayDate(formattedDate);
  setInterval(() => {
    const formattedDate = getDate();
    displayDate(formattedDate);
  }, 5000);
}

async function init() {
  await MainImage.init();
  runClock();
}

init();
