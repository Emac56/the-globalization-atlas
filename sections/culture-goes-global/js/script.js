// CULTURE GOES GLOBAL — script for this page only.
// Bottom navigation uses plain HTML links. JS handles the culture connection map.

/* ===== EDIT HERE LATER =====
   One entry per stop, same order as the map (01 to 05).
   The stop titles come from the buttons in index.html.
   "form" = how the culture looks at that stop. */
const STOPS = [
  { form: "Original",  text: "Placeholder: Explain the setting in South Korea where K-pop first developed." },
  { form: "Packaged",  text: "Placeholder: Explain what K-pop is and how it is produced and presented." },
  { form: "Shared",    text: "Placeholder: Explain how social media helps K-pop cross borders and reach new audiences." },
  { form: "Received",  text: "Placeholder: Explain how K-pop reaches Filipino fans and why it becomes popular." },
  { form: "Remixed",   text: "Placeholder: Explain how local cover groups copy, mix, and add Filipino style to K-pop." }
];

const page = document.getElementById("secPage");
const route = document.getElementById("route");
const stops = document.querySelectorAll(".stop");
const info = document.getElementById("info");
const infoBody = document.getElementById("infoBody");
const infoStage = document.getElementById("infoStage");
const infoTitle = document.getElementById("infoTitle");
const infoText = document.getElementById("infoText");
const changeForm = document.getElementById("changeForm");
const segs = document.querySelectorAll(".change__seg");
const prevBtn = document.getElementById("prevBtn");
const nextStageBtn = document.getElementById("nextStageBtn");

const LAST = stops.length - 1;
let current = 0;

// Show one stop: highlight it, move the route marker, update the panel
function selectStage(i) {
  current = Math.max(0, Math.min(LAST, i));

  route.style.setProperty("--i", current);
  stops.forEach((stop, idx) => {
    stop.classList.toggle("is-active", idx === current);
    stop.classList.toggle("is-done", idx < current);
    stop.setAttribute("aria-pressed", String(idx === current));
  });

  infoStage.textContent = "Stop 0" + (current + 1) + " / 0" + stops.length;
  infoTitle.textContent = stops[current].querySelector(".stop__label").textContent;
  infoText.textContent = STOPS[current].text;
  changeForm.textContent = STOPS[current].form;

  // the further the culture travels, the more of the meter fills
  segs.forEach((seg, idx) => seg.classList.toggle("is-on", idx <= current));

  // restart the small slide-in animation
  infoBody.classList.remove("swap");
  void infoBody.offsetWidth;
  infoBody.classList.add("swap");

  prevBtn.disabled = current === 0;
  nextStageBtn.disabled = current === LAST;
}

// On small screens the panel is below the map: bring it into view if needed
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

// Keyboard: 1–5 select a stop, left / right arrows move along the route, Esc goes to the Atlas Menu
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.key === "Escape") { fadeAndGo(document.getElementById("menuBtn").href); return; }
  if (e.key === "ArrowLeft") selectStage(current - 1);
  if (e.key === "ArrowRight") selectStage(current + 1);
  if (e.key >= "1" && e.key <= String(stops.length)) selectStage(Number(e.key) - 1);
});

// Small fade-out before leaving the page
function fadeAndGo(url) {
  page.classList.add("is-leaving");
  setTimeout(() => { window.location.href = url; }, 180);
}

document.querySelectorAll(".nav-btn").forEach((link) => {
  link.addEventListener("click", (e) => {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    fadeAndGo(link.href);
  });
});
window.addEventListener("pageshow", () => page.classList.remove("is-leaving"));

selectStage(0);