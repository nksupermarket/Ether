import DomRender from "../DomRender";
import LocalStorage from "../LocalStorage";
import { refreshSearch, saveSearch, SearchEngine } from "../Search";
import { Component, StatefulComponent } from "./settingsTypes";

export default function initMiscSettings(search: SearchEngine) {
  const miscSettings: Component = {
    render: function (this: Component) {
      if (Array.isArray(this.children))
        this.children.forEach((child) => child.render());
      else this.children?.render();
    },
    rerender: function (this: Component) {
      if (Array.isArray(this.children))
        this.children.forEach((child) => child.rerender());
      else this.children?.rerender();
    },
    children: [
      (function SearchSettings() {
        return {
          title: "search",
          state: search,
          sectionEl: document.getElementById("misc-settings") as HTMLElement,
          render: function () {
            const searchEngineSelect = this.sectionEl?.querySelector(
              "select[name='search-engine']"
            ) as HTMLSelectElement;
            searchEngineSelect.addEventListener("change", (e) => {
              const select = e.target as HTMLSelectElement;
              saveSearch(select.value as SearchEngine);
              refreshSearch();
            });

            const options = searchEngineSelect.querySelectorAll("option");
            options.forEach((o) => {
              if (o.value === this.state) o.setAttribute("selected", "true");
            });
          },
          rerender: function () {
            const searchEngineSelect = this.sectionEl?.querySelector(
              "select[name='search-engine']"
            ) as HTMLSelectElement;
            const options = searchEngineSelect.querySelectorAll("option");
            options.forEach((o) => {
              if (o.value === this.state) o.setAttribute("selected", "true");
            });
          },
        };
      })() as StatefulComponent<SearchEngine>,
      (function LinkButtons() {
        return {
          render: () => {
            const sectionEl = document.getElementById("misc-settings");
            const resetDefaultsLink = sectionEl?.querySelector(
              "a[data-role='reset to defaults']"
            );
            resetDefaultsLink?.addEventListener("click", () => {
              localStorage.clear();
              location.reload();
            });

            const copyConfigLink = sectionEl?.querySelector(
              "a[data-role='copy config']"
            );
            copyConfigLink?.addEventListener("click", (e) => {
              e.preventDefault();
              navigator.clipboard.writeText(LocalStorage.format());
              const msgEl = copyConfigLink?.parentElement?.querySelector(
                ".msg"
              ) as HTMLElement;
              DomRender.displayMsg(
                msgEl,
                "your config has been copied to your clipboard"
              );
              setTimeout(() => {
                msgEl.classList.add("hide");
              }, 3000);
            });
          },
          rerender: () => {},
        };
      })(),
    ],
  };
  return miscSettings;
}
