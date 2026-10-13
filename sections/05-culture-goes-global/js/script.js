// CULTURE GOES GLOBAL — script for this page only.
// Bottom navigation is built by shared/js/nav.js.
// This file handles (1) the interactive Culture Connection Map, (2) missing photos, and
// (3) the 12 narration buttons (configs: CULTURE_NARRATIONS at the bottom of this file).

// ---------------------------------------------------------------------------
// CULTURE CONNECTION MAP — interactive journey
// Edit the explanations in STAGES. Stage names come from the HTML (.flow__text).
// ---------------------------------------------------------------------------
(function () {
  "use strict";

  const map = document.querySelector("[data-flow-map]");
  if (!map) return;

  // text = explanation shown when the stage is selected.
  // img/alt/search = the photo for that stage (save it in assets/images/culture-goes-global/).
  // source = the webpage where the photo came from (opens in a new tab from the photo and "Photo Source" link).
  const DIR = "../../assets/images/culture-goes-global/";
  const STAGES = [
    { text: "K-pop began here. Its early groups emerged in South Korea in the 1990s.",
      img: "map-south-korea.webp", alt: "A street or skyline scene in South Korea", search: "Seoul South Korea city skyline",
      source: "https://www.dreamstime.com/downtown-seoul-city-skyline-cityscape-south-korea-asia-sunset-image255413640" },
    { text: "K-pop pairs music with dance, so songs come with performances that fans can watch and learn.",
      img: "map-kpop-music-dance.avif", alt: "K-pop dancers performing choreography", search: "K-pop group dance choreography performance",
      source: "https://www.elitedaily.com/p/bts-black-swan-dance-practice-video-lets-jimins-man-bun-shine-21784383" },
    { text: "Digital music and platforms such as YouTube helped K-pop reach audiences worldwide.",
      img: "map-internet-youtube.jpg", alt: "A person watching K-pop videos on a phone or laptop", search: "person watching music video on phone YouTube",
      source: "https://www.redpillrebellion.com/daily-success-habits/man-watching-youtube-on-his-cell-phone/" },
    { text: "Korean popular culture became influential in the Philippines through media and entertainment.",
      img: "map-filipino-fans.webp", alt: "Filipino fans enjoying Korean entertainment", search: "Filipino K-pop fans Philippines",
      source: "https://www.aljazeera.com/opinions/2021/10/10/k-pop-fans-vs-dutertes-philippines-why-young-voters-want-change" },
    { text: "Filipino fans joined K-pop communities, attended events, and performed dance covers. In 2023, 13 groups competed in a cover-dance festival in Manila.",
      img: "map-fan-events.jpg", alt: "Filipino dance cover group performing at a fan event", search: "Philippines K-pop dance cover event Manila",
      source: "https://phil.korean-culture.org/en/338/board/153/read/130877" }
  ];

  const DWELL = 2800;   // ms spent on each stage while the animation plays
  const TRAVEL = 1500;  // ms for the glowing dot to travel to the next stage

  const nodes = Array.from(map.querySelectorAll(".flow__node"));
  const links = Array.from(map.querySelectorAll(".flow__arrow"));
  const buttons = nodes.map((n) => n.querySelector(".flow__btn"));
  const titles = nodes.map((n) => n.querySelector(".flow__text").textContent.trim());
  const total = Math.min(nodes.length, STAGES.length);

  const exploreBtn = map.querySelector("#flowExplore");
  const stageEl = map.querySelector("#flowStage");
  const bars = Array.from(map.querySelectorAll(".flow__bar i"));
  const panel = map.querySelector("#flowPanel");
  const panelTitle = map.querySelector("#flowPanelTitle");
  const panelText = map.querySelector("#flowPanelText");
  const home = map.querySelector("[data-flow-home]");
  const announce = map.querySelector("#flowAnnounce");
  const shotFrame = map.querySelector("#flowShotFrame");
  const shotImg = map.querySelector("#flowShotImg");
  const shotSearch = map.querySelector("#flowShotSearch");
  const shotFile = map.querySelector("#flowShotFile");
  const shotLink = map.querySelector("#flowShotLink");
  const sourceLink = map.querySelector("#flowSourceLink");
  // Narration buttons for stages 1-5 sit beside the panel title; only the selected stage's button is visible.
  const narrMounts = Array.from(map.querySelectorAll(".flow__panel-body .narr-title-row__btn"));

  // The shared narration panel belongs to the stage it was opened from: close it when the map moves to another stage.
  function closeMapNarration() {
    const open = document.querySelector('.narr-trigger[aria-expanded="true"]');
    if (!open || !map.contains(open) || !window.AtlasNarration) return false;
    AtlasNarration.close();
    return true;
  }

  const mobileMQ = window.matchMedia("(max-width: 860px)");
  const motionMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
  const reduced = () => motionMQ.matches;

  let current = 0;       // selected stage (0-based)
  let shown = -1;        // stage currently written in the panel
  let mode = "idle";     // "idle" | "playing"
  let elapsed = 0;       // ms on the animation timeline
  let last = 0;
  let raf = 0;

  const ease = (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);

  /* ----- drawing ----- */
  function paint(cur, travelIdx, frac) {
    links.forEach((el, j) => {
      const p = j < cur ? 1 : j === travelIdx ? ease(frac) : 0;
      el.style.setProperty("--p", p.toFixed(4));
      el.classList.toggle("is-done", j < cur);
      el.classList.toggle("is-next", j === cur);
      el.classList.toggle("is-travelling", j === travelIdx && !reduced());
    });
    nodes.forEach((n, i) => {
      n.classList.toggle("is-visited", i < cur);
      n.classList.toggle("is-active", i === cur);
      buttons[i].setAttribute("aria-current", i === cur ? "step" : "false");
    });
    bars.forEach((b, i) => b.classList.toggle("is-on", i <= cur));
    stageEl.textContent = "Stage " + (cur + 1) + " of " + total;
    current = cur;
    if (cur !== shown) showPanel(cur);
  }

  function showPanel(i) {
    const first = shown === -1;
    shown = i;
    narrMounts.forEach((m, k) => { m.hidden = k !== i; });
    panelTitle.textContent = titles[i];
    panelText.textContent = STAGES[i].text;
    setPhoto(STAGES[i], titles[i]);
    panel.classList.remove("is-in");
    void panel.offsetWidth; // restart the entrance animation
    panel.classList.add("is-in");
    placePanel();
    if (!first) {
      announce.textContent = "Stage " + (i + 1) + " of " + total + ": " + titles[i] + ". " + STAGES[i].text;
      if (mode === "playing" && mobileMQ.matches) {
        nodes[i].scrollIntoView({ block: "nearest", behavior: reduced() ? "auto" : "smooth" });
      }
    }
  }

  // Photo for the selected stage; shows the "Add your photo here" box if the file is missing.
  function setPhoto(stage, title) {
    shotFrame.classList.add("is-missing");
    shotImg.alt = stage.alt;
    shotSearch.textContent = "Search: " + stage.search;
    shotFile.textContent = "Save as: " + stage.img;
    shotImg.src = DIR + stage.img;
    setSource(stage, title);
  }

  // Point the photo and its "Photo Source" link at this stage's source webpage.
  function setSource(stage, title) {
    const label = "View original photo source for " + title + " (opens in a new tab)";
    [shotLink, sourceLink].forEach((a) => {
      if (!a) return;
      a.href = stage.source;
      a.setAttribute("aria-label", label);
    });
  }
  shotImg.addEventListener("load", () => { if (shotImg.naturalWidth > 0) shotFrame.classList.remove("is-missing"); });
  shotImg.addEventListener("error", () => shotFrame.classList.add("is-missing"));

  // Desktop: panel sits under the map. Mobile: panel opens under the selected stop.
  function placePanel() {
    const host = mobileMQ.matches ? nodes[current] : home;
    if (panel.parentNode !== host) host.appendChild(panel);
    updatePointer();
  }

  // Little arrow on the panel that points up at the selected stop (desktop only).
  function updatePointer() {
    if (mobileMQ.matches) return;
    const nr = buttons[current].querySelector(".flow__num").getBoundingClientRect();
    const pr = panel.getBoundingClientRect();
    let x = nr.left + nr.width / 2 - pr.left - panel.clientLeft;
    x = Math.max(24, Math.min(pr.width - 40, x));
    panel.style.setProperty("--pointer-x", x + "px");
  }

  /* ----- animation timeline: dwell, travel, dwell, travel ... ----- */
  function applyTime(time) {
    const travel = reduced() ? 0 : TRAVEL;
    let rem = time;
    for (let i = 0; i < total; i++) {
      if (rem < DWELL) return paint(i, -1, 0);
      rem -= DWELL;
      if (i === total - 1) break;
      if (rem < travel) return paint(i, i, rem / travel);
      rem -= travel;
    }
    paint(total - 1, -1, 0);
  }

  function duration() {
    return total * DWELL + (total - 1) * (reduced() ? 0 : TRAVEL);
  }

  function tick(now) {
    if (mode !== "playing") return;
    elapsed += Math.min(now - last, 100); // clamp so a hidden tab doesn't skip ahead
    last = now;
    if (elapsed >= duration()) return finish();
    applyTime(elapsed);
    raf = requestAnimationFrame(tick);
  }

  function setMode(m) {
    mode = m;
    map.classList.toggle("is-playing", m === "playing");
    exploreBtn.textContent = m === "playing" ? "Replay" : "Explore the Connection";
    exploreBtn.setAttribute("aria-label",
      m === "playing" ? "Replay the animation from stage 1" : "Explore the connection: play the animated journey");
  }

  function start() {
    closeMapNarration();
    cancelAnimationFrame(raf);
    elapsed = 0;
    map.classList.remove("is-complete");
    setMode("playing");
    applyTime(0);
    last = performance.now();
    raf = requestAnimationFrame(tick);
  }

  function finish() {
    cancelAnimationFrame(raf);
    paint(total - 1, -1, 0);
    map.classList.add("is-complete");
    setMode("idle");
  }

  // A tap/click on a stop takes over from the animation.
  function select(i) {
    if (i !== current && closeMapNarration()) buttons[i].focus({ preventScroll: true });
    cancelAnimationFrame(raf);
    setMode("idle");
    map.classList.remove("is-complete");
    paint(i, -1, 0);
  }

  /* ----- events ----- */
  buttons.forEach((b, i) => {
    b.setAttribute("aria-label", "Stage " + (i + 1) + " of " + total + ": " + titles[i]);
    b.addEventListener("click", () => select(i));
  });
  // Opening a stage's narration also takes over from a running animation, so the map stays on that stage.
  narrMounts.forEach((m) => m.addEventListener("click", () => { if (mode === "playing") select(current); }));
  // One button: starts the animation, and restarts it from stage 1 if it is already running.
  exploreBtn.addEventListener("click", start);
  mobileMQ.addEventListener("change", placePanel);
  window.addEventListener("resize", updatePointer);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(updatePointer);

  /* ----- go live ----- */
  map.classList.add("is-enhanced");
  map.querySelectorAll("[hidden]").forEach((el) => { el.hidden = false; });
  setMode("idle");
  paint(0, -1, 0);
})();


// Missing photos: if an <img> cannot load, mark its frame so the CSS shows the
// "Add your photo here" placeholder (the <img> stays in the HTML, just not visible).
function checkImage(img) {
  const frame = img.closest(".shot__frame");
  const mark = () => frame.classList.add("is-missing");
  if (img.complete) {
    if (img.naturalWidth === 0) mark();
  } else {
    img.addEventListener("error", mark);
  }
  img.addEventListener("load", () => frame.classList.remove("is-missing"));
}
document.querySelectorAll(".shot__frame img").forEach(checkImage);


// =====================================================================================
// NARRATION CONFIGS — the 12 buttons beside the titles on this page. EDIT THE VALUES HERE.
// All 12 open the SAME shared panel (shared/js/narration.js); only these values change.
//   label             -> text on the button beside the title
//   title             -> NARRATION TITLE shown at the top of the panel
//   image             -> CHARACTER IMAGE PATH (relative to project root), e.g. "assets/images/characters/jaymark-vicente.png"
//   showPartIndicator -> PART INDICATOR: true shows "Part 1 of N" (N = number of items in parts below); false hides it for a single clip
//   parts[].audio     -> AUDIO FILE PATH (relative to project root), e.g. "assets/audio/culture-goes-global/clip.mp3"
//   parts[].transcript-> TRANSCRIPT text shown in the panel (blank line = new paragraph)
// Empty values are fine: the panel opens with placeholders ("Audio not added yet", etc.) and never autoplays.
// Need more clips for one narration? Add more { audio, transcript } objects to its parts array
// and the panel shows "Part 1 of 2", "Part 2 of 2", and so on.
// Entries 1-4 and 10-12 are beside the lesson cards. Entries 5-9 are the Culture Connection Map stages, in map order;
// each one appears beside the explanation panel's title when that stage is selected.
// =====================================================================================
const CULTURE_NARRATIONS = [

  // ---------- K-POP DISCUSSION ----------

  // ---------- 1. WHAT IS K-POP? ----------
  {
    mountId: "whatKpopNarrationMount",
    label: "Listen to What Is K-pop?",
    title: "What Is K-pop?",                    // NARRATION TITLE
    image: "",                                  // CHARACTER IMAGE PATH
    showPartIndicator: true,                    // PART INDICATOR
    parts: [
      { audio: "",                              // AUDIO FILE PATH
        transcript: "" }                        // TRANSCRIPT
    ]
  },

  // ---------- 2. WHERE DID IT START? ----------
  {
    mountId: "startNarrationMount",
    label: "Listen to Where Did It Start?",
    title: "Where Did It Start?",               // NARRATION TITLE
    image: "",                                  // CHARACTER IMAGE PATH
    showPartIndicator: true,                    // PART INDICATOR
    parts: [
      { audio: "",                              // AUDIO FILE PATH
        transcript: "" }                        // TRANSCRIPT
    ]
  },

  // ---------- 3. HOW DID IT SPREAD? ----------
  {
    mountId: "spreadNarrationMount",
    label: "Listen to How Did It Spread?",
    title: "How Did It Spread?",                // NARRATION TITLE
    image: "",                                  // CHARACTER IMAGE PATH
    showPartIndicator: true,                    // PART INDICATOR
    parts: [
      { audio: "",                              // AUDIO FILE PATH
        transcript: "" }                        // TRANSCRIPT
    ]
  },

  // ---------- 4. HOW DID IT REACH FILIPINOS? ----------
  {
    mountId: "reachFilipinosNarrationMount",
    label: "Listen to How Did It Reach Filipinos?",
    title: "How Did It Reach Filipinos?",       // NARRATION TITLE
    image: "",                                  // CHARACTER IMAGE PATH
    showPartIndicator: true,                    // PART INDICATOR
    parts: [
      { audio: "",                              // AUDIO FILE PATH
        transcript: "" }                        // TRANSCRIPT
    ]
  },

  // ---------- CULTURE CONNECTION MAP (stages 1-5) ----------

  // ---------- 5. MAP STAGE 1: SOUTH KOREA ----------
  {
    mountId: "mapSouthKoreaNarrationMount",
    label: "Listen to South Korea",
    title: "South Korea",                       // NARRATION TITLE
    image: "",                                  // CHARACTER IMAGE PATH
    showPartIndicator: true,                    // PART INDICATOR
    parts: [
      { audio: "",                              // AUDIO FILE PATH
        transcript: "" }                        // TRANSCRIPT
    ]
  },

  // ---------- 6. MAP STAGE 2: K-POP MUSIC AND DANCE ----------
  {
    mountId: "mapMusicDanceNarrationMount",
    label: "Listen to K-pop Music and Dance",
    title: "K-pop Music and Dance",             // NARRATION TITLE
    image: "",                                  // CHARACTER IMAGE PATH
    showPartIndicator: true,                    // PART INDICATOR
    parts: [
      { audio: "",                              // AUDIO FILE PATH
        transcript: "" }                        // TRANSCRIPT
    ]
  },

  // ---------- 7. MAP STAGE 3: INTERNET, YOUTUBE, AND SOCIAL MEDIA ----------
  {
    mountId: "mapInternetNarrationMount",
    label: "Listen to Internet, YouTube, and Social Media",
    title: "Internet, YouTube, and Social Media",   // NARRATION TITLE
    image: "",                                  // CHARACTER IMAGE PATH
    showPartIndicator: true,                    // PART INDICATOR
    parts: [
      { audio: "",                              // AUDIO FILE PATH
        transcript: "" }                        // TRANSCRIPT
    ]
  },

  // ---------- 8. MAP STAGE 4: FILIPINO FANS ----------
  {
    mountId: "mapFilipinoFansNarrationMount",
    label: "Listen to Filipino Fans",
    title: "Filipino Fans",                     // NARRATION TITLE
    image: "",                                  // CHARACTER IMAGE PATH
    showPartIndicator: true,                    // PART INDICATOR
    parts: [
      { audio: "",                              // AUDIO FILE PATH
        transcript: "" }                        // TRANSCRIPT
    ]
  },

  // ---------- 9. MAP STAGE 5: FAN COMMUNITIES, DANCE COVERS, AND LOCAL EVENTS ----------
  {
    mountId: "mapFanEventsNarrationMount",
    label: "Listen to Fan Communities, Dance Covers, and Local Events",
    title: "Fan Communities, Dance Covers, and Local Events",   // NARRATION TITLE
    image: "",                                  // CHARACTER IMAGE PATH
    showPartIndicator: true,                    // PART INDICATOR
    parts: [
      { audio: "",                              // AUDIO FILE PATH
        transcript: "" }                        // TRANSCRIPT
    ]
  },

  // ---------- CULTURE AND EVIDENCE ----------

  // ---------- 10. HOW DID FILIPINOS ADAPT IT? ----------
  {
    mountId: "adaptNarrationMount",
    label: "Listen to How Did Filipinos Adapt It?",
    title: "How Did Filipinos Adapt It?",       // NARRATION TITLE
    image: "",                                  // CHARACTER IMAGE PATH
    showPartIndicator: true,                    // PART INDICATOR
    parts: [
      { audio: "",                              // AUDIO FILE PATH
        transcript: "" }                        // TRANSCRIPT
    ]
  },

  // ---------- 11. DOES GLOBALIZATION MAKE CULTURES MORE SIMILAR, MORE DIVERSE, OR BOTH? ----------
  {
    mountId: "similarDiverseNarrationMount",
    label: "Listen to Does Globalization Make Cultures More Similar, More Diverse, or Both?",
    title: "Does Globalization Make Cultures More Similar, More Diverse, or Both?",   // NARRATION TITLE
    image: "",                                  // CHARACTER IMAGE PATH
    showPartIndicator: true,                    // PART INDICATOR
    parts: [
      { audio: "",                              // AUDIO FILE PATH
        transcript: "" }                        // TRANSCRIPT
    ]
  },

  // ---------- 12. WHAT IS THE EVIDENCE? ----------
  {
    mountId: "evidenceNarrationMount",
    label: "Listen to What Is the Evidence?",
    title: "What Is the Evidence?",             // NARRATION TITLE
    image: "",                                  // CHARACTER IMAGE PATH
    showPartIndicator: true,                    // PART INDICATOR
    parts: [
      { audio: "",                              // AUDIO FILE PATH
        transcript: "" }                        // TRANSCRIPT
    ]
  }
];

// Builds the 12 buttons. Nothing to edit below this line.
CULTURE_NARRATIONS.forEach(function (n) {
  AtlasNarration.create(Object.assign({}, n, { mount: document.getElementById(n.mountId) }));
});
