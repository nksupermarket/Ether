import InputGroup from "./InputGroup";
import LinkGroup from "./LinkGroup";
import SettingsSection from "./SettingsSection";
import { Link, LinkGroupDetails } from "../DEFAULTS";
import { StringKeyObj, Theme } from "../../types/interfaces";
import { Optional } from "../../types/types";
import { generateKeybinds } from "../KeyBinds";
import { Component } from "./settingsTypes";
import { ImageState } from "../Image";

export type InitSettingsProps = {
  links: LinkGroupDetails[];
  theme: Theme;
  keybinds: StringKeyObj;
  imageState: ImageState;
  onSaveTheme: () => void;
  onSaveLinks: () => void;
  onSaveKeybinds: () => void;
  onSaveImage: () => void;
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

export default function init({
  links,
  theme,
  keybinds,
  imageState,
  onSaveTheme,
  onSaveLinks,
  onSaveKeybinds,
  onSaveImage,
}: InitSettingsProps) {
  const themeSection = new SettingsSection({
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
      }),
    ],
    onSave: onSaveTheme,
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
  const linkSection = new SettingsSection({
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
          id: i.toString(),
        })
    ),
    onSave: onSaveLinks,
  });

  function formatObject(obj: { [key: string]: string }): string {
    const entries = Object.entries(obj)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");

    return `${entries}`;
  }

  const keybindSection = new SettingsSection({
    title: "keybinds",
    state: keybinds,
    sectionEl: document.getElementById("keybind-settings") as HTMLElement,
    children: [
      {
        render: function (this: Component, state) {
          const sectionEl = document.getElementById(
            "keybind-settings"
          ) as HTMLElement;
          const textarea = sectionEl.querySelector(
            "#keybind-settings textarea"
          ) as HTMLTextAreaElement;
          textarea.value = formatObject(state);
          textarea.addEventListener("input", (e: Event) => {
            const target = e.target as HTMLTextAreaElement;
            function convertStringToObj(str: string): StringKeyObj {
              return str.split("\n").reduce((acc, curr) => {
                if (!curr.includes(":")) return acc;
                const [key, ...rest] = curr.split(":");
                const value = rest.join(":");
                acc[key.trim()] = value.trim();
                return acc;
              }, {} as StringKeyObj);
            }
            keybindSection.state = convertStringToObj(target.value);
          });

          sectionEl
            .querySelector("button[data-role='generate keybinds']")
            ?.addEventListener("click", () => {
              const links = JSON.parse(localStorage.getItem("links") || "");
              if (!links) return;
              const keybinds = generateKeybinds(links);
              keybindSection.state = keybinds;
              this.rerender(keybinds);
            });
        },
        rerender: (state) => {
          const textarea = document.querySelector(
            "#keybind-settings textarea"
          ) as HTMLTextAreaElement;
          textarea.value = formatObject(state);
        },
      },
    ],
    onSave: onSaveKeybinds,
  });

  interface ImageStateBuffer extends Omit<ImageState, "image"> {
    image: File | null;
  }
  const imageSection = new SettingsSection<ImageStateBuffer>({
    title: "image",
    state: { ...imageState, image: null },
    sectionEl: document.getElementById("image-settings") as HTMLElement,
    children: [
      {
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
      },
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
        getState: (): Optional<ImageStateBuffer, "image"> => {
          const state: Optional<ImageStateBuffer, "image"> = {
            ...imageSection.state,
          };
          delete state.image;
          return state;
        },
        id: "a",
      }),
    ],
    onSave: onSaveImage,
    saveState: function (this: SettingsSection<File | null>) {
      if (this.state === null) return;
      const reader = new FileReader();

      reader.addEventListener("load", () => {
        localStorage.setItem("image", `url(${reader.result})` as string);
        onSaveImage();
        this.rerender();
      });

      reader.readAsDataURL(this.state);
      this.displaySuccessMsg();
    },
  });

  // const miscSettings = new SettingsSection({
  //     title:"search",
  //     state: "https://www.google.com/search"
  //         sectionEl:
  // })

  const sections = [themeSection, linkSection, keybindSection, imageSection];
  sections.forEach((section) => section.render());
}
