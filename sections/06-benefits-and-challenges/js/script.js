// BENEFITS AND CHALLENGES — script for this page only.
// Navigation uses plain HTML links. JS handles the topic cards: select a benefit or a challenge and its
// four-part explanation shows in the detail panel under the cards. Only one is shown at a time;
// select the same card again to close it. (Without JavaScript all eight explanations simply stay visible.)
// The eight narration buttons sit beside the titles in the detail panel; their configs are NARRATIONS at the bottom of this file.

(function () {
  "use strict";

  const buttons = Array.from(document.querySelectorAll(".topic__btn"));
  const box = document.getElementById("detailBox");
  const placeholder = document.getElementById("placeholder");
  const panelFor = (btn) => document.getElementById(btn.getAttribute("aria-controls"));

  // Show one topic (or none when btn is null)
  function select(btn) {
    buttons.forEach((b) => {
      const on = b === btn;
      b.setAttribute("aria-expanded", String(on));
      panelFor(b).hidden = !on;
    });
    placeholder.hidden = !!btn;
    box.classList.toggle("detailbox--on", !!btn);
  }

  select(null);   // start with the hint showing

  // The shared narration panel belongs to the topic it was opened from: close it when another topic is picked or this one closes.
  function closeNarration() {
    const open = document.querySelector('.narr-trigger[aria-expanded="true"]');
    if (!open || !box.contains(open) || !window.AtlasNarration) return false;
    AtlasNarration.close();
    return true;
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (closeNarration()) btn.focus({ preventScroll: true });
      const already = btn.getAttribute("aria-expanded") === "true";
      select(already ? null : btn);
      if (already) return;
      // Bring the panel into view if it is off-screen (phones)
      const rect = panelFor(btn).getBoundingClientRect();
      if (rect.top > window.innerHeight * 0.6 || rect.top < 0) {
        panelFor(btn).scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    });
  });
})();


// =====================================================================================
// NARRATION CONFIGS — the eight buttons beside the titles in the detail panel. EDIT THE VALUES HERE.
// All eight open the SAME shared panel (shared/js/narration.js); only these values change.
//   label             -> text on the button beside the title
//   title             -> NARRATION TITLE shown at the top of the panel
//   image             -> CHARACTER IMAGE PATH (relative to project root), e.g. "assets/images/characters/jaymark-vicente.png"
//   showPartIndicator -> PART INDICATOR: true shows "Part 1 of N" (N = number of items in parts below); false hides it for a single clip
//   parts[].audio     -> AUDIO FILE PATH (relative to project root), e.g. "assets/audio/benefits-and-challenges/clip.mp3"
//   parts[].transcript-> TRANSCRIPT text shown in the panel (blank line = new paragraph)
// Empty values are fine: the panel opens with placeholders ("Audio not added yet", etc.) and never autoplays.
// Need more clips for one narration? Add more { audio, transcript } objects to its parts array
// and the panel shows "Part 1 of 2", "Part 2 of 2", and so on.
// Entries 1-4 are the Benefits, entries 5-8 are the Challenges. A button shows when its topic card is selected.
// =====================================================================================
const NARRATIONS = [

  // ---------- 1. BENEFIT 01: MORE JOBS IN THE PHILIPPINES ----------
  {
    mountId: "moreJobsNarrationMount",
    label: "Listen to More Jobs",
    title: "More Jobs in the Philippines",
    image: "assets/images/characters/richard-mayundang.png",
    showPartIndicator: true,
    parts: [
      { audio: "assets/audio/06-benefits-and-challenges/benefits-and-challenges-benefit-1-richard-mayundang.mp3", transcript: "Introduksyon:\nSa bahaging ito, pag-uusapan natin ang magagandang naidudulot ng globalisasyon at ang mga problemang maaari rin nitong dalhin.\n\nBakit ito nangyari?:\nDumarami ang trabaho kapag may mga kompanya mula sa ibang bansa na nagnenegosyo rito sa Pilipinas.\n\nSino ang nakikinabang?:\nMalaking tulong ito sa mga Pilipinong naghahanap ng trabaho para masuportahan ang kanilang pamilya.\n\nSino ang apektado?:\nPero ang mga walang sapat na kakayahan o training ay maaaring mahirapang makuha ang mga trabahong ito.\n\nKonrektong Halimbawa:\nHalimbawa, kapag may dayuhang kompanyang nagbukas sa Pilipinas, maaari itong kumuha ng mga lokal na empleyado at magbigay ng dagdag na trabaho." }
    ]
  },

  // ---------- 2. BENEFIT 02: ACCESS TO NEW TECHNOLOGY ----------
  {
    mountId: "newTechnologyNarrationMount",
    label: "Listen to New Technology",
    title: "Access to New Technology",
    image: "assets/images/characters/richard-mayundang.png",
    showPartIndicator: true,
    parts: [
      { audio: "assets/audio/06-benefits-and-challenges/benefits-and-challenges-benefit-2-richard-mayundang.mp3", transcript: "Bakit ito nangyari?:\nDahil sa globalisasyon, mas nagiging accessible sa mga negosyo sa Pilipinas ang mga bagong teknolohiya at digital tools mula sa ibang bansa.\n\nSino ang nakikinabang?:\nMalaking tulong ito sa mga negosyo, manggagawa, estudyante, at mamimili dahil mas napapadali ang kanilang mga gawain.\n\nSino ang apektado?:\nPero ang mga walang sapat na access sa teknolohiya o hindi marunong gumamit nito ay maaaring maiwan sa mga oportunidad.\n\nKonkretong Halimbawa:\nAyon sa World Bank, kabilang ang technology, media, at telecommunications sa mga sektor na maaaring makatulong sa Pilipinas na makilahok sa pandaigdigang kalakalan."}
    ]
  },

  // ---------- 3. BENEFIT 03: WIDER MARKET FOR FILIPINO BUSINESSES ----------
  {
    mountId: "widerMarketsNarrationMount",
    label: "Listen to Wider Markets",
    title: "Wider Market for Filipino Businesses",
    image: "assets/images/characters/richard-mayundang.png",
    showPartIndicator: true,
    parts: [
      { audio: "assets/audio/06-benefits-and-challenges/benefits-and-challenges-benefit-1-richard-mayundang.mp3", transcript: "" }
    ]
  },

  // ---------- 4. BENEFIT 04: CULTURAL EXCHANGE ----------
  {
    mountId: "culturalExchangeNarrationMount",
    label: "Listen to Cultural Exchange",
    title: "Cultural Exchange",
    image: "assets/images/characters/richard-mayundang.png",
    showPartIndicator: true,
    parts: [
      { audio: "assets/audio/06-benefits-and-challenges/benefits-and-challenges-benefit-1-richard-mayundang.mp3", transcript: "" }
    ]
  },

  // ---------- 5. CHALLENGE 01: JOB COMPETITION ----------
  {
    mountId: "jobCompetitionNarrationMount",
    label: "Listen to Job Competition",
    title: "Job Competition",
    image: "assets/images/characters/jaymark-vicente.png",
    showPartIndicator: true,
    parts: [
      { audio: "", transcript: "" }
    ]
  },

  // ---------- 6. CHALLENGE 02: ENVIRONMENTAL PROBLEMS ----------
  {
    mountId: "environmentNarrationMount",
    label: "Listen to Environmental Problems",
    title: "Environmental Problems",
    image: "assets/images/characters/jaymark-vicente.png",
    showPartIndicator: true,
    parts: [
      { audio: "", transcript: "" }
    ]
  },

  // ---------- 7. CHALLENGE 03: ECONOMIC DEPENDENCE ----------
  {
    mountId: "economicDependenceNarrationMount",
    label: "Listen to Economic Dependence",
    title: "Economic Dependence",
    image: "assets/images/characters/jaymark-vicente.png",
    showPartIndicator: true,
    parts: [
      { audio: "", transcript: "" }
    ]
  },

  // ---------- 8. CHALLENGE 04: CULTURAL CHANGES ----------
  {
    mountId: "culturalChangesNarrationMount",
    label: "Listen to Cultural Changes",
    title: "Cultural Changes",
    image: "assets/images/characters/jaymark-vicente.png",
    showPartIndicator: true,
    parts: [
      { audio: "", transcript: "" }
    ]
  }
];

// Builds the eight buttons. Nothing to edit below this line.
NARRATIONS.forEach(function (n) {
  AtlasNarration.create(Object.assign({}, n, { mount: document.getElementById(n.mountId) }));
});
