document.addEventListener('DOMContentLoaded', () => {
  // 1. Current year in footer
  const yearElement = document.getElementById('year');
  if (yearElement) yearElement.textContent = new Date().getFullYear();

  // 2. Sticky navbar
  const navbar = document.getElementById('navbar');
  function handleNavbar() {
    if (!navbar) return;
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
  window.addEventListener('scroll', handleNavbar);
  handleNavbar();

  // 3. Mobile menu toggle
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  function setIcon(open) {
    const icon = hamburger && hamburger.querySelector('i');
    if (!icon) return;
    icon.classList.toggle('fa-bars', !open);
    icon.classList.toggle('fa-times', open);
    icon.style.color = open ? 'var(--ink)' : '';
  }
  if (hamburger && mobileMenu) {
    const toggle = () => {
      mobileMenu.classList.toggle('active');
      setIcon(mobileMenu.classList.contains('active'));
    };
    hamburger.addEventListener('click', toggle);
    hamburger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  }

  // 4. Close mobile menu on link click
  document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenu) mobileMenu.classList.remove('active');
      setIcon(false);
    });
  });

  // 5. Contact form (no backend yet)
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for your message! I will get back to you soon.');
      form.reset();
    });
  }

  // 6. Fade-in on scroll
  const fadeElements = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -50px 0px' });
    fadeElements.forEach(el => fadeObserver.observe(el));
  } else {
    fadeElements.forEach(el => el.classList.add('visible'));
  }

  // 7. Active navbar highlight (works with /about and /about.html)
  const norm = p => {
    p = (p || '').split('?')[0].split('#')[0].replace(/\.html$/, '').replace(/\/+$/, '');
    p = p.split('/').pop();
    return p === '' || p === 'index' ? 'home' : p;
  };
  const current = norm(window.location.pathname);
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    link.classList.toggle('active', norm(link.getAttribute('href')) === current);
  });

  // 8. Publication filter
  const filterBtns = document.querySelectorAll('.pub-filter button');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('on'));
      btn.classList.add('on');
      const f = btn.dataset.filter;
      document.querySelectorAll('[data-type]').forEach(el => {
        el.classList.toggle('hidden', f !== 'all' && el.dataset.type !== f);
      });
    });
  });

  // 9. Image click modal (achievements)
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImg');
  const closeModal = document.querySelector('.close-modal');
  if (modal && modalImg && closeModal) {
    document.querySelectorAll('.achievement-img').forEach(img => {
      img.addEventListener('click', () => {
        modal.style.display = 'block';
        modalImg.src = img.src;
      });
    });
    closeModal.onclick = () => { modal.style.display = 'none'; };
    window.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });
  }
});
