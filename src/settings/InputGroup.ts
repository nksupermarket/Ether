import { StringKeyObj } from "../../types/interfaces";
import { Component } from "./settingsTypes";

type InputGroupProps = {
  wrapperEl: HTMLElement;
  getState: () => StringKeyObj;
  updateState: (e: Event) => void;
  id: string;
};
export default class InputGroup implements Component {
  wrapperEl: HTMLElement;
  updateState: (e: Event) => void;
  private readonly getState: () => StringKeyObj;
  private readonly id: string;

  constructor({ wrapperEl, updateState, getState, id }: InputGroupProps) {
    this.wrapperEl = wrapperEl;
    this.updateState = updateState.bind(this);
    this.getState = getState;
    this.id = id;
  }
  render() {
    const state = this.getState();
    const fields = this.wrapperEl.querySelectorAll(".input-wrapper");

    const entries = Object.entries(state);
    for (let i = 0; i < entries.length; i++) {
      if (!fields[i] || !entries[i]) break;

      const label = fields[i].querySelector("label") as HTMLLabelElement;
      const input = fields[i].querySelector("input") as HTMLInputElement;
      const [name, value] = entries[i];
      const labelFor = `${this.id}-${name.replace(" ", "-")}`;
      label.textContent = name;
      label.setAttribute("for", labelFor);
      input.id = labelFor;
      input.name = name;
      input.value = value as string;

      input.addEventListener("input", this.updateState);
    }
  }

  rerender() {
    const state = this.getState();
    const fields = this.wrapperEl.querySelectorAll(".input-wrapper");

    const entries = Object.entries(state);
    for (let i = 0; i < entries.length; i++) {
      if (!fields[i] || !entries[i]) break;

      const input = fields[i].querySelector("input") as HTMLInputElement;
      const [, value] = entries[i];
      input.value = value as string;
    }
  }
}
