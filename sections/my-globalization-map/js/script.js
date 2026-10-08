// MY GLOBALIZATION MAP — script for this page only.
// Navigation uses plain HTML links. JS handles country selection.

// Replace each "text" when the research is ready.
const COUNTRIES = {
  "japan":         { name: "Japan",         category: "Technology / Trade",      text: "[Draft — to be researched]" },
  "south-korea":   { name: "South Korea",   category: "Entertainment / Culture", text: "[Draft — to be researched]" },
  "united-states": { name: "United States", category: "Business / Education",    text: "[Draft — to be researched]" },
  "china":         { name: "China",         category: "Trade",                   text: "[Draft — to be researched]" },
  "singapore":     { name: "Singapore",     category: "Investment / Business",   text: "[Draft — to be researched]" }
};

const page = document.getElementById("secPage");
const map = document.getElementById("map");
const nodes = document.querySelectorAll(".node");
const lines = document.querySelectorAll(".line");
const detail = document.getElementById("detail");
const emptyMsg = document.getElementById("detailEmpty");
const body = document.getElementById("detailBody");
const nameEl = document.getElementById("detailName");
const catEl = document.getElementById("detailCat");
const textEl = document.getElementById("detailText");
const countEl = document.getElementById("detailCount");

const seen = new Set();   // countries the visitor has opened

// Select one country: highlight node + line, show category and explanation
function selectCountry(id) {
  const data = COUNTRIES[id];
  if (!data) return;
  seen.add(id);

  nodes.forEach((n) => {
    const on = n.dataset.id === id;
    n.classList.toggle("is-active", on);
    n.classList.toggle("is-seen", seen.has(n.dataset.id));
    n.setAttribute("aria-pressed", String(on));
  });
  lines.forEach((l) => l.classList.toggle("is-active", l.dataset.id === id));
  map.classList.add("has-active");

  nameEl.textContent = data.name;
  catEl.textContent = data.category;
  textEl.textContent = data.text;
  countEl.textContent = "Explored " + seen.size + " / " + Object.keys(COUNTRIES).length;

  emptyMsg.hidden = true;
  body.hidden = false;

  // On phones the panel sits below the map: scroll just enough to show it
  if (window.matchMedia("(max-width: 640px)").matches) {
    detail.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
}

nodes.forEach((n) => n.addEventListener("click", () => selectCountry(n.dataset.id)));

// Small fade-out before leaving the page
page.querySelectorAll(".nav-btn").forEach((link) => {
  link.addEventListener("click", (e) => {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    page.classList.add("is-leaving");
    setTimeout(() => { window.location.href = link.href; }, 180);
  });
});

window.addEventListener("pageshow", () => page.classList.remove("is-leaving"));
