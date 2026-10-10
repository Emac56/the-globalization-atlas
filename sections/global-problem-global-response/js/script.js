// GLOBAL PROBLEM / GLOBAL RESPONSE — script for this page only.
// Navigation uses plain HTML links. JS handles the part selection and progress.

const areas = document.querySelectorAll(".area");
const panels = document.querySelectorAll(".panel");
const prevBtn = document.getElementById("prevBtn");
const nextStageBtn = document.getElementById("nextStageBtn");
const progressText = document.getElementById("progressText");
const segs = document.querySelectorAll(".progress__seg");
const finalCard = document.getElementById("final");
const finalState = document.getElementById("finalState");

const TOTAL = areas.length;
const LAST = TOTAL - 1;
const seen = new Set();   // parts the visitor has opened
let current = 0;

// Show one part: highlight its tab, show only its panel, update progress
function selectArea(i) {
  current = Math.max(0, Math.min(LAST, i));
  seen.add(current);

  areas.forEach((btn, idx) => {
    const on = idx === current;
    btn.classList.toggle("is-active", on);
    btn.classList.toggle("is-seen", seen.has(idx));
    btn.setAttribute("aria-selected", String(on));
    btn.tabIndex = on ? 0 : -1;
  });
  panels.forEach((p, idx) => { p.hidden = idx !== current; });

  prevBtn.disabled = current === 0;
  nextStageBtn.disabled = current === LAST;

  updateProgress();
}

// "Explored X / 6" and the final question state
function updateProgress() {
  progressText.textContent = "Explored " + seen.size + " / " + TOTAL;
  segs.forEach((seg, idx) => seg.classList.toggle("is-on", idx < seen.size));

  const ready = seen.size === TOTAL;
  const wasReady = finalCard.classList.contains("is-ready");
  finalCard.classList.toggle("is-ready", ready);
  finalState.textContent = ready ? "Ready to answer" : "Explore all six parts first";

  // restart the one-time blink only when it becomes ready
  if (ready && !wasReady) {
    finalCard.style.animation = "none";
    void finalCard.offsetWidth;
    finalCard.style.animation = "";
  }
}

// On small screens the panel can be below the tabs: bring it into view if needed
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
prevBtn.addEventListener("click", () => selectArea(current - 1));
nextStageBtn.addEventListener("click", () => selectArea(current + 1));

// Keyboard: 1–6 select a part, left / right arrows move between parts
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.key === "ArrowLeft") { selectArea(current - 1); return; }
  if (e.key === "ArrowRight") { selectArea(current + 1); return; }
  if (/^[1-9]$/.test(e.key)) {
    const n = Number(e.key);
    if (n <= TOTAL) selectArea(n - 1);
  }
});


selectArea(0);


