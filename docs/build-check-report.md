# Build-check report

Generated 2026-09-06T21:32:24.664Z by `scripts/build-check.mjs`.

## Every content page has a route, every route has content — PASS

No violations found.

## Every built route is reachable from the nav or another page — PASS

No violations found.

## No href points at persephone.at — FAIL (non-blocking)

- /ueber-uns/: <a href="https://persephone.at/newsletter">
- /workshops/: <a href="https://persephone.at/newsletter">

## Every page has a unique, non-empty meta description — FAIL (non-blocking)

- Shared description across /angebote/, /beratung/, /blog/, /datenschutz/, /disclaimer/, /, /kontakt/, /selbsthilfegruppe/, /termine/, /ueber-uns/, /workshops/: "Persephone begleitet Dich und Deine:n Partner:in psychosozial durch die Kinderwu…"

## Every <img> has a non-empty alt — FAIL (non-blocking)

- /angebote/: <img> with empty/missing alt — <img src="/_astro/mg-7425.Brnlt3gz_Z2vWOfl.webp" alt data-astro-cid-bfymg5jf="true" loading="lazy" d
- /angebote/: <img> with empty/missing alt — <img src="/_astro/logo-geborgenheit.RvUyFL1g_ZssohJ.webp" alt data-astro-cid-bfymg5jf="true" loading
- /beratung/: <img> with empty/missing alt — <img src="/_astro/marina-von-persephone.CJPjYs3R_9mIRg.webp" alt data-astro-cid-cx5f2ybz="true" load
- /beratung/: <img> with empty/missing alt — <img src="/_astro/logo-empathie.7B2cz3WH_19eY93.webp" alt data-astro-cid-cx5f2ybz="true" loading="la
- /kontakt/: <img> with empty/missing alt — <img src="/_astro/mg-7811.CL5SUos4_Z1jiEp4.webp" alt data-astro-cid-657w5j3a="true" loading="lazy" d
- /ueber-uns/: <img> with empty/missing alt — <img src="/_astro/marina-portrait-hero.BK8b9Mtx_Z2qjmIw.webp" alt data-astro-cid-ofnbv76t="true" loa
- /ueber-uns/: <img> with empty/missing alt — <img src="/_astro/logo-kongruenz-und-authentizitaet.C89wRWA1_GKdpO.webp" alt data-astro-cid-ofnbv76t
- /workshops/: <img> with empty/missing alt — <img src="/_astro/marina-von-persephone.CJPjYs3R_9mIRg.webp" alt data-astro-cid-djwiuoh4="true" load
- /workshops/: <img> with empty/missing alt — <img src="/_astro/logo-wissenschaft.CtFjVvFd_1f3bEK.webp" alt data-astro-cid-djwiuoh4="true" loading

## Every locale link the language switcher renders resolves to a built page — PASS

No violations found.

## astro.config.mjs "site" is not a placeholder — FAIL (non-blocking)

- astro.config.mjs "site" is "https://persephone.example" — a placeholder, not a real production domain

## Every heading in a source content file appears in its built page — PASS

No violations found.
