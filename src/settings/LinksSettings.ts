import {
  Link,
  LinkGroupDetails,
  LINK_COUNT,
  LINK_GROUP_COUNT,
  refreshLinks,
  saveLinks,
} from "../Links";
import LinkGroup from "./LinkGroup";
import { SettingsSectionWithChildren } from "./SettingsSection";

function getEnoughNodesForData(
  dataCount: number,
  selectorToCount: string,
  wrapperEl: Element | Document = document
) {
  let els = wrapperEl.querySelectorAll(
    selectorToCount
  ) as NodeListOf<HTMLElement>;
  console.log(els);
  if (els.length === dataCount) return;

  while (els.length != dataCount) {
    let fn;
    if (els.length > dataCount) fn = els[els.length - 1].remove;
    else
      fn = () => {
        els[0].parentElement?.append(els[0].cloneNode(true));
      };

    fn();
    els = wrapperEl.querySelectorAll(
      selectorToCount
    ) as NodeListOf<HTMLElement>;
  }
}
export default function initLinksSettings(links: LinkGroupDetails[]) {
  getEnoughNodesForData(
    LINK_GROUP_COUNT,
    "form[name='links'] > ul .link-group"
  );
  const linkGroupEls = document.querySelectorAll(
    "form[name='links'] > ul .link-group"
  );
  linkGroupEls.forEach((el) =>
    getEnoughNodesForData(LINK_COUNT, ".link-details", el)
  );
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
    children: [
      ...Array.from(
        document.querySelectorAll("#link-settings .link-group")
      ).map(
        (el, i) =>
          new LinkGroup({
            wrapperEl: el as HTMLElement,
            updateLink: (e: Event, elIndex: number) => {
              const target = e.target as HTMLInputElement;
              if (!linkSection.state[i])
                linkSection.state[i] = { title: "", links: [] };
              linkSection.state[i].links[elIndex]![target.name as keyof Link] =
                target.value;
            },
            updateTitle: (e: Event) => {
              const target = e.target as HTMLInputElement;
              links[i].title = target.value;
            },
            getState: (): LinkGroupDetails => linkSection.state[i],
            id: "group-" + i.toString(),
          })
      ),
    ],
    onSave: () => {
      saveLinks(linkSection.state);
      refreshLinks();
    },
  });
  return linkSection;
}
