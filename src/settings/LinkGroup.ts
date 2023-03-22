import { LinkGroupDetails } from "../DEFAULTS";
import InputGroup from "./InputGroup";
import { Component } from "./settingsTypes";

type LinkGroupProps = {
  wrapperEl: HTMLElement;
  updateTitle: (e: Event) => void;
  updateLink: (e: Event, elIndex: number) => void;
};
export default class LinkGroup implements Component {
  wrapperEl: HTMLElement;
  updateTitle: (e: Event) => void;
  updateLink: (e: Event, elIndex: number) => void;
  children: InputGroup[];

  constructor({ wrapperEl, updateLink, updateTitle }: LinkGroupProps) {
    this.wrapperEl = wrapperEl;
    this.updateLink = updateLink;
    this.updateTitle = updateTitle;
    const linkEls = this.wrapperEl.querySelectorAll(".link-details");
    this.children = Array.from(linkEls).map(
      (el, i) =>
        new InputGroup({
          wrapperEl: el as HTMLElement,
          updateState: (e: Event) => {
            updateLink(e, i);
          },
        })
    );
  }

  render(values: LinkGroupDetails) {
    const titleEl = this.wrapperEl.querySelector(
      "header input"
    ) as HTMLInputElement;
    titleEl.value = values.title;

    this.children.forEach((child, i) => child.render(values.links[i]));
  }

  rerender(values: LinkGroupDetails) {
    const titleEl = this.wrapperEl.querySelector(
      "header input"
    ) as HTMLInputElement;
    titleEl.value = values.title;

    this.children.forEach((child, i) => child.rerender(values.links[i]));
  }
}
