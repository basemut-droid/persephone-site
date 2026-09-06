# Screenshots — 2026-09-07 night run

Full-page captures at 1920px width (headless Edge), taken from a production build
(`npm run build && npm run preview`) at the end of this run. No login, no dev server
needed — just open the PNGs.

390px mobile screenshots are not included: this environment's headless browser
reliably mis-renders narrow viewports (content lays out as if wider, then gets
cropped — reproduced again on this run's own pages, same as documented earlier in
this project's history). Mobile rendering is still unverified — see `HANDOFF.md`.

## What changed on each page this run

- **home.png** — unchanged in this run's phases (no homepage-specific fixes were
  in scope), included for the container/rhythm/button comparisons in Phase 5.
- **ueber-uns.png** (compare with **ueber-uns-before.png**) — the two closing
  teasers are now the real design: a black-and-white placeholder photo (clearly
  labelled "Foto folgt," not a real image yet) with a cream text card overlapping
  it, the two staggered vertically. Heading weight is now 400 (was 900). Typo
  "linguistiche" → "linguistische." Absolute newsletter link now relative.
- **angebote.png** (compare with **angebote-before.png**) — the ten self-recognition
  statements and the "Fang einfach dort an..." list now render; "Das könnte jetzt
  passen" appears as an eyebrow above the next-step block.
- **beratung.png** (compare with **beratung-before.png**) — "Was ist Beratung?" and
  "Formate" headings now render (previously invisible, only their content showed).
- **workshops.png** (compare with **workshops-before.png**) — "Was ist
  Psychoedukation?" heading now renders; the "Workhops" typo in the h1 is corrected
  to "Workshops"; two location-tag lines ("WIEN, GRAZ, ONLINE" / "ONLINE") now
  render as captions under their lists; absolute newsletter link now relative.
- **termine.png** (compare with **termine-before.png**) — explanatory copy now sits
  above the booking widget; the Microsoft Bookings calendar loads only after
  clicking "Kalender laden," with a permanent fallback link and a pointer to the
  contact form.
- **kontakt.png** — "Erreichbarkeit" and "Standorte" headings now render; a short
  pointer to Termine sits at the bottom of the contact info column.
- **selbsthilfegruppe.png** — the near-duplicate intro sentence is gone (variant A
  only); "Nächtes SHG-Treffen" typo corrected to "Nächstes."
  Nav dropdown ("Angebote") is now a real link to this page, not just a disclosure.
- **faqs.png** — "Geleggenheit"/"(ehmals)" typos corrected.
- **impressum.png** — meta description is now a clean, real sentence (not shown in
  the screenshot itself, but check the page source / browser tab).
- **blog.png**, **disclaimer.png**, **datenschutz.png**, **404.png** — unchanged in
  this run beyond the site-wide heading-weight and typo/link fixes; included for
  completeness and the Phase 5 comparison pass.
- **en-home.png**, **it-home.png** — the language switcher on every *other* page now
  correctly hides English/Italian (since only the homepage has real translations);
  these two confirm the homepage itself still works in both locales.
- **blog-posts/** — all six posts, screenshotted for completeness; no blog-post
  content changed this run beyond earlier sessions' fixes.

## Not screenshotted

`/newsletter/` is a redirect stub (instant meta-refresh to the external MailerLite
form) — nothing to screenshot. `/admin/` is the Decap CMS panel, out of scope for a
visual pass on the public site.
