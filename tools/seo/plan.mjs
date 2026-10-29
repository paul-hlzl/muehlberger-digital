// Seitenplan für die SEO-/GEO-Seiten von Mühlberger Digital.
// Jede Seite hat eine feste URL, einen Typ und ein Inhalts-Paket ("batch"), das ein Text-Auftrag befüllt.
// Ausführen: node tools/seo/plan.mjs  → schreibt tools/seo/plan.json

import { writeFileSync } from "node:fs";

const s = (slug, titel, keyword = titel) => ({ slug, titel, keyword });

export const LEISTUNGEN = [
  s("website-erstellen", "Website erstellen lassen", "website erstellen lassen"),
  s("website-relaunch", "Website-Relaunch", "website relaunch"),
  s("landingpage-erstellen", "Landingpage erstellen lassen", "landingpage erstellen"),
  s("onlineshop-erstellen", "Onlineshop erstellen lassen", "onlineshop erstellen lassen"),
  s("app-entwicklung", "App-Entwicklung für Unternehmen", "app entwickeln lassen"),
  s("individuelle-software", "Individuelle Software & Web-Apps", "individuelle software kmu"),
  s("ki-chatbot", "KI-Chatbot für die Website", "ki chatbot website"),
  s("whatsapp-bot", "WhatsApp-Bot für Betriebe", "whatsapp bot unternehmen"),
  s("ki-telefonassistent", "KI-Telefonassistent", "ki telefonassistent"),
  s("ki-automatisierung", "KI & Prozessautomatisierung", "prozessautomatisierung ki"),
  s("seo", "Suchmaschinenoptimierung (SEO)", "seo agentur"),
  s("geo-ki-sichtbarkeit", "Sichtbarkeit in KI-Suchen (GEO)", "generative engine optimization"),
  s("google-unternehmensprofil", "Google-Unternehmensprofil einrichten & pflegen", "google unternehmensprofil"),
  s("social-media-automatisierung", "Social-Media-Automatisierung", "social media automatisieren"),
  s("meeting-protokolle-ki", "KI-Meeting-Protokolle", "ki meeting protokoll"),
  s("neukundengewinnung-b2b", "B2B-Neukundengewinnung mit KI", "neukunden finden b2b"),
  s("website-wartung-hosting", "Website-Wartung & Hosting", "website wartung"),
  s("digitalisierungsberatung", "Digitalisierungsberatung für KMU", "digitalisierung beratung kmu"),
];

export const PRODUKTE = [
  s("pipebot", "Pipebot – KI-Chatbot für Websites"),
  s("noteit", "noteit – KI-Gesprächsnotizen"),
  s("sightup", "SightUp – Firmenkunden in der Region finden"),
  s("pipeflow", "Pipeflow – Social-Media-Beiträge aus der Website"),
  s("hittaro", "Hittaro – Sichtbarkeit in Google & KI-Suchen"),
  s("zusage", "zusage.at – Bewerbungsplattform für Österreich"),
];

export const CHECKS = [
  s("website-entwurf", "Gratis-Test: Neuer Startseiten-Entwurf", "website gratis test"),
  s("seo-check", "Gratis-SEO-Check", "seo check kostenlos"),
  s("ki-sichtbarkeit", "Gratis-Check: Nennt ChatGPT Ihren Betrieb?", "chatgpt sichtbarkeit check"),
  s("chatbot-test", "Gratis-Check: KI-Chatbot für Ihre Website", "chatbot testen kostenlos"),
  s("neukunden-finden", "Gratis: Passende Firmenkunden finden", "firmenkunden finden kostenlos"),
  s("social-media-test", "Gratis: Social-Media-Beiträge aus Ihrer Website", "social media beiträge automatisch"),
];

export const BRANCHEN = [
  s("installateur", "Installateure"), s("elektriker", "Elektriker"), s("tischler", "Tischlereien"),
  s("maler", "Malerbetriebe"), s("dachdecker", "Dachdecker & Spengler"), s("baumeister", "Baumeister & Baufirmen"),
  s("zimmerei", "Zimmereien & Holzbau"), s("fliesenleger", "Fliesenleger"), s("metallbau", "Schlossereien & Metallbau"),
  s("gartengestaltung", "Gartengestaltung & Landschaftsbau"), s("kfz-werkstatt", "Kfz-Werkstätten"),
  s("rauchfangkehrer", "Rauchfangkehrer"), s("bodenleger", "Bodenleger"), s("transportunternehmen", "Transportunternehmen"),
  s("restaurant", "Restaurants & Gasthäuser"), s("cafe", "Cafés & Konditoreien"), s("heuriger", "Heurige & Buschenschanken"),
  s("hotel", "Hotels"), s("ferienwohnung", "Ferienwohnungen & Pensionen"), s("baeckerei", "Bäckereien"),
  s("fleischerei", "Fleischereien"), s("catering", "Catering"),
  s("arztpraxis", "Arztpraxen"), s("zahnarzt", "Zahnarztpraxen"), s("physiotherapie", "Physiotherapie"),
  s("tierarzt", "Tierarztpraxen"), s("friseur", "Friseursalons"), s("kosmetikstudio", "Kosmetikstudios"),
  s("massage", "Massagepraxen"), s("fitnessstudio", "Fitnessstudios"), s("psychotherapie", "Psychotherapie & Beratung"),
  s("yoga-studio", "Yoga- & Bewegungsstudios"),
  s("steuerberater", "Steuerberatung"), s("rechtsanwalt", "Rechtsanwaltskanzleien"), s("versicherungsmakler", "Versicherungsmakler"),
  s("immobilienmakler", "Immobilienmakler"), s("architekt", "Architekturbüros"), s("unternehmensberater", "Unternehmensberatung"),
  s("reinigungsfirma", "Reinigungsfirmen"), s("fahrschule", "Fahrschulen"), s("nachhilfe", "Nachhilfe & Lernstudios"),
  s("fotograf", "Fotografen"),
  s("einzelhandel", "Einzelhandel"), s("hofladen", "Hofläden & Direktvermarkter"), s("landwirtschaft", "Landwirtschaft"),
  s("weingut", "Weingüter"), s("autohaus", "Autohäuser"), s("blumen", "Blumengeschäfte & Gärtnereien"),
  s("vereine", "Vereine"), s("gemeinden", "Gemeinden"),
];

// Regionen: Ebene und Eltern für Breadcrumbs. "pipeline" = Region gehört zum Kerngebiet von Pipeline AI Solutions.
const r = (slug, name, ebene, eltern, extra = {}) => ({ slug, titel: name, keyword: `digitalagentur ${name}`.toLowerCase(), ebene, eltern, ...extra });
export const REGIONEN = [
  r("niederoesterreich", "Niederösterreich", "bundesland", []),
  r("wien", "Wien", "bundesland", []),
  r("burgenland", "Burgenland", "bundesland", []),
  r("steiermark", "Steiermark", "bundesland", []),
  r("kaernten", "Kärnten", "bundesland", []),
  r("salzburg", "Salzburg", "bundesland", []),
  r("tirol", "Tirol", "bundesland", []),
  r("vorarlberg", "Vorarlberg", "bundesland", []),
  r("oberoesterreich", "Oberösterreich", "bundesland", [], { pipeline: true }),
  r("waldviertel", "Waldviertel", "viertel", ["niederoesterreich"]),
  r("weinviertel", "Weinviertel", "viertel", ["niederoesterreich"]),
  r("mostviertel", "Mostviertel", "viertel", ["niederoesterreich"]),
  r("industrieviertel", "Industrieviertel", "viertel", ["niederoesterreich"]),
  r("bezirk-amstetten", "Bezirk Amstetten", "bezirk", ["niederoesterreich", "mostviertel"]),
  r("bezirk-baden", "Bezirk Baden", "bezirk", ["niederoesterreich", "industrieviertel"]),
  r("bezirk-bruck-an-der-leitha", "Bezirk Bruck an der Leitha", "bezirk", ["niederoesterreich", "industrieviertel"]),
  r("bezirk-gaenserndorf", "Bezirk Gänserndorf", "bezirk", ["niederoesterreich", "weinviertel"]),
  r("bezirk-gmuend", "Bezirk Gmünd", "bezirk", ["niederoesterreich", "waldviertel"]),
  r("bezirk-hollabrunn", "Bezirk Hollabrunn", "bezirk", ["niederoesterreich", "weinviertel"]),
  r("bezirk-horn", "Bezirk Horn", "bezirk", ["niederoesterreich", "waldviertel"]),
  r("bezirk-korneuburg", "Bezirk Korneuburg", "bezirk", ["niederoesterreich", "weinviertel"]),
  r("bezirk-krems-land", "Bezirk Krems-Land", "bezirk", ["niederoesterreich", "waldviertel"]),
  r("bezirk-lilienfeld", "Bezirk Lilienfeld", "bezirk", ["niederoesterreich", "mostviertel"]),
  r("bezirk-melk", "Bezirk Melk", "bezirk", ["niederoesterreich", "mostviertel"]),
  r("bezirk-mistelbach", "Bezirk Mistelbach", "bezirk", ["niederoesterreich", "weinviertel"]),
  r("bezirk-moedling", "Bezirk Mödling", "bezirk", ["niederoesterreich", "industrieviertel"]),
  r("bezirk-neunkirchen", "Bezirk Neunkirchen", "bezirk", ["niederoesterreich", "industrieviertel"]),
  r("bezirk-st-poelten-land", "Bezirk St. Pölten-Land", "bezirk", ["niederoesterreich", "mostviertel"]),
  r("bezirk-scheibbs", "Bezirk Scheibbs", "bezirk", ["niederoesterreich", "mostviertel"]),
  r("bezirk-tulln", "Bezirk Tulln", "bezirk", ["niederoesterreich", "mostviertel"]),
  r("bezirk-waidhofen-an-der-thaya", "Bezirk Waidhofen an der Thaya", "bezirk", ["niederoesterreich", "waldviertel"]),
  r("bezirk-wiener-neustadt-land", "Bezirk Wiener Neustadt-Land", "bezirk", ["niederoesterreich", "industrieviertel"]),
  r("bezirk-zwettl", "Bezirk Zwettl", "bezirk", ["niederoesterreich", "waldviertel"]),
  r("st-poelten", "St. Pölten", "stadt", ["niederoesterreich", "mostviertel"]),
  r("krems-an-der-donau", "Krems an der Donau", "stadt", ["niederoesterreich", "waldviertel"]),
  r("waidhofen-an-der-ybbs", "Waidhofen an der Ybbs", "stadt", ["niederoesterreich", "mostviertel"]),
  r("wiener-neustadt", "Wiener Neustadt", "stadt", ["niederoesterreich", "industrieviertel"]),
  r("ottenschlag", "Ottenschlag", "gemeinde", ["niederoesterreich", "waldviertel", "bezirk-zwettl"], { sitz: true }),
  r("gfoehl", "Gföhl", "gemeinde", ["niederoesterreich", "waldviertel", "bezirk-krems-land"]),
  r("poeggstall", "Pöggstall", "gemeinde", ["niederoesterreich", "waldviertel", "bezirk-melk"]),
  r("martinsberg", "Martinsberg", "gemeinde", ["niederoesterreich", "waldviertel", "bezirk-zwettl"]),
  r("grafenschlag", "Grafenschlag", "gemeinde", ["niederoesterreich", "waldviertel", "bezirk-zwettl"]),
  r("bad-traunstein", "Bad Traunstein", "gemeinde", ["niederoesterreich", "waldviertel", "bezirk-zwettl"]),
  r("kottes-purk", "Kottes-Purk", "gemeinde", ["niederoesterreich", "waldviertel", "bezirk-zwettl"]),
  r("gross-gerungs", "Groß Gerungs", "gemeinde", ["niederoesterreich", "waldviertel", "bezirk-zwettl"]),
  r("allentsteig", "Allentsteig", "gemeinde", ["niederoesterreich", "waldviertel", "bezirk-zwettl"]),
  r("schweiggers", "Schweiggers", "gemeinde", ["niederoesterreich", "waldviertel", "bezirk-zwettl"]),
  r("rappottenstein", "Rappottenstein", "gemeinde", ["niederoesterreich", "waldviertel", "bezirk-zwettl"]),
  r("sallingberg", "Sallingberg", "gemeinde", ["niederoesterreich", "waldviertel", "bezirk-zwettl"]),
  r("schoenbach", "Schönbach", "gemeinde", ["niederoesterreich", "waldviertel", "bezirk-zwettl"]),
  r("weitra", "Weitra", "gemeinde", ["niederoesterreich", "waldviertel", "bezirk-gmuend"]),
  r("heidenreichstein", "Heidenreichstein", "gemeinde", ["niederoesterreich", "waldviertel", "bezirk-gmuend"]),
  r("raabs-an-der-thaya", "Raabs an der Thaya", "gemeinde", ["niederoesterreich", "waldviertel", "bezirk-waidhofen-an-der-thaya"]),
  r("graz", "Graz", "stadt", ["steiermark"]),
  r("klagenfurt", "Klagenfurt", "stadt", ["kaernten"]),
  r("salzburg-stadt", "Stadt Salzburg", "stadt", ["salzburg"]),
  r("innsbruck", "Innsbruck", "stadt", ["tirol"]),
  r("bregenz", "Bregenz", "stadt", ["vorarlberg"]),
  r("eisenstadt", "Eisenstadt", "stadt", ["burgenland"]),
  r("deutschland", "Deutschland", "land", []),
  r("schweiz", "Schweiz", "land", []),
];

// Leistung × Ort: vier Kernleistungen in Niederösterreich, Wien und den Vierteln
export const KOMBI_LEISTUNGEN = ["website-erstellen", "ki-chatbot", "seo", "ki-automatisierung"];
const o = (slug, name, regionen) => ({ slug, name, regionen });
export const KOMBI_ORTE = [
  o("amstetten", "Amstetten", ["bezirk-amstetten"]), o("baden", "Baden", ["bezirk-baden"]),
  o("bruck-an-der-leitha", "Bruck an der Leitha", ["bezirk-bruck-an-der-leitha"]), o("gaenserndorf", "Gänserndorf", ["bezirk-gaenserndorf"]),
  o("gmuend", "Gmünd", ["bezirk-gmuend"]), o("hollabrunn", "Hollabrunn", ["bezirk-hollabrunn"]), o("horn", "Horn", ["bezirk-horn"]),
  o("korneuburg", "Korneuburg", ["bezirk-korneuburg"]), o("krems", "Krems", ["krems-an-der-donau", "bezirk-krems-land"]),
  o("lilienfeld", "Lilienfeld", ["bezirk-lilienfeld"]), o("melk", "Melk", ["bezirk-melk"]), o("mistelbach", "Mistelbach", ["bezirk-mistelbach"]),
  o("moedling", "Mödling", ["bezirk-moedling"]), o("neunkirchen", "Neunkirchen", ["bezirk-neunkirchen"]),
  o("st-poelten", "St. Pölten", ["st-poelten", "bezirk-st-poelten-land"]), o("scheibbs", "Scheibbs", ["bezirk-scheibbs"]),
  o("tulln", "Tulln", ["bezirk-tulln"]), o("waidhofen-an-der-thaya", "Waidhofen an der Thaya", ["bezirk-waidhofen-an-der-thaya"]),
  o("wiener-neustadt", "Wiener Neustadt", ["wiener-neustadt", "bezirk-wiener-neustadt-land"]), o("zwettl", "Zwettl", ["bezirk-zwettl"]),
  o("waidhofen-an-der-ybbs", "Waidhofen an der Ybbs", ["waidhofen-an-der-ybbs"]), o("wien", "Wien", ["wien"]),
  o("waldviertel", "Waldviertel", ["waldviertel"]), o("weinviertel", "Weinviertel", ["weinviertel"]), o("mostviertel", "Mostviertel", ["mostviertel"]),
];

export const WISSEN = [
  // Website & Kosten
  s("was-kostet-eine-website", "Was kostet eine Website in Österreich?"), s("website-laufende-kosten", "Laufende Kosten einer Website: Domain, Hosting, Wartung"),
  s("at-domain-registrieren", ".at-Domain registrieren: So gehen Sie vor"), s("website-selbst-oder-machen-lassen", "Website selbst bauen oder machen lassen?"),
  s("website-baukasten-grenzen", "Website-Baukästen: Wo sie an Grenzen stoßen"), s("wordpress-sicher-halten", "WordPress-Website sicher halten"),
  s("website-relaunch-checkliste", "Checkliste für den Website-Relaunch"), s("website-ladezeit-verbessern", "Website-Ladezeit verbessern"),
  s("mobile-optimierung", "Mobile Optimierung: Warum das Smartphone zählt"), s("website-texte-schreiben", "Website-Texte schreiben, die Anfragen bringen"),
  s("startseite-aufbauen", "So bauen Sie eine gute Startseite auf"), s("ueber-uns-seite", "Die Über-uns-Seite: Vertrauen aufbauen"),
  s("kontaktformular", "Kontaktformular: Was ein gutes Formular ausmacht"), s("call-to-action", "Call-to-Action: Besucher zur Anfrage führen"),
  s("website-fotos", "Fotos für die Firmenwebsite"), s("barrierefreie-website", "Barrierefreie Website: Was Betriebe wissen sollten"),
  s("farben-und-schriften", "Farben und Schriften für die Website wählen"), s("landingpage-oder-website", "Landingpage oder Website – was brauchen Sie?"),
  s("onepager-oder-mehrseitig", "Onepager oder mehrere Unterseiten?"), s("website-briefing", "Website-Briefing: Was die Agentur von Ihnen braucht"),
  s("website-wartung", "Website-Wartung: Was dazugehört"), s("ssl-https", "SSL und HTTPS einfach erklärt"),
  s("website-backup", "Backups für die Website"), s("hosting-in-europa", "Hosting in Europa und Datenschutz"),
  s("e-mail-mit-eigener-domain", "E-Mail-Adresse mit eigener Domain"), s("e-mail-signatur", "Die geschäftliche E-Mail-Signatur"),
  s("social-vorschaubild", "Vorschaubild für Links: So sieht Ihre Seite beim Teilen gut aus"), s("besucheranalyse-ohne-cookies", "Besucher zählen ohne Cookie-Banner"),
  s("analytics-alternativen", "Alternativen zu Google Analytics"), s("cookie-banner", "Cookie-Banner: Wann ist er nötig?"),
  // Recht (allgemeine Information)
  s("impressum-pflicht", "Impressumspflicht in Österreich: Die Grundlagen"), s("datenschutzerklaerung", "Datenschutzerklärung für die Website"),
  s("dsgvo-kontaktformular", "DSGVO und Kontaktformular"), s("bildrechte", "Bildrechte auf der Website"),
  s("google-fonts-lokal", "Google Fonts lokal einbinden"), s("agb-onlineshop", "AGB im Onlineshop: Grundlagen"),
  s("eu-ai-act", "EU AI Act: Was KMU jetzt wissen sollten"), s("ki-und-datenschutz", "KI im Betrieb und Datenschutz"),
  s("gespraechsaufzeichnung", "Gespräche aufzeichnen: Information und Einwilligung"), s("ki-texte-urheberrecht", "KI-Texte und KI-Bilder: Fragen zum Urheberrecht"),
  // SEO
  s("seo-grundlagen", "SEO-Grundlagen für kleine Betriebe"), s("lokales-seo", "Lokales SEO: In der Region gefunden werden"),
  s("google-unternehmensprofil-optimieren", "Google-Unternehmensprofil optimieren"), s("google-bewertungen-bekommen", "Mehr Google-Bewertungen bekommen"),
  s("auf-bewertungen-antworten", "Richtig auf Bewertungen antworten"), s("keywords-finden", "Die richtigen Suchbegriffe finden"),
  s("title-und-meta-description", "Title und Meta-Description schreiben"), s("interne-verlinkung", "Interne Verlinkung sinnvoll aufbauen"),
  s("backlinks-kleine-betriebe", "Backlinks für kleine Betriebe"), s("google-search-console", "Google Search Console einrichten"),
  s("seo-fehler", "Typische SEO-Fehler vermeiden"), s("seo-dauer", "Wie lange dauert SEO?"),
  s("seo-kosten", "Was kostet SEO?"), s("strukturierte-daten", "Strukturierte Daten (Schema.org) erklärt"),
  s("bilder-seo", "Bilder-SEO und Alt-Texte"), s("lokale-landingpages", "Lokale Landingpages richtig machen"),
  s("branchenverzeichnisse", "Branchenverzeichnisse in Österreich"), s("seo-handwerk", "SEO für Handwerksbetriebe"),
  s("seo-gastronomie", "SEO für Gastronomie und Tourismus"), s("seo-praxen", "SEO für Praxen und Gesundheitsberufe"),
  s("nap-daten", "Name, Adresse, Telefon: Einheitliche Firmendaten"), s("duplicate-content", "Doppelte Inhalte vermeiden"),
  s("indexierung-pruefen", "Ist meine Website bei Google indexiert?"),
  // GEO / KI-Suche
  s("was-ist-geo", "Was ist GEO (Generative Engine Optimization)?"), s("chatgpt-empfiehlt-firmen", "Wie ChatGPT Firmen empfiehlt"),
  s("in-chatgpt-gefunden-werden", "In ChatGPT gefunden werden: Erste Schritte"), s("google-ki-uebersichten", "Google-KI-Übersichten und Ihr Betrieb"),
  s("llms-txt", "llms.txt einfach erklärt"), s("ki-crawler", "KI-Crawler auf der Website zulassen oder sperren"),
  s("perplexity-gemini", "Perplexity, Gemini & Co. für Betriebe"), s("faq-fuer-ki-suchen", "FAQ-Inhalte, die KI-Suchen zitieren"),
  s("markenerwaehnungen", "Erwähnungen im Netz: Warum sie für KI zählen"), s("ki-suche-trends", "Wie sich die Suche durch KI verändert"),
  s("ki-sichtbarkeit-messen", "KI-Sichtbarkeit messen"),
  // KI im Betrieb
  s("ki-fuer-kleine-unternehmen", "KI für kleine Unternehmen: Ein Überblick"), s("ki-beispiele-kmu", "KI im Betrieb: Konkrete Beispiele"),
  s("chatgpt-im-betrieb", "ChatGPT im Betrieb sinnvoll nutzen"), s("ki-handwerk", "KI-Werkzeuge für Handwerksbetriebe"),
  s("ki-gastronomie", "KI in Gastronomie und Hotellerie"), s("ki-im-buero", "KI im Büroalltag"),
  s("ki-texte-eigener-stil", "KI-Texte im eigenen Stil"), s("ki-angebote-schreiben", "Angebote schneller schreiben mit KI"),
  s("ki-grenzen", "Grenzen und Risiken von KI"), s("ki-schulung", "Mitarbeiter für KI fit machen"),
  s("ki-kosten", "Was kostet KI im Betrieb?"), s("ki-projekt-starten", "Ein KI-Projekt richtig starten"),
  // Chatbots & Erreichbarkeit
  s("chatbot-vorteile", "Vorteile eines KI-Chatbots auf der Website"), s("chatbot-kosten", "Was kostet ein KI-Chatbot?"),
  s("chatbot-datenschutz", "KI-Chatbot und Datenschutz"), s("chatbot-inhalte", "Mit welchen Inhalten ein Chatbot antwortet"),
  s("chatbot-fehler", "Fehler bei Website-Chatbots vermeiden"), s("whatsapp-business", "WhatsApp Business für Betriebe"),
  s("whatsapp-kundenservice", "Kundenservice über WhatsApp"), s("ki-telefonassistent-erklaert", "KI-Telefonassistent: So funktioniert er"),
  s("erreichbarkeit", "Erreichbar sein außerhalb der Öffnungszeiten"), s("online-terminbuchung", "Online-Terminbuchung einführen"),
  // Automatisierung
  s("prozessautomatisierung-erklaert", "Was ist Prozessautomatisierung?"), s("automatisierung-beispiele", "Automatisierung: Beispiele aus kleinen Betrieben"),
  s("angebote-automatisieren", "Angebote und Nachfassen automatisieren"), s("belege-digital", "Rechnungen und Belege digital ablegen"),
  s("e-mails-sortieren", "E-Mails automatisch vorsortieren"), s("crm-kleine-betriebe", "CRM für kleine Betriebe"),
  s("automatisierung-ohne-programmieren", "Automatisierung ohne Programmieren"), s("automatisierung-nutzen", "Kosten und Nutzen von Automatisierung"),
  s("papierloses-buero", "Das papierlose Büro"),
  // Meetings
  s("meeting-protokoll-schreiben", "Ein gutes Meeting-Protokoll schreiben"), s("ki-meeting-protokoll", "KI-Meeting-Protokolle: Vor- und Nachteile"),
  s("kundengespraeche-dokumentieren", "Kundengespräche dokumentieren"), s("besprechungen-effizient", "Besprechungen effizienter machen"),
  // Social Media
  s("social-media-kleine-betriebe", "Social Media für kleine Betriebe"), s("instagram-unternehmen", "Instagram für Unternehmen"),
  s("linkedin-kmu", "LinkedIn für KMU"), s("redaktionsplan", "Social-Media-Redaktionsplan erstellen"),
  s("wie-oft-posten", "Wie oft sollte ein Betrieb posten?"), s("social-media-ideen-handwerk", "Social-Media-Ideen fürs Handwerk"),
  s("social-media-automatisieren", "Social Media automatisieren"), s("facebook-fuer-betriebe", "Ist Facebook für Betriebe noch sinnvoll?"),
  s("social-media-bildrechte", "Bilder und Musik auf Social Media: Rechte beachten"),
  // Neukunden & Vertrieb
  s("neukunden-gewinnen", "Neukunden gewinnen als kleiner Betrieb"), s("b2b-kunden-finden", "B2B-Kunden in der Region finden"),
  s("kaltakquise-regeln", "Kaltakquise per E-Mail und Telefon: Regeln in Österreich"), s("empfehlungsmarketing", "Empfehlungsmarketing gezielt nutzen"),
  s("angebot-nachfassen", "Angebote richtig nachfassen"), s("vertriebspartner-werden", "Vertriebspartner für digitale Lösungen werden"),
  s("provision-vertriebspartner", "Provision als Vertriebspartner: So funktioniert es"), s("nebenberuflich-vermitteln", "Nebenberuflich digitale Lösungen vermitteln"),
  s("anfragen-qualitaet", "Bessere Anfragen statt mehr Anfragen"),
  // Apps
  s("eigene-app-sinnvoll", "Wann ist eine eigene App sinnvoll?"), s("app-kosten", "Was kostet eine App?"),
  s("app-oder-website", "App oder Website – was passt?"), s("app-store-veroeffentlichung", "Eine App im App Store veröffentlichen"),
  s("app-fuer-mitarbeiter", "Apps für Mitarbeiter"),
  // Onlineshop
  s("onlineshop-starten", "Einen Onlineshop starten"), s("onlineshop-kosten", "Was kostet ein Onlineshop?"),
  s("zahlungsarten-onlineshop", "Zahlungsarten im Onlineshop"), s("versand-onlineshop", "Versand im Onlineshop organisieren"),
  // Digitalisierung allgemein
  s("digitalisierung-wo-anfangen", "Digitalisierung im Betrieb: Wo anfangen?"), s("digitalisierung-waldviertel", "Digitalisierung im Waldviertel"),
  s("foerderungen-digitalisierung", "Förderungen für Digitalisierung in Österreich"), s("digitalisierung-handwerk", "Digitalisierung im Handwerk"),
  s("digitalisierung-landwirtschaft", "Digitalisierung in der Landwirtschaft"), s("digitalisierung-gemeinden", "Digitale Angebote für Gemeinden"),
  s("digitalisierung-vereine", "Digitalisierung für Vereine"), s("it-sicherheit", "IT-Sicherheit für kleine Betriebe"),
  s("passwort-manager", "Passwort-Manager im Betrieb"), s("phishing-erkennen", "Phishing-Mails erkennen"),
  s("cloud-speicher", "Cloud-Speicher und Datenschutz"), s("mitarbeiter-finden-online", "Mitarbeiter online finden"),
  s("stellenanzeige-schreiben", "Eine gute Stellenanzeige schreiben"), s("karriereseite", "Die Karriereseite auf der Firmenwebsite"),
  s("arbeitgebermarke", "Arbeitgebermarke für kleine Betriebe"), s("digitale-visitenkarte", "Visitenkarte mit QR-Code"),
  s("newsletter-kmu", "Newsletter für kleine Betriebe"), s("online-ruf", "Den guten Ruf im Netz pflegen"),
  s("website-pruefen", "Die eigene Website prüfen: Eine Checkliste"), s("agentur-auswaehlen", "Die passende Digitalagentur auswählen"),
  s("website-angebote-vergleichen", "Website-Angebote richtig vergleichen"), s("website-projekt-ablauf", "So läuft ein Website-Projekt ab"),
  s("erstgespraech-vorbereiten", "Das Erstgespräch gut vorbereiten"), s("digitalberater", "Was macht ein Digitalberater?"),
  s("laendlicher-raum", "Digital erfolgreich im ländlichen Raum"), s("google-ads-grundlagen", "Google Ads: Grundlagen für kleine Betriebe"),
  s("website-statistik-lesen", "Website-Statistik richtig lesen"), s("conversion-verbessern", "Mehr Anfragen aus denselben Besuchern"),
  s("vertrauen-online", "Vertrauen online aufbauen"), s("referenzen-zeigen", "Referenzen und Kundenstimmen zeigen"),
  s("preise-auf-website", "Preise auf der Website zeigen?"), s("mehrsprachige-website", "Mehrsprachige Website: Wann lohnt sie sich?"),
  s("website-fuer-tourismus", "Die Website im Tourismus"), s("saisonbetrieb-digital", "Digital durch die Nebensaison"),
  s("regionale-produkte-online", "Regionale Produkte online verkaufen"), s("gutscheine-online", "Gutscheine online verkaufen"),
  s("veranstaltungen-bewerben", "Veranstaltungen online bewerben"), s("digitale-speisekarte", "Die digitale Speisekarte"),
  s("online-reservierung", "Online-Reservierung für Gastronomie"), s("praxis-website", "Was eine Praxis-Website braucht"),
  s("handwerker-website", "Was eine Handwerker-Website braucht"), s("kanzlei-website", "Was eine Kanzlei-Website braucht"),
  s("website-texte-mit-ki", "Website-Texte mit KI schreiben"), s("ki-bilder-website", "KI-Bilder auf der Website"),
];

export const GLOSSAR = [
  "CMS", "Domain", "DNS", "Hosting", "SSL-Zertifikat", "Responsive Design", "Landingpage", "Call-to-Action", "Conversion", "Absprungrate",
  "SEO", "GEO", "Keyword", "Meta-Description", "Title-Tag", "Backlink", "Interne Verlinkung", "XML-Sitemap", "robots.txt", "llms.txt",
  "Indexierung", "Crawler", "Core Web Vitals", "Schema-Markup", "Rich Snippet", "Local SEO", "Google-Unternehmensprofil", "NAP-Daten", "SERP", "KI-Übersicht",
  "Large Language Model", "Prompt", "Chatbot", "RAG", "Halluzination", "Token", "API", "Automatisierung", "Workflow", "Webhook",
  "CRM", "Lead", "Leadgenerierung", "Kaltakquise", "Inbound-Marketing", "Sales Funnel", "A/B-Test", "DSGVO", "Cookie", "Impressum",
  "Barrierefreiheit", "Web-App", "Native App", "PWA", "SaaS", "Onlineshop", "Payment-Provider", "Redaktionsplan", "Engagement", "Vertriebspartner",
].map(t => s(t.toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""), t, `${t} erklärung`.toLowerCase()));

export const VERGLEICHE = [
  s("wix-oder-eigene-website", "Wix oder eigene Website?"), s("wordpress-oder-individuell", "WordPress oder individuelle Website?"),
  s("baukasten-oder-agentur", "Baukasten oder Agentur?"), s("agentur-oder-freelancer", "Agentur oder Freelancer?"),
  s("chatgpt-oder-claude", "ChatGPT oder Claude im Betrieb?"), s("chatbot-oder-faq-seite", "KI-Chatbot oder FAQ-Seite?"),
  s("whatsapp-oder-e-mail", "WhatsApp oder E-Mail im Kundenservice?"), s("native-app-oder-web-app", "Native App oder Web-App?"),
  s("shopify-oder-woocommerce", "Shopify oder WooCommerce?"), s("eigener-shop-oder-marktplatz", "Eigener Onlineshop oder Marktplatz?"),
  s("seo-oder-google-ads", "SEO oder Google Ads?"), s("seo-oder-geo", "SEO oder GEO?"),
  s("instagram-oder-linkedin", "Instagram oder LinkedIn?"), s("zapier-make-n8n", "Zapier, Make oder n8n?"),
  s("protokoll-manuell-oder-ki", "Meeting-Protokoll: von Hand oder mit KI?"), s("kaltakquise-oder-inbound", "Kaltakquise oder Inbound-Marketing?"),
  s("eigene-domain-oder-gmail", "Eigene Domain oder Gmail-Adresse?"), s("hosting-europa-oder-usa", "Hosting in Europa oder in den USA?"),
  s("telefonassistent-oder-callcenter", "KI-Telefonassistent oder Callcenter?"), s("website-mieten-oder-kaufen", "Website mieten oder kaufen?"),
];

export const SONSTIGE = [
  s("ueber-jonas-muehlberger", "Über Jonas Mühlberger"), s("erstgespraech", "Kostenloses Erstgespräch"),
  s("preise", "Preise & Richtpreise"), s("ablauf", "So läuft die Zusammenarbeit ab"),
  s("vertriebspartner", "Vertriebspartner werden"), s("haeufige-fragen", "Häufige Fragen"),
];

export const HUBS = [
  { pfad: "/leistungen/", titel: "Leistungen", typ: "leistung" }, { pfad: "/produkte/", titel: "Produkte", typ: "produkt" },
  { pfad: "/gratis-check/", titel: "Gratis-Checks", typ: "check" }, { pfad: "/branchen/", titel: "Branchen", typ: "branche" },
  { pfad: "/regionen/", titel: "Regionen", typ: "region" }, { pfad: "/wissen/", titel: "Wissen & Ratgeber", typ: "wissen" },
  { pfad: "/glossar/", titel: "Glossar", typ: "glossar" }, { pfad: "/vergleiche/", titel: "Vergleiche", typ: "vergleich" },
  { pfad: "/seitenuebersicht/", titel: "Seitenübersicht", typ: "alle" },
];

// Inhalts-Pakete: ungefähr gleich große Aufträge, damit sie parallel geschrieben werden können
function teile(liste, n) { const g = Math.ceil(liste.length / n); return Array.from({ length: n }, (_, i) => liste.slice(i * g, (i + 1) * g)); }

export function seiten() {
  const out = [];
  const add = (typ, pfad, x, batch, extra = {}) => out.push({ typ, pfad, slug: x.slug, titel: x.titel, keyword: x.keyword, batch, ...extra });
  LEISTUNGEN.forEach(x => add("leistung", `/leistungen/${x.slug}/`, x, "a-kern"));
  PRODUKTE.forEach(x => add("produkt", `/produkte/${x.slug}/`, x, "a-kern"));
  CHECKS.forEach(x => add("check", `/gratis-check/${x.slug}/`, x, "a-kern"));
  SONSTIGE.forEach(x => add("sonstige", `/${x.slug}/`, x, "a-kern"));
  teile(BRANCHEN, 2).forEach((l, i) => l.forEach(x => add("branche", `/branchen/${x.slug}/`, x, `b-branchen-${i + 1}`)));
  teile(REGIONEN, 2).forEach((l, i) => l.forEach(x => add("region", `/regionen/${x.slug}/`, x, `c-regionen-${i + 1}`, { ebene: x.ebene, eltern: x.eltern, pipeline: !!x.pipeline, sitz: !!x.sitz })));
  const kombis = [];
  for (const l of KOMBI_LEISTUNGEN) for (const ort of KOMBI_ORTE) {
    const lt = LEISTUNGEN.find(x => x.slug === l);
    kombis.push({ slug: `${l}/${ort.slug}`, titel: `${lt.titel} in ${ort.name}`, keyword: `${lt.keyword} ${ort.name}`.toLowerCase(), leistung: l, ort: ort.slug, ortName: ort.name, regionen: ort.regionen });
  }
  teile(kombis, 4).forEach((l, i) => l.forEach(x => add("kombi", `/leistungen/${x.slug}/`, x, `d-kombi-${i + 1}`, { leistung: x.leistung, ort: x.ort, ortName: x.ortName, regionen: x.regionen })));
  teile(WISSEN, 7).forEach((l, i) => l.forEach(x => add("wissen", `/wissen/${x.slug}/`, x, `e-wissen-${i + 1}`)));
  GLOSSAR.forEach(x => add("glossar", `/glossar/${x.slug}/`, x, "f-glossar"));
  VERGLEICHE.forEach(x => add("vergleich", `/vergleiche/${x.slug}/`, x, "g-vergleiche"));
  return out;
}

if (import.meta.url === `file://${process.argv[1].replace(/\\/g, "/")}` || process.argv[1]?.endsWith("plan.mjs")) {
  const alle = seiten();
  const doppelt = alle.map(x => x.pfad).filter((p, i, a) => a.indexOf(p) !== i);
  if (doppelt.length) throw new Error("Doppelte Pfade: " + doppelt.join(", "));
  writeFileSync(new URL("./plan.json", import.meta.url), JSON.stringify(alle, null, 1));
  const nachTyp = alle.reduce((m, x) => (m[x.typ] = (m[x.typ] || 0) + 1, m), {});
  const nachBatch = alle.reduce((m, x) => (m[x.batch] = (m[x.batch] || 0) + 1, m), {});
  console.log("Inhaltsseiten:", alle.length, "+ Hubs:", HUBS.length, "+ Startseite = ", alle.length + HUBS.length + 1);
  console.log(nachTyp); console.log(nachBatch);
}
