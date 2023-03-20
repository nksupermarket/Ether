let singleton: undefined | DomRender;

type TextNodeDetails = {
  text?: string;
  classes?: string[];
};

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
    span.textContent = details.text || null;
    if (details.classes) span.classList.add(...details.classes);
    return span;
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
}
export default new DomRender();
