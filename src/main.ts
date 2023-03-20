import { runClock } from "./Date";
import initLinks from "./collectionLinks";
import initModal from "./Modal";
import "./styles/style.css";

async function init() {
  runClock();
  initLinks();
  initModal();
}

init();
