// GROUP REFLECTION — script for this page only.
// Navigation uses plain HTML links. JS handles the question cards and the voice-over buttons.

const cards = document.querySelectorAll(".card");

// Open one card at a time. The shared narration panel belongs to the card it was opened from:
// close it whenever another card is opened or the card is closed.
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
  const head = card.querySelector(".card__head");
  head.addEventListener("click", () => {
    const willOpen = !card.classList.contains("is-open");
    const narrationWasOpen = !!document.querySelector(".narr-panel:not([hidden])");
    if (narrationWasOpen) AtlasNarration.close();
    cards.forEach((c) => setOpen(c, false)); // one open at a time
    if (willOpen) {
      setOpen(card, true);
      card.classList.add("is-seen");
    }
    if (narrationWasOpen) head.focus({ preventScroll: true });
  });
});

const NARRATIONS = [

  // ---------- QUESTION 1 ----------
  {
    mountId: "q1NarrationMount",
    label: "Listen to Question 1",
    title: "What surprised you most about globalization?",
    image: "assets/images/characters/jaymark-catinggan.png",
    showPartIndicator: true,
    parts: [
      { audio: "assets/audio/09-group-reflection/group-reflection-question-1-jaymark-catinggan.mp3", transcript: "Ang pinaka-nagulat kami ay kahit ang mga simpleng bagay sa araw-araw ay may koneksyon pala sa ibang bansa. Halimbawa, ang chocolate ay may prosesong kinasasangkutan ng iba't ibang lugar, habang ang K-dramas at K-pop ay nagbibigay sa atin ng ideya tungkol sa kultura ng South Korea." }
    ]
  },

  // ---------- QUESTION 2 ----------
  {
    mountId: "q2NarrationMount",
    label: "Listen to Question 2",
    title: "Which example best shows how connected the Philippines is to the world?",
    image: "assets/images/characters/kayzer-leopando.png",
    showPartIndicator: true,
    parts: [
      { audio: "assets/audio/09-group-reflection/group-reflection-question-2-kayzer-leopando.mp3", transcript: "Para sa amin, magandang halimbawa ang chocolate dahil hindi lang ito basta pagkain. Sa likod nito ay ang mga taong nagtatanim, gumagawa, nagdadala, at nagbebenta nito bago makarating sa mamimili." }
    ]
  },

  // ---------- QUESTION 3 ----------
  {
    mountId: "q3NarrationMount",
    label: "Listen to Question 3",
    title: "What is one major opportunity globalization gives the Philippines?",
    image: "assets/images/characters/richard-mayundang.png",
    showPartIndicator: true,
    parts: [
      { audio: "assets/audio/09-group-reflection/group-reflection-question-3-richard-mayundang.mp3", transcript: "Dahil sa koneksyon sa ibang bansa, mas marami tayong mapagkukunan ng kaalaman, produkto, at oportunidad sa trabaho at negosyo." }
    ]
  },

  // ---------- QUESTION 4 ----------
  {
    mountId: "q4NarrationMount",
    label: "Listen to Question 4",
    title: "What is one major challenge globalization creates for the Philippines?",
    image: "assets/images/characters/rey-dela-cruz.png",
    showPartIndicator: true,
    parts: [
      { audio: "assets/audio/09-group-reflection/group-reflection-question-4-rey-dela-cruz.mp3", transcript: "Isang hamon ang plastic pollution dahil ang basurang napupunta sa mga ilog ay maaaring makarating sa karagatan. Ipinapakita nito na kailangan ang responsableng pagkilos at pagtutulungan." }
    ]
  },

  // ---------- QUESTION 5 ----------
  {
    mountId: "q5NarrationMount",
    label: "Listen to Question 5",
    title: "How did your understanding of globalization change after exploring this atlas?",
    image: "assets/images/characters/jaymark-vicente.png",
    showPartIndicator: true,
    parts: [
      { audio: "assets/audio/09-group-reflection/group-reflection-question-5-jaymark-vicente.mp3", transcript: "Mas naunawaan namin na ang globalization ay hindi lang tungkol sa pagpasok ng mga produkto sa bansa. Kasama rin dito ang pagkalat ng kultura, pag-usbong ng oportunidad, at mga problemang nangangailangan ng sama-samang pagkilos." }
    ]
  }
];

// Builds the five buttons. Nothing to edit below this line.
NARRATIONS.forEach(function (n) {
  AtlasNarration.create(Object.assign({}, n, { mount: document.getElementById(n.mountId) }));
});
