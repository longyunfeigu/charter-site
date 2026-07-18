# Publishing the Charter site

Two steps: push this directory to a public GitHub repo, then connect that repo to Cloudflare Pages. Total ~5 minutes. Nothing here requires a backend or a paid plan.

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
3. Build settings — leave everything empty (no framework preset, no build command, output directory `/`). It is a plain static site.
4. Deploy. You get `https://<project>.pages.dev`; pick a project name like `charter` or `getcharter` (this becomes the subdomain).
5. Once you know the final URL, update `index.html`: the `rel="canonical"` link and the `og:url` / `og:image` metas currently assume `https://charter.pages.dev/`.

Every later `git push` to `main` deploys production automatically; pushes to other branches create preview URLs.

> Cloudflare also offers Workers static assets as the newer hosting path. Pages remains fully supported and is the simpler fit for this repo; switching later is trivial (same free static hosting either way).

## 3. Point GitHub at the site

From the product repo (`bullpen`):

```bash
gh repo edit longyunfeigu/bullpen --homepage "https://<project>.pages.dev"
```

Then add the link at the top of the product README (e.g. under the tagline or in the badge row).

## 4. (Optional, later) Custom domain

1. Buy a domain — Cloudflare Registrar sells at cost (~$10/yr).
2. Pages project → **Custom domains** → add it; DNS + TLS are automatic when the domain is on Cloudflare.
3. Update the GitHub homepage link and the `og:url` / canonical tags in `index.html`.

A custom domain on Cloudflare is also the reliable option for mainland-China reachability; the default `pages.dev` (like `github.io`) is not dependable there.

## When releases exist (post-M12)

The download section is wired to the GitHub Releases API with a graceful fallback: while there are no releases it shows the build-from-source path. Once the first release with installers is published, re-check the section renders the download buttons correctly, then consider adding platform-specific links in the hero.
