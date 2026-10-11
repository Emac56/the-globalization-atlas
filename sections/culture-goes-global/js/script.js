// CULTURE GOES GLOBAL — script for this page only.
// Bottom navigation is built by shared/js/nav.js.
// This file handles (1) the interactive Culture Connection Map and (2) missing photos.

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
  const DIR = "../../assets/images/culture-goes-global/";
  const STAGES = [
    { text: "K-pop began here. Its early groups emerged in South Korea in the 1990s.",
      img: "map-south-korea.webp", alt: "A street or skyline scene in South Korea", search: "Seoul South Korea city skyline" },
    { text: "K-pop pairs music with dance, so songs come with performances that fans can watch and learn.",
      img: "map-kpop-music-dance.avif", alt: "K-pop dancers performing choreography", search: "K-pop group dance choreography performance" },
    { text: "Digital music and platforms such as YouTube helped K-pop reach audiences worldwide.",
      img: "map-internet-youtube.jpg", alt: "A person watching K-pop videos on a phone or laptop", search: "person watching music video on phone YouTube" },
    { text: "Korean popular culture became influential in the Philippines through media and entertainment.",
      img: "map-filipino-fans.webp", alt: "Filipino fans enjoying Korean entertainment", search: "Filipino K-pop fans Philippines" },
    { text: "Filipino fans joined K-pop communities, attended events, and performed dance covers. In 2023, 13 groups competed in a cover-dance festival in Manila.",
      img: "map-fan-events.jpg", alt: "Filipino dance cover group performing at a fan event", search: "Philippines K-pop dance cover event Manila" }
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
    panelTitle.textContent = titles[i];
    panelText.textContent = STAGES[i].text;
    setPhoto(STAGES[i]);
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
  function setPhoto(stage) {
    shotFrame.classList.add("is-missing");
    shotImg.alt = stage.alt;
    shotSearch.textContent = "Search: " + stage.search;
    shotFile.textContent = "Save as: " + stage.img;
    shotImg.src = DIR + stage.img;
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
