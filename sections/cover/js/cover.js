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
// Kapag handa na ang Page 2, ilagay dito ang file path, hal. "pages/page-02/index.html"
const NEXT_PAGE = "sections/menu/index.html";

document.getElementById("startBtn").addEventListener("click", () => {
  if (NEXT_PAGE) window.location.href = NEXT_PAGE;
});
