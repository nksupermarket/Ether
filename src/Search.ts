import { z } from "zod";
import { isModalOpen } from "./Modal";

const searchEngines = Object.freeze({
  duckduckgo: "https://www.duckduckgo.com/",
  google: "https://www.google.com/search",
} as const);

export type SearchEngine = keyof typeof searchEngines;

const SearchEngineSchema = z.enum(["duckduckgo", "google"]);
const searchForm = document.querySelector(".search-form");
const urlForm = document.querySelector(".url-form");
const urlInput = urlForm?.querySelector("input") as HTMLInputElement;

export function onNavigate(e: Event) {
  e.preventDefault();
  const location = urlInput.value;
  window.location.assign(location);
}

export function saveSearch(data: any) {
  const se = data.toLowerCase();
  validateSearch(se);
  localStorage.setItem("search", JSON.stringify(se));
}

export function setSearch(engine: SearchEngine): void {
  searchForm?.setAttribute("action", searchEngines[engine]);
  const icons = searchForm?.querySelectorAll("svg");
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

function focusSearch() {
  searchForm?.classList.remove("removed");
  urlForm?.classList.add("removed");
  searchForm?.querySelector("input")?.focus();
}

function focusUrl() {
  searchForm?.classList.add("removed");
  urlForm?.classList.remove("removed");
  urlInput.focus();
  const val = urlInput.value;
  urlInput.value = "";
  urlInput.value = val;
}

export function initSearchBar() {
  urlForm?.addEventListener("submit", onNavigate);

  window.addEventListener("keydown", (e) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
    if (e.key === "Shift" && !isModalOpen()) {
      focusSearch();
    }
    if (e.key === "Control" && !isModalOpen()) {
      focusUrl();
    }
  });
}
