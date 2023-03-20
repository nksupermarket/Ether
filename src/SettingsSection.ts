export default class SettingsSection {
  readonly title: string;
  state: {
    [key: string]: string;
  };
  private _defaultState: {
    [key: string]: string;
  };
  private readonly sectionEl: HTMLElement;

  constructor(
    title: string,
    state: {
      [key: string]: string;
    },
    sectionEl: HTMLElement
  ) {
    this.title = title;
    this.state = state;
    this._defaultState = JSON.parse(JSON.stringify(state));
    this.sectionEl = sectionEl;

    this.updateState = this.updateState.bind(this);
  }

  save() {
    localStorage.setItem("title", JSON.stringify(this.state));
  }

  updateState(e: Event) {
    const target = e.target as HTMLInputElement;
    this.state[target.id] = target.value;
  }

  rerender() {
    const fields = this.sectionEl.querySelectorAll(".input-wrapper");

    const entries = Object.entries(this.state);
    for (let i = 0; i < entries.length; i++) {
      if (!fields[i] || !entries[i]) break;

      const input = fields[i].querySelector("input") as HTMLInputElement;
      const [, value] = entries[i];
      input.value = value as string;
    }
  }

  reset() {
    this.state = JSON.parse(JSON.stringify(this._defaultState));
  }

  render() {
    const fields = this.sectionEl.querySelectorAll(".input-wrapper");

    const entries = Object.entries(this.state);
    for (let i = 0; i < entries.length; i++) {
      if (!fields[i] || !entries[i]) break;

      const label = fields[i].querySelector("label");
      const input = fields[i].querySelector("input") as HTMLInputElement;
      const [name, value] = entries[i];
      label?.setAttribute("for", name);
      input.id = name;
      input.value = value as string;
      input.addEventListener("input", this.updateState);
    }

    this.sectionEl.querySelector("form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      this.save();
    });

    const resetButton = this.sectionEl.querySelector(
      "button[aria-label='reset']"
    );
    resetButton?.addEventListener("click", () => {
      this.reset();
      this.rerender();
    });
  }
}
