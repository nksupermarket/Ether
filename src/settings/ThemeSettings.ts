import { StringKeyObj } from "../../types/interfaces";
import THEMES from "../data/THEMES";
import DomRender from "../DomRender";
import { refreshImage, saveImageState } from "../Image";
import { refreshTheme, saveTheme, Theme } from "../Theme";
import InputGroup from "./InputGroup";
import { SettingsSectionWithChildren } from "./SettingsSection";

export default function (theme: Theme) {
  const themeSection = new SettingsSectionWithChildren({
    title: "theme",
    state: theme,
    sectionEl: document.getElementById("theme-settings") as HTMLElement,
    children: [
      {
        render: function () {
          const selectEl = document.querySelector(
            "#theme-settings select"
          ) as HTMLSelectElement;
          selectEl.value = "custom";

          for (const key of Object.keys(THEMES)) {
            const optionEl = DomRender.option({
              text: key,
              value: key,
            });

            selectEl.append(optionEl);

            selectEl.addEventListener("change", () => {
              const selectedTheme =
                THEMES[selectEl.value as keyof typeof THEMES];
              saveTheme(selectedTheme.theme);
              saveImageState(selectedTheme.image);
              refreshImage();
              refreshTheme();
              themeSection.state = selectedTheme.theme;
              themeSection.rerender();
            });
          }
        },
        rerender: () => {},
      },
      new InputGroup({
        wrapperEl: document.querySelector(
          "#theme-settings .input-group"
        ) as HTMLElement,
        updateState: (e: Event) => {
          const target = e.target as HTMLInputElement;
          const key = target.name as keyof Theme;
          if (key === "panel opacity")
            themeSection.state[key] = Number(target.value);
          else themeSection.state[key] = target.value;
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
  return themeSection;
}
