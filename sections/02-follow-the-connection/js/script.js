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


// =====================================================================================
// NARRATION CONFIGS — the 11 buttons beside the titles on this page. EDIT THE VALUES HERE.
// All 11 open the SAME shared panel (shared/js/narration.js); only these values change.
//   image      -> character image path (relative to project root), e.g. "assets/images/characters/name.png"
//   audio      -> audio file path (relative to project root), e.g. "assets/audio/follow-the-connection/clip.mp3"
//   transcript -> text shown in the panel (blank line = new paragraph)
//   title      -> title shown at the top of the panel
// Empty values are fine: the panel opens with placeholders ("Audio not added yet", etc.).
// Need more clips for one narration? Add more { audio, transcript } objects to its parts array
// and the panel shows "Part 1 of 2", "Part 2 of 2", and so on.
// =====================================================================================
const FOLLOW_THE_CONNECTION_NARRATIONS = [

  // ---------- 1. WHAT IS IT ----------
  {
    mountId: "whatNarrationMount",
    label: "Listen to What Is It",
    title: "What Is It?",
    image: "",
    showPartIndicator: true,
    parts: [
      { audio: "", transcript: "" }
    ]
  },

  // ---------- 2. RAW MATERIALS (stage 01) ----------
  {
    mountId: "rawNarrationMount",
    label: "Listen to Raw Materials",
    title: "Raw Materials",
    image: "",
    showPartIndicator: true,
    parts: [
      { audio: "", transcript: "" }
    ]
  },

  // ---------- 3. PRODUCTION (stage 02) ----------
  {
    mountId: "productionNarrationMount",
    label: "Listen to Production",
    title: "Production",
    image: "",
    showPartIndicator: true,
    parts: [
      { audio: "", transcript: "" }
    ]
  },

  // ---------- 4. MANUFACTURING (stage 03) ----------
  {
    mountId: "manufacturingNarrationMount",
    label: "Listen to Manufacturing",
    title: "Manufacturing",
    image: "",
    showPartIndicator: true,
    parts: [
      { audio: "", transcript: "" }
    ]
  },

  // ---------- 5. TRANSPORTATION (stage 04) ----------
  {
    mountId: "transportationNarrationMount",
    label: "Listen to Transportation",
    title: "Transportation",
    image: "",
    showPartIndicator: true,
    parts: [
      { audio: "", transcript: "" }
    ]
  },

  // ---------- 6. MARKET (stage 05) ----------
  {
    mountId: "marketNarrationMount",
    label: "Listen to Market",
    title: "Market",
    image: "",
    showPartIndicator: true,
    parts: [
      { audio: "", transcript: "" }
    ]
  },

  // ---------- 7. FILIPINO CONSUMER (stage 06) ----------
  {
    mountId: "consumerNarrationMount",
    label: "Listen to Filipino Consumer",
    title: "Filipino Consumer",
    image: "",
    showPartIndicator: true,
    parts: [
      { audio: "", transcript: "" }
    ]
  },

  // ---------- 8. CONNECTION NOTES: COUNTRIES INVOLVED ----------
  {
    mountId: "countriesNarrationMount",
    label: "Listen to Countries Involved",
    title: "Countries Involved",
    image: "",
    showPartIndicator: true,
    parts: [
      { audio: "", transcript: "" }
    ]
  },

  // ---------- 9. CONNECTION NOTES: WHO BENEFITS ----------
  {
    mountId: "benefitsNarrationMount",
    label: "Listen to Who Benefits",
    title: "Who Benefits?",
    image: "",
    showPartIndicator: true,
    parts: [
      { audio: "", transcript: "" }
    ]
  },

  // ---------- 10. CONNECTION NOTES: PROBLEMS ----------
  {
    mountId: "problemsNarrationMount",
    label: "Listen to Problems",
    title: "Problems",
    image: "",
    showPartIndicator: true,
    parts: [
      { audio: "", transcript: "" }
    ]
  },

  // ---------- 11. CONNECTION NOTES: HOW ARE THEY CONNECTED? ----------
  {
    mountId: "connectedNarrationMount",
    label: "Listen to How Are They Connected?",
    title: "How Are They Connected?",
    image: "",
    showPartIndicator: true,
    parts: [
      { audio: "", transcript: "" }
    ]
  }
];

// Builds the 11 buttons. Nothing to edit below this line.
FOLLOW_THE_CONNECTION_NARRATIONS.forEach(function (n) {
  AtlasNarration.create(Object.assign({}, n, { mount: document.getElementById(n.mountId) }));
});
