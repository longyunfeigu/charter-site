# CLAUDE.md — Charter marketing site

Static marketing site for Charter (https://github.com/longyunfeigu/bullpen). No build step, no framework, no backend — plain HTML/CSS/JS.

**Only `public/` is deployed.** Everything at the repo root (this file, README.md, DEPLOY.md) is development material and must never be published — that separation exists so internal notes can't leak onto the public site. Never move site serving back to the repo root.

## Brand rules (non-negotiable)

- The product name is **Charter**. Tagline: "Observable agent work, from prompt to proof."
- Never mention the internal engine name, internal package names/scopes, internal environment-variable prefixes, or internal milestone codes in anything under `public/`. The authoritative deny list lives in the product repo — see its `CLAUDE.md` and `docs/adr/` (the shell-branding ADR). When in doubt: describe capabilities, never internals.
- External agent products (Claude Code, Codex) may be named — they are supported backends.
- Never overstate product status: Charter is a **development preview**. No installers exist yet; "build from source" is the only supported install path. No fake download buttons, no invented metrics, no fabricated testimonials or logos.
- Every capability claim on the site must be true of the current product (see the product repo's README.md and docs/IMPLEMENTATION_STATUS.md).

## Structure

- `public/` — the deploy artifact, and nothing else
  - `index.html` — the entire page
  - `styles.css` — all styles; design tokens as CSS variables at the top
  - `script.js` — progressive enhancement only (page must read fine with JS disabled)
  - `assets/` — product screenshots (regenerate via the README-assets Playwright spec in the product repo), favicon, og-image
- `README.md`, `DEPLOY.md`, `CLAUDE.md` — development material, repo root, never deployed

## Workflow

- UI changes: screenshot at 1440px and 390px widths and review before calling anything done.
- Keep `public/` a self-contained deploy artifact; no external JS dependencies. Web fonts and the GitHub REST API (release/star lookup with graceful fallback) are the only permitted external calls.
