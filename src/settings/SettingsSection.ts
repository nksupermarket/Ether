import { Component } from "./settingsTypes";
import { StringKeyObj } from "../../types/interfaces";

type SettingsSectionProps = {
  title: string;
  state: StringKeyObj | StringKeyObj[];
  sectionEl: HTMLElement;
  children: Component[];
  onSave: () => void;
};
export default class SettingsSection implements Component {
  readonly title: string;
  state: StringKeyObj[] | StringKeyObj;
  private _defaultState: StringKeyObj[] | StringKeyObj;
  readonly sectionEl: HTMLElement;
  children: Component[];
  onSave: () => void;

  constructor({
    title,
    state,
    sectionEl,
    children,
    onSave,
  }: SettingsSectionProps) {
    this.title = title;
    this.state = state;
    this._defaultState = JSON.parse(JSON.stringify(state));
    this.sectionEl = sectionEl;
    this.children = children;
    this.onSave = onSave;
  }

  saveState() {
    localStorage.setItem(`${this.title}`, JSON.stringify(this.state));
    this._defaultState = this.state;
    this.displaySuccessMsg();
  }

  displaySuccessMsg() {
    const msgEl = this.sectionEl.querySelector(".msg") as HTMLElement;
    msgEl.textContent = `success, your ${this.title} settings have been saved`;
    msgEl.classList.remove("hide");
    setTimeout(() => {
      msgEl.classList.add("hide");
    }, 3000);
  }

  render() {
    this.children.forEach((child, i) => {
      if (Array.isArray(this.state)) child.render(this.state[i]);
      else child.render(this.state);
    });
    this.sectionEl
      .querySelector("button[type='submit']")
      ?.addEventListener("click", (e) => {
        e.preventDefault();
        this.saveState();
        this.onSave();
      });

    const resetButton = this.sectionEl.querySelector(
      "button[aria-label='reset']"
    );
    resetButton?.addEventListener("click", () => {
      this.reset();
      this.rerender();
    });
  }

  rerender() {
    this.children.forEach((child, i) => {
      if (Array.isArray(this.state)) child.render(this.state[i]);
      else child.render(this.state);
    });
  }

  reset() {
    this.state = JSON.parse(JSON.stringify(this._defaultState));
  }
}
