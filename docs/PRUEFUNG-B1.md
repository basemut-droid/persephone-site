# Prüfung von Run B1 — 7. September 2026, nach dem Lauf

Gemessen im laufenden Dev-Server (`localhost:4321`), im echten Browser, bei 1440 px
Breite, mit demselben Verfahren wie der Live-Vergleich: berechnete Stilwerte, nicht
Textextraktion.

## Die vier Zielwerte — alle gesetzt

| Wert | Ziel | gemessen | |
|---|---|---|---|
| Fließtext | 20 px | **20 px** | ✓ |
| Hero-Intro | 20 px | **20 px** | ✓ |
| Eyebrow Größe | 18 px | **18 px** | ✓ |
| Eyebrow Gewicht | 400 | **400** | ✓ |
| Eyebrow Laufweite | 0 | **0** | ✓ |
| Eyebrow Farbe | #309898 | **#309898** | ✓ |
| H1 | 48 px | **48 px** | ✓ |
| Abschnittsüberschrift H3 | 28 px | **28 px** | ✓ |
| Hauptbutton Füllung | #b33a3b massiv | **#b33a3b massiv** | ✓ |
| Hauptbutton Größe | 17 px | **17 px** | ✓ |
| Hauptbutton Schnitt | aufrecht | **aufrecht** | ✓ |
| Hauptbutton Radius | 4 px | **4 px** | ✓ |
| Hero-Band | #f3ece6 | **#f3ece6** | ✓ |

---

## Zwei Dinge sind noch offen

### 1. Eine zweite Button-Klasse hat die Umstellung nicht mitbekommen

Es gibt im Rebuild **zwei** Button-Varianten für denselben Zweck, und nur eine wurde
umgestellt:

| Klasse | gemessen | Zustand |
|---|---|---|
| `.button-outline` | 17 px, #f3ece6 auf #309898, aufrecht, r 4 px | ✓ richtig |
| `.card-button` | **12 px, kursiv**, #fbf8f5 auf #309898, r 4 px | ✗ unverändert |

`.card-button` sitzt auf den drei Angebots-Karten der Startseite („Erfahre mehr"). Das ist
genau die Stelle, an der ein Besucher von der Startseite in ein Angebot abbiegt.

Der Auftrag war, das Kursiv **ersatzlos** zu entfernen — es kommt auf der Live-Seite an
keiner Stelle vor. In `.card-button` lebt es weiter.

**Zu tun:** `.card-button` auf dieselben Werte wie `.button-outline` bringen, oder die
Klasse ganz auflösen und die Karten `.button-outline` verwenden lassen. Zwei Klassen für
denselben Button sind ohnehin der Grund, warum eine davon vergessen wurde.

### 2. Die Abschnittsüberschriften der H2-Ebene sind noch 32 px statt 28 px — mein Fehler

**Das ist ein Fehler in meiner Vorlage, nicht in der Umsetzung.** Meine Tabelle in
`VERGLEICH-2026-09-07.md` A1 hat nur „H3-Ebene: 28 px" genannt und dabei H3 auf H3
abgebildet. Tatsächlich rendert der Rebuild **als H2**, was auf der Live-Seite 28 px groß
ist:

| Element | live | Rebuild |
|---|---|---|
| „Unerfüllter Kinderwunsch ist nicht nur eine Frage des Kindes…" | 28 px | **32 px** |
| „Eine Krise ist auch eine Schwelle…" | 28 px | **32 px** |
| „Wähle, was gerade zu Dir passt…" | 25 px (Absatz!) | **32 px** (H2) |

Code hat exakt umgesetzt, was in der Tabelle stand. Die Tabelle war unvollständig.

**Zu tun:** H2 von 32 px auf **28 px**. Damit liegen H2 und H3 beide bei 28 px — das
entspricht der Live-Seite, die dort ebenfalls nur eine Größe verwendet.

Der dritte Fall („Wähle, was gerade zu Dir passt…") ist ein eigener Befund und steht schon
in `VERGLEICH-2026-09-07.md` B1: live ist das ein **Absatz**, kein Heading.

---

## Offener Punkt 17 aus `OPEN-QUESTIONS.md` — gemessen, kein akuter Fehler

Code hat angemerkt, dass `.hero-grid` auf feste 520 px Höhe gesetzt ist, ohne
Überlaufbehandlung, und dass die größere Schrift das sprengen könnte. Nicht im Browser
geprüft, weil das Budget knapp war — zu Recht so gemeldet statt stillschweigend geändert.

**Nachgemessen, alle Seiten mit Hero-Bild, Breiten 1024 bis 1920:**

| Seite | Textblock endet bei | Reserve bis 520 px |
|---|---|---|
| Startseite @1024 | 502 px | **18 px** |
| Startseite @1180–1920 | 479 px | 41 px |
| Über uns | 441 px | 79 px |
| Workshops | 423 px | 97 px |
| Kontakt, Blog | 388 px | 132 px |
| Beratung | 377 px | 143 px |
| Angebote, Selbsthilfegruppe | 359 px | 161 px |

**Nirgends ein Überlauf.** Die engste Stelle ist die Startseite bei rund 1024 px Breite mit
18 px Reserve — also etwa eine halbe Textzeile. Codes Sorge war berechtigt, sie trifft aber
aktuell nicht ein.

**Empfehlung, damit es strukturell erledigt ist:** `min-height: 520px` statt
`height: 520px`. Dann wächst das Band mit, falls ein Text jemals länger wird, statt zu
überlaufen. Das ist eine Zeile und keine Designänderung — die Höhe bleibt in allen
heutigen Fällen exakt gleich.

---

## Was noch offen, aber planmäßig ist

- **Der Tippfehler „e-Brief abonieren"** steht noch zweimal auf der Startseite. Das ist
  kein Versäumnis: er ist Aufgabe 3.1 in `RUN-2026-09-07-B2.md`.
