import { LinkGroupDetails } from "./DEFAULTS";
import { LinkSection } from "./LinkSection";

export default function init(data: LinkGroupDetails[]) {
  const wrapperElements = document.querySelectorAll(
    ".collection-links-wrapper"
  );
  return data.map((sectionData, i) => {
    const linkSection = new LinkSection(
      wrapperElements[i] as HTMLElement,
      sectionData.title,
      sectionData.links
    );

    linkSection.display();
    return linkSection;
  });
}
