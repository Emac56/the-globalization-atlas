// COVER (Page 1) — script for this page only

// 1) Twinkling sparkles
const sparkleBox = document.getElementById("sparkles");
for (let i = 0; i < 14; i++) {
  const s = document.createElement("span");
  s.className = "sparkle";
  s.style.left = Math.random() * 100 + "%";
  s.style.top = Math.random() * 100 + "%";
  s.style.animationDelay = Math.random() * 3 + "s";
  sparkleBox.appendChild(s);
}

// 2) Start button
// Path ay relative sa root index.html (ito ang cover page)
const NEXT_PAGE = "sections/menu/index.html";

document.getElementById("startBtn").addEventListener("click", () => {
  if (NEXT_PAGE) window.location.href = NEXT_PAGE;
});






// Narration button (shared component: shared/js/narration.js).
// Four-part introduction. Audio paths are relative to the project root.
AtlasNarration.create({
  mount: document.getElementById("narrationMount"),
  narrator: "jaymark-vicente",
  label: "Listen to Introduction",
  title: "Introduction",
  parts: [
    { audio: "assets/audio/introduction/introduction-jaymark-vicente.mp3",
      transcript: "Magandang araw sa lahat! Welcome sa The Globalization Atlas: Exploring Global Connections." },
    { audio: "assets/audio/introduction/question-jaymark-vicente.mp3",
      transcript: "Naisip mo na ba kung paano nagkakaugnay ang Pilipinas at ang ibang bansa?" },
    { audio: "assets/audio/introduction/exploration-jaymark-vicente.mp3",
      transcript: "Tuklasin natin kung paano nakaaapekto ang globalisasyon sa ating buhay, kabuhayan, at kultura." },
    { audio: "assets/audio/introduction/conclusion-jaymark-vicente.mp3",
      transcript: "Alamin din natin ang mga benepisyo at hamon nito. Tara, simulan na natin ang ating paglalakbay!" }
  ],
  finalAction: {
    label: "Start Exploring",
    onClick: function () { if (NEXT_PAGE) window.location.href = NEXT_PAGE; }
  }
});
