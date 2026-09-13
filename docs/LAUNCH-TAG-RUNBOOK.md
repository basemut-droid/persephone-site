# Launch-Tag — Schritt für Schritt

Zusammengeführt aus `START-CHECKLISTE.md` Teil 2 und der Nachtarbeit vom 13.9.2026
(`decisions.md`), damit am eigentlichen Tag nicht zwischen drei Dokumenten
gesprungen werden muss. Alles hier ist entweder schon erledigt (✅, mit Datum) oder
wartet auf dich/Marina (⬜) — nichts davon kann ich autonom für dich erledigen, aus
denselben Gründen, die letzte Nacht schon genannt wurden (Zugangsdaten, geteiltes
Hosting-Konto mit der Live-Seite, oder einfach: es muss jemand echt hinschauen).

---

## Bereits erledigt (Stand 13.9., nachts)

- ✅ Hosting entschieden und eingerichtet: easyname, Domain bereits dort.
- ✅ E-Mail-Umzug bestätigt: Testmail an marinabletsas@persephone.at hin und
  zurück funktioniert.
- ✅ Kontaktformular technisch fertig (`public/kontakt-senden.php`), inklusive
  eines Envelope-Absender-Fixes für DMARC-Ausrichtung — **aber noch nie echt
  getestet** (siehe Punkt 3 unten).
- ✅ Terminkalender auf Klick-zum-Laden umgestellt, kein Cookie-Banner mehr nötig.
- ✅ Datenschutzerklärung korrigiert (noch nicht von Marina freigegeben, noch
  nicht rechtlich geprüft — siehe `DATENSCHUTZBEAUFTRAGTER-BRIEFING.md`).
- ✅ Weiterleitungen (`public/.htaccess`) gegen die echte Sitemap der Live-Seite
  geprüft und erweitert.
- ✅ Produktionsdomain in `astro.config.mjs` und `robots.txt` gesetzt.
- ✅ Deploy-Pipeline eingerichtet UND bewiesen funktionsfähig: ein echter Deploy
  auf `neu.persephone.at` ist heute Nacht gelaufen und erfolgreich durchgekommen.
- ✅ `neu.persephone.at` per Passwortschutz abgesichert, damit nichts davon
  vorzeitig in Google landet.

## Vor dem Umschalten — in dieser Reihenfolge

1. ⬜ **Vollständiges WordPress-Backup.** Datenbank und `wp-content`, deine
   eigene Kopie, nicht nur was der Hoster automatisch sichert. Sobald die alte
   Seite weg ist, ist sie weg — das kann niemand mehr nachholen.
2. ⬜ **`neu.persephone.at` einmal wirklich durchklicken**, auf echtem Handy und
   Desktop. Ich habe nur geprüft, dass nichts horizontal überläuft und dass der
   Build fehlerfrei durchläuft — wie es sich anfühlt, hat noch niemand gesehen.
3. ⬜ **Das Kontaktformular echt absenden**, auf `neu.persephone.at`, und prüfen,
   ob die Mail bei marinabletsas@persephone.at ankommt (auch im Spam-Ordner
   nachsehen). Das ist der einzige Weg, den SPF-/DMARC-Fix von heute Nacht
   wirklich zu bestätigen — ich kann von hier aus kein Formular absenden.
4. ⬜ **Marina liest die korrigierte Datenschutzerklärung** und gibt den Wortlaut
   frei (`src/pages/datenschutz.astro`) — insbesondere die in
   `DATENSCHUTZBEAUFTRAGTER-BRIEFING.md` Punkt 1 offen gelassene Frage zum
   Kommentar-Abschnitt.
5. ⬜ **Rückmeldung vom Datenschutzbeauftragten** zu den in dessen Briefing
   gelisteten Punkten (Bookings-Drittland, Klick-zum-Laden-Ausreichung,
   Art.-9-Nähe der Formulardaten).
6. ⬜ **Auftragsverarbeitungsvertrag mit easyname** abschließen (reine
   Formalität, aber noch nicht erledigt).

## Beim Umschalten

7. ⬜ **Nur den `A`-Eintrag für `persephone.at` (und `www`) auf easyname
   umstellen — sonst nichts.** `MX`, `SPF`, `DKIM`, `autodiscover` bleiben exakt
   wie sie sind (der SPF-Eintrag wurde heute Nacht schon erweitert, nicht extra
   nochmal anfassen). Das ist die Stelle, an der bei sowas am häufigsten die
   E-Mail stirbt.
8. ⬜ **Deploy-Ziel auf den Live-Ordner umstellen.** `.github/workflows/deploy.yml`
   zeigt aktuell bewusst auf `apps/wordpress-180662/` (die Staging-Kopie), nicht
   auf den Account-Root, wo die Live-WordPress-Seite liegt
   (`apps/wordpress-124063/`). **Diese Zeile muss vor dem echten Umschalten
   geändert werden** — sag mir Bescheid, dann mache ich das in einem eigenen,
   bewussten Schritt, nicht nebenbei.
9. ⬜ **Alte Seite nicht sofort löschen.** Ein bis zwei Wochen unter einer
   anderen Adresse erreichbar lassen, falls doch etwas fehlt.

## Danach

10. ⬜ Testmail an marinabletsas@persephone.at **und** eine übers neue
    Kontaktformular (auf der jetzt echten Domain, nicht mehr nur Staging).
11. ⬜ Eine Testbuchung über den Terminkalender, komplett durch.
12. ⬜ Stichprobenartig alte URLs aufrufen, besonders die Blogartikel — greifen
    die Weiterleitungen?
13. ⬜ `noindex` von den deutschen Seiten entfernen (auf `/en/`/`/it/` bleibt es,
    bis Marina die Übersetzungen freigibt) — das ist bereits im Code vorbereitet,
    ich kann das umschalten, sobald ihr so weit seid.

---

**Kurz gesagt:** die Technik steht und wurde heute Nacht einmal echt bewiesen
(nicht nur behauptet). Was fehlt, ist an Zugängen, Entscheidungen oder
Aufmerksamkeit gebunden, die nur ihr beide bzw. der Datenschutzbeauftragte geben
können — nicht an mehr Code.
