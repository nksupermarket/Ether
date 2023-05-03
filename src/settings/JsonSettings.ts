import { refreshImage, saveImageState } from "../Image";
import { refreshKeybinds, saveKeybinds } from "../KeyBinds";
import { refreshLinks, saveLinks } from "../Links";
import { refreshSearch, saveSearchEngine } from "../Search";
import { refreshTheme, saveTheme } from "../Theme";
import SettingsSection from "./SettingsSection";

export default function initJsonSettings() {
  const jsonSettings = new SettingsSection<string>({
    title: "json",
    sectionEl: document.querySelector("#json-settings") as HTMLElement,
    state: "",
    render: function (this: SettingsSection<string>) {
      const wrapperEl = document.querySelector("#json-settings");
      const textarea = wrapperEl?.querySelector(
        "form[name='import json'] textarea"
      ) as HTMLTextAreaElement;
      textarea.value = this.state;
      textarea?.addEventListener("input", (e) => {
        const target = e.target as HTMLTextAreaElement;
        this.state = target.value;
      });

      this.sectionEl
        .querySelector("button[type='submit']")
        ?.addEventListener("click", (e) => {
          e.preventDefault();
          this.save();
        });

      const resetButton = this.sectionEl.querySelector(
        "button[aria-label='reset']"
      );
      resetButton?.addEventListener("click", () => {
        this.reset();
        this.rerender();
      });
    },
    rerender: function () {
      const wrapperEl = document.querySelector("#json-settings");
      const textarea = wrapperEl?.querySelector(
        "form[name='import json'] textarea"
      ) as HTMLTextAreaElement;
      textarea.value = jsonSettings.state;
    },
    onSave: function (this: SettingsSection<string>) {
      const jsonStrWithoutNewlines = this.state.replace(/[\n\r]+/g, "");
      const configObj = JSON.parse(jsonStrWithoutNewlines);
      for (const [key, value] of Object.entries(configObj)) {
        switch (key) {
          case "theme": {
            saveTheme(value);
            refreshTheme();
            break;
          }
          case "links": {
            saveLinks(value);
            refreshLinks();
            break;
          }
          case "image": {
            saveImageState(value);
            refreshImage();
            break;
          }
          case "keybinds": {
            saveKeybinds(value);
            refreshKeybinds();
            break;
          }
          case "search": {
            saveSearchEngine(value);
            refreshSearch();
            break;
          }
          default: {
            throw new Error(`${key} is an invalid option`);
          }
        }
      }
    },
  });
  return jsonSettings;
}
