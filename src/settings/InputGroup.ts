import { Component } from "./settingsTypes";

type InputGroupProps = {
  wrapperEl: HTMLElement;
  updateState: (e: Event) => void;
};
export default class InputGroup implements Component {
  wrapperEl: HTMLElement;
  updateState: (e: Event) => void;

  constructor({ wrapperEl, updateState }: InputGroupProps) {
    this.wrapperEl = wrapperEl;
    this.updateState = updateState.bind(this);
  }
  render(state: { [key: string]: string }) {
    const fields = this.wrapperEl.querySelectorAll(".input-wrapper");

    const entries = Object.entries(state);
    for (let i = 0; i < entries.length; i++) {
      if (!fields[i] || !entries[i]) break;

      const label = fields[i].querySelector("label") as HTMLLabelElement;
      const input = fields[i].querySelector("input") as HTMLInputElement;
      const [name, value] = entries[i];
      label.textContent = name;
      label.setAttribute("for", name);
      input.name = name;
      input.value = value as string;

      input.addEventListener("input", this.updateState);
    }
  }

  rerender(state: { [key: string]: string }) {
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
