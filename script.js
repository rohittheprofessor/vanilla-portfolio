document.addEventListener('DOMContentLoaded', () => {
  // 1. Current year in footer
  document.querySelectorAll('.js-year').forEach(el => { el.textContent = new Date().getFullYear(); });

  // 2. Sticky navbar border
  const navbar = document.getElementById('navbar');
  const onScroll = () => { if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 20); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // 3. Mobile menu
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const setMenu = open => {
    if (!mobileMenu || !hamburger) return;
    mobileMenu.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    const icon = hamburger.querySelector('i');
    if (icon) { icon.classList.toggle('fa-bars', !open); icon.classList.toggle('fa-times', open); }
    document.body.style.overflow = open ? 'hidden' : '';
  };
  if (hamburger) hamburger.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('active')));
  document.querySelectorAll('.mobile-menu a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  // 4. Fade-in on scroll
  const fades = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('visible'); obs.unobserve(en.target); } });
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });
    fades.forEach(el => io.observe(el));
  } else { fades.forEach(el => el.classList.add('visible')); }

  // 5. Active nav item (works for /about, /about.html and about.html)
  const norm = p => {
    p = (p || '').split('?')[0].split('#')[0].replace(/\.html$/, '').replace(/\/+$/, '');
    p = p.split('/').pop();
    return p === '' || p === 'index' ? 'home' : p;
  };
  const current = document.body.dataset.page || norm(location.pathname);
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const on = norm(a.getAttribute('href')) === current;
    a.classList.toggle('active', on);
    if (on) a.setAttribute('aria-current', 'page');
  });

  // 6. Toast helper
  const toast = document.createElement('div');
  toast.className = 'toast'; toast.setAttribute('role', 'status'); document.body.appendChild(toast);
  const say = msg => { toast.textContent = msg; toast.classList.add('show'); clearTimeout(say.t); say.t = setTimeout(() => toast.classList.remove('show'), 2200); };

  // 7. Publications database: search + filters
  const pubList = document.querySelector('[data-pubs]');
  if (pubList) {
    const q = document.getElementById('pub-q'), fc = document.getElementById('pub-cat'),
          fs = document.getElementById('pub-status'), fy = document.getElementById('pub-year'),
          count = document.getElementById('pub-count'), empty = document.querySelector('.pub-empty');
    const items = [...pubList.querySelectorAll('.pub-item')];
    const groups = [...pubList.querySelectorAll('.pub-group')];
    const apply = () => {
      const term = (q.value || '').trim().toLowerCase();
      let n = 0;
      items.forEach(it => {
        const ok = (!term || it.dataset.search.includes(term)) &&
                   (fc.value === 'all' || it.dataset.cat === fc.value) &&
                   (fs.value === 'all' || it.dataset.status === fs.value) &&
                   (fy.value === 'all' || it.dataset.year === fy.value);
        it.hidden = !ok; if (ok) n++;
      });
      groups.forEach(g => { g.hidden = !g.querySelector('.pub-item:not([hidden])'); });
      count.textContent = n + (n === 1 ? ' record' : ' records') + ' shown';
      empty.style.display = n ? 'none' : 'block';
    };
    [q, fc, fs, fy].forEach(el => el.addEventListener('input', apply));
    apply();
    pubList.addEventListener('click', async e => {
      const b = e.target.closest('[data-cite]');
      if (!b) return;
      const text = b.getAttribute('data-cite');
      try { await navigator.clipboard.writeText(text); say('Citation copied'); }
      catch { const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select();
              try { document.execCommand('copy'); say('Citation copied'); } catch { say('Copy failed'); } ta.remove(); }
    });
  }

  // 8. Certificate filters
  const certWrap = document.querySelector('[data-certs]');
  if (certWrap) {
    const btns = [...document.querySelectorAll('.cert-filters button')];
    const ysel = document.getElementById('cert-year');
    const cards = [...certWrap.querySelectorAll('.cert-card')];
    const groups = [...certWrap.querySelectorAll('.cert-group')];
    let cat = 'all';
    const apply = () => {
      cards.forEach(c => {
        const ok = (cat === 'all' || c.dataset.cat === cat) && (!ysel || ysel.value === 'all' || c.dataset.year === ysel.value);
        c.classList.toggle('hidden', !ok);
      });
      groups.forEach(g => g.classList.toggle('hidden', !g.querySelector('.cert-card:not(.hidden)')));
    };
    btns.forEach(b => b.addEventListener('click', () => { btns.forEach(x => x.classList.remove('on')); b.classList.add('on'); cat = b.dataset.cat; apply(); }));
    if (ysel) ysel.addEventListener('change', apply);
  }

  // 9. Open the <details> a link points to
  document.querySelectorAll('[data-open]').forEach(a => a.addEventListener('click', () => {
    const d = document.getElementById(a.dataset.open); if (d) d.open = true;
  }));

  // 10. Image modal (certificates & achievements)
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImg');
  if (modal && modalImg) {
    const close = () => { modal.style.display = 'none'; modalImg.removeAttribute('src'); };
    document.addEventListener('click', e => {
      const img = e.target.closest('.achievement-img, [data-zoom]');
      if (img) {
        const src = img.dataset.full || img.dataset.zoom || img.src;
        modalImg.src = src; modalImg.alt = img.alt || '';
        modal.style.display = 'block';
        return;
      }
      if (e.target === modal || e.target.closest('.close-modal')) close();
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  // 11. Contact form (Netlify Forms; works once deployed on Netlify)
  const form = document.querySelector('form[name="contact"]');
  if (form) {
    const status = form.querySelector('.form-status');
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const data = new URLSearchParams(new FormData(form)).toString();
      status.textContent = 'Sending…';
      try {
        const r = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: data });
        if (!r.ok) throw new Error(r.status);
        form.reset();
        status.textContent = 'Thank you — your message has been sent.';
      } catch (err) {
        status.textContent = 'The message could not be sent from this preview. Please email directly using the address shown.';
      }
    });
  }
});
