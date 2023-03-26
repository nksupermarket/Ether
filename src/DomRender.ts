let singleton: undefined | DomRender;

interface TextNodeDetails {
  text?: string;
  classes?: string[];
}

interface OptionDetails extends TextNodeDetails {
  value: string;
}

type FieldDetails = {
  wrapperClasses?: string[];
  labelClasses?: string[];
  inputClasses?: string[];
  labelText: string;
  name: string;
  type: "text";
  value: string;
};
class DomRender {
  constructor() {
    if (!singleton) {
      singleton = this;
      return this;
    } else return singleton;
  }

  textNode(details: TextNodeDetails): HTMLSpanElement {
    const span = document.createElement("span");
    span.textContent = details.text || "";
    if (details.classes) span.classList.add(...details.classes);
    return span;
  }

  option(details: OptionDetails): HTMLOptionElement {
    const option = document.createElement("option");
    option.textContent = details.text || "";
    option.value = details.value;
    if (details.classes) option.classList.add(...details.classes);
    return option;
  }

  field(details: FieldDetails): HTMLDivElement {
    const wrapper = document.createElement("div");
    if (details.wrapperClasses)
      wrapper.classList.add(...details.wrapperClasses);

    const label = document.createElement("label");
    if (details.labelClasses) label.classList.add(...details.labelClasses);

    const input = document.createElement("input");
    input.type = details.type;
    input.name = details.name;
    input.value = details.value;
    if (details.inputClasses) label.classList.add(...details.inputClasses);

    wrapper.append(label);
    wrapper.append(input);
    return wrapper;
  }

  displayMsg(msgEl: HTMLElement, msg: string) {
    msgEl.textContent = msg;
    msgEl.classList.remove("hide");
  }
}
export default new DomRender();
