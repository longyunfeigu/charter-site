# Charter marketing site

The public landing page for [Charter](https://github.com/longyunfeigu/bullpen) — a local-first desktop IDE for delegating real repository work to coding agents without giving up visibility or control.

Plain HTML/CSS/JS. No build step, no framework, no backend. The deploy artifact is this directory as-is.

## Local preview

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

(Any static file server works. Opening `index.html` directly also works, but the GitHub API version lookup needs http(s) in some browsers.)

## Layout

| Path | Purpose |
| --- | --- |
| `index.html` | The entire page |
| `styles.css` | All styles; design tokens as CSS variables at the top |
| `script.js` | Progressive enhancement: OS detection for the quick-start hint, GitHub stars/release lookup with graceful fallback, scroll reveals |
| `assets/` | Product screenshots, favicon, social card |
| `DEPLOY.md` | How to publish (GitHub repo + Cloudflare Pages) |

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
