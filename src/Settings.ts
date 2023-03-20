import { convertCssRgbToHex } from "./colors";
import SettingsSection from "./SettingsSection";

function getTheme() {
  const lsItem = localStorage.getItem("theme");
  if (lsItem) return JSON.parse(lsItem);

  const cssVariables = window.getComputedStyle(document.documentElement);
  return {
    "bg-color": convertCssRgbToHex(
      cssVariables.getPropertyValue("--main-bg-color")
    ),
    "fg-color": convertCssRgbToHex(
      cssVariables.getPropertyValue("--main-fg-color")
    ),
    "main-accent": convertCssRgbToHex(
      cssVariables.getPropertyValue("--main-accent")
    ),
    "accent-1": convertCssRgbToHex(cssVariables.getPropertyValue("--accent-1")),
    "accent-2": convertCssRgbToHex(cssVariables.getPropertyValue("--accent-2")),
    "accent-3": convertCssRgbToHex(cssVariables.getPropertyValue("--accent-3")),
    "accent-4": convertCssRgbToHex(cssVariables.getPropertyValue("--accent-4")),
  };
}

export default function init() {
  const theme = getTheme();
  const themeSection = new SettingsSection(
    "theme",
    theme,
    document.getElementById("theme-settings") as HTMLElement
  );
  const sections = [themeSection];
  sections.forEach((section) => section.render());
}
