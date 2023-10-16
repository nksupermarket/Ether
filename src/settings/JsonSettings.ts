import {
  IMAGE_LS_KEY,
  ImageState,
  refreshImage,
  saveImageState,
} from "../Image";
import { KEYBINDS_LS_KEY, refreshKeybinds, saveKeybinds } from "../KeyBinds";
import { LINKS_LS_KEY, refreshLinks, saveLinks } from "../Links";
import {
  CUSTOM_SEARCH_DETAILS_LS_KEY,
  refreshSearch,
  saveCustomSearch,
  saveSearchEngine,
  SEARCH_LS_KEY,
} from "../Search";
import { refreshTheme, saveTheme, Theme, THEME_LS_KEY } from "../Theme";
import SettingsSection from "./SettingsSection";

export default function initJsonSettings() {
  const jsonSettings = new SettingsSection<string>({
    title: "json",
    sectionEl: document.querySelector("#json-settings") as HTMLElement,
    state: "",
    render: function (this: SettingsSection<string>) {
      const wrapperEl = document.querySelector("#json-settings");
      const textarea = wrapperEl?.querySelector(
        "form[name='import json'] textarea",
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
        "button[aria-label='reset']",
      );
      resetButton?.addEventListener("click", () => {
        this.reset();
        this.rerender();
      });
    },
    rerender: function () {
      const wrapperEl = document.querySelector("#json-settings");
      const textarea = wrapperEl?.querySelector(
        "form[name='import json'] textarea",
      ) as HTMLTextAreaElement;
      textarea.value = jsonSettings.state;
    },
    onSave: function (this: SettingsSection<string>) {
      const jsonStrWithoutNewlines = this.state.replace(/[\n\r]+/g, "");
      const configObj = JSON.parse(jsonStrWithoutNewlines);
      for (const [key, value] of Object.entries(configObj)) {
        switch (key) {
          case THEME_LS_KEY: {
            saveTheme(value);
            refreshTheme(value as Theme);
            break;
          }
          case LINKS_LS_KEY: {
            saveLinks(value);
            refreshLinks();
            break;
          }
          case IMAGE_LS_KEY: {
            saveImageState(value);
            refreshImage(value as ImageState);
            break;
          }
          case KEYBINDS_LS_KEY: {
            saveKeybinds(value);
            refreshKeybinds();
            break;
          }
          case SEARCH_LS_KEY: {
            saveSearchEngine(value);
            refreshSearch();
            break;
          }
          case CUSTOM_SEARCH_DETAILS_LS_KEY: {
            saveCustomSearch(value);
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
