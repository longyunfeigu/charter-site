/* Charter site — progressive enhancement only. The page is complete without this file. */
(() => {
  'use strict';

  const REPO = 'longyunfeigu/Charter';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- scroll reveals (staggered inside grids) ---- */
  document.querySelectorAll('.gate-grid, .ide-grid, .sec-grid, .faq-list').forEach((grid) => {
    [...grid.children].forEach((el, i) => el.style.setProperty('--i', String(i % 6)));
  });
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

  /* ---- hero stage carousel: one delegation, four acts ---- */
  const stage = document.querySelector('.hero-stage');
  if (stage) {
    const frames = [...stage.querySelectorAll('.stage-frame img')];
    const steps = [...stage.querySelectorAll('.stage-step')];
    const ms = Number(stage.dataset.stageMs) || 3600;
    stage.style.setProperty('--stage-ms', `${ms}ms`);
    let idx = 0;
    let timer = null;

    const show = (n) => {
      idx = (n + frames.length) % frames.length;
      frames.forEach((f, i) => f.classList.toggle('is-active', i === idx));
      steps.forEach((s, i) => {
        s.classList.toggle('is-active', i === idx);
        s.setAttribute('aria-selected', i === idx ? 'true' : 'false');
        // restart the meter animation on the active step
        if (i === idx) {
          const m = s.querySelector('.stage-meter');
          if (m) { m.style.display = 'none'; void m.offsetWidth; m.style.display = ''; }
        }
      });
    };

    const play = () => { if (!timer && !reducedMotion) timer = setInterval(() => show(idx + 1), ms); };
    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };

    steps.forEach((s, i) => s.addEventListener('click', () => { stop(); show(i); play(); }));

    if (reducedMotion) {
      show(frames.length - 1); // rest on the review act
    } else if ('IntersectionObserver' in window) {
      // only animate while the stage is on screen
      new IntersectionObserver((entries) => {
        entries[0].isIntersecting ? play() : stop();
      }, { threshold: 0.15 }).observe(stage);
      document.addEventListener('visibilitychange', () => {
        document.hidden ? stop() : play();
      });
    } else {
      play();
    }
  }

  /* ---- cursor spotlight on cards ---- */
  if (!reducedMotion && matchMedia('(pointer: fine)').matches) {
    let raf = 0;
    document.addEventListener('mousemove', (e) => {
      const card = e.target instanceof Element && e.target.closest('.spot');
      if (!card || raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    }, { passive: true });
  }

  /* ---- nav shadow after scroll ---- */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
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
