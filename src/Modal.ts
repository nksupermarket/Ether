import initSettings from "./Settings";

const modal = document.getElementById("modal");
const closeBtn = modal?.querySelector(".close-button");
const settingsBtn = document.querySelector("button[name=settings]");
const settings = document.getElementById("settings");

function close() {
  modal?.classList.add("hide");
}
let firstOpen = true;
function open() {
  modal?.classList.remove("hide");
  if (firstOpen) initSettings();
}

export default function init() {
  settings?.addEventListener("click", (e) => e.stopPropagation());
  closeBtn?.addEventListener("click", close);
  modal?.addEventListener("click", close);
  settingsBtn?.addEventListener("click", open);
}
