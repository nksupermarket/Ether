import { Link, LinkGroupDetails, refreshLinks, saveLinks } from "../Links";
import LinkGroup from "./LinkGroup";
import { SettingsSectionWithChildren } from "./SettingsSection";

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
export default function initLinksSettings(links: LinkGroupDetails[]) {
  getEnoughNodesForData(links.length, "form[name='links'] > ul .link-group");
  document
    .querySelectorAll("form[name='links'] > ul .link-group > header")
    .forEach((el) =>
      el.addEventListener("click", function toggleAccordion(e) {
        const currTarget = e.currentTarget as HTMLElement;
        const accordion = currTarget.nextElementSibling as HTMLElement;
        const displayEl = el.querySelector(".display-mode");
        if (displayEl?.classList.contains("hide")) return;
        accordion.classList.toggle("accordion");
        el.classList.toggle("accordion-closed");
      })
    );
  const linkSection = new SettingsSectionWithChildren({
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
          getState: (): LinkGroupDetails => linkSection.state[i],
          id: "group-" + i.toString(),
        })
    ),
    onSave: () => {
      saveLinks(linkSection.state);
      refreshLinks();
    },
  });
  return linkSection;
}
