# Michael Waiguru — Portfolio (Kinetic Swiss)

Pure-typography portfolio in the Swiss International style: paper-white ground,
near-black ink, one Swiss red. No images — the design is carried entirely by a
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

## Run locally

Any static server, e.g.:

```sh
python3 -m http.server 8000
# → http://localhost:8000
```

## Deploy (all free)

- **Cloudflare Pages** — dashboard → Workers & Pages → Create → Pages →
  *Upload assets* (drag this folder), or connect the Git repo. Free custom domains + fast edge.
- **GitHub Pages** — push to GitHub → Settings → Pages → deploy from `main` branch root.
- **Netlify** — drag the folder onto https://app.netlify.com/drop
- **Vercel** — `npx vercel` in this folder.

No build command; output directory is the repo root.

## Customize

- Colors/themes: token blocks at the top of `css/style.css`
  (`:root` = light, the guarded blocks = dark).
- Content: all copy lives in `index.html` — projects, testimonial, email.
- Fonts are subsetted latin woff2 from Google Fonts (OFL-licensed).
