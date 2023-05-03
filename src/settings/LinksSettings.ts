import {
  Link,
  AllLinkGroups,
  LINK_COUNT,
  LINK_GROUP_COUNT,
  refreshLinks,
  saveLinks,
  LinkGroup,
  LINKS_LS_KEY,
} from "../Links";
import LinkEditorGroup from "./LinkGroup";
import { SettingsSectionWithChildren } from "./SettingsSection";

function getEnoughNodesForData(
  dataCount: number,
  selectorToCount: string,
  wrapperEl: Element | Document = document
) {
  let els = wrapperEl.querySelectorAll(
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
    els = wrapperEl.querySelectorAll(
      selectorToCount
    ) as NodeListOf<HTMLElement>;
  }
}
export default function initLinksSettings(links: AllLinkGroups) {
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
    title: LINKS_LS_KEY,
    state: links,
    sectionEl: document.getElementById("link-settings") as HTMLElement,
    children: [
      ...Array.from(
        document.querySelectorAll("#link-settings .link-group")
      ).map(
        (el, i) =>
          new LinkEditorGroup({
            wrapperEl: el as HTMLElement,
            updateLink: (e: Event, elIndex: number) => {
              const target = e.target as HTMLInputElement;
              linkSection.state[i].links[elIndex]![target.name as keyof Link] =
                target.value;
            },
            updateTitle: (e: Event) => {
              const target = e.target as HTMLInputElement;
              links[i].title = target.value;
            },
            getState: (): LinkGroup => linkSection.state[i],
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
