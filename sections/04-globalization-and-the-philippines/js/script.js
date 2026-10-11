// GLOBALIZATION AND THE PHILIPPINES — script for this page only.
// Navigation uses plain HTML links. JS handles the area selection.

const areas = document.querySelectorAll(".area");
const panels = document.querySelectorAll(".panel");

let current = 0;

// Show one area: highlight its button and show only its panel
function selectArea(i) {
  current = (i + areas.length) % areas.length;
  areas.forEach((btn, idx) => {
    const on = idx === current;
    btn.classList.toggle("is-active", on);
    btn.setAttribute("aria-selected", String(on));
    btn.tabIndex = on ? 0 : -1;
  });
  panels.forEach((p, idx) => { p.hidden = idx !== current; });
}

// On small screens the panel is below the buttons: bring it into view if needed
function showPanelIfHidden() {
  if (!window.matchMedia("(max-width: 760px)").matches) return;
  const r = panels[current].getBoundingClientRect();
  if (r.top > window.innerHeight - 120 || r.bottom < 0) {
    panels[current].scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

areas.forEach((btn, idx) => {
  btn.addEventListener("click", () => {
    selectArea(idx);
    showPanelIfHidden();
  });
});

// Keyboard: 1–3 select an area, left / right arrows move between areas
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.key === "ArrowLeft") selectArea(current - 1);
  if (e.key === "ArrowRight") selectArea(current + 1);
  if (e.key >= "1" && e.key <= String(areas.length)) selectArea(Number(e.key) - 1);
});


selectArea(0);



