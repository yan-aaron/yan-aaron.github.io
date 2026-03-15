/* =============================================================
   main.js — Personal Website JavaScript
   Features:
     1. Scroll-reveal animations (IntersectionObserver)
     2. Contact form validation + simulated submission
     3. Dark / light mode toggle (persisted in localStorage)
   ============================================================= */

// ─── 1. SCROLL REVEAL ────────────────────────────────────────
(function initScrollReveal() {
  // Add .reveal to every section body and card so they animate in
  const targets = document.querySelectorAll(
    '.section-body, .project-card, .page-hero, .hobby-list li, .hero-text'
  );

  targets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // fire once
        }
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach(el => observer.observe(el));
})();


// ─── 2. CONTACT FORM VALIDATION ──────────────────────────────
(function initContactForm() {
  const form     = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');

  if (!form) return; // only runs on pages that have the form

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();

    // Clear previous feedback
    feedback.textContent = '';
    feedback.className   = 'form-feedback';

    // --- Basic validation ---
    if (!name) {
      showFeedback('Please enter your name.', 'error');
      form.name.focus();
      return;
    }
    if (!isValidEmail(email)) {
      showFeedback('Please enter a valid email address.', 'error');
      form.email.focus();
      return;
    }
    if (!message) {
      showFeedback('Your message can\'t be empty!', 'error');
      form.message.focus();
      return;
    }

    // --- Simulate submission (no real server needed) ---
    const submitBtn = form.querySelector('.btn-submit');
    submitBtn.disabled    = true;
    submitBtn.textContent = 'Sending…';

    setTimeout(() => {
      form.reset();
      submitBtn.disabled    = false;
      submitBtn.textContent = 'Send Message →';
      showFeedback('✓ Message sent! I\'ll get back to you soon.', 'success');
    }, 1200);
  });

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showFeedback(message, type) {
    feedback.textContent = message;
    feedback.classList.add(type);
  }
})();


// ─── 3. DARK / LIGHT MODE TOGGLE ─────────────────────────────
(function initDarkMode() {
  // Inject toggle button into the nav
  const nav = document.querySelector('nav');
  if (!nav) return;

  const btn = document.createElement('button');
  btn.id          = 'themeToggle';
  btn.setAttribute('aria-label', 'Toggle dark mode');
  btn.textContent = '☀️';
  btn.style.cssText = `
    background: none;
    border: 1.5px solid var(--border);
    border-radius: 100px;
    width: 36px; height: 36px;
    cursor: pointer;
    font-size: 1rem;
    line-height: 1;
    display: flex; align-items: center; justify-content: center;
    margin-left: 0.5rem;
    transition: border-color 0.2s;
  `;
  nav.appendChild(btn);

  // Apply saved preference
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') applyDark();

  btn.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    btn.textContent = isDark ? '🌙' : '☀️';
  });

  function applyDark() {
    document.documentElement.classList.add('dark');
    btn.textContent = '🌙';
  }
})();


// ─── Dark mode CSS variables (injected once) ─────────────────
(function injectDarkStyles() {
  const style = document.createElement('style');
  style.textContent = `
    html.dark {
      --bg:        #131311;
      --bg-alt:    #1c1c19;
      --ink:       #f0ede6;
      --ink-light: #9a9a88;
      --border:    #2e2e28;
    }
    html.dark .project-card  { background: #1c1c19; }
    html.dark .hobby-list li { background: #1c1c19; }
    html.dark .form-group input,
    html.dark .form-group textarea { background: #1c1c19; color: #f0ede6; }
    html.dark .site-header {
      background: rgba(19, 19, 17, 0.88);
    }
  `;
  document.head.appendChild(style);
})();
