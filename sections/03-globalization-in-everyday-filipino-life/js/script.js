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
    image: "",
    showPartIndicator: true,
    parts: [
      { audio: "", transcript: "" }
    ]
  },

  // ---------- 2. CLOTHING (UNIQLO) ----------
  {
    mountId: "clothingNarrationMount",
    label: "Listen to Clothing",
    title: "Clothing",
    image: "",
    showPartIndicator: true,
    parts: [
      { audio: "", transcript: "" }
    ]
  },

  // ---------- 3. ENTERTAINMENT (Korean dramas) ----------
  {
    mountId: "entertainmentNarrationMount",
    label: "Listen to Entertainment",
    title: "Entertainment",
    image: "",
    showPartIndicator: true,
    parts: [
      { audio: "", transcript: "" }
    ]
  },

  // ---------- 4. TECHNOLOGY (Internet and digital services) ----------
  {
    mountId: "technologyNarrationMount",
    label: "Listen to Technology",
    title: "Technology",
    image: "",
    showPartIndicator: true,
    parts: [
      { audio: "", transcript: "" }
    ]
  },

  // ---------- 5. WORK (Filipinos working abroad) ----------
  {
    mountId: "workNarrationMount",
    label: "Listen to Work",
    title: "Work",
    image: "",
    showPartIndicator: true,
    parts: [
      { audio: "", transcript: "" }
    ]
  }
];

// Builds the five buttons. Nothing to edit below this line.
EVERYDAY_LIFE_NARRATIONS.forEach(function (n) {
  AtlasNarration.create(Object.assign({}, n, { mount: document.getElementById(n.mountId) }));
});
