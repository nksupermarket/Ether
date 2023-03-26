import InputGroup from "./InputGroup";
import LinkGroup from "./LinkGroup";
import SettingsSection, {
  SettingsSectionWithChildren,
} from "./SettingsSection";
import { Link, LinkGroupDetails, saveLinks } from "../Links";
import { StringKeyObj, Theme } from "../../types/interfaces";
import { Optional } from "../../types/types";
import { generateKeybinds, refreshKeybinds, saveKeybinds } from "../KeyBinds";
import { Component, StatefulComponent } from "./settingsTypes";
import { ImageState, refreshImage, saveImageState } from "../Image";
import { refreshSearch, saveSearch, SearchEngine } from "../Search";
import { refreshTheme, saveTheme } from "../Theme";
import { refreshLinks } from "../Links";
import LocalStorage from "../LocalStorage";

export type InitSettingsProps = {
  links: LinkGroupDetails[];
  theme: Theme;
  keybinds: StringKeyObj;
  imageState: ImageState;
  search: SearchEngine;
};
function getEnoughNodesForData(dataCount: number, selectorToCount: string) {
  let els = document.querySelectorAll(
    selectorToCount
  ) as NodeListOf<HTMLElement>;
  if (els.length === dataCount) return;

  while (els.length != dataCount) {
    let fn;
    if (els.length > dataCount) fn = els[els.length - 1].remove;
    else
      fn = () => {
        els[0].parentElement?.append(els[0].cloneNode(true));
      };

    fn();
    els = document.querySelectorAll(selectorToCount) as NodeListOf<HTMLElement>;
  }
}

export function displayMsg(msgEl: HTMLElement, msg: string) {
  msgEl.textContent = msg;
  msgEl.classList.remove("hide");
}
export default function init({
  links,
  theme,
  keybinds,
  imageState,
  search,
}: InitSettingsProps) {
  const themeSection = new SettingsSectionWithChildren({
    title: "theme",
    state: theme,
    sectionEl: document.getElementById("theme-settings") as HTMLElement,
    children: [
      new InputGroup({
        wrapperEl: document.getElementById("theme-settings") as HTMLElement,
        updateState: (e: Event) => {
          const target = e.target as HTMLInputElement;
          const key = target.name as keyof Theme;
          themeSection.state[key] = target.value;
        },
        getState: (): StringKeyObj => themeSection.state,
        id: "theme",
      }),
    ],
    onSave: () => {
      saveTheme(themeSection.state);
      refreshTheme();
    },
  });

  getEnoughNodesForData(links.length, "form[name='links'] > ul .link-group");
  document
    .querySelectorAll("form[name='links'] > ul .link-group > header")
    .forEach((el) =>
      el.addEventListener("click", function toggleAccordion(e) {
        const currTarget = e.currentTarget as HTMLElement;
        const accordion = currTarget.nextElementSibling as HTMLElement;
        const displayEl = el.querySelector(".display-mode");
        if (displayEl?.classList.contains("hide")) return;
        accordion.classList.toggle("accordion");
        el.classList.toggle("accordion-closed");
      })
    );
  const linkSection = new SettingsSectionWithChildren({
    title: "links",
    state: links,
    sectionEl: document.getElementById("link-settings") as HTMLElement,
    children: Array.from(document.querySelectorAll(".link-group")).map(
      (el, i) =>
        new LinkGroup({
          wrapperEl: el as HTMLElement,
          updateLink: (e: Event, elIndex: number) => {
            const target = e.target as HTMLInputElement;
            links[i].links[elIndex][target.name as keyof Link] = target.value;
          },
          updateTitle: (e: Event) => {
            const target = e.target as HTMLInputElement;
            links[i].title = target.value;
          },
          getState: (): LinkGroupDetails => linkSection.state[i],
          id: "group-" + i.toString(),
        })
    ),
    onSave: () => {
      saveLinks(linkSection.state);
      refreshLinks();
    },
  });

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
              const links = JSON.parse(localStorage.getItem("links") || "");
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
          textarea.value = JSON.stringify(keybinds, null, 2);
        },
      },
    ],
    onSave: () => {
      saveKeybinds(keybindSection.state);
      refreshKeybinds();
    },
  });

  interface ImageStateBuffer extends Omit<ImageState, "image"> {
    image: File | null;
  }
  const imageSection = new SettingsSectionWithChildren<ImageStateBuffer>({
    title: "image",
    state: { ...imageState, image: null },
    sectionEl: document.getElementById("image-settings") as HTMLElement,
    children: [
      (function ImageFileInput(): Component {
        return {
          render: function () {
            const sectionEl = document.getElementById(
              "image-settings"
            ) as HTMLElement;
            const input = sectionEl.querySelector(
              "input[type='file']"
            ) as HTMLElement;
            input.addEventListener("change", (e) => {
              const target = e.target as HTMLInputElement;
              if (!target.files) return;

              const file = target.files[0];

              const label = sectionEl.querySelector(
                "label .button-text"
              ) as HTMLElement;
              label.textContent = file.name;

              imageSection.state.image = file;
            });
          },
          rerender: function () {
            const sectionEl = document.getElementById(
              "image-settings"
            ) as HTMLElement;
            const label = sectionEl.querySelector(
              "label .button-text"
            ) as HTMLElement;
            label.textContent = "Choose your image";
          },
        };
      })(),
      new InputGroup({
        wrapperEl: document.querySelector(
          "#image-settings .input-group"
        ) as HTMLElement,
        updateState: (e: Event) => {
          const target = e.target as HTMLInputElement;
          const key = target.name as keyof ImageStateBuffer;
          if (key === "image") return;
          imageSection.state[key] = target.value;
        },
        getState: (): Omit<ImageStateBuffer, "image"> => {
          const state: Optional<ImageStateBuffer, "image"> = {
            ...imageSection.state,
          };
          delete state.image;
          return state;
        },
        id: "a",
      }),
    ],
    onSave: function (this: SettingsSection<ImageStateBuffer>) {
      if (this.state.image === null) {
        const state = { ...this.state, image: imageState.image };
        saveImageState(state);
        refreshImage();
        return;
      }

      const fileExtension = this.state.image.name.match(/\.[0-9a-z]+$/i);
      const imageFileExtensions = ["jpg", "png", "webp", "gif", "svg"];
      if (!fileExtension || !imageFileExtensions.includes(fileExtension[0]))
        throw new Error("Not a valid image");

      const reader = new FileReader();

      reader.addEventListener("load", () => {
        try {
          const imageState = { ...this.state, image: `url(${reader.result})` };
          saveImageState(imageState);
          this.displaySuccessMsg();
          refreshImage();
          this.rerender();
        } catch (e) {
          this.displayFailedMsg();
        }
      });

      reader.readAsDataURL(this.state.image);
    },
  });

  const importJSONSettings = new SettingsSection<string>({
    title: "json",
    sectionEl: document.querySelector(
      "#misc-settings .form-wrapper"
    ) as HTMLElement,
    state: "",
    render: function (this: SettingsSection<string>) {
      const wrapperEl = document.querySelector("#misc-settings .form-wrapper");
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
      const wrapperEl = document.querySelector("#misc-settings form-wrapper");
      const textarea = wrapperEl?.querySelector(
        ".form[name='import json'] textarea"
      ) as HTMLTextAreaElement;
      textarea.value = importJSONSettings.state;
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
            saveSearch(value);
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

  const miscSettings: Component = {
    render: function (this: Component) {
      if (Array.isArray(this.children))
        this.children.forEach((child) => child.render());
      else this.children?.render();
    },
    rerender: function (this: Component) {
      if (Array.isArray(this.children))
        this.children.forEach((child) => child.rerender());
      else this.children?.rerender();
    },
    children: [
      (function SearchSettings() {
        return {
          title: "search",
          state: search,
          sectionEl: document.getElementById("misc-settings") as HTMLElement,
          render: function () {
            const searchEngineSelect = this.sectionEl?.querySelector(
              "select[name='search-engine']"
            ) as HTMLSelectElement;
            searchEngineSelect.addEventListener("change", (e) => {
              const select = e.target as HTMLSelectElement;
              saveSearch(select.value as SearchEngine);
              refreshSearch();
            });

            const options = searchEngineSelect.querySelectorAll("option");
            options.forEach((o) => {
              if (o.value === this.state) o.setAttribute("selected", "true");
            });
          },
          rerender: function () {
            const searchEngineSelect = this.sectionEl?.querySelector(
              "select[name='search-engine']"
            ) as HTMLSelectElement;
            const options = searchEngineSelect.querySelectorAll("option");
            options.forEach((o) => {
              if (o.value === this.state) o.setAttribute("selected", "true");
            });
          },
        };
      })() as StatefulComponent<SearchEngine>,
      (function LinkButtons() {
        return {
          render: () => {
            const sectionEl = document.getElementById("misc-settings");
            const resetDefaultsLink = sectionEl?.querySelector(
              "a[data-role='reset to defaults']"
            );
            resetDefaultsLink?.addEventListener("click", () => {
              localStorage.clear();
              location.reload();
            });

            const copyConfigLink = sectionEl?.querySelector(
              "a[data-role='copy config']"
            );
            copyConfigLink?.addEventListener("click", (e) => {
              e.preventDefault();
              navigator.clipboard.writeText(LocalStorage.format());
              const msgEl = copyConfigLink?.parentElement?.querySelector(
                ".msg"
              ) as HTMLElement;
              displayMsg(
                msgEl,
                "your config has been copied to your clipboard"
              );
              setTimeout(() => {
                msgEl.classList.add("hide");
              }, 3000);
            });
          },
          rerender: () => {},
        };
      })(),
      importJSONSettings,
    ],
  };

  const sections = [
    themeSection,
    linkSection,
    keybindSection,
    imageSection,
    miscSettings,
  ];
  sections.forEach((section) => section.render());
}
