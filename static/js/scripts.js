(function () {
    'use strict';

    // Mobile navigation (hamburger menu)
    var mobileToggle = document.querySelector('.nav-mobile-toggle');
    var navLinksEl = document.getElementById('nav-links');

    function closeMobileMenu() {
        if (!navLinksEl || !mobileToggle) return;
        navLinksEl.classList.remove('nav--open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.setAttribute('aria-label', 'Open navigation menu');
    }

    if (mobileToggle && navLinksEl) {
        mobileToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            var isOpen = navLinksEl.classList.toggle('nav--open');
            mobileToggle.setAttribute('aria-expanded', String(isOpen));
            mobileToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
        });

        navLinksEl.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', closeMobileMenu);
        });

        document.addEventListener('click', function (e) {
            if (!e.target.closest('.nav')) closeMobileMenu();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                closeMobileMenu();
                mobileToggle.focus();
            }
        });
    }

    // Smooth scroll for in-page anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            var targetSection = targetId.length > 1 ? document.querySelector(targetId) : null;
            if (!targetSection) return;
            e.preventDefault();
            var nav = document.querySelector('.nav');
            var navHeight = nav ? nav.offsetHeight : 0;
            window.scrollTo({ top: targetSection.offsetTop - navHeight, behavior: 'smooth' });
        });
    });

    // Fade-in sections marked with [data-observe] as they enter the viewport
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var observeTargets = document.querySelectorAll('[data-observe]');

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        observeTargets.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });

        observeTargets.forEach(function (el) { observer.observe(el); });
    }

    // Contact form — front-end only. Swap this handler for a real POST to
    // your backend or form service (Formspree, Netlify Forms, etc.) when
    // this template is used for a real site.
    var contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        var status = contactForm.querySelector('.form-status');
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            if (status) {
                status.textContent = 'This form isn’t connected to anything yet — wire it up to your backend or a form service.';
                status.setAttribute('data-state', 'sent');
            }
        });
    }
})();
