import { z } from "zod";
import { EMPTY_LINK } from "./CONSTANTS";
import { DEFAULT_LINKS } from "./data/DEFAULT_LINKS";
import DomRender from "./DomRender";

export type Link = {
  "display text": string;
  href: string;
};
export type LinkGroupDetails = {
  title: string;
  links: [Link, Link, Link, Link];
};
const LinkSchema = z.object({
  "display text": z.string(),
  href: z.union([z.string().url("Invalid href"), z.literal("")]),
});

const LinkGroupSchema = z
  .object({
    title: z.string(),
    links: z.array(LinkSchema).length(4, "each link group must have 4 links"),
  })
  .strict();

const LinksSchema = z
  .array(LinkGroupSchema)
  .length(4, "4 link groups are required");

const linkSections = document.querySelectorAll(
  ".collection-links-wrapper"
) as NodeListOf<HTMLElement>;

export function getLinks(): LinkGroupDetails[] {
  const lsItem = localStorage.getItem("links");
  if (lsItem) {
    const allLinks = JSON.parse(lsItem) as LinkGroupDetails[];
    return allLinks.map((linkGroup) => {
      linkGroup.links = linkGroup.links.map((link) => {
        if (!link.href) link["display text"] = EMPTY_LINK;
        return link;
      }) as [Link, Link, Link, Link];
      return linkGroup;
    });
  }
  localStorage.setItem("links", JSON.stringify(DEFAULT_LINKS));
  return DEFAULT_LINKS;
}

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

let firstRender = true;
export function setLinks(links: LinkGroupDetails[]) {
  const fn = firstRender ? displayLinkSection : updateLinkSection;
  firstRender = false;
  links.forEach((link, i) => fn(linkSections[i], link));
}

export function refreshLinks() {
  setLinks(getLinks());
}

export function saveLinks(data: any) {
  validateLinks(data);
  localStorage.setItem("links", JSON.stringify(data));
}

export function validateLinks(data: any): data is LinkGroupDetails[] {
  LinksSchema.parse(data);
  return true;
}
