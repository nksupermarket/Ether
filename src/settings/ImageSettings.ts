import { Optional } from "../../types/types";
import { ImageState, refreshImage, saveImageState } from "../Image";
import InputGroup from "./InputGroup";
import { SettingsSectionWithChildren } from "./SettingsSection";
import { Component } from "./settingsTypes";

export default function initImageSettings(imageState: ImageState) {
  const imageSection = new SettingsSectionWithChildren<ImageState>({
    title: "image",
    state: imageState,
    sectionEl: document.getElementById("image-settings") as HTMLElement,
    children: [
      (function ImageFileInput(): Component {
        return {
          render: function () {
            const sectionEl = document.getElementById(
              "image-settings"
            ) as HTMLElement;
            const input = sectionEl.querySelector(
              "input[type='file']"
            ) as HTMLElement;
            input.addEventListener("change", (e) => {
              const target = e.target as HTMLInputElement;
              if (!target.files) return;

              const file = target.files[0];

              function checkValidImage() {
                const fileExtension = file.name.match(/\.[0-9a-z]+$/i);
                const imageFileExtensions = [
                  ".jpg",
                  ".png",
                  ".webp",
                  ".gif",
                  ".svg",
                ];
                return (
                  fileExtension &&
                  imageFileExtensions.includes(fileExtension[0])
                );
              }

              try {
                if (!checkValidImage()) throw new Error("Not a valid image");
              } catch (e) {
                const error = e as Error;
                imageSection.displayFailedMsg(error.message);
              }
              const reader = new FileReader();

              reader.addEventListener("load", () => {
                const label = sectionEl.querySelector(
                  "label .button-text"
                ) as HTMLElement;
                label.textContent = file.name;

                imageSection.state.image = `url(${reader.result})`;
              });

              reader.readAsDataURL(file);
            });
          },
          rerender: function () {
            const sectionEl = document.getElementById(
              "image-settings"
            ) as HTMLElement;
            const label = sectionEl.querySelector(
              "label .button-text"
            ) as HTMLElement;
            label.textContent = "Choose your image";
          },
        };
      })(),
      new InputGroup({
        wrapperEl: document.querySelector(
          "#image-settings .input-group"
        ) as HTMLElement,
        updateState: (e: Event) => {
          const target = e.target as HTMLInputElement;
          const key = target.name as keyof ImageState;
          if (key === "image") return;
          imageSection.state[key] = target.value;
        },
        getState: (): Omit<ImageState, "image"> => {
          const state: Optional<ImageState, "image"> = {
            ...imageSection.state,
          };
          delete state.image;
          return state;
        },
        id: "a",
      }),
    ],
    onSave: (data: any) => {
      saveImageState(data);
      refreshImage();
    },
  });
  return imageSection;
}
