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
    image: "assets/images/characters/kayzer-leopando.png",                                  // CHARACTER IMAGE PATH
    showPartIndicator: true,                    // PART INDICATOR
    parts: [
      { audio: "assets/audio/04-globalization-and-the-philippines/globalization-and-the-philippines-area-1-kayzer-leopando.mp3",                            // AUDIO FILE PATH
        transcript: "Introduksyon:\nSa bahaging ito, tatalakayin natin ang tatlong paraan kung paano nakakaapekto ang globalisasyon sa buhay ng mga Pilipino, kasama ang mga benepisyo at hamon na dulot nito.\n\nAno ang nangyayari?:\nAng mga magsasaka ay maaaring makipagkasundo sa mga buyer para maibenta ang kanilang mga ani at maabot ang mas maraming mamimili.\n\nPosibleng Benepisyo:\nMakakatulong ito para mas lumaki ang kanilang kita dahil mas marami silang mapagbebentahan.\n\nPosibleng Hamon:\nPero maaaring mahirapan ang maliliit na magsasaka dahil sa mahal na transportasyon at kakulangan ng access sa mga market."}
    ]
  },

  // ---------- 2. OFW LABOR MIGRATION ----------
  {
    mountId: "ofwNarrationMount",
    label: "Listen to OFW Labor Migration",
    title: "OFW Labor Migration",               // NARRATION TITLE
    image: "assets/images/characters/rey-dela-cruz.png",                                  // CHARACTER IMAGE PATH
    showPartIndicator: true,                    // PART INDICATOR
    parts: [
      { audio: "assets/audio/04-globalization-and-the-philippines/globalization-and-the-philippines-area-2-rey-dela-cruz.mp3",                             // AUDIO FILE PATH
        transcript: "Ano ang nangyayari?:\nMaraming Pilipino ang nagtatrabaho sa ibang bansa at nagpapadala ng pera sa kanilang pamilya sa Pilipinas.\n\nPosibleng Benepisyo:\nAng perang ipinapadala nila ay nakakatulong sa mga gastusin ng pamilya, tulad ng pagkain, bayarin, at pag-aaral.\n\nPosibleng Hamon:\nPero dahil malayo sila sa kanilang pamilya, maaari silang makaramdam ng lungkot at mahirapang makasama ang kanilang mga mahal sa buhay."}                        // TRANSCRIPT
    ]
  },

  // ---------- 3. TECHNOLOGY AND DIGITAL ECONOMY ----------
  {
    mountId: "digitalNarrationMount",
    label: "Listen to Technology and Digital Economy",
    title: "Technology and Digital Economy",    // NARRATION TITLE
    image: "assets/images/characters/richard-mayundang.png",                                  // CHARACTER IMAGE PATH
    showPartIndicator: true,                    // PART INDICATOR
    parts: [
      { audio: "assets/audio/04-globalization-and-the-philippines/globalization-and-the-philippines-area-3-richard-mayundang.mp3",                              // AUDIO FILE PATH
        transcript: "Ano ang nangyayari?:\nDahil sa internet, mas madaling makapag-aral online, gumamit ng digital services, at makapagsimula ng negosyo.\n\nPosibleng Benepisyo:\nMas nagkakaroon ng oportunidad ang mga Pilipino na kumita sa online jobs at magbenta ng produkto sa internet.\n\nPosibleng Hamon:\nPero hindi lahat ay may mabilis at maayos na internet, kaya may mga taong hindi gaanong nakikinabang sa mga oportunidad na ito."}
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



