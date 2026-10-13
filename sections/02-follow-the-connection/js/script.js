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
    image: "assets/images/characters/kayzer-leopando.png",
    showPartIndicator: true,
    parts: [
      { audio: "assets/audio/02-follow-the-connection/follow-the-connection-what-is-it-kayzer-leopando.mp3", transcript: "Introduksyon:\nSa bahaging ito, susundan natin ang paglalakbay ng tsokolate bago ito makarating sa mga mamimili sa Pilipinas. Aalamin natin kung saan nagsisimula ang mga sangkap nito at kung paano ito nagiging produktong nabibili natin.\n\nAno ngaba ang Chocolate/Tsokolate?:\nAng tsokolate ay pagkaing karaniwang ginagawa mula sa buto ng kakaw na hinahaluan ng asukal o gatas. Pero bago natin ito makain, dumadaan muna ito sa ilang proseso at ibat ibang bansa." }
    ]
  },

  // ---------- 2. RAW MATERIALS (stage 01) ----------
  {
    mountId: "rawNarrationMount",
    label: "Listen to Raw Materials",
    title: "Raw Materials",
    image: "assets/images/characters/kayzer-leopando.png",
    showPartIndicator: true,
    parts: [
      { audio: "assets/audio/02-follow-the-connection/follow-the-connection-raw-materials-kayzer-leopando.mp3", transcript: "Dito nagsisimula ang proseso. Ang mga magsasaka sa Côte d'Ivoire ay nagtatanim at nag-aani ng mga buto ng kakaw. Ang mga butong ito ang pangunahing sangkap na gagamitin sa paggawa ng tsokolate." }
    ]
  },

  // ---------- 3. PRODUCTION (stage 02) ----------
  {
    mountId: "productionNarrationMount",
    label: "Listen to Production",
    title: "Production",
    image: "assets/images/characters/kayzer-leopando.png",
    showPartIndicator: true,
    parts: [
      { audio: "assets/audio/02-follow-the-connection/follow-the-connection-production-kayzer-leopando.mp3", transcript: "Pagdating sa Malaysia, pinoproseso at dinudurog ang mga buto ng kakaw para makuha ang mga sangkap na kailangan sa paggawa ng mga produktong gawa sa kakaw." }
    ]
  },

  // ---------- 4. MANUFACTURING (stage 03) ----------
  {
    mountId: "manufacturingNarrationMount",
    label: "Listen to Manufacturing",
    title: "Manufacturing",
    image: "assets/images/characters/kayzer-leopando.png",
    showPartIndicator: true,
    parts: [
      { audio: "assets/audio/02-follow-the-connection/follow-the-connection-manufacturing-kayzer-leopando.mp3", transcript: "Sa yugtong ito, ginagamit ang mga naprosesong sangkap para gumawa ng mga produktong tsokolate. Dito nabubuo ang mga produktong maaari nang ihanda para ibenta." }
    ]
  },

  // ---------- 5. TRANSPORTATION (stage 04) ----------
  {
    mountId: "transportationNarrationMount",
    label: "Listen to Transportation",
    title: "Transportation",
    image: "assets/images/characters/kayzer-leopando.png",
    showPartIndicator: true,
    parts: [
      { audio: "assets/audio/02-follow-the-connection/follow-the-connection-transportation-kayzer-leopando.mp3", transcript: "Pagkatapos ng pagproseso at paggawa, inililipat ang mga sangkap o produkto mula sa isang lugar papunta sa iba. Mahalaga ang transportasyon para makarating ang mga produkto sa mga bansang nangangailangan nito." }
    ]
  },

  // ---------- 6. MARKET (stage 05) ----------
  {
    mountId: "marketNarrationMount",
    label: "Listen to Market",
    title: "Market",
    image: "assets/images/characters/kayzer-leopando.png",
    showPartIndicator: true,
    parts: [
      { audio: "assets/audio/02-follow-the-connection/follow-the-connection-market-kayzer-leopando.mp3", transcript: "Pagdating sa Pilipinas, may mga produktong may sangkap na kakaw na inaangkat mula sa Malaysia. Ibinibenta ang mga ito sa mga negosyo at tindahan para mabili ng mga mamimili." }
    ]
  },

  // ---------- 7. FILIPINO CONSUMER (stage 06) ----------
  {
    mountId: "consumerNarrationMount",
    label: "Listen to Filipino Consumer",
    title: "Filipino Consumer",
    image: "assets/images/characters/kayzer-leopando.png",
    showPartIndicator: true,
    parts: [
      { audio: "assets/audio/02-follow-the-connection/follow-the-connection-filipino-consumers-kayzer-leopando.mp3", transcript: "Sa huling yugto, nabibili na ng mga Pilipino ang mga produktong tsokolate sa mga lokal na tindahan. Dito nagtatapos ang paglalakbay ng produkto mula sa mga sangkap hanggang sa mamimili." }
    ]
  },

  // ---------- 8. CONNECTION NOTES: COUNTRIES INVOLVED ----------
  {
    mountId: "countriesNarrationMount",
    label: "Listen to Countries Involved",
    title: "Countries Involved",
    image: "assets/images/characters/jaymark-vicente.png",
    showPartIndicator: true,
    parts: [
      { audio: "assets/audio/02-follow-the-connection/follow-the-connection-countries-involved-jaymark-vicente.mp3", transcript: "May kanya-kanyang papel ang mga bansang ito. Nagbibigay ng buto ng kakaw ang Côte d'Ivoire, nagpoproseso at gumagawa ng mga produktong kakaw ang Malaysia, at nag-aangkat at nagbebenta naman ng mga produkto ang Pilipinas." }
    ]
  },

  // ---------- 9. CONNECTION NOTES: WHO BENEFITS ----------
  {
    mountId: "benefitsNarrationMount",
    label: "Listen to Who Benefits",
    title: "Who Benefits?",
    image: "assets/images/characters/jaymark-vicente.png",
    showPartIndicator: true,
    parts: [
      { audio: "assets/audio/02-follow-the-connection/follow-the-connection-who-benefits-jaymark-vicente.mp3", transcript: "Maraming nakikinabang sa prosesong ito. Kumita ang mga magsasaka mula sa kanilang ani, nagkakaroon ng negosyo ang mga processor at nagbebenta, at nagkakaroon naman ng mapagpipiliang produkto ang mga mamimili." }
    ]
  },

  // ---------- 10. CONNECTION NOTES: PROBLEMS ----------
  {
    mountId: "problemsNarrationMount",
    label: "Listen to Problems",
    title: "Problems",
    image: "assets/images/characters/jaymark-vicente.png",
    showPartIndicator: true,
    parts: [
      { audio: "assets/audio/02-follow-the-connection/follow-the-connection-problems-jaymark-vicente.mp3", transcript: "May mga hamon din sa paggawa ng tsokolate. Kabilang dito ang child labor sa ilang sakahan ng kakaw, mga problemang dulot ng panahon na nakaaapekto sa ani, at hirap sa pagtukoy kung saan talaga nagmula ang mga sangkap." }
    ]
  },

  // ---------- 11. CONNECTION NOTES: HOW ARE THEY CONNECTED? ----------
  {
    mountId: "connectedNarrationMount",
    label: "Listen to How Are They Connected?",
    title: "How Are They Connected?",
    image: "assets/images/characters/jaymark-vicente.png",
    showPartIndicator: true,
    parts: [
      { audio: "assets/audio/02-follow-the-connection/follow-the-connection-how-are-they-connected-jaymark-vicente.mp3", transcript: "Ipinapakita ng halimbawang ito na magkakaugnay ang mga bansa sa paggawa ng isang produkto. Ang kakaw na itinanim sa Côte d'Ivoire ay maaaring iproseso sa Malaysia, at ang mga produktong gawa rito ay maaaring makarating sa Pilipinas. Dahil dito, nakikita natin kung paano pinagdurugtong ng pandaigdigang kalakalan ang iba't ibang bansa.\n\nSa simpleng produkto tulad ng tsokolate, makikita nating may iba't ibang tao at bansang nagtutulungan bago ito makarating sa atin. Iyan ang isa sa mga paraan kung paano gumagana ang globalisasyon." }
    ]
  }
];

// Builds the 11 buttons. Nothing to edit below this line.
FOLLOW_THE_CONNECTION_NARRATIONS.forEach(function (n) {
  AtlasNarration.create(Object.assign({}, n, { mount: document.getElementById(n.mountId) }));
});
