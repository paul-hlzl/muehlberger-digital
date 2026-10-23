# Mühlberger Digital – Website

Vertriebsseite für **Mühlberger Digital** (Jonas Mühlberger), Vertriebspartner von **Pipeline AI Solutions**.

Vorschau: https://paul-hlzl.github.io/muehlberger-digital/

Statische Seite ohne Build-Schritt: `index.html`, `impressum.html`, `img/` und `fonts/`.

## Lokal ansehen

```bash
python -m http.server 8000
```

Dann `http://localhost:8000` öffnen.

## Inhalt

- Intro mit Zähler, Startbereich mit Fotos von Jonas
- Laufband der Produkte, Projekte (Desktop: Liste mit Vorschau, Handy: zum Wischen)
- Leistungen als Kacheln, Über mich, Preise (unverbindliche Richtpreise), Partnerschaft, FAQ
- Erstgespräch buchen (Thema, Kalender, Uhrzeit, Gesprächsform) und Rückruf – Versand über FormSubmit an Jonas, Kopie an Pipeline AI Solutions
- Assistent (Chatbot), läuft komplett im Browser

## Vor dem Livegang

- `<meta name="robots" content="noindex">` in `index.html` entfernen (nur für die Vorschau gesetzt)
- Erste Formular-Anfrage abschicken und die Bestätigungsmail von FormSubmit anklicken
- Impressumsangaben mit Jonas abstimmen
- Google Fonts lokal einbinden (DSGVO)
