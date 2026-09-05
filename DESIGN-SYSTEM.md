# Persephone — Design System

Derived exclusively from the code that implements the front page (`src/pages/index.astro`,
`src/components/HomePage.astro` and everything it imports, `src/styles/global.css`) as it
exists today. Nothing here is invented or improved — where the code is inconsistent or
has dead/unused tokens, that is called out explicitly instead of being smoothed over.

Tokens are centralized as CSS custom properties in `src/styles/global.css`, cross-checked
by the file's own comments against `docs/brand/Brandbook.pdf`. Components consume them via
`var(--token-name)`. **New pages must use these tokens and the existing components in
`src/components/` — never hardcode a new color, size, or spacing value.**

> ⚠️ **Fixed bug, worth knowing about:** `.section`/`.section-alt`/`.section-centered`/
> `.section-narrow`/`.section-heading` — the shared section-rhythm classes documented
> below — used to live inside `HomePage.astro`'s own `<style>` block instead of here.
> Astro scopes every component's `<style>` block to that component alone (via a
> `data-astro-cid-*` attribute), so those rules silently matched **only** elements
> written directly in `HomePage.astro` itself. Every other component and page using
> bare `class="section"` — `CtaBand`, and nearly every subpage (`ueber-uns`, `angebote`,
> `beratung`, `workshops`, `kontakt`, `blog/index`, `newsletter`, `disclaimer`, `faqs`,
> `selbsthilfegruppe`, `termine`) — got **zero** padding from it, not an override, just a
> rule that never matched. Found via the newsletter band rendering with ~5px of padding
> instead of the intended ~80px. Fixed by moving those five rules into this file, where
> a plain CSS class actually is global. **The lesson: a class name meant to be a shared
> layout utility must be defined in `global.css`, never inside one component's scoped
> `<style>` block** — Astro will not tell you it silently stopped matching everywhere else.

## Colors

| Token | Value | Brand-book name | Used for |
|---|---|---|---|
| `--color-bg` | `#fbf8f5` | Basisfläche/Papier (Off-White) | page background, hero, sticky header |
| `--color-bg-alt` | `#f3ece6` | Warmes Elfenbein | alternating section background (`.section-alt`) |
| `--color-surface` | `#ffffff` | — | dropdown menus, skip-link, primary-button text |
| `--color-text` | `#181a2b` | Tinte | body text |
| `--color-text-muted` | `#32373c` | — | blog fallback notice only |
| `--color-text-on-accent` | `#f3ece6` | — | text on colored fills (service cards, CTA band) |
| `--color-sage` | `#90c8c0` | Salbei (Geborgenheit) | service-card "sage" tone, blog-teaser image placeholder bg |
| `--color-teal` | `#48b0b0` | Türkis (Empathie) | service-card "teal" tone; `--color-band-bg` (newsletter strip) |
| `--color-teal-dark` | `#309898` | Tiefes Türkis | `--color-accent` → eyebrows, hover states, focus ring, card-button text |
| `--color-terracotta` | `#b33a3b` | Granatapfelrot (primary) | `--color-accent-strong` → H1, nav links, footer border/copyright, CTA gradient start |
| `--color-terracotta-dark` | `#d83830` | Leuchtrot | CTA gradient end (`--color-cta-to`) |
| — (literal, untokenized) | `#e9dccd` | — | footer background + footer-wave SVG fill |
| — (literal, untokenized) | `#fff3cd` bg / `#664d03` text | — | `DraftNotice` banner only |

Semantic aliases layered on top of the raw palette: `--color-accent` (teal-dark),
`--color-accent-strong` (terracotta), `--color-cta-from`/`--color-cta-to` (terracotta →
terracotta-dark), `--color-band-bg` (teal).

## Typography

Single font family for everything — **DM Sans**, self-hosted via `@fontsource`. There is
no separate heading font (`--font-heading` is just an alias for `--font-body`).

| Element | Weight | Font-size | Line-height | Letter-spacing / transform |
|---|---|---|---|---|
| h1, masthead (`.heading-black`) | **900** (`--weight-heading`) | `clamp(2rem, 1.5rem + 2vw, 3rem)` — homepage hero and every subpage's `PageHero` share this one rule now | 1.2 | normal |
| h2 | 400 | `clamp(1.5rem, 1.2rem + 1.2vw, 2rem)` | 1.2 | normal |
| h3 | 400 | `clamp(1.25rem, 1.1rem + 0.6vw, 1.75rem)` | 1.2 | normal |
| body `p` | 400 | `1rem` (hero copy: `1.125rem`) | 1.6 (hero copy: 1.75) | normal |
| `.eyebrow` | 700 (`--weight-subheading`) | `0.8rem` | — | `0.08em`, uppercase |
| nav link / dropdown summary | 500 (`--weight-label`) | `1.0625rem` | — | normal |
| button (`.button-primary`) | 500, italic | `0.95rem` | — | normal, not uppercase |

**Resolved:** `.heading-black` is now a real utility class in `global.css`
(`font-weight: var(--weight-heading)`), applied to the one masthead `<h1>` per page — the
homepage hero and every subpage's `PageHero` title, which now also share the exact same
size clamp (the hero's old fixed `2.75rem` override was removed). Section h2/h3
deliberately stay at 400 — the brand book (p.7) specifies H2 at 900 too, but the client
chose to reserve the heavier weight for the one page headline only, per the client's
own original comment about ".heading-black, used once per page."

## Spacing & section rhythm

- Section vertical padding: `.section { padding-block: clamp(3rem, 5vw, 5rem) }`
- `.section-heading` bottom margin: `2.5rem`
- Gap above the footer wave divider: `6rem`
- Header vertical padding: `2rem`
- Card/grid gaps: `1.5rem` (service grid, blog grid), `2.5rem` (philosophy/founder grid)

## Container, gutters, breakpoints

- `--container-max: 1248px`, applied via `.container { max-width: var(--container-max); margin-inline: auto; }`
- Page gutters: `padding-inline: clamp(1.25rem, 4vw, 2.5rem)` on `.container`
- Breakpoints actually used in the codebase: **900px** (nav collapses to burger; hero,
  philosophy/founder, and blog grids go single→multi column), **700px** (footer grid
  collapses; quote-stack stagger changes), **600px** (blog-teaser card stacks to one column)

## Buttons

- Base `.button`: `padding: 0.65rem 1.3rem`, `border-radius: var(--radius)`, `font-weight: 500`,
  `font-size: 0.95rem`, `border: 2px solid transparent`, `min-height: 44px` (touch target),
  hover lifts `translateY(-1px)`.
- `.button-primary`: `linear-gradient(135deg, var(--color-cta-from), var(--color-cta-to))`,
  white text, `padding: 18px 32px`, `min-height: 57px`, italic. This bigger/italic
  treatment was originally a homepage-hero-only override; it's now baked into the shared
  class itself (client decision), so every primary CTA site-wide — hero, nav, `CtaBand`,
  `ContactForm`, `NewsletterForm`, the 404 page — shares one look. The nav CTA's old
  uppercase/small-caps override was removed to match.
- `.button-outline`: transparent background, `border-color: currentColor`.
- `ServiceCard`'s `.card-button` is its own inline pseudo-button (not the shared `.button`
  class) and hardcodes `border-radius: 4px` instead of the `--radius: 6px` token —
  inconsistency, flagged not fixed.

## Images & border radius

- `--radius: 6px` is the standard corner radius — cards, dropdown menus, founder photo,
  footer logo.
- Images render through `astro:assets` `<Image>`, mostly `object-fit: cover`; founder
  photo is pinned to `aspect-ratio: 3/4`. Hero image and blog-teaser images have no radius
  of their own (radius comes from an overflow-hidden parent instead).

## Are these centralized?

**Yes.** All of the above (aside from the two flagged literals/inconsistencies) lives as
CSS custom properties in `src/styles/global.css` and is consumed via `var()` in every
component's scoped `<style>` block. There is no hardcoded duplicate palette or type scale
anywhere else in the codebase that was found while reading the front page's full component
tree.

---

## Gap-closing pass (post Phase-1 review)

Fixed directly (mechanical, no design judgment involved):

- `ServiceCard`'s `.card-button` now uses `var(--radius)` instead of a hardcoded `4px`.
- The footer background is now `var(--color-footer-bg)` (`#e9dccd`) instead of a bare hex
  literal repeated in two places (the footer itself and the wave-divider SVG). **Flag:**
  this color is not one of the brand book's 8 official tones — it was picked by the earlier
  parsing session to visually match the live site. Confirm with the client whether it
  should become an official tone (e.g. a tint of Warmes Elfenbein) before more pages lean
  on it.
- **The trapped-scope `.section` bug** (see the warning near the top of this doc) — found
  when the client measured the newsletter band's padding directly from a screenshot and it
  didn't match this doc's own numbers. Root cause confirmed via `git diff HEAD` (the band's
  own component was untouched) plus a stash/unstash A-B screenshot test (pixel-identical
  before and after this session's other edits — not a regression, pre-existing since
  before this session). Fixed by moving `.section`/`.section-alt`/`.section-centered`/
  `.section-narrow`/`.section-heading` from `HomePage.astro`'s scoped style into this file.
  Verified against the live site by measuring an analogous section's padding directly from
  its own served CSS/DOM (automated screenshotting of persephone.at continues to be
  unreliable — see the H1-weight entry below for why); confirmed the fix moves the band
  from ~5px of padding to ~85px, in line with both the token and the live site's own
  spacing in the same neighborhood. Also fixed in the same change, as a direct consequence
  rather than separate work: every subpage using bare `.section` (`ueber-uns` spot-checked
  and confirmed) — they were equally affected and are now equally fixed.
- `CtaBand`'s copy measure was `max-width: 60ch` — an odd one-off unit not used anywhere
  else on the site. Changed to `56rem`, the same measure `.section-narrow` already uses for
  the homepage's other block of centered copy (pain-points) — no new value invented.
- `CtaBand`'s internal eyebrow→h2→copy→button rhythm relied entirely on bare browser
  default margins (`h2 { margin: 0 0 0.5em }`, `p { margin: 0 0 1em }`), which is why it
  read as cramped even once the outer section padding was fixed. Now uses explicit
  `--space-6`/`--space-7` (see the spacing-scale section below for what that does and does
  not mean about the rest of the site).

Investigated, decided by the client, and implemented (see conversation for the full
question/answer; summarized here for the record):

- **H1/H2 weight:** the brand book (`docs/brand/Brandbook.pdf`, p. 7 "Typografie")
  specifies **H1 at 30pt/900 (Black)** and **H2 at 20pt/900** too. Screenshots comparing
  the hero h1 at 400 vs. 900 were shown; the client chose **900 for the masthead h1 only,
  H2 stays 400**. Implemented via the new `.heading-black` utility class (see Typography
  above).
- **Hero h1 sizing:** the client chose to have the homepage hero adopt the shared clamp
  outright — its old fixed `2.75rem` override is gone, so it now sizes identically to
  every subpage's `PageHero` h1 (both scale down on mobile to `2rem`, and up to `3rem` at
  wide viewports, a ~4px increase over the old fixed size).
- **Hero CTA style:** the client confirmed the hero's bigger/italic treatment is the
  intended brand CTA and asked to promote it site-wide. It's now baked into the shared
  `.button-primary` class itself (see Buttons above), replacing both the plain style
  `CtaBand` used and the nav CTA's old uppercase/small-caps override.
- **`DraftNotice` and the blog-fallback notice are intentional, not scaffolding.**
  `DraftNotice` fires only when `site.reviewStatus === 'ai-draft'` — currently true for
  `en.json`/`it.json` per the README's own note that those translations are AI-drafted and
  unreviewed. It's designed to disappear on its own once a native speaker reviews a locale
  and its JSON flips to `'native'` — not something to delete before subpages go in. The
  blog-fallback notice (`usingFallback` in `HomePage.astro`) fires because `src/content/blog/en`
  and `.../it` currently hold only a `.gitkeep` — it explains to an EN/IT visitor why they're
  seeing German posts, and will keep being relevant until real EN/IT posts exist. Both stay.

## Component inventory

Every component in `src/components/`, what it's for, its interface, and what currently
uses it — this is the build-from-this list for Phase 3.

| Component | Purpose | Props | Used by |
|---|---|---|---|
| `Header.astro` | Sticky site header: logo, primary nav (with one dropdown), CTA button, language switcher, mobile burger | `locale`, `path`, `nav: {items, cta, ctaHref}`, `switcherLabel` | `BaseLayout` (every page) |
| `Footer.astro` | Site footer: wave divider, brand column (signet + tagline + newsletter link), link columns, copyright | `locale`, `footer: {tagline, newsletterEyebrow, newsletterCta, columns, copyright}` | `BaseLayout` (every page) |
| `LanguageSwitcher.astro` | DE/EN/IT dropdown (globe icon + `details`/`summary`) | `locale`, `path`, `label` | `Header` only |
| `PageHero.astro` | Slim intro banner for subpages: eyebrow + h1 + optional intro paragraph, on `--color-bg-alt` | `eyebrow?`, `title`, `intro?` | Every existing subpage: angebote, beratung, workshops, termine, selbsthilfegruppe, ueber-uns, kontakt, newsletter, faqs, disclaimer, blog/index |
| `HomePage.astro` | The entire homepage composition (hero, pain points, services, philosophy, founder, blog teasers, newsletter CTA) — a one-off page assembly, not a reusable building block | `locale`, `path` | `pages/index.astro`, `pages/en/index.astro`, `pages/it/index.astro` |
| `ServiceCard.astro` | Colored "tone" card for one service/offering: title, description, CTA pill, pomegranate-seed texture | `title`, `description`, `href`, `cta`, `tone: 'sage'\|'teal'\|'teal-dark'` | `HomePage` services grid; `angebote.astro` |
| `ValueTile.astro` | Small label + description list item | `title`, `description` | `HomePage` philosophy section only |
| `QuoteStack.astro` | Staggered "descending" pull-quote layout (a deliberate echo of the Persephone-descent motif — see its own code comment) | `quotes: string[]` | `HomePage` pain-points section only |
| `BlogTeaserCard.astro` | Horizontal image+text card for one blog post teaser, with an image-pending placeholder state | `href`, `title`, `category?`, `heroImage?`, `heroImageAlt?`, `readMoreLabel` | `HomePage` blog-teasers section; `blog/index.astro` |
| `CtaBand.astro` | Full-bleed colored strip: eyebrow/heading/paragraphs/button — **the** shared closing-CTA pattern, built explicitly so every page's CTA stays pixel-identical | `eyebrow?`, `heading?`, `paragraphs`, `ctaLabel`, `ctaHref` | `HomePage` (newsletter section); `angebote`, `workshops`, `beratung`, `ueber-uns` |
| `DraftNotice.astro` | Top-of-page warning banner for unreviewed AI-translated locales | `text` | `BaseLayout`, conditionally (`en`/`it` currently) |
| `ContactForm.astro` | The Kontakt page's form: name/phone/email/topic/message/consent + honeypot. Not wired to a backend yet (see its TODO); copy is inline German literals, not props — will need i18n work before EN/IT contact pages exist | — (no props) | `kontakt.astro` only |
| `NewsletterForm.astro` | Reusable inline email-signup form + honeypot. Not wired to a provider yet (see its TODO) | `emailLabel`, `submitLabel` | `newsletter.astro` (designed to also drop onto future event landing pages) |

## Header & navigation spec

- **Height:** not a fixed pixel value — driven by `2rem` block padding around a 200px-wide
  logo (~53px tall at its 400:106 intrinsic ratio) and the nav row, so it's roughly
  `~117px` at desktop widths and can vary slightly with font rendering.
- **Sticky behavior:** `position: sticky; top: 0; z-index: 50`. No scroll-triggered style
  change is implemented (no shrink, no shadow-on-scroll, no background change on scroll —
  the header always reads as the same flat `--color-bg` as the hero below it).
- **Dropdown (desktop):** built on native `<details>`/`<summary>` (no JS beyond the burger
  toggle). Menu panel: `position: absolute`, white (`--color-surface`) background,
  `box-shadow: 0 8px 24px rgba(0,0,0,.12)`, `border-radius: var(--radius)`, `min-width: 220px`,
  items padded `0.6rem 1.25rem` with `--color-bg-alt` hover. The only animation is the caret
  glyph rotating 180° over `0.15s ease` on open; the panel itself has no open/close
  transition (native `<details>` toggle is instant).
- **Burger breakpoint:** `900px`. Below it, the toggle button appears (44×44px tap target)
  and the entire `<nav>` (links + CTA + language switcher) is hidden until `.is-open` is
  toggled by a small inline `<script>`.
- **Mobile menu:** when open, the nav becomes a full-width panel (`position: absolute;
  inset-inline: 0; top: 100%`) with `--color-bg-alt` background, links stacked in a column,
  and the dropdown submenu un-floats to `position: static` (no shadow, indented
  `padding-left: 1rem`) instead of popping over the page.

## Footer spec

- **Structure:** a decorative wave divider (inline SVG, `margin-top: 6rem` above it) →
  footer proper, a 3-column grid (`2fr 1fr 1fr`: brand column wider than the two link
  columns) → a full-width copyright line below the grid.
- **Wave divider:** one hand-drawn `<path>` filled with `var(--color-footer-bg)`, `40px`
  tall, `preserveAspectRatio="none"` so it stretches full-width without distortion clamps.
- **700px collapse:** `.footer-grid` drops from `2fr 1fr 1fr` to a single column; the brand
  block, then each link column, stack vertically.
- **Link styling:** footer nav links are plain text at `opacity: 0.85`, going to
  `opacity: 1` + underline on hover — deliberately quieter than the header's nav links
  (which use a color change instead). Column titles are bold, no uppercase.
- **Brand column:** signet image (72×73, `var(--radius)` corners) → tagline (accent-colored,
  bold, with a left accent-strong border like a pull-quote) → newsletter eyebrow + an
  underlined text link (not a button) to `/newsletter/`.

## Interaction states

One shared rule set, defined once in `global.css` rather than per component:

| State | Rule | Scope |
|---|---|---|
| **Focus-visible** | `outline: 3px solid var(--color-accent); outline-offset: 2px;` | Applied globally to `a`, `button`, `input`, `textarea`, `.button` — the single focus-ring definition for the whole site |
| **Hover (buttons)** | `transform: translateY(-1px)` over `0.15s ease` | `.button` base class (primary + outline) |
| **Hover (footer/nav-dropdown links)** | Underline and/or `opacity`/color change, no transform | Footer links, nav-dropdown items, lang-switcher items — plain links deliberately don't get the button's lift |
| **Open (`<details>` dropdowns)** | Caret rotates 180°; summary text switches to `--color-accent` | Nav dropdown, language switcher |
| **Active** | **Not defined anywhere in the codebase.** No `:active` rule exists for buttons or links — a gap, not a deliberate choice. | — |
| **Disabled** | **Not defined anywhere in the codebase.** No form input, button, or link has `:disabled`/`[disabled]` styling — forms (`ContactForm`, `NewsletterForm`) don't yet handle a submitting/disabled state. | — |

Flagging active/disabled as gaps rather than filling them in, since neither was asked for
and both are design decisions (what should a disabled submit button look like?) rather than
extractions from existing code.

## Spacing scale: coherent or ad hoc?

**Ad hoc.** Collecting every spacing value actually used across the front page's component
tree shows no consistent base unit or ratio, and a mix of `rem` and raw `px` with no
apparent rule for which gets used where:

- Structural rem values in use: `0.5, 0.6, 0.65, 0.75, 1, 1.25, 1.3, 1.5, 2, 2.5, 3, 5, 6`
- Structural px values in use (all outside the rem scale above): `4, 6, 18, 22, 24, 30, 32,
  44, 48, 55, 56, 57, 60, 90, 120, 130, 140, 160, 180, 200`

`44px`/`57px` (button/touch-target min-heights) are deliberate accessibility/brand minimums,
not scale drift. `QuoteStack`'s `30/56/60/48/90/160px` offsets are an explicit hand-tuned
"descending" stagger (see its own code comment) — decorative choreography, not structural
rhythm, and shouldn't be forced onto a generic scale. Everything else (hero paragraph
margins at `24px`/`55px`/`60px`, section/grid gaps mixing `1.5rem`/`2rem`/`2.5rem`/`3rem`)
reads as values eyeballed off the live WordPress site's computed pixel measurements during
extraction, not a designed scale.

**Proposed scale — defined as real tokens in `global.css`, but NOT YET ADOPTED site-wide.**
Same situation as the `--weight-heading`/`.heading-black` token flagged earlier in this
doc: defining a token is not the same as it being the live scale. As of now, `--space-1`
through `--space-9` exist as CSS custom properties and are used in exactly one place —
`CtaBand`'s internal eyebrow→h2→copy→button rhythm (`--space-6`, `--space-7`). Every other
spacing value listed in the "ad hoc" audit above is still exactly as ad hoc as described;
nothing else on the site references these tokens yet. Don't read their existence as "the
site now has a spacing scale" — it has nine unused-almost-everywhere tokens and one
component that uses two of them.

| Token | Value | Adopted by | Would replace (nearest current use, elsewhere) |
|---|---|---|---|
| `--space-1` | `0.5rem` (8px) | *(none yet)* | field/tile internal gaps (`0.5rem`, `0.6rem`) |
| `--space-2` | `0.75rem` (12px) | *(none yet — matches `.eyebrow`'s existing default already)* | eyebrow/label margins (`0.75rem`) |
| `--space-3` | `1rem` (16px) | *(none yet)* | form field gaps (`1rem`, `1.25rem` rounds down) |
| `--space-4` | `1.5rem` (24px) | *(none yet)* | card/grid gaps (`1.5rem`); closest to the `24px` hero paragraph margin |
| `--space-5` | `2rem` (32px) | *(none yet)* | header padding, philosophy/founder gaps round up from `2.5rem`? — see note |
| `--space-6` | `2.5rem` (40px) | **`CtaBand` h2 margin-bottom** | section-heading margin, grid gaps (`2.5rem`) |
| `--space-7` | `3rem` (48px) | **`CtaBand` last-paragraph margin-bottom** | section padding-block minimum, footer padding-top |
| `--space-8` | `5rem` (80px) | *(none yet)* | section padding-block maximum |
| `--space-9` | `6rem` (96px) | *(none yet)* | footer-wave gap |

Two values genuinely don't land on this scale even loosely: the hero's `55px`
(→ nearest step `2.5rem`/40px, a visible ~15px reduction) and `60px`
(→ `3rem`/48px, a visible ~12px reduction) paragraph margins. Applying the scale there
would slightly tighten the hero's copy block — a real, visible change, which is exactly why
this proposal isn't applied there yet.
