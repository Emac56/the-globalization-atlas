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
    { audio: "assets/audio/what-is-globalization/what-is-globalization-definition-jaymark-catinggan.mp3",
      transcript: "Sa bahaging ito, pag-uusapan natin ang globalisasyon at kung paano natin ito nakikita sa pang-araw-araw nating buhay.\n\nAno nga ba ang Globalisasyon? Ang globalisasyon ay proseso kung saan nagiging mas magkakaugnay ang mga bansa sa pamamagitan ng kalakalan, teknolohiya, komunikasyon, at pagpapalitan ng kaalaman at kultura." }
  ]
});
