import { runClock } from "./Date";
import initImage from "./Image";
import initLinks from "./collectionLinks";
import initModal from "./Modal";
import "./styles/style.css";

async function init() {
  await initImage();
  runClock();
  initLinks();
  initModal();
}

init();
