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
