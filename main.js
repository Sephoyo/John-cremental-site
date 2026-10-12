// John'cremental — page de présentation.

// ===== À REMPLIR =====================================================
// Adresse de la page Steam (liste de souhaits) et de la démo (itch.io).
// Tant que l'une est vide, ses boutons mènent à la section correspondante
// de la page (la démo) ou affichent « Bientôt sur Steam ».
const LINKS = {
  steam: "",
  demo: "",
};
// =====================================================================

const EN = {
  skip: "Skip to content",
  nav_story: "Story",
  nav_game: "The game",
  nav_gallery: "Gallery",
  nav_faq: "FAQ",
  cta_wishlist_short: "Wishlist",
  hero_eyebrow: "Cozy incremental game · Pixel art",
  hero_tagline: "Your grandfather's farm is waiting. Bring it back to life.",
  hero_text: "Plant, harvest, hire goblins who work for a bowl of soup, then be reborn stronger with golden seeds. A farm that never stops growing.",
  cta_wishlist: "Add to my Steam wishlist",
  cta_demo: "Play the free demo",
  badge_free: "Free demo",
  badge_browser: "Playable in your browser",
  badge_save: "Auto-save",
  story_caption: "The farm of old, in the days of the golden seeds.",
  story_eyebrow: "Once upon a time in Blémont",
  story_title: "Long ago, the valley fed the whole kingdom.",
  story_p1: "Farmers sowed golden seeds there, entrusted to them by an old sage. Then came the storm. Years later, John returns to his grandfather's land: a ruined farm, a goblin asleep by the fire, and a letter.",
  story_p2: "Rebuild the farm, bring the village back to life… and find out what the old sage really knows about the golden seeds.",
  loop_eyebrow: "How it plays",
  loop_title: "A simple loop. A farm that grows forever.",
  loop_1_title: "Plant and sell",
  loop_1_text: "Radishes, wheat, pumpkins, sunflowers, potatoes… Every new seed earns more than the last.",
  loop_2_title: "Automate",
  loop_2_text: "Hire goblins from the mine: they harvest and replant for you, even while you're away.",
  loop_3_title: "Expand",
  loop_3_text: "Sprinkler, mill, animal pen, egg-laying hens: every upgrade changes the way you play.",
  loop_4_title: "Be reborn",
  loop_4_text: "When the old sage calls, start over keeping your unlocked seeds, with golden seeds and permanent bonuses. Every run goes further, and faster.",
  f1_title: "A village coming back to life",
  f1_text: "Grandma dozing on her bench, the blacksmith at his anvil, the washerwoman, the bard… And one fine day, Barnabé the breeder rolls in with his cart and his animals.",
  f2_title: "Hens, eggs, coins",
  f2_text: "Fix the old pen, buy hens from Barnabé and lead them to your farm yourself. They lay non-stop, and their eggs sell well at the market.",
  f3_title: "A farm that works for you",
  f3_text: "The ditch fills up, the mill turns, the goblins get busy and soup simmers at the camp. Take a break: your harvest will be waiting.",
  gallery_eyebrow: "Gallery",
  gallery_title: "A hand-crafted pixel art world",
  demo_eyebrow: "Free, right now",
  demo_title: "Try the demo in your browser",
  demo_text: "About two hours of play, three rebirths and Barnabé's arrival. Nothing to install, and your progress is saved automatically.",
  fact_free: "Free",
  fact_time: "≈ 2 h of play",
  fact_controls: "Keyboard and mouse",
  fact_lang: "EN, FR, ES, DE, PT-BR",
  cta_play_now: "Play now",
  wish_title: "Add John'cremental to your wishlist",
  wish_text: "It's free and takes ten seconds. For a small indie game, it's what matters most: every wishlist helps the game get seen on Steam, and you'll be notified the day it launches.",
  steam_note: "The Steam page is coming very soon. Meanwhile, the demo is free to play!",
  faq_title: "Frequently asked questions",
  q1: "What is an incremental game?",
  a1: "A game where your income keeps growing: you reinvest to produce more, you automate, then you start over stronger. John'cremental adds a real farm to explore, characters and a story.",
  q2: "When does the full game come out?",
  a2: "The game is in development. Wishlist it to be notified at launch; in the meantime, the demo is free to play.",
  q3: "Does the game progress when I'm not playing?",
  a3: "Yes: your goblins harvest and your hens lay eggs while you're away, for up to two hours. Your harvest is waiting when you come back.",
  q4: "What can I play on?",
  a4: "The full game is planned for PC (Steam). The demo runs right in your browser, with keyboard and mouse.",
  q5: "Is my game saved?",
  a5: "Yes, automatically, in your browser. Careful: in private browsing, or if you clear the site's data, your save is lost.",
  q6: "Which languages?",
  a6: "English, French, Spanish, German and Brazilian Portuguese, selectable from the game menu.",
  footer_demo: "Demo",
  footer_credits: "Pixel art based on the Sunnyside World asset pack. Sound effects: Kenney audio packs (kenney.nl, CC0). Intro ambience (OpenGameArt, CC0): “Birds and Wind” by Spring Spring (birds by isaiah658, syncopika and pauliuw), “Rain + Long Thunder” by WuxiaScrub. Fonts: MedievalSharp and Alegreya.",
  steam_soon: "Coming soon to Steam",
};
const FR_SOON = "Bientôt sur Steam";

// ---------- Langue ----------
const FR = {};
document.querySelectorAll("[data-i18n]").forEach((el) => { FR[el.dataset.i18n] = el.textContent; });
const FR_TITLE = document.title;
const EN_TITLE = "John'cremental — Bring your grandfather's farm back to life";

function storedLang() {
  try { return localStorage.getItem("lang"); } catch { return null; }
}
function storeLang(lang) {
  try { localStorage.setItem("lang", lang); } catch { /* stockage indisponible */ }
}

let lang = storedLang() || ((navigator.language || "fr").toLowerCase().startsWith("fr") ? "fr" : "en");

function applyLang() {
  const dict = lang === "en" ? EN : FR;
  document.documentElement.lang = lang;
  document.title = lang === "en" ? EN_TITLE : FR_TITLE;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const text = dict[el.dataset.i18n];
    if (text) el.textContent = text;
  });
  const toggle = document.getElementById("lang-toggle");
  toggle.textContent = lang === "en" ? "FR" : "EN";
  toggle.setAttribute("aria-label", lang === "en" ? "Passer en français" : "Switch to English");
  applyLinks();
}

document.getElementById("lang-toggle").addEventListener("click", () => {
  lang = lang === "en" ? "fr" : "en";
  storeLang(lang);
  applyLang();
});

// ---------- Liens Steam et démo ----------
function applyLinks() {
  document.querySelectorAll('[data-link="steam"]').forEach((el) => {
    if (LINKS.steam) {
      el.href = LINKS.steam;
      el.target = "_blank";
      el.rel = "noopener";
    } else {
      // Pas encore de page Steam : le bouton le dit, et mène à la démo.
      el.classList.add("is-soon");
      el.href = LINKS.demo || "#demo";
      const label = el.querySelector("[data-i18n]") || (el.dataset.i18n ? el : null);
      if (label && el.classList.contains("btn")) label.textContent = lang === "en" ? EN.steam_soon : FR_SOON;
    }
  });
  document.querySelectorAll('[data-link="demo"]').forEach((el) => {
    if (LINKS.demo) {
      el.href = LINKS.demo;
      el.target = "_blank";
      el.rel = "noopener";
    }
  });
  document.getElementById("steam-note").hidden = Boolean(LINKS.steam);
}

applyLang();

// ---------- Galerie ----------
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
document.querySelectorAll(".gallery__item").forEach((item) => {
  item.addEventListener("click", () => {
    const img = item.querySelector("img");
    lightboxImg.src = item.dataset.full;
    lightboxImg.alt = img.alt;
    lightbox.showModal();
  });
});
document.getElementById("lightbox-close").addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) lightbox.close(); });

// ---------- Animations ----------
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const video = document.querySelector(".hero__video");
if (reduceMotion && video) {
  video.removeAttribute("autoplay");
  video.pause();
} else if (video && "IntersectionObserver" in window) {
  // Le navigateur peut mettre en pause une vidéo hors de l'écran : on la relance
  // quand elle revient, et on l'arrête quand on ne la voit plus.
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) video.play().catch(() => {});
    else video.pause();
  }, { threshold: 0.1 }).observe(video);
}

if (!reduceMotion && "IntersectionObserver" in window) {
  const targets = document.querySelectorAll(".split, .card, .feature, .gallery__item, .demo, .wishlist__inner, .faq details");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  targets.forEach((el) => { el.classList.add("reveal"); observer.observe(el); });
}
