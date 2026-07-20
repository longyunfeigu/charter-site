# Publishing the Charter site

Two steps: push this repo to GitHub, then connect it to Cloudflare Pages with `public` as the output directory. Total ~5 minutes. Nothing here requires a backend or a paid plan.

**Only `public/` gets served.** Repo-root files (README.md, DEPLOY.md, CLAUDE.md) are development material and stay out of the deployment — don't change the output directory to `/`.

## 1. Create the GitHub repo and push

From this directory:

```bash
gh repo create charter-site --public --source . --push \
  --description "Landing page for Charter — observable agent work, from prompt to proof."
```

(Or create an empty repo in the GitHub UI and `git remote add origin … && git push -u origin main`.)

## 2. Connect Cloudflare Pages

1. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
2. Pick the `charter-site` repo.
3. Build settings: no framework preset, **build command empty**, **build output directory: `public`**.
4. Deploy. You get `https://<project>.pages.dev`; pick a project name like `charter` or `getcharter` (this becomes the subdomain).
5. Once you know the final URL, update `public/index.html`: the `rel="canonical"` link and the `og:url` / `og:image` metas currently assume `https://charter.pages.dev/`.
6. Sanity check after the first deploy: `https://<project>.pages.dev/CLAUDE.md` should be **404** (dev files not published), the homepage should be 200.

Every later `git push` to `main` deploys production automatically; pushes to other branches create preview URLs.

> Cloudflare also offers Workers static assets as the newer hosting path. Pages remains fully supported and is the simpler fit for this repo; switching later is trivial (same free static hosting either way).

## 3. Point GitHub at the site

From the product repo (`Charter`):

```bash
gh repo edit longyunfeigu/Charter --homepage "https://<project>.pages.dev"
```

Then add the link at the top of the product README (e.g. under the tagline or in the badge row).

## 4. (Optional, later) Custom domain

1. Buy a domain — Cloudflare Registrar sells at cost (~$10/yr).
2. Pages project → **Custom domains** → add it; DNS + TLS are automatic when the domain is on Cloudflare.
3. Update the GitHub homepage link and the canonical/og tags again.

A custom domain on Cloudflare is also the reliable option for mainland-China reachability; the default `pages.dev` (like `github.io`) is not dependable there.

## When installers ship

The get-started section is wired to the GitHub Releases API with a graceful fallback: while there are no releases it shows the build-from-source path. Once the first release with attached installers is published, re-check that the section renders the download link correctly, then consider adding platform-specific links in the hero.
