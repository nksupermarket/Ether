import initKeyBinds, { generateKeybinds, updateKeybinds } from "./KeyBinds";
import { runClock } from "./Date";
import initModal from "./Modal";
import { convertCssRgbToHex } from "./colors";
import { DEFAULT_LINKS, LinkGroupDetails } from "./DEFAULTS";
import "./styles/style.css";
import { displayLinkSection, updateLinkSection } from "./LinkSection";
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

  const defaultKeybinds = generateKeybinds(DEFAULT_LINKS);
  localStorage.setItem("keybinds", JSON.stringify(defaultKeybinds));
  return defaultKeybinds;
}

let theme = getTheme();
let links = getLinks();
let keybinds = getKeyBinds();
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
    onSaveTheme: () => {},
    onSaveLinks: () => {
      links = getLinks();
      links.forEach((link, i) => updateLinkSection(linkSections[i], link));
    },
    onSaveKeybinds: () => {
      keybinds = getKeyBinds();
      updateKeybinds(keybinds);
    },
  });
}

init();
