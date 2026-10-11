// BENEFITS AND CHALLENGES — script for this page only.
// Navigation uses plain HTML links. JS handles the explanations: select a benefit or a challenge and its
// explanation opens right under its row. Only one explanation is open at a time; select it again to close it.
// (Without JavaScript every explanation simply stays visible under its row.)

(function () {
  "use strict";

  const buttons = Array.from(document.querySelectorAll(".cell__btn"));
  const panelFor = (btn) => document.getElementById(btn.getAttribute("aria-controls"));

  // Open or close one explanation
  function setOpen(btn, open) {
    btn.setAttribute("aria-expanded", String(open));
    panelFor(btn).hidden = !open;
  }

  // Start with everything closed
  buttons.forEach((btn) => setOpen(btn, false));

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const willOpen = btn.getAttribute("aria-expanded") !== "true";
      buttons.forEach((other) => setOpen(other, false));
      if (!willOpen) return;
      setOpen(btn, true);
      // If the explanation opened below the visible screen (phones), bring it into view
      const rect = panelFor(btn).getBoundingClientRect();
      if (rect.bottom > window.innerHeight || rect.top < 0) {
        panelFor(btn).scrollIntoView({ block: "nearest" });
      }
    });
  });
})();
