# Night run — persephone-site

This is the persephone-site repo (my wife's website rebuild, Astro). Before anything
else, confirm the working directory matches. If it doesn't, stop and tell me. Do nothing
else.

Read, in this order:

1. `docs/external-review.md` — an external review of this build against the live site.
   It contains verified findings, recommendations and the decisions taken. **It is the
   authority for this run.** Where it and older notes disagree, it wins.
2. `docs/fuer-marina.md` — the site owner's decisions, in German.
3. `CLAUDE.md`, `DESIGN-SYSTEM.md`, `HANDOFF.md`, `OPEN-QUESTIONS.md`.

Then work through the phases below unattended. I'm asleep — do not wait for me.

---

## RULES FOR THIS RUN

- **Never stop to ask.** Anything ambiguous or needing my decision goes to
  `OPEN-QUESTIONS.md` with the options and your recommendation, then move on to the next
  independent task.
- **Never invent content, copy or design values.** If you can't determine something, it
  is an open question, not a thing to guess at.
- **Run the build before every commit. Never leave the tree broken.**
- **Commit after every completed step**, with a descriptive message. Small commits.
- **Update `HANDOFF.md` after every commit, not at the end.** Assume you could be cut off
  without warning — that happened twice this weekend.
- **Do not redesign anything.** Colours, fonts, spacing, layout and the page set are
  settled. The goal is the same site, working correctly.
- **Shared classes go in `global.css`**, never inside a component's scoped `<style>`
  block. That trap already cost us a day.
- **No new dependencies** without recording the reason in `OPEN-QUESTIONS.md` first.
- **Work in phase order.** Phase 1 protects everything after it. If you run out of budget
  mid-run, stopping after any completed phase must leave the repo in a good state.

---

## PHASE 1 — Stop the bleeding

### 1.1 Build-time checks

Write a check script that runs after `astro build` and reports violations. Start it
**non-blocking**: it prints a report and exits 0, so we can see the current state.

Checks:

- every page in `src/content/pages` has a route, and every route has content
- every built route is reachable from the nav or linked from another page
- no `href` anywhere points at `persephone.at` (all internal links are relative)
- every page has a meta description, and no two pages share one
- every `<img>` has a non-empty `alt`
- every locale link the language switcher renders resolves to a page that was built
- `site` in `astro.config.mjs` is not a placeholder
- every heading present in a source content file appears in the built page for that route

Commit the script and its first report as `docs/build-check-report.md`.

### 1.2 Fix page composition — the root cause

Pages are currently composed by selecting blocks out of parsed markdown **by position**
(`src/lib/parseMarkdownBlocks.ts`). A block that nothing selects vanishes with no error.
This has already silently dropped three sections (review findings #3 and #4).

Replace positional selection with something that cannot fail silently. Either render the
markdown wholesale with a component mapping, or move to **named** blocks so a page
requests `formate` and a missing name fails the build. Your call which — record the
choice and the reasoning in `DESIGN-SYSTEM.md`.

Then make the last check in 1.1 blocking: a source heading that does not appear in its
built page fails the build.

### 1.3 Restore the lost content

With the mechanism fixed, restore what was dropped:

- `/beratung/` — `## Was ist Beratung?` and `## Formate`
- `/workshops/` — `## Was ist Psychoedukation?`
- `/kontakt/` — the `## Erreichbarkeit` and `## Standorte` headings
- `/angebote/` — the ten self-recognition statements listed in review finding #2. These
  are **not** in the content collection; they must be re-extracted from
  `https://www.persephone.at/angebote-2/`. Also the missing heading "Das könnte jetzt
  passen".

Verify each against the live page. Commit per page.

---

## PHASE 2 — Separate the archive from the live copy

Right now `src/content/` is simultaneously a verbatim archive of the old WordPress site
and the source of truth for the new one. Those conflict, and the conflict is why we have
"preserve the typo" sitting next to "fix the typo".

- Freeze the current verbatim extraction into `docs/source-archive/` — a one-time record,
  never rendered, never edited again.
- `src/content/` becomes the site's real copy: editable and correctable.
- Update `CLAUDE.md`: the verbatim rule now applies to the archive only. Content may be
  corrected when a decision says so; it may still never be invented.

This unblocks Phase 3. Commit.

---

## PHASE 3 — Apply the owner's decisions

All of these are decided. Details and reasoning are in `docs/external-review.md` and
`docs/fuer-marina.md`.

1. **Six typos** — correct all six: `Workhops` → Workshops (the visible h1 on the
   Workshops page), `linguistiche` → linguistische, `Einbzeltermine` → Einzeltermine,
   `Nächtes` → Nächstes, `Geleggenheit` → Gelegenheit, `(ehmals)` → ehemals.
2. **Heading weight** — set `--weight-heading` to **400**. One value, nothing else.
3. **Selbsthilfegruppe intro** — keep variant A: "…mit Menschen, die die Erfahrung der
   Kinderwunschkrise teilen." Remove the second, near-identical sentence.
4. **The English demo heading** "Your Journey to a Fulfilling Life" stays removed.
5. **Blog link** — in `src/content/blog/de/ist-unfruchtbarkeit-immer-noch-frauensache.md`,
   change the "hier" link from `/termine/` to **`/selbsthilfegruppe/`**. URL only, no
   prose change.
6. **Impressum meta description** — "Impressum und Offenlegung von Persephone – Marina
   Bletsas, Wien."
7. **Newsletter** — `/newsletter/` redirects to the MailerLite form, matching the live
   site. **Delete the invented page text**; do not leave it unused in the repo.
8. **Meta descriptions** — eleven pages currently inherit the homepage's. Stop the
   fallback. Where the live page has its own, use it; where it has none, leave it empty
   and list the page in `OPEN-QUESTIONS.md` for the owner to write later. Do not invent
   any.
9. **The two absolute links** to `https://persephone.at/newsletter` on `/ueber-uns/` and
   `/workshops/` become relative internal links.
10. **`astro.config.mjs`** — `site` is still `https://persephone.example`. Leave the
    placeholder but add a prominent TODO and list it in `OPEN-QUESTIONS.md` as blocked on
    the hosting decision. Do not guess a domain.

---

## PHASE 4 — Structural fixes

### 4.1 `/angebote/` is unreachable

"Angebote" in the header is a `<summary>` inside a `<details>` — a toggle, not a link.
Nothing in the entire build links to `/angebote/`. On the live site it **is** a link, to
`/angebote-2/`, with the same three children beneath it.

The parent must navigate to `/angebote/` **and** still open its submenu — by mouse, by
keyboard, and on touch, where one tap has to serve both. `<details>/<summary>` cannot do
this. Either make the summary a real anchor with a separate disclosure control, or drop
`<details>` for a hover/focus dropdown with the parent as an anchor. Handle keyboard and
touch deliberately; do not just add an `href` and break the dropdown.

Verify with a screenshot at 1920 and 390, and by checking the build-check reachability
rule now passes.

### 4.2 Über uns — the two closing teasers

The live design: each teaser is a black-and-white photograph with a cream text card
overlapping it, offset and breaking out of the image bounds, the two staggered vertically
— the left card higher, the right lower. The heading is small, uppercase, terracotta,
letter-spaced, and is itself the link. **No button** — that is confirmed and intentional.

The build currently has two plain boxes with no images.

- Build the correct layout.
- **Do not download the photos from the live site.** They are Avada template demo images;
  the owner has confirmed this and their licence does not cover production use.
- Use **neutral placeholders in the brand palette**, obviously recognisable as
  placeholders so they cannot ship unnoticed.
- Apply the black-and-white treatment as a **CSS filter**, not baked into image files, so
  real photos can be dropped in later without processing.

### 4.3 `/termine/`

- Add explanatory copy above the booking embed: what the conversation is, twenty minutes,
  free, no obligation. The page currently contains the word "Termine" and nothing else.
- Propose a better page title — "Termine" does not say what happens there. Put your
  suggestion in `OPEN-QUESTIONS.md`; the final wording is the owner's.
- **Make the Bookings embed load only after a click** ("Kalender laden — dabei wird eine
  Verbindung zu Microsoft aufgebaut"). This is the legal point in review 3c: the site
  currently needs no cookie banner, and this embed is the one thing that would change
  that. It also fixes the no-fallback problem — include a plain link to the same URL.
- Cross-link: a short pointer from `/kontakt/` to the booking, and from here to the
  contact form. Kontakt and Termine stay **two separate pages** — do not merge them.

### 4.4 The language switcher

It renders `/en/` and `/it/` links on every page that resolve to nothing. Hide the
entries for locales that have no translation of the current page. Do not remove the
multilingual homepage, which works.

---

## PHASE 5 — Verify

- Run the production build. The check script from 1.1 now blocks on the rules made
  blocking in 1.2.
- Screenshot every page at 1920 and compare against the homepage for container width,
  gutters, type scale, section rhythm, backgrounds and buttons. Report deviations.
- **Integrity check with legal weight** (review 3c): confirm the Disclaimer page is
  complete against the live page, and that every occurrence of "i.A.u.S." and every
  statement about the training status survived. On these pages a lost paragraph is not
  cosmetic. Report explicitly, page by page.
- Note in `HANDOFF.md` that mobile rendering remains unverified — the 390px screenshots
  are unreliable in this environment and need a real device.

---

## PHASE 6 — Leave it so I can look at it

I want to see the result in a browser in the morning without reconstructing anything.

**a) Screenshots I can flip through without starting anything.** Save a full-page
screenshot of every page at 1920px into `docs/screenshots/<today's date>/`, named after
the route (`home.png`, `ueber-uns.png`, `angebote.png`, …). For the pages you changed
most — Über uns, Angebote, Beratung, Workshops, Termine — also save a `-before.png` taken
from the build as it was at the start of this run, so I can compare. Add a short
`docs/screenshots/<date>/README.md` listing what changed on each.

**b) Make sure the local preview actually works, and tell me how.** Verify that both
`npm run dev` and `npm run build && npm run preview` start cleanly from a fresh terminal.
If a dev server is already running on port 4321 from an earlier session, say so and give
me the port that is actually free.

**c) Put this at the very top of your final report**, before anything else — the exact
command and the exact URL:

```
So schaust Du es Dir an:
  cd C:\Users\basem\persephone-site
  npm run dev
  → http://localhost:XXXX

Diese Seiten haben sich geändert: …
```

Use the real port. If `npm run dev` does not start cleanly, that is itself the most
important thing in the report — say so at the top instead.

---

## DO NOT DO

- Do not merge Kontakt and Termine.
- Do not add buttons to the Über-uns teasers.
- Do not copy the Avada template photos into the repo.
- Do not invent the fifth "Anliegen" dropdown option — the owner is choosing the wording.
- Do not invent meta descriptions, page copy, or a production domain.
- Do not change colours, fonts, spacing or the page set.
- Do not touch `src/pages/datenschutz.astro`'s wording. It is awaiting the owner's legal
  sign-off. Structural or class changes are fine; not a single word changes.

---

## FINALLY

Update `HANDOFF.md` — and trim it. It is 29 KB, which is past the point where it gets
read properly. It should describe the current state only; move the history to
`docs/decisions.md`. Do the same for `OPEN-QUESTIONS.md`: open items only, resolved ones
move out.

Then give me a short report: what got done, what you fixed, what the checks now say, and
what is waiting on me.
