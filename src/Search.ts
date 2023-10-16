import { z } from "zod";
import { isModalOpen } from "./Modal";

export const SEARCH_LS_KEY = "search";
export const CUSTOM_SEARCH_DETAILS_LS_KEY = "custom search details";

const searchEngines = {
  duckduckgo: "https://www.duckduckgo.com/",
  google: "https://www.google.com/search",
  custom: "",
};

const SearchEngineSchema = z.enum(["duckduckgo", "google", "custom"]);
const CustomSearchSchema = z.object({
  name: z.string(),
  "query url": z.string().url("Custom search query url is not a valid url"),
});

export type SearchEngine = z.infer<typeof SearchEngineSchema>;
export type CustomSearch = z.infer<typeof CustomSearchSchema>;

const searchForm = document.querySelector(".search-form");
const urlForm = document.querySelector(".url-form");
const urlInput = urlForm?.querySelector("input") as HTMLInputElement;

export function onNavigate(e: Event) {
  e.preventDefault();
  const location = urlInput.value;
  window.location.assign(location);
}

export function saveSearchEngine(data: any) {
  const se = typeof data == "string" ? data.toLowerCase() : "";
  if (validateSearchEngine(se)) {
    localStorage.setItem(SEARCH_LS_KEY, JSON.stringify(se));
  }
}
export function saveCustomSearch(data: any) {
  if (validateCustomSearch(data)) {
    localStorage.setItem(CUSTOM_SEARCH_DETAILS_LS_KEY, JSON.stringify(data));
  }
}

export function setSearch(engine: SearchEngine): void {
  if (engine === "custom") {
    const customSearchDetails = getCustomSearchDetails();

    if (customSearchDetails) {
      searchEngines.custom = customSearchDetails["query url"];
      let customSearchIcon = document.querySelector(
        "[data-search='custom']",
      ) as HTMLElement;
      customSearchIcon.textContent = customSearchDetails.name;
    } else {
      engine = "google";
    }
  }

  searchForm?.setAttribute("action", searchEngines[engine]);
  const icons = searchForm?.querySelectorAll(
    ".search-icon",
  ) as NodeListOf<HTMLElement>;
  icons?.forEach((icon) => {
    if (icon.dataset.search != engine) icon.classList.add("removed");
    else icon.classList.remove("removed");
  });
}

export function getSearch(): SearchEngine {
  const lsItem = localStorage.getItem(SEARCH_LS_KEY);
  if (lsItem) {
    return JSON.parse(lsItem) as SearchEngine;
  }
  saveSearchEngine("google");
  return "google";
}

export function getCustomSearchDetails(): CustomSearch | null {
  const lsItem = localStorage.getItem(CUSTOM_SEARCH_DETAILS_LS_KEY);
  if (lsItem) {
    return JSON.parse(lsItem) as CustomSearch;
  }
  return null;
}

export function refreshSearch(): void {
  setSearch(getSearch());
}

export function validateCustomSearch(data: unknown): data is CustomSearch {
  if (data == null) return true;
  CustomSearchSchema.parse(data);
  return true;
}
export function validateSearchEngine(data: unknown): data is SearchEngine {
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
