# Michael Kariuki - Portfolio (Kinetic Swiss)

![CI](https://github.com/michaelkariuki/portfolio-kinetic-swiss/actions/workflows/ci.yml/badge.svg)

Pure-typography portfolio in the Swiss International style: paper-white ground,
near-black ink, one Swiss red. No images - the design is carried entirely by a
strict hairline grid and a massive **kinetic variable-font headline** whose
letters swell in weight/width near the cursor (an autonomous weight-wave runs
on touch devices; fully static under `prefers-reduced-motion`).

## Stack

Zero-dependency static site: hand-written HTML/CSS/JS, no build step, no
framework, no external requests (fonts are self-hosted).

```
index.html        page markup
css/style.css     design tokens + all styling (light/dark themes)
js/main.js        kinetic headline, marquee, theme toggle
fonts/            Anybody (variable), Archivo, IBM Plex Mono (self-hosted woff2)
```

## Tests

The site has a Playwright suite covering content (sections, experience entry, live links), the theme toggle with persistence, and the mobile navigation rule.

```sh
npm ci
npx playwright install chromium
npm test
```

`npm run serve` starts the dependency-free static server the suite uses on port 4173. CI runs the same suite on every push and pull request.

## Run locally

Any static server, e.g.:

```sh
py -3 -m http.server 8000
# http://localhost:8000
```

## Deploy

Canonical deployment: https://michaelkariuki.waigurumichael252.workers.dev

This workspace copy includes the HTML, CSS, JavaScript and self-hosted fonts.
Run from this folder:

```sh
npx --yes wrangler@4.156.0 deploy
```

`wrangler.jsonc` targets the existing worker `michaelkariuki`. Authenticate
locally with Wrangler if needed; do not commit credentials. `.assetsignore`
excludes tooling and secrets from public assets. The chess demo link points to
https://chess-puzzles.waigurumichael252.workers.dev/. Cloudflare Workers Assets
serves this folder directly - no build step.

Alternatives:

- **Cloudflare Pages** - Workers & Pages -> Create -> Pages -> Upload assets,
  or connect the Git repo. No build command; output directory is the repo root.
- **GitHub Pages** - Settings -> Pages -> deploy from the `main` branch root.
- **Netlify** - drag the folder onto https://app.netlify.com/drop.
- **Vercel** - `npx vercel` in this folder.

## Customize

- Colors/themes: token blocks at the top of `css/style.css`.
- Content: all copy lives in `index.html`.
- Fonts are subsetted latin woff2 from Google Fonts (OFL-licensed).
