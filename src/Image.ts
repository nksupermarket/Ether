export interface ImageState {
  image: string | null;
  "position x": string;
  "position y": string;
}
const imageEl = document.querySelector(".image") as HTMLElement;
export function getImage(): ImageState {
  const lsItem = localStorage.getItem("imageState");
  if (lsItem) return JSON.parse(lsItem);

  const imageStyle = window.getComputedStyle(imageEl);
  const imageState = {
    image: imageStyle.backgroundImage,
    ["position x"]: imageStyle.backgroundPositionX,
    ["position y"]: imageStyle.backgroundPositionY,
  };

  localStorage.setItem("image", JSON.stringify(imageState));
  return imageState;
}

export function updateImage(imageState: ImageState) {
  imageEl.style.setProperty("background-image", imageState.image);
  imageEl.style.setProperty("background-image", imageState.image);
  imageEl.style.setProperty("background-position-x", imageState["position x"]);
  imageEl.style.setProperty("background-position-y", imageState["position y"]);
}
