import initSettings, { InitSettingsProps } from "./settings//Settings";

const modal = document.getElementById("modal");
const closeBtn = modal?.querySelector(".close-button");
const settingsBtn = document.querySelector("button[name=settings]");
const settings = document.getElementById("settings");

function close() {
  modal?.classList.add("removed");
}
function open() {
  modal?.classList.remove("removed");
}

let firstOpen = true;
export default function init(props: InitSettingsProps) {
  settings?.addEventListener("click", (e) => e.stopPropagation());
  closeBtn?.addEventListener("click", close);
  modal?.addEventListener("click", close);
  settingsBtn?.addEventListener("click", () => {
    open();
    if (firstOpen) {
      initSettings(props);
      firstOpen = false;
    }
  });
}
