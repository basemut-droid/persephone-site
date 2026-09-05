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
