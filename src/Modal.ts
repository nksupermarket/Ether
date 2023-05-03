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

const settingsModal = document.getElementById(
  "settings-modal"
) as HTMLDialogElement;
const closeBtn = settingsModal?.querySelector(".close-button");
const settingsBtn = document.querySelector("button[name=settings]");
const settings = document.getElementById("settings");

let isOpen = false;
function closeSettingsModal() {
  settingsModal.close();
  isOpen = false;
}
function openSettingsModal() {
  settingsModal.showModal();
  isOpen = true;
}

export function isModalOpen() {
  return isOpen;
}

let firstOpen = true;
export default function init(props: InitSettingsProps) {
  settings?.addEventListener("click", (e) => e.stopPropagation());
  closeBtn?.addEventListener("click", closeSettingsModal);
  settingsModal?.addEventListener("click", closeSettingsModal);
  settingsBtn?.addEventListener("click", async () => {
    openSettingsModal();
    if (firstOpen) {
      const { default: initSettings } = await import("./settings/Settings");
      initSettings(props);
      firstOpen = false;
    }
  });
}
