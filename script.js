document.addEventListener('DOMContentLoaded', () => {

  // 1. Set current year in footer
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 2. Sticky Navbar Logic
  const navbar = document.getElementById('navbar');

  function handleNavbar() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbar);
  handleNavbar(); // run once on load

  // 3. Mobile Menu Toggle
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');

      const icon = hamburger.querySelector('i');
      if (mobileMenu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
        icon.style.color = 'var(--color-navy)';
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
        icon.style.color = '';
      }
    });
  }

  // 4. Close mobile menu on link click
  document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');

      const icon = hamburger?.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
        icon.style.color = '';
      }
    });
  });

  // 5. Contact Form Prevention
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Message processed. (This is a static UI placeholder for the form.)');
      form.reset();
    });
  }

  // 6. Fade-In Animation (Intersection Observer)
  const fadeElements = document.querySelectorAll('.fade-in');

  if (fadeElements.length > 0) {
    const fadeObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

    fadeElements.forEach(el => fadeObserver.observe(el));
  }

  // 7. Active Navbar Highlight (FINAL FIXED VERSION)
  const navItems = document.querySelectorAll('.nav-links a, .mobile-menu a');

  let currentPath = window.location.pathname.split('/').pop();

  // Fix for homepage
  if (currentPath === "" || currentPath === "/") {
    currentPath = "index.html";
  }

  navItems.forEach(link => {
    link.classList.remove('active');

    let linkPath = link.getAttribute('href');

    // Normalize path
    if (linkPath === "" || linkPath === "/") {
      linkPath = "index.html";
    }

    if (linkPath === currentPath) {
      link.classList.add('active');
    }
  });

});
// IMAGE CLICK MODAL
const images = document.querySelectorAll('.achievement-img');
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImg');
const closeModal = document.querySelector('.close-modal');

if (modal && modalImg && closeModal) {
  images.forEach(img => {
    img.addEventListener('click', () => {
      modal.style.display = 'block';
      modalImg.src = img.src;
    });
  });

  closeModal.onclick = () => {
    modal.style.display = 'none';
  };

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
}