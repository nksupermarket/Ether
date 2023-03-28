import initThemeSettings from "./ThemeSettings";
import initLinksSettings from "./LinksSettings";
import initKeybindsSettings from "./KeybindsSettings";
import initImageSettings from "./ImageSettings";
import initJsonSettings from "./JsonSettings";
import initMiscSettings from "./MiscSettings";
import { InitSettingsProps } from "../Modal";
import "../styles/settings.css";

export default function init({
  links,
  theme,
  keybinds,
  imageState,
  search,
}: InitSettingsProps) {
  const linkSection = initLinksSettings(links);
  const keybindSection = initKeybindsSettings(keybinds);
  const imageSection = initImageSettings(imageState);
  const themeSection = initThemeSettings(theme, imageSection);
  const miscSection = initMiscSettings(search);
  const jsonSection = initJsonSettings();

  const sections = [
    themeSection,
    linkSection,
    keybindSection,
    imageSection,
    miscSection,
    jsonSection,
  ];
  sections.forEach((section) => section.render());
}
