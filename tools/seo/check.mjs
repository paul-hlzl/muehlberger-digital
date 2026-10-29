// Prüft die Inhaltsdateien in content/ gegen Plan und Briefing.
// Aufruf: node tools/seo/check.mjs [batch | typ | alle]   (ohne Argument: alle)
// Exit-Code 1, wenn Fehler gefunden wurden. Warnungen brechen nicht ab.

import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const PLAN = JSON.parse(readFileSync(join(ROOT, "tools/seo/plan.json"), "utf8"));
const PFADE = new Set([...PLAN.map(p => p.pfad), "/", "/leistungen/", "/produkte/", "/gratis-check/", "/branchen/", "/regionen/", "/wissen/", "/glossar/", "/vergleiche/", "/seitenuebersicht/"]);

export const CHECK_KEYS = ["website-entwurf", "seo-check", "ki-sichtbarkeit", "chatbot-test", "neukunden-finden", "social-media-test"];
export const EXTERN = [
  "https://www.pipeline-solutions.at/", "https://www.pipeline-solutions.at/gratis-test/", "https://www.pipeline-solutions.at/seo-check/",
  "https://www.pipeline-solutions.at/leistungen/", "https://www.pipeline-solutions.at/automatisierungen/", "https://www.pipeline-solutions.at/referenzen/",
  "https://www.pipeline-solutions.at/produkte/", "https://www.pipeline-solutions.at/at/oberoesterreich/",
  "https://partner.pipeline-solutions.at/", "https://partner.pipeline-solutions.at/provisionsrechner/",
  "https://pipebot.at/", "https://pipebot.at/#gratis-check", "https://noteit.at/", "https://noteit.at/registrieren",
  "https://sightup.at/", "https://pipeflow.at/", "https://app.pipeflow.at/start", "https://hittaro.com/", "https://hittaro.com/check", "https://zusage.at/",
  "https://www.wko.at/", "https://www.ris.bka.gv.at/", "https://www.dsb.gv.at/", "https://www.usp.gv.at/", "https://www.rtr.at/", "https://www.nic.at/",
];
const LAENGE = {
  leistung: [1000, 1400, 5, 7, 5, 6], produkt: [700, 1000, 4, 6, 4, 5], check: [450, 700, 3, 5, 3, 4], sonstige: [500, 900, 3, 6, 3, 10],
  branche: [800, 1100, 5, 6, 4, 5], region: [550, 850, 4, 5, 3, 4], kombi: [500, 750, 4, 5, 3, 4], wissen: [900, 1400, 5, 8, 4, 5],
  glossar: [280, 450, 2, 3, 2, 3], vergleich: [800, 1100, 5, 7, 4, 5],
};
const TAGS = new Set(["p", "ul", "ol", "li", "strong", "em", "a", "h3", "table", "thead", "tbody", "tr", "th", "td", "br"]);
const VERBOTEN = [/in der heutigen digitalen welt/i, /game ?changer/i, /revolution(är|ieren)/i, /tauchen wir ein/i, /platz 1 garantiert/i, /garantiert (auf )?platz/i, /!!/, /\p{Extended_Pictographic}/u];

export const dateiFuer = p => join(ROOT, "content", p.typ, p.slug.replace(/\//g, "__") + ".json");
export const text = html => html.replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/gi, " ");
export const woerter = s => (s.match(/[\p{L}\p{N}][\p{L}\p{N}'’.-]*/gu) || []).length;

export function pruefe(p, j) {
  const f = [], w = [];
  if (j.pfad !== p.pfad) f.push(`pfad ist "${j.pfad}", erwartet "${p.pfad}"`);
  for (const k of ["title", "description", "h1", "kicker", "lead"]) if (typeof j[k] !== "string" || !j[k].trim()) f.push(`Feld ${k} fehlt`);
  if (!Array.isArray(j.abschnitte) || !j.abschnitte.length) { f.push("abschnitte fehlen"); return { f, w, n: 0 }; }
  const tl = (j.title || "").length, dl = (j.description || "").length;
  if (tl < 30 || tl > 62) f.push(`title hat ${tl} Zeichen (35–60)`);
  if (dl < 110 || dl > 165) f.push(`description hat ${dl} Zeichen (120–158)`);
  if (/mühlberger digital/i.test(j.title || "")) w.push("Markenname im title (hängt der Generator an)");
  const [wmin, wmax, amin, amax, fmin, fmax] = LAENGE[p.typ];
  const html = j.abschnitte.map(a => a.html || "").join(" ");
  const alles = [j.lead, ...(j.fakten || []), ...j.abschnitte.map(a => a.h2 + " " + text(a.html || "")), ...(j.faq || []).map(q => q.q + " " + q.a)].join(" ");
  const n = woerter(alles);
  if (n < wmin * 0.9) f.push(`nur ${n} Wörter (mindestens ${wmin})`); else if (n < wmin) w.push(`${n} Wörter, knapp unter ${wmin}`);
  if (n > wmax * 1.25) w.push(`${n} Wörter, deutlich über ${wmax}`);
  if (j.abschnitte.length < amin || j.abschnitte.length > amax + 1) f.push(`${j.abschnitte.length} Abschnitte (${amin}–${amax})`);
  const fq = (j.faq || []).length; if (fq < fmin || fq > fmax + 1) f.push(`${fq} FAQ (${fmin}–${fmax})`);
  if (!Array.isArray(j.fakten) || j.fakten.length < 3 || j.fakten.length > 6) f.push("fakten: 3–5 Stichpunkte");
  for (const a of j.abschnitte) {
    if (!a.h2) f.push("Abschnitt ohne h2");
    for (const m of (a.html || "").matchAll(/<\/?([a-zA-Z0-9]+)([^>]*)>/g)) {
      const tag = m[1].toLowerCase();
      if (!TAGS.has(tag)) f.push(`unerlaubtes Tag <${tag}>`);
      if (/\s(class|style|on\w+)=/i.test(m[2])) f.push(`Attribut in <${tag}> nicht erlaubt`);
    }
  }
  const links = [...html.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
  const ext = links.filter(l => /^https?:/.test(l)), int = links.filter(l => !/^https?:/.test(l));
  for (const l of int) if (!PFADE.has(l.split("#")[0])) f.push(`interner Link nicht im Plan: ${l}`);
  for (const l of ext) if (!EXTERN.includes(l)) f.push(`externer Link nicht erlaubt: ${l}`);
  if (ext.length > 4) f.push(`${ext.length} externe Links (max. 4)`);
  if (new Set(int).size < 3 && p.typ !== "glossar") w.push(`nur ${new Set(int).size} interne Links im Text (3–6)`);
  if (p.typ === "glossar" && new Set(int).size < 1) w.push("Glossar ohne internen Link");
  if (!Array.isArray(j.verwandt) || j.verwandt.length < 3 || j.verwandt.length > 6) f.push("verwandt: 3–6 Pfade");
  for (const v of j.verwandt || []) if (!PFADE.has(v)) f.push(`verwandt nicht im Plan: ${v}`); else if (v === p.pfad) f.push("verwandt verweist auf sich selbst");
  if (!Array.isArray(j.checks) || !j.checks.length || j.checks.length > 2) f.push("checks: 1–2 Schlüssel");
  for (const c of j.checks || []) if (!CHECK_KEYS.includes(c)) f.push(`unbekannter Check: ${c}`);
  for (const q of j.faq || []) if (!q.q || !q.a) f.push("FAQ ohne Frage oder Antwort");
  const roh = JSON.stringify(j);
  for (const r of VERBOTEN) if (r.test(roh)) f.push(`verbotene Formulierung: ${r}`);
  if (p.typ === "vergleich" && !/<table/i.test(html)) f.push("Vergleich ohne Tabelle");
  return { f, w, n };
}

function main() {
  const arg = process.argv[2] || "alle";
  const auswahl = PLAN.filter(p => arg === "alle" || p.batch === arg || p.typ === arg);
  if (!auswahl.length) { console.error("Keine Seiten für", arg); process.exit(2); }
  // Titel über alle vorhandenen Dateien auf Dubletten prüfen
  const titel = new Map(), beschr = new Map();
  for (const p of PLAN) { const d = dateiFuer(p); if (!existsSync(d)) continue; try { const j = JSON.parse(readFileSync(d, "utf8")); titel.set(j.title, [...(titel.get(j.title) || []), p.pfad]); beschr.set(j.description, [...(beschr.get(j.description) || []), p.pfad]); } catch {} }
  let fehler = 0, fehlt = 0, ok = 0, summe = 0;
  for (const p of auswahl) {
    const d = dateiFuer(p);
    if (!existsSync(d)) { fehlt++; console.log(`FEHLT   ${p.pfad}`); continue; }
    let j; try { j = JSON.parse(readFileSync(d, "utf8")); } catch (e) { fehler++; console.log(`FEHLER  ${p.pfad}\n   - kein gültiges JSON: ${e.message}`); continue; }
    const { f, w, n } = pruefe(p, j); summe += n;
    if ((titel.get(j.title) || []).length > 1) f.push(`title doppelt: ${titel.get(j.title).join(", ")}`);
    if ((beschr.get(j.description) || []).length > 1) f.push(`description doppelt: ${beschr.get(j.description).join(", ")}`);
    if (f.length) { fehler++; console.log(`FEHLER  ${p.pfad} (${n} W.)\n` + f.map(x => "   - " + x).join("\n") + (w.length ? "\n" + w.map(x => "   ~ " + x).join("\n") : "")); }
    else { ok++; if (w.length) console.log(`OK      ${p.pfad} (${n} W.)\n` + w.map(x => "   ~ " + x).join("\n")); }
  }
  console.log(`\n${auswahl.length} Seiten: ${ok} ok, ${fehler} mit Fehlern, ${fehlt} fehlen · ${summe} Wörter`);
  process.exit(fehler || fehlt ? 1 : 0);
}
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
