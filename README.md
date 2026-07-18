# Charter marketing site

The public landing page for [Charter](https://github.com/longyunfeigu/bullpen) — a local-first desktop IDE for delegating real repository work to coding agents without giving up visibility or control.

Plain HTML/CSS/JS. No build step, no framework, no backend. **The deploy artifact is the `public/` directory** — repo-root files (this README, DEPLOY.md, CLAUDE.md) are development material and are not published.

## Local preview

```bash
python3 -m http.server 8080 -d public
# open http://localhost:8080
```

(Any static file server works. Opening `public/index.html` directly also works, but the GitHub API lookups need http(s) in some browsers.)

## Layout

| Path | Purpose |
| --- | --- |
| `public/index.html` | The entire page |
| `public/styles.css` | All styles; design tokens as CSS variables at the top |
| `public/script.js` | Progressive enhancement: GitHub stars/release lookup with graceful fallback, scroll reveals, CTA keyboard shortcuts |
| `public/assets/` | Product screenshots, favicon, social card |
| `DEPLOY.md` | How to publish (GitHub repo + Cloudflare Pages) |
| `CLAUDE.md` | Brand and content rules for agents working here |

Product screenshots are real application captures, reproducible from the product repo:

```bash
# in the product repo
npm run build
CHARTER_README_SHOTS=1 npx playwright test \
  --config tests/e2e/playwright.config.ts \
  tests/e2e/readme-assets.spec.ts
```

## Content rules

See [CLAUDE.md](CLAUDE.md): Charter branding only, no internal engine names, no overstated claims — the site must never promise more than the product repo's README does.

## License

MIT, same as the product.
