import SettingsSection from "../src/SettingsSection";
import DomRender from "../src/DomRender";

const TEST_KEY = "test-input";
const TEST_VALUE = "test value";
let section = document.createElement("section");
let inputWrapper = DomRender.field({
  name: TEST_KEY,
  wrapperClasses: ["input-wrapper"],
  labelText: "test",
  value: "",
  type: "text",
});
section.append(inputWrapper);
document.body.append(section);

afterEach(() => {
  section.remove();
  section = document.createElement("section");
  inputWrapper = DomRender.field({
    name: TEST_KEY,
    wrapperClasses: ["input-wrapper"],
    labelText: "test",
    value: "",
    type: "text",
  });
  section.append(inputWrapper);
  document.body.append(section);
});

test("rendering an instance of SettingsSection updates inputs + labels to have the appropriate names, ids, etc", () => {
  // arrange
  const component = new SettingsSection(
    "test-title",
    {
      "test-input": TEST_VALUE,
    },

    section
  );

  component.render();
  const label = section.querySelector("label");
  expect(label).not.toBe(null);
  expect(label?.getAttribute("for")).toBe(TEST_KEY);
  const input = document.getElementById(TEST_KEY) as HTMLInputElement;
  expect(input).not.toBe(null);
  expect(input.value).toBe(TEST_VALUE);
});

test("updateState updates the state when an input element changes", () => {
  // arrange
  const component = new SettingsSection(
    "test-title",
    {
      "test-input": TEST_VALUE,
    },
    section
  );
  component.render();
  const event = new Event("input");
  const input = section.querySelector(`#${TEST_KEY}`) as HTMLInputElement;

  input.dispatchEvent(event);
  expect(component.state["test-input"]).toBe(TEST_VALUE);

  input.value = "new value";
  input.dispatchEvent(event);
  expect(component.state["test-input"]).toBe("new value");
});
