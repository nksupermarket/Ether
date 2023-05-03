import DomRender from "../DomRender";
import LocalStorage from "../LocalStorage";

const confirmModal = document.getElementById(
  "confirm-modal"
) as HTMLDialogElement;

confirmModal.addEventListener("click", closeConfirmModal);
confirmModal
  .querySelector(".content")
  ?.addEventListener("click", (e) => e.stopPropagation());

function openConfirmModal() {
  confirmModal.showModal();
}
function closeConfirmModal() {
  confirmModal.close();
}

const confirmButton = confirmModal.querySelector(
  "button[aria-label='confirm']"
) as HTMLElement;
const cancelButton = confirmModal.querySelector("button[aria-label='cancel']");
cancelButton?.addEventListener("click", closeConfirmModal);

export default function initLinkButtons() {
  return {
    render: () => {
      const sectionEl = document.getElementById("link-buttons-container");
      const resetDefaultsLink = sectionEl?.querySelector(
        "a[data-role='reset to defaults']"
      );
      resetDefaultsLink?.addEventListener("click", (e) => {
        e.preventDefault();
        openConfirmModal();
      });
      confirmButton.onclick = () => {
        localStorage.clear();
        location.reload();
      };

      const copyConfigLink = sectionEl?.querySelector(
        "a[data-role='copy config']"
      );
      copyConfigLink?.addEventListener("click", (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(LocalStorage.format());
        const msgEl = copyConfigLink?.parentElement?.querySelector(
          ".msg"
        ) as HTMLElement;
        DomRender.displayMsg(
          msgEl,
          "your config has been copied to your clipboard"
        );
        setTimeout(() => {
          msgEl.classList.add("hide");
        }, 3000);
      });
    },
  };
}
