// Findet Seiten mit zu ähnlichem Text (Gefahr "Doorway Pages").
// Vergleicht 5-Wort-Folgen (Shingles) aller Seiten eines Typs paarweise.
// Aufruf: node tools/seo/aehnlich.mjs [typ] [schwelle=0.12]

import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { dateiFuer, text } from "./check.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const PLAN = JSON.parse(readFileSync(join(ROOT, "tools/seo/plan.json"), "utf8"));
const typ = process.argv[2], schwelle = Number(process.argv[3] || 0.12);

const seiten = PLAN.filter(p => !typ || p.typ === typ).filter(p => existsSync(dateiFuer(p))).map(p => {
  const j = JSON.parse(readFileSync(dateiFuer(p), "utf8"));
  // Ortsnamen und Leistungsnamen neutralisieren, damit reine Namenstausch-Texte auffallen
  let t = [j.lead, ...j.abschnitte.map(a => text(a.html)), ...j.faq.map(q => q.a)].join(" ").toLowerCase();
  for (const n of [p.ortName, p.titel].filter(Boolean)) t = t.split(n.toLowerCase()).join(" ORT ");
  const w = t.match(/[\p{L}\p{N}]+/gu) || [];
  const sh = new Set(); for (let i = 0; i + 5 <= w.length; i++) sh.add(w.slice(i, i + 5).join(" "));
  return { p, sh };
});

const treffer = [];
for (let i = 0; i < seiten.length; i++) for (let k = i + 1; k < seiten.length; k++) {
  const a = seiten[i], b = seiten[k]; if (a.p.typ !== b.p.typ) continue;
  let gemeinsam = 0; for (const s of a.sh) if (b.sh.has(s)) gemeinsam++;
  const j = gemeinsam / (a.sh.size + b.sh.size - gemeinsam || 1);
  if (j >= schwelle) treffer.push([j, a.p.pfad, b.p.pfad]);
}
treffer.sort((x, y) => y[0] - x[0]);
for (const [j, a, b] of treffer.slice(0, 40)) console.log(`${(j * 100).toFixed(1)} %  ${a}  ↔  ${b}`);
console.log(`\n${seiten.length} Seiten geprüft, ${treffer.length} Paare ab ${(schwelle * 100).toFixed(0)} % Übereinstimmung`);
