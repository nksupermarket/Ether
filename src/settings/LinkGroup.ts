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
    const titleInputEl = this.wrapperEl.querySelector(
      "header input"
    ) as HTMLInputElement;
    titleInputEl.value = values.title;
    titleInputEl.addEventListener("input", (e) => {
      this.updateTitle(e);
      this.rerender(values);
    });
    const titleEl = this.wrapperEl.querySelector(
      "header span.link-group-title"
    ) as HTMLElement;
    titleEl.textContent = values.title;

    const editButton = this.wrapperEl.querySelector("header .edit-button");
    const toggleEditMode = (e: Event) => {
      e.stopPropagation();
      this.wrapperEl.querySelector(".display-mode")?.classList.toggle("hide");
      this.wrapperEl.querySelector(".edit-mode")?.classList.toggle("hide");
    };
    editButton?.addEventListener("click", toggleEditMode);

    const doneButton = this.wrapperEl.querySelector("header .done-button");
    doneButton?.addEventListener("click", (e) => {
      toggleEditMode(e);
    });
    this.children.forEach((child, i) => child.render(values.links[i]));
  }

  rerender(values: LinkGroupDetails) {
    const titleInputEl = this.wrapperEl.querySelector(
      "header input"
    ) as HTMLInputElement;
    titleInputEl.value = values.title;
    const titleEl = this.wrapperEl.querySelector(
      "header span.link-group-title"
    ) as HTMLElement;
    titleEl.textContent = values.title;

    this.children.forEach((child, i) => child.rerender(values.links[i]));
  }
}
