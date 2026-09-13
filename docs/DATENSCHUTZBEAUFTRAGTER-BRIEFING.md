# Briefing für den Datenschutzbeauftragten — persephone.at Website-Relaunch

Stand: 13. September 2026 (überarbeitet gegenüber der Fassung vom 9.9. — der
Launch rückte auf "morgen" vor, seitdem wurden mehrere der damals offenen
Punkte tatsächlich umgesetzt, nicht nur weiter geplant). Erstellt als
Grundlage für ein Gespräch — keine rechtliche Bewertung, sondern eine
faktische Zusammenfassung dessen, was technisch passiert ist und passieren
soll, damit die rechtliche Einschätzung darauf aufsetzen kann.

**Betreiberin:** Marina Bletsas, Lebens- und Sozialberaterin i.A.u.S.
(Ausbildung unter Supervision), Einzelunternehmerin. Angebot: Einzel-/
Paarberatung, Workshops und eine Selbsthilfegruppe für Menschen mit
unerfülltem Kinderwunsch (Wien, Graz, online).

**Warum das jetzt vorgelegt wird:** Die Website wird technisch neu gebaut
(siehe unten) und soll in Kürze live gehen. Die bestehende
Datenschutzerklärung stammt aus der alten Seite und beschreibt an mehreren
Stellen entweder etwas, das es nicht mehr gibt, oder lässt etwas aus, das
neu dazugekommen ist. Ein korrigierter Entwurf existiert bereits (siehe 3.6
und Anhang) — er ist **nicht** Marinas finale Freigabe, sondern eine gegen
den tatsächlichen Code geprüfte Korrektur, die vor dem Launch noch eine
rechtliche und ihre inhaltliche Durchsicht braucht.

---

## 1. Ausgangssituation

Die bisherige Seite (`persephone.at`) läuft auf WordPress mit dem
Theme/Page-Builder Avada. Bekannte, für Datenschutz relevante Punkte des
Ist-Zustands:

- Schriftarten wurden extern von **Google Fonts** und **Adobe Typekit**
  nachgeladen (beides in der bestehenden Datenschutzerklärung als eigene
  Abschnitte beschrieben).
- Die Datenschutzerklärung erwähnt **Matomo** (Webanalyse) und einen
  **Kommentarbereich** unter Blogartikeln.
- Ein Terminbuchungs-Kalender (**Microsoft Bookings**) ist als Direktlink
  bzw. Embed vorhanden.
- Ein Kontaktformular existiert, ist aber aktuell **nicht funktionsfähig**
  (Versandfehler wegen fehlender Absender-Authentifizierung — unabhängig vom
  Relaunch, ein bestehendes Problem).
- Eine Anmeldung zur Selbsthilfegruppe läuft bereits heute über ein
  **Microsoft Forms**-Formular.

Ob und in welchem Umfang diese Verarbeitungen aktuell rechtskonform
dokumentiert und eingewilligt sind, ist Teil dessen, was hier geklärt werden
soll — nicht als bereits geprüft vorausgesetzt.

---

## 2. Was wir gemacht haben

Die Seite wird als statische Astro-Website neu gebaut, mit dem erklärten
Ziel, **inhaltlich und optisch gleich zu wirken, aber technisch sauberer zu
sein** — keine Neugestaltung, keine neuen Funktionen über das hinaus, was
live schon da ist (mit einigen wenigen, unten gelisteten Ausnahmen).

Technisch bedeutet das unter anderem:

- Kein WordPress/PHP-Backend für die Seiten selbst mehr, keine Plugins. Eine
  Ausnahme: ein einzelnes, kleines PHP-Skript für den Formularversand (3.2)
  — kein CMS, keine Datenbank, kein Adminbereich dahinter.
- Schriftart (DM Sans) wird **selbst gehostet** ausgeliefert, keine externen
  Font-Ladevorgänge mehr (weder Google noch Adobe).
- Keine Analyse-/Tracking-Software eingebaut (kein Matomo, kein Google
  Analytics, nichts Vergleichbares) — Stand jetzt lädt die neue Seite **keine
  Drittanbieter-Skripte von sich aus**, mit einer bedingten Ausnahme (siehe
  3.1: der Terminkalender, aber nur nach einem bewussten Klick).
- Kein Kommentarbereich unter Blogartikeln.
- Übersetzungen (Englisch/Italienisch) sind vorbereitet, aber aktuell
  bewusst von der Suchmaschinen-Indexierung ausgeschlossen (`noindex`), weil
  sie inhaltlich noch nicht durch die Betreiberin freigegeben sind (Details
  in 3.7).
- Hosting-Entscheidung getroffen und umgesetzt: easyname (Details in 3.8).

---

## 3. Änderungen mit Datenschutz-Relevanz

### 3.1 Microsoft Bookings — Automatik-Problem technisch gelöst, zwei Fragen bleiben

Die Terminvereinbarungs-Seite ("Kennenlernen") band den
Microsoft-Bookings-Kalender ursprünglich direkt als iframe ein, **ohne
vorherige Einwilligung** — eine bewusste Entscheidung des Betreibers
gewesen (Komfort: ein Klick weniger), kein technisches Versehen.

**Geändert am 13.9.2026:** Der Kalender lädt jetzt nicht mehr automatisch.
Es erscheint stattdessen ein Button ("Kalender laden"); erst ein bewusster
Klick baut die Verbindung zu Microsoft auf. Ohne diesen Klick lädt die Seite
nichts von Microsoft und setzt keine Cookies.

Am 8.9.2026 wurde gemessen, was das Embed beim tatsächlichen Laden ablegt
(Buchungsseite separat aufgerufen, nicht als eingebettetes iframe — Werte
für ein echtes iframe können abweichen). Diese Messung gilt weiterhin, sie
beschreibt nur, was jetzt **nach dem Klick** passiert, statt automatisch:

- Redirect über zwei Microsoft-Domains (`outlook.office.com` →
  `bookings.cloud.microsoft`)
- Cookies: `ClientId`, `msal.cache.encryption`
- 11 Einträge im Local Storage, darunter eine Telemetrie-Kennung
  (`mats-telemetry-profile-id`)
- 2 Einträge im Session Storage

**Was das für die zwei ursprünglichen Fragen ändert:**

1. **Braucht das eine Cookie-/Einwilligungslösung?** Die Automatik-Variante,
   die einen Banner auf jeder Seite nötig gemacht hätte, ist weg. Die
   **technische** Einschätzung des Projekts ist, dass Klick-zum-Laden als
   eigene, bewusste Nutzerhandlung ausreicht und kein zusätzlicher Banner
   mehr nötig ist. **Das ist keine rechtliche Bewertung** — genau diese
   Einschätzung sollte hier bestätigt oder korrigiert werden, bevor sie als
   Tatsache in die Datenschutzerklärung übernommen wird.
2. **Drittlandbezug/Auftragsverarbeitung bleibt unverändert offen.**
   Unabhängig davon, ob automatisch oder erst nach Klick geladen: sobald der
   Kalender überhaupt genutzt wird, verarbeitet Microsoft (USA) die Daten.
   Ist ein aktueller Auftragsverarbeitungsvertrag (bzw. Standardvertrags-
   klauseln/EU-U.S. Data Privacy Framework) vorhanden und ausreichend,
   insbesondere weil die gebuchten Termine faktisch offenlegen, dass eine
   Person psychosoziale Unterstützung bei unerfülltem Kinderwunsch sucht?

### 3.2 Kontaktformular — jetzt live, ohne Drittanbieter

**Geändert seit der letzten Fassung dieses Briefings:** Der ursprüngliche
Plan (Microsoft Forms) stellte sich als technisch nicht umsetzbar heraus —
Microsoft Forms nimmt keine Formulardaten von einer fremden Webseite per
POST entgegen, es ist nur über einen eigenen Link oder ein Embed nutzbar.
Ebenfalls erwogen und wieder verworfen: ein externer Formular-Dienst
("web3forms"), der die Nachrichten auf US-Servern verarbeitet hätte —
dieselbe Art von Drittlandproblem wie beim Hosting (3.8), nur diesmal für
den eigentlichen Nachrichteninhalt statt nur für ausgelieferte Dateien.

**Tatsächlich umgesetzt:** Ein kleines PHP-Skript läuft direkt auf dem
eigenen Hosting-Server (easyname, siehe 3.8) und leitet jede Formular-
Anfrage unmittelbar per E-Mail an `marinabletsas@persephone.at` weiter.
Es gibt keine Datenbank, keinen Zwischenspeicher, keinen weiteren
Dienstleister in diesem Weg — der Empfänger ist derselbe wie beim
bisherigen Plan, nur ohne Microsoft als zusätzliche verarbeitende Stelle
für diese eine Funktion.

Felder (aktueller Stand, geändert gegenüber der letzten Fassung): Name,
E-Mail, Anliegen (jetzt drei statt vier Auswahloptionen: „Frage zu
Persephone", „Kooperation & Presse", „Sonstiges" — die vierte Option
sowie das Telefonfeld wurden im laufenden Projekt gestrichen), Nachricht,
Einwilligungs-Checkbox. Ein für Menschen unsichtbares Zusatzfeld
(Honeypot) filtert Bot-Einsendungen, ohne selbst personenbezogene Daten zu
erzeugen.

**Pain Point bleibt bestehen, unabhängig vom Versandweg:** Auch ein knappes
Kontaktformular offenbart hier durch den Kontext (Anliegen-Auswahl +
Freitext-Nachricht auf einer Kinderwunschberatungs-Seite) mutmaßlich
gesundheitsnahe/besonders sensible Angaben im Sinne von Art. 9 DSGVO, auch
ohne dass ein eigenes Datenfeld danach fragt. Das betrifft die
Rechtsgrundlage (ausdrückliche Einwilligung statt bloß berechtigtes
Interesse) und die Formulierung des Einwilligungstexts — unverändert durch
den Wegfall von Microsoft als Verarbeiter.

### 3.3 Selbsthilfegruppen-Anmeldung (bereits bestehend, unverändert)

Läuft schon heute über ein separates Microsoft-Forms-Formular. Wird durch
den Relaunch nicht verändert, ist aber inhaltlich derselben Kategorie
zuzurechnen wie 3.2 — bei der Gelegenheit mit review-en, nicht nur das neue
Kontaktformular.

### 3.4 Schriftarten — Risiko entfällt

Die Umstellung auf selbst gehostetes DM Sans (statt Google Fonts/Adobe
Typekit) entfernt eine der auf der alten Seite dokumentierten
Drittanbieter-Verbindungen vollständig. Die neue Seite lädt für Schriftarten
gar nichts mehr extern nach. Das ist eine Verbesserung, keine offene Frage.

### 3.5 Webanalyse — Geschäftsentscheidung getroffen: Matomo, aber erst nach Launch

Die neue Seite hat zum Start **keine** Besucherstatistik/kein Tracking.
Das ist jetzt keine offene Frage mehr, sondern eine bewusste Reihenfolge:
Die Betreiberin möchte künftig **Matomo** einsetzen — ausdrücklich als
datenschutzfreundlichere Alternative zu Google Analytics, nicht irgendein
beliebiges Tool —, aber das ist auf **nach dem Launch** verschoben. Zum
Start gilt weiterhin: keine Statistik, kein dafür nötiger Banner.

### 3.6 Datenschutzerklärung — korrigierter Entwurf existiert bereits, ein Punkt darin ausdrücklich strittig

Die bestehende Datenschutzerklärung beschrieb Matomo, einen Blog-
Kommentarbereich und Cookie-Nutzung (Login/Spracheinstellung/Consent-
Speicherung), die auf der neuen Seite so nicht existieren — derselbe Fehler
wie eine fehlende Beschreibung, nur umgekehrt.

**Ein korrigierter Text wurde am 13.9. bereits in den Code geschrieben**
(`src/pages/datenschutz.astro`, siehe Anhang) — nicht als fertige, von der
Betreiberin freigegebene Fassung, sondern als Korrektur gegen überprüfbare
Fakten (der tatsächliche Code, easynames echte Firmenadresse), die hier vor
dem Launch noch eine rechtliche Durchsicht braucht:

- **Neuer Hosting-Abschnitt** (easyname, siehe 3.8).
- **Kontakt-Abschnitt** korrigiert auf den tatsächlichen Versandweg (3.2).
- **Cookies-Abschnitt** korrigiert: die Seite setzt keine eigenen Cookies
  (kein Login, keine Cookie-basierte Spracheinstellung, kein
  Consent-Speicher — nichts davon existiert). Einzige mögliche
  Cookie-Quelle: der Terminkalender, und auch der nur nach Klick (3.1).
- **Matomo-Abschnitt**: nicht gelöscht, sondern als „geplant, noch nicht
  aktiv" markiert (Begründung: 3.5) — bleibt stehen, damit er nicht erneut
  geschrieben werden muss, sobald Matomo tatsächlich läuft.
- **Kommentar-Abschnitt**: ebenfalls als „geplant, noch nicht aktiv"
  markiert, **aber auf ausdrücklichen Wunsch des Betreibers, nicht aus
  eigener rechtlicher Einschätzung.** Das steht in einer echten Spannung zu
  der oben stehenden Logik selbst — eine Datenschutzerklärung, die eine
  aktuell nicht stattfindende Verarbeitung beschreibt, ist genau der
  Fehler, den diese Korrektur eigentlich beheben soll. Die Kommentarfunktion
  ist fest geplant (anders als Matomo aber ohne Zeithorizont), und der
  Betreiber wollte den Abschnitt deshalb behalten. **Das ist ausdrücklich
  als offene, an dieser Stelle nicht selbst entschiedene Frage
  festgehalten**, nicht als bereits für richtig befundene Lösung: Ist
  „geplant, noch nicht aktiv" als Formulierung in einer aktuell gültigen
  Datenschutzerklärung überhaupt eine zulässige Kategorie, oder gehört ein
  Abschnitt über eine nicht existierende Verarbeitung schlicht nicht hinein,
  gleich aus welchem Grund?

### 3.7 Übersetzungen und berufsrechtliche Kennzeichnungspflicht

Kein Datenschutzthema im engeren Sinn, aber während der Prüfung aufgefallen
und hier mit aufgenommen, weil es dieselbe Kategorie „vor Launch prüfen"
betrifft: Die vorbereitete englische Startseite lässt an keiner Stelle
erkennen, dass die Betreiberin sich **in Ausbildung unter Supervision**
befindet (kein Treffer für „supervision", „in training", „i.A.u.S." oder
„psychotherapy") — die deutsche Seite weist das durchgehend aus, wie es die
österreichische Berufsbezeichnungs-/Ankündigungsregulierung für Berater:innen
in Ausbildung verlangt. Die EN/IT-Startseiten sind deshalb vorerst per
`noindex` von Suchmaschinen ausgeschlossen und werden erst veröffentlicht,
wenn die Betreiberin sie zeilenweise freigegeben hat.

### 3.8 Hosting — entschieden und umgesetzt

**easyname** (kleines Webhosting-Paket, bereits bezahlt bis Mai 2028; Domain
ebenfalls dorthin umgezogen). Ursprünglich war Hetzner analysiert und
empfohlen worden, noch am selben Tag aber durch einen bereits getätigten
Kauf ersetzt — für die Datenschutzerklärung ändert das nichts an der
Schlussfolgerung: easyname ist ein Wiener Unternehmen (Canettistraße 5/10,
1100 Wien — Firmenbuchnummer 402196s, gegen das offizielle österreichische
Firmenbuch geprüft), die Verarbeitung findet vollständig in der EU
(Österreich) statt. **Keine** Drittland-Klausel für das Hosting nötig,
anders als bei Microsoft (3.1, 3.3) — und anders als bei Cloudflare, das
aus genau diesem Grund als Alternative verworfen wurde.

**Noch offen, rein verwaltungstechnisch:** Ein förmlicher
Auftragsverarbeitungsvertrag (Art. 28 DSGVO) mit easyname muss noch
abgeschlossen werden — "kein Drittland" ersetzt diesen Vertrag nicht,
easyname verarbeitet weiterhin in unserem Auftrag (Server-Logs, Backups,
den Formularversand aus 3.2).

Die Domain wurde zu easyname umgezogen, bevor die vollständige
DNS-Eintrags-Bestandsaufnahme gemacht wurde. Per Testmail an
marinabletsas@persephone.at und zurück am 13.9. bestätigt: die
Microsoft-365-E-Mail-Einträge (`MX`/`SPF`/`DKIM`/`autodiscover`) haben den
Umzug überstanden, E-Mail funktioniert. Zusätzlich musste der SPF-Eintrag
um `include:spf.easyname.com` ergänzt werden, damit die neuen
Formular-Mails aus 3.2 nicht als Spam eingestuft werden — umgesetzt, in
einen bestehenden Eintrag zusammengeführt statt als zweiter SPF-Eintrag
(der die ganze SPF-Prüfung ungültig gemacht hätte).

Drei URL-Muster ändern sich gegenüber der aktuellen Seite (`/angebote-2/` →
`/angebote/`, `/datenschutzerklaerung/` → `/datenschutz/`, Blogartikel
wandern unter `/blog/`) — primär ein technisches/SEO-Thema, ohne eigene
Datenschutz-Relevanz.

---

## 4. Zusammengefasste rechtliche Pain Points (Priorität grob absteigend)

1. **Die „geplant, noch nicht aktiv"-Formulierung für den Kommentarbereich**
   (3.6) — eine offene Wertungsfrage, die der Betreiber bewusst nicht selbst
   entschieden hat, sondern hierher zur Klärung gibt.
2. **Microsoft-Bookings Drittlandbezug/Auftragsverarbeitung** (3.1) — bleibt
   unabhängig vom Klick-zum-Laden bestehen, sobald der Kalender überhaupt
   genutzt wird.
3. **Klick-zum-Laden als hinreichende Lösung für das Cookie-/
   Einwilligungsproblem** (3.1) — eine technische Einschätzung des Projekts,
   noch nicht rechtlich bestätigt.
4. **Art.-9-Nähe der Formulardaten** (Kontaktformular und
   Selbsthilfegruppen-Anmeldung, 3.2/3.3) — unverändert offen, unabhängig
   vom jetzt geänderten technischen Versandweg des Kontaktformulars.
5. **EN/IT-Kennzeichnungspflicht** (3.7) — kein Datenschutzthema, aber
   dieselbe Deadline (vor Veröffentlichung prüfen).
6. **Formeller Auftragsverarbeitungsvertrag mit easyname** (3.8) — reine
   Verwaltungsaufgabe, aber noch nicht erledigt.

**Erledigt seit der letzten Fassung, nicht mehr auf dieser Liste:**
Microsoft Forms als Kontaktformular-Prozessor (durch die eigene Lösung
ersetzt, 3.2); die Hosting-/Standortfrage (3.8); die
Cookie-Banner-Notwendigkeit für die ganze Seite allein wegen des
automatischen Kalender-Ladens (durch Klick-zum-Laden entschärft, siehe aber
Punkt 3 oben — die Ausreichung dieser Lösung ist noch zu bestätigen).

---

## 5. Was wir vom Datenschutzbeauftragten brauchen

- Eine Einschätzung zu Punkt 1 (3.6): ist „geplant, noch nicht aktiv" eine
  zulässige Formulierung für eine nicht existierende Verarbeitung in einer
  aktuell gültigen Datenschutzerklärung, oder muss der Kommentar-Abschnitt
  ganz heraus, bis die Funktion tatsächlich existiert?
- Eine Einschätzung zu Punkt 2 (3.1): reicht der bestehende
  Auftragsverarbeitungsvertrag mit Microsoft für Bookings, oder braucht es
  wegen des thematischen Kontexts (Kinderwunschberatung) eine gesonderte
  Prüfung?
- Eine Bestätigung oder Korrektur zu Punkt 3 (3.1): ist Klick-zum-Laden
  rechtlich ausreichend, um ohne Cookie-Banner auszukommen?
- Eine Einschätzung zu Punkt 4 (3.2/3.3): reicht eine allgemeine
  Einwilligungs-Checkbox im Formular, oder braucht es eine explizitere
  Formulierung wegen der thematischen Sensibilität?
- Ein Review des bereits korrigierten Entwurfstexts
  (`src/pages/datenschutz.astro`, siehe Anhang) — die Betreiberin gibt den
  finalen Wortlaut frei, aber die rechtliche Grundstruktur sollte vorher
  geprüft sein, insbesondere Punkt 1.
- Eine kurze Rückmeldung, ob die bestehende Selbsthilfegruppen-Anmeldung
  (3.3, unverändert durch den Relaunch, aber möglicherweise ohnehin schon
  nachbesserungsbedürftig) mit in diese Prüfung gehört oder separat zu
  behandeln ist.

---

## Anhang: Referenzen im Projekt-Repository

Für Rückfragen liegt die vollständige, laufend geführte Dokumentation im
Repository der Website (`persephone-site`), insbesondere:

- `docs/decisions.md` — Abschnitt „Night run toward launch — 2026-09-13"
  und die beiden direkt anschließenden Einträge: vollständige Begründung
  aller heute getroffenen Entscheidungen, inklusive der hier unter 3.6
  ausdrücklich offen gehaltenen Kommentar-Frage.
- `OPEN-QUESTIONS.md` — ältere Befunde im Detail, inklusive der konkreten
  Cookie-/Storage-Messung vom 8.9.2026, die in 3.1 zitiert wird.
- `src/content/pages/de/datenschutzerklaerung.md` — Wortlaut der aktuellen
  Live-Datenschutzerklärung (unverändert übernommen, als Referenz).
- `src/pages/datenschutz.astro` — der bereits korrigierte Entwurfstext der
  neuen Seite (siehe 3.6) — das ist die Datei, die eine rechtliche Durchsicht
  braucht, nicht die alte Live-Fassung.
- `public/kontakt-senden.php` — das tatsächliche Kontaktformular-Skript
  (3.2), zur Einsicht, was mit den Formulardaten technisch passiert.
- `src/pages/kennenlernen.astro` — die Klick-zum-Laden-Umsetzung des
  Bookings-Kalenders (3.1).
- `docs/fuer-marina.md` — Fragen und Antworten mit der Betreiberin in
  Alltagssprache, u. a. zur Kalender-Einbettung, zur
  Besucherstatistik-Frage und zur Matomo-Entscheidung.

Dieses Dokument ist bewusst getrennt von den übrigen Projektunterlagen
abgelegt, da es an eine externe Stelle geht.
