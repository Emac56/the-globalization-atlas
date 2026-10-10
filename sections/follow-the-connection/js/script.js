// FOLLOW THE CONNECTION — script for this page only.
// Basic navigation is a plain HTML link. JS handles the stage selection.

// Stage text and images live in index.html (one <article class="stage"> per stage).
// This script shows the selected stage and swaps in a placeholder when a photo file is missing.

const route = document.getElementById("route");
const stops = document.querySelectorAll(".stop");
const info = document.getElementById("info");
const infoBody = document.getElementById("infoBody");
const infoStage = document.getElementById("infoStage");
const stages = document.querySelectorAll(".stage");
const prevBtn = document.getElementById("prevBtn");
const nextStageBtn = document.getElementById("nextStageBtn");

const LAST = stops.length - 1;
let current = 0;

// Show one stage: highlight it, move the route marker, show its panel
function selectStage(i) {
  current = Math.max(0, Math.min(LAST, i));

  route.style.setProperty("--i", current);
  stops.forEach((stop, idx) => {
    stop.classList.toggle("is-active", idx === current);
    stop.classList.toggle("is-done", idx < current);
    stop.setAttribute("aria-pressed", String(idx === current));
  });

  infoStage.textContent = "Stage 0" + (current + 1) + " / 06";
  stages.forEach((st, idx) => { st.hidden = idx !== current; });

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
});


// Missing photos: if an <img> cannot load, mark its frame so the CSS shows the
// "Add your photo here" placeholder (the <img> stays in the HTML, just not visible).
function checkImage(img) {
  const frame = img.closest(".shot__frame");
  const mark = () => frame.classList.add("is-missing");
  if (img.complete) {
    if (img.naturalWidth === 0) mark();
  } else {
    img.addEventListener("error", mark);
  }
  // photo added later while the page is open and reloaded: loads normally, nothing to do
  img.addEventListener("load", () => frame.classList.remove("is-missing"));
}
document.querySelectorAll(".shot__frame img").forEach(checkImage);

selectStage(0);



