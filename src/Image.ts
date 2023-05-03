import { z } from "zod";
import THEMES from "./data/THEMES";

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

  const imageState = THEMES.everforest_dark.image;
  localStorage.setItem("image", JSON.stringify(imageState));
  return imageState;
}

export function setImage(imageState: ImageState) {
  imageEl.style.setProperty("background-image", imageState.image);
  imageEl.style.setProperty("background-position-x", imageState["position x"]);
  imageEl.style.setProperty("background-position-y", imageState["position y"]);
}

export function refreshImage() {
  setImage(getImage());
}

export function validateImageState(data: any): data is ImageState {
  ImageStateSchema.parse(data);
  return true;
}

export function saveImageState(data: any) {
  validateImageState(data);
  localStorage.setItem("image", JSON.stringify(data));
}
