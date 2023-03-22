import { EMPTY_LINK } from "./CONSTANTS";
import { Link, LinkGroupDetails } from "./DEFAULTS";
import DomRender from "./DomRender";

const allSections: LinkSection[] = [];
export class LinkSection {
  wrapper: HTMLElement;
  title: string;
  links: Link[];

  constructor(wrapperEl: HTMLElement, title: string, links: Link[]) {
    this.wrapper = wrapperEl;
    this.title = title;
    this.links = links;

    const matchingSection = allSections.find(
      (section) => section.wrapper === wrapperEl
    );
    if (!matchingSection) {
      allSections.push(this);
      return this;
    } else return matchingSection;
  }

  display() {
    const titleElement = this.wrapper.querySelector(
      ".collection-title"
    ) as HTMLElement;
    titleElement.textContent = this.title;

    const linkElements = this.wrapper.querySelectorAll(
      ".link"
    ) as NodeListOf<HTMLLinkElement>;
    if (linkElements.length != this.links.length)
      throw new Error("missing link element or link data");

    for (let i = 0; i < linkElements.length; i++) {
      linkElements[i].href = this.links[i].href;
      linkElements[i].append(
        DomRender.textNode({
          text: this.links[i]["display text"],
          classes: ["link-text"],
        })
      );

      if (this.links[i]["display text"] === EMPTY_LINK)
        linkElements[i].parentElement?.classList.add("inactive");
    }
  }

  update(linkGroupDetails: LinkGroupDetails) {
    this.title = linkGroupDetails.title;
    this.links = linkGroupDetails.links;
    const titleElement = this.wrapper.querySelector(
      ".collection-title"
    ) as HTMLElement;
    titleElement.textContent = this.title;

    const linkElements = this.wrapper.querySelectorAll(
      ".link"
    ) as NodeListOf<HTMLLinkElement>;
    if (linkElements.length != this.links.length)
      throw new Error("missing link element or link data");
    linkElements.forEach((el, i) => {
      el.href = this.links[i].href;

      const textNode = el.querySelector(".link-text");
      if (!textNode)
        throw new Error("something went wrong rendering your link");
      textNode.textContent = this.links[i]["display text"];

      if (this.links[i]["display text"] === EMPTY_LINK)
        linkElements[i].parentElement?.classList.add("inactive");
    });
  }
}
