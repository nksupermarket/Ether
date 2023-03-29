import { LinkGroup, AllLinkGroups } from "../Links";
import { EMPTY_ITEM } from "./CONSTANTS";

const SOCIAL_LINKS: LinkGroup = {
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
      "display text": EMPTY_ITEM,
      href: "",
    },
    {
      "display text": "Reddit",
      href: "https://www.reddit.com/",
    },
    {
      "display text": "Discord",
      href: "https://www.discord.com/",
    },
    {
      "display text": "Gmail",
      href: "https://www.gmail.com/",
    },
  ],
};

const REDDIT_LINKS: LinkGroup = {
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
    {
      "display text": "Rust",
      href: "https://www.reddit.com/r/rust/",
    },
    {
      "display text": EMPTY_ITEM,
      href: "",
    },
  ],
};

const TOOLS_LINKS: LinkGroup = {
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
      "display text": "Coolors",
      href: "https://www.coolors.co/",
    },
    {
      "display text": "Patterns",
      href: "https://www.heropatterns.com/",
    },
    {
      "display text": "Everforest",
      href: "https://github.com/sainnhe/everforest",
    },
  ],
};

const FAVORITES_LINKS: LinkGroup = {
  title: "Favorites",
  links: [
    {
      "display text": "lh:3000",
      href: "http://localhost:3000",
    },
    {
      "display text": "lh:8080",
      href: "http://localhost:8080",
    },
    {
      "display text": "lh:5173",
      href: "http://localhost:5173",
    },
    {
      "display text": EMPTY_ITEM,
      href: "",
    },
    {
      "display text": EMPTY_ITEM,
      href: "",
    },
    {
      "display text": EMPTY_ITEM,
      href: "",
    },
  ],
};
const MEDIA_LINKS: LinkGroup = {
  title: "Media",
  links: [
    {
      "display text": "Youtube",
      href: "http://www.youtube.com",
    },
    {
      "display text": "YT Music",
      href: "https://music.youtube.com",
    },
    {
      "display text": EMPTY_ITEM,
      href: "",
    },
    {
      "display text": EMPTY_ITEM,
      href: "",
    },
    {
      "display text": EMPTY_ITEM,
      href: "",
    },
    {
      "display text": EMPTY_ITEM,
      href: "",
    },
  ],
};

export const DEFAULT_LINKS: AllLinkGroups = [
  SOCIAL_LINKS,
  REDDIT_LINKS,
  TOOLS_LINKS,
  MEDIA_LINKS,
  FAVORITES_LINKS,
];
