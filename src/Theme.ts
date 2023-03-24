import { convertCssRgbToHex, hexToRgb } from "./colors";

export type Theme = {
  "fg color": string;
  "bg color": string;
  "main accent": string;
  "accent 1": string;
  "accent 2": string;
  "accent 3": string;
  "accent 4": string;
};

export function getTheme(): Theme {
  const lsItem = localStorage.getItem("theme");
  if (lsItem) return JSON.parse(lsItem);

  const cssVariables = window.getComputedStyle(document.documentElement);
  const defaultTheme = {
    "bg color": convertCssRgbToHex(
      cssVariables.getPropertyValue("--main-bg-color")
    ),
    "fg color": convertCssRgbToHex(
      cssVariables.getPropertyValue("--main-fg-color")
    ),
    "main accent": convertCssRgbToHex(
      cssVariables.getPropertyValue("--main-accent")
    ),
    "accent 1": convertCssRgbToHex(cssVariables.getPropertyValue("--accent-1")),
    "accent 2": convertCssRgbToHex(cssVariables.getPropertyValue("--accent-2")),
    "accent 3": convertCssRgbToHex(cssVariables.getPropertyValue("--accent-3")),
    "accent 4": convertCssRgbToHex(cssVariables.getPropertyValue("--accent-4")),
  };

  localStorage.setItem("theme", JSON.stringify(defaultTheme));
  return defaultTheme;
}
export function setTheme(theme: Theme): void {
  const entries = Object.entries(theme);

  for (const [key, value] of entries) {
    console.log(key);
    switch (key) {
      case "bg color": {
        document.documentElement.style.setProperty(
          "--main-bg-color",
          hexToRgb(value)
        );
        break;
      }
      case "fg color": {
        document.documentElement.style.setProperty(
          "--main-fg-color",
          hexToRgb(value)
        );
        const imageBoxBg = document.querySelector(
          ".image-border .squiggly"
        ) as HTMLElement;
        const url = window.getComputedStyle(imageBoxBg).backgroundImage;
        const newUrl = url.replace(
          /%23([0-9a-fA-F]{6})/,
          `%23${value.slice(1)}`
        );
        if (newUrl === url) continue;
        imageBoxBg.style.setProperty("background-image", newUrl);
        break;
      }
      case "main accent": {
        document.documentElement.style.setProperty(
          "--main-accent",
          hexToRgb(value)
        );
        const linkBoxBg = document.querySelector(
          ".links-section .squiggly"
        ) as HTMLElement;
        const url = window.getComputedStyle(linkBoxBg).backgroundImage;
        const newUrl = url.replace(
          /%23([0-9a-fA-F]{6})/,
          `%23${value.slice(1)}`
        );
        if (newUrl === url) break;
        linkBoxBg.style.setProperty("background-image", newUrl);
        break;
      }
      case "accent 1": {
        document.documentElement.style.setProperty(
          "--accent-1",
          hexToRgb(value)
        );
        break;
      }
      case "accent 2": {
        document.documentElement.style.setProperty(
          "--accent-2",
          hexToRgb(value)
        );
        break;
      }
      case "accent 3": {
        document.documentElement.style.setProperty(
          "--accent-3",
          hexToRgb(value)
        );
        break;
      }
      case "accent 4": {
        document.documentElement.style.setProperty(
          "--accent-4",
          hexToRgb(value)
        );
        break;
      }
    }
  }
}
