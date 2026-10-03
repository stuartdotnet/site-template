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

    // Contact form: posts JSON to the endpoint in hugo.toml's
    // [params.contact]. The payload is documented in the README.
    var contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        var status = contactForm.querySelector('.form-status');
        var submitBtn = contactForm.querySelector('button[type="submit"]');
        var endpoint = contactForm.getAttribute('data-contact-endpoint');
        var siteId = contactForm.getAttribute('data-contact-site-id');

        function setStatus(text, state) {
            if (!status) return;
            status.textContent = text;
            status.setAttribute('data-state', state);
        }

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            if (!endpoint || !siteId) {
                setStatus('This form isn’t wired up yet — set [params.contact] in hugo.toml.', 'error');
                return;
            }

            var honeypot = contactForm.querySelector('input[name="company"]');
            var tokenField = contactForm.querySelector('[name="cf-turnstile-response"]');

            var payload = {
                site: siteId,
                name: contactForm.querySelector('#name').value,
                email: contactForm.querySelector('#email').value,
                message: contactForm.querySelector('#message').value,
                hp: honeypot ? honeypot.value : '',
                token: tokenField ? tokenField.value : ''
            };

            if (submitBtn) submitBtn.disabled = true;
            setStatus('Sending…', 'sending');

            fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
                .then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); })
                .then(function (result) {
                    if (result.ok && result.data.ok) {
                        contactForm.reset();
                        if (window.turnstile) window.turnstile.reset();
                        setStatus('Message sent — thanks, we’ll be in touch.', 'sent');
                    } else {
                        setStatus('Something went wrong sending that — please try again or email us directly.', 'error');
                    }
                })
                .catch(function () {
                    setStatus('Something went wrong sending that — please try again or email us directly.', 'error');
                })
                .finally(function () {
                    if (submitBtn) submitBtn.disabled = false;
                });
        });
    }

    // Photography gallery lightbox
    var galleryThumbs = Array.prototype.slice.call(document.querySelectorAll('.gallery-thumb'));
    var lightboxEl = document.getElementById('lightbox');

    if (galleryThumbs.length && lightboxEl) {
        var lightboxImg = lightboxEl.querySelector('.lightbox-img');
        var lightboxCaption = lightboxEl.querySelector('.lightbox-caption');
        var lightboxCount = lightboxEl.querySelector('.lightbox-count');
        var lightboxClose = lightboxEl.querySelector('.lightbox-close');
        var lightboxPrev = lightboxEl.querySelector('.lightbox-prev');
        var lightboxNext = lightboxEl.querySelector('.lightbox-next');
        var currentIndex = 0;
        var lastTrigger = null;

        function showPhoto(index) {
            currentIndex = (index + galleryThumbs.length) % galleryThumbs.length;
            var thumb = galleryThumbs[currentIndex];
            lightboxImg.src = thumb.getAttribute('data-full');
            lightboxImg.alt = thumb.getAttribute('data-alt') || '';
            lightboxImg.width = thumb.getAttribute('data-w');
            lightboxImg.height = thumb.getAttribute('data-h');
            lightboxCaption.textContent = thumb.getAttribute('data-caption') || '';
            lightboxCount.textContent = (currentIndex + 1) + ' / ' + galleryThumbs.length;
        }

        function closeLightbox() {
            lightboxEl.close();
        }

        galleryThumbs.forEach(function (thumb, index) {
            thumb.addEventListener('click', function () {
                lastTrigger = thumb;
                showPhoto(index);
                lightboxEl.showModal();
            });
        });

        lightboxClose.addEventListener('click', closeLightbox);
        lightboxPrev.addEventListener('click', function () { showPhoto(currentIndex - 1); });
        lightboxNext.addEventListener('click', function () { showPhoto(currentIndex + 1); });

        // Clicking the dialog itself (not its children) means the backdrop area was hit.
        lightboxEl.addEventListener('click', function (e) {
            if (e.target === lightboxEl) closeLightbox();
        });

        lightboxEl.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowLeft') showPhoto(currentIndex - 1);
            else if (e.key === 'ArrowRight') showPhoto(currentIndex + 1);
        });

        lightboxEl.addEventListener('close', function () {
            lightboxImg.src = '';
            if (lastTrigger) lastTrigger.focus();
        });
    }
})();
