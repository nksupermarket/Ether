import { z } from "zod";

const searchEngines = Object.freeze({
  duckduckgo: "https://www.duckduckgo.com/search",
  google: "https://www.google.com/search",
} as const);

export type SearchEngine = keyof typeof searchEngines;

const SearchEngineSchema = z.enum(["duckduckgo", "google"]);

export function saveSearch(data: any) {
  const se = data.toLowerCase();
  validateSearch(se);
  localStorage.setItem("search", JSON.stringify(se));
}

export function setSearch(engine: SearchEngine): void {
  const searchEl = document.querySelector(".search-form");
  searchEl?.setAttribute("action", searchEngines[engine]);
  const icons = searchEl?.querySelectorAll("svg");
  icons?.forEach((icon) => {
    if (icon.dataset.search != engine) icon.classList.add("removed");
    else icon.classList.remove("removed");
  });
}

export function getSearch(): SearchEngine {
  const lsItem = localStorage.getItem("search");
  if (lsItem) return JSON.parse(lsItem) as SearchEngine;
  saveSearch("google");
  return "google";
}

export function refreshSearch(): void {
  setSearch(getSearch());
}

export function validateSearch(data: any): data is SearchEngine {
  SearchEngineSchema.parse(data, {
    errorMap: (error) => {
      if (error.code === "invalid_enum_value") {
        return {
          message:
            "Invalid search engine. Please select from Google or DuckDuckGo.",
        };
      }
      return { message: "Something went wrong. Please try again." };
    },
  });
  return true;
}
