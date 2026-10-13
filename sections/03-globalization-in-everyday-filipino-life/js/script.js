// GLOBALIZATION IN EVERYDAY FILIPINO LIFE — script for this page only.
// Navigation uses plain HTML links. JS handles the open / close cards.

const examples = document.querySelectorAll(".ex");

// Open or close one example. Only one stays open at a time.
function setOpen(card, open) {
  card.classList.toggle("is-open", open);
  const btn = card.querySelector(".ex__head");
  btn.setAttribute("aria-expanded", String(open));
  card.querySelector(".ex__toggle").textContent = open ? "–" : "+";
}

function toggleExample(card) {
  const willOpen = !card.classList.contains("is-open");
  examples.forEach((c) => setOpen(c, false));
  setOpen(card, willOpen);
}

examples.forEach((card) => {
  card.querySelector(".ex__head").addEventListener("click", () => toggleExample(card));
});

// Keyboard: press 1–5 to open an example
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const card = document.querySelector('.ex[data-key="' + e.key + '"]');
  if (card) toggleExample(card);
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
  img.addEventListener("load", () => frame.classList.remove("is-missing"));
}
document.querySelectorAll(".shot__frame img").forEach(checkImage);

// Start with the first example open so the layout is visible
setOpen(examples[0], true);


// =====================================================================================
// NARRATION CONFIGS — the five buttons beside the example titles. EDIT THE VALUES HERE.
// All five open the SAME shared panel (shared/js/narration.js); only these values change.
//   image      -> character image path (relative to project root), e.g. "assets/images/characters/name.png"
//   audio      -> audio file path (relative to project root), e.g. "assets/audio/globalization-in-everyday-filipino-life/clip.mp3"
//   transcript -> text shown in the panel (blank line = new paragraph)
//   title      -> narration title shown at the top of the panel
// Empty values are fine: the panel opens with placeholders ("Audio not added yet", etc.).
// Need more clips for one narration? Add more { audio, transcript } objects to its parts array
// and the panel shows "Part 1 of 2", "Part 2 of 2", and so on.
// =====================================================================================
const EVERYDAY_LIFE_NARRATIONS = [

  // ---------- 1. FOOD (McDonald’s) ----------
  {
    mountId: "foodNarrationMount",
    label: "Listen to Food",
    title: "Food",
    image: "assets/images/characters/rey-dela-cruz.png",
    showPartIndicator: true,
    parts: [
      { audio: "assets/audio/03-globalization-in-everyday-filipino-life/globalization-in-everyday-filipino-life-food-rey-dela-cruz.mp3", transcript: "Introduksyon:\nSa bahaging ito, makikita natin kung paano konektado ang Pilipinas sa ibang bansa at kung paano ito nakakaapekto sa buhay natin.\n\nGlobalization Connection:\nNagsimula ang McDonald's sa Amerika, pero nagkaroon din ito ng mga branch sa Pilipinas. Ibig sabihin, puwedeng lumawak ang isang negosyo at makilala sa ibang bansa.\n\nEffect on filipino life:\nDahil dito, nakakakain ang mga Pilipino sa McDonald's nang hindi na kailangang pumunta sa Amerika o sa ibat-ibang bansa na meron nang McDonalds." }
    ]
  },

  // ---------- 2. CLOTHING (UNIQLO) ----------
  {
    mountId: "clothingNarrationMount",
    label: "Listen to Clothing",
    title: "Clothing",
    image: "assets/images/characters/rey-dela-cruz.png",
    showPartIndicator: true,
    parts: [
      { audio: "assets/audio/03-globalization-in-everyday-filipino-life/globalization-in-everyday-filipino-life-clothing-rey-dela-cruz.mp3", transcript: "Global Connection:\nAng UNIQLO ay mula sa Japan, pero nagbebenta rin ito ng damit sa Pilipinas. Ipinapakita nito na nakakarating ang mga produkto ng ibang bansa sa atin.\n\nEffect on filipino life:\nMas marami tayong pagpipiliang damit dahil mabibili na natin ang mga produkto ng UNIQLO dito sa Pilipinas." }
    ]
  },

  // ---------- 3. ENTERTAINMENT (Korean dramas) ----------
  {
    mountId: "entertainmentNarrationMount",
    label: "Listen to Entertainment",
    title: "Entertainment",
    image: "assets/images/characters/rey-dela-cruz.png",
    showPartIndicator: true,
    parts: [
      { audio: "assets/audio/03-globalization-in-everyday-filipino-life/globalization-in-everyday-filipino-life-entertainment-rey-dela-cruz.mp3", transcript: "Global Connection:\nSa tulong ng internet, napapanood na rin sa Pilipinas ang mga palabas at napapakinggan ang musika mula sa South Korea.\n\nEffect on filipino life:\nMaraming Pilipino ang nae-enjoy ang Korean dramas at K-pop. Nagiging bahagi rin ang mga ito ng ating mga libangan at usapan." }
    ]
  },

  // ---------- 4. TECHNOLOGY (Internet and digital services) ----------
  {
    mountId: "technologyNarrationMount",
    label: "Listen to Technology",
    title: "Technology",
    image: "assets/images/characters/rey-dela-cruz.png",
    showPartIndicator: true,
    parts: [
      { audio: "assets/audio/03-globalization-in-everyday-filipino-life/globalization-in-everyday-filipino-life-technology-rey-dela-cruz.mp3", transcript: "Global Connection:\nDahil sa internet, nakakakonekta tayo sa mga tao at nakakakuha ng impormasyon mula sa iba't ibang bansa.\n\nEffect on filipino life:\nMas madali na tayong makapag-aral, makipag-usap sa mga nasa ibang bansa, at maghanap ng impormasyon gamit ang ating mga device." }
    ]
  },

  // ---------- 5. WORK (Filipinos working abroad) ----------
  {
    mountId: "workNarrationMount",
    label: "Listen to Work",
    title: "Work",
    image: "assets/images/characters/rey-dela-cruz.png",
    showPartIndicator: true,
    parts: [
      { audio: "assets/audio/03-globalization-in-everyday-filipino-life/globalization-in-everyday-filipino-life-work-rey-dela-cruz.mp3", transcript: "Global Connection:\nMay mga Pilipinong nagtatrabaho sa ibang bansa dahil may mga oportunidad doon na maaari nilang pasukan.\n\nEffect on filipino life:\nAng perang ipinapadala nila sa kanilang pamilya ay nakakatulong sa pang-araw-araw na gastusin, tulad ng pagkain, bayarin, at pag-aaral.\n\nSa mga halimbawang ito, makikita natin na ang globalisasyon ay bahagi na ng ating pang-araw-araw na buhay. Nakakaapekto ito sa mga produktong binibili natin, libangang tinatangkilik, teknolohiyang ginagamit, at trabahong pinipili natin." }
    ]
  }
];

// Builds the five buttons. Nothing to edit below this line.
EVERYDAY_LIFE_NARRATIONS.forEach(function (n) {
  AtlasNarration.create(Object.assign({}, n, { mount: document.getElementById(n.mountId) }));
});
