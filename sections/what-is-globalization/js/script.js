// SECTION 01 — script for this page only (placeholder content).
// Basic navigation is plain HTML links. JS only adds small interactions.


// 1) Key characteristic cards: click to show / hide extra text
document.querySelectorAll(".trait").forEach((card) => {
  const btn = card.querySelector(".trait__btn");
  const more = card.querySelector(".trait__more");
  const label = card.querySelector(".trait__toggle");

  btn.addEventListener("click", () => {
    const open = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!open));
    more.hidden = open;
    card.classList.toggle("is-open", !open);
    label.textContent = open ? "+ More" : "– Less";
  });
});

// 2) Everyday moment: click a tag to highlight it and change the text below
const TEXTS = [
  "The call only works because of internet networks and apps that connect people across countries in real time.",
  "Many Filipino families have a relative working overseas, so family life now stretches across borders.",
  "Money earned abroad is sent home, linking a family's daily budget to work done in another country.",
  "Through calls and social media, families share news, food, and traditions no matter how far apart they are."
];

const tags = document.querySelectorAll(".tag");
const caption = document.getElementById("momentCaption");

function showTag(i) {
  tags.forEach((t, idx) => t.classList.toggle("is-active", idx === i));
  caption.textContent = TEXTS[i];
}

tags.forEach((t) => {
  t.addEventListener("click", () => showTag(Number(t.dataset.step)));
});
showTag(0);




