// Tests de l'API des avis : node --test (base dans un dossier temporaire).
import { test, after } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

process.env.DATA_DIR = mkdtempSync(join(tmpdir(), "avis-"));
process.env.ADMIN_PASSWORD = "secret";
const { server, validate } = await import("./server.js");
await new Promise((r) => server.listen(0, r));
const base = `http://127.0.0.1:${server.address().port}`;
after(() => server.close());

const post = (body, ip = "1.1.1.1") => fetch(`${base}/api/feedback`, {
  method: "POST",
  headers: { "content-type": "application/json", "x-forwarded-for": ip },
  body: typeof body === "string" ? body : JSON.stringify(body),
});

test("validation", () => {
  assert.equal(validate({ type: "bug", message: "Ça plante" })[0], null);
  assert.equal(validate({ rating: 4 })[0], null);
  assert.equal(validate({ message: "" })[0], "empty");
  assert.equal(validate({ rating: 9, message: "x" })[0], "rating");
  assert.equal(validate({ message: "x", email: "pas-un-mail" })[0], "email");
  assert.equal(validate({ message: "x", website: "http://spam" })[0], "spam");
  assert.equal(validate({ type: "autre", message: "x" })[1].type, "review");
  assert.equal(validate({ message: "a".repeat(5000) })[1].message.length, 2000);
});

test("envoi, liste protégée, limite", async () => {
  let res = await post({ type: "idea", rating: 5, message: "Des vaches !", email: "a@b.fr", source: "game", progress: { prestige: 2 } });
  assert.equal(res.status, 201);
  assert.equal((await post("pas du json")).status, 400);
  assert.equal((await post({ message: "spam", website: "x" })).status, 200);
  res = await fetch(`${base}/api/feedback/admin`);
  assert.equal(res.status, 401);
  res = await fetch(`${base}/feedback/admin`, { headers: { authorization: "Basic " + Buffer.from("x:secret").toString("base64") } });
  const page = await res.text();
  assert.equal(res.status, 200);
  assert.match(page, /Des vaches !/);
  assert.doesNotMatch(page, /spam/);
  for (let i = 0; i < 5; i++) await post({ message: `n${i}` }, "9.9.9.9");
  assert.equal((await post({ message: "de trop" }, "9.9.9.9")).status, 429);
  assert.equal((await fetch(`${base}/api/health`)).status, 200);
});
