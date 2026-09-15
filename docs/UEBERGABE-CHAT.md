# Übergabe an die nächste Chat-Sitzung

Stand: 8. September 2026, abends. Geschrieben für die Sitzung, die diese hier ablöst.

---

## Wer macht was

- **Claudio** — führt das Projekt. Die Website gehört seiner Frau. Er entscheidet Technik,
  Ablauf und alles, was nicht ihre Texte oder ihr Auftritt sind. Spricht Deutsch, arbeitet
  zweisprachig.
- **Marina Bletsas** — die Inhaberin. Psychosoziale Beraterin (Lebens- und Sozialberatung
  i.A.u.S.). Ihre Texte, ihr Markenauftritt, alles Rechtliche gehört ihr. Sie bekommt
  Fragen über `docs/fuer-marina.md`.
- **Claude Code** — baut. Läuft auf Claudios Rechner im Ordner
  `C:\Users\basem\persephone-site`, arbeitet in Läufen nach einem Auftragsdokument.
- **Du (diese Chat-Rolle)** — prüfst, misst, schreibst die Auftragsdokumente, übersetzt
  zwischen Code und den beiden Menschen. **Du baust nicht selbst im Repo-Code.** Du
  schreibst Dokumente und lieferst Claudio Text zum Einfügen.

## Das Projekt

Die bestehende WordPress-Seite (Avada-Vorlage) wird als Astro-Seite neu gebaut.

Claudios Satz dazu, wörtlich: *„wir rebuilt die site, aber wir verbessern sie. Wir sollten
eine optimierte Seite haben, aber sie sollte mehr oder weniger gleich aussehen und sich
gleich anfühlen."*

Das ist der Maßstab für jede Entscheidung: gleich wirken, sauberer sein. Keine Neugestaltung.

---

## Wo es gerade steht

Ein **Nachtlauf läuft** nach `docs/NACHTLAUF-2026-09-08.md`. Er umfasst:

- **A0** — Sofortkorrektur: der Hero auf Über uns ist auf 1176 px aufgebläht (Folge von
  Phase 1b). Wurde nachgereicht, nachdem der Lauf schon startete.
- **A1–A6** — gemeinsame Bausteine: zwei Farbwerte, Icon-Set, Listenmarker als Icons, neues
  Platzhalter-Element, Pinselstrich-Trenner, Einblenden beim Scrollen.
- **B1–B9** — Seite für Seite.
- **C** — Marinas Antworten: zehn Meta-Beschreibungen, `/termine/` → `/kennenlernen/`.
- **D** — Build-Check und Abschluss.

**Erste Aufgabe für Dich:** wenn Claudio den Abschlussbericht schickt, die vier
gestalterisch freien Stellen zuerst ansehen (A4 Platzhalter, A5 Trenner, A6 Einblenden,
B2.1 Türkis-Block). Nur dort kann etwas herauskommen, das niemand bestellt hat. Den Rest
stichprobenartig gegen die Messwerte — nicht mehr vollständig, das Budget ist knapp.

---

## Welches Dokument gilt wofür

| Datei | Rolle |
|---|---|
| `docs/NACHTLAUF-2026-09-08.md` | aktueller Auftrag an Code |
| `docs/VERGLEICH-2026-09-07.md` | **alle Zielwerte**, live im Browser gemessen. Autorität bei Designfragen |
| `docs/FEEDBACK-2026-09-08.md` | Claudios Screenshot-Feedback mit Maßen |
| `docs/PRUEFUNG-B1.md` | meine Nachmessung nach Run B1 |
| `docs/fuer-marina.md` | Marinas Fragen und Antworten, in Laiensprache |
| `OPEN-QUESTIONS.md` | offene Punkte, wird von Code **und** von Dir gepflegt |
| `docs/START-CHECKLISTE.md` | was vor dem Umschalten der Domain stimmen muss |
| `docs/UEBERSETZUNG.md` | EN/IT, gesperrt bis nach dem Nachtlauf |
| `HANDOFF.md` | Codes eigener Stand, von ihm gepflegt |

Ältere Dokumente (`FIXES-2026-09-07.md`, `external-review.md`, `NIGHT-RUN.md`,
`RUN-2026-09-07*.md`) sind Geschichte. Wo sie widersprechen, gewinnt das neuere.

---

## Arbeitsregeln, die teuer gelernt wurden

**1. Niemals aus einer Textfassung einer Webseite schließen.** Drei falsche Befunde in
diesem Projekt stammen daher: „die Unterseiten haben kein Hero-Bild", „`/termine/` ist
leer", „das lose Logo ist ein Versehen". Textextraktion verliert Bilder, iframes, Icons und
alles, was über CSS kommt. **Immer gerendertes Markup und berechnete Stile messen.**

Der Weg dafür: der Browser läuft auf Claudios Rechner
(`mcp__remote-devices__Claude_Browser__*`). Live-Seite und Vorschau (`localhost:4321`) sind
beide freigegeben. Analysecode per `javascript_tool` einspielen, Viewport auf 1440 setzen —
sonst misst man die eingeklappte Leiste.

**2. Repo-Dateien vor dem Bearbeiten frisch holen.** Ich habe `OPEN-QUESTIONS.md` mit einer
älteren Kopie überschrieben und dabei zwei Einträge von Code zerstört. **Erst
`device_stage_files`, dann bearbeiten, dann committen.** Nie aus einer alten lokalen Kopie
schreiben.

**3. Jedes Claude-Code-Prompt beginnt mit einer `pwd`-Prüfung.** Claudio hat viermal ein
Persephone-Prompt in eine andere Session eingefügt — beide Tabs liegen in einem
VS-Code-Fenster, dessen Ordner ein anderes Projekt ist. Der Guard hat es jedes Mal gefangen:

> Bevor irgendetwas anderes passiert: gib `pwd` aus. Wenn das nicht
> C:\Users\basem\persephone-site ist, halt an und sag es mir. Tu sonst nichts.

**4. Bildrechte.** Tabu, weil aus dem Avada-Demo: `banner-2.jpg`, `banner-3.jpg`,
`hero-graphic-2.svg`, `info-bg-3.svg`, `Hintergrund.jpg`. Der Upload-Pfad `2023/…` ist ein
Verdachtsmoment, **kein Beweis** — dort liegt auch Marinas eigener Schriftzug. Entscheidend
ist der Dateiname. Alle Porträts von Marina hat Claudio fotografiert, Rechte bei ihr, frei
verwendbar, **kein Fotocredit aus eigenem Antrieb**.

**5. Getroffene Entscheidungen nicht aufrollen.** Liste unten. Wenn etwas davon wieder als
„Fehler" auftaucht, ist es keiner.

**6. Budget.** Claudio war am 8.9. bei 86 % des Wochenlimits, Reset Mittwoch 23:00. Deine
Sitzung geht auf denselben Topf. Keine Messreihen ohne Anlass, keine Screenshot-Serien,
kurze Antworten.

---

## Entschieden — nicht neu diskutieren

- Eyebrow durchgehend teal (#309898), auch in der Hero-Zeile.
- Über uns, Qualifikationsblock: als türkises Band **nachbauen**, nicht kopieren
  (`info-bg-3.svg` ist Avada).
- Vier bewusste Abweichungen von live bleiben: Blogtitel dunkel statt terrakotta-Versalien,
  Datum „16 / JULI 2026", der neue Kontakt-Satz, der neue Startseiten-Titel.
- Die ockerfarbene Kurve im Hero entfällt **ersatzlos** (Avada), `#EDA444` kommt nicht ins
  Farbsystem.
- Hero-Bilder: Granatapfel überall, Porträt nur wo ein Porträt hingehört. Bereits korrekt.
- `/termine/` wird `/kennenlernen/` — Name **und** URL. Weiterleitung notiert.
- Kontaktformular: Microsoft Forms, **vier** Anliegen-Optionen, keine fünfte.
- Übersetzung: neun Seiten in Etappen, Blog bleibt deutsch, nichts online ohne Marinas
  zeilenweise Freigabe.
- Kontakt- und Termine-Seite bleiben getrennt.
- DNS: Verwaltung bleibt, wo sie ist; nur der Website-Eintrag wird geändert. MX, SPF, DKIM
  und autodiscover bleiben unangetastet.

---

## Offen

**Bei Marina:** Datenschutzerklärung lesen und freigeben (Frage 11); der Matomo- und
Kommentare-Abschnitt beschreibt Dinge, die es nicht mehr gibt (12); Terminkalender
eingebettet mit Banner oder erst auf Klick (13, meine Empfehlung: erst auf Klick);
Besucherstatistik ja/nein (20); zwei Rückfragen zu ihren Beschreibungen („psychodukativ",
„(i.A.u.S)" ohne Punkt); das Microsoft-Formular anlegen; der Editor-Test (Frage 9).

**Bei Claudio:** Hosting — blockiert die Produktionsdomain, die kanonischen URLs und die
301-Weiterleitungen. Wer die DNS-Einträge verwaltet. Ob ein WordPress-Backup existiert.

**Technisch, ungeprüft:** Mobil ist nur auf horizontalen Überlauf geprüft, nie visuell.
Hover, Fokus und Tastaturbedienung nur stichprobenartig. Vertikale Abstände nie systematisch
gemessen — dort kann sich „fühlt sich anders an" noch verstecken.

---

## Wie Claudio arbeitet

Direkt, entscheidungsfreudig, technisch versiert genug für Begründungen. Er will **Zahlen
statt Vermutungen** — und er merkt es, wenn etwas geraten ist. Er hat mich mehrfach zu Recht
korrigiert (zuletzt bei meiner Behauptung, ein Cookie-Banner erscheine auf jeder Seite).

Was gut funktioniert: Befund, Messwert, Empfehlung, dann seine Entscheidung. Was er braucht:
**fertige Prompts zum Einfügen**, keine Beschreibungen dessen, was er tippen könnte.

Wenn Du einen Fehler machst: sagen, korrigieren, weitermachen. Er nimmt das gut auf — und
er findet es sowieso.
