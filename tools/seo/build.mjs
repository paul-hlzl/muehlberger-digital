// Baut die SEO-/GEO-Unterseiten aus content/**.json als statisches HTML.
// Aufruf: node tools/seo/build.mjs   (danach committen – Cloudflare Pages hat keinen Build-Schritt)
//
// Erzeugt: /<bereich>/<slug>/index.html, Übersichtsseiten, sitemap.xml, robots.txt, llms.txt, 404.html

import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { dateiFuer, pruefe } from "./check.mjs";
import { HUBS, REGIONEN, LEISTUNGEN, KOMBI_LEISTUNGEN, KOMBI_ORTE } from "./plan.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const SITE = "https://muehlberger-digital.at";
const PLAN = JSON.parse(readFileSync(join(ROOT, "tools/seo/plan.json"), "utf8"));
const HEUTE = new Date();
const ISO = HEUTE.toISOString().slice(0, 10);
const MONAT = HEUTE.toLocaleDateString("de-AT", { month: "long", year: "numeric" }).replace(/^Januar/, "Jänner");
const BEREICHE = ["leistungen", "produkte", "gratis-check", "branchen", "regionen", "wissen", "glossar", "vergleiche", "seitenuebersicht",
  "ueber-jonas-muehlberger", "erstgespraech", "preise", "ablauf", "vertriebspartner", "haeufige-fragen"];

const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const json = o => JSON.stringify(o).replace(/</g, "\\u003c");

// ---------- Gratis-Checks (Karten auf jeder Seite) ----------
export const CHECKS = {
  "website-entwurf": { name: "Startseiten-Entwurf", von: "Pipeline AI Solutions", icon: "i-pipeline.png", url: "https://www.pipeline-solutions.at/gratis-test/", text: "Adresse Ihrer Website eingeben und in wenigen Minuten einen neuen Entwurf Ihrer Startseite sehen.", cta: "Gratis-Test starten" },
  "seo-check": { name: "SEO-Test", von: "Pipeline AI Solutions", icon: "i-pipeline.png", url: "https://www.pipeline-solutions.at/seo-check/", text: "Prüft, wie gut Google Ihre Website versteht – mit konkreten Punkten, die Sie verbessern können.", cta: "SEO-Test starten" },
  "ki-sichtbarkeit": { name: "KI-Sichtbarkeits-Check", von: "Hittaro", icon: "i-hittaro.png", url: "https://hittaro.com/check", text: "Nennt ChatGPT Ihren Betrieb? Bericht zu Google und KI-Suchen innerhalb von 24 Stunden.", cta: "Gratis-Check anfordern" },
  "chatbot-test": { name: "Chatbot-Check", von: "Pipebot", icon: "i-pipebot.png", url: "https://pipebot.at/#gratis-check", text: "Sehen Sie, wie ein KI-Chatbot mit den Inhalten Ihrer Website antwortet. Danach 30 Tage gratis.", cta: "Chatbot testen" },
  "neukunden-finden": { name: "Firmenkunden finden", von: "SightUp", icon: "i-sightup.svg", url: "https://sightup.at/", text: "Beschreiben Sie Ihr Angebot – SightUp findet passende Firmen in Ihrer Nähe. 3 Suchen pro Monat gratis.", cta: "Gratis-Paket nutzen" },
  "social-media-test": { name: "Social-Media-Beiträge", von: "Pipeflow", icon: "i-pipeflow.png", url: "https://app.pipeflow.at/start", text: "Aus Ihrer Website werden fertige Beiträge für Instagram und LinkedIn. In der Pilotphase kostenlos.", cta: "Kostenlos starten" },
};

// ---------- Inhalte laden ----------
const SEITEN = [];
const fehlen = [], ungueltig = [];
for (const p of PLAN) {
  const d = dateiFuer(p);
  if (!existsSync(d)) { fehlen.push(p.pfad); continue; }
  let j; try { j = JSON.parse(readFileSync(d, "utf8")); } catch { ungueltig.push(p.pfad); continue; }
  const { f } = pruefe(p, j);
  if (f.length) { ungueltig.push(`${p.pfad} (${f[0]})`); continue; }
  SEITEN.push({ ...p, c: j });
}
const NACH_PFAD = new Map(SEITEN.map(s => [s.pfad, s]));
const titelVon = pfad => NACH_PFAD.get(pfad)?.c.h1 || HUBS.find(h => h.pfad === pfad)?.titel || (pfad === "/" ? "Startseite" : null);

// ---------- Bausteine ----------
const PFEIL = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M2 8h12M9 3l5 5-5 5"/></svg>`;
const HAKEN = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7"/></svg>`;
const btn = (href, txt, cls = "", ext = false) => `<a class="btn ${cls}" href="${esc(href)}"${ext ? ' target="_blank" rel="noopener"' : ""}><span class="t"><span>${esc(txt)}</span><span>${esc(txt)}</span></span>${PFEIL}</a>`;

const NAV = `<header class="nav solid" id="nav">
  <div class="bar">
    <a class="brand" href="/" aria-label="Mühlberger Digital – Startseite"><img class="m" src="/img/md-zeichen.png" alt="" width="36" height="36"><img class="w" src="/img/md-schrift.png" alt="Mühlberger Digital" width="124" height="24"></a>
    <nav class="menu" aria-label="Hauptnavigation">
      <a href="/leistungen/">Leistungen</a><a href="/branchen/">Branchen</a><a href="/regionen/">Regionen</a><a href="/wissen/">Wissen</a><a href="/preise/">Preise</a>
    </nav>
    <div class="right">
      <a class="btn light tel" href="tel:+4367762192776">+43 677 6219 2776</a>
      <a class="btn" href="/#termin"><span class="t"><span>Erstgespräch</span><span>Erstgespräch</span></span></a>
      <button class="burger" id="burger" aria-label="Menü öffnen" aria-expanded="false"><i></i><i></i></button>
    </div>
  </div>
</header>
<div class="mmenu" id="mmenu">
  <nav>
    <a class="big" href="/leistungen/">Leistungen</a><a class="big" href="/branchen/">Branchen</a><a class="big" href="/regionen/">Regionen</a><a class="big" href="/wissen/">Wissen</a><a class="big" href="/gratis-check/">Gratis-Checks</a><a class="big" href="/preise/">Preise</a>
  </nav>
  <div class="mm-foot"><a class="btn lg" href="/#termin">Erstgespräch buchen</a><a class="btn lg light" href="tel:+4367762192776">+43 677 6219 2776</a></div>
</div>`;

const FOOTER = `<footer>
  <div class="wrap lock">
    <span class="eyebrow">Gemeinsam für Ihr Unternehmen</span>
    <div class="lock-row">
      <a class="lk pl" href="https://www.pipeline-solutions.at/" target="_blank" rel="noopener"><img src="/img/pipeline-logo-weiss.png" alt="Pipeline AI Solutions" loading="lazy"></a>
      <div class="cross" aria-hidden="true">×</div>
      <a class="lk md" href="/"><img class="z" src="/img/md-zeichen.png" alt="" loading="lazy"><img class="w" src="/img/md-schrift-weiss.png" alt="Mühlberger Digital" loading="lazy"></a>
    </div>
    <p class="sub">Beratung aus dem Waldviertel, Entwicklung aus Oberösterreich – Websites, Apps und KI aus einer Hand.</p>
  </div>
  <div class="wrap">
    <div class="fcols">
      <div><h4>Leistungen</h4><ul><li><a href="/leistungen/website-erstellen/">Website erstellen</a></li><li><a href="/leistungen/ki-chatbot/">KI-Chatbot</a></li><li><a href="/leistungen/seo/">SEO</a></li><li><a href="/leistungen/geo-ki-sichtbarkeit/">KI-Sichtbarkeit (GEO)</a></li><li><a href="/leistungen/ki-automatisierung/">Automatisierung</a></li><li><a href="/leistungen/">Alle Leistungen</a></li></ul></div>
      <div><h4>Entdecken</h4><ul><li><a href="/gratis-check/">Gratis-Checks</a></li><li><a href="/branchen/">Branchen</a></li><li><a href="/regionen/">Regionen</a></li><li><a href="/wissen/">Wissen &amp; Ratgeber</a></li><li><a href="/glossar/">Glossar</a></li><li><a href="/vergleiche/">Vergleiche</a></li></ul></div>
      <div><h4>Kontakt</h4><ul><li><a href="tel:+4367762192776">+43 677 6219 2776</a></li><li><a href="mailto:office@muehlberger-digital.at">office@muehlberger-digital.at</a></li><li><a href="/erstgespraech/">Erstgespräch</a></li><li><a href="/vertriebspartner/">Vertriebspartner werden</a></li><li><a href="/impressum.html">Impressum</a></li><li><a href="/impressum.html#datenschutz">Datenschutz</a></li></ul></div>
      <div class="news"><h4>Produkte aus der Partnerschaft</h4><ul class="fprod"><li><a href="/produkte/pipebot/">Pipebot</a></li><li><a href="/produkte/noteit/">noteit</a></li><li><a href="/produkte/sightup/">SightUp</a></li><li><a href="/produkte/pipeflow/">Pipeflow</a></li><li><a href="/produkte/hittaro/">Hittaro</a></li><li><a href="/produkte/zusage/">zusage.at</a></li></ul></div>
    </div>
    <div class="fbase"><span>© ${HEUTE.getFullYear()} Mühlberger Digital · Neuhof 26, 3631 Ottenschlag</span><a class="powered" href="https://www.pipeline-solutions.at/" target="_blank" rel="noopener"><img src="/img/pipeline-p.png" alt="" loading="lazy">Powered by <b>Pipeline AI Solutions</b></a><span><a href="/seitenuebersicht/">Seitenübersicht</a> · <a href="/impressum.html">Impressum</a> · <a href="/impressum.html#datenschutz">Datenschutz</a></span></div>
  </div>
</footer>
<script>
(function(){var b=document.getElementById("burger"),m=document.getElementById("mmenu");if(!b)return;b.addEventListener("click",function(){var on=!m.classList.contains("on");m.classList.toggle("on",on);b.classList.toggle("on",on);b.setAttribute("aria-expanded",on);document.body.style.overflow=on?"hidden":"";});})();
</script>`;

const ORG = {
  "@type": "ProfessionalService", "@id": `${SITE}/#org`, name: "Mühlberger Digital", url: `${SITE}/`, logo: `${SITE}/img/md-zeichen.png`, image: `${SITE}/img/og.jpg`,
  telephone: "+43 677 6219 2776", email: "office@muehlberger-digital.at",
  address: { "@type": "PostalAddress", streetAddress: "Neuhof 26", postalCode: "3631", addressLocality: "Ottenschlag", addressRegion: "Niederösterreich", addressCountry: "AT" },
  founder: { "@type": "Person", "@id": `${SITE}/ueber-jonas-muehlberger/#person`, name: "Jonas Mühlberger" },
  areaServed: [{ "@type": "Country", name: "Österreich" }, { "@type": "Country", name: "Deutschland" }, { "@type": "Country", name: "Schweiz" }],
  sameAs: ["https://www.instagram.com/muehlberger.digital/"],
  knowsAbout: ["Webdesign", "Suchmaschinenoptimierung", "Generative Engine Optimization", "KI-Chatbots", "Prozessautomatisierung", "App-Entwicklung"],
  parentOrganization: undefined,
};

function head({ titel, beschreibung, pfad, ld, robots = "index, follow, max-image-preview:large, max-snippet:-1", typ = "article" }) {
  const t = titel.length + 21 <= 68 ? `${titel} | Mühlberger Digital` : titel;
  return `<!doctype html>
<html lang="de-AT">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t)}</title>
<meta name="description" content="${esc(beschreibung)}">
<meta name="robots" content="${robots}">
<link rel="canonical" href="${SITE}${pfad}">
<meta name="theme-color" content="#f5f5f7">
<meta property="og:type" content="${typ}">
<meta property="og:locale" content="de_AT">
<meta property="og:site_name" content="Mühlberger Digital">
<meta property="og:title" content="${esc(titel)}">
<meta property="og:description" content="${esc(beschreibung)}">
<meta property="og:url" content="${SITE}${pfad}">
<meta property="og:image" content="${SITE}/img/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/img/md-zeichen.png" type="image/png">
<link rel="preload" href="/fonts/Aspekta-700.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/site.css">
<link rel="stylesheet" href="/seo.css">
<script type="application/ld+json">${json({ "@context": "https://schema.org", "@graph": ld.filter(Boolean) })}</script>
</head>
<body class="sp">
${NAV}
<main id="start">`;
}

// Brotkrumen: Bereich → (bei Regionen: Eltern) → Seite
function krumen(s) {
  const k = [{ name: "Start", pfad: "/" }];
  const hub = { leistung: "/leistungen/", kombi: "/leistungen/", produkt: "/produkte/", check: "/gratis-check/", branche: "/branchen/", region: "/regionen/", wissen: "/wissen/", glossar: "/glossar/", vergleich: "/vergleiche/" }[s.typ];
  if (hub) k.push({ name: HUBS.find(h => h.pfad === hub).titel, pfad: hub });
  if (s.typ === "region") for (const e of s.eltern || []) k.push({ name: REGIONEN.find(r => r.slug === e).titel, pfad: `/regionen/${e}/` });
  if (s.typ === "kombi") k.push({ name: LEISTUNGEN.find(l => l.slug === s.leistung).titel, pfad: `/leistungen/${s.leistung}/` });
  k.push({ name: s.c ? s.c.h1 : s.titel, pfad: s.pfad });
  return k;
}
const krumenHtml = k => `<nav class="crumbs" aria-label="Brotkrumen"><ol>${k.map((x, i) => i === k.length - 1 ? `<li aria-current="page">${esc(x.name)}</li>` : `<li><a href="${x.pfad}">${esc(x.name)}</a></li>`).join("")}</ol></nav>`;
const krumenLd = k => ({ "@type": "BreadcrumbList", itemListElement: k.map((x, i) => ({ "@type": "ListItem", position: i + 1, name: x.name, item: `${SITE}${x.pfad}` })) });

const checkKarte = (key, gross = false) => {
  const c = CHECKS[key];
  return `<div class="ck${gross ? " big" : ""}"><span class="ck-ic"><img src="/img/${c.icon}" alt="" width="40" height="40" loading="lazy"></span><div class="ck-t"><small>Gratis · ${esc(c.von)}</small><b>${esc(c.name)}</b><p>${esc(c.text)}</p><div class="ck-a">${btn(c.url, c.cta, "", true)}<a class="ck-more" href="/gratis-check/${key}/">So funktioniert's</a></div></div></div>`;
};

const karte = pfad => {
  const s = NACH_PFAD.get(pfad); if (!s) return "";
  return `<a class="rc" href="${pfad}"><small>${esc(s.c.kicker)}</small><b>${esc(s.c.h1)}</b><span>${esc(s.c.description)}</span><i>${PFEIL}</i></a>`;
};

// Zusätzliche Querverweise je Typ (zusätzlich zu "verwandt" aus dem Text)
function querverweise(s) {
  const gruppen = [];
  if (s.typ === "kombi") {
    const lt = LEISTUNGEN.find(l => l.slug === s.leistung);
    gruppen.push([`${lt.titel} in weiteren Orten`, KOMBI_ORTE.filter(o => o.slug !== s.ort).map(o => [`/leistungen/${s.leistung}/${o.slug}/`, o.name])]);
    gruppen.push([`Weitere Leistungen in ${s.ortName}`, KOMBI_LEISTUNGEN.filter(l => l !== s.leistung).map(l => [`/leistungen/${l}/${s.ort}/`, LEISTUNGEN.find(x => x.slug === l).titel])]);
  }
  if (s.typ === "leistung" && KOMBI_LEISTUNGEN.includes(s.slug)) gruppen.push([`${s.titel} nach Ort`, KOMBI_ORTE.map(o => [`/leistungen/${s.slug}/${o.slug}/`, o.name])]);
  if (s.typ === "region") {
    const kinder = REGIONEN.filter(r => r.eltern[r.eltern.length - 1] === s.slug);
    if (kinder.length) gruppen.push([`Regionen in ${s.titel}`, kinder.map(r => [`/regionen/${r.slug}/`, r.titel])]);
    const orte = KOMBI_ORTE.filter(o => o.regionen.includes(s.slug));
    for (const o of orte) gruppen.push([`Leistungen in ${o.name}`, KOMBI_LEISTUNGEN.map(l => [`/leistungen/${l}/${o.slug}/`, LEISTUNGEN.find(x => x.slug === l).titel])]);
  }
  return gruppen.map(([h, l]) => `<div class="xg"><h3>${esc(h)}</h3><ul>${l.filter(([p]) => NACH_PFAD.has(p)).map(([p, n]) => `<li><a href="${p}">${esc(n)}</a></li>`).join("")}</ul></div>`).join("");
}

function ldFuer(s, k) {
  const url = `${SITE}${s.pfad}`, c = s.c;
  const page = { "@type": s.typ === "wissen" || s.typ === "vergleich" ? "WebPage" : "WebPage", "@id": `${url}#page`, url, name: c.title, description: c.description, inLanguage: "de-AT", isPartOf: { "@id": `${SITE}/#website` }, about: { "@id": `${SITE}/#org` }, dateModified: ISO, breadcrumb: { "@id": `${url}#crumbs` } };
  const crumbs = { ...krumenLd(k), "@id": `${url}#crumbs` };
  const faq = c.faq?.length ? { "@type": "FAQPage", "@id": `${url}#faq`, mainEntity: c.faq.map(q => ({ "@type": "Question", name: q.q, acceptedAnswer: { "@type": "Answer", text: q.a } })) } : null;
  let extra = null;
  const ort = s.typ === "kombi" ? s.ortName : s.typ === "region" ? s.titel : null;
  if (["leistung", "kombi", "branche", "region", "check"].includes(s.typ)) extra = { "@type": "Service", "@id": `${url}#service`, name: c.h1, description: c.lead, provider: { "@id": `${SITE}/#org` }, areaServed: ort ? { "@type": "Place", name: ort } : { "@type": "Country", name: "Österreich" }, url };
  if (s.typ === "wissen" || s.typ === "vergleich") extra = { "@type": "Article", "@id": `${url}#article`, headline: c.h1, description: c.description, inLanguage: "de-AT", dateModified: ISO, author: { "@id": `${SITE}/#org` }, publisher: { "@id": `${SITE}/#org` }, mainEntityOfPage: { "@id": `${url}#page` }, image: `${SITE}/img/og.jpg` };
  if (s.typ === "glossar") extra = { "@type": "DefinedTerm", "@id": `${url}#term`, name: s.titel, description: c.lead, inDefinedTermSet: { "@type": "DefinedTermSet", name: "Glossar von Mühlberger Digital", url: `${SITE}/glossar/` } };
  if (s.slug === "ueber-jonas-muehlberger") extra = { "@type": "Person", "@id": `${SITE}/ueber-jonas-muehlberger/#person`, name: "Jonas Mühlberger", jobTitle: "Gründer", worksFor: { "@id": `${SITE}/#org` }, address: { "@type": "PostalAddress", addressLocality: "Ottenschlag", addressCountry: "AT" } };
  return [page, crumbs, faq, extra, { ...ORG }, { "@type": "WebSite", "@id": `${SITE}/#website`, url: `${SITE}/`, name: "Mühlberger Digital", inLanguage: "de-AT", publisher: { "@id": `${SITE}/#org` } }];
}

// Externe Links im Inhalt: neuer Tab, ohne nofollow (Partnerverweise sind redaktionell)
const inhalt = html => html.replace(/<a href="(https?:[^"]+)">/g, '<a href="$1" target="_blank" rel="noopener">').replace(/<table>/g, '<div class="tw"><table>').replace(/<\/table>/g, "</table></div>");

function seite(s) {
  const c = s.c, k = krumen(s);
  const checks = c.checks.filter(x => CHECKS[x]);
  const primaer = checks[0];
  const abschnitte = c.abschnitte.map((a, i) => `<section class="ab"><h2 id="a${i + 1}">${esc(a.h2)}</h2>${inhalt(a.html)}</section>${i === 1 && primaer ? checkKarte(primaer, true) : ""}`).join("\n");
  const toc = c.abschnitte.length >= 4 ? `<nav class="toc" aria-label="Inhalt"><b>Inhalt</b><ol>${c.abschnitte.map((a, i) => `<li><a href="#a${i + 1}">${esc(a.h2)}</a></li>`).join("")}${c.faq?.length ? `<li><a href="#faq">Häufige Fragen</a></li>` : ""}</ol></nav>` : "";
  const faq = c.faq?.length ? `<section class="ab faqs" id="faq"><h2>Häufige Fragen</h2>${c.faq.map((q, i) => `<details${i === 0 ? " open" : ""}><summary>${esc(q.q)}</summary><p>${esc(q.a)}</p></details>`).join("")}</section>` : "";
  const verwandt = c.verwandt.filter(p => NACH_PFAD.has(p));
  const kickerTyp = { region: "Region", kombi: "Vor Ort", branche: "Branche", wissen: "Ratgeber", glossar: "Glossar", vergleich: "Vergleich", produkt: "Produkt", check: "Gratis-Check", leistung: "Leistung", sonstige: "Mühlberger Digital" }[s.typ];
  const heroBtn = s.typ === "check" ? btn(CHECKS[s.slug]?.url || CHECKS[primaer].url, CHECKS[s.slug]?.cta || "Gratis-Check starten", "lg", true) : btn("/#termin", "Kostenloses Erstgespräch", "lg");
  const zweitBtn = s.typ === "check" ? btn("/#termin", "Lieber persönlich besprechen", "lg light") : primaer ? btn(CHECKS[primaer].url, CHECKS[primaer].cta, "lg light", true) : "";
  return head({ titel: c.title, beschreibung: c.description, pfad: s.pfad, ld: ldFuer(s, k) }) + `
<section class="sp-hero">
  <div class="wrap">
    ${krumenHtml(k)}
    <span class="eyebrow">${esc(c.kicker || kickerTyp)}</span>
    <h1>${esc(c.h1)}</h1>
    <p class="lead">${esc(c.lead)}</p>
    <div class="ctas">${heroBtn}${zweitBtn}</div>
    <p class="meta">Aktualisiert ${esc(MONAT)} · Mühlberger Digital, Ottenschlag · Umsetzung mit Pipeline AI Solutions</p>
  </div>
</section>
<div class="wrap sp-grid">
  <article class="sp-body">
    <aside class="glance" aria-label="Auf einen Blick"><b>Auf einen Blick</b><ul>${c.fakten.map(f => `<li>${HAKEN}<span>${esc(f)}</span></li>`).join("")}</ul></aside>
    ${toc}
    ${abschnitte}
    ${checks[1] ? checkKarte(checks[1]) : ""}
    ${faq}
  </article>
  <aside class="sp-side">
    <div class="side-card dark">
      <img class="sc-av" src="/img/jonas-polo-foto.webp" alt="Jonas Mühlberger" width="64" height="64" loading="lazy">
      <b>Persönlich beraten lassen</b>
      <p>Jonas Mühlberger zeigt Ihnen im kostenlosen Erstgespräch, was sich für Ihren Betrieb lohnt – und was nicht.</p>
      ${btn("/#termin", "Erstgespräch buchen", "white")}
      <a class="sc-tel" href="tel:+4367762192776">+43 677 6219 2776</a>
      <small>Mo–Fr 18:00–21:30 Uhr · vor Ort, Telefon oder Video</small>
    </div>
    <div class="side-card">
      <b>Gratis testen</b>
      <ul class="side-checks">${Object.keys(CHECKS).map(key => `<li><a href="/gratis-check/${key}/"><img src="/img/${CHECKS[key].icon}" alt="" width="22" height="22" loading="lazy">${esc(CHECKS[key].name)}</a></li>`).join("")}</ul>
    </div>
    <div class="side-card pl">
      <a href="https://www.pipeline-solutions.at/" target="_blank" rel="noopener"><img src="/img/pipeline-logo-dunkel.png" alt="Pipeline AI Solutions" width="180" height="35" loading="lazy"></a>
      <p>Umsetzung, Vertrag und Betreuung durch Pipeline AI Solutions aus Oberösterreich.</p>
    </div>
  </aside>
</div>
${verwandt.length ? `<section class="wrap related"><h2>Passend dazu</h2><div class="rgrid">${verwandt.map(karte).join("")}</div></section>` : ""}
${(() => { const q = querverweise(s); return q ? `<section class="wrap xlinks">${q}</section>` : ""; })()}
${endCta()}
</main>
${FOOTER}
</body>
</html>`;
}

const endCta = () => `<section class="cta-end sp-end">
  <div class="wrap">
    <span class="eyebrow">Kostenlos &amp; unverbindlich</span>
    <h2>Reden wir über Ihren Betrieb.</h2>
    <p>30 Minuten, vor Ort im Waldviertel, am Telefon oder per Video-Call. Sie bekommen eine ehrliche Einschätzung und auf Wunsch ein schriftliches Angebot.</p>
    <div class="acts">${btn("/#termin", "Erstgespräch buchen", "lg")}${btn("/gratis-check/", "Erst gratis testen", "lg light")}</div>
  </div>
</section>`;

// ---------- Übersichtsseiten ----------
const HUB_TEXT = {
  "/leistungen/": ["Leistungen", "Websites, Apps, KI und Sichtbarkeit – alles, was Mühlberger Digital gemeinsam mit Pipeline AI Solutions für kleine und mittlere Betriebe umsetzt.", "Von der Starter-Website ab 2.500 € bis zur individuellen Automatisierung: Jede Leistung beginnt mit einem kostenlosen Erstgespräch und endet mit einem schriftlichen Angebot."],
  "/produkte/": ["Produkte aus der Partnerschaft", "Fertige KI-Software von Pipeline AI Solutions, die sofort arbeitet – vermittelt und betreut von Mühlberger Digital.", "Chatbot, Gesprächsnotizen, Neukundensuche, Social Media und Sichtbarkeit in KI-Suchen. Fast alle Produkte lassen sich gratis testen."],
  "/gratis-check/": ["Gratis-Checks", "Testen Sie, bevor Sie entscheiden: kostenlose Checks und Tests für Website, Google, KI-Suchen, Chatbot, Neukunden und Social Media.", "Jeder Check zeigt in wenigen Minuten bis 24 Stunden, wo Ihr Betrieb steht. Danach besprechen wir das Ergebnis gerne persönlich – ohne Verkaufsdruck."],
  "/branchen/": ["Branchen", "Digitale Lösungen, die zum Alltag Ihrer Branche passen – vom Installateur über den Heurigen bis zur Arztpraxis.", "Jede Branche hat eigene Fragen: Notdienst, Saison, Termine, Vertrauen. Hier finden Sie, was in Ihrem Bereich wirklich hilft."],
  "/regionen/": ["Regionen", "Persönlich im Waldviertel und in ganz Niederösterreich, online in ganz Österreich, Deutschland und der Schweiz.", "Jonas Mühlberger kommt aus Ottenschlag und kennt die Betriebe in der Region. Wählen Sie Ihr Bundesland, Ihr Viertel oder Ihren Bezirk."],
  "/wissen/": ["Wissen & Ratgeber", "Verständliche Antworten auf die Fragen, die Betriebe zu Website, Google, KI, Automatisierung und Recht wirklich stellen.", "Ohne Fachchinesisch, mit Checklisten und ehrlichen Einschätzungen – auch dazu, wann sich etwas nicht lohnt."],
  "/glossar/": ["Glossar", "Digitale Fachbegriffe in einem Satz erklärt – mit Beispielen aus kleinen Betrieben.", "Von API bis Workflow: Das Glossar hilft, Angebote zu verstehen und mitzureden."],
  "/vergleiche/": ["Vergleiche", "Ehrliche Gegenüberstellungen für typische Entscheidungen: Baukasten oder Agentur, SEO oder Ads, Chatbot oder FAQ.", "Jeder Vergleich endet mit einer klaren Empfehlung je nach Situation."],
  "/seitenuebersicht/": ["Seitenübersicht", "Alle Seiten von Mühlberger Digital auf einen Blick.", "Leistungen, Produkte, Gratis-Checks, Branchen, Regionen, Ratgeber, Glossar und Vergleiche."],
};

function hub(h) {
  const [titel, lead, text] = HUB_TEXT[h.pfad];
  const k = [{ name: "Start", pfad: "/" }, { name: titel, pfad: h.pfad }];
  let liste = h.typ === "alle" ? SEITEN : SEITEN.filter(s => s.typ === h.typ || (h.typ === "leistung" && s.typ === "kombi"));
  let body = "";
  const kartenGrid = l => `<div class="rgrid">${l.map(s => karte(s.pfad)).join("")}</div>`;
  if (h.typ === "region") {
    const ebenen = [["bundesland", "Bundesländer"], ["viertel", "Viertel in Niederösterreich"], ["bezirk", "Bezirke in Niederösterreich"], ["stadt", "Städte"], ["gemeinde", "Gemeinden im Waldviertel"], ["land", "Deutschland & Schweiz"]];
    body = ebenen.map(([e, n]) => { const l = liste.filter(s => s.ebene === e); return l.length ? `<h2 class="hh">${n}</h2>${kartenGrid(l)}` : ""; }).join("");
  } else if (h.typ === "leistung") {
    body = `<h2 class="hh">Alle Leistungen</h2>${kartenGrid(liste.filter(s => s.typ === "leistung"))}` +
      KOMBI_LEISTUNGEN.map(l => `<div class="xg"><h3>${esc(LEISTUNGEN.find(x => x.slug === l).titel)} – nach Ort</h3><ul>${liste.filter(s => s.typ === "kombi" && s.leistung === l).map(s => `<li><a href="${s.pfad}">${esc(s.ortName)}</a></li>`).join("")}</ul></div>`).join("");
  } else if (h.typ === "alle") {
    const namen = { leistung: "Leistungen", kombi: "Leistungen vor Ort", produkt: "Produkte", check: "Gratis-Checks", sonstige: "Über uns", branche: "Branchen", region: "Regionen", wissen: "Wissen & Ratgeber", glossar: "Glossar", vergleich: "Vergleiche" };
    body = Object.entries(namen).map(([t, n]) => { const l = liste.filter(s => s.typ === t); return l.length ? `<div class="xg"><h3>${n} (${l.length})</h3><ul>${l.map(s => `<li><a href="${s.pfad}">${esc(s.c.h1)}</a></li>`).join("")}</ul></div>` : ""; }).join("");
  } else if (h.typ === "glossar") {
    body = `<div class="xg"><ul class="abc">${[...liste].sort((a, b) => a.titel.localeCompare(b.titel, "de")).map(s => `<li><a href="${s.pfad}"><b>${esc(s.titel)}</b><span>${esc(s.c.lead.split(/(?<=\.)\s/)[0])}</span></a></li>`).join("")}</ul></div>`;
  } else {
    if (h.typ === "check") body = `<div class="ckgrid">${Object.keys(CHECKS).map(key => checkKarte(key, true)).join("")}</div><h2 class="hh">Mehr zu den Checks</h2>`;
    body += kartenGrid(liste);
  }
  const ld = [{ "@type": "CollectionPage", "@id": `${SITE}${h.pfad}#page`, url: `${SITE}${h.pfad}`, name: titel, description: lead, inLanguage: "de-AT", isPartOf: { "@id": `${SITE}/#website` } }, { ...krumenLd(k), "@id": `${SITE}${h.pfad}#crumbs` }, { ...ORG }, { "@type": "WebSite", "@id": `${SITE}/#website`, url: `${SITE}/`, name: "Mühlberger Digital" }];
  return head({ titel: titel === "Seitenübersicht" ? "Seitenübersicht" : `${titel} für Unternehmen in Österreich`.slice(0, 60), beschreibung: lead.slice(0, 158), pfad: h.pfad, ld, typ: "website" }) + `
<section class="sp-hero hub">
  <div class="wrap">
    ${krumenHtml(k)}
    <span class="eyebrow">Mühlberger Digital</span>
    <h1>${esc(titel)}</h1>
    <p class="lead">${esc(lead)}</p>
    <p class="sub2">${esc(text)}</p>
    <div class="ctas">${btn("/#termin", "Kostenloses Erstgespräch", "lg")}${btn("/gratis-check/", "Gratis-Checks", "lg light")}</div>
  </div>
</section>
<section class="wrap hub-body">${body}</section>
${endCta()}
</main>
${FOOTER}
</body>
</html>`;
}

// ---------- Schreiben ----------
// Links auf Seiten, die (noch) nicht gebaut sind, entfernen – keine toten Links
const GEBAUT = new Set(["/", ...HUBS.map(h => h.pfad), ...SEITEN.map(s => s.pfad)]);
const STATISCH = new Set(["/impressum.html", "/404.html"]);
const tot = h => !(GEBAUT.has(h) || STATISCH.has(h));
function saeubern(html) {
  const pfad = u => u.split("#")[0];
  return html
    .replace(/<li><a [^>]*href="(\/[^"]*)"[^>]*>[\s\S]*?<\/a><\/li>/g, (m, u) => (u !== "/#termin" && !u.startsWith("/#") && tot(pfad(u))) ? "" : m)
    .replace(/<a class="ck-more" href="(\/[^"]*)">[\s\S]*?<\/a>/g, (m, u) => tot(pfad(u)) ? "" : m)
    .replace(/<a ([^>]*?)href="(\/[^"]*)"([^>]*)>([\s\S]*?)<\/a>/g, (m, a, u, b, inner) => (u.startsWith("/#") || !tot(pfad(u))) ? m : inner);
}
function schreibe(pfad, html) { const d = join(ROOT, pfad, "index.html"); mkdirSync(dirname(d), { recursive: true }); writeFileSync(d, saeubern(html)); }

// Alte Ausgabe entfernen (nur generierte Bereiche)
for (const b of BEREICHE) { const d = join(ROOT, b); if (existsSync(d)) rmSync(d, { recursive: true, force: true }); }

for (const s of SEITEN) schreibe(s.pfad, seite(s));
for (const h of HUBS) schreibe(h.pfad, hub(h));

const urls = ["/", ...HUBS.map(h => h.pfad), ...SEITEN.map(s => s.pfad)];
writeFileSync(join(ROOT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${SITE}${u}</loc><lastmod>${ISO}</lastmod></url>`).join("\n")}\n</urlset>\n`);

writeFileSync(join(ROOT, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /api/\n\n# KI-Suchen ausdrücklich erlaubt\nUser-agent: GPTBot\nAllow: /\n\nUser-agent: OAI-SearchBot\nAllow: /\n\nUser-agent: ChatGPT-User\nAllow: /\n\nUser-agent: ClaudeBot\nAllow: /\n\nUser-agent: Claude-SearchBot\nAllow: /\n\nUser-agent: PerplexityBot\nAllow: /\n\nUser-agent: Google-Extended\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);

const zeile = s => `- [${s.c.h1}](${SITE}${s.pfad}): ${s.c.description}`;
const nimm = t => SEITEN.filter(s => s.typ === t);
writeFileSync(join(ROOT, "llms.txt"), `# Mühlberger Digital

> Mühlberger Digital (Jonas Mühlberger, Neuhof 26, 3631 Ottenschlag, Waldviertel, Niederösterreich) berät und vermittelt Websites, Apps, KI-Chatbots, Automatisierung und Sichtbarkeit in Google und KI-Suchen für kleine und mittlere Unternehmen in Österreich, Deutschland und der Schweiz. Technische Umsetzung und Vertragspartner: Pipeline AI Solutions (Paul Hölzl und Ben Braunsperger, Oberösterreich, https://www.pipeline-solutions.at/).

Kontakt: +43 677 6219 2776 · office@muehlberger-digital.at · Kostenloses Erstgespräch (ca. 30 Minuten) Mo–Fr 18:00–21:30 Uhr, vor Ort, telefonisch oder per Video.
Richtpreise (unverbindlich, ohne USt.): Starter-Website ab 2.500 € einmalig; Pipebot 19 €/Monat; noteit ab 0 €; SightUp ab 0 €; Pipeflow in der Pilotphase kostenlos; Hittaro-Optimierung ab 199 € einmalig.

## Leistungen
${nimm("leistung").map(zeile).join("\n")}

## Produkte
${nimm("produkt").map(zeile).join("\n")}

## Gratis-Checks
${nimm("check").map(zeile).join("\n")}

## Über uns
${nimm("sonstige").map(zeile).join("\n")}

## Branchen
${nimm("branche").map(zeile).join("\n")}

## Regionen
${nimm("region").map(zeile).join("\n")}

## Ratgeber
${nimm("wissen").map(zeile).join("\n")}

## Vergleiche
${nimm("vergleich").map(zeile).join("\n")}

## Optional
- [Glossar](${SITE}/glossar/): ${nimm("glossar").length} Fachbegriffe kurz erklärt
- [Leistungen nach Ort](${SITE}/leistungen/): ${nimm("kombi").length} Seiten zu Website, KI-Chatbot, SEO und Automatisierung in Niederösterreich und Wien
- [Seitenübersicht](${SITE}/seitenuebersicht/)
`);

writeFileSync(join(ROOT, "404.html"), saeubern(head({ titel: "Seite nicht gefunden", beschreibung: "Diese Seite gibt es nicht (mehr). Hier geht es zurück zu Mühlberger Digital.", pfad: "/404.html", ld: [{ ...ORG }], robots: "noindex" }) + `
<section class="sp-hero hub"><div class="wrap"><span class="eyebrow">Fehler 404</span><h1>Diese Seite gibt es nicht.</h1><p class="lead">Vielleicht hilft einer dieser Wege weiter.</p><div class="ctas">${btn("/", "Zur Startseite", "lg")}${btn("/seitenuebersicht/", "Alle Seiten", "lg light")}</div></div></section>
</main>
${FOOTER}
</body>
</html>`));

console.log(`Gebaut: ${SEITEN.length} Inhaltsseiten + ${HUBS.length} Übersichten + Startseite = ${SEITEN.length + HUBS.length + 1} indexierbare Seiten`);
if (fehlen.length) console.log(`Noch ohne Inhalt (${fehlen.length}): ${fehlen.slice(0, 8).join(", ")}${fehlen.length > 8 ? " …" : ""}`);
if (ungueltig.length) console.log(`Übersprungen wegen Fehlern (${ungueltig.length}):\n  ${ungueltig.slice(0, 15).join("\n  ")}`);
