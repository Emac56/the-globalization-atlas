// SECTION 01 — script for this page only.
// This page is plain HTML: navigation comes from shared/js/nav.js and the content needs no
// interaction, so there is nothing to run here yet.
//
// Kept on purpose so the page can later load the shared narration (voice-over) system.
// For narration, the readable blocks already have stable ids:
//   #definition, #characteristics (#trait-trade, #trait-people, #trait-digital),
//   #example (#jollibee-usa, #jollibee-canada, #jollibee-vietnam), #why

// Narration button for the Definition (shared component: shared/js/narration.js).
// Audio path is relative to the project root. The panel never autoplays; the user presses Play.
AtlasNarration.create({
  mount: document.getElementById("definitionNarrationMount"),
  narrator: "jaymark-catinggan",
  label: "Listen to Definition",
  title: "What Is Globalization",
  showPartIndicator: true,
  parts: [
    { audio: "assets/audio/01-what-is-globalization/what-is-globalization-definition-jaymark-catinggan.mp3",
      transcript: "Introduksyon:\nSa bahaging ito, pag-uusapan natin ang globalisasyon at kung paano natin ito nakikita sa pang-araw-araw nating buhay.\n\nAno nga ba ang Globalisasyon?:\nAng globalisasyon ay proseso kung saan nagiging mas magkakaugnay ang mga bansa sa pamamagitan ng kalakalan, teknolohiya, komunikasyon, at pagpapalitan ng kaalaman at kultura." }
  ]
});


// =====================================================================================
// NARRATION CONFIGS — the five buttons beside the titles. EDIT THE VALUES HERE.
// All five open the SAME shared panel (shared/js/narration.js); only these values change.
//   image      -> character image path (relative to project root), e.g. "assets/images/characters/name.png"
//   audio      -> audio file path (relative to project root), e.g. "assets/audio/what-is-globalization/clip.mp3"
//   transcript -> text shown in the panel (blank line = new paragraph)
//   title      -> section title shown at the top of the panel
// Empty values are fine: the panel opens with placeholders ("Audio not added yet", etc.).
// Need more clips for one narration? Add more { audio, transcript } objects to its parts array
// and the panel shows "Part 1 of 2", "Part 2 of 2", and so on.
// =====================================================================================
const WHAT_IS_GLOBALIZATION_NARRATIONS = [

  // ---------- 1. GLOBAL TRADE ----------
  {
    mountId: "tradeNarrationMount",
    label: "Listen to Global Trade",
    title: "Global Trade",
    image: "assets/images/characters/jaymark-catinggan.png",
    showPartIndicator: true,
    parts: [
      { audio: "assets/audio/01-what-is-globalization/what-is-globalization-global-trade-jaymark-catinggan.mp3", transcript: "Sa global trade, hindi lang sariling produkto ang ginagamit natin. Halimbawa, may mga gamit tayong binibili na gawa sa ibang bansa, habang ang mga produktong Pilipino ay naibebenta rin sa ibang lugar." }
    ]
  },

  // ---------- 2. MOVEMENT OF PEOPLE ----------
  {
    mountId: "peopleNarrationMount",
    label: "Listen to Movement of People",
    title: "Movement of People",
    image: "assets/images/characters/jaymark-catinggan.png",
    showPartIndicator: true,
    parts: [
      { audio: "assets/audio/01-what-is-globalization/what-is-globalization-movement-of-people-jaymark-catinggan.mp3", transcript: "Ito naman ay tungkol sa mga taong pumupunta sa ibang bansa para magtrabaho, mag-aral, o magkaroon ng bagong karanasan. Sa ganitong paraan, nakikilala nila ang ibang pamumuhay at naibabahagi rin nila ang kanilang sariling kultura." }
    ]
  },

  // ---------- 3. DIGITAL COMMUNICATION ----------
  {
    mountId: "digitalNarrationMount",
    label: "Listen to Digital Communication",
    title: "Digital Communication",
    image: "assets/images/characters/jaymark-catinggan.png",
    showPartIndicator: true,
    parts: [
      { audio: "assets/audio/01-what-is-globalization/what-is-globalization-digital-communication-jaymark-catinggan.mp3", transcript: "Dahil sa internet, hindi na kailangang magkalapit ang mga tao para makapag-usap. Halimbawa, puwede tayong makipag-video call sa kaibigan o kapamilyang nasa ibang bansa." }
    ]
  },

  // ---------- 4. EVERYDAY EXAMPLE ----------
  {
    mountId: "exampleNarrationMount",
    label: "Listen to Everyday Example",
    title: "Everyday Example",
    image: "assets/images/characters/jaymark-vicente.png",
    showPartIndicator: true,
    parts: [
      { audio: "assets/audio/01-what-is-globalization/what-is-globalization-everyday-example-jaymark-vicente.mp3", transcript: "Halimbawa natin ang Jollibee. Kilala itong tatak na nagsimula sa Pilipinas, pero mayroon na rin itong mga branch sa ibang bansa. Ibig sabihin, ang isang negosyong Pilipino ay kayang makilala at tangkilikin ng mga tao sa iba't ibang lugar.\n\nMakikita natin ang Jollibee sa United States, Canada, at Vietnam. Kahit nagmula ito sa Pilipinas, nakakapagbigay na rin ito ng serbisyo sa mga customer na may iba't ibang kultura." }
    ]
  },

  // ---------- 5. WHY IS IT GLOBALIZATION? (button label: "Listen to Explanation") ----------
  {
    mountId: "whyNarrationMount",
    label: "Listen to Explanation",
    title: "Why Is It Globalization?",
    image: "assets/images/characters/jaymark-vicente.png",
    showPartIndicator: true,
    parts: [
      { audio: "assets/audio/01-what-is-globalization/what-is-globalization-why-is-it-globalization-jaymark-vicente.mp3", transcript: "Globalisasyon ito dahil lumampas na sa hangganan ng Pilipinas ang negosyo ng Jollibee. Hindi lang dito sa atin nakakaabot ang produkto nito, kundi pati sa ibang bansa.\n\nNgayon, alam na natin kung ano ang globalisasyon at kung paano ito nangyayari sa totoong buhay. Sa susunod na bahagi, tuklasin naman natin ang iba pang koneksyon ng Pilipinas sa mundo." }
    ]
  }
];

// Builds the five buttons. Nothing to edit below this line.
WHAT_IS_GLOBALIZATION_NARRATIONS.forEach(function (n) {
  AtlasNarration.create(Object.assign({}, n, { mount: document.getElementById(n.mountId) }));
});
