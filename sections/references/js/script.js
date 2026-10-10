// REFERENCES — script for this page only.
// Reads js/references-data.js, then draws the reference list grouped by project section.
// Navigation uses plain HTML links (shared/js/nav.js). This file handles:
//   1) building the APA 7 references (alphabetical, clickable URLs)
//   2) the section filter

(function () {
  "use strict";

  var DATA = window.ATLAS_REFERENCES;
  var catsEl = document.getElementById("cats");
  var filtersEl = document.getElementById("filters");
  var countEl = document.getElementById("count");

  if (!DATA || !DATA.sources || !DATA.sections) {
    catsEl.innerHTML = '<p class="empty">The reference list could not be loaded.</p>';
    return;
  }

  // ---------- small helpers ----------
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  // Letters-only, lowercase: so "World Bank" sorts before "World Trade Organization".
  function sortKey(s) { return (s.author + " " + s.date + " " + s.title).toLowerCase(); }

  function bySource(a, b) {
    var ka = sortKey(DATA.sources[a.id]);
    var kb = sortKey(DATA.sources[b.id]);
    return ka < kb ? -1 : ka > kb ? 1 : 0;
  }

  // Builds one APA 7 reference as DOM nodes (title in italics, URL clickable).
  //   Author. (Date). Title (descriptor). [Retrieved Month Day, Year, from] URL
  function buildApa(s) {
    var p = el("p", "apa__ref");
    p.appendChild(document.createTextNode(s.author + ". (" + s.date + "). "));

    var em = el("em", null, s.title);
    p.appendChild(em);

    // APA: no extra period after a title that already ends in ? or !
    var endsWithMark = /[?!]$/.test(s.title);
    if (s.descriptor) p.appendChild(document.createTextNode(" " + s.descriptor));
    p.appendChild(document.createTextNode(s.descriptor || !endsWithMark ? ". " : " "));

    if (s.retrieved) p.appendChild(document.createTextNode("Retrieved " + s.retrieved + ", from "));

    var a = el("a", "apa__url", s.url);
    a.href = s.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    p.appendChild(a);
    return p;
  }

  function textNode(t) { return document.createTextNode(t); }

  // ---------- where does each source live? (first section that uses it) ----------
  var home = {};
  DATA.sections.forEach(function (sec) {
    sec.sources.forEach(function (u) { if (!home[u.id]) home[u.id] = sec.id; });
  });

  var totalSources = Object.keys(home).length;

  // ---------- one full source card ----------
  function buildCard(sec, usage) {
    var s = DATA.sources[usage.id];

    var card = el("article", "src");
    card.id = "src-" + usage.id;
    card.appendChild(buildApa(s));
    return card;
  }

  // Short "see also" line when a source already appears in full under another section
  function buildXref(sec, usage) {
    var s = DATA.sources[usage.id];
    var homeSec = DATA.sections.filter(function (x) { return x.id === home[usage.id]; })[0];
    var p = el("p", "xref");
    p.appendChild(textNode("See also: " + s.author + " (" + s.date + ") \u2014 listed in full under "));
    var a = el("a", null, homeSec.title);
    a.href = "#src-" + usage.id;
    p.appendChild(a);
    p.appendChild(textNode("."));
    return p;
  }

  // ---------- build the page ----------
  var visibleSections = DATA.sections.filter(function (sec) {
    return sec.sources.length > 0 || DATA.showEmptySections;
  });

  visibleSections.forEach(function (sec) {
    var cat = el("section", "cat");
    cat.id = sec.id;
    cat.dataset.cat = sec.id;
    cat.setAttribute("aria-labelledby", "cat-" + sec.id);

    var h2 = el("h2", "cat__title");
    h2.id = "cat-" + sec.id;
    h2.appendChild(textNode(sec.title));
    var full = sec.sources.filter(function (u) { return home[u.id] === sec.id; });
    h2.appendChild(el("span", "cat__count", String(sec.sources.length)));
    cat.appendChild(h2);

    var list = el("div", "list");
    if (sec.sources.length === 0) {
      list.appendChild(el("p", "empty", "No verified sources yet. They will be added when this section is finished."));
    } else {
      sec.sources.slice().sort(bySource).forEach(function (usage) {
        list.appendChild(home[usage.id] === sec.id ? buildCard(sec, usage) : buildXref(sec, usage));
      });
    }
    cat.appendChild(list);
    catsEl.appendChild(cat);
  });

  if (visibleSections.length === 0) {
    catsEl.appendChild(el("p", "empty", "No verified sources have been added yet."));
  }

  // ---------- section filter (only useful with 2+ sections) ----------
  var cats = catsEl.querySelectorAll(".cat");
  var chips = [];

  function addChip(label, key) {
    var c = el("button", "chip", label);
    c.type = "button";
    c.dataset.filter = key;
    c.setAttribute("aria-pressed", "false");
    c.addEventListener("click", function () { applyFilter(key); });
    filtersEl.appendChild(c);
    chips.push(c);
  }

  if (visibleSections.length > 1) {
    filtersEl.hidden = false;
    addChip("All", "all");
    visibleSections.forEach(function (sec) { addChip(sec.short || sec.title, sec.id); });
  }

  function applyFilter(key) {
    var shown = 0;
    Array.prototype.forEach.call(cats, function (cat) {
      var visible = key === "all" || cat.dataset.cat === key;
      cat.classList.toggle("is-hidden", !visible);
      if (visible) shown += cat.querySelectorAll(".src").length;
    });
    chips.forEach(function (c) {
      var on = c.dataset.filter === key;
      c.classList.toggle("is-active", on);
      c.setAttribute("aria-pressed", String(on));
    });
    countEl.textContent = "Showing " + shown + " of " + totalSources + (totalSources === 1 ? " source" : " sources");
  }

  applyFilter("all");

  // Arriving from a section page (e.g. references/index.html#what-is-globalization):
  // the list is drawn by script, so scroll to the target after it exists.
  if (location.hash.length > 1) {
    var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) target.scrollIntoView();
  }
})();
