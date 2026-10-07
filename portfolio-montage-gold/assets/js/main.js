(function () {
  "use strict";

  var SITE = window.SITE || {};
  var PROJECTS = window.PROJECTS || [];
  var SHOWREEL = window.SHOWREEL || null;
  var POSTERS = window.POSTERS || [];
  var WORKS = window.WORKS || [];
  var GALLERIES = window.GALLERIES || [];
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ───────── Helpers ───────── */
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "class") node.className = attrs[k];
      else if (k === "text") node.textContent = attrs[k];
      else if (k.indexOf("on") === 0) node.addEventListener(k.slice(2), attrs[k]);
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) node.appendChild(c); });
    return node;
  }
  function get(obj, path) {
    return path.split(".").reduce(function (o, k) { return o ? o[k] : undefined; }, obj);
  }
  function parseVideo(url) {
    if (!url) return { kind: "empty", src: "" };
    var m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/);
    if (m) return { kind: "embed", src: "https://www.youtube-nocookie.com/embed/" + m[1] + "?autoplay=1&rel=0" };
    m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (m) return { kind: "embed", src: "https://player.vimeo.com/video/" + m[1] + "?autoplay=1&dnt=1" };
    return { kind: "file", src: url };
  }
  function formatTime(s) {
    if (!isFinite(s)) return "";
    var m = Math.floor(s / 60), r = Math.round(s % 60);
    if (r === 60) { m++; r = 0; }
    return String(m).padStart(2, "0") + ":" + String(r).padStart(2, "0");
  }

  /* ───────── Site texts ───────── */
  document.querySelectorAll("[data-site]").forEach(function (node) {
    var v = get(SITE, node.getAttribute("data-site"));
    if (v) node.textContent = v;
  });

  /* ───────── Thumbnail ───────── */
  function buildMedia(item, opts) {
    var v = parseVideo(item.video);
    var btn = el("button", {
      type: "button",
      class: "media" + (opts.hero ? " media--hero" : "") + (opts.alt ? " media--alt" : ""),
      "aria-label": "Lire la vidéo : " + item.title,
      onclick: function () { openModal(item, btn); }
    });

    if (item.thumbnail) {
      btn.appendChild(el("img", { class: "media__img", src: item.thumbnail, alt: item.alt || "", loading: "lazy", decoding: "async" }));
      if (v.kind === "file" && opts.onDuration) {
        // Miniature fournie : on lit quand même la durée de la vidéo.
        var probe = el("video", { src: v.src, preload: "metadata" });
        probe.addEventListener("loadedmetadata", function () { opts.onDuration(formatTime(probe.duration)); });
      }
    } else if (v.kind === "file") {
      // Pas de miniature : on affiche une image de la vidéo (muette, sans lecture).
      var preview = el("video", { class: "media__img", src: v.src + "#t=1", muted: "", playsinline: "", preload: "metadata", "aria-hidden": "true", tabindex: "-1" });
      preview.muted = true;
      preview.addEventListener("loadedmetadata", function () {
        if (opts.onDuration) opts.onDuration(formatTime(preview.duration));
      });
      btn.appendChild(preview);
    } else {
      btn.appendChild(el("span", { class: "media__placeholder", "aria-hidden": "true" }, [
        el("span", { text: item.category || "" }),
        el("span", { text: "Miniature 16:9 — à remplacer" })
      ]));
    }
    btn.appendChild(el("span", { class: "media__shade", "aria-hidden": "true" }));
    btn.appendChild(el("span", { class: "media__play", "aria-hidden": "true" }));
    return btn;
  }

  /* ───────── Showreel ───────── */
  var showreelSlot = document.getElementById("showreel-slot");
  var showreelDuration = document.getElementById("showreel-duration");
  if (SHOWREEL && showreelSlot) {
    if (SHOWREEL.duration) showreelDuration.textContent = SHOWREEL.duration;
    showreelSlot.appendChild(buildMedia(SHOWREEL, {
      hero: true,
      onDuration: function (d) { if (!SHOWREEL.duration) showreelDuration.textContent = d; }
    }));
  }

  /* ───────── Projects ───────── */
  var list = document.getElementById("projects-list");
  document.getElementById("project-count").textContent = String(PROJECTS.length).padStart(2, "0") + " vidéos";

  PROJECTS.forEach(function (p, i) {
    var durationEl = el("span", { class: "project__duration", text: p.duration || "" });
    var cta = el("button", { type: "button", class: "link-btn" }, [
      document.createTextNode("Regarder la vidéo"),
      el("span", { class: "arrow", "aria-hidden": "true", text: "→" })
    ]);
    var text = el("div", { class: "project__text" }, [
      el("span", { class: "project__num", "data-reveal": "up", text: p.number || String(i + 1).padStart(2, "0") }),
      el("div", { class: "project__cat", "data-reveal": "up", "data-delay": "80" }, [
        el("span", { class: "rule", "data-reveal": "line", "data-delay": "150" }),
        el("span", { text: p.category || "" })
      ]),
      el("h3", { class: "project__title", "data-reveal": "up", "data-delay": "140", text: p.title || "" }),
      el("p", { class: "project__desc", "data-reveal": "up", "data-delay": "200", text: p.description || "" }),
      el("div", { class: "project__actions", "data-reveal": "up", "data-delay": "260" }, [cta, durationEl])
    ]);
    var media = buildMedia(p, {
      alt: i % 2 === 1,
      onDuration: function (d) { if (!p.duration) durationEl.textContent = d; }
    });
    media.setAttribute("data-reveal", "up");
    media.setAttribute("data-delay", "100");
    cta.addEventListener("click", function () { openModal(p, cta); });

    list.appendChild(el("article", { class: "project" + (i % 2 === 1 ? " project--reverse" : "") }, [text, media]));
  });

  /* ───────── Affiches ───────── */
  var postersList = document.getElementById("posters-list");
  document.getElementById("poster-count").textContent = String(POSTERS.length).padStart(2, "0") + " affiches";

  POSTERS.forEach(function (p, i) {
    var btn = el("button", {
      type: "button", class: "poster__media",
      "aria-label": "Voir l’affiche : " + p.title,
      onclick: function () { openModal(p, btn); }
    });
    if (p.image) btn.appendChild(el("img", { src: p.image, alt: p.title || "", loading: "lazy", decoding: "async" }));
    else btn.appendChild(el("span", { class: "media__placeholder", "aria-hidden": "true" }, [el("span", { text: "Affiche" }), el("span", { text: "À venir" })]));
    postersList.appendChild(el("figure", { class: "poster", "data-reveal": "up", "data-delay": String((i % 3) * 80) }, [
      btn,
      el("figcaption", { class: "poster__caption" }, [
        el("span", { class: "poster__num", text: String(i + 1).padStart(2, "0") }),
        el("span", { class: "poster__title", text: p.title || "" })
      ])
    ]));
  });

  /* ───────── Réalisations ───────── */
  var worksList = document.getElementById("works-list");
  WORKS.forEach(function (w, i) {
    w.category = w.category || w.client;
    var media = buildMedia(w, { alt: i % 2 === 1 });
    worksList.appendChild(el("article", { class: "work", "data-reveal": "up", "data-delay": String(i * 80) }, [
      media,
      el("div", { class: "project__cat" }, [el("span", { class: "rule" }), el("span", { text: w.client || "" })]),
      el("h3", { class: "work__title", text: w.title || "" })
    ]));
  });

  /* ───────── Galerie (collaborations en photos) ───────── */
  var galleryList = document.getElementById("gallery-list");
  if (!GALLERIES.length) document.getElementById("galerie").hidden = true;

  GALLERIES.forEach(function (g, gi) {
    var images = g.images || [];
    var thumbs = el("div", { class: "gallery__thumbs" + (images.length === 3 ? " gallery__thumbs--3" : "") });
    images.slice(0, 4).forEach(function (src, i) {
      var t = el("button", {
        type: "button", class: "gallery__thumb",
        "aria-label": "Voir la photo " + (i + 1) + " : " + g.title,
        onclick: function () { openGallery(g, i, t); }
      }, [el("img", { src: src, alt: "", loading: "lazy", decoding: "async" })]);
      if (i === 3 && images.length > 4) t.appendChild(el("span", { class: "gallery__more", text: "+" + (images.length - 4) }));
      thumbs.appendChild(t);
    });
    var open = el("button", { type: "button", class: "btn btn--solid gallery__btn", onclick: function () { openGallery(g, 0, open); } }, [
      document.createTextNode("Voir la galerie"),
      el("span", { class: "arrow", "aria-hidden": "true", text: "→" })
    ]);
    galleryList.appendChild(el("article", { class: "gallery__row", "data-reveal": "up" }, [
      el("div", { class: "gallery__info" }, [
        el("span", { class: "gallery__num", text: String(gi + 1).padStart(2, "0") }),
        el("div", { class: "project__cat" }, [el("span", { class: "rule" }), el("span", { text: g.period || "" })]),
        el("h4", { class: "gallery__title", text: g.title || g.client || "" }),
        el("span", { class: "gallery__count", text: String(images.length).padStart(2, "0") + " photos" }),
        open
      ]),
      thumbs
    ]));
  });

  /* ───────── Menu mobile ───────── */
  var navToggle = document.getElementById("nav-toggle");
  var navLinks = document.getElementById("nav-links");
  function setMenu(open) {
    // Le menu est caché hors écran : son animation d'apparition ne s'est jamais jouée.
    if (open && navLinks.getAnimations) navLinks.getAnimations().forEach(function (an) { an.finish(); });
    document.body.classList.toggle("menu-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.querySelector(".nav__toggle-label").textContent = open ? "Fermer" : "Menu";
  }
  navToggle.addEventListener("click", function () { setMenu(!document.body.classList.contains("menu-open")); });
  navLinks.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && document.body.classList.contains("menu-open")) setMenu(false); });
  window.matchMedia("(min-width: 761px)").addEventListener("change", function (m) { if (m.matches) setMenu(false); });

  /* ───────── Contact ───────── */
  var c = SITE.contact || {};
  var rows = [
    { label: "Nom", value: c.name, ph: "[Votre nom]" },
    { label: "Email", value: c.email, ph: "[Votre email]", href: c.email ? "mailto:" + c.email : null },
    { label: "Téléphone", value: c.phone, ph: "[Votre téléphone]", href: c.phone ? "tel:" + c.phone.replace(/\s/g, "") : null },
    { label: "Site internet", value: c.social ? c.social.replace(/^https?:\/\//, "").replace(/\/$/, "") : "", ph: "[Vos liens]", href: c.social || null, ext: true }
  ];
  var contactList = document.getElementById("contact-list");
  rows.forEach(function (r) {
    var dd = el("dd");
    if (r.value && r.href) {
      var a = el("a", { href: r.href }, [el("span", { text: r.value }), el("span", { class: "arrow", "aria-hidden": "true", text: "→" })]);
      if (r.ext) { a.target = "_blank"; a.rel = "noopener"; }
      dd.appendChild(a);
    } else dd.textContent = r.value || r.ph;
    contactList.appendChild(el("div", { class: "contact__row", "data-reveal": "up" }, [el("dt", { text: r.label }), dd]));
  });
  if (c.email) document.getElementById("contact-cta").href = "mailto:" + c.email;

  /* ───────── Modal ───────── */
  var modal = document.getElementById("video-modal");
  var frame = document.getElementById("modal-frame");
  var closeBtn = document.getElementById("modal-close");
  var lastFocus = null;
  var prevBtn = document.getElementById("modal-prev");
  var nextBtn = document.getElementById("modal-next");
  var gallery = null; // { g: collaboration, i: photo affichée }

  function showGalleryImage(i) {
    var images = gallery.g.images;
    gallery.i = (i + images.length) % images.length;
    frame.innerHTML = "";
    frame.appendChild(el("img", { src: images[gallery.i], alt: gallery.g.title + " — photo " + (gallery.i + 1) }));
    document.getElementById("modal-cat").textContent = String(gallery.i + 1).padStart(2, "0") + " / " + String(images.length).padStart(2, "0");
  }

  function openGallery(g, i, trigger) {
    openModal({ image: g.images[i], title: g.title }, trigger);
    gallery = { g: g, i: i };
    var several = g.images.length > 1;
    prevBtn.hidden = nextBtn.hidden = !several;
    showGalleryImage(i);
  }
  prevBtn.addEventListener("click", function () { showGalleryImage(gallery.i - 1); });
  nextBtn.addEventListener("click", function () { showGalleryImage(gallery.i + 1); });

  function openModal(item, trigger) {
    lastFocus = trigger || document.activeElement;
    gallery = null;
    prevBtn.hidden = nextBtn.hidden = true;
    var v = parseVideo(item.video);
    frame.innerHTML = "";
    frame.classList.toggle("modal__frame--image", !!item.image);
    if (item.image) {
      frame.appendChild(el("img", { src: item.image, alt: item.title || "" }));
    } else if (v.kind === "file") {
      var video = el("video", { src: v.src, controls: "", playsinline: "", autoplay: "" });
      frame.appendChild(video);
    } else if (v.kind === "embed") {
      frame.appendChild(el("iframe", { src: v.src, title: item.title, allow: "autoplay; fullscreen; picture-in-picture", allowfullscreen: "" }));
    } else {
      frame.appendChild(el("div", { class: "modal__empty" }, [
        el("strong", { text: "Vidéo à venir" }),
        el("span", { text: "Ajoutez un fichier MP4, un lien YouTube ou Vimeo dans data/projects.js." })
      ]));
    }
    document.getElementById("modal-title").textContent = item.title || "";
    document.getElementById("modal-cat").textContent = item.category || "";
    modal.hidden = false;
    document.body.classList.add("is-locked");
    requestAnimationFrame(function () { modal.classList.add("is-open"); });
    closeBtn.focus();
  }

  function closeModal() {
    if (modal.hidden) return;
    modal.classList.remove("is-open");
    document.body.classList.remove("is-locked");
    var done = function () { modal.hidden = true; frame.innerHTML = ""; };
    reduceMotion ? done() : setTimeout(done, 350);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", function (e) {
    if (modal.hidden) return;
    if (e.key === "Escape") { closeModal(); return; }
    if (gallery && e.key === "ArrowLeft") { showGalleryImage(gallery.i - 1); return; }
    if (gallery && e.key === "ArrowRight") { showGalleryImage(gallery.i + 1); return; }
    if (e.key !== "Tab") return;
    var f = modal.querySelectorAll("button, video, iframe, a[href]");
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* ───────── Traînée d'affiches au curseur ───────── */
  // Les affiches apparaissent une à une en miniature sous la souris.
  var trailImages = POSTERS.map(function (p) { return p.image; }).filter(Boolean);
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (trailImages.length && finePointer && !reduceMotion && Element.prototype.animate) {
    trailImages.forEach(function (src) { new Image().src = src; });
    var trailIndex = 0, lastX = null, lastY = null, SPACING = 110;

    document.addEventListener("mousemove", function (e) {
      // Pas de traînée sur les éléments cliquables ni quand une vidéo est ouverte.
      if (!modal.hidden || e.target.closest("a, button, video, iframe, .contact__list")) { lastX = null; return; }
      if (lastX !== null && Math.hypot(e.clientX - lastX, e.clientY - lastY) < SPACING) return;
      lastX = e.clientX; lastY = e.clientY;

      var img = el("img", { class: "trail", src: trailImages[trailIndex], alt: "", "aria-hidden": "true" });
      trailIndex = (trailIndex + 1) % trailImages.length;
      img.style.left = e.clientX + "px";
      img.style.top = e.clientY + "px";
      document.body.appendChild(img);

      var tilt = (Math.random() * 10 - 5).toFixed(1) + "deg";
      img.animate([
        { opacity: 0, transform: "translate(-50%, -50%) scale(.6) rotate(" + tilt + ")" },
        { opacity: 1, transform: "translate(-50%, -50%) scale(1) rotate(" + tilt + ")", offset: .2 },
        { opacity: 1, transform: "translate(-50%, -50%) scale(1) rotate(" + tilt + ")", offset: .65 },
        { opacity: 0, transform: "translate(-50%, -60%) scale(.9) rotate(" + tilt + ")" }
      ], { duration: 1100, easing: "cubic-bezier(.2,.7,.2,1)", fill: "forwards" })
        .onfinish = function () { img.remove(); };
    });
  }

  /* ───────── Reveal animations ───────── */
  if (reduceMotion || !("IntersectionObserver" in window) || !Element.prototype.animate) return;

  var frames = {
    up: [{ opacity: 0, transform: "translateY(28px)" }, { opacity: 1, transform: "none" }],
    fade: [{ opacity: 0 }, { opacity: 1 }],
    mask: [{ transform: "translateY(105%)" }, { transform: "none" }],
    line: [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }]
  };
  var durations = { up: 1000, fade: 1200, mask: 1100, line: 1200 };

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      (en.target.__anims || []).forEach(function (a) { a.play(); });
      io.unobserve(en.target);
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });

  var revealNodes = document.querySelectorAll("[data-reveal]");
  revealNodes.forEach(function (node) {
    var type = node.getAttribute("data-reveal");
    var anim = node.animate(frames[type] || frames.up, {
      duration: durations[type] || 1000,
      delay: +(node.getAttribute("data-delay") || 0),
      easing: "cubic-bezier(.2,.7,.2,1)",
      fill: "both"
    });
    anim.pause();
    // Les titres "mask" démarrent hors du cadre : on observe leur conteneur.
    var target = type === "mask" ? node.parentElement : node;
    target.__anims = (target.__anims || []).concat(anim);
  });

  // Avec l'écran de chargement, le hero ne s'anime qu'au moment où le rideau se lève.
  function observeAll() {
    revealNodes.forEach(function (node) {
      io.observe(node.getAttribute("data-reveal") === "mask" ? node.parentElement : node);
    });
  }
  if (document.documentElement.classList.contains("pl-active") && !window.__preloaderDone) {
    window.addEventListener("preloader:done", observeAll, { once: true });
  } else {
    observeAll();
  }
})();
