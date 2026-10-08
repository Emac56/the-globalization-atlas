// FOLLOW THE CONNECTION — script for this page only.
// Basic navigation is a plain HTML link. JS handles the stage selection.

/* ===== EDIT HERE LATER =====
   One text per stage, in the same order as the route (01 to 06).
   The stage titles come from the buttons in index.html. */
const STAGE_TEXTS = [
  "Placeholder: Identify the main materials needed to create the chosen product and where those materials come from.",
  "Placeholder: Explain how the raw materials are processed or prepared before becoming part of the final product.",
  "Placeholder: Explain where and how the product is manufactured or assembled.",
  "Placeholder: Explain how the product or its components move between countries and locations.",
  "Placeholder: Explain how the finished product reaches markets where consumers can purchase it.",
  "Placeholder: Explain how the product eventually reaches Filipino consumers and becomes part of everyday life."
];

const page = document.getElementById("secPage");
const route = document.getElementById("route");
const stops = document.querySelectorAll(".stop");
const info = document.getElementById("info");
const infoBody = document.getElementById("infoBody");
const infoStage = document.getElementById("infoStage");
const infoTitle = document.getElementById("infoTitle");
const infoText = document.getElementById("infoText");
const prevBtn = document.getElementById("prevBtn");
const nextStageBtn = document.getElementById("nextStageBtn");

const LAST = stops.length - 1;
let current = 0;

// Show one stage: highlight it, move the route marker, update the panel
function selectStage(i) {
  current = Math.max(0, Math.min(LAST, i));

  route.style.setProperty("--i", current);
  stops.forEach((stop, idx) => {
    stop.classList.toggle("is-active", idx === current);
    stop.classList.toggle("is-done", idx < current);
    stop.setAttribute("aria-pressed", String(idx === current));
  });

  infoStage.textContent = "Stage 0" + (current + 1) + " / 06";
  infoTitle.textContent = stops[current].querySelector(".stop__label").textContent;
  infoText.textContent = STAGE_TEXTS[current];

  // restart the small slide-in animation
  infoBody.classList.remove("swap");
  void infoBody.offsetWidth;
  infoBody.classList.add("swap");

  prevBtn.disabled = current === 0;
  nextStageBtn.disabled = current === LAST;
}

// On small screens the panel is below the route: bring it into view if needed
function showPanelIfHidden() {
  if (!window.matchMedia("(max-width: 980px)").matches) return;
  const r = info.getBoundingClientRect();
  if (r.top > window.innerHeight - 120 || r.bottom < 0) {
    info.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

stops.forEach((stop) => {
  stop.addEventListener("click", () => {
    selectStage(Number(stop.dataset.stage));
    showPanelIfHidden();
  });
});
prevBtn.addEventListener("click", () => selectStage(current - 1));
nextStageBtn.addEventListener("click", () => selectStage(current + 1));

// Keyboard: left / right arrows change stage, Esc goes back
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.key === "ArrowLeft") selectStage(current - 1);
  if (e.key === "ArrowRight") selectStage(current + 1);
  if (e.key === "Escape") fadeAndGo(document.getElementById("backBtn").href);
});

// Small fade-out before leaving the page
function fadeAndGo(url) {
  page.classList.add("is-leaving");
  setTimeout(() => { window.location.href = url; }, 180);
}

const backBtn = document.getElementById("backBtn");
backBtn.addEventListener("click", (e) => {
  if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
  e.preventDefault();
  fadeAndGo(backBtn.href);
});
window.addEventListener("pageshow", () => page.classList.remove("is-leaving"));

selectStage(0);
