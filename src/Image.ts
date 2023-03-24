const imageEl = document.querySelector(".image") as HTMLElement;
export function getImage(): string {
  const lsItem = localStorage.getItem("image");
  if (lsItem) return lsItem;

  const imageFilePath = window.getComputedStyle(imageEl).backgroundImage;
  localStorage.setItem("image", imageFilePath);
  return imageFilePath;
}

export function updateImage(url: string) {
  imageEl.style.setProperty("background-image", url);
}
