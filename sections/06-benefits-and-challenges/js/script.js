// BENEFITS AND CHALLENGES — script for this page only.
// Navigation uses plain HTML links. JS handles the topic cards: select a benefit or a challenge and its
// four-part explanation shows in the detail panel under the cards. Only one is shown at a time;
// select the same card again to close it. (Without JavaScript all eight explanations simply stay visible.)

(function () {
  "use strict";

  const buttons = Array.from(document.querySelectorAll(".topic__btn"));
  const box = document.getElementById("detailBox");
  const placeholder = document.getElementById("placeholder");
  const panelFor = (btn) => document.getElementById(btn.getAttribute("aria-controls"));

  // Show one topic (or none when btn is null)
  function select(btn) {
    buttons.forEach((b) => {
      const on = b === btn;
      b.setAttribute("aria-expanded", String(on));
      panelFor(b).hidden = !on;
    });
    placeholder.hidden = !!btn;
    box.classList.toggle("detailbox--on", !!btn);
  }

  select(null);   // start with the hint showing

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const already = btn.getAttribute("aria-expanded") === "true";
      select(already ? null : btn);
      if (already) return;
      // Bring the panel into view if it is off-screen (phones)
      const rect = panelFor(btn).getBoundingClientRect();
      if (rect.top > window.innerHeight * 0.6 || rect.top < 0) {
        panelFor(btn).scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    });
  });
})();
