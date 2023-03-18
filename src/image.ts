const container = document.querySelector(".container") as Element;
const img = document.querySelector(".image") as HTMLImageElement;
const imgWrapper = document.querySelector(".image-wrapper") as HTMLElement;

async function waitForImage(img: HTMLImageElement): Promise<void> {
  new Promise((resolve) => {
    img.onload = () => {
      resolve(undefined);
    };
  });
}
async function positionImage(
  containerSize: CSSStyleDeclaration
): Promise<void> {
  imgWrapper.style.transform = `translateY(calc(${containerSize.height}* -0.13))`;
}

function sizeImage(containerSize: CSSStyleDeclaration): void {
  imgWrapper.style.width = `calc(${containerSize.width} * 0.25)`;
}

export async function init() {
  await waitForImage(img);
  const containerSize = window.getComputedStyle(container);
  sizeImage(containerSize);
  positionImage(containerSize);
}
