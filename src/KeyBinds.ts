import { StringKeyObj } from "../types/interfaces";
import { EMPTY_LINK } from "./CONSTANTS";
import { DEFAULT_LINKS, LinkGroupDetails } from "./DEFAULTS";

type KeyBind = {
  [key: string]: string;
};

export function getKeyBinds(): KeyBind {
  const lsItem = localStorage.getItem("keybinds");
  if (lsItem) return JSON.parse(lsItem);

  const defaultKeybinds = generateKeybinds(DEFAULT_LINKS);
  localStorage.setItem("keybinds", JSON.stringify(defaultKeybinds));
  return defaultKeybinds;
}
function generateKeybindEvent(keybinds: KeyBind): (e: KeyboardEvent) => void {
  const keys = Object.keys(keybinds);
  return (e) => {
    if (!keys.includes(e.key)) return;
    const target = e.target as HTMLElement;
    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
    window.location.assign(keybinds[e.key]);
  };
}
let eventFn: ((e: KeyboardEvent) => void) | undefined;
export default function init(keybinds: KeyBind) {
  eventFn = generateKeybindEvent(keybinds);
  window.addEventListener("keydown", eventFn);
}
export function updateKeybinds(keybinds: KeyBind) {
  if (eventFn) window.removeEventListener("keydown", eventFn);
  eventFn = generateKeybindEvent(keybinds);
  window.addEventListener("keydown", eventFn);
}

export function generateKeybinds(links: LinkGroupDetails[]): StringKeyObj {
  const allLinks = links.map((group) => group.links).flat();
  return allLinks.reduce((acc, curr) => {
    if (!curr["display text"] || curr["display text"] === EMPTY_LINK)
      return acc;
    let i = 0;
    let key = curr["display text"][i].toLowerCase();
    while (key in acc && i < curr["display text"].length - 1) {
      i++;
      key = curr["display text"][i].toLowerCase();
    }
    if (!(key in acc)) acc[key] = curr.href;
    return acc;
  }, {} as StringKeyObj);
}
