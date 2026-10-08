// GROUP REFLECTION — script for this page only.
// Navigation uses plain HTML links. JS handles the cards and the avatar dialogue.

// ---------------------------------------------------------------
// 1) MEMBERS — keep only the members that really exist.
//    avatar: path to the member's pixel-art image (leave "" to show the placeholder)
// ---------------------------------------------------------------
const MEMBERS = {
  m1: { name: "MEMBER 01", avatar: "" },
  m2: { name: "MEMBER 02", avatar: "" },
  m3: { name: "MEMBER 03", avatar: "" },
  m4: { name: "MEMBER 04", avatar: "" },
  m5: { name: "MEMBER 05", avatar: "" }
};

// ---------------------------------------------------------------
// 2) ANSWERS — one entry per question, in the same order as the cards.
//    Each answer: { member, text, message (optional), audio (optional) }
//    Add more answers to a question to let several members respond;
//    a switcher appears automatically when there is more than one.
//    audio: path to the voice-over file, e.g. "audio/member01-q1.mp3"
// ---------------------------------------------------------------
const PLACEHOLDER = "[Answer goes here]";

const QUESTIONS = [
  [{ member: "m1", text: PLACEHOLDER, message: "", audio: "" }],
  [{ member: "m2", text: PLACEHOLDER, message: "", audio: "" }],
  [{ member: "m3", text: PLACEHOLDER, message: "", audio: "" }],
  [{ member: "m4", text: PLACEHOLDER, message: "", audio: "" }],
  [{ member: "m5", text: PLACEHOLDER, message: "", audio: "" }]
];

// ---------------------------------------------------------------
const page = document.getElementById("secPage");
const cards = document.querySelectorAll(".card");
const takeaway = document.getElementById("takeaway");
const seen = new Set();
let voice = null; // current voice-over player (if any)

function stopVoice() {
  if (voice) { voice.pause(); voice = null; }
}

// Build the avatar + dialogue for one answer
function renderScene(answer) {
  const member = MEMBERS[answer.member] || { name: "MEMBER", avatar: "" };
  const scene = document.createElement("div");
  scene.className = "scene";

  const speaker = document.createElement("div");
  speaker.className = "speaker";
  const avatar = document.createElement("div");
  avatar.className = "avatar";
  if (member.avatar) {
    const img = document.createElement("img");
    img.src = member.avatar;
    img.alt = member.name + " avatar";
    avatar.appendChild(img);
  } else {
    const ph = document.createElement("span");
    ph.className = "avatar__ph";
    ph.setAttribute("aria-hidden", "true");
    avatar.appendChild(ph);
  }
  const name = document.createElement("p");
  name.className = "speaker__name";
  name.textContent = member.name;
  speaker.append(avatar, name);

  const box = document.createElement("div");
  box.className = "dialogue";
  const label = document.createElement("p");
  label.className = "dialogue__label";
  label.textContent = member.name + " says";
  const text = document.createElement("p");
  text.className = "dialogue__text" + (answer.text === PLACEHOLDER ? " is-placeholder" : "");
  text.textContent = answer.text;
  box.append(label, text);

  if (answer.message) {
    const msg = document.createElement("p");
    msg.className = "dialogue__msg";
    msg.textContent = answer.message;
    box.appendChild(msg);
  }

  // Voice-over hook: the button only appears if an audio file is set
  if (answer.audio) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pixel-btn voice";
    btn.textContent = "▶ Play voice";
    btn.addEventListener("click", () => {
      stopVoice();
      voice = new Audio(answer.audio);
      voice.play();
    });
    box.appendChild(btn);
  }

  scene.append(speaker, box);
  return scene;
}

// Fill a card's panel: optional member switcher + the scene
function renderPanel(qIndex, answerIndex) {
  const panel = document.getElementById("panel" + qIndex);
  const answers = QUESTIONS[qIndex];
  panel.replaceChildren();

  if (answers.length > 1) {
    const row = document.createElement("div");
    row.className = "members";
    answers.forEach((a, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "member-btn" + (i === answerIndex ? " is-active" : "");
      b.textContent = (MEMBERS[a.member] || { name: "MEMBER" }).name;
      b.setAttribute("aria-pressed", String(i === answerIndex));
      b.addEventListener("click", () => { stopVoice(); renderPanel(qIndex, i); });
      row.appendChild(b);
    });
    panel.appendChild(row);
  }
  panel.appendChild(renderScene(answers[answerIndex]));
}

function setOpen(card, open) {
  const head = card.querySelector(".card__head");
  const panel = card.querySelector(".card__panel");
  const sign = card.querySelector(".card__sign");
  card.classList.toggle("is-open", open);
  head.setAttribute("aria-expanded", String(open));
  panel.hidden = !open;
  sign.textContent = open ? "–" : "+";
}

cards.forEach((card) => {
  const q = Number(card.dataset.q);
  card.querySelector(".card__head").addEventListener("click", () => {
    const willOpen = !card.classList.contains("is-open");
    stopVoice();
    cards.forEach((c) => setOpen(c, false)); // one open at a time
    if (willOpen) {
      renderPanel(q, 0);
      setOpen(card, true);
      card.classList.add("is-seen");
      seen.add(q);
      if (seen.size === cards.length) takeaway.classList.add("is-complete");
    }
  });
});

// Small fade-out before leaving the page
page.querySelectorAll(".nav-btn").forEach((link) => {
  link.addEventListener("click", (e) => {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    page.classList.add("is-leaving");
    setTimeout(() => { window.location.href = link.href; }, 180);
  });
});

window.addEventListener("pageshow", () => page.classList.remove("is-leaving"));
