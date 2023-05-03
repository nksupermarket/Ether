import initThemeSettings from "./ThemeSettings";
import initLinksSettings from "./LinksSettings";
import initKeybindsSettings from "./KeybindsSettings";
import initImageSettings from "./ImageSettings";
import initJsonSettings from "./JsonSettings";
import initSearchSettings from "./SearchSettings";
import { InitSettingsProps } from "../Modal";
import "../styles/settings.css";
import initLinkButtons from "./LinkButtons";
import { getCustomSearchDetails } from "../Search";

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
  const searchSection = initSearchSettings(
    search,
    getCustomSearchDetails() || { name: "", "query url": "" }
  );
  const jsonSection = initJsonSettings();
  const linkButtonsSection = initLinkButtons();

  const sections = [
    themeSection,
    linkSection,
    keybindSection,
    imageSection,
    searchSection,
    jsonSection,
    linkButtonsSection,
  ];
  sections.forEach((section) => section.render());
}
