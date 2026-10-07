/**
 * ÉCRAN DE CHARGEMENT
 * 1. Logo de l'agence  2. Logo du client  3. Deux hommes en costume se serrent la main.
 * Se charge en haut du <body> (après data/site.js) pour s'afficher avant le reste de la page.
 * À la fin, émet l'événement "preloader:done" sur window (main.js lance alors les animations du hero).
 */
(function () {
  "use strict";

  var CFG = (window.SITE && window.SITE.preloader) || {};
  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function storage(fn) { try { return fn(window.sessionStorage); } catch (e) { return null; } }
  if (CFG.enabled === false || (CFG.oncePerSession && storage(function (s) { return s.getItem("pl-seen"); }))) return;
  storage(function (s) { s.setItem("pl-seen", "1"); });

  var TIMELINE = reduceMotion ? 1000 : 3000; // durée de la séquence (ms)
  var MAX_WAIT = 3400;                       // on sort quoi qu'il arrive après ce délai

  function esc(s) {
    return String(s || "").replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ───────── Logos ───────── */
  function logo(item, variant) {
    item = item || {};
    var name = item.name || "";
    var inner;
    if (item.logo) {
      inner = '<span class="pl-logo__img"><img src="' + esc(item.logo) + '" alt="' + esc(name) + '"></span>';
    } else {
      // Logo typographique : contour dessiné puis remplissage. Dernier mot en maigre (ex. Montage *Gold*).
      var words = name.toUpperCase().split(/\s+/).filter(Boolean);
      var last = words.length > 1 ? words.pop() : "";
      var w = Math.max(120, Math.round(name.length * 34 + 24));
      inner =
        '<svg class="pl-logo__word" viewBox="0 0 ' + w + ' 72" role="img" aria-label="' + esc(name) + '">' +
          '<text x="' + w / 2 + '" y="48" text-anchor="middle">' +
            esc(words.join(" ")) + (last ? ' <tspan class="pl-logo__light">' + esc(last) + "</tspan>" : "") +
          "</text>" +
          '<line class="pl-logo__rule" x1="' + w * 0.3 + '" y1="64" x2="' + w * 0.7 + '" y2="64"/>' +
        "</svg>";
    }
    return '<div class="pl-logo pl-logo--' + variant + '">' + inner +
      (item.tagline ? '<span class="pl-logo__tag">' + esc(item.tagline) + "</span>" : "") + "</div>";
  }

  /* ───────── Personnage (dessiné de profil, tourné vers la droite) ───────── */
  function leg(x, cls) {
    return '<g transform="translate(' + x + ' -94)"><g class="pl-leg ' + cls + '">' +
      '<rect class="ink2" x="-7" y="0" width="15" height="88" rx="4"/>' +
      '<path class="ink" d="M-8 84h18q10 0 10 7v3h-28z"/>' +
    "</g></g>";
  }
  function man(withCase) {
    return '<ellipse class="pl-shadow" cx="4" cy="0" rx="30" ry="4"/><g class="pl-bob">' +
      // bras arrière (avec mallette pour l'un des deux)
      '<g transform="translate(-6 -170)"><g class="pl-arm-back">' +
        '<rect class="ink sleeve" x="-7" y="-2" width="14" height="64" rx="7"/>' +
        '<circle class="skin" cx="0" cy="69" r="7.5"/>' +
        (withCase
          ? '<g transform="translate(0 74)"><path class="strap" d="M-7 2v-6h14v6"/>' +
            '<rect class="ink" x="-18" y="1" width="36" height="25" rx="3"/>' +
            '<path class="seam" d="M-18 10h36"/></g>'
          : "") +
      "</g></g>" +
      leg(-8, "pl-leg--back") + leg(3, "pl-leg--front") +
      // veste, chemise, cravate
      '<rect class="skin" x="1" y="-190" width="12" height="12"/>' +
      '<path class="ink" d="M-24 -170Q-24 -181 -12 -181L18 -181Q30 -181 30 -169L33 -98Q33 -88 23 -88L-19 -88Q-29 -88 -28 -98Z"/>' +
      '<path class="paper" d="M-2 -181L16 -181L8 -146Z"/>' +
      '<path class="ink" d="M5 -179L11 -179L12.5 -157L8 -147L3.5 -157Z"/>' +
      '<path class="lapel" d="M-3 -181L6 -139M17 -181L10 -139M18 -158h9"/>' +
      '<circle class="paper" cx="8" cy="-124" r="1.8"/><circle class="paper" cx="8" cy="-110" r="1.8"/>' +
      // tête sans visage + cheveux
      '<ellipse class="skin" cx="7" cy="-206" rx="19" ry="23"/>' +
      '<path class="ink" d="M-12 -207C-13 -226 -2 -231 9 -230C21 -229 27 -221 26 -211C20 -218 10 -219 0 -216C-5 -214 -9 -211 -12 -207Z"/>' +
      // bras avant : se lève puis serre la main
      '<g transform="translate(18 -172)"><g class="pl-arm-raise"><g class="pl-arm-shake">' +
        '<rect class="ink sleeve" x="-7" y="-4" width="14" height="66" rx="7"/>' +
        '<rect class="paper" x="-7" y="57" width="14" height="6"/>' +
        '<rect class="skin" x="-7.5" y="63" width="15" height="20" rx="7.5"/>' +
      "</g></g></g></g>";
  }

  // Les mains se rejoignent en x=200 : épaule (18) + bras de 72 incliné à 70° ≈ 86 → personnages à 114 et 286.
  var scene =
    '<svg class="pl-stage" viewBox="0 0 400 250" aria-hidden="true">' +
      '<line class="pl-ground" x1="30" y1="238" x2="370" y2="238"/>' +
      '<g class="pl-man pl-man--b"><g transform="translate(286 238) scale(-1 1)">' + man(false) + "</g></g>" +
      '<g class="pl-man pl-man--a"><g transform="translate(114 238)">' + man(true) + "</g></g>" +
      '<g class="pl-burst" transform="translate(200 84)"><path d="M0 -10V-28M-13 -5L-26 -16M13 -5L26 -16"/></g>' +
    "</svg>";

  var pl = document.createElement("div");
  pl.className = "pl";
  pl.setAttribute("role", "status");
  pl.setAttribute("aria-label", "Chargement du site");
  pl.innerHTML =
    '<div class="pl-logos">' +
      logo(CFG.agency, "agency") +
      '<span class="pl-x" aria-hidden="true">×</span>' +
      logo(CFG.client, "client") +
    "</div>" +
    scene +
    (CFG.caption ? '<p class="pl-caption">' + esc(CFG.caption) + "</p>" : "") +
    '<div class="pl-bar">' +
      '<span class="pl-count"><span class="pl-count__num">00</span><span class="pl-count__pct">%</span></span>' +
      '<span class="pl-track"><span class="pl-fill"></span></span>' +
      '<button type="button" class="pl-skip">Passer l’intro <span aria-hidden="true">→</span></button>' +
    "</div>";

  document.body.insertBefore(pl, document.body.firstChild);
  root.classList.add("pl-active");

  /* ───────── Progression : suit la séquence, attend le vrai chargement de la page ───────── */
  var numEl = pl.querySelector(".pl-count__num");
  var fillEl = pl.querySelector(".pl-fill");
  var start = performance.now();
  var loaded = document.readyState === "complete";
  var shown = 0;
  var finished = false;

  window.addEventListener("load", function () { loaded = true; });

  function tick(now) {
    if (finished) return;
    var t = now - start;
    var target = Math.min(t / TIMELINE, 1) * 100;
    if (!loaded) target = Math.min(target, 92);
    shown += (target - shown) * 0.25;
    if (target === 100 && shown > 99.5) shown = 100;
    numEl.textContent = String(Math.floor(shown)).padStart(2, "0");
    fillEl.style.transform = "scaleX(" + (shown / 100) + ")";
    if ((shown === 100 && t >= TIMELINE) || t >= MAX_WAIT) return finish();
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  function finish() {
    if (finished) return;
    finished = true;
    numEl.textContent = "100";
    fillEl.style.transform = "scaleX(1)";
    pl.classList.add("is-leaving");
    root.classList.remove("pl-active");
    window.__preloaderDone = true;
    window.dispatchEvent(new Event("preloader:done"));
    setTimeout(function () { pl.remove(); }, reduceMotion ? 400 : 700);
  }

  pl.querySelector(".pl-skip").addEventListener("click", finish);
  document.addEventListener("keydown", function onKey(e) {
    if (e.key === "Escape") { document.removeEventListener("keydown", onKey); finish(); }
  });
})();
