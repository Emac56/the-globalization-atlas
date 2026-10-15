// GLOBAL PROBLEM / GLOBAL RESPONSE — script for this page only.
// Navigation uses plain HTML links. JS handles the part selection and progress.
// The seven narration buttons (six parts + the final question) are configured in NARRATIONS at the bottom of this file.

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
  const next = Math.max(0, Math.min(LAST, i));
  // A part's narration belongs to that part: close it when another part is selected.
  // (The final question's narration is not tied to a part, so it stays open.)
  const closed = next !== current && closePartNarration();
  current = next;
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

  // closing the narration panel hands focus to its (now hidden) button, so put it back where the visitor was
  if (closed) {
    const back = closed.focusBack && closed.focusBack.offsetParent !== null ? closed.focusBack : areas[current];
    back.focus({ preventScroll: true });
  }
}

// Closes the shared narration panel if it was opened from one of the six part panels.
// Returns { focusBack } when it closed something, otherwise false.
function closePartNarration() {
  const open = document.querySelector(".panel .narr-trigger[aria-expanded='true']");
  if (!open || !window.AtlasNarration) return false;
  const prev = document.activeElement;
  AtlasNarration.close();
  const ok = prev && prev !== document.body && !prev.closest(".narr-panel");
  return { focusBack: ok ? prev : null };
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


// =====================================================================================
// NARRATION CONFIGS — the seven buttons beside the titles on this page. EDIT THE VALUES HERE.
// All seven open the SAME shared panel (shared/js/narration.js); only these values change.
//   label             -> text on the button beside the title
//   title             -> NARRATION TITLE shown at the top of the panel
//   image             -> CHARACTER IMAGE PATH (relative to project root), e.g. "assets/images/characters/jaymark-vicente.png"
//   showPartIndicator -> PART INDICATOR: true shows "Part 1 of N" (N = number of items in parts below); false hides it for a single clip
//   parts[].audio     -> AUDIO FILE PATH (relative to project root), e.g. "assets/audio/global-problem-response/clip.mp3"
//   parts[].transcript-> TRANSCRIPT text shown in the panel (blank line = new paragraph)
// Empty values are fine: the panel opens with placeholders ("Audio not added yet", etc.) and never autoplays.
// Need more clips for one narration? Add more { audio, transcript } objects to its parts array
// and the panel shows "Part 1 of 2", "Part 2 of 2", and so on.
// Entries 1-6 are the six parts (a button shows when its part is selected). Entry 7 is the final question.
// =====================================================================================
const NARRATIONS = [

  // ---------- 1. PART 01: WHAT IS THE PROBLEM? ----------
  {
    mountId: "problemNarrationMount",
    label: "Listen to the Problem",
    title: "What Is the Problem?",
    image: "assets/images/characters/jaymark-vicente.png",
    showPartIndicator: true,
    parts: [
      { audio: "assets/audio/07-global-problem-global-response/global-problem-response-the-problem-jaymark-vicente.mp3", transcript: "Introduksyon:\nSa section na ito, susuriin natin ang problema ng plastik sa mga ilog at karagatan ng Pilipinas, at kung paano makatutulong ang sama-samang pagkilos upang mabawasan ito.\n\nAno ang problema?:\nIsipin ang plastik na itinatapon sa kalsada at kanal. Kapag inanod ng ulan papunta sa ilog, maaari itong makarating sa dagat at maging panganib sa mga hayop na naninirahan dito." }
    ]
  },

  // ---------- 2. PART 02: WHY CAN'T ONE COUNTRY SOLVE IT ALONE? ----------
  {
    mountId: "cooperationNarrationMount",
    label: "Listen to Global Cooperation",
    title: "Why Can't One Country Solve It Alone?",
    image: "assets/images/characters/jaymark-vicente.png",
    showPartIndicator: true,
    parts: [
      { audio: "assets/audio/07-global-problem-global-response/global-problem-response-why-not-alone-jaymark-vicente.mp3", transcript: "Kahit linisin ng isang bansa ang sariling baybayin, maaari pa ring makarating doon ang basurang nagmula sa ibang lugar. Kaya kailangang magtulungan ang mga bansang magkakabahagi ng dagat at daluyan ng tubig." }
    ]
  },

  // ---------- 3. PART 03: WHO IS INVOLVED? ----------
  {
    mountId: "involvedNarrationMount",
    label: "Listen to Who Is Involved",
    title: "Who Is Involved?",
    image: "assets/images/characters/jaymark-vicente.png",
    showPartIndicator: true,
    parts: [
      { audio: "assets/audio/07-global-problem-global-response/global-problem-response-who-is-involved-jaymark-vicente.mp3", transcript: "Sino ngaba ang mga involve?\nHindi lang ito trabaho ng mga namumuno. May papel ang mga kumpanyang gumagamit ng plastik, mga nangongolekta ng basura, mga komunidad, at mga mamimili sa pagpigil na dumami ang basurang napupunta sa dagat." }
    ]
  },

  // ---------- 4. PART 04: WHAT COOPERATION IS POSSIBLE? ----------
  {
    mountId: "possibleCooperationNarrationMount",
    label: "Listen to Possible Cooperation",
    title: "What Cooperation Is Possible?",
    image: "assets/images/characters/jaymark-vicente.png",
    showPartIndicator: true,
    parts: [
      { audio: "assets/audio/07-global-problem-global-response/global-problem-response-cooperation-jaymark-vicente.mp3", transcript: "Maaaring magbahagi ang mga bansa ng kaalaman, teknolohiya, at mas maayos na paraan ng pagkolekta at pagre-recycle ng basura. Sa ganitong paraan, hindi kailangang magsimula sa wala ang bawat bansa." }
    ]
  },

  // ---------- 5. PART 05: HOW IS THE PHILIPPINES AFFECTED? ----------
  {
    mountId: "philippinesNarrationMount",
    label: "Listen to the Philippines' Impact",
    title: "How Is the Philippines Affected?",
    image: "assets/images/characters/jaymark-vicente.png",
    showPartIndicator: true,
    parts: [
      { audio: "assets/audio/07-global-problem-global-response/global-problem-response-the-philippines-jaymark-vicente.mp3", transcript: "Para sa Pilipinas, ang maruming baybayin ay hindi lang problema sa itsura. Maaari nitong maapektuhan ang mga lamang-dagat, kabuhayan ng mga mangingisda, at mga lugar na dinarayo ng mga turista." }
    ]
  },

  // ---------- 6. PART 06: WHAT CAN INDIVIDUALS DO? ----------
  {
    mountId: "individualsNarrationMount",
    label: "Listen to Individual Actions",
    title: "What Can Individuals Do?",
    image: "assets/images/characters/jaymark-vicente.png",
    showPartIndicator: true,
    parts: [
      { audio: "assets/audio/07-global-problem-global-response/global-problem-response-individuals-jaymark-vicente.mp3", transcript: "Nagsisimula ang pagbabago sa mga desisyong ginagawa natin araw-araw. Magdala ng sariling tumbler at bag, iwasan ang sobrang balot na plastik, at itapon nang tama ang basura upang hindi ito maanod sa mga kanal at ilog.\n\nHindi kayang ayusin ng isang tao o bansa ang problemang ito nang mag-isa. Pero kapag binawasan natin ang basurang nalilikha at nagtulungan ang mga komunidad at bansa, mas may pagkakataong maprotektahan ang ating mga ilog at karagatan." }
    ]
  },

  // ---------- 7. FINAL QUESTION: WHY DOES THIS PROBLEM REQUIRE GLOBAL COOPERATION? ----------
  {
    mountId: "whyGlobalNarrationMount",
    label: "Listen to Why Global Cooperation Matters",
    title: "Why Does This Problem Require Global Cooperation?",
    image: "assets/images/characters/jaymark-vicente.png",
    showPartIndicator: true,
    parts: [
      { audio: "assets/audio/07-global-problem-global-response/global-problem-response-why-cooperation-matters-jaymark-vicente.mp3", transcript: "Hindi natatapos sa hangganan ng isang bansa ang problema sa plastik. Ang basurang napupunta sa mga ilog ay maaaring makarating sa dagat, kaya hindi sapat na isang lugar lang ang kumilos. Kailangan ang pagtutulungan ng iba't ibang bansa upang mabawasan ang basura at maprotektahan ang ating mga karagatan." }
    ]
  }
];

// Builds the seven buttons. Nothing to edit below this line.
NARRATIONS.forEach(function (n) {
  AtlasNarration.create(Object.assign({}, n, { mount: document.getElementById(n.mountId) }));
});
