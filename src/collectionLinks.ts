import { LINKS } from "./DEFAULTS";
import { LinkSection } from "./LinkSection";

export function init() {
  const wrapperElements = document.querySelectorAll(
    ".collection-links-wrapper"
  );
  LINKS.forEach((sectionData, i) => {
    const linkSection = new LinkSection(
      wrapperElements[i] as HTMLElement,
      sectionData.title,
      sectionData.links
    );

    linkSection.display();
  });
}
