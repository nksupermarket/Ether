import {
  CustomSearch,
  CUSTOM_SEARCH_DETAILS_LS_KEY,
  refreshSearch,
  saveCustomSearch,
  saveSearchEngine,
  SearchEngine,
  SEARCH_LS_KEY,
} from "../Search";
import { SettingsSectionWithChildren } from "./SettingsSection";
import { Component } from "./settingsTypes";
import InputGroup from "./InputGroup";

export default function initSearchSettings(
  search: SearchEngine,
  customSearchDetails: CustomSearch
) {
  function turnOnCustomSearch() {
    document
      .getElementById("custom-search-settings")
      ?.classList.remove("inactive");
  }
  function turnOffCustomSearch() {
    document
      .getElementById("custom-search-settings")
      ?.classList.add("inactive");
  }
  const searchSettings = new SettingsSectionWithChildren({
    title: "search",
    state: {
      search,
      [CUSTOM_SEARCH_DETAILS_LS_KEY]: customSearchDetails,
    },
    sectionEl: document.getElementById("search-settings") as HTMLElement,
    children: [
      (function SearchSettings() {
        return {
          sectionEl: document.getElementById(
            "search-settings-select-wrapper"
          ) as HTMLElement,
          render: function () {
            if (searchSettings.state[SEARCH_LS_KEY] === "custom") {
              turnOnCustomSearch();
            } else {
              turnOffCustomSearch();
            }
            const searchEngineSelect = searchSettings.sectionEl?.querySelector(
              "select[name='search-engine']"
            ) as HTMLSelectElement;
            searchEngineSelect.addEventListener("change", (e) => {
              const select = e.target as HTMLSelectElement;
              searchSettings.state.search = select.value as SearchEngine;
              if (select.value === "custom") {
                turnOnCustomSearch();
              } else {
                turnOffCustomSearch();
              }
            });

            const options = searchEngineSelect.querySelectorAll("option");
            options.forEach((o) => {
              if (o.value === searchSettings.state.search)
                o.setAttribute("selected", "true");
            });
          },
          rerender: function () {
            if (searchSettings.state[SEARCH_LS_KEY] === "custom") {
              turnOnCustomSearch();
            } else {
              turnOffCustomSearch();
            }

            const searchEngineSelect = searchSettings.sectionEl?.querySelector(
              "select[name='search-engine']"
            ) as HTMLSelectElement;
            const options = searchEngineSelect.querySelectorAll("option");
            options.forEach((o) => {
              if (o.value === searchSettings.state.search)
                o.setAttribute("selected", "true");
            });
          },
        };
      })() as Component,
      (function CustomSearchSettings() {
        return new InputGroup({
          wrapperEl: document
            .getElementById("custom-search-settings")
            ?.querySelector(".input-group") as HTMLElement,
          getState: function (): CustomSearch {
            return searchSettings.state[CUSTOM_SEARCH_DETAILS_LS_KEY];
          },
          id: "custom-search",
          updateState: function (e: Event) {
            let el = e.target as HTMLInputElement;
            let key = el.name as keyof CustomSearch;
            searchSettings.state[CUSTOM_SEARCH_DETAILS_LS_KEY][key] = el.value;
          },
        });
      })(),
    ],
    onSave: function () {
      if (this.state.search === "custom") {
        saveCustomSearch(this.state[CUSTOM_SEARCH_DETAILS_LS_KEY]);
        saveSearchEngine(this.state[SEARCH_LS_KEY]);
      } else {
        saveSearchEngine(this.state[SEARCH_LS_KEY]);
      }
      refreshSearch();
    },
  });

  return searchSettings;
}
