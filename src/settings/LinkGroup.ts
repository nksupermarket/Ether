import { LinkGroupDetails } from "../DEFAULTS";
import InputGroup from "./InputGroup";
import { Component } from "./settingsTypes";

type LinkGroupProps = {
  wrapperEl: HTMLElement;
  updateTitle: (e: Event) => void;
  updateLink: (e: Event, elIndex: number) => void;
  getState: () => LinkGroupDetails;
  id: string;
};
export default class LinkGroup implements Component {
  wrapperEl: HTMLElement;
  updateTitle: (e: Event) => void;
  updateLink: (e: Event, elIndex: number) => void;
  children: InputGroup[];
  getState: () => LinkGroupDetails;
  id: string;

  constructor({
    wrapperEl,
    updateLink,
    updateTitle,
    getState,
    id,
  }: LinkGroupProps) {
    this.wrapperEl = wrapperEl;
    this.updateLink = updateLink;
    this.updateTitle = updateTitle;
    this.getState = getState;
    this.id = id;
    const linkEls = this.wrapperEl.querySelectorAll(".link-details");
    this.children = Array.from(linkEls).map(
      (el, i) =>
        new InputGroup({
          wrapperEl: el as HTMLElement,
          updateState: (e: Event) => {
            updateLink(e, i);
          },
          getState: () => getState().links[i],
          id: this.id + i.toString(),
        })
    );
  }

  render() {
    const state = this.getState();
    const titleInputEl = this.wrapperEl.querySelector(
      "header input"
    ) as HTMLInputElement;
    titleInputEl.value = state.title;
    titleInputEl.addEventListener("input", (e) => {
      this.updateTitle(e);
      this.rerender();
    });
    const titleEl = this.wrapperEl.querySelector(
      "header span.link-group-title"
    ) as HTMLElement;
    titleEl.textContent = state.title;

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
    this.children.forEach((child) => child.render());
  }

  rerender() {
    const state = this.getState();
    const titleInputEl = this.wrapperEl.querySelector(
      "header input"
    ) as HTMLInputElement;
    titleInputEl.value = state.title;
    const titleEl = this.wrapperEl.querySelector(
      "header span.link-group-title"
    ) as HTMLElement;
    titleEl.textContent = state.title;

    this.children.forEach((child) => child.rerender());
  }
}
