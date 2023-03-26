import { z } from "zod";
import { EMPTY_LINK } from "./CONSTANTS";

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
  href: z.string(),
});
const LinkGroupSchema = z
  .object({
    title: z.string(),
    links: z.array(LinkSchema).length(4, "each link group must have 4 links"),
  })
  .strict();
export const LinksSchema = z
  .array(LinkGroupSchema)
  .length(4, "4 link groups are required");

const SOCIAL_LINKS: LinkGroupDetails = {
  title: "Socials",
  links: [
    {
      "display text": "Instagram",
      href: "https://www.instagram.com/",
    },
    {
      "display text": "Twitter",
      href: "https://twitter.com/",
    },
    {
      "display text": "Facebook",
      href: "https://www.facebook.com/",
    },
    {
      "display text": "Reddit",
      href: "https://www.reddit.com/",
    },
  ],
};

const REDDIT_LINKS: LinkGroupDetails = {
  title: "Reddit",
  links: [
    {
      "display text": "UnixPorn",
      href: "https://www.reddit.com/r/unixporn/",
    },
    {
      "display text": "Startpages",
      href: "https://www.reddit.com/r/startpages/",
    },
    {
      "display text": "NBA",
      href: "https://www.reddit.com/r/nba/",
    },
    {
      "display text": "Neovim",
      href: "https://www.reddit.com/r/neovim/",
    },
  ],
};

const TOOLS_LINKS: LinkGroupDetails = {
  title: "Tools",
  links: [
    {
      "display text": "Github",
      href: "https://github.com/",
    },
    {
      "display text": "Figma",
      href: "https://www.figma.com/",
    },
    {
      "display text": "ChatGPT",
      href: "https://chat.openai.com/",
    },
    {
      "display text": "Shopify",
      href: "https://www.shopify.com/",
    },
  ],
};

const FAVORITES_LINKS: LinkGroupDetails = {
  title: "Favorites",
  links: [
    {
      "display text": EMPTY_LINK,
      href: "",
    },
    {
      "display text": EMPTY_LINK,
      href: "",
    },
    {
      "display text": EMPTY_LINK,
      href: "",
    },
    {
      "display text": EMPTY_LINK,
      href: "",
    },
  ],
};

export const DEFAULT_LINKS: LinkGroupDetails[] = [
  SOCIAL_LINKS,
  REDDIT_LINKS,
  TOOLS_LINKS,
  FAVORITES_LINKS,
];
