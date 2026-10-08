// GLOBALIZATION IN EVERYDAY FILIPINO LIFE — script for this page only.
// Navigation uses plain HTML links. JS handles the open / close cards.

const page = document.getElementById("secPage");
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

// Keyboard: press 1–5 to open an example, Esc goes to the Atlas Menu
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.key === "Escape") { fadeAndGo(document.getElementById("menuBtn").href); return; }
  const card = document.querySelector('.ex[data-key="' + e.key + '"]');
  if (card) toggleExample(card);
});

// Small fade-out before leaving the page
function fadeAndGo(url) {
  page.classList.add("is-leaving");
  setTimeout(() => { window.location.href = url; }, 180);
}

document.querySelectorAll(".nav-btn").forEach((link) => {
  link.addEventListener("click", (e) => {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    fadeAndGo(link.href);
  });
});
window.addEventListener("pageshow", () => page.classList.remove("is-leaving"));

// Start with the first example open so the layout is visible
setOpen(examples[0], true);
