import { AllLinkGroups } from "./Links";
import { Theme } from "./Theme";
import { StringKeyObj } from "./../types/interfaces";
import { ImageState } from "./Image";
import { SearchEngine } from "./Search";

export type InitSettingsProps = {
  links: AllLinkGroups;
  theme: Theme;
  keybinds: StringKeyObj;
  imageState: ImageState;
  search: SearchEngine;
};

const modal = document.getElementById("modal");
const closeBtn = modal?.querySelector(".close-button");
const settingsBtn = document.querySelector("button[name=settings]");
const settings = document.getElementById("settings");

let isOpen = false;
function close() {
  modal?.classList.add("removed");
  isOpen = false;
}
function open() {
  modal?.classList.remove("removed");
  isOpen = true;
}

export function isModalOpen() {
  return isOpen;
}

let firstOpen = true;
export default function init(props: InitSettingsProps) {
  settings?.addEventListener("click", (e) => e.stopPropagation());
  closeBtn?.addEventListener("click", close);
  modal?.addEventListener("click", close);
  settingsBtn?.addEventListener("click", async () => {
    open();
    if (firstOpen) {
      const { default: initSettings } = await import("./settings/Settings");
      initSettings(props);
      firstOpen = false;
    }
  });
}
