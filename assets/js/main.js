/* ============================================================
   TechSites A.I. — Landing Page JS
   ============================================================ */

(function () {
  'use strict';

  /* ─── Smooth Scroll ─── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        // close mobile nav
        const mobileNav = document.getElementById('mobile-nav');
        if (mobileNav) mobileNav.classList.remove('open');
      }
    });
  });

  /* ─── Nav: scroll shadow + hamburger ─── */
  const nav = document.querySelector('.nav');
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('nav--scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
    });
  }

  /* ─── FAQ Accordion ─── */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      // close all
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));

      // open current if it was closed
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ─── Intersection Observer — scroll animations ─── */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

  /* ─── Lead Form ─── */
  const form = document.getElementById('lead-form');
  const successState = document.getElementById('success-state');

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const formData = new FormData(this);
      const data = Object.fromEntries(formData);

      // Honeypot check — if filled, it's a bot
      if (data.website_url && data.website_url.trim() !== '') return;

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>Sending...</span>';
      submitBtn.disabled = true;

      try {
        const response = await fetch('https://hub-techsites-api.onrender.com/api/public/lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, source: 'landing_page' }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          form.style.display = 'none';
          if (successState) successState.style.display = 'block';
        } else {
          throw new Error(result.error || 'Server error');
        }
      } catch (err) {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        const msg = err && err.message ? err.message : 'Unknown error';
        alert('Something went wrong: ' + msg + '\nPlease email us at techsites.ai@gmail.com');
      }
    });
  }

  /* ─── Animate hero immediately ─── */
  document.querySelectorAll('.hero .animate-on-scroll').forEach((el, i) => {
    setTimeout(() => el.classList.add('animate-in'), 100 + i * 120);
  });

})();
