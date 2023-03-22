import { EMPTY_LINK } from "./CONSTANTS";

export type Link = {
  "display text": string;
  href: string;
};
export type LinkGroupDetails = {
  title: string;
  links: Link[];
};
const SOCIAL_LINKS = {
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

const REDDIT_LINKS = {
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

const TOOLS_LINKS = {
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

const FAVORITES_LINKS = {
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
