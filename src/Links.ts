import { z } from "zod";
import { EMPTY_ITEM } from "./data/CONSTANTS";
import { DEFAULT_LINKS } from "./data/DEFAULT_LINKS";
import DomRender from "./DomRender";

export const LINKS_LS_KEY = "links";

const LinkSchema = z.object({
  "display text": z.string(),
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
export type AllLinkGroups = [
  LinkGroup,
  LinkGroup,
  LinkGroup,
  LinkGroup,
  LinkGroup
];
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

export function getLinks(): AllLinkGroups {
  const lsItem = localStorage.getItem(LINKS_LS_KEY);
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
    return !l.href;
  });
}
export function displayLinkSection(
  container: HTMLElement,
  linkGroupDetails: LinkGroup
) {
  if (checkEmptyLinks(linkGroupDetails.links)) {
    container.classList.add("removed");
    return;
  }

  const titleElement = container.querySelector(
    ".collection-title"
  ) as HTMLElement;
  titleElement.textContent = linkGroupDetails.title;

  const linkElements = container.querySelectorAll(
    ".link"
  ) as NodeListOf<HTMLLinkElement>;

  for (let i = 0; i < linkElements.length; i++) {
    const link = linkGroupDetails.links[i];
    linkElements[i].href = link.href;
    const textNode = DomRender.textNode({
      text: link["display text"],
      classes: ["link-text"],
    });
    linkElements[i].append(textNode);
    if (!link.href) linkElements[i].parentElement?.classList.add("removed");
  }
}

export function updateLinkSection(
  container: HTMLElement,
  linkGroup: LinkGroup
) {
  if (checkEmptyLinks(linkGroup.links)) {
    container.classList.add("removed");
    return;
  }
  container.classList.remove("removed");
  const titleElement = container.querySelector(
    ".collection-title"
  ) as HTMLElement;
  titleElement.textContent = linkGroup.title;

  const linkElements = container.querySelectorAll(
    ".link"
  ) as NodeListOf<HTMLLinkElement>;

  linkElements.forEach((el, i) => {
    el.parentElement?.classList.remove("removed");
    const link = linkGroup.links[i];
    if (!link.href) {
      el.parentElement?.classList.add("removed");
      return;
    }
    el.href = link.href;

    let textNode = el.querySelector(".link-text");
    if (!textNode)
      throw new Error(
        "Something went wrong. Please refresh to see your changes."
      );
    textNode.textContent = link["display text"];
  });
}

let firstRender = true;
export function setLinks(linkGroups: AllLinkGroups) {
  const fn = firstRender ? displayLinkSection : updateLinkSection;
  firstRender = false;
  linkGroups.forEach((linkGroup, i) => {
    fn(linkSections[i], linkGroup);
  });
}

export function refreshLinks() {
  setLinks(getLinks());
}

export function saveLinks(data: any) {
  validateLinks(data);
  localStorage.setItem(LINKS_LS_KEY, JSON.stringify(data));
}

export function validateLinks(data: any): data is AllLinkGroups {
  AllLinkGroupsSchema.parse(data);
  return true;
}

export function initLinkSectionKeybinds(): void {
  let linkSectionFocusIndex = 0;
  let linkFocusIndex = 0;

  window.addEventListener("keydown", (e) => {
    if ((e.target as Element).tagName === "INPUT") return;
    if (e.key != "Tab" && !e.key.includes("Arrow")) return;

    const visibleSections = Array.from(linkSections).filter((el) => {
      return !el.classList.contains("removed");
    });

    function onArrowKey() {
      const linkElements = linkSections[linkSectionFocusIndex].querySelectorAll(
        ".link-wrapper"
      ) as NodeListOf<HTMLLinkElement>;

      const visibleLinks = Array.from(linkElements).filter((el) => {
        return !el.classList.contains("removed");
      });

      linkFocusIndex = Math.min(visibleLinks.length - 1, linkFocusIndex);
      visibleLinks[linkFocusIndex].focus();
    }
    switch (e.key) {
      case "ArrowDown": {
        linkFocusIndex = Math.min(linkFocusIndex + 1, 5);

        onArrowKey();
        break;
      }
      case "ArrowUp": {
        linkFocusIndex = Math.max(linkFocusIndex - 1, 0);
        onArrowKey();
        break;
      }
      case "ArrowLeft": {
        linkSectionFocusIndex = Math.max(linkSectionFocusIndex - 1, 0);
        onArrowKey();
        break;
      }
      case "ArrowRight": {
        linkSectionFocusIndex = Math.min(
          linkSectionFocusIndex + 1,
          visibleSections.length - 1
        );
        onArrowKey();
        break;
      }
      case "Tab": {
        const activeLinkSection = visibleSections.findIndex((el, i) => {
          const linkSectionHoldsActiveElement = Array.from(
            el.querySelectorAll(".link-wrapper")
          ).some((el, i) => {
            if (document.activeElement === el) {
              linkFocusIndex = i;
              return true;
            }
            return false;
          });

          if (linkSectionHoldsActiveElement) {
            linkSectionFocusIndex = i;
            return true;
          }

          return false;
        });
        linkSectionFocusIndex =
          activeLinkSection != -1 ? activeLinkSection : linkSectionFocusIndex;
      }
    }
  });
}
