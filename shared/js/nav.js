/* SHARED NAVIGATION — used by the Atlas Menu and every section page.
   ---------------------------------------------------------------
   How to use on a page:
     1) <link> shared/css/global.css (already there on every page)
     2) Put ONE placeholder where the navigation should appear:
          <div data-atlas-nav="what-is-globalization"></div>   (a section page: use its folder name)
          <div data-atlas-nav="menu"></div>                    (the Atlas Menu)
     3) <script src="../../shared/js/nav.js"></script> before the page's own script.

   To change the order of the sections, edit ATLAS_ORDER below (the ONLY place the order lives).
   Labels live in LABELS below, so they stay identical on every page. */

(function () {
  "use strict";

  // Section order = same order as the Atlas Menu cards.
  var ATLAS_ORDER = [
    "what-is-globalization",
    "follow-the-connection",
    "globalization-in-everyday-filipino-life",
    "globalization-and-the-philippines",
    "culture-goes-global",
    "benefits-and-challenges",
    "global-problem-global-response",
    "my-globalization-map",
    "group-reflection",
    "references"
  ];

  var LABELS = {
    previous: "\u2190 PREVIOUS",
    menu: "ATLAS MENU",
    next: "NEXT \u2192",
    finish: "FINISH ATLAS",
    cover: "\u2302 BACK TO COVER"
  };

  // Every page lives at /sections/<name>/index.html, so these relative paths work everywhere.
  var COVER_URL = "../../index.html";
  var MENU_URL = "../menu/index.html";
  function sectionUrl(slug) { return "../" + slug + "/index.html"; }

  var mount = document.querySelector("[data-atlas-nav]");
  if (!mount) return;

  var current = mount.getAttribute("data-atlas-nav");
  var isMenu = current === "menu";
  var index = ATLAS_ORDER.indexOf(current);

  if (!isMenu && index === -1) {
    console.warn("[atlas-nav] Unknown page \"" + current + "\". Add it to ATLAS_ORDER in shared/js/nav.js.");
  }

  function link(label, href, extraClass) {
    var a = document.createElement("a");
    a.className = "pixel-btn atlas-nav__btn" + (extraClass ? " " + extraClass : "");
    a.href = href;
    a.textContent = label;
    return a;
  }

  // First section has nothing before it: keep the slot (so the layout never shifts) but disable it.
  function disabled(label) {
    var s = document.createElement("span");
    s.className = "pixel-btn atlas-nav__btn is-disabled";
    s.setAttribute("role", "link");
    s.setAttribute("aria-disabled", "true");
    s.textContent = label;
    return s;
  }

  var nav = document.createElement("nav");
  nav.className = "atlas-nav" + (isMenu ? " atlas-nav--menu" : "");
  nav.setAttribute("aria-label", isMenu ? "Atlas navigation" : "Section navigation");

  if (!isMenu && index !== -1) {
    var row = document.createElement("div");
    row.className = "atlas-nav__row";

    // PREVIOUS
    row.appendChild(index > 0
      ? link(LABELS.previous, sectionUrl(ATLAS_ORDER[index - 1]))
      : disabled(LABELS.previous));

    // ATLAS MENU
    var menuLink = link(LABELS.menu, MENU_URL, "atlas-nav__btn--menu");
    menuLink.setAttribute("data-atlas-nav-menu", "");
    row.appendChild(menuLink);

    // NEXT  (or FINISH ATLAS on the last section, which returns to the cover)
    row.appendChild(index < ATLAS_ORDER.length - 1
      ? link(LABELS.next, sectionUrl(ATLAS_ORDER[index + 1]))
      : link(LABELS.finish, COVER_URL));

    nav.appendChild(row);
  }

  // BACK TO COVER: on every section page and on the Atlas Menu
  var coverLink = link(LABELS.cover, COVER_URL, "atlas-nav__btn--cover");
  coverLink.setAttribute("data-atlas-nav-cover", "");
  nav.appendChild(coverLink);

  mount.replaceWith(nav);

  /* ---- Behaviour: quick fade-out before leaving (same effect the pages already had) ---- */
  var page = document.querySelector("main.page");

  function go(url) {
    if (!page) { window.location.href = url; return; }
    page.classList.add("is-leaving");
    setTimeout(function () { window.location.href = url; }, 180);
  }

  nav.addEventListener("click", function (e) {
    var a = e.target.closest("a.atlas-nav__btn");
    if (!a) return;
    // let ctrl / cmd / shift / middle-click behave normally
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    go(a.href);
  });

  // Esc: section page -> Atlas Menu, Atlas Menu -> Cover (same as before)
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape" || e.ctrlKey || e.metaKey || e.altKey) return;
    go(isMenu ? coverLink.href : menuLink.href);
  });

  // Coming back with the browser Back button: undo the fade
  window.addEventListener("pageshow", function () {
    if (page) page.classList.remove("is-leaving");
  });
})();
