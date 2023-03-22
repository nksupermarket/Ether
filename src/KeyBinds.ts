type KeyBind = {
  [key: string]: string;
};
export default function init(keybinds: KeyBind) {
  const keys = Object.keys(keybinds);

  window.addEventListener("keydown", (e) => {
    if (!keys.includes(e.key)) return;

    // window.location.url = keybinds[e.key];
  });
}
