// Avis des joueurs de John'cremental : le site et le jeu envoient leurs avis ici.
//
// - POST /api/feedback : un avis (JSON), rangé dans une base SQLite (DATA_DIR/feedback.db) ;
//   si DISCORD_WEBHOOK_URL est réglé, il est aussi posté dans un salon Discord.
// - GET /api/feedback/admin : la liste des avis (mot de passe ADMIN_PASSWORD, demandé par
//   le navigateur) ; GET /api/feedback/admin.csv : la même chose en tableur ;
//   GET /api/feedback/save/<id> : la sauvegarde jointe à un bug (save.json du jeu, à
//   déposer dans le dossier de sauvegarde pour rejouer la partie du joueur).
// - GET /api/health : « ok ».
// Les chemins marchent aussi sans le préfixe /api (si le proxy le retire).
// Aucune dépendance : Node 24 (node:sqlite). Garde-fous : taille limitée, champs vérifiés,
// champ piège contre les robots, 5 avis par 10 minutes et par adresse IP. L'adresse IP
// n'est pas gardée telle quelle (empreinte salée).

import { createServer } from "node:http";
import { createHash, timingSafeEqual } from "node:crypto";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";

const PORT = Number(process.env.PORT || 3000);
const DATA_DIR = process.env.DATA_DIR || "./data";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || "";
const IP_SALT = process.env.IP_SALT || "john-cremental";
// Origines autorisées à appeler l'API depuis un navigateur, si elle n'est pas sur le même
// domaine que le site (liste séparée par des virgules ; vide : même domaine seulement).
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "").split(",").map((o) => o.trim()).filter(Boolean);

const TYPES = ["review", "bug", "idea"];
const LIMITS = { message: 2000, email: 200, lang: 10, version: 20, platform: 20, source: 10, progress: 600, save: 60000 };
const MAX_BODY = 64 * 1024;
const RATE_WINDOW = 10 * 60 * 1000;
const RATE_MAX = 5;

mkdirSync(DATA_DIR, { recursive: true });
const db = new DatabaseSync(join(DATA_DIR, "feedback.db"));
db.exec(`CREATE TABLE IF NOT EXISTS feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL,
  type TEXT NOT NULL,
  rating INTEGER,
  message TEXT NOT NULL,
  email TEXT,
  source TEXT,
  lang TEXT,
  version TEXT,
  platform TEXT,
  progress TEXT,
  ip_hash TEXT
)`);
// Colonne ajoutée après coup (bases déjà créées) : la sauvegarde jointe aux bugs.
if (!db.prepare("PRAGMA table_info(feedback)").all().some((c) => c.name === "save")) {
  db.exec("ALTER TABLE feedback ADD COLUMN save TEXT");
}
const insert = db.prepare(`INSERT INTO feedback
  (created_at, type, rating, message, email, source, lang, version, platform, progress, ip_hash, save)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
const listAll = db.prepare("SELECT *, save IS NOT NULL AS has_save FROM feedback ORDER BY id DESC");
const getSave = db.prepare("SELECT save FROM feedback WHERE id = ?");

const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW);
  if (recent.length >= RATE_MAX) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

// Nettoyage des compteurs de temps en temps (sinon la table grossit sans fin).
setInterval(() => {
  const now = Date.now();
  for (const [ip, times] of hits) {
    if (times.every((t) => now - t >= RATE_WINDOW)) hits.delete(ip);
  }
}, RATE_WINDOW).unref();

function clientIp(req) {
  const forwarded = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return forwarded || req.socket.remoteAddress || "";
}

function text(value, max) {
  if (value === undefined || value === null) return "";
  return String(value).replace(/\u0000/g, "").trim().slice(0, max);
}

// Vérifie un avis ; renvoie [erreur, avis propre].
export function validate(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) return ["format", null];
  // Champ piège : invisible pour un humain, rempli par les robots.
  if (text(body.website, 200) !== "") return ["spam", null];
  const type = TYPES.includes(body.type) ? body.type : "review";
  let rating = null;
  if (body.rating !== undefined && body.rating !== null && body.rating !== "") {
    rating = Number(body.rating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) return ["rating", null];
  }
  const message = text(body.message, LIMITS.message);
  if (message === "" && rating === null) return ["empty", null];
  const email = text(body.email, LIMITS.email);
  if (email !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return ["email", null];
  let progress = "";
  if (body.progress && typeof body.progress === "object") progress = JSON.stringify(body.progress).slice(0, LIMITS.progress);
  // La sauvegarde n'est gardée que pour un bug, entière (tronquée, elle ne servirait à rien).
  let save = null;
  if (type === "bug" && body.save && typeof body.save === "object" && !Array.isArray(body.save)) {
    const text = JSON.stringify(body.save);
    if (text.length <= LIMITS.save) save = text;
  }
  return [null, {
    type, rating, message, email,
    source: text(body.source, LIMITS.source) || "site",
    lang: text(body.lang, LIMITS.lang),
    version: text(body.version, LIMITS.version),
    platform: text(body.platform, LIMITS.platform),
    progress,
    save,
  }];
}

async function notifyDiscord(entry) {
  if (!DISCORD_WEBHOOK_URL) return;
  const stars = entry.rating ? "★".repeat(entry.rating) + "☆".repeat(5 - entry.rating) : "—";
  const label = { review: "Avis", bug: "Bug", idea: "Idée" }[entry.type];
  const details = [entry.source, entry.platform, entry.version && `v${entry.version}`, entry.lang].filter(Boolean).join(" · ");
  try {
    await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        // Pas de mentions (@everyone…) déclenchées par le texte d'un joueur.
        allowed_mentions: { parse: [] },
        embeds: [{
          title: `${label} ${stars}`,
          description: (entry.message || "(pas de message)").slice(0, 3900),
          footer: { text: [details, entry.email ? "e-mail laissé" : "", entry.save ? "partie jointe" : "", entry.progress].filter(Boolean).join(" · ").slice(0, 2000) },
          timestamp: new Date().toISOString(),
        }],
      }),
      signal: AbortSignal.timeout(5000),
    });
  } catch (err) {
    console.error("Discord :", err.message);
  }
}

function send(res, status, body, headers = {}) {
  const isText = typeof body === "string";
  res.writeHead(status, {
    "content-type": isText ? "text/html; charset=utf-8" : "application/json",
    "x-content-type-options": "nosniff",
    ...headers,
  });
  res.end(isText ? body : JSON.stringify(body));
}

function corsHeaders(req) {
  const origin = req.headers.origin;
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) return {};
  return {
    "access-control-allow-origin": origin,
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "content-type",
    vary: "origin",
  };
}

function authorized(req) {
  if (!ADMIN_PASSWORD) return false;
  const header = String(req.headers.authorization || "");
  if (!header.startsWith("Basic ")) return false;
  const given = Buffer.from(header.slice(6), "base64").toString().split(":").slice(1).join(":");
  const a = createHash("sha256").update(given).digest();
  const b = createHash("sha256").update(ADMIN_PASSWORD).digest();
  return timingSafeEqual(a, b);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

function adminPage(rows) {
  const count = rows.length;
  const rated = rows.filter((r) => r.rating);
  const average = rated.length ? (rated.reduce((s, r) => s + r.rating, 0) / rated.length).toFixed(1) : "—";
  const lines = rows.map((r) => `<tr>
    <td>${escapeHtml(r.created_at.replace("T", " ").slice(0, 16))}</td>
    <td>${escapeHtml({ review: "Avis", bug: "Bug", idea: "Idée" }[r.type] || r.type)}</td>
    <td>${r.rating ? "★".repeat(r.rating) : ""}</td>
    <td class="msg">${escapeHtml(r.message)}</td>
    <td>${escapeHtml(r.email)}</td>
    <td>${escapeHtml([r.source, r.platform, r.version, r.lang].filter(Boolean).join(" · "))}<br><small>${escapeHtml(r.progress)}</small>${r.has_save ? `<br><a href="save/${r.id}">télécharger la partie (save.json)</a>` : ""}</td>
  </tr>`).join("");
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Avis — John'cremental</title><style>
body{font-family:system-ui,sans-serif;margin:24px;background:#1f1820;color:#fff2d8}
h1{margin:0 0 8px}a{color:#face6e}table{border-collapse:collapse;width:100%;margin-top:16px}
td,th{border-bottom:1px solid #4a2f22;padding:8px;text-align:left;vertical-align:top}
th{color:#face6e}.msg{white-space:pre-wrap;max-width:520px}small{color:#c9ad7a}
</style></head><body><h1>Avis des joueurs</h1>
<p>${count} avis · note moyenne ${average} / 5 · <a href="admin.csv">télécharger en CSV</a></p>
<table><tr><th>Date (UTC)</th><th>Type</th><th>Note</th><th>Message</th><th>E-mail</th><th>D'où</th></tr>${lines}</table>
</body></html>`;
}

function csv(rows) {
  const cols = ["id", "created_at", "type", "rating", "message", "email", "source", "lang", "version", "platform", "progress", "has_save"];
  const cell = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [cols.join(","), ...rows.map((r) => cols.map((c) => cell(r[c])).join(","))].join("\n");
}

async function readJson(req) {
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY) throw new Error("too_large");
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "null");
}

export const server = createServer(async (req, res) => {
  const path = new URL(req.url, "http://localhost").pathname.replace(/^\/api/, "").replace(/\/+$/, "") || "/";
  try {
    if (req.method === "OPTIONS" && path === "/feedback") {
      return send(res, 204, {}, corsHeaders(req));
    }
    if (req.method === "GET" && path === "/health") return send(res, 200, { ok: true });
    if (req.method === "POST" && path === "/feedback") {
      const cors = corsHeaders(req);
      if (rateLimited(clientIp(req))) return send(res, 429, { ok: false, error: "rate" }, cors);
      let body;
      try {
        body = await readJson(req);
      } catch (err) {
        return send(res, err.message === "too_large" ? 413 : 400, { ok: false, error: "format" }, cors);
      }
      const [error, entry] = validate(body);
      // Un robot pris au piège croit que tout s'est bien passé.
      if (error === "spam") return send(res, 200, { ok: true }, cors);
      if (error) return send(res, 400, { ok: false, error }, cors);
      const ipHash = createHash("sha256").update(IP_SALT + clientIp(req)).digest("hex").slice(0, 16);
      insert.run(new Date().toISOString(), entry.type, entry.rating, entry.message, entry.email, entry.source,
        entry.lang, entry.version, entry.platform, entry.progress, ipHash, entry.save);
      notifyDiscord(entry);
      return send(res, 201, { ok: true }, cors);
    }
    const saveMatch = path.match(/^\/feedback\/(?:admin\/)?save\/(\d+)$/);
    if (req.method === "GET" && saveMatch) {
      if (!authorized(req)) {
        return send(res, 401, "Mot de passe requis.", { "www-authenticate": 'Basic realm="Avis John\'cremental", charset="UTF-8"' });
      }
      const row = getSave.get(Number(saveMatch[1]));
      if (!row || !row.save) return send(res, 404, { ok: false, error: "not_found" });
      res.writeHead(200, {
        "content-type": "application/json; charset=utf-8",
        "content-disposition": `attachment; filename="save.json"`,
        "cache-control": "no-store",
      });
      return res.end(JSON.stringify(JSON.parse(row.save), null, "\t"));
    }
    if (req.method === "GET" && (path === "/feedback/admin" || path === "/feedback/admin.csv")) {
      if (!authorized(req)) {
        return send(res, 401, "Mot de passe requis.", { "www-authenticate": 'Basic realm="Avis John\'cremental", charset="UTF-8"' });
      }
      const rows = listAll.all();
      if (path.endsWith(".csv")) {
        res.writeHead(200, { "content-type": "text/csv; charset=utf-8", "content-disposition": 'attachment; filename="avis.csv"' });
        return res.end("﻿" + csv(rows));
      }
      return send(res, 200, adminPage(rows), { "cache-control": "no-store" });
    }
    return send(res, 404, { ok: false, error: "not_found" });
  } catch (err) {
    console.error(err);
    return send(res, 500, { ok: false, error: "server" });
  }
});

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  server.listen(PORT, () => console.log(`Avis : http://localhost:${PORT}/api/health`));
}
