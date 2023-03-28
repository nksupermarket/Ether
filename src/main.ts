import initKeyBinds, { getKeyBinds } from "./KeyBinds";
import { runClock } from "./Date";
import initModal from "./Modal";
import "./styles/style.css";
import { getTheme, setTheme } from "./Theme";
import { getImage, updateImage } from "./Image";
import { getSearch, setSearch } from "./Search";
import { getLinks, setLinks } from "./Links";

function init() {
  const theme = getTheme();
  console.log(theme);
  setTheme(theme);
  const links = getLinks();
  setLinks(links);
  runClock();
  const keybinds = getKeyBinds();
  initKeyBinds(keybinds);
  const imageState = getImage();
  updateImage(imageState);
  const search = getSearch();
  setSearch(search);
  initModal({
    links,
    keybinds,
    theme,
    imageState,
    search,
  });
}

init();
