// John'cremental — page de présentation.

// ===== À REMPLIR =====================================================
// Adresse de la page Steam (liste de souhaits) et de la démo (la version web du jeu,
// exportée dans demo/ : voir LISEZMOI.md).
// Tant que l'une est vide, ses boutons mènent à la section correspondante
// de la page (la démo) ou affichent « Bientôt sur Steam ».
const LINKS = {
  steam: "",
  demo: "demo/",
  // API des avis (feedback-api/, déployée sur le même domaine, chemin /api).
  feedback: "/api/feedback",
};
// =====================================================================

const EN = {
  skip: "Skip to content",
  nav_story: "Story",
  nav_game: "The game",
  nav_gallery: "Gallery",
  nav_faq: "FAQ",
  nav_feedback: "Feedback",
  fb_eyebrow: "Your feedback",
  fb_title: "Tell me what you think",
  fb_text: "A bug, an idea, a favourite moment? Every message is read, and it helps shape the full game.",
  fb_type: "It's…",
  fb_review: "A review",
  fb_bug: "A bug",
  fb_idea: "An idea",
  fb_rating: "Your rating (optional)",
  fb_star1: "1 star", fb_star2: "2 stars", fb_star3: "3 stars", fb_star4: "4 stars", fb_star5: "5 stars",
  fb_message: "Your message",
  fb_message_ph: "What did you like? What bothered you?",
  fb_email: "Email (optional)",
  fb_email_ph: "If you'd like a reply",
  fb_privacy: "Your email is only used to reply to you. It is never shared.",
  fb_send: "Send",
  fb_sending: "Sending…",
  fb_thanks: "Thank you! Your message has been sent.",
  fb_empty: "Write a message or pick a rating.",
  fb_bad_email: "This email address doesn't look right.",
  fb_rate: "Too many messages in a short time: try again in a few minutes.",
  fb_error: "The message couldn't be sent. Please try again later.",
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
  gallery_text: "From sunrise to nights lit by fireflies, the valley lives at its own pace.",
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
// La page est écrite en anglais (langue par défaut) ; le français est une traduction.
const FR = {
  skip: "Aller au contenu",
  nav_story: "L'histoire",
  nav_game: "Le jeu",
  nav_gallery: "Galerie",
  nav_faq: "FAQ",
  nav_feedback: "Ton avis",
  fb_eyebrow: "Ton avis",
  fb_title: "Dis-moi ce que tu en penses",
  fb_text: "Un bug, une idée, un moment préféré ? Chaque message est lu, et il aide à construire le jeu complet.",
  fb_type: "C'est…",
  fb_review: "Un avis",
  fb_bug: "Un bug",
  fb_idea: "Une idée",
  fb_rating: "Ta note (facultatif)",
  fb_star1: "1 étoile", fb_star2: "2 étoiles", fb_star3: "3 étoiles", fb_star4: "4 étoiles", fb_star5: "5 étoiles",
  fb_message: "Ton message",
  fb_message_ph: "Qu'est-ce qui t'a plu ? Qu'est-ce qui t'a gêné ?",
  fb_email: "E-mail (facultatif)",
  fb_email_ph: "Si tu veux une réponse",
  fb_privacy: "Ton e-mail ne sert qu'à te répondre. Il n'est jamais partagé.",
  fb_send: "Envoyer",
  fb_sending: "Envoi…",
  fb_thanks: "Merci ! Ton message est bien envoyé.",
  fb_empty: "Écris un message ou choisis une note.",
  fb_bad_email: "Cette adresse e-mail ne semble pas correcte.",
  fb_rate: "Trop de messages en peu de temps : réessaie dans quelques minutes.",
  fb_error: "Le message n'a pas pu partir. Réessaie un peu plus tard.",
  cta_wishlist_short: "Liste de souhaits",
  hero_eyebrow: "Jeu incrémental cosy · Pixel art",
  hero_tagline: "La ferme de ton grand-père t'attend. Fais-la renaître.",
  hero_text: "Plante, récolte, embauche des gobelins qui travaillent pour un bol de soupe, puis renais plus fort grâce aux graines d'or. Une ferme qui n'arrête jamais de pousser.",
  cta_wishlist: "Ajouter à ma liste de souhaits",
  cta_demo: "Jouer à la démo gratuite",
  badge_free: "Démo gratuite",
  badge_browser: "Jouable dans le navigateur",
  badge_save: "Sauvegarde automatique",
  story_caption: "La ferme d'autrefois, au temps des graines d'or.",
  story_eyebrow: "Il était une fois Blémont",
  story_title: "Autrefois, la vallée nourrissait tout le royaume.",
  story_p1: "On y semait des graines d'or, confiées aux fermiers par un vieux sage. Puis vint l'orage. Des années plus tard, John revient sur les terres de son grand-père : une ferme en ruine, un gobelin endormi près du feu, et une lettre.",
  story_p2: "À toi de remettre la ferme sur pied, de ranimer le village… et de découvrir ce que le vieux sage sait vraiment des graines d'or.",
  loop_eyebrow: "Comment on joue",
  loop_title: "Une boucle simple. Une ferme qui grandit sans fin.",
  loop_1_title: "Plante et vends",
  loop_1_text: "Radis, blé, citrouille, tournesol, pomme de terre… Chaque nouvelle graine rapporte plus que la précédente.",
  loop_2_title: "Automatise",
  loop_2_text: "Embauche les gobelins de la mine : ils récoltent et replantent pour toi, même quand tu t'absentes.",
  loop_3_title: "Développe",
  loop_3_text: "Arroseur, moulin, enclos, poules pondeuses : chaque amélioration change ta façon de jouer.",
  loop_4_title: "Renais",
  loop_4_text: "Quand le vieux sage t'appelle, recommence en gardant tes graines débloquées, avec des graines dorées et des bonus permanents. Chaque partie va plus loin, et plus vite.",
  f1_title: "Un village qui reprend vie",
  f1_text: "La grand-mère qui somnole sur son banc, le forgeron à son enclume, la lavandière, le barde… Et un beau jour, Barnabé l'éleveur arrive en charrette avec ses bêtes.",
  f2_title: "Des poules, des œufs, des pièces",
  f2_text: "Répare le vieil enclos, achète des poules à Barnabé et mène-les toi-même jusqu'à la ferme. Elles pondent sans relâche, et leurs œufs se vendent cher au marché.",
  f3_title: "Une ferme qui travaille pour toi",
  f3_text: "Le fossé se remplit, le moulin tourne, les gobelins s'activent et la soupe mijote au camp. Fais une pause : en revenant, la récolte t'attend.",
  gallery_eyebrow: "Galerie",
  gallery_title: "Un monde en pixel art fait main",
  gallery_text: "Du lever du jour aux nuits de lucioles, la vallée vit à son rythme.",
  demo_eyebrow: "Gratuit, tout de suite",
  demo_title: "Essaie la démo dans ton navigateur",
  demo_text: "Environ deux heures de jeu, trois renaissances et l'arrivée de Barnabé. Rien à installer, et ta progression est sauvegardée automatiquement.",
  fact_free: "Gratuite",
  fact_time: "≈ 2 h de jeu",
  fact_controls: "Clavier et souris",
  fact_lang: "EN, FR, ES, DE, PT-BR",
  cta_play_now: "Jouer maintenant",
  wish_title: "Ajoute John'cremental à ta liste de souhaits",
  wish_text: "C'est gratuit et ça prend dix secondes. Pour un petit jeu indépendant, c'est ce qui compte le plus : chaque liste de souhaits aide le jeu à être vu sur Steam, et tu seras prévenu dès sa sortie.",
  steam_note: "La page Steam arrive très bientôt. En attendant, la démo est jouable gratuitement !",
  faq_title: "Questions fréquentes",
  q1: "C'est quoi, un jeu incrémental ?",
  a1: "Un jeu où tes gains grandissent sans cesse : tu réinvestis pour produire plus, tu automatises, puis tu recommences plus fort. John'cremental y ajoute une vraie ferme à parcourir, des personnages et une histoire.",
  q2: "Quand sort le jeu complet ?",
  a2: "Le jeu est en développement. Ajoute-le à ta liste de souhaits pour être prévenu de sa sortie ; en attendant, la démo est jouable gratuitement.",
  q3: "Le jeu avance quand je ne joue pas ?",
  a3: "Oui : tes gobelins récoltent et tes poules pondent pendant ton absence, jusqu'à deux heures comptées. Tu retrouves ta récolte en revenant.",
  q4: "Sur quoi peut-on jouer ?",
  a4: "Le jeu complet est prévu sur PC (Steam). La démo se joue directement dans le navigateur, au clavier et à la souris.",
  q6: "Dans quelles langues ?",
  a6: "Anglais, français, espagnol, allemand et portugais du Brésil, au choix dans le menu du jeu.",
  q5: "Ma partie est-elle sauvegardée ?",
  a5: "Oui, automatiquement, dans ton navigateur. Attention : en navigation privée, ou si tu effaces les données du site, la partie est perdue.",
  footer_demo: "Démo",
  footer_credits: "Pixel art basé sur le pack Sunnyside World. Bruitages : packs audio de Kenney (kenney.nl, CC0). Ambiances de l'intro (OpenGameArt, CC0) : « Birds and Wind » de Spring Spring (oiseaux d'isaiah658, syncopika et pauliuw), « Rain + Long Thunder » de WuxiaScrub. Polices MedievalSharp et Alegreya.",
};
// Le titre de l'onglet reste le nom du jeu, dans les deux langues.
const FR_TITLE = "John'cremental";
const EN_TITLE = "John'cremental";

function storedLang() {
  try { return localStorage.getItem("lang"); } catch { return null; }
}
function storeLang(lang) {
  try { localStorage.setItem("lang", lang); } catch { /* stockage indisponible */ }
}

// Anglais par défaut, pour tout le monde ; le bouton FR passe en français (choix retenu).
let lang = storedLang() || "en";

function applyLang() {
  const dict = lang === "en" ? EN : FR;
  document.documentElement.lang = lang;
  document.title = lang === "en" ? EN_TITLE : FR_TITLE;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const text = dict[el.dataset.i18n];
    if (text) el.textContent = text;
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const text = dict[el.dataset.i18nPlaceholder];
    if (text) el.placeholder = text;
  });
  const toggle = document.getElementById("lang-toggle");
  toggle.textContent = lang === "en" ? "FR" : "EN";
  toggle.setAttribute("aria-label", lang === "en" ? "Passer en français" : "Switch to English");
  applyShots();
  applyLinks();
}

// Les captures du jeu existent en anglais et en français (assets/shots/en|fr) : on montre
// celles de la langue choisie, dans la page comme dans la visionneuse.
const SHOTS_VERSION = 4;
function applyShots() {
  document.querySelectorAll("img[data-shot]").forEach((img) => {
    const src = `assets/shots/${lang}/${img.dataset.shot}.png?v=${SHOTS_VERSION}`;
    if (img.getAttribute("src") !== src) img.setAttribute("src", src);
    const item = img.closest(".gallery__item");
    if (item) item.dataset.full = src;
  });
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

// ---------- Avis ----------
const feedbackForm = document.getElementById("feedback-form");
if (feedbackForm) {
  const status = document.getElementById("feedback-status");
  const sendButton = document.getElementById("feedback-send");
  const stars = [...document.querySelectorAll("#feedback-stars label")];
  // Les étoiles s'allument jusqu'à celle survolée, sinon jusqu'à celle choisie.
  const paintStars = (upTo) => stars.forEach((label, i) => label.classList.toggle("is-on", i < upTo));
  const chosen = () => Number(feedbackForm.querySelector('input[name="rating"]:checked')?.value || 0);
  stars.forEach((label, i) => {
    label.addEventListener("mouseenter", () => paintStars(i + 1));
    label.addEventListener("mouseleave", () => paintStars(chosen()));
    label.querySelector("input").addEventListener("change", () => paintStars(chosen()));
  });
  const say = (key, ok) => {
    status.textContent = (lang === "en" ? EN : FR)[key];
    status.classList.toggle("is-ok", Boolean(ok));
    status.classList.toggle("is-error", !ok);
  };
  feedbackForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(feedbackForm);
    const body = {
      type: data.get("type"),
      rating: chosen() || null,
      message: String(data.get("message") || "").trim(),
      email: String(data.get("email") || "").trim(),
      website: data.get("website"),
      source: "site",
      lang,
    };
    if (!body.message && !body.rating) return say("fb_empty", false);
    if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) return say("fb_bad_email", false);
    sendButton.disabled = true;
    status.classList.remove("is-ok", "is-error");
    status.textContent = (lang === "en" ? EN : FR).fb_sending;
    try {
      const res = await fetch(LINKS.feedback, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        feedbackForm.reset();
        paintStars(0);
        say("fb_thanks", true);
      } else {
        say(res.status === 429 ? "fb_rate" : "fb_error", false);
      }
    } catch {
      say("fb_error", false);
    } finally {
      sendButton.disabled = false;
    }
  });
}

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
