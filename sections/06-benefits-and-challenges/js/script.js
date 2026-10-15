// BENEFITS AND CHALLENGES — script for this page only.
// Navigation uses plain HTML links. JS handles the topic cards: select a benefit or a challenge and its
// four-part explanation shows in the detail panel under the cards. Only one is shown at a time;
// select the same card again to close it. (Without JavaScript all eight explanations simply stay visible.)
// The eight narration buttons sit beside the titles in the detail panel; their configs are NARRATIONS at the bottom of this file.

(function () {
  "use strict";

  const buttons = Array.from(document.querySelectorAll(".topic__btn"));
  const box = document.getElementById("detailBox");
  const placeholder = document.getElementById("placeholder");
  const panelFor = (btn) => document.getElementById(btn.getAttribute("aria-controls"));

  // Show one topic (or none when btn is null)
  function select(btn) {
    buttons.forEach((b) => {
      const on = b === btn;
      b.setAttribute("aria-expanded", String(on));
      panelFor(b).hidden = !on;
    });
    placeholder.hidden = !!btn;
    box.classList.toggle("detailbox--on", !!btn);
  }

  select(null);   // start with the hint showing

  // The shared narration panel belongs to the topic it was opened from: close it when another topic is picked or this one closes.
  function closeNarration() {
    const open = document.querySelector('.narr-trigger[aria-expanded="true"]');
    if (!open || !box.contains(open) || !window.AtlasNarration) return false;
    AtlasNarration.close();
    return true;
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (closeNarration()) btn.focus({ preventScroll: true });
      const already = btn.getAttribute("aria-expanded") === "true";
      select(already ? null : btn);
      if (already) return;
      // Bring the panel into view if it is off-screen (phones)
      const rect = panelFor(btn).getBoundingClientRect();
      if (rect.top > window.innerHeight * 0.6 || rect.top < 0) {
        panelFor(btn).scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    });
  });
})();


// =====================================================================================
// NARRATION CONFIGS — the eight buttons beside the titles in the detail panel. EDIT THE VALUES HERE.
// All eight open the SAME shared panel (shared/js/narration.js); only these values change.
//   label             -> text on the button beside the title
//   title             -> NARRATION TITLE shown at the top of the panel
//   image             -> CHARACTER IMAGE PATH (relative to project root), e.g. "assets/images/characters/jaymark-vicente.png"
//   showPartIndicator -> PART INDICATOR: true shows "Part 1 of N" (N = number of items in parts below); false hides it for a single clip
//   parts[].audio     -> AUDIO FILE PATH (relative to project root), e.g. "assets/audio/benefits-and-challenges/clip.mp3"
//   parts[].transcript-> TRANSCRIPT text shown in the panel (blank line = new paragraph)
// Empty values are fine: the panel opens with placeholders ("Audio not added yet", etc.) and never autoplays.
// Need more clips for one narration? Add more { audio, transcript } objects to its parts array
// and the panel shows "Part 1 of 2", "Part 2 of 2", and so on.
// Entries 1-4 are the Benefits, entries 5-8 are the Challenges. A button shows when its topic card is selected.
// =====================================================================================
const NARRATIONS = [

  // ---------- 1. BENEFIT 01: MORE JOBS IN THE PHILIPPINES ----------
  {
    mountId: "moreJobsNarrationMount",
    label: "Listen to More Jobs",
    title: "More Jobs in the Philippines",
    image: "assets/images/characters/richard-mayundang.png",
    showPartIndicator: true,
    parts: [
      { audio: "assets/audio/06-benefits-and-challenges/benefits-and-challenges-benefit-1-richard-mayundang.mp3", transcript: "Introduksyon:\nSa bahaging ito, pag-uusapan natin ang magagandang naidudulot ng globalisasyon at ang mga problemang maaari rin nitong dalhin.\n\nBakit ito nangyari?:\nDumarami ang trabaho kapag may mga kompanya mula sa ibang bansa na nagnenegosyo rito sa Pilipinas.\n\nSino ang nakikinabang?:\nMalaking tulong ito sa mga Pilipinong naghahanap ng trabaho para masuportahan ang kanilang pamilya.\n\nSino ang apektado?:\nPero ang mga walang sapat na kakayahan o training ay maaaring mahirapang makuha ang mga trabahong ito.\n\nKonrektong Halimbawa:\nHalimbawa, kapag may dayuhang kompanyang nagbukas sa Pilipinas, maaari itong kumuha ng mga lokal na empleyado at magbigay ng dagdag na trabaho." }
    ]
  },

  // ---------- 2. BENEFIT 02: ACCESS TO NEW TECHNOLOGY ----------
  {
    mountId: "newTechnologyNarrationMount",
    label: "Listen to New Technology",
    title: "Access to New Technology",
    image: "assets/images/characters/richard-mayundang.png",
    showPartIndicator: true,
    parts: [
      { audio: "assets/audio/06-benefits-and-challenges/benefits-and-challenges-benefit-2-richard-mayundang.mp3", transcript: "Bakit ito nangyari?:\nDahil sa globalisasyon, mas nagiging accessible sa mga negosyo sa Pilipinas ang mga bagong teknolohiya at digital tools mula sa ibang bansa.\n\nSino ang nakikinabang?:\nMalaking tulong ito sa mga negosyo, manggagawa, estudyante, at mamimili dahil mas napapadali ang kanilang mga gawain.\n\nSino ang apektado?:\nPero ang mga walang sapat na access sa teknolohiya o hindi marunong gumamit nito ay maaaring maiwan sa mga oportunidad.\n\nKonkretong Halimbawa:\nAyon sa World Bank, kabilang ang technology, media, at telecommunications sa mga sektor na maaaring makatulong sa Pilipinas na makilahok sa pandaigdigang kalakalan."}
    ]
  },

  // ---------- 3. BENEFIT 03: WIDER MARKET FOR FILIPINO BUSINESSES ----------
  {
    mountId: "widerMarketsNarrationMount",
    label: "Listen to Wider Markets",
    title: "Wider Market for Filipino Businesses",
    image: "assets/images/characters/richard-mayundang.png",
    showPartIndicator: true,
    parts: [
      { audio: "assets/audio/06-benefits-and-challenges/benefits-and-challenges-benefit-3-richard-mayundang.mp3", transcript: "Bakit Ito Nangyayari?:\nNangyayari ito dahil sa globalization, mas nagkakaroon ng pagkakataon ang mga negosyong Pilipino na makapagbenta ng kanilang mga produkto at serbisyo sa ibang bansa. Dahil dito, mas lumalawak ang kanilang merkado at mas marami silang puwedeng maging customer.\n\nSino ang Nakikinabang?:\nAng nakikinabang dito ay ang mga negosyanteng Pilipino, mga exporter, mga manggagawa, at mga mamimili. Halimbawa, kapag lumawak ang negosyo, puwedeng dumami ang trabaho at magkaroon ng mas maraming pagpipilian ang mga mamimili.\n\nSino ang Naaapektuhan?:\nAng maaaring maapektuhan ay ang mga lokal na negosyong nahihirapang makipagkompetensya sa mga produktong galing sa ibang bansa. Halimbawa, kung mas mura ang imported na produkto, maaaring mas piliin ito ng mga mamimili kaysa sa produktong gawa ng mga lokal na negosyo.\n\nKonkretong Halimbawa:\nAyon sa World Bank, ang mas malawak na pakikilahok ng Pilipinas sa pandaigdigang supply chain ay maaaring makatulong para maging mas kompetitibo ang ekonomiya ng bansa. Ibig sabihin, kapag nakikipag-ugnayan ang mga negosyong Pilipino sa mga negosyo mula sa ibang bansa, maaari silang magkaroon ng mas maraming oportunidad na mapalago ang kanilang negosyo at makapagbenta sa mas malawak na merkado."}
    ]
  },

  // ---------- 4. BENEFIT 04: CULTURAL EXCHANGE ----------
  {
    mountId: "culturalExchangeNarrationMount",
    label: "Listen to Cultural Exchange",
    title: "Cultural Exchange",
    image: "assets/images/characters/jaymark-catinggan.png",
    showPartIndicator: true,
    parts: [
      { audio: "assets/audio/06-benefits-and-challenges/benefits-and-challenges-benefit-4-jaymark-catinggan.mp3", transcript: "Bakit Ito Nangyayari?:\nNangyayari ito dahil sa globalization, mas madali na nating nakikilala ang kultura ng ibang bansa sa pamamagitan ng social media, musika, pagkain, at paglalakbay. Dahil dito, mas lumalawak ang ating kaalaman at pang-unawa sa mga taong may ibang kultura.\n\nSino ang Nakikinabang?:\nAng nakikinabang dito ay ang mga estudyante, fans, artists, at iba't ibang komunidad. Nagkakaroon sila ng pagkakataong matuto ng mga bagong bagay, makakuha ng inspirasyon, at makakilala ng mga taong may parehong interes kahit magkaiba ang kanilang bansa at kultura.\n\nSino ang Naaapektuhan?:\nAng mga Pilipino at ang ating mga lokal na komunidad ay naaapektuhan din dahil sa pagpasok ng mga banyagang kultura. Maaari itong magbigay sa atin ng bagong kaalaman at ideya, pero mahalaga ring patuloy nating pahalagahan ang sariling kultura at mga tradisyon.\n\nKonkretong Halimbawa:\nNoong 2023, may 13 dance groups mula sa iba't ibang bahagi ng Pilipinas na lumahok sa K-pop Cover Dance Festival sa Pasig. Ipinapakita nito na sa pamamagitan ng musika at sayaw, naipapahayag ng mga Pilipino ang kanilang talento habang natututo at nakikibahagi sa kulturang Koreano. Isa itong halimbawa kung paano nakatutulong ang globalization sa pagpapalitan ng kultura at pagbubuo ng koneksyon sa pagitan ng mga tao mula sa magkaibang bansa."}
    ]
  },

  // ---------- 5. CHALLENGE 01: JOB COMPETITION ----------
  {
    mountId: "jobCompetitionNarrationMount",
    label: "Listen to Job Competition",
    title: "Job Competition",
    image: "assets/images/characters/jaymark-vicente.png",
    showPartIndicator: true,
    parts: [
      { audio: "assets/audio/06-benefits-and-challenges/benefits-and-challenges-challenges-1-jaymark-vicente.mp3", transcript: "Bakit ito nangyayari?:\nNangyayari ito dahil sa globalization, mas nagkakaroon ng pagkakataon ang mga Pilipino na makipagtrabaho sa mga kompanya na may koneksyon sa ibang bansa. Dahil dito, mas nagiging mahalaga ang pagkakaroon ng updated na kaalaman at kasanayan para makasabay sa mga pangangailangan ng trabaho.\n\nSino ang Nakikinabang?:\nAng nakikinabang dito ay ang mga manggagawang may sapat na kasanayan at ang mga kompanyang kayang sumabay sa pagbabago. Mas nagkakaroon ng oportunidad ang mga empleyadong marunong gumamit ng bagong teknolohiya at kayang matuto ng mga bagong paraan ng pagtatrabaho.\n\nSino ang Naaapektuhan?:\nAng maaaring mahirapan ay ang mga manggagawang kulang sa digital o teknikal na kasanayan. Kapag hindi sila nakakasabay sa mga bagong pangangailangan ng trabaho, maaaring mas mahirapan silang makahanap ng trabaho o makipagkompetensya sa ibang aplikante.\n\nKonkretong Halimbawa:\nAyon sa World Bank, may mga kompanya sa Pilipinas na nahihirapang makahanap ng manggagawang may tamang kasanayan para sa mga bakanteng posisyon. Ipinapakita nito na mahalagang pagbutihin ang ating kaalaman at kakayahan sa pamamagitan ng pag-aaral at pagsasanay upang mas maging handa tayo sa mga oportunidad sa trabaho." }
    ]
  },

  // ---------- 6. CHALLENGE 02: ENVIRONMENTAL PROBLEMS ----------
  {
    mountId: "environmentNarrationMount",
    label: "Listen to Environmental Problems",
    title: "Environmental Problems",
    image: "assets/images/characters/jaymark-vicente.png",
    showPartIndicator: true,
    parts: [
      { audio: "assets/audio/06-benefits-and-challenges/benefits-and-challenges-challenges-2-jaymark-vicente.mp3", transcript: "Bakit Ito Nangyayari?:\nNangyayari ito dahil habang dumarami ang produksyon at kalakalan ng mga produkto, mas maraming sasakyan at barko ang ginagamit sa pagdadala ng mga ito. Maaari itong magdulot ng polusyon sa hangin at tubig, at makasira sa likas na yaman ng Pilipinas.\n\nSino ang Nakikinabang?:\nAng nakikinabang dito ay ang mga negosyong kumikita sa mas maraming produksyon at kalakalan. Kapag mas marami silang produktong naibebenta, maaari ring tumaas ang kanilang kita.\n\nSino ang Naaapektuhan?:\nAng naaapektuhan ay ang mga Pilipinong nakatira malapit sa mga pabrika, pantalan, at mataong kalsada. Maaari silang makaranas ng maruming hangin, maingay na kapaligiran, at polusyon na maaaring makaapekto sa kanilang kalusugan at pang-araw-araw na buhay.\n\nKonkretong Halimbawa:\nSa pagsusuri ng World Bank tungkol sa kapaligiran ng Pilipinas, tinalakay ang mga suliranin tulad ng polusyon sa hangin at tubig, pati na rin ang pangangalaga sa likas na yaman. Ipinapakita nito na habang umuunlad ang ekonomiya at dumarami ang mga gawaing pangkalakalan, mahalaga ring pangalagaan ang kapaligiran upang hindi mapahamak ang mga tao at kalikasan." }
    ]
  },

  // ---------- 7. CHALLENGE 03: ECONOMIC DEPENDENCE ----------
  {
    mountId: "economicDependenceNarrationMount",
    label: "Listen to Economic Dependence",
    title: "Economic Dependence",
    image: "assets/images/characters/jaymark-vicente.png",
    showPartIndicator: true,
    parts: [
      { audio: "assets/audio/06-benefits-and-challenges/benefits-and-challenges-challenges-3-jaymark-vicente.mp3", transcript: "Bakit Ito Nangyayari?:\nNangyayari ito dahil nakikipagkalakalan ang Pilipinas sa ibang bansa, umaangkat ng mga produkto, at tumatanggap ng puhunan mula sa mga dayuhang investor. Dahil dito, maaari tayong maapektuhan kapag nagkaroon ng problema sa ibang bansa.\n\nSino ang Nakikinabang?:\nAng nakikinabang ay ang mga negosyong nakikipagkalakalan sa ibang bansa dahil lumalawak ang kanilang merkado at nagkakaroon sila ng mas maraming pagkakataong kumita.\n\nSino ang Naaapektuhan?:\nNaaapektuhan ang mga manggagawa, negosyo, at mamimili kapag nagkaroon ng krisis sa ibang bansa. Maaari itong magdulot ng pagkaantala sa produksyon at pagtaas ng presyo ng mga bilihin.\n\nKonkretong Halimbawa:\nAyon sa World Bank, konektado ang Pilipinas sa ibang bansa sa paggawa at pagkuha ng mga produkto. Halimbawa, kapag naantala ang pagdating ng mga piyesang galing sa ibang bansa, maaaring bumagal ang produksyon sa Pilipinas. Ipinapakita nito na kailangan nating maging handa sa mga problemang maaaring makaapekto sa ating kalakalan."}
    ]
  },

  // ---------- 8. CHALLENGE 04: CULTURAL CHANGES ----------
  {
    mountId: "culturalChangesNarrationMount",
    label: "Listen to Cultural Changes",
    title: "Cultural Changes",
    image: "assets/images/characters/jaymark-vicente.png",
    showPartIndicator: true,
    parts: [
      { audio: "assets/audio/06-benefits-and-challenges/benefits-and-challenges-challenges-4-jaymark-vicente.mp3", transcript: "Bakit Ito Nangyayari?:\nNangyayari ito dahil sa globalization, mas nakikilala natin ang kultura ng ibang bansa sa pamamagitan ng social media, musika, pelikula, at mga banyagang produkto. Maaari nitong maimpluwensiyahan ang ating mga nakasanayan.\n\nSino ang Nakikinabang?:\nAng nakikinabang ay ang mga taong nagkakaroon ng bagong kaalaman, inspirasyon, at mas maraming pagpipilian mula sa iba't ibang kultura.\n\nSino ang Naaapektuhan?:\nMaaaring maapektuhan ang mga lokal na komunidad, katutubo, at gumagamit ng mga wikang Pilipino kapag nababawasan ang pagpapahalaga sa kanilang sariling wika at tradisyon.\n\nKonkretong Halimbawa:\nBinibigyang-diin ng United Nations ang kahalagahan ng pagprotekta sa iba't ibang kultura at wika. Kaya habang natututo tayo sa ibang bansa, mahalaga ring panatilihin at pahalagahan ang kulturang Pilipino."}
    ]
  }
];

// Builds the eight buttons. Nothing to edit below this line.
NARRATIONS.forEach(function (n) {
  AtlasNarration.create(Object.assign({}, n, { mount: document.getElementById(n.mountId) }));
});
