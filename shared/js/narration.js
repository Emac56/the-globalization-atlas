// SHARED CHARACTER NARRATION — one reusable component for every section.
// Each page supplies its own config; nothing section-specific lives in here.
//
//   AtlasNarration.create({
//     mount:    document.getElementById("narrationMount"),   // where the button goes
//     narrator: "jaymark-vicente",                           // key of CHARACTERS below
//     label:    "Listen to Introduction",                    // optional button text
//     title:    "Introduction",                              // section title, shown in every part
//     parts: [                                               // one or more clips
//       { audio: "assets/audio/section/clip-jaymark-vicente.mp3", transcript: "..." }
//     ],
//     finalAction: { label: "Start Exploring", onClick: fn }  // optional: replaces Continue/Skip on the last part
//   });
//
// Audio paths are relative to the project root. A single clip may use { audio, transcript } instead of parts.
// Narration never autoplays: the user always presses Play.
(function () {
  "use strict";

  // Single character mapping. Preferred folder: assets/images/characters/
  var IMAGE_DIR = "assets/images/characters/";
  var CHARACTERS = {
    "jaymark-vicente":   { name: "Jaymark Vicente",   file: "jaymark-vicente.png" },
    "jaymark-catinggan": { name: "Jaymark Catinggan", file: "jaymark-catinggan.png" },
    "kayzer-leopando":   { name: "Kayzer Leopando",   file: "kayzer-leopando.png" },
    "rey-dela-cruz":     { name: "Rey Dela Cruz",     file: "rey-dela-cruz.png" },
    "richard-mayundang": { name: "Richard Mayundang", file: "richard-mayundang.png" }
  };

  // Project root, worked out from this script's own URL (shared/js/narration.js -> ../../)
  // so paths work from the cover and from sections/xx/index.html alike.
  var script = document.currentScript;
  var ROOT = script && script.src ? new URL("../../", script.src).href : "";

  var panel = null;       // one shared panel for the whole page
  var ui = null;          // its elements
  var openTrigger = null;
  var cfg = null;         // config of the narration that is currently open
  var parts = [];
  var index = 0;
  var audio = null;       // the ONE current Audio object (never more than one)
  var state = "idle";     // idle | playing | paused | finished | missing

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }
  function btn(label, extra) {
    var b = el("button", "pixel-btn narr-panel__btn" + (extra ? " " + extra : ""), label);
    b.type = "button";
    return b;
  }

  // ---------- audio (one clip at a time) ----------
  function stopAudio() {
    if (audio) {
      var a = audio;
      audio = null;                 // handlers of the old clip see they are stale and do nothing
      a.onended = a.onerror = a.onplaying = null;
      try { a.pause(); } catch (e) {}
      a.removeAttribute("src");
    }
  }

  function loadClip() {
    stopAudio();
    var part = parts[index];
    if (!part || !part.audio) { setState("missing"); return; }
    var a = new Audio();
    audio = a;
    a.preload = "metadata";
    a.onended = function () { if (a === audio) setState("finished"); };
    a.onerror = function () { if (a === audio) setState("missing"); };
    a.src = ROOT + part.audio;
    setState("idle");
  }

  function play(fromStart) {
    if (!audio || state === "missing") return;
    var a = audio;
    if (fromStart || state === "finished") a.currentTime = 0;
    var p;
    try { p = a.play(); } catch (e) { p = null; }
    setState("playing");
    if (p && p.catch) {
      p.catch(function () { if (a === audio) setState("missing"); });
    }
  }

  function pause() {
    if (audio && state === "playing") {
      audio.pause();
      setState("paused");
    }
  }

  // ---------- UI state ----------
  var STATUS = {
    idle: "Press Play to listen.",
    playing: "Playing…",
    paused: "Paused.",
    finished: "Audio finished.",
    missing: "Audio file not found. You can still read the transcript."
  };

  function setState(s) {
    state = s;
    if (!ui) return;
    ui.status.textContent = STATUS[s];
    ui.playBtn.textContent = s === "playing" ? "Pause" : (s === "paused" ? "Resume" : "Play");
    ui.playBtn.disabled = s === "missing";
    ui.replayBtn.disabled = s === "missing";
  }

  function showPart(i) {
    index = i;
    var last = index === parts.length - 1;
    ui.text.textContent = "\u201C" + (parts[index].transcript || "") + "\u201D";
    ui.progress.textContent = parts.length > 1 ? "Part " + (index + 1) + " of " + parts.length : "";   // total = number of parts in the config
    ui.nextRow.hidden = last || parts.length < 2;
    ui.finalBtn.hidden = !(last && cfg.finalAction);
    if (cfg.finalAction) ui.finalBtn.textContent = cfg.finalAction.label || "Continue";
    loadClip();
  }

  function next() {
    if (index < parts.length - 1) showPart(index + 1);   // exactly one part forward
  }

  // ---------- panel ----------
  function buildPanel() {
    panel = el("section", "narr-panel");
    panel.hidden = true;
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Character narration");

    var charBox = el("div", "narr-panel__char");
    var img = el("img", "narr-panel__img");
    img.alt = "";
    var fallback = el("p", "narr-panel__fallback");
    fallback.hidden = true;
    img.addEventListener("error", function () { img.hidden = true; fallback.hidden = false; });
    img.addEventListener("load", function () { img.hidden = false; fallback.hidden = true; });
    charBox.appendChild(img);
    charBox.appendChild(fallback);

    var box = el("div", "narr-panel__box pixel-box");
    var top = el("div", "narr-panel__top");
    var heading = el("p", "narr-panel__name");
    var progress = el("span", "narr-panel__progress");
    var close = el("button", "pixel-btn narr-panel__close", "Close");
    close.type = "button";
    var title = el("div", "narr-panel__title");
    title.appendChild(heading);
    title.appendChild(progress);
    top.appendChild(title);
    top.appendChild(close);

    var text = el("p", "narr-panel__text");
    var status = el("p", "narr-panel__status");
    status.setAttribute("role", "status");

    var controls = el("div", "narr-panel__btns");
    var playBtn = btn("Play");
    var replayBtn = btn("Replay", "narr-panel__btn--ghost");
    controls.appendChild(playBtn);
    controls.appendChild(replayBtn);

    var nextRow = el("div", "narr-panel__btns");
    var continueBtn = btn("Continue");
    var skipBtn = btn("Skip", "narr-panel__btn--ghost");
    nextRow.appendChild(continueBtn);
    nextRow.appendChild(skipBtn);

    var finalBtn = btn("Start Exploring", "narr-panel__btn--go");
    finalBtn.hidden = true;

    box.appendChild(top);
    box.appendChild(text);
    box.appendChild(status);
    box.appendChild(controls);
    box.appendChild(nextRow);
    box.appendChild(finalBtn);

    panel.appendChild(charBox);
    panel.appendChild(box);
    document.body.appendChild(panel);

    ui = { img: img, fallback: fallback, heading: heading, progress: progress, text: text, status: status,
           playBtn: playBtn, replayBtn: replayBtn, nextRow: nextRow, finalBtn: finalBtn, close: close };

    close.addEventListener("click", closePanel);
    playBtn.addEventListener("click", function () {
      if (state === "playing") pause(); else play(false);
    });
    replayBtn.addEventListener("click", function () { play(true); });
    continueBtn.addEventListener("click", next);
    skipBtn.addEventListener("click", next);
    finalBtn.addEventListener("click", function () {
      var action = cfg && cfg.finalAction;
      stopAudio();
      if (action && action.onClick) action.onClick();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !panel.hidden) closePanel();
    });
    window.addEventListener("pagehide", stopAudio);
  }

  function openPanel(config, trigger) {
    if (!panel) buildPanel();
    cfg = config;
    parts = config.parts || (config.transcript ? [{ audio: config.audio, transcript: config.transcript }] : []);
    if (!parts.length) return;

    var ch = CHARACTERS[config.narrator];
    var displayName = ch ? ch.name : "Narrator";
    ui.heading.textContent = config.title || displayName;   // section title; narrator name if none given
    ui.fallback.textContent = displayName;
    ui.img.alt = displayName;
    ui.fallback.hidden = true;
    ui.img.hidden = false;
    if (ch) {
      ui.img.src = ROOT + IMAGE_DIR + ch.file;   // missing file -> error handler shows the name instead
    } else {
      ui.img.removeAttribute("src");
      ui.img.hidden = true;
      ui.fallback.hidden = false;
    }

    openTrigger = trigger;
    trigger.setAttribute("aria-expanded", "true");
    panel.hidden = false;
    showPart(0);               // always starts at Part 1, paused: no autoplay
    ui.close.focus();
  }

  function closePanel() {
    if (!panel || panel.hidden) return;
    stopAudio();
    panel.hidden = true;
    index = 0;
    if (openTrigger) {
      openTrigger.setAttribute("aria-expanded", "false");
      openTrigger.focus();
      openTrigger = null;
    }
  }

  function create(config) {
    if (!config || !config.mount) return null;
    var b = el("button", "pixel-btn narr-trigger");
    b.type = "button";
    b.setAttribute("aria-expanded", "false");

    // small pixel speaker icon
    var NS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "narr-trigger__icon");
    svg.setAttribute("viewBox", "0 0 8 8");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    svg.setAttribute("shape-rendering", "crispEdges");
    [[0,3,2,2],[2,2,1,4],[3,1,1,6],[5,3,1,2],[6,2,1,4]].forEach(function (r) {
      var rect = document.createElementNS(NS, "rect");
      rect.setAttribute("x", r[0]); rect.setAttribute("y", r[1]);
      rect.setAttribute("width", r[2]); rect.setAttribute("height", r[3]);
      rect.setAttribute("fill", "#12306e");
      svg.appendChild(rect);
    });
    b.appendChild(svg);
    b.appendChild(document.createTextNode(config.label || "Listen to Narration"));

    b.addEventListener("click", function () { openPanel(config, b); });
    config.mount.appendChild(b);
    return b;
  }

  window.AtlasNarration = { create: create, close: closePanel };
})();
