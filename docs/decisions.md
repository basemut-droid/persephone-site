# Decisions and session history

Append-only archive of past sessions' work, moved out of `HANDOFF.md` so that file
can stay a "current state only" document (`external-review.md`'s "PROCESS NOTE" and
`docs/NIGHT-RUN.md`'s closing instruction). Newest entries at the top.

---

# Documentation cleanup pass: OPEN-QUESTIONS.md, DESIGN-SYSTEM.md, repo hygiene — 2026-09-15

Same night as the CMS broker work above, a separate, deliberate cleanup pass —
requested explicitly because both docs and the working tree had gotten
"convoluted." Scope: fix facts, don't invent, log genuine doubts as questions
rather than deciding them — same standard as everything else in this project.

**`OPEN-QUESTIONS.md`:** five stale entries (#0c, #4, #6, #15, #25) marked
resolved with a short pointer to their real record in this file, following the
file's own existing pattern for closed items (a stub, not a blanket deletion,
so a closed question doesn't get re-investigated from scratch). **One real,
previously-missed drift caught in the process:** #26 (Kontakt's three-vs-four
Anliegen options) had been called "moot" in an earlier `HANDOFF.md` note — false;
verified against the actual shipped code (`ContactForm.astro`/`kontakt-senden.php`,
which even carries its own code comment naming this exact contradiction) and
found no recorded decision ever reconciled the two option sets. Corrected to
say so plainly rather than let a hasty note stand as settled.

**`DESIGN-SYSTEM.md`:** a full fact-check against `global.css` and every
component/page it describes (not against the doc's own prior text), per an
explicit instruction to fix facts only, not declutter the historical
"was X, now Y, because" annotations (those are decision-provenance, the kind
of thing this project's `CLAUDE.md` asks to keep, unlike `HANDOFF.md`'s pure
duplication). Confirmed drift, all from later live corrections nobody looped
back to this doc for:
- Über uns's qualification-band panels moved color (`--color-teal-dark` →
  `--color-teal`, 2026-09-11) — computed the resulting contrast directly from
  the token's own hex values via the WCAG formula (≈2.4:1, lower than the
  already-substandard 2.96:1 it replaced) rather than asserting a number
  without deriving it.
- `ServiceCard`'s pomegranate-seed texture, removed entirely (`OPEN-QUESTIONS`
  #39) — doc still described it.
- `ClosingCta`'s `layout: 'overlap'|'pair'` prop and its fixed pixel
  dimensions, both gone since a 2026-09-11 unification to one shape — doc
  still described the old two-shape version.
- `CtaBand`'s "Used by" column wrongly duplicated `ClosingCta`'s page list —
  it's HomePage-only; those four pages use the other component.
- The nav dropdown's rebuild from native `<details>` to a button+JS mechanism
  (a `<details>` can't both navigate and disclose, `external-review.md` #0) —
  doc still described the old, since-replaced version, including a
  since-reverted color-on-open behavior. Language switcher, unaffected, still
  works as documented — split the two apart where they'd been wrongly lumped
  together in the Interaction States table.
- `ContactForm`'s inventory row said "not wired to a backend" and listed a
  phone field, both stale since the in-house PHP script and a field-set
  change.
- `PageHero`'s plain-banner width is `1200px`, not the `48rem`/768px this doc
  claimed — changed 2026-09-12 for a title-alignment fix that never got
  reflected here; the doc's own `OPEN-QUESTIONS` cross-reference (#17) was
  also simply wrong (that entry is about `.hero-grid`'s height). Updated
  `OPEN-QUESTIONS.md` #9 to match — its whole premise (a narrower lede)
  no longer describes the code, so it's reopened with corrected numbers
  rather than left stale.
- `--space-6`'s "adopted by `CtaBand`" claim was stale — that gap was removed
  entirely on request, 2026-09-11; only `--space-7` is genuinely in use.
- A `--color-footer-bg`/`#e9dccd` mention in the historical "Gap-closing
  pass" section was never marked superseded by its own later removal.

Added a proper "Qualification bands" section (previously just one color-table
cell) reflecting the current build in full: flat color, no texture/accent,
2:1 panel:image split, the full-bleed width exception, and the scroll-
crossfade mechanism.

**Repo hygiene:** `docs/fuer-marina.md` had a large, complete, coherent edit
(a full "Teil 4," Fragen 12–20, Marina's own recorded answers through an
updated summary table) sitting uncommitted since before this session —
already cited by name elsewhere in already-committed docs, strong evidence
it was meant to be committed alongside an earlier session's work and simply
got missed. Same situation for ten more run-record docs
(`FEEDBACK-2026-09-08.md`, `NACHTLAUF-2026-09-09.md`, `NACHTRAG-2026-09-11.md`,
`PRUEFUNG-B1.md`, `RUN-2026-09-07-B/-B1/-B2.md`, `UEBERGABE-CHAT.md`,
`UEBERSETZUNG.md`, `VERGLEICH-2026-09-07.md`) and two QA screenshot batches —
all committed now. `Claude outputs/` (6.7MB — screenshots plus stale or
duplicate copies of files that already exist properly in `docs/`, matching
the default save location some Claude interfaces write generated files to,
not a project folder) is `.gitignore`'d rather than deleted outright — unlike
a tracked file, there'd be no way back if that judgment turned out wrong;
left in place on disk for a human to review.

---

# CMS login broker tested end-to-end; a real ModSecurity block found and fixed for staging — 2026-09-15

Continuation of the same day's broker build (entry below). The owner walked
through the remaining manual steps himself: created the GitHub OAuth App
(callback `https://neu.persephone.at/cms-callback.php`), wrote the real
Client ID/Secret into `public/cms-secrets.local.php`, and uploaded that one
file by hand via easyname's Web-FTP, confirmed sitting next to the
already-deployed `cms-auth.php`/`cms-callback.php`. First login attempt from
`https://neu.persephone.at/admin/` failed with easyname's own 406 "Security
incident detected" page — a real bug, not a config mistake, found and fixed
this session rather than left open.

**Root cause:** GitHub attaches an `iss=https://github.com/login/oauth`-style
parameter (RFC 9207 issuer identification, a platform-wide GitHub security
feature, not something either broker version chose or can turn off) to every
OAuth callback. easyname's **ModSecurity** application firewall has a rule
flagging any query parameter that decodes to a full URL as a likely
SSRF/open-redirect attack, and blocked the request before `cms-callback.php`
ever ran — confirmed by inspecting the failing URL together and finding
"Mod Security" toggled on in the hosting panel.

**Two places this setting exists, confirmed by checking both:** Webhosting →
Webserver Einstellungen has a single Mod Security toggle described as
applying "für alle deine Subdomains" — since this same easyname account also
hosts the live WordPress site, flipping that would have also dropped the live
site's firewall protection, so it was deliberately left alone. Instead, found
a genuinely per-subdomain override: Subdomains → `neu.persephone.at` →
Erweiterte Einstellungen has its own "Application Firewall aktivieren"
checkbox, scoped to that one subdomain's webspace path
(`/apps/wordpress-180662/`) only. Unchecked that one — confirmed it does not
touch the live site — and the login then completed successfully.

**Open, deliberately not resolved today — before the real cutover, not
blocking anything now:** this isn't a one-time fix. GitHub sends the same
`iss` parameter on every single login, not just the first, so whatever
subdomain the broker points at needs this exception in place permanently, for
as long as anyone logs into `/admin/`. On the live domain, the per-subdomain
checkbox is a much worse trade-off than on password-gated staging: leaving the
whole live site's firewall off permanently is a standing security regression,
and asking Marina to manually toggle a hosting-panel setting before every edit
defeats the entire point of giving her a simple web editor. The right fix is
an easyname Support ticket asking for a scoped ModSecurity exception (just the
`/cms-callback.php` path, or just the specific rule ID, which their own logs
would show) — not started, needs doing before cutover.

**Also open:** today's test used the owner's own GitHub account (already has
repo-owner write access). Marina doesn't have a GitHub account yet, and even
once she does, she needs to be added as a collaborator on
`basemut-droid/persephone-site` before she can use `/admin/` herself —
Decap's GitHub backend commits as whoever logs in, so login alone isn't
enough without repo write access on the other side. Not started today,
deliberately deferred until closer to actually handing the CMS to her.

---

# CMS OAuth broker built as PHP — 2026-09-15

Implemented the plan from the entry below, exactly as written in
`HANDOFF.md`'s "Exact plan for building the PHP broker" section — nothing
re-decided.

**`public/cms-auth.php`** builds GitHub's authorize URL (`client_id`,
`redirect_uri` derived from the current request's own host so it works
unchanged against both `neu.persephone.at` and, later, the real domain,
`scope=repo,user`) and redirects. **`public/cms-callback.php`** exchanges the
returned `code` for a token and returns Decap's documented postMessage
handshake — same handshake shape the deleted Cloudflare Worker
(`cms-oauth-worker/worker.js`, see commit `26df2bd`) used, since that shape is
Decap's contract, not an implementation detail either version was free to
change. Implements the token exchange with curl when available, falling back
to `file_get_contents` + a stream context otherwise — genuinely untested
against easyname's actual PHP build (no PHP CLI available locally to lint
either file directly; reviewed by hand instead). Deliberately avoided PHP
8.1's `never` return type, since easyname's exact PHP version hasn't been
confirmed yet.

**`public/cms-secrets.local.php`** exists locally only as a placeholder
(`REPLACE-ME` constants) — confirmed still gitignored (`git check-ignore`
matches it, `git status` never lists it) and never staged. The real Client
ID/Secret only exist once the owner creates the GitHub OAuth App, which needs
their own GitHub account/browser and so couldn't happen this session — that
and the one-time FTP upload of the real secrets file are the two steps left,
written up step-by-step in the new `docs/CMS-BROKER-SETUP.md` (replacing the
deleted `cms-oauth-worker/README.md`'s role).

**`public/admin/config.yml`** updated: `backend.base_url` set to
`https://neu.persephone.at` (this project's test-before-real-domain pattern —
swap to the real domain only after actual cutover, which has not happened),
`backend.auth_endpoint: "cms-auth.php"` added, and the stale comment block
describing the Cloudflare Worker replaced.

Verified `npm run build` stays clean (all eleven `build-check.mjs` rules
still pass) and that both new PHP files land in `dist/` as plain
passthrough files, same as the already-deployed `kontakt-senden.php` — Astro's
build never touches `public/`'s contents, it only copies them.

---

# CMS OAuth broker reconsidered: PHP on easyname, not Cloudflare — 2026-09-15

The `cms-oauth-worker/` Cloudflare Worker built on 2026-09-13 is superseded before
ever being deployed. The owner asked, correctly, why Cloudflare was needed again
given it was rejected for hosting specifically over its US/third-country status —
worth stopping to actually reason through rather than wave past.

**The reasoning that resolved it:** Cloudflare-as-hosting would have sat between
every visitor and the site — every page view, routed through a US company, squarely
the kind of processing a Datenschutzerklärung has to disclose. The OAuth broker is
different in kind: it only ever runs when the site owner herself logs into the admin
editor, never for a visitor. A privacy policy discloses processing of visitors' data;
an internal tool the owner uses to manage her own content isn't the same category.
That reasoning is offered here as reasoning, not as a settled legal conclusion — it
was not put to the DSB, and doesn't need to be, precisely because it's about internal
tooling rather than visitor data.

**Decided anyway: build it as PHP on easyname instead**, not because Cloudflare was
legally required to be disclosed, but for consistency with every other choice this
project has made — Hetzner/easyname over Cloudflare for hosting, the in-house PHP
script over web3forms for the contact form. Introducing a second provider to answer
a question that a already-vetted one can avoid entirely isn't worth it just because
this particular instance's disclosure case happens to be weaker.

**Real trade-off, not free:** Cloudflare's `wrangler secret put` makes it structurally
impossible for the GitHub OAuth Client Secret to end up in git. On easyname, the
equivalent safety requires discipline — the secret must live in a file that's
`.gitignore`'d and uploaded once by hand via FTP, never committed. **This matters
more than usual because the repo is public** — a secret accidentally committed here
would be visible to anyone on the internet, not just collaborators. The implementation
plan in `HANDOFF.md`'s "Most recent" section spells out exactly how to avoid that.

`cms-oauth-worker/` (the Cloudflare Worker code) was deleted the same day rather than
left in the tree as dead, actively-misleading code pointing at an abandoned approach.

---

# Night run toward launch — 2026-09-13

Scope: get everything ready for a deliberate, attended cutover the next day — not an
unattended DNS flip, which stayed out of scope on purpose (see reasoning below).

**Critical finding before any deploy work: WordPress and the planned staging target
share one easyname account.** persephone.at's live A record and the FTP account's
root both lead to `apps/wordpress-124063/`. An unattended deploy script pointed at
the account's root could have overwritten the live site's files overnight with nobody
watching. Resolved by using `neu.persephone.at` instead, confirmed via Web-FTP to
point at a **separate, currently-nonexistent** folder (`apps/wordpress-180662/` —
likely an abandoned setup from an earlier Avada attempt Marina made herself; easyname
returns its own 404 there, not WordPress's, meaning nothing meaningful exists to lose).
`.github/workflows/deploy.yml` targets that folder explicitly, never the account root.

**Decisions made this session, each confirmed with the owner first:**
- Kennenlernen's Microsoft Bookings calendar switched to click-to-load (a button, not
  an automatic iframe) — implemented in `kennenlernen.astro`. This reopens
  FIXES-2026-09-07.md task 5e's "embed directly" call, which fuer-marina.md's own
  13c had already recommended reversing; removes the need for a cookie banner
  site-wide, which launching tomorrow made worth actually doing rather than continuing
  to defer.
- Matomo: deferred to post-launch per the owner (Marina wants it specifically, as a
  more ethical alternative to Google Analytics — not a generic pick). The
  Datenschutzerklärung's Matomo section is marked "planned, not yet active" rather
  than deleted, so it doesn't need rewriting again once it's actually installed.
- The Kommentare section is being **kept** in the Datenschutzerklärung despite
  describing a feature that doesn't exist yet, per an explicit instruction from the
  owner this session. **Flagged, not silently followed:** this sits in real tension
  with the exact principle Marina herself raised in fuer-marina.md #12 — "a policy
  describing processing that isn't happening is as wrong as one hiding processing
  that is." Marked "planned, not yet active" (same treatment as Matomo) as the closest
  available compromise, but the underlying tension is on the record here rather than
  quietly resolved.

**Datenschutzerklärung rewritten** (`src/pages/datenschutz.astro`, Stand bumped to
13.09.2026): added a new Hosting section (easyname GmbH, Canettistraße 5/10, 1100
Wien — verified against WKO/Firmenbuch, not guessed); corrected Kontakt mit uns to
drop the phone field (no longer collected) and describe the actual mechanism (direct
email forward, no database); corrected Cookies to state plainly that the site sets
none of its own (the previous text described login/language/consent cookies that
don't apply to this static build — the same class of inaccuracy as Matomo/Kommentare,
found while fixing those, not part of the original ask); updated Terminplanung to
describe the click-to-load mechanism. **Not Marina's sign-off** — corrected against
verifiable facts (the actual code, easyname's real registered address) and flagged
here for her own final read, same standard as everything else marked "planned, not
yet active."

**Redirects (`public/.htaccess`) verified and expanded against the live site's actual
sitemap.xml/post-sitemap.xml/page-sitemap.xml/category-sitemap.xml/author-sitemap.xml**
rather than trusting START-CHECKLISTE.md Teil 3's list as final (it was already marked
"unvollständig"). Found and fixed: the live blog slug is actually
`ist-unfruchtbarkeit-immer-noch-frauensache-2` (WordPress added "-2" at some point) —
the existing list had it without the suffix, which would have redirected the wrong
URL and left the real one to 404. Also found `/nl-danke/` (a newsletter confirmation
page with no new-site equivalent, sent home) and confirmed category/author archive
pages exist (sent to `/blog/`), neither previously on record. Added a www->apex
redirect, since the live sitemap lists everything under `www.` but the new site is
configured for the apex domain. **Known, accepted gap:** WordPress media URLs
(`/wp-content/uploads/...`) have no redirect and will 404 — fixing this needs the
WordPress media export/backup (Teil 2 point 1), out of scope tonight.

**`astro.config.mjs`'s placeholder domain resolved** to `https://persephone.at` (this
was never an undecided domain — only where it should point was undecided, and that's
now settled). `public/robots.txt` had the same placeholder hardcoded separately
(doesn't derive from `site`) and needed the same fix independently.

**`docs/DATENSCHUTZBEAUFTRAGTER-BRIEFING.md` reworked** to match everything above —
this was the last stale artifact of tonight's changes: it still described Microsoft
Forms as the contact-form plan, the Bookings calendar as auto-loading with no fix in
sight, and hosting as undecided. Updated section by section against tonight's actual
work, and the Kommentare tension from above is carried into it explicitly as the
top-priority question for the reviewer, not smoothed over. First deploy to
`neu.persephone.at` succeeded during this same session (Actions run #2, commit
`77ccc6e`, ~1m19s) after fixing an unrelated YAML syntax error in `deploy.yml` (an
unquoted colon inside the workflow's `name:` field, caught by GitHub's own parser
before secrets even mattered).

**Final review pass, after the first successful deploy:** found and fixed a real bug
in `kontakt-senden.php` — PHP's `mail()` was called without its 5th parameter (the
envelope-sender override), meaning the technical sender would likely default to
something like `www-data@<servername>` rather than an `@persephone.at` address. Given
persephone.at's DMARC record uses `aspf=s` (strict SPF alignment, confirmed in its DNS
zone), a mismatched envelope sender could fail DMARC alignment and land in spam even
with the SPF fix already in place. Fixed by passing `-fno-reply@persephone.at` as the
5th parameter. **Not yet verified by an actual test send** — that still needs someone
to submit the real form and check the inbox, which is on `docs/LAUNCH-TAG-RUNBOOK.md`.

Also wrote `docs/LAUNCH-TAG-RUNBOOK.md`, consolidating `START-CHECKLISTE.md` Teil 2
with everything decided/found tonight into one ordered, attended-by-a-human checklist
for the actual cutover day, rather than leaving it spread across three documents.

**CMS editor prepared** (everything code-side, none of it deployed yet — that needs
credentials only the owner has): `public/admin/config.yml` switched from
`git-gateway`/Netlify Identity (never viable once hosting was easyname, not Netlify)
to `backend: name: github` with a `base_url` placeholder pointing at a broker that
doesn't exist yet. All six previously-missing `site` schema sections
(`nav`/`painPoints`/`philosophy`/`founder`/`newsletter`/`footer`/`common`) added,
matching `src/content.config.ts` field-for-field — previously only `meta`/`hero`/
`services` existed as a pattern example. Also fixed a real mismatch found while doing
this: the blog collection's `category` field was still a single `string` widget, but
`content.config.ts` widened it to `z.array(z.string())` back on FIXES-2026-09-07.md
task 3 — the CMS config was never updated to match, meaning editing a post's category
through the CMS would have saved the wrong shape.

Wrote the actual OAuth broker (`cms-oauth-worker/worker.js` + `wrangler.toml` +
`README.md`) — a small Cloudflare Worker implementing the two routes Decap's GitHub
backend expects (`/auth`, `/callback`) and the documented postMessage handshake back
to the CMS popup. This is real, untested code — it follows Decap's documented
contract but has never actually been deployed or exercised against a real GitHub
OAuth App. The three remaining steps (Cloudflare account, GitHub OAuth App, `wrangler
deploy` + pasting the resulting URL into `config.yml`) all need the owner's own
accounts and are written out in `cms-oauth-worker/README.md`.

**Still open, deliberately not done tonight:**
- The actual DNS cutover (A/CNAME) and the WordPress backup that must precede it
  (START-CHECKLISTE.md Teil 2, points 1 and 8) — both need the owner's attention while
  awake, not an unattended overnight action, given the shared-account risk just found.
- GitHub repo secrets (`FTP_SERVER`/`FTP_USERNAME`/`FTP_PASSWORD`) — not added by this
  session; the deploy workflow has not yet actually run.
- Recommended, not yet done: password-protect `neu.persephone.at` via easyname's
  Passwortschutz feature while it's used as a staging target, so a search engine
  doesn't index a half-finished copy of the site before the real cutover (the German
  pages currently carry no `noindex` at all, unlike `/en/`/`/it/`).
- The CMS backend (`backend: github` + OAuth app + broker function) — unrelated to
  launch readiness; Marina's editor access was never on tomorrow's critical path.

---

# Kontakt form implemented — 2026-09-13

Built against the easyname decision below: `public/kontakt-senden.php`, a small
in-house PHP script, replaces both previously-considered options (Microsoft Forms
— discovered mid-session not to actually accept POSTs from an external `<form>`,
only reachable via its own hosted page or an iframe embed; and web3forms — an
already-made choice from a prior, undocumented session, reopened and dropped once
found to process submissions on AWS US-East, a third-country transfer for content
already flagged as likely Art.-9-adjacent in `docs/DATENSCHUTZBEAUFTRAGTER-BRIEFING.md`
§4.2). The script sends straight to marinabletsas@persephone.at with the visitor's
address as `Reply-To`, stores nothing, and needs no new Datenschutzerklärung entry —
it runs on the same host and sends within the domain's own mail reputation.

`ContactForm.astro`'s `action` now points at it; a new `/kontakt-danke/` page (a flat
sibling route, not `/kontakt/danke/`, to avoid restructuring `kontakt.astro` into a
folder for one subpage) is the success redirect target, added to `build-check.mjs`'s
"never linked from nav" allowlist alongside `/404/` and `/admin/` for the same reason.
A failed/bypassed submission (native HTML5 `required`/`type="email"` should prevent
this for real users) redirects to `/kontakt/?fehler=1` with no visible error banner —
deliberately left minimal since that path is effectively unreachable except by
deliberately bypassing the browser, not a normal-user scenario worth building UI for.

**Depends on a DNS change made by the owner, same session:** persephone.at's SPF
record needed `include:spf.easyname.com` merged in (confirmed against easyname's own
support docs) alongside the existing Microsoft/MailerLite includes, so mail sent by
this script from easyname isn't flagged as spoofed by the receiving (Microsoft 365)
side. Applied and saved by the owner during this session; not independently
re-verified by a test send as of this entry.

**Also added:** `.github/workflows/deploy.yml` — builds the site and uploads `dist/`
to easyname via FTPS on every push to `master`, so that a Decap CMS edit (once the
CMS backend itself is wired, still open, see below) actually reaches the live site
instead of sitting committed but undeployed. Needs three repo secrets
(`FTP_SERVER`/`FTP_USERNAME`/`FTP_PASSWORD`) added in GitHub before it will run;
not yet exercised end-to-end against the real easyname account.

**Still open, unaffected by this work:**
- The CMS backend (`backend: github` + OAuth app + broker function) — Marina still
  can't log into the editor until this exists.
- `astro.config.mjs`'s placeholder domain — deliberately left alone this session;
  the real value is `https://persephone.at`, ready to set once the owner confirms
  it's time (see that file's own TODO).
- Everything else already listed as open in `START-CHECKLISTE.md` and `OPEN-QUESTIONS.md`.

---

# Hosting decision — superseded same day, 2026-09-13

**Superseded below, same day, by a purchase already made:** the owner's household had
already bought easyname shared webhosting (small tier, prepaid through May 2028) and
moved the persephone.at domain there before this analysis happened. Real, sunk,
prepaid cost beats a same-shape recommendation that hadn't been spent yet — **the
actual decision is easyname**, not Hetzner. The reasoning below stays in the record
because it's what confirmed easyname was a fine choice and not something to reverse:
easyname is Vienna-based (Austria) and processes entirely in the EU, so every point
made below about Hetzner's EU-only processing avoiding a third-country
Datenschutzerklärung clause applies equally (arguably better — Austrian, not just EU,
for an Austrian business) to easyname. It's shared/managed webhosting (FTP/SFTP,
presumably no root/SSH on the small tier — not yet confirmed), so the "nothing to
maintain" reasoning against a raw VPS also holds. The GitHub-OAuth broker function for
the CMS still needs somewhere else to run (a Cloudflare Worker, still unresolved) —
that conclusion doesn't change with the provider.

**Action item this purchase created, now resolved:** the domain moved to easyname
*before* the DNS-record inventory step in `START-CHECKLISTE.md` Teil 2 point 2
happened, and apparently before this was flagged as a risk. Confirmed 2026-09-13 by
round-trip test email to/from marinabletsas@persephone.at: Microsoft 365 mail
(`MX`/`SPF`/`DKIM`/`autodiscover`) survived the move and works. No outstanding risk
here — noted for the record since it could easily have gone the other way.

---

# Original analysis, now superseded — Hetzner Webhosting S over Cloudflare/Netlify/VPS

Reasoning, weighed in this order (kept for the record; see superseding note above —
easyname was substituted for Hetzner in every place this reasoning mentions Hetzner):

- **Netlify (option A in `START-CHECKLISTE.md`)** ruled out first: the CMS config
  already written (`git-gateway`) depends on Netlify Identity, which was discontinued
  for new projects — the option's main advantage doesn't reliably exist anymore.
- **Cloudflare Pages** was the leading alternative — free, and the natural home for the
  CMS's GitHub-OAuth broker function either way — but was ruled out on a GDPR ground
  found while reviewing `docs/DATENSCHUTZBEAUFTRAGTER-BRIEFING.md` §3.8: Hetzner is a
  German company processing entirely in the EU, so the Datenschutzerklärung's hosting
  line needs no third-country/processor disclosure at all. Cloudflare is a US company;
  using it would add a second third-country disclosure (Microsoft Bookings already
  needs one, per the same briefing) to a site that handles Art.-9-adjacent data. Not
  disqualifying on its own, but avoidable for a cost difference of about €2/month.
- **Staying with the current WordPress host (option B)** was rejected as deferring the
  decision rather than making it, and it means continuing to pay for a WordPress plan
  the new static site doesn't need.
- **A raw Hetzner Cloud VPS** (~€3/mo cheapest tier) was considered and rejected:
  unmanaged, meaning the project would take on OS security updates, web server setup,
  and TLS renewal indefinitely — directly against the "fast nichts zu pflegen"
  (practically nothing to maintain) selling point already on record in
  `docs/fuer-marina.md`'s comparison table.
- **Hetzner Webhosting S** (€1.60/mo excl. VAT, confirmed live 2026-09-13; ~€1.90–1.92
  with VAT) wins on all three axes: EU-only processing, no server to maintain (managed,
  Apache-based, static files served from `/public_html`), and the cheapest option in
  practice once the VPS's hidden maintenance cost is counted. Confirmed to support pure
  static sites with no PHP requirement. Its 10GB storage, unlimited mailboxes, and PHP
  process/memory limits are all far beyond what a static Astro build needs — email
  stays on Microsoft 365 exactly as it is; nothing moves to Hetzner's mailboxes.

**Consequences still open, not yet decided:**
- Deployment is SFTP/FTPS only on the S tier (no SSH, no git push) — a CI step (e.g. a
  GitHub Action building the Astro site and SFTPing `dist/` to `/public_html`) will be
  needed in place of Cloudflare/Netlify-style push-to-deploy.
- The CMS's GitHub-OAuth broker function still needs somewhere to run, since S-tier
  Webhosting has no SSH/custom backend support — a Cloudflare Worker (free) is the
  likely answer, still to be set up.
- `astro.config.mjs`'s placeholder-domain `// TODO` stays open until the actual
  domain/hosting is provisioned — a provisioning step, not a decision.
- Domain registrar/DNS management is unaffected by this choice and stays wherever it
  is now; only the site's `A`/`CNAME` record changes at cutover (see
  `START-CHECKLISTE.md` Teil 2, point 8, on leaving `MX`/`SPF`/`DKIM`/`autodiscover`
  untouched).

---

# Lauf — 2026-09-10 (`docs/LAUF-2026-09-10.md`, complete)

Marina's 34-point feedback list (`docs/feedback-2026-09-10/`) plus a new Kontaktseite
built from her own Claude Design prototype (`docs/mockups/kontakt-prototype.dc.html`).
Four commits, one per Teil (A/B/C, D folded into C's commit plus this record).

**Teil A — site-wide.** A1: Fließtext columns to ~1200px — the fix was almost always
removing/raising a narrower class (`.section-narrow`, blog's own `42rem`, homepage's
`.narrow`) rather than touching `.container`, whose own ~1168px already matches;
Punkt 3's "two columns end at the same height" done via CSS `align-items:stretch` +
a `justify-content:space-between` paragraph wrapper, not a re-measured pixel constant
(self-adjusts if the copy length ever changes, unlike the previous run's fix for the
same complaint). A2: hero title→text gap to 25px (was 55px). A3: `.button-primary`
gradient restored — Marina asked for it explicitly; a fresh live measurement
confirmed it's genuinely there, reversing `RUN-2026-09-07-B1.md` Phase 1.3's
"solid fill" call, which was based on an earlier, apparently mistaken read. A4:
homepage sections actually alternate dunkel/hell now (previously two dunkel
sections could sit back-to-back). A5: footer background fixed to `--color-bg-alt`,
its untokenized `#e9dccd` literal deleted from the project; footer links get a new
proposed token `--color-teal-darker` (green, pending Marina's sign-off — contrast
math in the token's own `global.css` comment). A6: wavy footer divider replaced with
a hairline (Avada original stays off-limits). A7: "e-Brief" lowercased everywhere,
including a `.eyebrow` uppercase-transform trap in the footer that would have
silently produced "E-BRIEF". A8: FAQ answers were rendering literal `*asterisks*`
instead of italics — `faqs.astro` was interpolating `{item.answer}` directly instead
of through `mdInlineHtml()`, the same bug every other markdown-sourced page had
already been fixed against. A9: heroes gained direction-aware reveal animations
(`.reveal-left`/`.reveal-right`, new modifiers on the existing `.reveal` mechanism —
matches the live site's own Avada `fadeInLeft`/`fadeInRight`), same no-JS/reduced-
motion safety contract as before.

**Teil B — page by page.** B1: the header's "Trennpunkt zwischen Angebote und Blog"
was the dropdown's "▾" text glyph rendering as a barely-visible dot at this size in
DM Sans — replaced with an inline SVG chevron (screenshot-verified against the
running dev server; a first attempt just repositioning the old glyph didn't fix it,
because the glyph itself was the problem). B2: newsletter fragment sentence
removed. B3: Disclaimer's title forced to one line, hyperlinks get a sage-green
highlight behind them (not recolored text — the only WCAG-passing option of the
ones measured). B4: FAQs got real clickable category tabs — the tablist itself needs its
enhancement script (ARIA roles, keyboard nav, show/hide), so it ships `hidden`
until JS confirms it's running; verified with Playwright, JavaScript fully
disabled, that all 13 questions across all three categories stay reachable exactly
as before (the plain stacked-sections fallback), and separately that the *other*
tab-like mechanism this run built (Angebote's B8 selector, pure CSS `:has()`) needs
no JavaScript at all for its interaction to work. B5/B6: already correct, no change needed. B7: Über uns's
hero title forced onto Marina's requested two lines (needed both a forced `<br>` and
widening the hero-copy column — the shared 500px column was too narrow for line one
alone); qualification bands switched to sage/dark-text (lighter *and* higher-
contrast, not a straight swap — the literal ask didn't work as stated, described in
the code); band-overlap transparency fixed by moving the crossfade's opacity from
the whole band onto just the image, so text is never see-through. B8: Angebote's
selector now starts with no statement selected and full-width statements (`checked`
default removed); clicking one aligns the response card to it via a small
enhancement script (no more scroll-following `position:sticky`); the whole mechanism
still works with JavaScript off, confirmed with Playwright (native radio inputs +
`:has()`); new colored "button-Kästchen" teasers reusing the existing
recognition-panel offer data; intro paragraph before the H2 removed; Angebote's
photo/logo now overlap (`layout="pair"` removed, reversing a prior session's
"confirmed non-overlap" finding for this specific page — Marina's fresh screenshot
disagreed). B9: Angebote-dropdown entries recolored to teal (live-plausible, not
directly measurable — flagged). B10: Beratung's Dauer/Ort badges moved above their
lists; Beratung/Workshops' photo+logo switched *to* `layout="pair"` (opposite
direction from Angebote — each page needed the correction the other one didn't).
B11: Workshops' two cards stack now; the Ressourcen icon was redrawn a *second*
time — the first redraw (2026-09-08) was a vertical tube that Marina again couldn't
identify, so this one uses a horizontal-roll convention instead (rendered and
visually checked via `sharp`-rasterized SVG before committing to the final path).
B12: Selbsthilfegruppe's duplicate heading removed, Aktuelles sits in a
`--color-bg-alt` box, its data no longer bold, more space before the principles
heading. B13: blog articles now use the shared split-hero component (with a new
subtitle, reusing the post's existing `description` field) instead of a plain
banner + separately-stacked image.

**Teil C — Kontaktseite neu.** Rebuilt from scratch against Version A of
`docs/mockups/kontakt-prototype.dc.html`, not incrementally patched — the old page's
content-collection extraction (`kontakt.md`'s body) no longer matches the new shape
at all; only its `title`/`description` are still read. `ContactForm.astro`'s fields
changed to match the prototype (dropped phone, changed Anliegen to the prototype's
three options). New `mail` icon added to `Icon.astro`. The "Schreib mir" disclosure
is a native `<details>`, not a scripted toggle — works with zero JavaScript by
construction, verified with Playwright. Three things the brief explicitly said not
to decide are marked in the code and listed in `OPEN-QUESTIONS.md` #25–27: the
form's real submission endpoint, the three-vs-four Anliegen-option conflict, and
overlay-vs-link for "Termin buchen".

**Teil D — closing.** `npm run build` (which runs `build-check.mjs`) is clean.
Visual/interaction verification used Playwright (`npm install --no-save`, already
present from an earlier session — see `HANDOFF.md`'s Session note) at 1440px and
390px, JavaScript on and off, on the pages this run changed most: Über uns, Angebote,
Kontakt, FAQs. An initial attempt at the same checks via a raw `msedge.exe
--headless --screenshot` CLI invocation produced what looked like a real 390px
horizontal-overflow bug on every hero (`.hero-copy`'s text overflowing past the
viewport) — extensively chased with several CSS fixes before isolating it to the
screenshot tool itself: reproduced with plain system fonts and zero site CSS at
narrow `--window-size` values on this machine, absent at the same widths under
Playwright. The two defensive CSS changes made while chasing it
(`grid-template-columns: minmax(0, 1fr)` instead of bare `1fr` on `.hero-grid`;
`.hero-copy`'s `align-items: stretch` instead of `flex-start`, with the CTA button
opted back out via `align-self`) were kept — both are correct practice on their own
terms even though they weren't fixing a bug that turned out not to exist — but their
`global.css` comments were corrected afterward to not overstate that dead end as a
confirmed sitewide defect. Lesson for next time, recorded in `HANDOFF.md`: reach for
Playwright first, not a bare headless-browser CLI invocation, for exactly this kind
of narrow-viewport check.

**Two live corrections, mid-review, after the report above was first written:**
(1) Kontakt's two cards weren't equal height, and clicking "Schreib mir" grew only
that one card instead of unfolding the form below the whole row — the message panel
had been nested inside the `<details>`, so only its own card's box grew. Fixed by
moving the panel to a sibling of `.kontakt-cards` and revealing it via
`.kontakt-cards:has(.kontakt-card-write[open]) + .kontakt-message-panel` (same
`:has()` technique as Angebote's B8, still zero JavaScript — reconfirmed with
Playwright, JS disabled) with `align-items: stretch` making both cards match height
regardless of open state. (2) Disclaimer's B3 hyperlinks — the LAUF doc's own
literal reading of "unterlegen" (a background chip, the only option that cleared
4.5:1 contrast) wasn't what was wanted; corrected to plain `--color-accent` text,
underlined, no background, per a screenshot given directly in this session. Contrast
is 3.27:1, under the 4.5:1 body-text threshold — a known trade-off of this explicit
direction, not an oversight.

**Two more, same session, same pattern (live screenshot > written brief when they
conflict):** (3) `.button-primary` — A3 had it as a gradient again; pixel-sampling
actual screenshots of the button at rest and on hover (not eyeballing) showed both
states are flat solid fills with zero variation, so the gradient came back out —
rest `--color-accent-strong` (#b33a3b), hover a new token `--color-terracotta-hover`
(#863232, measured, not a formulaic darken of an existing token). (4) Kontakt's
hero — screenshot-compared against every other page's hero, its prototype-inherited
1fr/1fr column split and #D83830 title color were both dropped in favor of the
shared `.hero-grid`'s 45%/55% and `.hero-headline`'s `--color-accent-strong`, so the
page no longer carries its own hero deviation at all. Caught in passing: the h1 had
been missing the `.hero-headline` class entirely (only the now-removed
`.kontakt-title` override), so it was never getting the shared 25px title→text gap
either — fixed as part of the same edit. Also from this round: the message panel's
own 15rem/1fr desktop column split had been silently stuck at its 1fr mobile value
at every width, because the `:has()` visibility rule's higher specificity was
setting `grid-template-columns` too and always winning over the `min-width:900px`
rule meant to override it — split into a `display`-only rule so the column width is
owned in exactly one place again. And `ContactForm`'s submit button was stretching
to the form's full width — Grid's own default `justify-items: stretch`, not
anything about `.button`'s own sizing — `justify-self: start` opts it back out.

**Two more still, same session:** (5) The header dropdown's "Angebote" link and
caret used to switch to `--color-accent` (teal) while the submenu was open,
unlike every other nav item — a live screenshot asked for it to keep its resting
color, so that rule is gone; the caret still rotates open, just no longer
recolors. (6) Über uns's qualification bands (Ausbildung/Felderfahrung/Sprachen) —
B7 Punkt 17's fix (lighter `--color-sage` fill + dark text, chosen specifically to
clear 4.5:1 contrast) turned out not to match what was wanted: a live screenshot
showed a darker, richer fill with light text and a decorative wave-pattern +
rounded rust-orange accent shape in the corner, both colors pixel-measured
(`#309898` — already `--color-teal-dark`, no new token needed; `#c26d32`, new).
Contrast is back down to 2.96:1, a known regression versus B7 Punkt 17's own fix,
flagged in `OPEN-QUESTIONS.md` #31 rather than silently reversed without a note.
The bands themselves also moved from full-bleed strips to contained, rounded-
corner cards with a gap (a `.container` wrapper added inside each band), matching
the screenshot's proportions. The scroll-crossfade's opacity target moved back
from `.quals-image` alone (B7 Punkt 18's fix for the "text through the pomegranate"
complaint) to the whole `.quals-band`, because the newest instruction described a
clean atomic replace ("der zweite Teil ersetzt den ersten") rather than a partial
one — some brief mid-transition blending is an inherent property of any real
crossfade and couldn't be fully designed away without dropping the fade itself;
`OPEN-QUESTIONS.md` #33 asks for a real-browser look at the actual scroll feel,
which isn't something this session's tools could judge.

---

# Night run — 2026-09-06/07 (Phases 1-6, complete)

Executed `docs/NIGHT-RUN.md` unattended, per `docs/external-review.md` (authority for
the run) and `docs/fuer-marina.md` (owner decisions). Full commit-by-commit detail is
in `git log`; this is the condensed record.

**Phase 1 — Stop the bleeding.** Added `scripts/build-check.mjs` (wired into
`npm run build`), eight checks over the built site, one (source headings must appear
in their built page) blocking. Root-caused the silent-content-loss bug: added
`BlockTracker` to `src/lib/parseMarkdownBlocks.ts` so every block a page reads is
either rendered or explicitly excluded with a reason, checked at build time
(`.assertAllHandled()`). Retrofitted every page using it. Restored content lost to
the old positional-selection bug: Beratung's "Was ist Beratung?"/"Formate" headings,
Workshops' "Was ist Psychoedukation?" heading, Kontakt's "Erreichbarkeit"/"Standorte"
headings, and Angebote's ten self-recognition statements (re-extracted from the live
site's raw HTML).

**Phase 2 — Separated the archive from the live copy.** `docs/source-archive/` froze
a verbatim, one-time record of the original extraction; `src/content/` became the
site's real, correctable copy. `CLAUDE.md` updated accordingly.

**Phase 3 — Applied all ten of the owner's decisions** from `fuer-marina.md`: six
typos corrected; heading weight set to 400; Selbsthilfegruppe's intro kept variant A
only; the English demo heading stayed removed; the blog's "hier" link now points at
`/selbsthilfegruppe/`; Impressum got a clean meta description; `/newsletter/` now
redirects to MailerLite (the invented page and its component deleted); the
homepage-meta-description fallback bug (11 pages inheriting one description) is gone;
the two absolute `persephone.at` links are now relative; `astro.config.mjs`'s
placeholder domain got a prominent TODO, logged as blocked on the hosting decision.

**Phase 4 — Structural fixes.** "Angebote" in the header nav is now a real link
(previously `<details>/<summary>` could only disclose, never navigate) with a
separate toggle for its submenu. Über uns's two closing teasers now use the real
design: a black-and-white (CSS-filter) placeholder photo, explicitly labelled so it
can't ship unnoticed, with a cream text card overlapping it, the two staggered
vertically. Termine got explanatory copy, a click-to-load booking embed (was an
always-on iframe — a cookie-banner-triggering issue per the review's 3c), a fallback
link, and cross-links with Kontakt. The language switcher now hides locale entries
for pages that aren't actually translated. **Found in the process:** the EN/IT
homepage's own nav links to 66 subpages that don't exist — logged, not fixed (a
bigger call than the switcher), with a new build-check (`internal-links-resolve`)
watching for it going forward.

**Phase 5 — Verified.** Disclaimer's text confirmed word-for-word against the live
page; Über uns's three "i.A.u.S." and Beratung's three "Ausbildung unter Supervision"
occurrences all confirmed present. One real, pre-existing, undocumented deviation
found: `PageHero`'s intro paragraph (768px) is narrower than `.section-narrow`
(896px) — logged, not changed (a design call). Mobile rendering remains unverified —
this environment's headless browser unreliably renders narrow viewports.

**Phase 6 — Left for review.** Full-page 1920px screenshots of every page in
`docs/screenshots/2026-09-07/`, with `-before.png` for the five most-changed pages
(taken from a clean worktree at the pre-run commit, not guessed at). Verified
`npm run dev` and `npm run build && npm run preview` both start cleanly on the
default port 4321.

---

# Handoff — structure-fix + remaining-pages session (COMPLETE)

## Done and committed this session

- **Task 0 (fix Über uns structure) — commit `5e3de9e`:** the previous session's
  Über uns build got the masthead and narrative section wrong — PageHero's plain
  banner instead of the live page's actual split-hero (text left, full-bleed
  portrait right, same pattern the homepage already uses), and a new two-column
  photo+text component for "Wer Dir hier begegnet" that isn't in the live design at
  all (that section is centered, no image). Fixed both, extracting
  `.hero`/`.hero-grid`/`.hero-copy`/`.hero-headline`/`.hero-image` out of
  `HomePage.astro`'s scoped style into `global.css` so both pages share the exact
  same component instead of two implementations of the same shape. Section
  backgrounds now match the live page's actual pattern (light masthead, beige
  narrative, light credentials, beige teasers, teal CTA — read directly from each
  row's `--awb-background-color` custom property, cross-referenced against Avada's
  own dynamic CSS file rather than guessed). Added a new "Reuse before you build"
  rule to `CLAUDE.md`/`AGENTS.md` per the brief.

  **Also found and fixed while doing this:** the masthead's real image is a CSS
  `background-image` (`MG_7803`), not an `<img>` tag — the original Task 2
  extractor only looks for `<img>` tags, so it never found this one. The image
  previously used as `heroImage` (`marina-von-persephone.jpg`) actually sits next
  to the closing CTA further down the live page instead. Corrected
  `ueber-uns.md`'s frontmatter to the real hero image; **the misplaced
  `marina-von-persephone.jpg` reference has not been relocated yet** — that's
  Task 2's (content fidelity audit) job, flagged there.

  Screenshot verification: the live page failed to render its JS-driven layout in
  headless Edge (text/images didn't paint, only the header) — the same known
  limitation this project's history already documented (see below and
  `DESIGN-SYSTEM.md`'s H1-weight entry). Verified structure/colors from the raw
  HTML + Avada's dynamic CSS instead, which doesn't depend on JS executing.
  Local build screenshotted at 1920px and sent to the user. Verified with
  `npm run build` (23 pages, no errors) and `npx astro check` (0 errors).

- **Task 1 (adversarial design-system review) — commit `430f41a`:** fresh-context
  subagent reviewed `ueber-uns.astro` against `DESIGN-SYSTEM.md`/`global.css`/
  `HomePage.astro`; both real findings fixed. `@media (min-width: 800px)` (the
  only 800px breakpoint anywhere in the codebase — everything else uses 900px for
  the same single→multi-column transition) changed to 900px.
  `.teaser-grid`/`.teaser-card` (a generic linked-card pattern) moved out of
  `ueber-uns.astro`'s scoped style into `global.css` — same trapped-scope shape as
  the historical `.section` bug. `.credentials-grid`/`.credentials-badge` judged
  lower-risk (page-specific content shape) and left where they were — logged, not
  acted on; revisit if a future page needs the same layout.

- **Task 2 (content fidelity audit) — commit `bd01275`:** re-verified all 16
  checkable content-collection pages character-by-character against a fresh
  render from each page's original extraction JSON (never eyeballed, never
  word-counted). Found and fixed 2 real mismatches: a lost non-breaking space in
  `beratung.md` (root cause not fully pinned down — a from-scratch repro of the
  same regeneration step did *not* reproduce it, so treat this as "verify again
  after any future bulk regeneration," not a one-time fix), and a misplaced image
  in `ueber-uns.md` (dropped instead of relocated when Task 0 corrected the
  masthead) plus a Unicode-normalization (NFC vs NFD) mismatch on that same
  image's alt text. `docs/content-audit.md` has the full table: heading
  count/hierarchy, image existence, alt-text status, meta title/description
  presence, and every internal persephone.at link found with its status.
  **Important carry-forward for Task 3:** content-collection files correctly keep
  absolute `persephone.at` URLs (a few real, working ones — `/termine/`,
  `/kontakt/`, `/ueber-uns/` — turned up in Angebote/Beratung/Disclaimer, not just
  the already-known dead ones) — every page built from here needs those rewritten
  to local routes at build time, same pattern Task 0 established for Über uns's
  two dead links.

## Task 3 (build remaining pages) — in progress, one commit per page

- **Angebote — commit `c1723f4`:** built from `pages/de/angebote.md`. Plain PageHero
  (confirmed via raw HTML: this page's masthead has no background-image, unlike
  Über uns) + one centered `.section-centered`/`.section-narrow` body. Fixed the
  same class of content-collection error Task 0 found on Über uns: `mg-7425.jpg`
  was wrongly set as `heroImage` — it's actually a small inline photo near the
  closing CTA. Corrected. CTA href rewritten from the verbatim
  `https://www.persephone.at/termine/` to the local `/termine/` route.
  **Process note:** while fixing Angebote's image, also fixed the *same* wrong-
  heroImage mistake found on `beratung.md`, `workshops.md`, and `kontakt.md`
  (all three had `marina-von-persephone.jpg`/`mg-7811.png` wrongly set as
  `heroImage` too — confirmed via the same raw-HTML check) and staged everything
  together, so those three fixes landed in this commit rather than each page's
  own. Their own upcoming page-build commits won't repeat that content fix — it's
  already done.

- **Beratung & Coaching — commit `5be643e`:** built from `pages/de/beratung.md`.
  Same PageHero-banner pattern. Found and fixed a real bug in
  `parseMarkdownBlocks.ts`'s `section()` helper: it stopped at the next heading
  of *any* level, so a section heading immediately followed by a deeper
  sub-heading (exactly "Gut zu wissen" h2 → four h4 FAQ questions, no paragraph
  between) returned nothing. Fixed to stop only at same-level-or-shallower —
  **verified this doesn't regress Über uns** (its three narrative headings still
  render). Also fixed a bug this exposed: FAQ questions are same-page anchor
  links (no matching `#id` in this static rebuild) — were rendering raw markdown
  link syntax; now render just the label via `parseLinkHeading`. CTA href
  rewritten to local `/termine/`. Not rendered: the "Formate" heading is an
  empty grouping label in the source (no body text) — skipped, logged not
  silently dropped.

- **Workshops & Einzeltrainings — commit `78865b9`:** built from
  `pages/de/workshops.md`. Same continuous-section pattern as Beratung. Closing
  heading appears twice back-to-back (h3 then h1, identical text, responsive
  duplicate) — `section()` would've hit the second as a false boundary, so this
  page locates the last matching heading by hand instead. Verbatim "Workhops"
  typo preserved (OQ#8). Two bare location-tag paragraphs ("WIEN, GRAZ, ONLINE"/
  "ONLINE") not rendered, no existing pattern fits — logged, not dropped
  silently.

- **Selbsthilfegruppe — commit `f9e55dc`:** built from
  `pages/de/selbsthilfegruppe.md`. Dropped the unremoved English demo heading
  (unambiguous); still rendering a placeholder choice between the two
  near-duplicate intro paragraphs pending your call (OQ#7, updated to reflect
  this). Second masthead-level heading mid-page rendered as plain h2, not a
  second `.heading-black`. Found a second `section()`-related bug (a caller
  mistake this time, not the helper): "Aktuelles" hierarchically contains its
  "Nächtes SHG-Treffen" sub-heading, so pulling "all paragraphs" out of it
  double-counted the closing paragraph after the sign-up button — bounded
  manually instead.

- **Kontakt — commit `efc066f`:** built from `pages/de/kontakt.md`. Live page's h1
  appears twice back-to-back (with/without trailing period, responsive
  duplicate) — first used for PageHero, duplicate skipped. Portrait photo (added
  inline during Task 2's audit) now actually rendered on the page. `ContactForm`
  unchanged — already correctly inert. Added OPEN-QUESTIONS.md #11 (form
  endpoint not decided) since it wasn't previously logged anywhere; caught and
  corrected a factual error while drafting it — mistakenly claimed this repo
  deploys via `wrangler.toml` (that's the *other* repo from earlier in this
  session, `gm-scheduler` — verified this repo has no deploy config at all before
  the entry was committed).

- **FAQs — commit `dca7e77`:** built from `pages/de/faqs.md`. Kept the existing
  native `<details>`/`<summary>` accordion (already a good pattern), fed it the
  real 13 verbatim Q&A pairs instead of paraphrased ones. Live page's own
  category-jump nav (3 links, all literally `href="#"`) skipped rather than
  reproduced as dead links. Dropped a one-off `52rem` `.section-narrow` override
  that didn't match the global `56rem` token. **Tooling note:** the long-running
  dev server (17+ hrs uptime) briefly 500'd this page after the edit — confirmed
  via its logs as dev-server module-cache staleness (static build was already
  correct), fixed by restarting it (`astro dev stop` then `astro dev
  --background`). Worth remembering if another page 500s unexpectedly later in
  this session.

- **Disclaimer — commit `07f477b`:** built from `pages/de/disclaimer.md`. Added a
  shared `toLocalRoute()`/`rewriteLocalLinks()` pair to `parseMarkdownBlocks.ts`
  (Angebote/Beratung each had their own inline regex for the same rewrite — not
  retrofitted, but every page from here uses the shared one). Both inline links
  rewritten to local routes.

- **Impressum — commit `9ac9eaf`:** content was already accurate but the page
  used a bare `<h1>` + one-off `.legal-page` class instead of
  PageHero/`.section`/`.section-narrow` — rewritten to use the design system,
  now actually rendering from `pages/de/impressum.md`. Kept the earlier
  session's tel: link format fix (source's own is non-functional, has spaces).
  Mangled auto-excerpt description (OQ#5) not shipped — falls back to the
  site-wide default.

- **Datenschutzerklärung — commit `d05ea99`:** per this task's explicit
  instruction, wording left untouched — only the wrapper markup changed
  (bare `<h1>`/`.legal-page` → `PageHero`/`.section`/`.section-narrow`),
  verified via `git diff` to be zero words changed. **Still does not render
  from the content collection** — `datenschutz.astro`'s existing fonts-section
  correction stays authoritative; `pages/de/datenschutzerklaerung.md` remains a
  verbatim (but not-shipped) record. OPEN-QUESTIONS.md #9 rewritten from
  "resolved" to **needs human sign-off** — the client's wife approves this
  page's wording, not this rebuild, and it needs a re-check at launch against
  whatever the site actually loads by then.

- **Termine — commit `a756810`:** the page's eyebrow/title/intro were all
  invented in an earlier session (the live page has zero narrative text — it's
  one Microsoft Bookings iframe, nothing else). Replaced with just the real
  page title, nothing invented. Iframe embed unchanged, already correct.

- **Blog — commit `887675f`:** blog index's `PageHero` copy was invented ("Texte
  über den Weg durch die Krise" has no source) — found the real text by reading
  the live page's raw HTML directly (its own heading is wrapped oddly, a `<p>`
  nested inside an `<h1>`), added `pages/de/blog.md` for it matching the usual
  convention. Post grid itself (`BlogTeaserCard`/`getCollection`) was already
  correctly content-driven, no change needed. **Important technical finding:**
  the render-time link-rewrite pattern every other page uses (patch a string,
  re-render) silently does nothing for blog posts — Astro's `render()` reads a
  pre-rendered HTML cache, not the live body. A `remarkPlugins` hook in
  `astro.config.mjs` would work but requires installing `@astrojs/markdown-remark`
  as a new dependency in this Astro version — blocked by the "no new
  dependencies" rule. Landed on editing the two affected posts' exact dead URLs
  directly in their content-collection files instead (only the URL, zero prose)
  — a deliberate, logged exception to "content collections stay verbatim." Both
  fixes verified in the built output.

## Task 4 (whole-site check) — commit `47f173f`

- **Production build:** `npm run build` — 23 pages, 0 errors, throughout.
- **Internal links + images, whole site:** a scratchpad crawler
  (`link-check.mjs`) walked every built HTML file, extracted every
  `<a href>`/`<img src>`, and checked internal ones against `dist/`. Result:
  **0 broken images, 0 broken internal links to the site's own content.**
  21 external links found (mailto/tel/real third-party URLs), all left
  alone — out of scope for a static-build correctness check.
- **Real bug found and fixed: unparsed bold/italic markdown on 4 blog
  posts.** WordPress-source `<strong>`/`<em>` tags with a leading or
  trailing space inside them converted to invalid CommonMark
  (`**text **`), which Astro's strict default compiler for the `blog`
  collection refuses to render as bold/italic — showing literal asterisks
  on the page instead. Found via screenshot review, confirmed site-wide via
  a grep of every built blog post's HTML for literal `*`/`**`. Fixed in
  `maenner-im-kinderwunsch-mythos-maennerohnmacht.md` (2 instances),
  `maenner-im-kinderwunsch-mythos-stille-staerke.md` (1),
  `texte-stimmen-lieder.md` (1), and `zwischen-lichterglanz-und-leere.md`
  (2) — pure whitespace relocation, no wording touched. Verified clean
  (zero literal asterisks) across all 6 built posts after the fix.
  Full technical writeup in `docs/content-audit.md`'s Task 4 addendum.
- **Real, pre-existing bug found (not fixed — logged as a decision):** the
  language switcher (`LanguageSwitcher.astro`) offers `/en/`/`/it/` links
  on every page regardless of whether that page has a real translation,
  so 105 of the site's links 404 (only the homepage has real EN/IT
  content). This predates this session's work. Logged as
  `OPEN-QUESTIONS.md` #12 with three options and a recommendation, since
  the right fix is a design decision (hide untranslated links vs. point
  them at the locale homepage vs. remove the switcher entries until more
  translations exist), not something to silently patch.
- **Screenshots at 1920px:** every page reviewed — homepage, Über uns,
  Angebote + all 3 sub-pages, Kontakt, FAQs, all 3 legal pages, Termine,
  Blog index, all 6 blog posts, 404, EN/IT homepages. No structural
  inconsistencies found beyond the bold-markdown bug above (already fixed).
- **Mobile rendering: still unverified.** As documented in this file's
  earlier Phase-2 entry, 390px headless-Edge screenshots are unreliable in
  this environment (content lays out as if the viewport were wider, then
  gets cropped — reproduced even on the already-shipped, unmodified
  homepage, so it's an environment limitation, not a site bug). This
  applies to every page built this session too, not just the ones already
  flagged. **A real device or a manually-resized real browser window is
  still needed before launch to confirm mobile rendering — this has not
  been done for any page in this repo.**

## Session summary

**Built:** the 12 remaining standalone pages plus all 6 blog posts (Angebote
and its 3 sub-pages, Kontakt, FAQs, all 3 legal pages, Termine, Blog index +
posts), each from its real content-collection entry, each screenshotted and
checked against the homepage/Über uns for container width, gutters, type
scale, section rhythm, backgrounds, and buttons before moving on. Über uns's
masthead/narrative structure was corrected first (Task 0) so the shared
hero pattern was right before 11 more pages could reuse it.

**Fixed:** two real bugs in the shared `parseMarkdownBlocks.ts` helper
(a heading-boundary bug and its downstream double-counting implication)
that would otherwise have silently broken content on multiple pages; 4
dead internal links (2 on Über uns, 2 in blog posts); several
wrongly-set `heroImage` frontmatter values (a mistake pattern caught once
and then swept across all affected files); a lost non-breaking space and a
Unicode NFC/NFD mismatch; an `800px` breakpoint that didn't match the
site's established `900px`; and, in Task 4, unparsed bold/italic markdown
on 4 blog posts.

**Fidelity audit found:** re-verifying all 16 checkable content-collection
pages character-by-character against a fresh mechanical render from source
found exactly 2 real mismatches (both fixed) — everything else was already
verbatim. Full table with heading/image/meta/link checks per page is in
`docs/content-audit.md`.

**Waiting on your decision** — see `OPEN-QUESTIONS.md` for the full list
with options and recommendations; the ones that block launch rather than
just being FYI:
- **#9 Datenschutzerklärung** needs your wife's sign-off on the wording,
  and a re-check at launch against whatever the site actually loads by
  then (legal document, not a code decision).
- **#11 Kontakt's form** has no submission backend yet — deliberately left
  inert rather than inventing one; needs a hosting/service decision.
- **#12 Language switcher** 404s on untranslated pages — needs a decision
  on how untranslated locales should behave.
- **#1 H1/H2 weight** (900 vs. 400) — carried over from the previous
  session, still unresolved pending a look at the brand book in person.
- **Mobile rendering is unverified sitewide** — needs a real device check
  before launch, this environment can't produce a trustworthy mobile
  screenshot.

---

# Handoff — Phase 2 re-parse + Über uns rebuild session (COMPLETE, stopped per brief)

Every task in this run (0–3) is done and committed. Per the brief, this session
stops here — Task 3 explicitly said not to build the remaining pages until Über uns
is approved. **Next step is yours: review Über uns, then say go for the rest.**

## Done and committed this session

- **Task 0 (clean tree):** already clean at session start — nothing to commit.
- **Task 1 (isolate the h1 weight decision) — commit `0236d22`:** the previous
  `HANDOFF.md`/`DESIGN-SYSTEM.md` claimed every masthead h1 already ran through the
  `.heading-black` utility. That claim was **false** — four pages (`404.astro`,
  `datenschutz.astro`, `impressum.astro`, `blog/[...slug].astro`) rendered a bare
  `<h1>` with no class. Fixed by adding `class="heading-black"` to each. **Now true:**
  every masthead h1 site-wide takes its weight from `--weight-heading`; flipping
  900 → 400 in `global.css` is genuinely a one-value change.
- **Task 2 (re-parse everything from persephone.at) — commits `8a9a567`, `7f30182`,
  `25b4c85`, `c9c5f62`, `b85a9ef`:** all 12 standalone pages and
  all 6 blog posts re-extracted from live HTML into `src/content/pages/de/` and
  `src/content/blog/de/`, replacing the old "poor" parse and the blog posts' literal
  placeholder stubs entirely. `docs/content-inventory.md` written (page, source URL,
  word/image counts, extraction issues). Method: raw HTML via `curl` → a small
  dependency-free Node HTML→block extractor (`html2md.mjs`, session scratchpad only,
  **not committed** — redo the `curl` + extractor pass if this needs revisiting) →
  real images downloaded, no hotlinking → markdown **mechanically generated** from
  the block JSON, never hand-typed, then byte-diffed against the repo file before
  committing. **One real mistake happened and is fully disclosed in the commit
  history and `docs/content-inventory.md`:** early on, three paragraphs of
  `beratung.md` got hand-paraphrased from a truncated terminal preview instead of
  transcribed verbatim. Caught during a verification pass before committing; fixed by
  switching to the mechanical-generation + byte-diff process for every page from
  then on, including re-doing the pages already affected.
- **Task 3 (build Über uns) — commit `67e056a`:** `src/pages/ueber-uns.astro`
  rewritten to render from `src/content/pages/de/ueber-uns.md` (a new
  `src/lib/parseMarkdownBlocks.ts` utility splits that one flowing markdown body
  into blocks so different sections feed different components — no content
  duplicated into separate typed fields). Composed entirely from existing
  components/tokens: `PageHero`, a new page-scoped bio-photo+narrative section, a
  3-column credentials grid (adds "Sprachen", the old version only had 2 columns),
  two closing teaser cards, and `CtaBand`. Applies Open Question #6's fix directly —
  the two teaser cards link to the real `/beratung/`/`/workshops/` pages, not the
  source's own dead links. Verified with `npm run build` + `npx astro check`
  (0 errors both). **Per the brief, stopped here — the remaining pages are not
  built.**

### Screenshot verification (Task 3) — 1920px clean, 390px unreliable, documented not faked

No browser-automation tool (Playwright/Puppeteer/etc.) exists in this environment or
as a dependency; system `msedge.exe` driven headless via CLI (`--headless
--window-size=W,H --screenshot=...`) filled in instead.

- **1920px:** worked cleanly. Screenshotted Über uns against the homepage —
  container width, gutters, type scale, section rhythm, and button styling all
  matched with **no deviations found** (both screenshots were sent to you in-chat).
- **390px: unreliable, not used as evidence.** Every screenshot at this width showed
  text clipped mid-word at the right edge — but the *identical* artifact appeared on
  the already-shipped, unmodified homepage and `/beratung/` page too, reproduced
  with a completely clean browser profile and both legacy and `--headless=new`
  modes. The output PNG is genuinely 390px wide, so the browser is laying out
  content as if the viewport were wider, then cropping — a headless-viewport-
  emulation limitation of driving Edge via bare CLI flags (no real device-metrics
  emulation available without a devtools-protocol library, which would be a new
  dependency), not a site bug. **Mobile responsiveness for the new page was instead
  verified by code parity**: identical `.container`/`.section` usage, identical
  grid-collapses-to-`1fr`-below-800px pattern as every other already-shipped
  subpage, no fixed-pixel widths introduced. This is a real, unresolved
  verification gap, not equivalent to an actual mobile screenshot — worth a look on
  a real device or a manually resized real browser window.

## Open — waiting on you

See `OPEN-QUESTIONS.md` for the full list (now 11 items) with options and
recommendations. Headlines:

1. H1/H2 weight, 900 vs 400 (carried over; 900 stays until compared against the
   brand book in person — a one-value revert either way).
2. The live "Newsletter" page/nav-link 301-redirects to an external MailerLite form
   — no real page content exists, so local `newsletter.astro`'s copy was invented in
   an earlier session. Recommend redirecting to match the live site.
3. Several live pages ship no meta description at all. Recommend shipping empty
   rather than inventing SEO copy.
4. The live site ships duplicate/conflicting meta description tags — on the
   homepage *and* on all 6 blog posts (a plugin/theme conflict). The rebuild uses
   only the real one in each case.
5. Impressum's live meta description is a mangled, space-less auto-excerpt.
6. **Four dead internal links found site-wide** (Über uns ×2, two blog posts ×1
   each) — likely stale slugs from page renames. Über uns's two are already fixed in
   the built page; the two in blog posts are recorded verbatim, not yet fixed
   anywhere (no page currently renders that body content).
7. Selbsthilfegruppe has an unremoved English Avada demo heading plus two
   near-duplicate German intro paragraphs.
8. Two verbatim typos preserved from the live site (Workshops h1, one
   Selbsthilfegruppe heading).
9. **Important:** the live Datenschutzerklärung describes Google Fonts/Typekit
   loading the new site doesn't do — the existing `datenschutz.astro` already fixed
   this correctly; don't let a future edit revert to the freshly re-parsed (but
   factually wrong for this site) text.
10. Über uns's two teaser cards use a plain style, not `ServiceCard` — reusing
    `ServiceCard` needs a button-label prop with no source text to draw from.
11. FYI only: a few Über-uns list items carry a leftover `font-claude-response-body`
    CSS class in the live HTML — harmless, a sign text was once pasted from a
    Claude.ai chat.

---

# Handoff — end of design-system gap-closing session

## Done and committed (this checkpoint)

- **`DESIGN-SYSTEM.md`** (new): full design system derived from the front page's actual
  code — colors, typography, spacing, buttons, component inventory, header/footer specs,
  interaction states, a spacing-scale audit, and a running log of every gap found and
  either fixed or flagged for a decision.
- **`CLAUDE.md`/`AGENTS.md`**: stack, commands, the tokens-only and German-verbatim rules,
  plus a warning about Astro's component-style scoping (see bug below).
- **Root-cause fix**: `.section`/`.section-alt`/`.section-centered`/`.section-narrow`/
  `.section-heading` used to live inside `HomePage.astro`'s own scoped `<style>` block,
  so they silently matched only elements in that one file. Every other page/component
  using bare `class="section"` — `CtaBand`, and nearly every subpage — got zero padding
  from it. Moved to `global.css` where a shared class actually works everywhere. Verified
  via stash/unstash A-B test (not a regression, pre-existing) and spot-checked on
  `ueber-uns.astro`.
- `CtaBand.astro`: copy measure `60ch` → `56rem` (matches `.section-narrow`, no new value
  invented); internal eyebrow→h2→copy→button rhythm now uses explicit `--space-6`/
  `--space-7` instead of bare default margins.
- `ServiceCard.astro`: `.card-button` radius now uses `var(--radius)`.
- `Footer.astro` / `global.css`: footer background tokenized as `--color-footer-bg`
  (flagged: this color is not one of the brand book's 8 official tones — confirm with
  client eventually, not blocking).
- `HomePage.astro` / `PageHero.astro` / `global.css`: `.heading-black` utility added
  (weight 900), applied to the one masthead `<h1>` per page (homepage hero + every
  subpage's `PageHero`); homepage hero's h1 also dropped its fixed `2.75rem` override and
  now shares the same size clamp as every subpage's h1.
- `global.css`: `.button-hero` added for the homepage hero CTA only (bigger, italic).
  `.button-primary` itself stays compact — an earlier attempt to promote the hero style to
  every primary button (including nav) was reverted after screenshots showed it broke the
  mobile nav menu (button overflowed the viewport) and looked wrong in the header.
- `global.css`: `--space-1`…`--space-9` spacing tokens defined. **Not yet adopted
  site-wide** — currently used only by `CtaBand`'s rhythm fix above. Everything else
  flagged as "ad hoc" in `DESIGN-SYSTEM.md`'s spacing audit is still ad hoc.

## Open — waiting on you

**H1/H2 weight, 900 vs 400 — the one real open decision.** `docs/brand/Brandbook.pdf`
(dated **August 2026** — newer than today's live site) specifies H1 *and* H2 at
weight 900/Black. The actual live persephone.at renders its h1 at weight **400**
(confirmed by tracing its own CSS custom-property chain to `--awb-typography1-font-weight:
400`; a pixel screenshot of the live hero wasn't obtainable — Avada's JS-driven heading
sizer never resolves under headless browser automation, tried six ways). You'd earlier
chosen "900 for the masthead h1 only, H2 stays 400," and that's what's implemented and
now committed — but you then asked to see it against the real live site before finalizing,
given that discrepancy. That comparison is what surfaced the 400-vs-900 conflict and the
brand book's August 2026 date, which raises the open question underneath this: is the
90-day-old brand book a not-yet-applied rebrand direction, or is the live site still the
correct target? That's a judgment call for you and your wife, not something in the code
to fix. Current state: 900 stays in the code until you say otherwise.

## Working tree

Clean after this commit — `git status` should show nothing pending. `DESIGN-SYSTEM.md`
and this file are new; everything else is a modification, all in one checkpoint commit.

## Next step

Once the H1/H2 weight question above is settled (keep 900, revert to 400, or something
else), **Phase 2 starts**: discard the existing subpage content in `src/pages/*.astro`
(`ueber-uns`, `angebote`, `beratung`, `workshops`, etc. — the "poor" parse from the earlier
session) and re-extract every page from persephone.at from scratch into content
collections, per the original brief. Nothing in Phase 2 has started yet.

---

# Resolved open questions (moved from OPEN-QUESTIONS.md, 2026-09-07)

## H1 masthead weight: 900 vs 400 — RESOLVED 2026-09-06

Decided in `fuer-marina.md` Q2: 400, matching the live site, over the August-2026
brand book's 900/Black spec. Implemented in `src/styles/global.css`'s
`--weight-heading` token, which every masthead `<h1>` site-wide reads from — still a
one-value edit back to 900 if this is ever revisited.

## The "Newsletter" page — RESOLVED 2026-09-06

Decided in `fuer-marina.md` Q8 (option a): `/newsletter/` redirects straight to the
MailerLite form via Astro's `redirects` config, matching the live site's own 301
exactly. The invented full page and its now-unused form component are deleted.

## Impressum's meta description — RESOLVED 2026-09-06

Decided in `fuer-marina.md` Q6: "Impressum und Offenlegung von Persephone – Marina
Bletsas, Wien." replaces the live site's mangled, space-less auto-excerpt.

## Four dead internal links across the live site (Über-uns + 2 blog posts) — RESOLVED

Über-uns's two teaser cards link to `/beratung/`/`/workshops/`; the two blog posts
link to `/blog/ist-unfruchtbarkeit-immer-noch-frauensache/` and, as of the 2026-09-06
run, `/selbsthilfegruppe/` (confirmed in `fuer-marina.md` Q7 — the sentence refers to
the self-help group's next meeting and registration link).

## Selbsthilfegruppe's English demo heading and doubled intro — RESOLVED 2026-09-06

Decided in `fuer-marina.md` Q3/Q4: the English Avada demo heading stays dropped; the
intro keeps variant A ("...die die Erfahrung der Kinderwunschkrise teilen") — chosen
because it comes first on the live page and names the topic concretely. Variant B is
removed from the content collection itself.

## Six verbatim typos — RESOLVED 2026-09-06

All six corrected per `fuer-marina.md` Q1: Workshops' "Workhops" h1, Über uns's
"linguistiche", Selbsthilfegruppe's "Einbzeltermine" and its "Nächtes SHG-Treffen"
heading, and FAQs' "Geleggenheit" and "(ehmals)".

## Über-uns's two closing teasers use a plain style, not ServiceCard — SUPERSEDED

This question proposed adding button copy so the two teasers could reuse
`ServiceCard`. `external-review.md` finding #4b confirmed the opposite: the live
design has no button — the heading itself is the link — and the owner confirmed
that's intentional (`fuer-marina.md` Q5). The real fix (the black-and-white photo +
offset cream text-card layout) landed in the 2026-09-06/07 night run, Phase 4.2.

## Language switcher offering /en/ and /it/ links that 404 — RESOLVED 2026-09-06

`BaseLayout`/`Header`/`LanguageSwitcher` now take an `availableLocales` prop
(default: just the current locale) filtering both the visible switcher's entries and
the hreflang `<link>` tags in `<head>`. Only the homepage passes all three locales;
every other page correctly advertises German-only now.

## Run 2026-09-07 (`docs/RUN-2026-09-07.md` / `docs/FIXES-2026-09-07.md`) — done and committed

Full order-of-operations and findings live in those two files; this is the record of
what shipped, for future reference. Every commit below passed a clean
`npm run build` first. Live-site claims were verified against raw HTML (`curl -A
"Mozilla/5.0 ..." <url>`), never a text/summary fetch — see RUN-2026-09-07.md's own
"HOW TO VERIFY" section for why that rule exists (three of the previous night's four
wrong conclusions came from exactly that shortcut).

- **Phase A** (`c947478`) — the Angebote nav dropdown was physically unreachable by
  mouse: an empty margin between trigger and menu broke `:hover` mid-transit, no
  close delay existed, and a CSS `:focus-within` fallback fought the JS-driven
  Escape-close. Fixed in `Header.astro`; also tightened the visual gap before "Blog"
  that the toggle button's touch target was creating. Verified with a real
  Chromium session: a stepped pointer path across the gap, full keyboard flow, and a
  touch-emulated 390px context.
- **Phase B** (`c9675a0`) — `Icon.astro` (shared inline-SVG set: book, document, pin,
  calendar, clock, shield, heart, group, check) and `Pill.astro` (shared sage
  badge), recorded in DESIGN-SYSTEM.md's new "Icon set"/"Badge/pill" sections.
- **Phase C** (`f4df68d`) — `ClosingCta.astro`, the site-wide two-column
  portrait-over-tile closing CTA, replacing four pages' worth of stray badges and
  ad-hoc centered layouts. Beratung and Über uns were confirmed (not assumed) to
  have the same live composition before applying it.
- **Phase D** — the four Angebote subpages, one commit each:
  - D1 `7acb408` (Beratung): re-extracted duration/location badges (new
    `formatBadges` schema field), eyebrow/centering fixes, beige no-border cards,
    teal circular check-mark list.
  - D2 `b68d8eb` (Workshops): eyebrow/centering, card treatment reusing Beratung's
    card shape, circular section icons, sage list markers, location pills.
  - D3 `3fbd105` (Angebote): the ten-statement self-recognition selector, rebuilt
    from real data — the live page's own inline script literal (all ten
    statement/response/offer triples, confirmed word-for-word against the owner's
    screenshot) turned out to be sitting in the raw HTML the whole time, not fetched
    client-side as an earlier session assumed. New `recognitionPanel` schema field;
    the interaction itself is radio+label+CSS `:has()`, zero JavaScript.
  - D4 `4abe81f` (Selbsthilfegruppe): three principle labels (new `principles`
    field), a real meeting-details card with teal icons in the live page's actual
    order, the downloaded Selbsthilfe-Steiermark partner logo/band, and a top-to-
    bottom re-check that found "Über die Gruppe"/"Grundprinzipien"/"Aktuelles" are
    one continuous background section on the live site, not three alternating
    bands as previously built.
- **Phase E** (`f3cf4c9`) — hero images. `PageHero.astro` now supports the same
  split-hero pattern the homepage/Über uns already used, with a default pomegranate
  image and a per-page override. Confirmed via raw HTML, not assumed: Angebote,
  Beratung, Workshops, Selbsthilfegruppe, Kontakt get the pomegranate; Blog gets its
  own downloaded photo (Marina at her desk); Termine, FAQs, Impressum, Datenschutz,
  Disclaimer confirmed to genuinely have none. The ochre/amber decorative shape at
  the hero's lower-left could not be found in any page's markup or the source
  illustration itself — logged in OPEN-QUESTIONS.md #0b rather than invented.
- **Phase F** — the rest:
  - Task 3 `308cb9d`: blog listing rebuilt as single-column rows (date badge,
    description, byline, `<time>`), `category` widened to a list on the schema
    (two posts needed a second category, two needed the existing one's name
    corrected — all re-confirmed against each post's own live page).
  - Task 4 `582ab34`: EN/IT get `noindex` + sitemap exclusion (a legal problem, not
    cosmetic — the English homepage was found to drop the training-status
    disclosure entirely) and an honest one-line nav pointing back to German,
    replacing a full set of dead links.
  - Task 5a `3529cc5`: fixed doubled canonical URLs on the locale homepages
    (`/en/en/` → `/en/`).
  - Tasks 5b/5c/6 `30c641d`: Über uns's teaser eyebrows became real headings; every
    image on the five flagged pages got either real alt text (Marina's portrait,
    reusing the founder photo's existing approved copy) or `aria-hidden="true"`
    directly on the `<img>`; `scripts/build-check.mjs` gained two new BLOCKING
    checks (alt-text, and a new "every schema field is rendered or allow-listed"
    check that caught blog's unused `updatedDate` field — closed by rendering it,
    not allow-listing it away).
  - Task 5e `af9fcdd`: Termine's calendar embeds directly again (owner's husband's
    decision, reverting the click-to-load version), with the consent-banner
    trade-off recorded in OPEN-QUESTIONS.md #0c rather than decided in code.

**Open questions this run added**, all in `OPEN-QUESTIONS.md`: #0 (Selbsthilfe
Steiermark logo permission), #0b (the ochre hero shape), #0c (Termine's consent-
banner trade-off), #7b (EN/IT need the owner's line-by-line read before publishing).

## Nachtlauf 2026-09-08 (`docs/NACHTLAUF-2026-09-08.md`) — done and committed, unattended

Run overnight per the brief's own rules: no questions, open items to `OPEN-QUESTIONS.md`,
build + commit per task, `HANDOFF.md` updated after each commit. Authority for every value
was `docs/FEEDBACK-2026-09-08.md` and `docs/VERGLEICH-2026-09-07.md`; four spots had
explicit gestalterische Freiheit (A4, A5, A6, B2.1). Mid-run, an addendum (Teil A0) was
added to the brief and handled first, before continuing Teil A.

- **A0** (`34b2e83`) — Phase 1b's `.hero-grid` `height`→`min-height` left the hero image
  free to inflate the band on a portrait photo (Über uns: 1176px instead of 520px, since a
  percentage height on the image doesn't count as "definite" during the grid's auto row-
  sizing pass). Fixed by taking `.hero-image img` out of flow entirely
  (`position: absolute; inset: 0`); the container gets its own `aspect-ratio` below 900px,
  explicitly unset back to `auto` at ≥900px — aspect-ratio turned out to have the exact same
  "counts as definite" problem, just uniformly instead of Über-uns-only, caught by
  re-measuring before committing.
- **A1** (`7444f73`) — two color fixes, each already centralized behind one token/class:
  `.icon-list-check .icon` background #309898→#48b0b0; `--color-text-muted`
  #32373c→#181a2b (a leaked WordPress gray, not a real second tone).
- **A2** (`dab71fb`) — `Icon.astro`'s `book`/`scroll` (renamed from `document`) glyphs
  redrawn for recognizability; every glyph's stroke thickened, the check/meeting-detail
  circle enlarged to match.
- **A3** (`dce80b6`) — Workshops' list markers became small sage `<Icon>`s (matching the
  section tile above), not plain dots — same `<Icon>`-per-`<li>` mechanism
  `.icon-list-check` already used.
- **A4** (`456ede2`, gestalterische Freiheit) — new shared `ImagePlaceholder.astro`: the
  fruit-icon signet muted to a monochrome watermark on a sage panel + "Foto folgt",
  replacing grey diagonal stripes.
- **A5** (`bc5597e`, gestalterische Freiheit) — footer wave redrawn as an irregular,
  tapering brushstroke path instead of a regular scallop wave.
- **A6** (`5d54040`) — shared `.reveal` scroll-fade mechanism: progressive enhancement,
  visible by default, JS-only and reduced-motion-aware.
- **B1** (`ee82d0b`) — homepage: 'abonieren'→'abonnieren' typo, founder CTA button color
  (was the secondary beige/teal style meant only for the service cards), blog-teaser's
  white card now overlaps its photo instead of sitting beside it, services lede downgraded
  from `<h2>` to `<p>`, blog category order fixed on two posts.
- **B2** — Über uns, the largest single page:
  - B2.1 (`395e7f7`): qualification block rebuilt from scratch (live's panel is an Avada
    asset) as three full-bleed alternating `#309898` bands + the granatapfel illustration,
    with A6's `.reveal` fade-in; removed a duplicate 90x90 badge.
  - B2.2 (`751642b`): closing teasers rebuilt from FEEDBACK #1's 1440px measurements as
    generative rules (420fr/680fr columns, per-photo aspect ratios, card = 75%/77% of
    photo width anchored via `bottom: -130px` so it overhangs by exactly that much
    regardless of the card's own text-driven height) rather than copied absolute pixels —
    checked by arithmetic that the measured "150px lower" second card position falls out
    of the other four rules instead of needing a fifth, independent one.
  - B2.3 (`939be74`): `ClosingCta.astro` gained opt-in `headingSize`/`portraitSize="large"`
    props for Über uns's own measured 48px heading / 336x390 portrait, defaulting to the
    28px/230x307 every other page already had right.
- **B3** (`97c1122`) — Angebote: `ClosingCta` gained `layout="pair"` (two equal same-size
  images side by side, live's actual composition there) instead of the usual overlap; the
  self-recognition selector's response card is now `position: sticky` (≥900px) while
  scrolling the statement list.
- **B4** (`fc33fdf`) — Beratung's "Gut zu wissen" became a collapsed `<details>` accordion
  (new shared `.accordion-item`/`.icon-circle-sm`/-`sage`/-`terracotta-dark` pieces in
  `global.css`, reused by B8) with a centered eyebrow instead of a dark h2; format cards
  are equal-height with their badges anchored to the bottom.
- **B5** (`534db28`) — Workshops cards: same equal-height/bottom-anchored-pill mechanism
  as B4 (icons were already fixed in Teil A).
- **B6** (`360edbb`) — Selbsthilfegruppe: added the missing 40px "Nächstes SHG-Treffen"
  heading above "AKTUELLES" (live has it twice — the small `<h3>` inside the meeting card
  was already there and stays); Steiermark logo to 368x177 right-aligned, companion text
  to 20px.
- **B7** (`0a22bc3`) — Kontakt: "Erreichbarkeit"/"Standorte" became icon eyebrows (reusing
  `.icon-circle`, clock/pin), submit button text "Senden".
- **B8** (`85e6cff`) — FAQs grouped into their three live categories. The question→category
  mapping isn't in this repo's markdown at all, so it was fetched from the live DOM
  (persephone.at/faqs/, rendered markup — each accordion post there carries a
  `fusion-faq-post-<id>` class plus a category class, keyed against this repo's own
  `#collapse-1-<id>` anchors) rather than guessed from question text, per this run's own
  rule after three prior wrong findings came from a text conversion instead. Accordion
  restyled with B4's shared pieces (red circle, 24px icon/heading, both live-measured).
- **B9** (`7c13739`) — blog articles: the missing author/newsletter block (text fetched
  from a live article page's own rendered DOM) and a "Verwandte Beiträge" section derived
  from shared categories (not copied from live's WordPress plugin picks, per the brief's
  own "aus den Kategorien abgeleitet"); in-article `##` subheadings render uppercase via
  `:global()` since they come from the markdown renderer, not this page's own template.
- **C1** (`8bcab82`) — nine meta descriptions added verbatim from `fuer-marina.md` Frage
  16, including two rough edges she flagged herself and hasn't answered yet
  ("psychodukativ", "(i.A.u.S)" without a period) — not silently corrected.
- **C2** (`f7f3858`) — `/termine/`→`/kennenlernen/`, name and url: Marina named it, the
  owner decided the path moves too. Every internal reference updated (nav CTA in all three
  locales, Kontakt's cross-link, Beratung's/Angebote's closing-CTA hrefs), verified by the
  blocking `internal-links-resolve` check. `docs/START-CHECKLISTE.md` Teil 3 got the
  additional launch-time redirect this needs.
- **Teil D** (`9694a4d`, `565850f`) — meta-description check flipped to BLOCKING now that
  all ten exist; `DESIGN-SYSTEM.md` brought back in sync (new components, tokens, sizes).

**Verification method throughout:** a local Playwright install (`npm install --no-save
playwright@1.63.0`, not in `package.json`/lock, reusing the chromium binary already cached
under `%LOCALAPPDATA%\ms-playwright`) took screenshots and measurements against the running
dev server for every visual change, and fetched the *rendered* live DOM (not a text/markdown
conversion) for the two places this run needed real live-site facts (FAQs' category mapping,
blog's author-block copy) — per the brief's own explicit warning that three prior wrong
findings in this project came from exactly that shortcut.

**Open questions this run resolved**, all in `OPEN-QUESTIONS.md`: #8/#24 (Termine's rename,
now done both ways). No new open questions were added — everything not explicitly covered by
FEEDBACK/VERGLEICH or gestalterische Freiheit either had a literal answer to follow or wasn't
touched.

## Nachtlauf 2026-09-09 (`docs/NACHTLAUF-2026-09-09.md`) — done and committed

Ten screenshot-driven feedback items from Claudio's own comparison (Original vs. Vorschau,
`docs/screenshots/2026-09-09-feedback/`, 16 phone/browser photos — not pixel measurements).
Per the brief's own Regel 1 (`docs/UEBERGABE-CHAT.md`): every "vermutlich Original/Rebuild"
guess in the brief was re-checked against rendered markup and computed styles before acting,
not taken on the screenshot's word alone — a local Playwright script (`playwright@1.63.0`,
already installed per the 2026-09-08 session note) drove both `persephone.at` and
`localhost:4321` at a 1440px viewport for this.

- **E1** (`22db34a`) — Über uns's three bio headings ("Wer Dir hier begegnet" / "Was aus
  meiner Kinderwunschkrise wuchs" / "Persephone als soziales Unternehmen") were plain `<h2>`
  (28px/dark/normal-case); live measures all three at 18px/400/uppercase/teal — exactly
  `.eyebrow`. Switched to `class="eyebrow"`. The brief's own screenshot-based guess here was
  correct (screenshot 02 = live).
- **E2** (`22db34a`) — two findings:
  - **Bullet-style correction to the brief's own speculation.** The brief guessed screenshot
    03 (no markers, centered text) was "vermutlich Original" and screenshot 04 (left-aligned
    disc bullets) was the rebuild getting it wrong. Live-measuring the actual
    Ausbildung/Felderfahrung `<li>`s showed the opposite: live really does use plain
    left-aligned disc bullets (`list-style-type: disc`, `text-align: start`) — screenshot 04
    was the accurate one. Fixed by giving the `<ul>` variant of `.quals-list` real bullets and
    left alignment (the `<div>` Sprachen variant keeps its centered treatment, unaffected).
    **Lesson for next session:** a screenshot's own "vermutlich Original/Rebuild" label in a
    brief is still a guess, not a measurement — this is the second time in this project a
    labeled guess turned out backwards (see `docs/UEBERGABE-CHAT.md` Regel 1's own three
    prior examples); always re-derive it from the live DOM before trusting the label.
  - **Ochre curve:** not present anywhere in the current build (0 matches for `#eda444`/its
    rgb form) — screenshot 04 was stale relative to the current code, not a live regression
    of the `docs/UEBERGABE-CHAT.md` "entails ersatzlos" decision. Nothing to fix.
  - **Crossfade ("Faden") feature**, Claudio's own new request: the three qualification bands
    now scroll-crossfade into each other on capable, motion-OK, ≥900px viewports (progressive
    enhancement — IntersectionObserver + `position: sticky`, no scroll-position math, no
    library); everyone else (no JS, `prefers-reduced-motion: reduce`, <900px) gets the
    unchanged plain stacked-bands render, including the existing `.reveal` fade-in. Verified
    all three fallback paths plus the active-band handoff via Playwright before committing —
    stayed inside the brief's own one-to-two-hour box, so no mid-run checkpoint was needed.
- **E3** (`22db34a`) — Über uns's Beratung/Workshops teasers swapped from the photo+overlap
  placeholder layout to `ServiceCard`/`.service-grid` (Claudio's decision: screenshot 07's
  teal gradient cards, same shape the homepage already uses for these two services).
  `.service-grid` moved out of `HomePage.astro`'s scoped `<style>` into `global.css` first —
  it was trapped there exactly the way `CLAUDE.md` warns about for `.section`. The old
  photo-teaser markup/CSS stays in the file as a clearly labeled, commented-out block
  (Claudio's own preferred option: kept as a findable backup for whenever real photos exist
  and Marina edits this in the CMS, rather than only recoverable from git history).
- **E5** (`22db34a`) — "Der Persephone-Ansatz"'s two columns (text left, four `ValueTile`s
  right) ended ~180px apart at 1440px on both original and rebuild alike (not a
  live-vs-rebuild difference — Claudio flagged it as an existing problem in both). Live's own
  row genuinely renders both columns equal-height (confirmed via `fusion-builder-row`'s two
  children both measuring 994px). Closed the gap (now 3px) with slightly looser
  paragraph line-height/spacing on the left column plus a small `ValueTile` padding trim on
  the right — text, order and paragraph count all unchanged, per Claudio's own condition. A
  line-height-only version was tried first and looked oddly airy within each paragraph; most
  of the extra height comes from between-paragraph spacing instead.
- **E4** (`45e18aa`) — homepage blog-grid cards: category eyebrow was a bespoke 12px/
  letter-spaced rule where live measures 18px/uppercase/teal (i.e. plain `.eyebrow`); the
  "Weiterlesen" link was terracotta at 13.6px where live is teal at 15px. Cards within a row
  are now equal-height regardless of title line count (the 4-line "Männer im Kinderwunsch:
  Mythos 'stille Stärke'" card no longer leaves 2-line siblings visibly shorter) via the same
  flex-column + `height: 100%` pattern `.format-card`/`.workshop-card` already established.
  Title color/size (dark, 26px, normal-case) already matched — one of `UEBERGABE-CHAT.md`'s
  four documented deliberate deviations from live, left alone.
- **E6** (`5781d5f`) — blog article in-body `<h2>` subheadings measured teal
  (`--color-accent`) on live; the rebuild had uppercase but no color, inheriting dark
  `--color-text`. One-line fix on `:global(.post-body h2)`.
- **E7** (`5781d5f`) — "Verwandte Beiträge" now reuses `BlogTeaserCard` (image + eyebrow +
  title + "Weiterlesen"), matching the homepage's blog grid, instead of the old
  image-less `.post-related-item` text cards. Grid widened to 3 columns at ≥900px (was 3 at
  ≥700px on the narrower old cards).
- **E8** (`ebadd1a`) — Workshops' two lists switched from `icon-list-sage` (bare book/scroll
  glyph per item) to `icon-list-check` (filled teal circle + check glyph), matching
  Beratung's format cards exactly, per Claudio's explicit instruction. Not independently
  re-verified against live — reused Beratung's own already-live-verified pattern
  (`NACHTLAUF-2026-09-08.md` B4) rather than re-measuring a value that's already on record.
- **E9** (`6c88bd8`) — Kennenlernen's masthead: Claudio's own deliberate design decision, not
  a live-site correction (the prior text-only hero was itself a confirmed-correct read of the
  live page at the time). Title → "Kennenlernen vereinbaren"; hero now the same split-hero
  with the default pomegranate image every other subpage has; intro sentence moved from
  under the calendar into the hero.
- **E10** (`6c88bd8`) — the booking calendar not using the full section width was
  `.booking-wrap`'s own 56rem reading-width cap (896px), narrower than the regular
  `.container` (1248px) — confirmed by measuring `getBoundingClientRect()` on the iframe vs.
  both wrapping elements, not Microsoft Bookings self-centering (the brief's other
  hypothesis). Cap removed; iframe now measures 1168px (container minus padding).

**Open questions this run added:** none — every item had either a literal live measurement
to follow or an explicit decision from Claudio to implement. **Teil F** (repo hygiene / stray
uncommitted files) was explicitly out of scope for this run, per the brief itself.

Build (`npm run build`) and `npx astro check` both clean after every commit above; only the
pre-existing non-blocking `astro.config.mjs` placeholder-domain warning remains (blocked on
the hosting decision, see `OPEN-QUESTIONS.md` #6).

## Nachtrag 2026-09-11 (`docs/NACHTRAG-2026-09-11.md` N1–N4) + live follow-up corrections

N1–N4 done first, in order, then a long cascade of live corrections continued in the same
session (Claudio watching over WLAN on his phone as changes landed) that go beyond the
written Nachtrag text — see `OPEN-QUESTIONS.md` #34–37 for the ones that need his/Marina's
sign-off, since several of them supersede earlier written decisions rather than just
implementing them.

**N1** — the colored-tile/oversized-card pattern ("Button-Kästchen", `LAUF-2026-09-10.md`
B8 Punkt 19) was misfiled under Angebote; Marina's screenshot for that point actually shows
Über uns's "Beratung & Coaching (i.A.u.S.)"/"Workshops & trainings" cards. Moved: the
`.offer-tile` markup/CSS now lives in `ueber-uns.astro` (replacing the ServiceCard grid
NACHTLAUF-2026-09-09.md E3 had put there), content unchanged (own label/description/href).
Angebote's copy removed ersatzlos, not replaced — the paragraph the tiles had displaced
there (`introPara2`) was independently already ordered removed by the same B8 Punkt 24, so
restoring it would have contradicted that.

**N2** — qualification-band panel:image column ratio corrected from 1:1 to 2:1 (live
measures 888:444), padding raised toward the measured 115px. Superseded by a same-session
live correction: see below.

**N3** — the rust-orange accent circle (`#c26d32`, `.quals-panel::after`) removed, per the
project-wide ochre ban. See `OPEN-QUESTIONS.md` #35 — a same-session comparison against the
true original page shows this exact accent as part of the original illustration, not a
stray element, which is now flagged as an open contradiction rather than resolved silently.

**N4** — the qualification-band crossfade rebuilt: previously each band was itself
`position: sticky`, stacked in flow, which read as the next band sliding up over the
previous one. Now only a new `[data-quals-stage]` wrapper is sticky; the bands sit
absolutely stacked at the same position inside it, so only opacity ever changes. Verified
via Playwright scroll-position sampling (not just visual inspection): at four scroll
fractions through the section, all three bands' `top`/`left` stayed identical to each other
at every sample — confirming nothing moves, only crossfades.

**Live corrections after N1–N4, same session** (see `OPEN-QUESTIONS.md` #34 for the full
list and the sign-off ask):
- Qualification-band panel's diagonal wave texture removed entirely (Nachtrag's own text
  said it should stay; a direct live instruction overrode that).
- Panel height changed from content-derived (N2's own text) to a fixed
  `calc(100svh - 117px)` — a live side-by-side comparison of all three original bands showed
  they're actually identical in size, alternating only in left/right placement, not height.
  117px is `.site-header`'s measured height at 1440px, hardcoded rather than read live via
  JS — a fragile number if the header's own height ever changes.
- Row width changed to a page-scoped near-full-bleed `.quals-container` (`max-width:1800px`,
  small vw-based gutter) instead of the shared `.container` — a deliberate one-off exception
  to the site's usual ~1200px reading-width convention (A1), only for this component.
- A slideshow-position indicator (three-dot pill, terracotta, right-aligned) added — not in
  any written brief, built from the reference screenshots Claudio sent. Enhancement-only
  (mirrors the crossfade's own JS/motion/width gates); lives inside `[data-quals-stage]`
  itself specifically so it disappears once the user scrolls past the section (an earlier
  `position: fixed` version kept showing all the way through the ClosingCta section below —
  caught and fixed in the same session via a screenshot Claudio sent from that section).
- `ClosingCta` (the shared photo+logo component, four pages: Über uns, Angebote, Workshops,
  Beratung) unified to one shape — portrait square (was 3:4), moved from bottom-right to
  bottom-left of the tile, sized to match the tile exactly (was 60-92% width) with a deeper
  offset for more visible overlap. The `layout` prop and its "pair" (no-overlap, equal
  squares) branch are removed entirely — Workshops/Beratung now overlap too, which reverses
  `LAUF-2026-09-10.md` B10 Punkt 29 / B11 Punkt 32's explicit "ohne Überlappung". Per-page
  logo colors are untouched (they come from each page's own tile asset, never hardcoded in
  the component).
- Über uns's own offer-tile (N1's moved cards) proportions adjusted twice in the same
  live loop: the white card first shrunk (was nearly the same height as the colored square,
  leaving only a thin sliver of it visible), then the colored square itself shrunk to match
  the card's new smaller scale (78% width, right-aligned) once the card alone looked
  undersized next to the still-full-size square. See `OPEN-QUESTIONS.md` #37.

**Verified:** `npm run build` clean after every change in this run (only the pre-existing
non-blocking placeholder-domain warning). 1440px and 390px checked with Playwright,
JavaScript on and off, for every touched component — no horizontal overflow at 390px, all
qualification-band content and both offer-tiles reachable with JavaScript disabled (the
`:has()`/native-flow fallback paths were never touched by this run's changes). The "blank
image" and "no visible qualification bands" false alarms hit mid-session both turned out to
be Playwright screenshot-tooling artifacts (native `loading="lazy"` images not painting in
an isolated `elementHandle.screenshot()` or an un-scrolled `fullPage` capture, and a
heavily-downscaled full-page PNG being hard to read by eye) — confirmed non-issues by
scrolling incrementally like a real visitor before re-screenshotting, not fixed by any code
change.

**Dev server hosted on the LAN for live review** (`astro dev --host --background`,
`http://192.168.178.44:4321/`) — this is this machine's own dev server reachable over WLAN,
not a deployment; stop it (`astro dev stop`) once the review session is done, and remember
the IP is only valid on this network / while this machine is on.

## Live-correction cascade, same session, continuing after the LAN review started

With the dev server reachable on his phone, Claudio kept sending screenshots and one-line
corrections in real time. Each is small on its own; recorded together here since none of
them trace to a written brief. See `OPEN-QUESTIONS.md` #38–44 for the sign-off asks.

- **`.button-primary` gradient restored at rest** (#38) — a prior pixel-sampled correction
  had flattened both rest and hover to solid fills. A fresh screenshot of the button as
  rendered asked for the gradient back specifically at rest; hover was left exactly as the
  pixel-sampled correction set it. Global rule in `global.css`, so it's sitewide by
  construction — checked all nine other files referencing `.button-primary` for a local
  override and found none.
- **`ServiceCard`'s orange seed-texture corner decoration removed** (#39) — no written brief
  behind this either, a direct "take the orange dots out" on a homepage screenshot.
- **`CtaBand` heading→paragraph gap set to 0** (#40) — was `--space-6` (2.5rem); "Abstand
  entfernen" taken literally rather than reduced to some intermediate value.
- **Disclaimer's title made genuinely left-aligned** (#41) — traced to `PageHero`'s own
  `.page-hero-inner` capping at 768px while A1 had already widened the body text under it to
  1200px; a short single-line title in the narrower, still-centered box read as shifted
  right even though `text-align` was `start` throughout. Fixed by widening `.page-hero-inner`
  to 1200px for this page only (Astro's scoped-style specificity needed a doubled class
  selector on the override — a first attempt with a plain `:global()` single class silently
  lost the specificity tie and changed nothing, caught by re-measuring rather than trusting
  the diff). A pre-existing, unrelated 390px horizontal-scroll discrepancy on this same page
  was found while checking mobile — confirmed via isolation (reverting each of today's two
  changes independently, neither changes the scrollWidth) not to be something this session
  introduced; left unfixed and logged for a future run.
- **Datenschutzerklärung's masthead rebuilt to match the live page** (#42) — a side-by-side
  against a live screenshot showed no `PageHero` banner at all on the original, just a small
  eyebrow-style label directly above the byline on the page's normal light background.
  Replaced the `<PageHero title="Datenschutzerklärung" />` call with a plain
  `<h1 class="eyebrow">` inline in the existing text section — still the page's one real H1,
  just styled like the site's other small section labels instead of a hero title. Legal text
  itself untouched.
- **Kontakt's name→"Standorte" gap widened** (#43) — `.kontakt-person-col`'s gap from
  1.25rem to 2rem; applies to both gaps in that column (shared flex `gap`), not just the
  first.
- **Qualification bands, four more corrections** (#44): lighter fill
  (`--color-teal-dark` → `--color-teal`, the brand book's own second color, "orientiere Dich
  am Brandbook"); a **real bug** in the alternating-sides logic found and fixed (`order: 2`
  was swapping which grid TRACK each element sat in, not just which side it painted on, so
  Felderfahrung's text column was visibly narrower than Ausbildung/Sprachen's — replaced
  with `grid-template-areas` so the panel stays in the 2fr track on both sides); bullet-list
  font-size raised 1.25rem → 1.5rem, taking cues from (not copying outright) the Sprachen
  band's own 2.125rem lines; and Über uns's section background alternation fixed — three
  `section-alt` (beige) sections had been stacked in a row after an already-beige hero,
  never once showing the page's plain light background, unlike every other page. Two of
  those (`section-alt` on the bio section and on the offer-tiles section) dropped back to
  plain `.section`; the quals bands' own hardcoded beige was already correct and untouched.

**Verified:** `npm run build` clean after every change (only the pre-existing non-blocking
placeholder-domain warning). 390px horizontal-overflow re-checked across all touched pages
after this whole cascade — clean except the pre-existing, pre-dating-this-session Disclaimer
discrepancy noted above and in `OPEN-QUESTIONS.md` #41.

## 2026-09-12 — Disclaimer/Impressum/Datenschutz title: a misread, corrected same day, and the actual fix

The first pass this day (dropping `<PageHero>` for a small eyebrow-style `<h1>` on all
three pages, matching Datenschutz's own 2026-09-11 change) was a misread of what Claudio
wanted — he clarified within the hour: all four pages using this banner (FAQs included)
should keep the big red `PageHero` title, just genuinely left-aligned instead of only
optically centered — and that this applies to the page's own main title only. Reverted:
`<PageHero>` restored on Disclaimer/Impressum/Datenschutz. Datenschutz's twelve numbered
`<h2>`s got reverted to plain dark headings in the same pass and then put back to the
small/uppercase/teal look within the hour, once it was clear only the page's own main
title (not the in-body section headings) was the misread — they were never part of the
correction, just briefly caught by an overly broad revert.

**The actual, correctly-scoped fix:** `PageHero.astro`'s own `.page-hero-inner` had
`max-width: 48rem` (768px) while the body text below it on every one of these four pages
(FAQs, Disclaimer, Impressum, Datenschutz) runs A1's 1200px — two differently-sized,
independently-centered boxes, so a short one-line title's own narrower centered box sat
well right of the wider text under it. `text-align` was `start` (left) the entire time;
next to a wider left edge below it, that reads as "centered", not left-aligned. Fixed once,
centrally, in `PageHero.astro` itself (1200px, matching `.section-narrow`) — covers all
four pages without a per-page override, since none of them have a legitimate reason to
use a narrower banner than their own body text.

**A real, previously-undiagnosed bug found in the process:** restoring `PageHero` on
Disclaimer brought back the 390px `scrollWidth` overshoot logged the day before
(`OPEN-QUESTIONS.md` #41) — this time traced to ground instead of left open. Disclaimer's
own `white-space: nowrap` + font-size clamp (LAUF-2026-09-10.md B3 point 1, "title on one
line") had a 1.35rem floor that doesn't actually fit this title at 390px — the nowrap text
paints 29px past its own box (invisible via `getBoundingClientRect` on the element, which
stays within bounds; only measuring the text range directly, or the document's own
`scrollWidth`, reveals it). Measured candidate sizes directly against the 350px available
width rather than guessing: 1.35rem needs 399px, 1.2rem needs 355px, 1.15rem is the first
that actually fits (340px). Lowered the clamp's floor to 1.15rem.

**Verified:** `npm run build` clean; 390px re-checked on all four pages (FAQs included) —
all exactly 390px, no overflow, Disclaimer's included, now via the real fix rather than as
a side effect of removing `PageHero`.
