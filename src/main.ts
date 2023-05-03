import initKeyBinds, { getKeyBinds } from "./KeyBinds";
import { runClock } from "./Date";
import initModal from "./Modal";
import "./styles/style.css";
import { getTheme, setTheme } from "./Theme";
import { getImage, setImage } from "./Image";
import { initSearchBar, getSearch, setSearch } from "./Search";
import { getLinks, initLinkSectionKeybinds, setLinks } from "./Links";

function init() {
  const imageState = getImage();
  setImage(imageState);

  const theme = getTheme();
  setTheme(theme);

  const links = getLinks();
  initLinkSectionKeybinds();
  setLinks(links);
  runClock();

  const keybinds = getKeyBinds();
  initKeyBinds(keybinds);

  const search = getSearch();
  setSearch(search);
  initSearchBar();

  initModal({
    links,
    keybinds,
    theme,
    imageState,
    search,
  });
}

init();
