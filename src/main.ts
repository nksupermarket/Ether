import initKeyBinds, { getKeyBinds, updateKeybinds } from "./KeyBinds";
import { runClock } from "./Date";
import initModal from "./Modal";
import { DEFAULT_LINKS, LinkGroupDetails } from "./DEFAULTS";
import "./styles/style.css";
import { displayLinkSection, updateLinkSection } from "./LinkSection";
import { EMPTY_LINK } from "./CONSTANTS";
import { getTheme, setTheme } from "./Theme";
import { getImage, updateImage } from "./Image";

function getLinks(): LinkGroupDetails[] {
  const lsItem = localStorage.getItem("links");
  if (lsItem) {
    const allLinks = JSON.parse(lsItem) as LinkGroupDetails[];
    return allLinks.map((linkGroup) => {
      linkGroup.links = linkGroup.links.map((link) => {
        if (!link.href) link["display text"] = EMPTY_LINK;
        return link;
      });
      return linkGroup;
    });
  }
  localStorage.setItem("links", JSON.stringify(DEFAULT_LINKS));
  return DEFAULT_LINKS;
}

let theme = getTheme();
setTheme(theme);
let links = getLinks();
let keybinds = getKeyBinds();
let imageState = getImage();
updateImage(imageState);
let linkSections = document.querySelectorAll(
  ".collection-links-wrapper"
) as NodeListOf<HTMLElement>;

function init() {
  runClock();
  linkSections.forEach((section, i) => displayLinkSection(section, links[i]));
  initKeyBinds(keybinds);
  initModal({
    links,
    keybinds,
    theme,
    imageState,
    onSaveTheme: () => {
      theme = getTheme();
      setTheme(theme);
    },
    onSaveLinks: () => {
      links = getLinks();
      links.forEach((link, i) => updateLinkSection(linkSections[i], link));
    },
    onSaveKeybinds: () => {
      keybinds = getKeyBinds();
      updateKeybinds(keybinds);
    },
    onSaveImage: () => {
      imageState = getImage();
      updateImage(imageState);
    },
  });
}

init();
