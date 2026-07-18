/* Charter site — progressive enhancement only. The page is complete without this file. */
(() => {
  'use strict';

  const REPO = 'longyunfeigu/bullpen';

  /* ---- scroll reveals ---- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  /* ---- keyboard shortcuts on hero CTAs (G / S) ---- */
  document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
    const t = e.target;
    if (t && (t.isContentEditable || /^(input|textarea|select)$/i.test(t.tagName))) return;
    const el = document.querySelector(`[data-key="${e.key.toLowerCase()}"]`);
    if (!el) return;
    e.preventDefault();
    if (el.getAttribute('href')?.startsWith('#')) {
      document.querySelector(el.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.open(el.href, '_blank', 'noopener');
    }
  });

  /* ---- copy button ---- */
  document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy || '');
        const prev = btn.textContent;
        btn.textContent = 'Copied';
        btn.classList.add('copied');
        setTimeout(() => { btn.textContent = prev; btn.classList.remove('copied'); }, 1600);
      } catch { /* clipboard unavailable — leave the button as-is */ }
    });
  });

  /* ---- GitHub star count (graceful: hidden unless it works) ---- */
  const starEl = document.querySelector('[data-stars]');
  if (starEl && 'fetch' in window) {
    fetch(`https://api.github.com/repos/${REPO}`, { headers: { Accept: 'application/vnd.github+json' } })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const n = data && data.stargazers_count;
        if (typeof n === 'number' && n > 0) {
          starEl.textContent = n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k` : String(n);
          starEl.hidden = false;
        }
      })
      .catch(() => { /* offline or rate-limited — keep it hidden */ });
  }

  /* ---- releases lookup: upgrade the note once installers exist ---- */
  const note = document.querySelector('[data-release-note]');
  if (note && 'fetch' in window) {
    /* releases list (not /latest) so an empty repo answers 200 [] instead of 404 */
    fetch(`https://api.github.com/repos/${REPO}/releases?per_page=1`, { headers: { Accept: 'application/vnd.github+json' } })
      .then((r) => (r.ok ? r.json() : null))
      .then((list) => {
        const rel = Array.isArray(list) ? list.find((x) => !x.draft && !x.prerelease) || list[0] : null;
        if (rel && rel.tag_name && Array.isArray(rel.assets) && rel.assets.length > 0) {
          const url = rel.html_url;
          note.innerHTML =
            `Prefer an installer? <a href="${url}" rel="noopener">Download ${rel.tag_name}</a> from GitHub Releases — or build from source above.`;
        }
      })
      .catch(() => { /* no releases yet — the build-from-source note stands */ });
  }
})();
