// GLOBAL PROBLEM / GLOBAL RESPONSE — script for this page only.
// Navigation uses plain HTML links. JS handles the part selection and progress.

// ---------- PHOTOS: easy-to-update image paths ----------
// Every photo lives in assets/images/global-problem-response/ (IMAGE_FOLDER below).
// To swap a photo: save the new file in that folder and change the "file" name here
// (for example if your photo is a .png or .webp).
// "source" is only shown on the placeholder, which stays visible until the file loads
// (no broken image icon). It is never shown on the answer panels.
const IMAGE_FOLDER = "../../assets/images/global-problem-response/";
const IMAGE_FILES = {
  // Part 01 - The Problem
  rivers:      { file: "plastic-pollution-rivers.jpg",    alt: "A woman picks up plastic waste along the Pasig River riverbank",
                 source: "Source page: interaksyon.philstar.com (lead photo of the Pasig River riverbank)" },
  // Part 02 - Why Not Alone?
  cooperation: { file: "international-cooperation.jpg",   alt: "ASEAN-Japan Action Agenda on Plastic Pollution presented at a symposium",
                 source: "Source page: rkcmpd-eria.org (ASEAN-Japan symposium photo)" },
  // Part 03 - Who Is Involved?
  involved:    { file: "who-is-involved.webp",            alt: "Two garbage collectors loading waste into a sanitation truck in Las Piñas",
                 source: "Source page: dreamstime.com (Las Piñas garbage collectors, license needed)" },
  // Part 04 - Cooperation
  solutions:   { file: "recycling-waste-management.jpg",  alt: "Officials and workers at a recycling facility in Pasig City",
                 source: "Source page: ph.usembassy.gov (Pasig City recycling facility)" },
  // Part 05 - The Philippines
  coastal:     { file: "plastic-pollution-coastline.jpg", alt: "Plastic waste along a polluted shore in Manila Bay",
                 source: "Source page: archive.wwf.org.ph (polluted shore in Manila Bay)" },
  // Part 06 - Individuals
  community:   { file: "community-cleanup.avif",          alt: "Volunteers collecting waste during a coastal cleanup",
                 source: "Source page: metro.style (Watsons x CORA coastal cleanup)" }
};

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


// Photos: show the real photo only when a filename is set and the file loads.
// Otherwise the labeled placeholder stays visible (no broken image icon).
document.querySelectorAll(".shot").forEach((fig) => {
  const item = IMAGE_FILES[fig.dataset.shot];
  const frame = fig.querySelector(".shot__frame");
  const img = fig.querySelector("img");
  if (!item || !item.file) return;

  // the placeholder shows the filename to save as (same as the other sections)
  const srcEl = fig.querySelector(".shot__search");
  if (srcEl && item.source) srcEl.textContent = item.source;
  const fileEl = fig.querySelector(".shot__file");
  if (fileEl) fileEl.textContent = "Save as: " + item.file;

  img.addEventListener("load", () => {
    img.hidden = false;
    frame.classList.remove("is-empty");
  });
  img.addEventListener("error", () => {
    img.hidden = true;
    frame.classList.add("is-empty");
  });
  img.alt = item.alt || "";
  img.src = IMAGE_FOLDER + item.file;
});

selectArea(0);


