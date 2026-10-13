// MY GLOBALIZATION MAP — script for this page only.
// Draws a simplified pixel map, the connection lines, and the detail panel.
// Navigation uses plain HTML links (shared/js/nav.js).
//
// NARRATION: the five country narration buttons are configured in MAP_NARRATIONS at the bottom of this file.
//
// SOURCES: not shown on this page. They are listed only on the References page
// (category "My Globalization Map"), so this file holds the short explanations only.

(function () {
  "use strict";

  // ---------- country content (edit texts here) ----------
  var COUNTRIES = {
    "japan": {
      name: "Japan",
      category: "Infrastructure and technology",
      text: "Japan helps build our roads, trains, and big projects.",
      keys: ["Roads", "Trains", "Projects"]
    },
    "south-korea": {
      name: "South Korea",
      category: "Trade, entertainment, and culture",
      text: "K-pop, K-dramas, and Korean food are everywhere here. We trade goods too.",
      keys: ["K-pop", "Dramas", "Food", "Trade"]
    },
    "united-states": {
      name: "United States",
      category: "Business, education, and technology",
      text: "US companies invest here and train Filipinos in digital and AI skills.",
      keys: ["Investment", "Digital skills", "AI"]
    },
    "china": {
      name: "China",
      category: "Trade and products",
      text: "We buy and sell goods with China, like electronics and machinery.",
      keys: ["Electronics", "Machinery"]
    },
    "singapore": {
      name: "Singapore",
      category: "Jobs, investment, and business",
      text: "Filipinos work in Singapore. Singaporean companies invest here.",
      keys: ["Jobs", "Investment", "Business"]
    }
  };
  var ORDER = ["china", "south-korea", "japan", "united-states", "singapore"];

  // ---------- elements ----------
  var map = document.getElementById("map");
  var landSvg = document.getElementById("mapLand");
  var linesSvg = document.getElementById("mapLines");
  var hub = document.getElementById("hub");
  var nodes = Array.prototype.slice.call(document.querySelectorAll(".node"));
  var picker = document.getElementById("picker");
  var detail = document.getElementById("detail");
  var overview = document.getElementById("detailOverview");
  var body = document.getElementById("detailBody");
  var flagSlot = document.getElementById("detailFlag");
  var nameEl = document.getElementById("detailName");
  var catEl = document.getElementById("detailCat");
  var textEl = document.getElementById("detailText");
  var keysEl = document.getElementById("detailKeys");
  var countEl = document.getElementById("detailCount");
  var resetBtn = document.getElementById("resetBtn");
  // narration buttons beside the country title: one per country, only the selected country's is shown
  var narrMounts = Array.prototype.slice.call(document.querySelectorAll(".narr-title-row__btn[data-country]"));

  var SVGNS = "http://www.w3.org/2000/svg";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var isMobile = window.matchMedia("(max-width: 640px)");

  // ---------- tiny pixel flags (simplified icons) ----------
  function star(cx, cy, R, r, rot) {
    var pts = [];
    for (var i = 0; i < 10; i++) {
      var a = rot + (Math.PI / 5) * i;
      var rad = i % 2 === 0 ? R : r;
      pts.push((cx + rad * Math.cos(a)).toFixed(2) + "," + (cy + rad * Math.sin(a)).toFixed(2));
    }
    return '<polygon points="' + pts.join(" ") + '" fill="#ffde00"/>';
  }

  var FLAGS = {
    "japan":
      '<rect width="30" height="20" fill="#fff"/><circle cx="15" cy="10" r="6" fill="#d7143a"/>',
    "china":
      '<rect width="30" height="20" fill="#de2910"/>' +
      star(6, 6, 3.8, 1.6, -Math.PI / 2) +
      '<rect x="12" y="2" width="1.6" height="1.6" fill="#ffde00"/><rect x="14" y="4.4" width="1.6" height="1.6" fill="#ffde00"/>' +
      '<rect x="14" y="7.4" width="1.6" height="1.6" fill="#ffde00"/><rect x="12" y="9.6" width="1.6" height="1.6" fill="#ffde00"/>',
    "south-korea":
      '<rect width="30" height="20" fill="#fff"/>' +
      '<path d="M10 10a5 5 0 0 1 10 0z" fill="#cd2e3a"/><path d="M20 10a5 5 0 0 1-10 0z" fill="#0047a0"/>' +
      '<g fill="#000"><g transform="rotate(-34 5 4)"><rect x="2" y="2" width="6" height="1"/><rect x="2" y="4" width="6" height="1"/><rect x="2" y="6" width="6" height="1"/></g>' +
      '<g transform="rotate(34 25 4)"><rect x="22" y="2" width="6" height="1"/><rect x="22" y="4" width="6" height="1"/><rect x="22" y="6" width="6" height="1"/></g>' +
      '<g transform="rotate(34 5 16)"><rect x="2" y="13" width="6" height="1"/><rect x="2" y="15" width="6" height="1"/><rect x="2" y="17" width="6" height="1"/></g>' +
      '<g transform="rotate(-34 25 16)"><rect x="22" y="13" width="6" height="1"/><rect x="22" y="15" width="6" height="1"/><rect x="22" y="17" width="6" height="1"/></g></g>',
    "united-states":
      '<rect width="30" height="20" fill="#fff"/>' +
      '<g fill="#b22234"><rect y="0" width="30" height="2.86"/><rect y="5.71" width="30" height="2.86"/><rect y="11.43" width="30" height="2.86"/><rect y="17.14" width="30" height="2.86"/></g>' +
      '<rect width="13" height="11.4" fill="#3c3b6e"/>' +
      '<g fill="#fff"><rect x="2" y="2" width="1.2" height="1.2"/><rect x="5" y="2" width="1.2" height="1.2"/><rect x="8" y="2" width="1.2" height="1.2"/>' +
      '<rect x="3.5" y="4.8" width="1.2" height="1.2"/><rect x="6.5" y="4.8" width="1.2" height="1.2"/><rect x="9.5" y="4.8" width="1.2" height="1.2"/>' +
      '<rect x="2" y="7.6" width="1.2" height="1.2"/><rect x="5" y="7.6" width="1.2" height="1.2"/><rect x="8" y="7.6" width="1.2" height="1.2"/></g>',
    "singapore":
      '<rect width="30" height="10" fill="#ed2939"/><rect y="10" width="30" height="10" fill="#fff"/>' +
      '<circle cx="7" cy="5" r="3.6" fill="#fff"/><circle cx="8.6" cy="5" r="3.2" fill="#ed2939"/>' +
      '<g fill="#fff"><rect x="10.4" y="2.2" width="1.2" height="1.2"/><rect x="12.4" y="3.8" width="1.2" height="1.2"/><rect x="11.8" y="6.2" width="1.2" height="1.2"/>' +
      '<rect x="9.4" y="6.6" width="1.2" height="1.2"/><rect x="9" y="3.6" width="1.2" height="1.2"/></g>'
  };

  function flagHTML(id) {
    return '<svg class="flag" viewBox="0 0 30 20" shape-rendering="crispEdges" aria-hidden="true" focusable="false">' + FLAGS[id] + "</svg>";
  }

  // ---------- pixel land map ----------
  // Simplified shapes in percent of the DESKTOP map (x, y). They are turned into square pixels.
  // This shows direction only (China west, Korea/Japan north-east, Singapore south-west, USA far east).
  var LAND = [
    { fill: "land", pts: [[0,0],[50,0],[52,8],[48,14],[44,20],[43,28],[39,34],[41,40],[37,48],[34,56],[32,64],[34,72],[30,78],[27,82],[26,70],[24,62],[20,56],[14,52],[8,50],[0,50]] },         // mainland Asia (China, Southeast Asia)
    { fill: "land", pts: [[56,8],[61,8],[61,22],[58,26],[56,20]] },                                                                                                                      // Korean peninsula
    { fill: "land", pts: [[71,12],[75,10],[80,18],[78,30],[73,36],[69,34],[73,24]] },                                                                                                    // Japan
    { fill: "land", pts: [[46,42],[49,42],[49,52],[46,52]] },                                                                                                                            // Taiwan
    { fill: "land", pts: [[36,70],[44,68],[46,78],[40,84],[34,78]] },                                                                                                                    // Borneo
    { fill: "land", pts: [[86,28],[100,28],[100,84],[92,80],[88,66],[88,50],[86,40]] },                                                                                                  // west coast of the USA
    { fill: "ph",   pts: [[48,46],[53,46],[53,56],[50,58],[48,54]] },                                                                                                                    // Luzon
    { fill: "ph",   pts: [[50,62],[57,62],[57,66],[50,66]] },                                                                                                                            // Visayas
    { fill: "ph",   pts: [[52,70],[58,70],[58,79],[53,79]] }                                                                                                                             // Mindanao
  ];

  function inside(x, y, pts) {
    var c = false;
    for (var i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      var xi = pts[i][0], yi = pts[i][1], xj = pts[j][0], yj = pts[j][1];
      if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
    }
    return c;
  }

  // Square pixels of ~16px, drawn as merged horizontal runs (one <path> per color)
  function drawLand(w, h) {
    var cell = w < 520 ? 12 : 16;
    var cols = Math.ceil(w / cell), rows = Math.ceil(h / cell);
    var paths = { land: "", ph: "" };
    for (var r = 0; r < rows; r++) {
      var runKind = null, runStart = 0;
      for (var c = 0; c <= cols; c++) {
        var kind = null;
        if (c < cols) {
          var px = ((c + 0.5) / cols) * 100, py = ((r + 0.5) / rows) * 100;
          for (var k = 0; k < LAND.length; k++) {
            if (inside(px, py, LAND[k].pts)) { kind = LAND[k].fill; if (kind === "ph") break; }
          }
        }
        if (kind !== runKind) {
          if (runKind) paths[runKind] += "M" + runStart * cell + " " + r * cell + "h" + (c - runStart) * cell + "v" + cell + "h-" + (c - runStart) * cell + "z";
          runKind = kind; runStart = c;
        }
      }
    }
    landSvg.setAttribute("viewBox", "0 0 " + w + " " + h);
    landSvg.innerHTML =
      '<path class="land" d="' + paths.land + '"/>' +
      '<path class="land land--ph" d="' + paths.ph + '"/>';
  }

  // ---------- connection lines (from the Philippines to each marker) ----------
  var lineEls = {};
  function center(el) { return { x: el.offsetLeft, y: el.offsetTop }; }  // markers are centered on left/top

  function drawLines(w, h) {
    linesSvg.setAttribute("viewBox", "0 0 " + w + " " + h);
    var from = center(hub);
    nodes.forEach(function (n) {
      var id = n.dataset.id, to = center(n);
      var l = lineEls[id];
      if (!l) {
        l = document.createElementNS(SVGNS, "line");
        l.setAttribute("class", "line");
        l.dataset.id = id;
        linesSvg.appendChild(l);
        lineEls[id] = l;
      }
      l.setAttribute("x1", from.x); l.setAttribute("y1", from.y);
      l.setAttribute("x2", to.x);   l.setAttribute("y2", to.y);
    });
    // keep the active line on top
    var active = linesSvg.querySelector(".is-active");
    if (active) linesSvg.appendChild(active);
  }

  function redraw() {
    var w = map.clientWidth, h = map.clientHeight;
    if (!w || !h) return;
    drawLand(w, h);
    drawLines(w, h);
  }

  // ---------- selection ----------
  var seen = {};
  var current = null;

  function setCount() {
    countEl.textContent = "Explored " + Object.keys(seen).length + " / " + ORDER.length;
  }

  // The shared narration panel belongs to the country it was opened from: close it when the map moves to
  // another country or back to the overview. Returns where focus should go back to (or false if nothing was open).
  function closeNarration() {
    var open = document.querySelector(".detail .narr-trigger[aria-expanded='true']");
    if (!open || !window.AtlasNarration) return false;
    var prev = document.activeElement;
    AtlasNarration.close();
    return { back: prev && prev !== document.body && !prev.closest(".narr-panel") ? prev : null };
  }
  function restoreFocus(closed) {
    if (!closed) return;
    var back = closed.back && closed.back.offsetParent !== null ? closed.back : (current ? picker.querySelector(".is-active") : hub);
    if (back) back.focus({ preventScroll: true });
  }

  function showOverview() {
    var closed = closeNarration();
    current = null;
    nodes.forEach(function (n) { n.classList.remove("is-active"); n.setAttribute("aria-pressed", "false"); });
    Array.prototype.forEach.call(picker.children, function (b) { b.setAttribute("aria-pressed", "false"); b.classList.remove("is-active"); });
    Object.keys(lineEls).forEach(function (id) { lineEls[id].classList.remove("is-active"); });
    map.classList.remove("has-active");
    body.hidden = true;
    overview.hidden = false;
    resetBtn.hidden = true;
    restoreFocus(closed);
  }

  function selectCountry(id, opts) {
    var data = COUNTRIES[id];
    if (!data) return;
    var closed = id !== current ? closeNarration() : false;
    current = id;
    seen[id] = true;

    nodes.forEach(function (n) {
      var on = n.dataset.id === id;
      n.classList.toggle("is-active", on);
      n.classList.toggle("is-seen", !!seen[n.dataset.id]);
      n.setAttribute("aria-pressed", String(on));
    });
    Array.prototype.forEach.call(picker.children, function (b) {
      var on = b.dataset.id === id;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", String(on));
    });
    Object.keys(lineEls).forEach(function (k) { lineEls[k].classList.toggle("is-active", k === id); });
    linesSvg.appendChild(lineEls[id]);
    map.classList.add("has-active");

    narrMounts.forEach(function (m) { m.hidden = m.dataset.country !== id; });
    flagSlot.innerHTML = flagHTML(id);
    nameEl.textContent = data.name;
    catEl.textContent = data.category;
    textEl.textContent = data.text;

    keysEl.innerHTML = "";
    data.keys.forEach(function (k) {
      var li = document.createElement("li");
      li.textContent = k;
      keysEl.appendChild(li);
    });

    setCount();
    overview.hidden = true;
    body.hidden = false;
    resetBtn.hidden = false;
    restoreFocus(closed);

    // On phones the panel sits below the map: scroll just enough to show it
    if (isMobile.matches && !(opts && opts.noScroll)) {
      detail.scrollIntoView({ block: "nearest", behavior: reduceMotion.matches ? "auto" : "smooth" });
    }
  }

  // ---------- build the markers' flags + the country switcher ----------
  nodes.forEach(function (n) {
    n.querySelector(".node__flag").innerHTML = flagHTML(n.dataset.id);
    // clicking the selected country again goes back to the overview
    n.addEventListener("click", function () {
      if (current === n.dataset.id) showOverview(); else selectCountry(n.dataset.id);
    });
  });

  ORDER.forEach(function (id) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "picker__btn";
    b.dataset.id = id;
    b.setAttribute("aria-pressed", "false");
    b.innerHTML = flagHTML(id) + "<span>" + COUNTRIES[id].name + "</span>";
    b.addEventListener("click", function () { selectCountry(id, { noScroll: true }); });
    picker.appendChild(b);
  });

  hub.addEventListener("click", showOverview);
  resetBtn.addEventListener("click", showOverview);
  // (Esc is already used by shared/js/nav.js to go back to the Atlas Menu, so it is not used here.)

  // ---------- start ----------
  redraw();
  if (window.ResizeObserver) new ResizeObserver(redraw).observe(map); else window.addEventListener("resize", redraw);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(redraw);  // node sizes can change when the fonts load
  setCount();

  // Deep link: my-globalization-map/index.html#japan opens that country
  var hash = decodeURIComponent(location.hash.slice(1));
  if (COUNTRIES[hash]) selectCountry(hash, { noScroll: true });
})();


// =====================================================================================
// NARRATION CONFIGS — the five buttons beside the country title. EDIT THE VALUES HERE.
// All five open the SAME shared panel (shared/js/narration.js); only these values change.
//   label             -> text on the button beside the title
//   title             -> NARRATION TITLE shown at the top of the panel
//   image             -> CHARACTER IMAGE PATH (relative to project root), e.g. "assets/images/characters/jaymark-vicente.png"
//   showPartIndicator -> PART INDICATOR: true shows "Part 1 of N" (N = number of items in parts below); false hides it for a single clip
//   parts[].audio     -> AUDIO FILE PATH (relative to project root), e.g. "assets/audio/my-globalization-map/clip.mp3"
//   parts[].transcript-> TRANSCRIPT text shown in the panel (blank line = new paragraph)
// Empty values are fine: the panel opens with placeholders ("Audio not added yet", etc.) and never autoplays.
// Need more clips for one narration? Add more { audio, transcript } objects to its parts array
// and the panel shows "Part 1 of 2", "Part 2 of 2", and so on.
// A country's button shows beside the title once that country is selected on the map (or in the country switcher).
// =====================================================================================
const MAP_NARRATIONS = [

  // ---------- 1. CHINA: TRADE AND PRODUCTS ----------
  {
    mountId: "chinaNarrationMount",
    label: "Listen to China",
    title: "China — Trade and Products",
    image: "",
    showPartIndicator: true,
    parts: [
      { audio: "", transcript: "" }
    ]
  },

  // ---------- 2. SOUTH KOREA: ENTERTAINMENT AND CULTURE ----------
  {
    mountId: "southKoreaNarrationMount",
    label: "Listen to South Korea",
    title: "South Korea — Entertainment and Culture",
    image: "",
    showPartIndicator: true,
    parts: [
      { audio: "", transcript: "" }
    ]
  },

  // ---------- 3. JAPAN: INFRASTRUCTURE AND TECHNOLOGY ----------
  {
    mountId: "japanNarrationMount",
    label: "Listen to Japan",
    title: "Japan — Infrastructure and Technology",
    image: "",
    showPartIndicator: true,
    parts: [
      { audio: "", transcript: "" }
    ]
  },

  // ---------- 4. UNITED STATES: BUSINESS, EDUCATION, AND TECHNOLOGY ----------
  {
    mountId: "unitedStatesNarrationMount",
    label: "Listen to the United States",
    title: "United States — Business, Education, and Technology",
    image: "",
    showPartIndicator: true,
    parts: [
      { audio: "", transcript: "" }
    ]
  },

  // ---------- 5. SINGAPORE: JOBS, INVESTMENT, AND BUSINESS ----------
  {
    mountId: "singaporeNarrationMount",
    label: "Listen to Singapore",
    title: "Singapore — Jobs, Investment, and Business",
    image: "",
    showPartIndicator: true,
    parts: [
      { audio: "", transcript: "" }
    ]
  }
];

// Builds the five buttons. Nothing to edit below this line.
MAP_NARRATIONS.forEach(function (n) {
  AtlasNarration.create(Object.assign({}, n, { mount: document.getElementById(n.mountId) }));
});
