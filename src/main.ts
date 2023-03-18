import { runClock } from "./date";
import * as MainImage from "./image";
import * as CollectionLinks from "./collectionLinks";
import "./styles/style.css";

async function init() {
  await MainImage.init();
  runClock();
  CollectionLinks.init();
}

init();
