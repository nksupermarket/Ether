import { runClock } from "./Date";
import initLinks from "./collectionLinks";
import initModal from "./Modal";
import { convertCssRgbToHex } from "./colors";
import { DEFAULT_LINKS, LinkGroupDetails } from "./DEFAULTS";
import "./styles/style.css";
import { LinkSection } from "./LinkSection";
import { EMPTY_LINK } from "./CONSTANTS";

function getTheme() {
  const lsItem = localStorage.getItem("theme");
  if (lsItem) return JSON.parse(lsItem);

  const cssVariables = window.getComputedStyle(document.documentElement);
  return {
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
}

function getLinks(): LinkGroupDetails[] {
  const lsItem = localStorage.getItem("links");
  if (lsItem) {
    console.log("found in ls");
    const allLinks = JSON.parse(lsItem) as LinkGroupDetails[];
    return allLinks.map((linkGroup) => {
      linkGroup.links = linkGroup.links.map((link) => {
        console.log(link.href);
        if (!link.href) link.displayText = EMPTY_LINK;
        return link;
      });
      return linkGroup;
    });
  }
  return DEFAULT_LINKS;
}

let theme = getTheme();
let links = getLinks();
let linkSections: LinkSection[] = [];

function init() {
  runClock();
  linkSections = initLinks(links);
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
