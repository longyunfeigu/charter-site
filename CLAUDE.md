# CLAUDE.md — Charter marketing site

Static marketing site for Charter (https://github.com/longyunfeigu/bullpen). No build step, no framework, no backend — plain HTML/CSS/JS, deployable to Cloudflare Pages as-is.

## Brand rules (non-negotiable)

- The product name is **Charter**. Tagline: "Observable agent work, from prompt to proof."
- Never mention "Pi" or internal engine/package names (agent-runtime-pi, Tool Gateway internals, milestone codes like M1–M12) in user-facing copy. Describe capabilities, not internals.
- External agent products (Claude Code, Codex) may be named — they are supported backends.
- Never overstate product status: Charter is a **development preview**. No installers exist yet; "build from source" is the only supported install path. No fake download buttons, no invented metrics, no fabricated testimonials or logos.
- Every capability claim on the site must be true of the current product (see the product repo's README.md and docs/IMPLEMENTATION_STATUS.md).

## Structure

- `index.html` — the entire page
- `styles.css` — all styles; design tokens as CSS variables at the top
- `script.js` — progressive enhancement only (page must read fine with JS disabled)
- `assets/` — product screenshots (regenerate via `CHARTER_README_SHOTS=1` Playwright spec in the product repo), favicons, og-image

## Workflow

- UI changes: screenshot at 1440px and 390px widths and review before calling anything done.
- Keep the page a single self-contained deploy artifact; no external JS dependencies. Web fonts and the GitHub REST API (release/star lookup with graceful fallback) are the only permitted external calls.
