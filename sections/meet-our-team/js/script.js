// MEET OUR TEAM — script for this page only.
// Navigation uses plain HTML links (shared/js/nav.js). JS only swaps each "PROFILE PHOTO"
// placeholder for the member's portrait IF the image file exists.

(function () {
  "use strict";

  // Each .portrait in index.html has data-portrait="assets/images/characters/<name>.png".
  // These are the same character images the narration panels already use. Paths are relative
  // to the project root. A missing file is NOT an error: the CSS placeholder simply stays.
  // To change a portrait: put the image in assets/images/characters/ (same file name),
  // or point that member's data-portrait to another file.
  var ROOT = new URL("../../../", document.currentScript.src).href;

  document.querySelectorAll(".portrait[data-portrait]").forEach(function (box) {
    var probe = new Image();
    probe.onload = function () {
      var img = document.createElement("img");
      img.className = "portrait__img";
      img.alt = box.getAttribute("data-alt") || "";
      img.src = probe.src;
      box.appendChild(img);
      box.classList.add("has-photo");
    };
    // onerror: do nothing -> placeholder stays, no broken-image icon is ever inserted
    probe.src = ROOT + box.getAttribute("data-portrait");
  });
})();
