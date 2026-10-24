# Mühlberger Digital – Website

Live: https://muehlberger-digital.at · Hosting: Cloudflare Pages (Projekt `muehlberger-digital`, Deploy automatisch bei jedem Push auf `main`).

Statische One-Page ohne Build-Schritt: `index.html`, `site.css`, `impressum.html`, `img/`, `fonts/` plus eine Server-Funktion `functions/api/chat.js` für den KI-Assistenten.

## Lokal ansehen

```bash
python -m http.server 8000
```

Der KI-Assistent braucht Cloudflare. Lokal fällt er automatisch auf seinen eingebauten Wissensstand zurück.

## KI-Assistent einrichten (einmalig)

Der API-Key kommt **nie** in den Code. Er liegt als Secret im Cloudflare-Projekt:

1. Cloudflare → Workers & Pages → `muehlberger-digital` → Settings → Variables and secrets → Add
2. `AI_API_KEY` (Typ **Secret**) = Schlüssel des KI-Anbieters
3. Optional als Text: `AI_PROVIDER` = `anthropic` (Standard) oder `openai`, `AI_MODEL` = Modellname
4. Deployments → letzten Deploy „Retry deployment“ (Secrets gelten erst für neue Deploys)

Die Funktion erlaubt nur Anfragen von muehlberger-digital.at, begrenzt Verlauf, Länge und Anfragen pro Person und kennt nur die Fakten aus dem System-Prompt in `functions/api/chat.js`. Preise oder Öffnungszeiten ändern sich dort und in `index.html`.

## Pflege

- Erstgespräch-Zeiten: Mo–Fr 18:00–21:30 (`ZEITEN` in `index.html` und System-Prompt)
- Formular-Versand: FormSubmit an office@muehlberger-digital.at mit Kopie an office@pipeline-solutions.at
- Google Fonts lokal einbinden (DSGVO)
