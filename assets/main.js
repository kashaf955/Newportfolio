// mobile menu toggle
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
if (navToggle && mobileMenu) {
  navToggle.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }));
}

// scroll reveal
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in-view'));
}

// copy email
const copyBtn = document.getElementById('copyEmail');
if (copyBtn) {
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('kashaftariq496@gmail.com');
      const original = copyBtn.textContent;
      copyBtn.textContent = 'copied';
      setTimeout(() => { copyBtn.textContent = original; }, 1500);
    } catch (e) { /* clipboard unavailable */ }
  });
}

// footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// smooth (lerp) wheel scrolling — desktop only, respects reduced-motion
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  if (reduceMotion || !isFinePointer) return;

  // hand scrolling off to the rAF loop below — native CSS smooth-scroll would
  // otherwise re-animate every scrollTo() call this script makes, doubling up
  // and making things feel sluggish instead of smooth.
  document.documentElement.style.scrollBehavior = 'auto';

  let current = window.scrollY;
  let target = window.scrollY;
  let ticking = false;
  const ease = 0.25;

  function maxScroll() {
    return document.documentElement.scrollHeight - window.innerHeight;
  }

  function raf() {
    current += (target - current) * ease;
    if (Math.abs(target - current) < 0.5) {
      current = target;
      window.scrollTo(0, current);
      ticking = false;
      return;
    }
    window.scrollTo(0, current);
    requestAnimationFrame(raf);
  }

  function startLoop() {
    if (!ticking) { ticking = true; requestAnimationFrame(raf); }
  }

  window.addEventListener('wheel', (e) => {
    target = Math.max(0, Math.min(target + e.deltaY * 1.35, maxScroll()));
    e.preventDefault();
    startLoop();
  }, { passive: false });

  // route anchor-link jumps (nav links, "back to home #section") through the
  // same smooth loop instead of letting the browser jump instantly
  document.querySelectorAll('a[href*="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const url = new URL(link.href, window.location.href);
      if (url.pathname !== window.location.pathname || !url.hash) return;
      const dest = document.getElementById(url.hash.slice(1));
      if (!dest) return;
      e.preventDefault();
      const navOffset = 68;
      target = Math.max(0, Math.min(dest.getBoundingClientRect().top + window.scrollY - navOffset, maxScroll()));
      history.pushState(null, '', url.hash);
      startLoop();
    });
  });

  window.addEventListener('scroll', () => {
    if (!ticking) { target = window.scrollY; current = window.scrollY; }
  }, { passive: true });
})();

// fancy custom cursor — desktop only, respects reduced-motion
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  if (reduceMotion || !isFinePointer) return;

  document.body.classList.add('has-fancy-cursor');

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    dot.classList.add('is-visible');
    ring.classList.add('is-visible');
  });

  window.addEventListener('mouseleave', () => {
    dot.classList.remove('is-visible');
    ring.classList.remove('is-visible');
  });

  function ringLoop() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(ringLoop);
  }
  requestAnimationFrame(ringLoop);

  const interactiveSelector = 'a, button, input, textarea, .btn, .work-card, .testimonial-card, .impact-card, .detail-card, .stack-chip, .social-badge, .nav-toggle';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelector)) {
      ring.classList.add('is-active');
      dot.classList.add('is-active');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelector)) {
      ring.classList.remove('is-active');
      dot.classList.remove('is-active');
    }
  });
})();
