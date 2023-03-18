import { LinkSection } from "../src/LinkSection";

test("cant create more than one instance of LinkSection using the same wrapper el", () => {
  const linkSectionOne = new LinkSection(
    document.querySelector(".collection-links-wrapper") as HTMLElement
  );
  const linkSectionTwo = new LinkSection(
    document.querySelector(".collection-links-wrapper") as HTMLElement
  );

  expect(linkSectionOne).toBe(linkSectionTwo);
});
