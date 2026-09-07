# External review — rebuilt site vs. live persephone.at

> ## CORRECTION — 7 September 2026
>
> **The "VERIFIED CORRECT" entry below claiming that subpage mastheads correctly have no
> hero image is WRONG.** The live subpages *do* have hero images: the pomegranate
> illustration on Angebote, Beratung, Workshops, Selbsthilfegruppe and Kontakt, and a
> photograph of the owner at her desk on Blog. Eleven pages in the build are missing
> theirs.
>
> How the error happened, because the failure mode matters: the live page was fetched as
> converted text, the hero image did not survive that conversion, and its absence in the
> fetch was treated as evidence of its absence on the page. A check with a blind spot,
> reported as a verified fact — and worse, written up as "do not fix this".
>
> The fix is task 2 in `docs/FIXES-2026-09-07.md`. Treat every other "verified" claim in
> this document as verified against the artefact named in it, and nothing more.

Produced 6 September 2026 by a separate Claude session with read access to the repo,
working from `dist/` (build of commit as of 2026-09-06 09:21) served locally and
compared against the live site. Every item below was verified against the built HTML,
the content collections, or the live page — nothing here is inferred.

Method and its limits: the built pages were rendered in headless Chromium at 1440px and
measured programmatically (computed styles, headings, links, meta tags). The live site
could not be rendered from this environment, so live comparison is based on its fetched
text content, not screenshots. Mobile widths were not checked.

---

## CRITICAL — visitors hit these

### 0. `/angebote/` is orphaned — nothing links to it

In the built header, "Angebote" is a `<summary>` element inside a `<details>` dropdown,
not a link:

```html
<details class="nav-dropdown">
  <summary>Angebote ▾</summary>
  <ul>
    <li><a href="/beratung/">Beratung &amp; Coaching</a></li>
    <li><a href="/workshops/">Workshops &amp; Einzeltrainings</a></li>
    <li><a href="/selbsthilfegruppe/">Selbsthilfegruppe</a></li>
  </ul>
</details>
```

On the live site "Angebote" **is** a link, to `https://www.persephone.at/angebote-2/`,
with those same three children beneath it.

Searching the entire build, the only file containing `href="/angebote/"` is
`/angebote/index.html` itself. The page exists, is built, and cannot be reached by
clicking anything.

The fix has to keep both behaviours: the parent must navigate to `/angebote/` **and**
still open its submenu — including by keyboard, and on touch, where a single tap
currently has to serve both purposes. A `<details>/<summary>` cannot do this; the
summary needs to become a link with a separate disclosure control, or the dropdown
needs to open on hover/focus with the parent remaining a real anchor.

### 1. `/termine/` embeds the booking widget with no fallback

**Correction to an earlier version of this document, which claimed this page was empty.
It is not.** The page embeds Microsoft Bookings in an iframe:

```html
<iframe src="https://outlook.office.com/book/ErstgesprchfrDichallein@persephone.at/?ismsaljsauthenabled"
        width="100%" height="750" style="border:0" title="Terminbuchung"></iframe>
```

The earlier claim came from two checks that both missed the same element: text
extraction strips tags, and an iframe has no text content; and the link scan looked for
`href=`, while an iframe uses `src=`. In the review environment the iframe also could
not load, so the rendered page genuinely looked blank. Recording the mistake here
because the failure mode — two checks with a shared blind spot — is worth knowing.

What is actually worth attention:

**a) The rebuild embeds where the live site links.** The live `/termine/` page carries a
plain hyperlink to that Bookings URL. The rebuild loads it in an iframe on page view.
That is a real change in data flow: an embed contacts Microsoft's servers for every
visitor who opens the page, before any interaction or consent, whereas a link only does
so when someone clicks it. The Datenschutzerklärung mentions Bookings and
"Terminplanung", but that text was written for the live site's click-through behaviour.
This belongs on the sign-off list in OPEN-QUESTIONS #9, not treated as settled.

**b) There is no fallback.** If the iframe is blocked — tracking blocker, restrictive
network, offline — the page shows nothing but the word "Termine". No link, no
explanation. Given that the header CTA "Kennenlernen vereinbaren" points at this page
from every page of the site, and `beratung.md` and `angebote.md` also send people here,
that failure is expensive when it happens. A visible link to the same URL plus a line of
context underneath the embed costs nothing and removes the failure entirely.

**c) It is the only iframe in the build.** Everything else, including the
Selbsthilfegruppe registration (`https://forms.cloud.microsoft/e/gMNUsAsMrn`), is a
plain link. So this page is also inconsistent with how the rest of the site handles the
same kind of third-party service.

### 2. `/angebote/` is missing the content the page exists for

The live page lists ten first-person scenario statements under "Fang einfach dort an, wo
Du Dich wiedererkennst" — the self-recognition list that is the whole point of the page:

- Ich mache einen Bogen um Kindergeburtstage und Familienfeste.
- Ich habe das Gefühl, mein Körper lässt mich im Stich.
- Für andere war es ja noch früh. Für mich war es ein Kind.
- Wir leben seit Jahren im Zwei-Wochen-Takt.
- Der Kinderwunsch ist mein zweiter Job geworden.
- Ich habe das Gefühl, wir erleben unseren Kinderwunsch völlig unterschiedlich.
- Ich wünsche mir Menschen, die nicht erst verstehen müssen, wovon ich spreche.
- Ich möchte wissen, wie andere ihren eigenen Weg durch diese Krise gefunden haben.
- Fremde Menschen entscheiden, ob wir geeignet sind.
- Ich weiß nicht, wie ein Leben ohne Kind für mich aussehen könnte.

None of these appear in `src/content/pages/de/angebote.md` (1049 bytes total) or in the
built page. The live heading "Das könnte jetzt passen" is also missing.

This is an **extraction** loss, not a rendering loss — the text never made it into the
content collection.

### 3. `/beratung/` renders without two of its sections

`src/content/pages/de/beratung.md` contains `## Was ist Beratung?` (line 12) and
`## Formate` (line 18). Neither string appears anywhere in `dist/beratung/index.html`.

This is a **rendering** loss — the content was extracted correctly and then dropped when
the page was composed.

### 4. `/workshops/` renders without one of its sections

`src/content/pages/de/workshops.md` contains `## Was ist Psychoedukation?` (line 14).
The string does not appear in `dist/workshops/index.html`. Same failure mode as #3.

### 4b. Über uns: the two closing teasers lost their photos and their entire layout

Confirmed against a screenshot of the live page supplied by the owner, 6 September.

**The live design:** each of the two closing teasers ("Beratung & Coaching (i.A.u.S.)"
and "Workshops & trainings") is a black-and-white photograph with a cream text card
overlapping it, offset to one side and breaking out of the image bounds. The two are
staggered vertically — the left card sits higher, the right one lower. The heading is
small, uppercase, terracotta and letter-spaced (eyebrow styling), and the heading itself
is the link. There is no separate button, and the owner has confirmed that is
intentional.

**The build:**

```html
<article class="teaser-card">
  <h3><a href="/beratung/">Beratung &amp; Coaching (i.A.u.S.)</a></h3>
  <p>Ein geschützter Raum, um innezuhalten…</p>
</article>
```

Two plain boxes, side by side, equal height, no images.

**The two photographs are absent from the repo** — `src/assets/pages/ueber-uns/` contains
only `logo-kongruenz-und-authentizitaet.png` and `marina-portrait-hero.png`, and the
built page carries four images in total, none of them a teaser photo.

**Do NOT download them from the live page.** The owner has confirmed these are Avada
template demo photos. Theme demo imagery is typically licensed for the demo only, not for
production use on a real business site, so copying them into the rebuild would carry a
licensing problem forward rather than fixing one.

**Decision taken 6 September: placeholders for now.** Build the layout correctly with a
neutral placeholder in the brand palette in each image slot. Real photographs — either
unpublished frames from the owner's existing professional shoot, or properly licensed
stock — get swapped in later. The placeholder must be obviously a placeholder, not a
stand-in that could ship unnoticed.

**Two things to build in regardless of which photos land there:**

1. The live treatment is **black and white**. Apply it as a CSS filter rather than baking
   it into the image files, so any future photo drops in and matches automatically.
2. The old photos are still useful as a *brief*: two women in conversation as equals, and
   a group of people moving together arm in arm. Both are restrained and avoid the usual
   fertility-stock clichés. Source to that description; do not use the files.

**What is already correct and should not be changed:** the link targets (`/beratung/` and
`/workshops/`, repaired per OPEN-QUESTIONS #6) and the structure of the heading being the
link with no button. This supersedes OPEN-QUESTIONS #10, which proposed adding button
copy — the owner has confirmed no button is wanted.

**Correction to finding #9 below:** the small logo under the "Sprachen" column is *not*
misplaced. It carries `class="credentials-badge"` inside the credentials grid and is a
deliberate design element. Withdrawn.

> **Likely common cause for #3 and #4:** pages are composed by selecting specific block
> indices out of the parsed markdown (`src/lib/parseMarkdownBlocks.ts`, referenced in
> OPEN-QUESTIONS #7). Any block not explicitly selected is silently dropped, with no
> error and no warning. This is fragile by construction and will keep losing content
> quietly. Worth a build-time assertion that every source block is either rendered or
> explicitly excluded by name.

---

## SERIOUS

### 5. Eleven pages ship the homepage's meta description

`ueber-uns`, `angebote`, `beratung`, `workshops`, `selbsthilfegruppe`, `kontakt`,
`termine`, `blog`, `impressum`, `datenschutz` and `disclaimer` all carry:

> "Persephone begleitet Dich und Deine:n Partner:in psychosozia…"

Only `faqs` ("Häufig gestellte Fragen") and `newsletter` have their own.

OPEN-QUESTIONS #3 recorded these pages as shipping *no* description and recommended
leaving them empty. That is not what the build does — a fallback fills them with the
homepage's text, so eleven pages now share one description. For search engines that is
worse than having none.

### 6. Two CTAs still point at the old live site

`dist/ueber-uns/index.html` and `dist/workshops/index.html` both contain
`href="https://persephone.at/newsletter"` — absolute, pointing at the old WordPress site
rather than the local `/newsletter/` route. Clicking the e-Brief CTA on either page
leaves the rebuild.

These are the only two absolute old-site links in the whole build; everything else is
clean.

### 7. The "Workhops" typo shipped in the visible headline

`dist/workshops/index.html` renders `<h1>Workhops & Einzeltrainings</h1>` while the
`<title>` correctly says "Workshops & Einzeltrainings". OPEN-QUESTIONS #8 recommended
correcting the typo when the page was built. It wasn't.

### 8. Kontakt lost its section labels

`kontakt.md` has `## Erreichbarkeit` and `## Standorte`. Neither heading renders. The
text underneath them is present (the 48-hour response note, the Wien/Online locations),
but unlabelled, so the page reads as one undifferentiated block.

---

## LAYOUT

### 9. Trailing images are dumped at the bottom of pages with no placement

Images that sit at the end of the source markdown are rendered in document order rather
than placed:

- `/angebote/` ends with a large centred portrait of Marina, followed by a small logo
  floating alone against the left margin, both with no surrounding context.
- `/ueber-uns/` places a small logo underneath the "Sprachen" column, where it reads as
  an accident.

Both look unfinished rather than designed.

### 10. Kontakt's form has a small cropped photo beside it

A narrow, cropped image sits to the left of the form fields and reads as a layout
mistake rather than a choice. Worth looking at against the live page.

### 11. Homepage and subpages use different inner container widths

Homepage inner container is 896px; every subpage is 768px. Outer container is 1248px
everywhere. This may be deliberate (narrower measure for text pages), but it is not
recorded in DESIGN-SYSTEM.md, so it currently reads as drift.

---

### 12. Every page declares a canonical URL on a domain that doesn't exist

`astro.config.mjs` sets `site: 'https://persephone.example'` — a placeholder, marked
with a TODO. Every built page therefore ships:

```html
<link rel="canonical" href="https://persephone.example/">
<meta property="og:url" content="https://persephone.example/">
```

Harmless today, wrong the moment anything is deployed, and it silently poisons the
sitemap too. Blocked on the domain/hosting decision below.

---

## VERIFIED CORRECT — do not "fix" these

- ~~**Subpage mastheads have no image, and that is right.**~~ **WITHDRAWN — this was
  wrong.** See the correction at the top of this document and task 2 in
  `docs/FIXES-2026-09-07.md`. The live subpages do have hero images.
- **Über uns copy is verbatim-accurate.** Every heading and paragraph was compared
  against the live page word by word: the Marina introduction, the Persephone myth
  paragraph, "Was aus meiner Kinderwunschkrise wuchs", "Persephone als soziales
  Unternehmen", both credential lists, the languages block and both closing teasers all
  match exactly — including the source's own typo (see below). The paraphrasing problem
  disclosed in the earlier session does not survive on this page.
- **Section rhythm is consistent.** `.section` is 72px top and bottom on every page,
  `page-hero` is 80px, the split hero is 0. No stray values found.
- **FAQs renders completely** — 6590 characters of main text from a 7218-byte source.
- **The credentials block on Über uns** (Ausbildung / Felderfahrung / Sprachen as small
  teal labels over three columns) is a deliberate, working design, not a broken heading.

---

## TYPOS IN THE LIVE COPY — for Marina, not for code

All of these exist on the live site and were faithfully preserved, which was correct.
They should be corrected in the rebuild once she approves. Two were not previously
listed:

| Page | Current | Should be |
|---|---|---|
| Workshops (h1) | Work**h**ops & Einzeltrainings | Workshops |
| Über uns | meine **linguistiche** Kommunikationsexpertise | linguistische |
| Selbsthilfegruppe | die Gestaltung der **Einbzeltermine** | Einzeltermine |
| Selbsthilfegruppe (h3) | **Nächtes** SHG-Treffen | Nächstes |
| FAQs | eine tolle **Geleggenheit** | Gelegenheit |
| FAQs | von mir als **(ehmals)** Betroffene | ehemals |

---

## ACCESSIBILITY

- Images with empty `alt`: Über uns 2 of 4, Angebote 2 of 4, Beratung 2 of 4,
  Workshops 2 of 4, Kontakt 1 of 3. The content audit reported every image as having alt
  text; that is not the case. The Über uns hero portrait in particular has
  `heroImageAlt: ""` in its frontmatter.
- On Über uns, "Ausbildung", "Felderfahrung" and "Sprachen" are `<h2>` elements rendered
  at 12.8px as eyebrow labels. Visually correct, but semantically these are labels, not
  second-level headings.

---

## CONFIRMED PRE-EXISTING

- The language switcher renders `/en/` and `/it/` links on every page (2 per page in the
  German build) that resolve to nothing. Matches OPEN-QUESTIONS #12; the recommendation
  there (hide locales without a translation) is the right one.

---

## PROCESS NOTE

`HANDOFF.md` is 28.9 KB and `OPEN-QUESTIONS.md` is 17.7 KB. The handoff is meant to be
read at the start of every session; at that length it stops being read and starts being
skimmed, which is the same failure as an over-long CLAUDE.md. Trim the handoff to the
current live state and move the history elsewhere.

---

# RECOMMENDATIONS

The owner's stated goal: **rebuild and improve the site, but keep it looking and feeling
the same.** Everything below follows from that.

## The governing decision: keep visual fidelity, retire content fidelity

There are two kinds of fidelity in this project and they have been treated as one rule.

**Visual fidelity is the goal.** Same look, same feel, same page structure and
navigation. The design system is derived from real code and measured consistent across
all fourteen pages. Do not redesign anything, and do not restructure the information
architecture.

**Content fidelity was a method, not a goal.** The "German copy stays verbatim" rule
existed to stop an earlier session inventing copy, and it worked — Über uns is
verbatim-correct against the live page. That job is finished. Keeping the rule now only
preserves defects that have already been decided against: six typos, duplicate meta
tags, four dead links, a leftover English theme heading, an unremoved Avada demo
description.

**Retire it deliberately, in one move:**

1. Freeze the current verbatim extraction into `docs/source-archive/` — a one-time
   record that is never rendered and never edited again.
2. `src/content/` becomes the site's real copy: editable, correctable, the owner's.
3. The contradiction on the Datenschutz page (where the `.md` and the `.astro`
   deliberately disagree) disappears, because the archive holds the old text and the
   content holds the shipped text.

This also unblocks the stated long-term goal of texts being editable through a backend.
"Marina can edit it" and "it must stay byte-identical to a 2026 WordPress page" cannot
both be true.

## Two things must be true before content is touched

### A. Fix page composition first

Pages are composed by selecting blocks out of parsed markdown by position
(`src/lib/parseMarkdownBlocks.ts`). Three consequences, all observed in this review:
a block that nothing selects vanishes with no error; inserting a paragraph shifts every
index after it; and a diff of the content says nothing about what will render.

Either render the markdown wholesale with a component mapping so nothing *can* be
dropped, or move to **named** blocks — frontmatter keys or directives — so a page
requests `formate` and a missing name fails the build. Add an assertion that every
source block is either rendered or explicitly listed as excluded.

Fixing copy on top of the current mechanism is unsafe: an edit can land in the source
and not appear on the page, with nothing reporting it.

### B. Add build-time assertions before improving anything

Six findings in this review are mechanically checkable. Roughly sixty lines of Node run
after `astro build`:

- every content page has a route, and every route has content
- every route is reachable from the nav or another page → catches finding #0
- no `href` points at `persephone.at` → catches finding #6
- every page has a unique, non-empty meta description → catches finding #5
- every `<img>` has non-empty `alt` → catches the accessibility gap
- every locale link in the switcher resolves to a built page → catches finding #12 (old numbering: the `/en/` `/it/` 404s)
- `site` in `astro.config.mjs` is not a placeholder → catches finding #12

This is the difference between an agent reporting that it checked and the build refusing
to pass. It is the highest-leverage change after A.

## Smaller reconsiderations

- **The i18n config is ahead of the content.** Three locales configured, one page
  translated, and 105 dead links as the direct result. Ship German-only; add locales
  when there is content to add.
- **The docs are an append-only archive, not a working state.** See the process note
  above. Handoff = current state only. Open questions = genuinely open only. Resolved
  decisions move to `docs/decisions.md`.
- **Semantics on Über uns**: "Ausbildung", "Felderfahrung" and "Sprachen" are `<h2>`
  elements styled as 12.8px eyebrow labels. Visually right, semantically wrong.

---

# DECISIONS PENDING (not code's to make)

## 1. Hosting — the launch critical path, and absent from OPEN-QUESTIONS

Nothing can go live without it. It gates the contact form endpoint, the deploy config,
the canonical domain (finding #12), the Datenschutz re-check, and the DNS cutover.

Three things are commonly conflated here and are in fact independent:
- **The domain** `persephone.at` can point anywhere. Keeping it does not mean keeping
  WordPress.
- **The hosting.** WordPress hosting is PHP hosting — the wrong shape for a static Astro
  build. Static hosting for a site this size is free or near-free, and is a large part of
  why the rebuild will be faster than the current site.
- **Where the owner writes.** The only genuinely open question of the three.

## 2. Where content gets written

A Decap CMS scaffold already exists in the repo (`dist/admin/`, built from an `admin/`
source). Its own comments state it is a "draft/starting point, not yet deployable": it
needs a host and a git-auth bridge, and only some collection fields are filled in.

The two viable paths:

- **Decap CMS** — edits at `/admin` commit to git and trigger a rebuild. One system, no
  WordPress to maintain, and the blog editor (title, date, header image, markdown body)
  is simpler than the Avada editor currently in use. Already half-configured.
- **Headless WordPress** — WordPress survives on a subdomain as the editor only, Astro
  pulls posts from its REST API at build time. The editing workflow is completely
  unchanged, at the cost of keeping a WordPress install patched, secured and paid for
  indefinitely, and staying coupled to the Avada content model that made this extraction
  difficult.

**Recommended:** finish the Decap blog collection, deploy a preview, and have the site
owner write one real post in it. Decide from that, not in the abstract. Headless
WordPress remains the fallback and nothing is wasted either way — the content
collections keep the same shape.

## 2bb. Blog link targets — decided 6 September

The two repaired dead links in OPEN-QUESTIONS #6 are now confirmed, and one of them
needs changing:

| Post | Link text | Confirmed target |
|---|---|---|
| "Mythos Männerohnmacht" | "Fruchtbarkeit gilt als Frauensache" | `/blog/ist-unfruchtbarkeit-immer-noch-frauensache/` — correct as built |
| "Ist Unfruchtbarkeit… Frauensache" | "hier", in "Den Termin und den Link zur Anmeldung findest Du hier" | **`/selbsthilfegruppe/`** — currently points at `/termine/`, must be changed |

The sentence refers to the next self-help group meeting and its registration; that
registration link lives on the Selbsthilfegruppe page, not on Termine. The first target
is confirmed by its own link text, so the uncertainty noted in OPEN-QUESTIONS #6 is
resolved.

The fix is a direct edit to `src/content/blog/de/ist-unfruchtbarkeit-immer-noch-frauensache.md`
(the render-time patch used elsewhere does not apply to content-collection bodies — see
OPEN-QUESTIONS #6 for why). Change the URL only; no prose changes.

Separately: as of 6 September both links were still broken on the live WordPress site.
The owner is aware.

## 2c. Contact and booking — decided 6 September

**Microsoft Forms**, submitting to `marinabletsas@persephone.at`. Chosen because the
owner is already on Microsoft 365, already uses Microsoft Forms for the
Selbsthilfegruppe registration, the Datenschutzerklärung already covers Microsoft, and
running inside her own tenant avoids the sender-authentication failure described in 2b.

**Kontakt and Termine stay as two separate pages.** Merging was considered and rejected:
the header CTA "Kennenlernen vereinbaren" is the site's primary conversion, present on
every page, and should land somewhere that does exactly one thing. A general enquiry form
and a 750px booking embed on one page means one of them loses.

Three changes instead:

1. `/termine/` gets explanatory copy above the booking embed — what the conversation is,
   twenty minutes, free, no obligation. It currently contains the word "Termine" and
   nothing else.
2. Its title should say what happens there. "Termine" does not; "Kennenlernen
   vereinbaren" does. Final wording is the owner's.
3. The two pages cross-link: a short pointer to the booking from Kontakt, and a pointer
   to the contact form from the booking page.

**One addition to the form:** the Anliegen dropdown currently offers Beratung, Workshops
& Trainings, Selbsthilfegruppe, Sonstiges. The owner wants Kontakt to also serve
collaboration, interview and press enquiries, so a fifth option is needed. Wording is
pending from the owner — do not invent one.

## 2b. LIVE SITE ISSUE — the contact form is not delivering

Not a rebuild finding, but it outranks everything in this document. The owner reports
that messages from the live contact form should reach `marinabletsas@persephone.at` and
currently do not. The live Kontakt page shows no email address as an alternative, so a
visitor whose message vanishes has no other route. Duration unknown.

Verified: the live form's fields are exactly those the rebuild reproduces (name, phone,
email, Anliegen dropdown with four options, message, consent) — so the rebuild's
`ContactForm.astro` was extracted correctly, not invented. Only the destination is
missing.

Most likely cause: the WordPress form sends with the visitor's address as the From
header; Microsoft 365 rejects or junk-folders it as unauthorised for that domain. This
failure mode is common for WordPress-form-into-M365 setups.

Handled by the owner. Recorded here because it strengthens the recommendation below:
whatever replaces it must send authenticated through her Microsoft 365 account, with her
own domain as the From address and the visitor's address only in Reply-To.

## 3. The contact form (OPEN-QUESTIONS #11) has a fourth option that wasn't listed

That question offered a serverless function, a hosted form service, or `mailto:`. It
missed the option already in use on this site: **Microsoft Forms**. The Selbsthilfegruppe
registration is already `https://forms.cloud.microsoft/e/gMNUsAsMrn`, the owner is
already on Microsoft 365 (`persephone.at` is an M365 domain — see the Bookings link on
`/termine/`), and the Datenschutzerklärung already covers Microsoft. That adds no new
vendor, no new privacy disclosure, and no hosting dependency.

## 3b. Legal consequences of the migration itself

Not legal advice — Austrian law, and the privacy policy and Impressum should be checked
once by a qualified person. These are the items the *platform switch* creates.

**a) Every old URL needs a permanent redirect, and two of them are obligations.** The new
routes differ from the old ones (`/angebote-2/` → `/angebote/`, blog posts move from the
top level into `/blog/…`, `/datenschutzerklaerung/` → `/datenschutz/`). For blog posts a
404 is merely bad; for the Impressum and the Datenschutzerklärung it is a compliance
problem, since those must remain easy and immediate to find. Old newsletters, printed
material and the consent text inside the Selbsthilfegruppe Microsoft Form may all point at
the old addresses. Build the redirect list from the live site's sitemap and make it
complete.

**b) The Datenschutzerklärung becomes factually wrong at the moment of the switch.** Its
Google Fonts and Typekit sections describe behaviour the new site does not have, and the
server changes too. It must be revised and signed off *before* go-live, not after — a
privacy policy that demonstrably describes something else is worse than a thin one.

**c) The new host is a new data processor.** Even pure static delivery processes server
logs and IP addresses. Moving from an Austrian WordPress host to Cloudflare or Netlify
introduces a new processor with different server locations and probably non-EU
processing, needing a processing agreement and a mention in the declaration. This is a
real input to the hosting decision: a European provider makes this part simpler.

**d) The retired WordPress site still holds personal data.** The plan keeps it alive on a
subdomain, which is right for the owner's peace of mind — but its database may contain
stored contact-form submissions from people in a very personal situation. Leaving an
unpatched installation running for years with that data in it is the opposite of
harmless. Establish what personal data it holds, then decide deliberately: remove it,
keep the installation password-protected and non-public, or set an end date rather than
"forever". Security updates continue for as long as it is online.

**Not an issue:** the owner's own text and images move freely — they are hers regardless
of the software. Letting the Avada licence lapse is unproblematic, and the migration ends
the grey area around its template photos.

## 3c. Two more legal items the rebuild can get right for free

**Keep the site cookie-banner-free.** It self-hosts fonts, has no analytics and loads no
trackers. A site that contacts nobody on page load needs no consent banner. Exactly one
thing breaks that: the Bookings iframe on `/termine/`, which contacts Microsoft on page
view before any consent — the same shape as the Google Fonts rulings. **Fix: load the
embed only after a click** ("Kalender laden — dabei wird eine Verbindung zu Microsoft
aufgebaut"). This also solves the no-fallback problem in finding #1.

**Protect the regulated professional titles.** The owner is a Lebens- und Sozialberaterin
*in Ausbildung unter Supervision* and in psychotherapy training. Austrian law regulates
these titles and requires the training status to be disclosed; the live site does this
carefully, and the Disclaimer page states explicitly that this is not psychotherapy.
Given that this rebuild has already dropped whole sections silently (findings #3 and #4),
verify before go-live that the Disclaimer page is complete and that every "i.A.u.S."
occurrence survived. On these pages a silently lost paragraph is not cosmetic.

## 4. Copy decisions for the site owner — one conversation, not eleven tickets

Batch these: the six typos in the table above, the h1 weight (400 vs 900), which of the
two Selbsthilfegruppe intro paragraphs to keep, button copy for the two Über uns
teasers, a clean Impressum description, and confirmation of the two guessed blog-post
link targets from OPEN-QUESTIONS #6. Roughly twenty minutes together, and it clears most
of the open list.

## 5. Datenschutzerklärung — unchanged from the earlier session

Still needs the owner's sign-off, and a re-check at launch against what the deployed site
actually loads. Note additionally that `/termine/` now *embeds* Microsoft Bookings where
the live site *links* to it — a change in data flow that the existing wording was not
written for.
