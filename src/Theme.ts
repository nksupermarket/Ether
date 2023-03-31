import { convertCssRgbToHex, hexToRgb } from "./utils/colors";
import { z } from "zod";

export type Theme = {
  "fg color": string;
  "bg color": string;
  "main accent": string;
  "accent 1": string;
  "accent 2": string;
  "accent 3": string;
  "accent 4": string;
  "accent 5": string;
  "panel opacity": number;
};

const hex = z.custom((val) => {
  return /^#([A-Fa-f0-9]{6})$/.test(val as string);
}, "Encounted invalid hex code");
const ThemeSchema = z
  .object({
    "fg color": hex,
    "bg color": hex,
    "main accent": hex,
    "accent 1": hex,
    "accent 2": hex,
    "accent 3": hex,
    "accent 4": hex,
    "accent 5": hex,
    "panel opacity": z
      .number()
      .min(0, "Panel opacity must be between 0 and 1.")
      .max(1, "Panel opacity must be between 0 and 1."),
  })
  .strict("Encounted unknown theme variable");

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
    "accent 5": convertCssRgbToHex(cssVariables.getPropertyValue("--accent-5")),
    "panel opacity": 0.3,
  };

  localStorage.setItem("theme", JSON.stringify(defaultTheme));
  return defaultTheme;
}

export function saveTheme(data: any): void {
  validateTheme(data);
  localStorage.setItem("theme", JSON.stringify(data));
}

export function setTheme(theme: Theme): void {
  const entries = Object.entries(theme);

  for (const [key, value] of entries) {
    switch (key) {
      case "bg color": {
        document.documentElement.style.setProperty(
          "--main-bg-color",
          hexToRgb(value as string)
        );
        break;
      }
      case "fg color": {
        document.documentElement.style.setProperty(
          "--main-fg-color",
          hexToRgb(value as string)
        );
        const imageBoxBg = document.querySelector(
          ".image-border .squiggly"
        ) as HTMLElement;
        const url = window.getComputedStyle(imageBoxBg).backgroundImage;
        const hex = value as string;
        const newUrl = url.replace(/%23([0-9a-fA-F]{6})/, `%23${hex.slice(1)}`);
        if (newUrl === url) continue;
        imageBoxBg.style.setProperty("background-image", newUrl);
        break;
      }
      case "main accent": {
        document.documentElement.style.setProperty(
          "--main-accent",
          hexToRgb(value as string)
        );
        const linkBoxBg = document.querySelector(
          ".links-section .squiggly"
        ) as HTMLElement;
        const url = window.getComputedStyle(linkBoxBg).backgroundImage;
        const hex = value as string;

        const newUrl = url.replace(/%23([0-9a-fA-F]{6})/, `%23${hex.slice(1)}`);
        if (newUrl === url) break;
        linkBoxBg.style.setProperty("background-image", newUrl);
        break;
      }
      case "accent 1": {
        document.documentElement.style.setProperty(
          "--accent-1",
          hexToRgb(value as string)
        );
        break;
      }
      case "accent 2": {
        document.documentElement.style.setProperty(
          "--accent-2",
          hexToRgb(value as string)
        );
        break;
      }
      case "accent 3": {
        document.documentElement.style.setProperty(
          "--accent-3",
          hexToRgb(value as string)
        );
        break;
      }
      case "accent 4": {
        document.documentElement.style.setProperty(
          "--accent-4",
          hexToRgb(value as string)
        );
        break;
      }
      case "accent 5": {
        document.documentElement.style.setProperty(
          "--accent-5",
          hexToRgb(value as string)
        );
        break;
      }
      case "panel opacity": {
        const panel = document.querySelector(
          ".links-section .border"
        ) as HTMLElement;
        panel?.style.setProperty(
          "background",
          `rgba(var(--main-bg-color), ${value})`
        );
      }
    }
  }
}

export function refreshTheme() {
  setTheme(getTheme());
}

export function validateTheme(data: any): data is Theme {
  ThemeSchema.parse(data);
  return true;
}
