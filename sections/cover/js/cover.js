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
const NEXT_PAGE = "sections/menu/";

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
    { audio: "assets/audio/cover/cover-introduction-jaymark-vicente.mp3",
      transcript: "Magandang araw sa lahat! Welcome sa The Globalization Atlas: Exploring Global Connections.\nNaisip mo na ba kung paano nagkakaugnay ang Pilipinas at ang ibang bansa?\nTuklasin natin kung paano nakaaapekto ang globalisasyon sa ating buhay, kabuhayan, at kultura.\nAlamin din natin ang mga benepisyo at hamon nito. Tara, simulan na natin ang ating paglalakbay!" },
  ],
});
