const CLEAR_SELECTION_DELAY = 2000;
const COPY = "copy";
const COPIED = "copied!";

const isLangClass = (clazz) => clazz.substring(0, 9) === "language-";

const tryAddCopyButtons = () => {
  if (!ClipboardJS) return;

  const codeElements = document.getElementsByTagName("code");

  if (!codeElements) return;

  for (const elem of codeElements) {
    let hasLangClass = false;

    for (const attrClass of elem.classList) {
      if (isLangClass(attrClass)) {
        hasLangClass = true;
        break;
      }
    }

    if (!hasLangClass) continue;

    const button = document.createElement("button");
    button.appendChild(document.createTextNode(COPY));
    button.classList.add(COPY);

    elem.insertAdjacentElement("afterend", button);
  }

  const clipboard = new ClipboardJS(`.${COPY}`, {
    target: (trigger) => trigger.previousElementSibling,
  });

  clipboard.on("success", (event) => {
    event.trigger.textContent = COPIED;

    setTimeout(() => {
      event.clearSelection();
      event.trigger.textContent = COPY;
    }, CLEAR_SELECTION_DELAY);
  });
};

tryAddCopyButtons();
