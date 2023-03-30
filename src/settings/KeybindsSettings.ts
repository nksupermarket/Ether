import {
  KeyBind,
  generateKeybinds,
  refreshKeybinds,
  saveKeybinds,
} from "../KeyBinds";
import { getLinks } from "../Links";
import { SettingsSectionWithChildren } from "./SettingsSection";
import { Component } from "./settingsTypes";

export default function initKeybindsSettings(keybinds: KeyBind) {
  const keybindSection = new SettingsSectionWithChildren({
    title: "keybinds",
    state: keybinds,
    sectionEl: document.getElementById("keybind-settings") as HTMLElement,
    children: [
      {
        render: function (this: Component) {
          const sectionEl = document.getElementById(
            "keybind-settings"
          ) as HTMLElement;
          const textarea = sectionEl.querySelector(
            "#keybind-settings textarea"
          ) as HTMLTextAreaElement;
          textarea.value = JSON.stringify(keybinds, null, 2);
          textarea.addEventListener("input", (e: Event) => {
            const target = e.target as HTMLTextAreaElement;
            try {
              keybindSection.state = JSON.parse(target.value);
              keybindSection.hideMsg();
              keybindSection.sectionEl.classList.remove("error");
            } catch (e) {
              keybindSection.sectionEl.classList.add("error");
              keybindSection.displayFailedMsg("Invalid json");
            }
          });

          sectionEl
            .querySelector("button[data-role='generate keybinds']")
            ?.addEventListener("click", () => {
              const links = getLinks();
              if (!links) return;
              const keybinds = generateKeybinds(links);
              keybindSection.state = keybinds;
              this.rerender();
            });
        },
        rerender: () => {
          const textarea = document.querySelector(
            "#keybind-settings textarea"
          ) as HTMLTextAreaElement;
          textarea.value = JSON.stringify(keybindSection.state, null, 2);
        },
      },
    ],
    onSave: () => {
      saveKeybinds(keybindSection.state);
      refreshKeybinds();
    },
  });
  return keybindSection;
}
