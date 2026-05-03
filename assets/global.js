/* =====================================================
   ANSTIRE — Global JavaScript
   Particles · Theme · Nav Injection · Animations
   ===================================================== */

// ─── Nav & Footer HTML ────────────────────────────────
const NAV_HTML = `
<canvas id="particle-canvas"></canvas>
<div class="orb orb-1"></div>
<div class="orb orb-2"></div>
<nav class="nav">
  <div class="nav-inner">
    <a href="/" class="nav-logo">ANSTIRE</a>
    <ul class="nav-links">
      <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
      <li><a href="/tools">Tools</a></li>
      <li><a href="/blog">Blog</a></li>
      <li><a href="/source-code">Source Code</a></li>
      <li><a href="/community">Community</a></li>
      <li><a href="/newsletter">Newsletter</a></li>
      <li><a href="/contact">Contact</a></li>
    </ul>
    <div class="nav-actions">
      <button class="theme-toggle" aria-label="Toggle theme"><span class="theme-icon">🌙</span></button>
      <button class="nav-hamburger" aria-label="Open menu"><span></span><span></span><span></span></button>
    </div>
  </div>
</nav>
<div class="nav-mobile">
  <a href="/">Home</a>
  <a href="/about">About</a>
  <a href="/tools">Tools</a>
  <a href="/blog">Blog</a>
  <a href="/source-code">Source Code</a>
  <a href="/community">Community</a>
  <a href="/newsletter">Newsletter</a>
  <a href="/contact">Contact</a>
</div>`;

const FOOTER_HTML = `
<footer class="footer">
  <div class="footer-grid">
    <div class="footer-brand">
      <a href="/" class="footer-logo">ANSTIRE</a>
      <p>A digital laboratory dedicated to the intersection of clean code, mathematical beauty, and the evolving frontier of artificial intelligence.</p>
    </div>
    <div class="footer-col">
      <h4>Explore</h4>
      <ul>
        <li><a href="/about">About</a></li>
        <li><a href="/blog">Blog</a></li>
        <li><a href="/source-code">Source Code</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Connect</h4>
      <ul>
        <li><a href="/tools">Tools</a></li>
        <li><a href="/newsletter">Newsletter</a></li>
        <li><a href="/community">Community</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <span>© 2025 Anstire. All rights reserved.</span>
    <span>Code. Compare. Conquer.</span>
  </div>
</footer>`;

// ─── Theme Manager ────────────────────────────────────
const Theme = {
  init() {
    const saved = localStorage.getItem('anstire-theme') || 'dark';
    this.apply(saved);
  },
  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('anstire-theme', theme);
    document.querySelectorAll('.theme-icon').forEach(el => {
      el.textContent = theme === 'dark' ? '☀️' : '🌙';
    });
  },
  toggle() {
    const cur = document.documentElement.getAttribute('data-theme');
    this.apply(cur === 'dark' ? 'light' : 'dark');
  }
};

// ─── Particle System ──────────────────────────────────
const Particles = {
  canvas: null, ctx: null, pts: [],
  mouse: { x: -9999, y: -9999 },

  init() {
    this.canvas = document.getElementById('particle-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => { this.resize(); this.spawn(); });
    window.addEventListener('mousemove', e => { this.mouse.x = e.clientX; this.mouse.y = e.clientY; });
    this.spawn();
    this.loop();
  },

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },

  spawn() {
    const n = Math.min(Math.floor(window.innerWidth * window.innerHeight / 16000), 72);
    this.pts = Array.from({ length: n }, () => ({
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      vx: (Math.random() - 0.5) * 0.42,
      vy: (Math.random() - 0.5) * 0.42,
      r: Math.random() * 1.4 + 0.5,
    }));
  },

  loop() {
    if (!this.ctx) return;
    const { canvas: c, ctx, pts, mouse } = this;
    ctx.clearRect(0, 0, c.width, c.height);
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    const dotA = dark ? 0.45 : 0.22;
    const lineA = dark ? 0.14 : 0.07;

    pts.forEach(p => {
      const dx = mouse.x - p.x, dy = mouse.y - p.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < 20000) { const f = 0.018 / Math.sqrt(d2); p.vx += dx * f; p.vy += dy * f; }
      const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (spd > 1.6) { p.vx *= 0.94; p.vy *= 0.94; }
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = c.width; if (p.x > c.width) p.x = 0;
      if (p.y < 0) p.y = c.height; if (p.y > c.height) p.y = 0;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(123,97,255,${dotA})`; ctx.fill();
    });

    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 125) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(0,201,255,${lineA * (1 - d / 125)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(() => this.loop());
  }
};

// ─── Navigation ───────────────────────────────────────
const Nav = {
  init() {
    // Inject HTML
    const navEl = document.getElementById('site-nav');
    const footerEl = document.getElementById('site-footer');
    if (navEl) navEl.outerHTML = NAV_HTML;
    if (footerEl) footerEl.outerHTML = FOOTER_HTML;

    // Theme toggle
    document.addEventListener('click', e => {
      if (e.target.closest('.theme-toggle')) Theme.toggle();
    });

    // Hamburger
    document.addEventListener('click', e => {
      if (e.target.closest('.nav-hamburger')) {
        document.querySelector('.nav-mobile')?.classList.toggle('open');
      } else if (!e.target.closest('.nav-mobile')) {
        document.querySelector('.nav-mobile')?.classList.remove('open');
      }
    });

    // Active links
    const path = window.location.pathname.replace(/\/$/, '') || '/';
    document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
      const href = (link.getAttribute('href') || '').replace(/\/$/, '') || '/';
      const isHome = href === '/' && (path === '' || path === '/');
      const isMatch = href !== '/' && path.startsWith(href);
      if (isHome || isMatch) link.classList.add('active');
    });

    // Re-init particles & theme icons after DOM injection
    Theme.init();
    Particles.init();
  }
};

// ─── Scroll Reveal ────────────────────────────────────
const ScrollReveal = {
  init() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.animationPlayState = 'running';
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.anim').forEach(el => {
      el.style.animationPlayState = 'paused';
      obs.observe(el);
    });
  }
};

// ─── Boot ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  Nav.init();
  ScrollReveal.init();
});
