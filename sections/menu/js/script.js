// MENU (Page 2) — script for this page only.
// Normal <a href> links do the real navigation. JS only adds small extras.

const page = document.getElementById("menuPage");
const cards = document.querySelectorAll(".card");

// 1) Quick fade-out before leaving the page (cards + back button)
function fadeAndGo(url) {
  page.classList.add("is-leaving");
  setTimeout(() => { window.location.href = url; }, 180);
}

document.querySelectorAll(".card, #backBtn").forEach((link) => {
  link.addEventListener("click", (e) => {
    // let ctrl/cmd/middle-click open normally
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    fadeAndGo(link.href);
  });
});

// 2) Keyboard: press 1–9 to open a section, Esc to go back to the cover
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;

  if (e.key === "Escape") {
    fadeAndGo(document.getElementById("backBtn").href);
    return;
  }

  const card = document.querySelector('.card[data-key="' + e.key + '"]');
  if (card) fadeAndGo(card.href);
});

// 3) Restore page if user comes back with the browser Back button
window.addEventListener("pageshow", () => page.classList.remove("is-leaving"));
