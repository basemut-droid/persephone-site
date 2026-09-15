# Handoff — current state

Read this first at the start of every session. Full history and reasoning for every
past decision lives in `docs/decisions.md` (newest first) — this file only tracks
what's actually current, so it stays short enough to read. Full open-item tracker
(with options/recommendations) is `OPEN-QUESTIONS.md`; the ordered, attended
cutover-day checklist is `docs/LAUNCH-TAG-RUNBOOK.md`. Don't duplicate either here.

## Priority zero: contact-form spam retest — submitted tonight, awaiting Marina

A real contact-form submission had landed in spam before. A likely cause was found
and fixed (`kontakt-senden.php`'s `mail()` had no envelope-sender override —
`-fno-reply@persephone.at` added as the 5th parameter, since `persephone.at`'s DMARC
uses strict SPF alignment, `aspf=s`) and is deployed. **The owner submitted a fresh
test through the real form tonight (2026-09-15)** — result not yet known, waiting to
hear from Marina which folder it landed in. **Next session: check with her first
before doing anything else here.** If it's still landing in spam, look at whether
easyname offers DKIM-signing for outbound mail (a hosting-level setting, not a code
fix) and whether SPF has had time to propagate. Full reasoning: `docs/decisions.md`,
"Night run toward launch — 2026-09-13".

## CMS: what works, what's still open

**Works, tested end-to-end tonight (2026-09-15):** `/admin/` on
`https://neu.persephone.at` — GitHub-backed Decap CMS, login via a self-hosted PHP
OAuth broker (`public/cms-auth.php` + `public/cms-callback.php`, replacing an earlier
unused Cloudflare Worker plan). Covers 9 of 12 standalone pages plus blog/site text,
with real image uploads. Setup record: `docs/CMS-BROKER-SETUP.md`. Full reasoning for
both the broker build and tonight's login test (including a real easyname ModSecurity
bug found and fixed): `docs/decisions.md`'s three 2026-09-15 entries.

**Still open before Marina can actually use it, and before real cutover:**
- **A scoped easyname ModSecurity exception is needed on the live domain —
  support ticket sent 2026-09-15, awaiting their reply.** GitHub's OAuth
  callback always carries a parameter easyname's firewall misreads as an
  attack (blocks with its own 406 page) — fixed for `neu.persephone.at` via
  that subdomain's own firewall checkbox (Subdomains → `neu.persephone.at` →
  Erweiterte Einstellungen), but the live domain has no such per-subdomain
  lever and no Passwortschutz gate in front of it, so leaving its firewall
  off entirely is a real, standing security regression rather than a
  one-time toggle. The message sent is below, kept for reference in case a
  follow-up is needed. **Next session: check whether easyname has replied
  before re-sending or trying anything else.**
- **Marina isn't a GitHub collaborator yet.** Today's test used the owner's
  own GitHub account. She needs her own GitHub account (created) and
  collaborator access on `basemut-droid/persephone-site` (repo → Settings →
  Collaborators) before she can log into `/admin/` herself.
- **Deliberately excluded from CMS editing, needs real work first, not a
  quick fix:** `angebote.md` (`recognitionPanel`'s dynamic-keyed dict) and
  `beratung.md` (`formatBadges`'s dict) — no clean Decap widget represents
  either without changing their on-disk shape.
- **Possible future project, not started, not decided:** a block-based
  "add/reorder sections yourself" editor (Decap supports variable-type list
  fields) — real trade-off against this project's fixed, reviewed
  per-page layouts. Worth scoping properly if ever wanted, not a quick add-on.

### Draft support message for the ModSecurity exception (easyname)

```
Betreff: ModSecurity blockiert legitimen GitHub-OAuth-Callback (Error 406) — gezielte Ausnahme statt Firewall-Abschaltung gewünscht

Hallo,

auf meinem Webhosting-Account (Kundennummer 197091) läuft unter
neu.persephone.at (Verzeichnis /apps/wordpress-180662/) ein selbst
geschriebenes PHP-Skript (cms-callback.php), das den GitHub-OAuth-Login für
einen CMS-Editor verarbeitet. GitHub hängt an jeden OAuth-Callback einen
Parameter namens "iss" an (z. B. iss=https%3A%2F%2Fgithub.com%2Flogin%2Foauth
— eine Standard-Sicherheitsfunktion von GitHub selbst, nicht etwas, das ich
ändern kann). Mod Security stuft diesen Parameter offenbar als eingebettete
URL und damit als möglichen SSRF-/Open-Redirect-Angriff ein und blockiert die
Anfrage mit "Error 406 - Security incident detected", bevor mein Skript
überhaupt ausgeführt wird. Es handelt sich aber um einen völlig legitimen,
erwarteten GitHub-Redirect, keinen Angriff.

Betroffene URL (Beispiel): https://neu.persephone.at/cms-callback.php?code=...&iss=https%3A%2F%2Fgithub.com%2Flogin%2Foauth

Ich möchte die Application Firewall nicht komplett abschalten, da das die
gesamte Domain schutzlos stellen würde. Gibt es eine Möglichkeit, gezielt nur
diesen einen Pfad (/cms-callback.php) oder die konkrete ModSecurity-Regel, die
hier greift (ID würde sich aus Ihren Logs ergeben), von der Prüfung
auszunehmen, während der Rest der Domain weiterhin vollständig geschützt
bleibt?

Das Gleiche wird künftig auch für die Hauptdomain persephone.at gelten, sobald
der Login-Broker dorthin umzieht — falls die Ausnahme dafür separat beantragt
werden muss, sagen Sie mir gerne Bescheid, was Sie dafür von mir brauchen.

Vielen Dank!
```

## What's built

All 14 pages (homepage + 12 standalone pages + blog) render from real content
collection entries (`src/content/pages/de/`, `src/content/blog/de/`,
`src/content/site/`) via `parseMarkdownBlocks.ts` + `BlockTracker` — see
`DESIGN-SYSTEM.md`'s "Page composition" section for how and why.
`docs/source-archive/` stays a frozen, never-touched verbatim record of the
original extraction; `src/content/` is the live, editable copy. Content and
design are complete and reviewed as of the 2026-09-09 Nachtlauf — full
phase-by-phase build history with commit hashes is in `docs/decisions.md`.

## Verified working

- `npm run build` (`astro build && node scripts/build-check.mjs`) and `npx astro
  check` are both clean. Blocking checks: source headings, image alt text,
  schema fields rendered/allow-listed, internal links resolve, link accessible
  names, meta descriptions — see `scripts/build-check.mjs`.
- `npm run dev` / `npm run build && npm run preview` both start cleanly on port 4321.
- Kennenlernen's Microsoft Bookings iframe refuses to load under `localhost` in
  dev (Microsoft's own `frame-ancestors` CSP, not this site's) — expected;
  re-check on real hosting.
- `playwright@1.63.0` is installed locally via `npm install --no-save` (not in
  package.json/lock) for visual QA — reuses the chromium binary cached under
  `%LOCALAPPDATA%\ms-playwright`. Reach for `page.screenshot()` over a plain
  `msedge.exe --headless --screenshot` CLI call — the latter gave unreliable
  results at narrow widths on this machine. A throwaway `scratch-*.mjs`
  pattern (git-ignored via `.git/info/exclude`) is the convention for one-off
  screenshot/measurement scripts.

## Known gaps

Full list with options/recommendations: `OPEN-QUESTIONS.md`. Still open, worth
knowing without opening that file:

- **Datenschutzerklärung needs the owner's *and* the DSB's sign-off** — a
  corrected draft exists (`src/pages/datenschutz.astro`) but isn't reviewed or
  approved. `docs/DATENSCHUTZBEAUFTRAGTER-BRIEFING.md` lists the open legal
  questions, top one being the Kommentare-section wording tension.
- **EN/IT must not be published** until the owner reads them line by line —
  still gating on a training-status disclosure fix.
- **Two proposed color values need Marina's sign-off** (`OPEN-QUESTIONS.md` #28).
- **Nobody has clicked through the actual deployed site on a real phone yet**
  (`docs/LAUNCH-TAG-RUNBOOK.md` point 2).
- Two of the ten meta descriptions still carry a wording question
  (`docs/fuer-marina.md` Frage 16).
- **Kontakt's Anliegen options are still genuinely unresolved, not moot** —
  corrected an earlier hasty note tonight; see `OPEN-QUESTIONS.md` #26.

## Code review pass — 2026-09-15, two real bugs fixed

A high-effort `/code-review` over `src/`, `public/`, `scripts/` found and got
two real, confirmed bugs fixed same night, plus one already-known issue
re-confirmed:

- **Fixed, currently-live-impact bug:** Decap's markdown widget re-serializes
  `-` lists as `*` on every CMS save; `parseMarkdownBlocks.ts`'s list
  detection only recognized `-`, so any list-containing page resaved through
  `/admin/` silently lost that list with no build error. Confirmed this had
  already happened — Selbsthilfegruppe's meeting-details list (date/time/
  address) was genuinely empty in the built output from tonight's own CMS
  test save. Fixed by accepting all three CommonMark bullet markers
  (`-`/`*`/`+`); verified the list renders again.
- **Fixed, security gap in tonight's own new code:** the CMS OAuth broker
  (`cms-auth.php`/`cms-callback.php`) had no CSRF `state` parameter — a login-
  CSRF gap. Added (session-stored, `hash_equals`-checked). **Not yet retested
  against the real server** — this adds a session cookie to a login flow that
  already had Passwortschutz/ModSecurity interactions found earlier tonight.
  **Next session: redo the end-to-end `/admin/` login test before trusting
  this works.**
- **Already known, re-confirmed, not fixed:** Decap strips YAML frontmatter
  comments (decision-provenance notes) on every save — same finding reported
  live during tonight's CMS test, still unresolved, your call whether it's
  worth fixing.

**Also rewrote `README.md`** — it still described the project as an early
"Phase 1" homepage-only prototype (wrong font listed, CMS called "not usable,"
only 4 pages listed in the structure tree). Rewritten to match reality and
added a "Documentation map" section explaining what each doc in this project
is for.

## Documentation cleanup — 2026-09-15

`OPEN-QUESTIONS.md` and `DESIGN-SYSTEM.md` had both drifted — several stale
open items, and `DESIGN-SYSTEM.md` describing code as it used to be rather
than as it is now (a color that moved, a removed component prop, a rebuilt
nav dropdown, among others). Fact-checked and fixed; full list of what was
wrong and why: `docs/decisions.md`'s matching 2026-09-15 entry. Also closed
the repo-hygiene backlog — `docs/fuer-marina.md`'s long-pending edit and ten
more untracked history docs/screenshot folders are committed now; `Claude
outputs/` (stale/duplicate content, not a project folder) is `.gitignore`'d.
Working tree is clean.

## Next step

1. **Check with Marina** where tonight's contact-form test landed (priority
   zero above) — both this and the ModSecurity ticket below are now waiting
   on someone else's reply, not on more unattended work.
2. **Check whether easyname has replied** to the ModSecurity support ticket
   sent tonight; only re-send or escalate if there's been no response after a
   reasonable wait.
2b. **Redo the `/admin/` login test** — tonight's CSRF fix added a session
   cookie to the flow after it was last tested working; confirm it still
   logs in cleanly before relying on it.
3. Once both are resolved: work through `docs/LAUNCH-TAG-RUNBOOK.md` top to
   bottom — the single ordered checklist for the rest of launch day. Everything
   on it needs the owner's (or Marina's, or the DSB's) attention, not more
   unattended code work.
4. When ready to hand the CMS to Marina: create her GitHub account, add her as
   a repo collaborator, walk her through the `/admin/` login once.
