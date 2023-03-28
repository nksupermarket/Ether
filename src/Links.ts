import { z } from "zod";
import { EMPTY_ITEM } from "./data/CONSTANTS";
import { DEFAULT_LINKS } from "./data/DEFAULT_LINKS";
import DomRender from "./DomRender";

const LinkSchema = z.object({
  "display text": z.string({
    required_error: "Display text is required",
  }),
  href: z.union([z.string().url("Invalid href"), z.literal("")]),
});

export const LINK_COUNT = 6 as const;
const LinkGroupSchema = z
  .object({
    title: z.string(),
    links: z
      .array(LinkSchema)
      .max(LINK_COUNT, "Each link group can only have 6 links."),
  })
  .strict();

export const LINK_GROUP_COUNT = 5;
const AllLinkGroupsSchema = z
  .array(LinkGroupSchema)
  .max(LINK_GROUP_COUNT, "There may only be 5 link groups.");

const linkSections = document.querySelectorAll(
  ".collection-links-wrapper"
) as NodeListOf<HTMLElement>;

export class Link {
  "display text": string;
  href: string;
  constructor() {
    (this["display text"] = EMPTY_ITEM), (this.href = "");
  }
}

type AllLinks = [Link, Link, Link, Link, Link, Link];

export class LinkGroup {
  title: string;
  links: AllLinks;
  constructor() {
    this.title = EMPTY_ITEM;
    this.links = Array(LINK_COUNT)
      .fill(undefined)
      .map(() => new Link()) as AllLinks;
  }
}

export type AllLinkGroups = [
  LinkGroup,
  LinkGroup,
  LinkGroup,
  LinkGroup,
  LinkGroup
];

export function getLinks(): AllLinkGroups {
  const lsItem = localStorage.getItem("links");
  let linkGroups = lsItem ? JSON.parse(lsItem) : DEFAULT_LINKS;
  linkGroups = linkGroups.filter((g: LinkGroup | undefined) => !!g);
  while (linkGroups.length < LINK_GROUP_COUNT) {
    linkGroups.push(new LinkGroup());
  }
  linkGroups.forEach((group: LinkGroup) => {
    while (group.links.length < LINK_COUNT) {
      group.links.push(new Link());
    }
  });
  if (!lsItem) saveLinks(linkGroups);
  return linkGroups;
}

function checkEmptyLinks(links: AllLinks): boolean {
  return links.every((l) => {
    return !l?.href;
  });
}
export function displayLinkSection(
  wrapper: HTMLElement,
  linkGroupDetails: LinkGroup
) {
  if (
    !linkGroupDetails.links.length ||
    checkEmptyLinks(linkGroupDetails.links)
  ) {
    wrapper.classList.add("hide");
    return;
  }
  const titleElement = wrapper.querySelector(
    ".collection-title"
  ) as HTMLElement;
  titleElement.textContent = linkGroupDetails.title;

  const linkElements = wrapper.querySelectorAll(
    ".link"
  ) as NodeListOf<HTMLLinkElement>;

  for (let i = 0; i < linkElements.length; i++) {
    const link = linkGroupDetails.links[i];
    if (!link || !link.href) continue;
    linkElements[i].href = link.href;
    linkElements[i].append(
      DomRender.textNode({
        text: link["display text"],
        classes: ["link-text"],
      })
    );
  }
}

export function updateLinkSection(wrapper: HTMLElement, linkGroup: LinkGroup) {
  if (!linkGroup.links.length) {
    wrapper.classList.add("hide");
    return;
  }
  wrapper.classList.remove("hide");
  const titleElement = wrapper.querySelector(
    ".collection-title"
  ) as HTMLElement;
  titleElement.textContent = linkGroup.title;

  const linkElements = wrapper.querySelectorAll(
    ".link"
  ) as NodeListOf<HTMLLinkElement>;

  linkElements.forEach((el, i) => {
    const link = linkGroup.links[i];
    if (!link || !link.href) {
      el.classList.add("hide");
      return;
    }
    el.classList.remove("hide");
    el.href = link.href;

    const textNode = el.querySelector(".link-text");
    if (!textNode) throw new Error("something went wrong rendering your link");
    textNode.textContent = link["display text"];
  });
}

let firstRender = true;
export function setLinks(linkGroups: AllLinkGroups) {
  const fn = firstRender ? displayLinkSection : updateLinkSection;
  firstRender = false;
  linkGroups.forEach((linkGroup, i) => {
    if (checkEmptyLinks(linkGroup.links)) {
      linkSections[i].classList.add("hide");
      return;
    }
    fn(linkSections[i], linkGroup);
  });
}

export function refreshLinks() {
  setLinks(getLinks());
}

export function saveLinks(data: any) {
  validateLinks(data);
  console.log(data);
  localStorage.setItem("links", JSON.stringify(data));
}

export function validateLinks(data: any): data is AllLinkGroups {
  AllLinkGroupsSchema.parse(data);
  return true;
}
