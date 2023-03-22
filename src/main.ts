import initKeyBinds from "./KeyBinds";
import { runClock } from "./Date";
import initLinks from "./collectionLinks";
import initModal from "./Modal";
import { convertCssRgbToHex } from "./colors";
import { DEFAULT_LINKS, LinkGroupDetails } from "./DEFAULTS";
import "./styles/style.css";
import { LinkSection } from "./LinkSection";
import { EMPTY_LINK } from "./CONSTANTS";
import { StringKeyObj } from "../types/interfaces";

function getTheme() {
  const lsItem = localStorage.getItem("theme");
  if (lsItem) return JSON.parse(lsItem);

  const cssVariables = window.getComputedStyle(document.documentElement);
  const defaultTheme = {
    "bg color": convertCssRgbToHex(
      cssVariables.getPropertyValue("--main-bg-color")
    ),
    "fg color": convertCssRgbToHex(
      cssVariables.getPropertyValue("--main-fg-color")
    ),
    "main accent": convertCssRgbToHex(
      cssVariables.getPropertyValue("--main-accent")
    ),
    "accent 1": convertCssRgbToHex(cssVariables.getPropertyValue("--accent-1")),
    "accent 2": convertCssRgbToHex(cssVariables.getPropertyValue("--accent-2")),
    "accent 3": convertCssRgbToHex(cssVariables.getPropertyValue("--accent-3")),
    "accent 4": convertCssRgbToHex(cssVariables.getPropertyValue("--accent-4")),
  };

  localStorage.setItem("theme", JSON.stringify(defaultTheme));
  return defaultTheme;
}

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

function getKeyBinds(): StringKeyObj {
  const lsItem = localStorage.getItem("keybinds");
  if (lsItem) return JSON.parse(lsItem);

  const allLinks = links.map((group) => group.links).flat();
  const defaultKeybinds = allLinks.reduce((acc, curr) => {
    if (!curr["display text"] || curr["display text"] === EMPTY_LINK)
      return acc;
    let i = 0;
    let key = curr["display text"][i];
    while (key in acc && i < curr["display text"].length - 1) {
      i++;
      key = curr["display text"][i];
    }
    if (!(key in acc)) acc[key] = curr.href;
    return acc;
  }, {} as StringKeyObj);
  localStorage.setItem("keybinds", JSON.stringify(defaultKeybinds));
  return defaultKeybinds;
}

let theme = getTheme();
let links = getLinks();
let keybinds = getKeyBinds();
let linkSections: LinkSection[] = [];

function init() {
  runClock();
  linkSections = initLinks(links);
  initKeyBinds(keybinds);
  initModal({
    links,
    theme,
    onSaveTheme: () => {},
    onSaveLinks: () => {
      links = getLinks();
      links.forEach((link, i) => linkSections[i].update(link));
    },
  });
}

init();
