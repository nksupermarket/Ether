import { EMPTY_LINK } from "./CONSTANTS";
import { LinkGroupDetails } from "./DEFAULTS";
import DomRender from "./DomRender";

export function displayLinkSection(
  wrapper: HTMLElement,
  linkGroupDetails: LinkGroupDetails
) {
  const titleElement = wrapper.querySelector(
    ".collection-title"
  ) as HTMLElement;
  titleElement.textContent = linkGroupDetails.title;

  const linkElements = wrapper.querySelectorAll(
    ".link"
  ) as NodeListOf<HTMLLinkElement>;
  if (linkElements.length != linkGroupDetails.links.length)
    throw new Error("missing link element or link data");

  for (let i = 0; i < linkElements.length; i++) {
    linkElements[i].href = linkGroupDetails.links[i].href;
    linkElements[i].append(
      DomRender.textNode({
        text: linkGroupDetails.links[i]["display text"],
        classes: ["link-text"],
      })
    );

    if (linkGroupDetails.links[i]["display text"] === EMPTY_LINK)
      linkElements[i].parentElement?.classList.add("inactive");
  }
}

export function updateLinkSection(
  wrapper: HTMLElement,
  linkGroupDetails: LinkGroupDetails
) {
  const titleElement = wrapper.querySelector(
    ".collection-title"
  ) as HTMLElement;
  titleElement.textContent = linkGroupDetails.title;

  const linkElements = wrapper.querySelectorAll(
    ".link"
  ) as NodeListOf<HTMLLinkElement>;
  if (linkElements.length != linkGroupDetails.links.length)
    throw new Error("missing link element or link data");
  linkElements.forEach((el, i) => {
    el.href = linkGroupDetails.links[i].href;

    const textNode = el.querySelector(".link-text");
    if (!textNode) throw new Error("something went wrong rendering your link");
    textNode.textContent = linkGroupDetails.links[i]["display text"];

    if (linkGroupDetails.links[i]["display text"] === EMPTY_LINK)
      linkElements[i].parentElement?.classList.add("inactive");
  });
}
