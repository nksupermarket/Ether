import { z } from "zod";

export interface ImageState {
  image: string | null;
  "position x": string;
  "position y": string;
}

const percentage = z.custom<`${number}%`>((val) => {
  return /^\d+%$/.test(val as string);
}, "Not a valid percentage");
const ImageStateSchema = z.object({
  image: z.string(),
  "position x": percentage,
  "position y": percentage,
});

const imageEl = document.querySelector(".image") as HTMLElement;
export function getImage(): ImageState {
  const lsItem = localStorage.getItem("image");
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
  imageEl.style.setProperty("background-position-x", imageState["position x"]);
  imageEl.style.setProperty("background-position-y", imageState["position y"]);
}

export function refreshImage() {
  updateImage(getImage());
}

export function validateImageState(data: any): data is ImageState {
  ImageStateSchema.parse(data);
  return true;
}

export function saveImageState(data: any) {
  validateImageState(data);
  localStorage.setItem("image", JSON.stringify(data));
}
