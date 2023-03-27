import { z } from "zod";
import { StringKeyObj } from "../types/interfaces";
import { EMPTY_ITEM } from "./data/CONSTANTS";
import { DEFAULT_LINKS } from "./data/DEFAULT_LINKS";
import { AllLinkGroups } from "./Links";
import { isModalOpen } from "./Modal";
import { focusSearch } from "./Search";

export type KeyBind = {
  [key: string]: string;
};

const KeybindSchema = z.record(
  z.string().length(1, "Keybinds must be one key"),
  z.string().url("A keybind is attached to an invalid url")
);

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
    const target = e.target as HTMLElement;
    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
    if (e.key === "Shift" && !isModalOpen()) {
      focusSearch();
    }

    if (!keys.includes(e.key)) return;
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

export function generateKeybinds(links: AllLinkGroups): StringKeyObj {
  const allLinks = links.map((group) => group?.links || []).flat();
  return allLinks.reduce((acc, curr) => {
    if (!curr) return acc;
    if (!curr["display text"] || curr["display text"] === EMPTY_ITEM)
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

export function refreshKeybinds() {
  updateKeybinds(getKeyBinds());
}

export function validateKeybinds(
  data: any
): data is z.infer<typeof KeybindSchema> {
  KeybindSchema.parse(data);
  return true;
}

export function saveKeybinds(data: any) {
  validateKeybinds(data);
  localStorage.setItem("keybinds", JSON.stringify(data));
}
