import InputGroup from "./InputGroup";
import LinkGroup from "./LinkGroup";
import SettingsSection from "./SettingsSection";
import { Link, LinkGroupDetails } from "../DEFAULTS";
import { Theme } from "../../types/interfaces";

export type InitSettingsProps = {
  links: LinkGroupDetails[];
  theme: Theme;
  onSaveTheme: () => void;
  onSaveLinks: () => void;
};
function getEnoughNodesForData(dataCount: number, selectorToCount: string) {
  let els = document.querySelectorAll(
    selectorToCount
  ) as NodeListOf<HTMLElement>;
  if (els.length === dataCount) return;

  while (els.length != dataCount) {
    let fn;
    if (els.length > dataCount) fn = els[els.length - 1].remove;
    else
      fn = () => {
        els[0].parentElement?.append(els[0].cloneNode(true));
      };

    fn();
    els = document.querySelectorAll(selectorToCount) as NodeListOf<HTMLElement>;
  }
}

export default function init({
  links,
  theme,
  onSaveTheme,
  onSaveLinks,
}: InitSettingsProps) {
  const themeSection = new SettingsSection({
    title: "theme",
    state: theme,
    sectionEl: document.getElementById("theme-settings") as HTMLElement,
    children: [
      new InputGroup({
        wrapperEl: document.getElementById("theme-settings") as HTMLElement,
        updateState: (e: Event) => {
          const target = e.target as HTMLInputElement;
          const key = target.name as keyof Theme;
          theme[key] = target.value;
        },
      }),
    ],
    onSave: onSaveTheme,
  });

  getEnoughNodesForData(links.length, "form[name='links'] > ul .link-group");
  const linkSection = new SettingsSection({
    title: "links",
    state: links,
    sectionEl: document.getElementById("link-settings") as HTMLElement,
    children: Array.from(document.querySelectorAll(".link-group")).map(
      (el, i) =>
        new LinkGroup({
          wrapperEl: el as HTMLElement,
          updateLink: (e: Event, elIndex: number) => {
            const target = e.target as HTMLInputElement;
            links[i].links[elIndex][target.name as keyof Link] = target.value;
          },
          updateTitle: (e: Event) => {
            const target = e.target as HTMLInputElement;
            links[i].title = target.value;
          },
        })
    ),
    onSave: onSaveLinks,
  });

  const sections = [themeSection, linkSection];
  sections.forEach((section) => section.render());
}
