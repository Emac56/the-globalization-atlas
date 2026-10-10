// REFERENCES — script for this page only.
// Navigation uses plain HTML links. JS handles the category filter and the expandable APA details.

const cats = document.querySelectorAll(".cat");
const chips = document.querySelectorAll(".chip[data-filter]");
const countEl = document.getElementById("count");
const toggleAll = document.getElementById("toggleAll");

// Open or close one card's APA details
function setOpen(card, open) {
  const btn = card.querySelector(".src__toggle");
  const panel = card.querySelector(".src__apa");
  card.classList.toggle("is-open", open);
  btn.setAttribute("aria-expanded", String(open));
  btn.querySelector(".src__sign").textContent = open ? "–" : "+";
  panel.hidden = !open;
}

document.querySelectorAll(".src").forEach((card) => {
  card.querySelector(".src__toggle").addEventListener("click", () => {
    setOpen(card, !card.classList.contains("is-open"));
    syncToggleAll();
  });
});

// Category filter
function applyFilter(key) {
  let shown = 0, total = 0;
  cats.forEach((cat) => {
    const n = cat.querySelectorAll(".src").length;
    total += n;
    const visible = key === "all" || cat.dataset.cat === key;
    cat.classList.toggle("is-hidden", !visible);
    if (visible) shown += n;
  });
  chips.forEach((c) => {
    const on = c.dataset.filter === key;
    c.classList.toggle("is-active", on);
    c.setAttribute("aria-pressed", String(on));
  });
  countEl.textContent = "Showing " + shown + " of " + total + " source slots";
  syncToggleAll();
}
chips.forEach((c) => c.addEventListener("click", () => applyFilter(c.dataset.filter)));

// Expand / collapse all (only the cards currently visible)
function visibleCards() {
  return document.querySelectorAll(".cat:not(.is-hidden) .src");
}
function syncToggleAll() {
  const list = visibleCards();
  const allOpen = list.length > 0 && [...list].every((c) => c.classList.contains("is-open"));
  toggleAll.textContent = allOpen ? "Collapse all" : "Expand all";
  toggleAll.setAttribute("aria-pressed", String(allOpen));
}
toggleAll.addEventListener("click", () => {
  const open = toggleAll.getAttribute("aria-pressed") !== "true";
  visibleCards().forEach((c) => setOpen(c, open));
  syncToggleAll();
});





