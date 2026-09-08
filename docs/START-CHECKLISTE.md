# Startklar-Liste — was vor dem Umschalten stimmen muss

Stand 7.9.2026, abends. Diese Liste gab es bisher nicht; sie fasst zusammen, was zwischen
„die Seite ist fertig" und „persephone.at zeigt auf die neue Seite" liegt.

---

# Teil 1 — Hosting, Redaktionssystem und Marinas Frage 9 sind **eine** Entscheidung

Das ist der wichtigste Befund dieses Dokuments. Bisher standen drei Dinge getrennt in den
Notizen; tatsächlich hängen sie an derselben Wahl.

`dist/admin/config.yml` sagt es selbst, im Kopfkommentar:

> Backend `git-gateway` (Netlify Identity) — oder, bei jedem anderen Hoster,
> `backend: github` plus eine GitHub-OAuth-App, üblicherweise über eine kleine
> Serverless-Funktion vermittelt. Erst wenn das Hosting steht, kann man wählen.

Auf Deutsch: **wo die Seite liegt, entscheidet, wie Marina künftig Texte bearbeitet und
wie viel Arbeit das noch macht.** Solange das Hosting offen ist, ist auch Frage 9 in
`docs/fuer-marina.md` nicht wirklich beantwortbar — der Test, den sie machen soll, braucht
ein laufendes Backend.

## Was am Redaktionssystem noch fehlt, unabhängig vom Hoster

Ebenfalls aus `config.yml`, wörtlich: nur ein Teil der Felder ist ausgearbeitet
(`meta`, `hero`, `services`) — „als funktionierendes Beispiel des Musters". Die übrigen
Abschnitte (`painPoints`, `philosophy`, `founder`, `newsletter`, `footer`, `common`)
müssen noch nachgezogen werden, **bevor** das jemandem zum Bearbeiten gegeben wird.

Das ist eine eigene Arbeitseinheit, die in keiner Aufgabenliste steht. Sie kostet
schätzungsweise einen Arbeitsdurchgang und ist Voraussetzung dafür, dass Marinas Test
überhaupt aussagekräftig ist.

**Und noch ein Detail:** `dist/admin/index.html` lädt Decap von `unpkg.com` nach. Das ist
ein externer Aufruf — nicht besucherseitig, nur im Adminbereich, aber auf einer Seite, die
sonst konsequent nichts von außen lädt, sollte das bewusst so sein und nicht zufällig.

## Die drei Wege, und was sie konkret bedeuten

Ich nenne Fakten, wo ich sicher bin, und sage dazu, wo ich es nicht bin.

### A — Netlify

- **Redaktionssystem:** der Weg, für den die Konfiguration bereits geschrieben ist
  (`git-gateway`). Am wenigsten zusätzliche Arbeit — **unter einem Vorbehalt:**
  Netlify Identity, der Anmeldedienst dahinter, wurde für neue Projekte zurückgezogen.
  Wie der Stand heute genau ist, **musst Du vor der Entscheidung nachlesen** — ich kenne
  ihn nicht aktuell genug, um darauf eine Entscheidung zu stützen. Wenn Identity für neue
  Seiten nicht mehr verfügbar ist, fällt der Hauptvorteil von A weg und A wird zu C.
- **Weiterleitungen:** eine `_redirects`-Datei im Repo. Trivial.
- **Kosten:** für diese Seitengröße üblicherweise kostenlos.
- **Serverstandort:** global verteilt, nicht wählbar EU-only.

### B — Beim jetzigen Anbieter bleiben

- **Redaktionssystem:** hängt davon ab, was der Anbieter kann. Wahrscheinlich Weg C
  (GitHub-Backend plus OAuth-Vermittlung).
- **Weiterleitungen:** je nach Anbieter über `.htaccess` oder ein Panel. Meist machbar.
- **Kosten:** Du zahlst weiter für einen WordPress-Tarif, den die neue Seite nicht braucht.
- **Größter Vorteil, und er ist real:** DNS und E-Mail bleiben unangetastet. Das
  eliminiert das gefährlichste Risiko der ganzen Umstellung (siehe Teil 2).
- **Empfehlung, wenn Du unsicher bist:** so starten. Man kann später ohne Datenverlust
  umziehen; die Seite ist ein Ordner mit statischen Dateien.

### C — Cloudflare Pages oder Hetzner

- **Redaktionssystem:** `backend: github` plus GitHub-OAuth-App plus eine kleine
  Vermittlungsfunktion. Mehr Einrichtung, dafür unabhängig von einem Anbieterdienst, der
  eingestellt werden kann.
- **Weiterleitungen:** bei Cloudflare eine `_redirects`-Datei, bei Hetzner die
  Webserver-Konfiguration.
- **Kosten:** Cloudflare Pages für diese Größe kostenlos; Hetzner wenige Euro im Monat.
- **Serverstandort:** bei Hetzner sicher EU. Das ist für eine Seite in diesem Themenfeld
  ein Argument, das über „nice to have" hinausgeht.

## Meine Empfehlung

**B, wenn es schnell und ohne Risiko gehen soll. C mit Hetzner, wenn die Seite dauerhaft
sauber stehen soll.** A würde ich erst dann in Betracht ziehen, wenn geklärt ist, dass
Identity für neue Projekte noch verfügbar ist.

Was ich **nicht** empfehle: die Entscheidung weiter offen lassen und trotzdem
weiterbauen. Sie blockiert die Weiterleitungen, die kanonischen URLs, den Domaineintrag in
der Konfiguration und Marinas Editor-Test — vier Dinge, die alle vor dem Start fertig sein
müssen.

---

# Teil 2 — Die Reihenfolge beim Umschalten

## Vorher, in dieser Reihenfolge

1. **Vollständiges Backup der WordPress-Seite.** Datenbank und `wp-content`. Nicht nur
   das Hoster-Backup — eine eigene Kopie, die Du in der Hand hast. Wir haben Texte und
   Bilder extrahiert, aber niemand hat geprüft, ob wirklich *alles* mitgekommen ist.
   Sobald die alte Seite weg ist, ist sie weg.

2. **Die aktuellen DNS-Einträge abschreiben, bevor irgendetwas geändert wird.**
   Screenshot oder Textdatei, alle Einträge. Besonders: `MX`, `SPF` (ein `TXT`-Eintrag mit
   `v=spf1`), `DKIM` (meist `selector1._domainkey` und `selector2._domainkey` als `CNAME`)
   und `autodiscover`. Das sind die Microsoft-365-Einträge.

3. **Die vollständige Liste aller alten URLs erstellen.** Die bekannten stehen unten in
   Teil 3, aber sie ist unvollständig: WordPress erzeugt zusätzlich Kategorie-, Schlagwort-
   und Autorenseiten, und die Medien-URLs unter `/wp-content/uploads/…`. Die bekommt man
   aus dem WordPress-Export oder aus der Sitemap der alten Seite. **Diese Liste muss
   stehen, bevor umgeschaltet wird** — danach kann man nicht mehr nachsehen.

4. **Weiterleitungen einrichten und testen**, solange die alte Seite noch läuft.

5. **Alle offenen Punkte aus `docs/fuer-marina.md` beantwortet** — vor allem 11, 12 und 13
   (Datenschutzerklärung, die beschriebene Statistik, die es nicht gibt, und die
   Cookie-Banner-Frage).

6. **Die Microsoft-Forms-URL für das Kontaktformular.** Ohne sie sendet das neue Formular
   nirgendwohin. Steht auf dem kritischen Pfad.

7. **Auf einem echten Telefon durchklicken.** Ich habe nur geprüft, dass bei 390 px nichts
   horizontal überläuft — wie es aussieht und sich anfühlt, hat noch niemand gesehen.

## Beim Umschalten

8. **Nur den `A`- beziehungsweise `CNAME`-Eintrag für die Website ändern. Sonst nichts.**
   `MX`, `SPF`, `DKIM` und `autodiscover` bleiben, wie sie sind. Das ist die Stelle, an der
   bei solchen Umzügen am häufigsten die E-Mail stirbt — und man merkt es erst, wenn
   tagelang nichts ankommt.

9. **Die alte Seite nicht sofort löschen.** Ein bis zwei Wochen erreichbar lassen, unter
   einer anderen Adresse, falls etwas fehlt.

## Danach

10. **Testmail an marinabletsas@persephone.at** und eine über das neue Kontaktformular.
11. **Eine Testbuchung** über den Terminkalender, komplett durch.
12. **Die alten URLs stichprobenartig aufrufen** und prüfen, ob die Weiterleitungen
    greifen — besonders die Blogartikel.
13. `site` in `astro.config.mjs` steht dann auf der echten Domain, die kanonischen URLs
    stimmen, und `noindex` ist von den deutschen Seiten weg (auf `/en/` und `/it/` bleibt
    es, bis Marina freigibt).

---

# Teil 3 — Die bekannten Weiterleitungen

Alle am 7.9.2026 gegen die Live-Seite geprüft. **Unvollständig** — siehe Punkt 3 oben.

| alt (persephone.at) | neu |
|---|---|
| `/angebote-2/` | `/angebote/` |
| `/datenschutzerklaerung/` | `/datenschutz/` |
| `/maenner-im-kinderwunsch-mythos-stille-staerke/` | `/blog/maenner-im-kinderwunsch-mythos-stille-staerke/` |
| `/texte-stimmen-lieder/` | `/blog/texte-stimmen-lieder/` |
| `/zwischen-lichterglanz-und-leere/` | `/blog/zwischen-lichterglanz-und-leere/` |
| `/einsam-im-kinderwunschprozess/` | `/blog/einsam-im-kinderwunschprozess/` |
| `/ist-unfruchtbarkeit-immer-noch-frauensache/` | `/blog/ist-unfruchtbarkeit-immer-noch-frauensache/` |
| `/maenner-im-kinderwunsch-mythos-maennerohnmacht/` | `/blog/maenner-im-kinderwunsch-mythos-maennerohnmacht/` |
| `/termine/` | `/kennenlernen/` |

Die letzte Zeile ist neu (NACHTLAUF-2026-09-08.md C2): Marina hat die Seite
„Kennenlernen" genannt, der Besitzer hat am 8.9. entschieden, dass der Pfad mitwandert
(OPEN-QUESTIONS.md #8/#24) — umgesetzt, `/termine/` gibt es im Rebuild nicht mehr.

Unverändert und ohne Weiterleitung: `/`, `/ueber-uns/`, `/beratung/`, `/workshops/`,
`/selbsthilfegruppe/`, `/blog/`, `/kontakt/`, `/faqs/`, `/impressum/`,
`/disclaimer/`, `/newsletter/`.

**Alle sechs Blogartikel liegen live direkt an der Wurzel.** Das ist die folgenreichste
Änderung: ohne Weiterleitungen laufen sämtliche bestehenden Links auf die Artikel und alle
Suchmaschinentreffer ins Leere.
