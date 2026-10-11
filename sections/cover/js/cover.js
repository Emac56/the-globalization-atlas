// COVER (Page 1) — script for this page only

// 1) Twinkling sparkles
const sparkleBox = document.getElementById("sparkles");
for (let i = 0; i < 14; i++) {
  const s = document.createElement("span");
  s.className = "sparkle";
  s.style.left = Math.random() * 100 + "%";
  s.style.top = Math.random() * 100 + "%";
  s.style.animationDelay = Math.random() * 3 + "s";
  sparkleBox.appendChild(s);
}

// 2) Start button
// Path ay relative sa root index.html (ito ang cover page)
const NEXT_PAGE = "sections/menu/index.html";

document.getElementById("startBtn").addEventListener("click", () => {
  if (NEXT_PAGE) window.location.href = NEXT_PAGE;
});






// 3) NARRATOR INTRO (prototype)
// A stationary pixel character + dialogue box, voiced with the browser's built-in
// speechSynthesis (no API keys, no paid services).
//
// How overlapping speech is prevented:
//  - Only ONE utterance exists at a time. Every speak() / skip first cancels the previous one.
//  - Every speak() and every cancel increases `token`. onstart / onend / onerror remember the
//    token they were created with and do nothing if it is no longer current ("stale" events,
//    e.g. the "canceled" error the browser fires after Skip).
//  - Continue / Replay stay disabled while a line is starting or playing.
(function () {
  "use strict";

  var LINES = [
    "Welcome to My Globalization Atlas!",
    "Here, we will explore how the Philippines connects with different countries around the world.",
    "Discover the connections through technology, trade, culture, business, and other aspects of globalization.",
    "Click my character anytime to learn more about this project. Let's begin exploring!"
  ];
  var ABOUT = "This project shows how countries connect through globalization, including trade, technology, culture, and international cooperation.";

  var $ = function (id) { return document.getElementById(id); };
  var charBtn = $("charBtn"), sprite = $("charSprite");
  var textEl = $("dialogText"), progressEl = $("dialogProgress"), doneTag = $("dialogDone");
  var statusEl = $("narrStatusText"), speakerEl = $("speaker");
  var continueBtn = $("continueBtn"), skipBtn = $("skipBtn"), replayBtn = $("replayBtn"), exploreBtn = $("exploreBtn");
  var introBtns = $("introBtns"), doneBtns = $("doneBtns");

  // ---------- pixel character (16 x 16, head + upper body) ----------
  var PALETTE = {
    K: "#1a1233", H: "#5a3a28", h: "#8a5e3f", S: "#ffd2a8", s: "#f0a878",
    E: "#1a1233", P: "#ff8fa3", M: "#c0392b", B: "#4fd8ff", b: "#2a8fc0", Y: "#ffd24a"
  };
  var SPRITE = [
    "....KKKKKKKK....",
    "...KHHHHHHHHK...",
    "..KHHhhHHHHHHK..",
    "..KHHHHHHHHHHK..",
    "..KHSSHHHHSSHK..",
    "..KSSSSSSSSSSK..",
    "..KSEESSSSEESK..",
    "..KSEESSSSEESK..",
    "..KSPSSSSSSPSK..",
    "..KSSSSMMSSSSK..",
    "...KSSSSSSSSK...",
    "....KKSSSSKK....",
    "..KKBBBBBBBBKK..",
    ".KBBBBBYYBBBBBK.",
    "KBBBbBBYYBBbBBBK",
    "KBBBBBBBBBBBBBBK"
  ];
  (function drawSprite() {
    var rects = "";
    SPRITE.forEach(function (row, y) {
      for (var x = 0; x < row.length; x++) {
        var c = PALETTE[row[x]];
        if (c) rects += '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="' + c + '"/>';
      }
    });
    sprite.innerHTML = rects;
  })();

  // ---------- speech engine (one utterance at a time) ----------
  var synth = window.speechSynthesis;
  var hasTTS = !!(synth && window.SpeechSynthesisUtterance);
  var token = 0;             // changes on every speak/cancel: older events are ignored
  var timers = [];
  var currentUtter = null;   // kept in a variable so the browser does not garbage-collect it mid-speech

  // "idle" | "starting" | "playing" | "finished" | "failed" | "blocked" | "stopped"
  var lineState = "idle";

  function clearTimers() { timers.forEach(clearTimeout); timers = []; }

  function cancelSpeech() {
    token++;
    clearTimers();
    currentUtter = null;
    if (hasTTS) { try { synth.cancel(); } catch (e) {} }
  }

  function speak(text) {
    cancelSpeech();
    var my = token;
    if (!hasTTS) { setLineState("failed"); return; }
    setLineState("starting");

    // Short pause after cancel(): some browsers drop a speak() that comes right after cancel()
    timers.push(setTimeout(function () {
      if (my !== token) return;
      var u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US";
      u.rate = 0.95;
      u.pitch = 1.1;
      u.onstart = function () {
        if (my !== token) return;
        setLineState("playing");
        // Safety net: some browsers never fire "end" for a finished voice
        timers.push(setTimeout(function () { if (my === token) setLineState("finished"); }, 6000 + text.length * 120));
      };
      u.onend = function () { if (my === token) { clearTimers(); setLineState("finished"); } };
      u.onerror = function (e) {
        if (my !== token) return;
        clearTimers();
        setLineState(e && e.error === "not-allowed" ? "blocked" : "failed");
      };
      currentUtter = u;
      try { synth.speak(u); } catch (err) { setLineState("failed"); return; }

      // If the browser never starts speaking (no voice / blocked), keep the page usable
      timers.push(setTimeout(function () {
        if (my === token && lineState === "starting") { cancelSpeech(); setLineState("failed"); }
      }, 4000));
    }, 60));
  }

  // ---------- UI state ----------
  var mode = "intro";   // "intro" | "done"
  var index = 0;

  var STATUS = {
    idle: "Ready",
    starting: "Starting narration…",
    playing: "Narration playing",
    finished: "Narration finished",
    stopped: "Narration stopped",
    failed: hasTTS ? "Voice unavailable. Read the text and continue." : "Voice is not supported in this browser. Read the text and continue.",
    blocked: "Your browser blocked the voice. Press Replay voice, or just read and continue."
  };

  function setLineState(s) {
    lineState = s;
    var busy = s === "starting" || s === "playing";
    statusEl.textContent = STATUS[s];
    speakerEl.classList.toggle("is-on", s === "playing");
    continueBtn.disabled = busy;                        // cannot continue while a line is speaking
    replayBtn.disabled = busy || !hasTTS;
    if (mode === "done") { introBtns.hidden = true; doneBtns.hidden = false; }
  }

  function showLine(i) {
    index = i;
    textEl.textContent = LINES[i];
    progressEl.textContent = "Line " + (i + 1) + " of " + LINES.length;
    continueBtn.textContent = i === LINES.length - 1 ? "Finish" : "Continue";
    speak(LINES[i]);
  }

  function complete(wasSkipped) {
    cancelSpeech();                // nothing from the intro may keep talking
    mode = "done";
    introBtns.hidden = true;
    doneBtns.hidden = false;
    doneTag.hidden = false;
    progressEl.textContent = wasSkipped ? "Skipped" : "Done";
    textEl.textContent = "Click my character anytime to learn more about this project. Press Start Exploring when you are ready.";
    lineState = "stopped";
    statusEl.textContent = STATUS.stopped;
    speakerEl.classList.remove("is-on");
    exploreBtn.focus();            // the button that had focus is now hidden
  }

  continueBtn.addEventListener("click", function () {
    if (mode !== "intro" || continueBtn.disabled) return;
    if (index >= LINES.length - 1) complete(false); else showLine(index + 1);
  });

  skipBtn.addEventListener("click", function () {
    if (mode !== "intro") return;
    complete(true);
  });

  replayBtn.addEventListener("click", function () {
    if (mode !== "intro" || replayBtn.disabled) return;
    speak(LINES[index]);
  });

  // Clicking the character: nothing happens while the intro is running;
  // after the intro it shows (and speaks) the short project explanation.
  charBtn.addEventListener("click", function () {
    if (mode !== "done") return;
    if (lineState === "starting" || lineState === "playing") return;   // no duplicate speech
    textEl.textContent = ABOUT;
    progressEl.textContent = "About";
    speak(ABOUT);
  });

  // Start Exploring uses the same destination as the existing Start Atlas button
  exploreBtn.addEventListener("click", function () {
    cancelSpeech();
    if (NEXT_PAGE) window.location.href = NEXT_PAGE;
  });
  document.getElementById("startBtn").addEventListener("click", cancelSpeech);

  // Leaving the page must stop the voice
  window.addEventListener("pagehide", cancelSpeech);

  // ---------- start ----------
  showLine(0);
})();
