// BENEFITS AND CHALLENGES — script for this page only.
// Navigation uses plain HTML links. JS handles the expandable explanations.

const accButtons = document.querySelectorAll(".acc__btn");

// Open or close one explanation
function setOpen(btn, open) {
  btn.setAttribute("aria-expanded", String(open));
  document.getElementById(btn.getAttribute("aria-controls")).hidden = !open;
}

accButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    setOpen(btn, btn.getAttribute("aria-expanded") !== "true");
  });
});

// "See deeper explanation" in the comparison opens the matching section and scrolls to it
document.querySelectorAll(".item__more").forEach((link) => {
  link.addEventListener("click", () => {
    const target = link.dataset.target;           // e.g. "good1", "bad2"
    setOpen(document.getElementById("btn-" + target), true);
    document.getElementById("acc-" + target).scrollIntoView({ behavior: "smooth", block: "start" });
  });
});



