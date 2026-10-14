// GLOBALIZATION AND THE PHILIPPINES — script for this page only.
// Navigation uses plain HTML links. JS handles the area selection.

const areas = document.querySelectorAll(".area");
const panels = document.querySelectorAll(".panel");

let current = 0;

// Show one area: highlight its button and show only its panel
function selectArea(i) {
  const next = (i + areas.length) % areas.length;
  // The shared narration panel belongs to the area it was opened from: close it when another area is selected.
  if (next !== current && document.querySelector(".narr-panel:not([hidden])")) {
    AtlasNarration.close();
    areas[next].focus({ preventScroll: true });
  }
  current = next;
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


// =====================================================================================
// NARRATION CONFIGS — the three buttons beside the area titles. EDIT THE VALUES HERE.
// All three open the SAME shared panel (shared/js/narration.js); only these values change.
//   label             -> text on the button beside the title
//   title             -> NARRATION TITLE shown at the top of the panel
//   image             -> CHARACTER IMAGE PATH (relative to project root), e.g. "assets/images/characters/jaymark-vicente.png"
//   showPartIndicator -> PART INDICATOR: true shows "Part 1 of N" (N = number of items in parts below); false hides it for a single clip
//   parts[].audio     -> AUDIO FILE PATH (relative to project root), e.g. "assets/audio/globalization-and-the-philippines/clip.mp3"
//   parts[].transcript-> TRANSCRIPT text shown in the panel (blank line = new paragraph)
// Empty values are fine: the panel opens with placeholders ("Audio not added yet", etc.) and never autoplays.
// Need more clips for one narration? Add more { audio, transcript } objects to its parts array
// and the panel shows "Part 1 of 2", "Part 2 of 2", and so on.
// =====================================================================================
const PHILIPPINES_NARRATIONS = [

  // ---------- 1. INTERNATIONAL TRADE AND FARMERS ----------
  {
    mountId: "tradeNarrationMount",
    label: "Listen to International Trade and Farmers",
    title: "International Trade and Farmers",   // NARRATION TITLE
    image: "",                                  // CHARACTER IMAGE PATH
    showPartIndicator: true,                    // PART INDICATOR
    parts: [
      { audio: "",                              // AUDIO FILE PATH
        transcript: "" }                        // TRANSCRIPT
    ]
  },

  // ---------- 2. OFW LABOR MIGRATION ----------
  {
    mountId: "ofwNarrationMount",
    label: "Listen to OFW Labor Migration",
    title: "OFW Labor Migration",               // NARRATION TITLE
    image: "",                                  // CHARACTER IMAGE PATH
    showPartIndicator: true,                    // PART INDICATOR
    parts: [
      { audio: "",                              // AUDIO FILE PATH
        transcript: "" }                        // TRANSCRIPT
    ]
  },

  // ---------- 3. TECHNOLOGY AND DIGITAL ECONOMY ----------
  {
    mountId: "digitalNarrationMount",
    label: "Listen to Technology and Digital Economy",
    title: "Technology and Digital Economy",    // NARRATION TITLE
    image: "",                                  // CHARACTER IMAGE PATH
    showPartIndicator: true,                    // PART INDICATOR
    parts: [
      { audio: "",                              // AUDIO FILE PATH
        transcript: "" }                        // TRANSCRIPT
    ]
  }
];

// Builds the three buttons. Nothing to edit below this line.
PHILIPPINES_NARRATIONS.forEach(function (n) {
  const mount = document.getElementById(n.mountId);
  if (!mount) return;
  // A click on a narration button stays on the button: it must never reach any area / card click handler.
  mount.addEventListener("click", (e) => e.stopPropagation());
  AtlasNarration.create(Object.assign({}, n, { mount }));
});

selectArea(0);



