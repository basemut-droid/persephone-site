## Stack

Astro 7 (content collections for `blog`/`events`/`site`), DM Sans self-hosted via
`@fontsource`, i18n across `de` (default, unprefixed)/`en`/`it`, Decap CMS stubbed in
`public/admin/`.

- Dev server: `npm run dev` (serves `localhost:4321`)
- Build: `npm run build` (outputs to `./dist/`)

All pages use tokens from [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md) (implemented as CSS custom
properties in `src/styles/global.css`) and the existing components in `src/components/`.
Never write one-off CSS for a page.

Site content is German. Never rewrite, shorten, or translate source copy — extract it
verbatim from the live site.

**Shared layout classes (`.section`, `.container`, `.button`, etc.) must be defined in
`global.css`, never inside a single component's `<style>` block.** Astro scopes every
`.astro` file's `<style>` block to that component alone (via a `data-astro-cid-*`
attribute it adds automatically). A class defined that way looks global — nothing warns
you — but it silently matches only elements written in that one file. This already
happened once: `.section`'s padding lived inside `HomePage.astro` for a while, so every
other page and component using `class="section"` got zero padding from it, with no error.
See DESIGN-SYSTEM.md's warning near the top for the full story.

## Reuse before you build

When a live persephone.at page uses a layout the homepage (or any other already-built
page) already has, reuse that existing component or class — don't build a second
version of the same shape. This is what went wrong building the first cut of Über
uns: it got a new two-column photo+text section and a new "PageHero" banner-style
masthead, when the live page's masthead is actually the same split-hero (text left,
full-bleed image right) the homepage already has, just with different copy.

Before building any section, check whether the homepage or an existing component
already covers that shape. If it does, use it — extracting the shared pieces into
`global.css` (or a shared component) first if the existing version is still trapped
in another page's scoped `<style>` block. Only build something new when the live
design genuinely has a shape nothing in the system covers, and say so explicitly in
the commit message when that's what you're doing, so it's a decision on the record,
not something to notice later.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
