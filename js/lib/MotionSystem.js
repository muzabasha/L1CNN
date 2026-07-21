/**
 * Motion Design System v1.0
 * Shared easing, durations, animation tokens, and the global AnimationController.
 * Inspired by Apple HIG, Material Motion, and cinematic storytelling.
 *
 * All module animations must register with this controller.
 */
const Motion = (() => {
  /* ── Easing Curves ─────────────────────────── */
  const Ease = {
    // Apple-inspired smooth curves
    appleIn:     'cubic-bezier(0.36, 0.0, 0.66, -0.56)',
    appleOut:    'cubic-bezier(0.34, 1.56, 0.64, 1.0)',
    appleInOut:  'cubic-bezier(0.65, 0.0, 0.35, 1.0)',
    // Material-inspired
    standard:    'cubic-bezier(0.4, 0.0, 0.2, 1.0)',
    decelerate:  'cubic-bezier(0.0, 0.0, 0.2, 1.0)',
    accelerate:  'cubic-bezier(0.4, 0.0, 1.0, 1.0)',
    // Cinematic
    cinIn:       'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
    cinOut:      'cubic-bezier(0.215, 0.61, 0.355, 1.0)',
    cinInOut:    'cubic-bezier(0.645, 0.045, 0.355, 1.0)',
    // Scientific (linear for data accuracy)
    linear:      'linear',
  };

  /* ── Duration Tokens (ms) ──────────────────── */
  const Duration = {
    instant:     50,
    micro:       100,
    hover:       200,
    press:       150,
    lift:        300,
    fade:        400,
    slide:       500,
    pageOut:     400,
    pageIn:      500,
    pageTotal:   900,
    moduleInit:  1200,
    simulation:  3000,
    idle:        4000,
    continuous:  Infinity,
  };

  /* ── Transform Presets ─────────────────────── */
  const Preset = {
    pageOut:  { opacity: 0, scale: 0.98, filter: 'blur(4px)', willChange: 'transform, opacity' },
    pageIn:   { opacity: 0, scale: 0.96, filter: 'blur(8px)', willChange: 'transform, opacity' },
    cardIdle: { y: 0, boxShadow: 'var(--shadow)' },
    cardHover:{ y: -4, boxShadow: 'var(--shadow-lg)' },
    lift:     { y: -8 },
    drop:     { y: 4 },
    fadeUp:   { opacity: 0, y: 20 },
    fadeDown: { opacity: 0, y: -20 },
    fadeIn:   { opacity: 0 },
    scaleIn:  { opacity: 0, scale: 0.92 },
    blurIn:   { filter: 'blur(12px)', opacity: 0 },
  };

  /* ── Reduced Motion ────────────────────────── */
  let _reducedMotion = false;
  function _checkReducedMotion() {
    _reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  _checkReducedMotion();
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', _checkReducedMotion);

  /* ── GSAP-safe wrapper ─────────────────────── */
  const gsapSafe = window.gsap && typeof window.gsap.to === 'function';

  /* ── AnimationController ───────────────────── */
  const _active = new Map();     // id -> { tl, type, els }
  let _counter = 0;

  return {
    Ease, Duration, Preset,

    get reducedMotion() { return _reducedMotion; },

    /** Register an animation for lifecycle management */
    register(id, config) {
      _active.set(id, { ...config, id });
      return id;
    },

    /** Unregister and kill */
    unregister(id) {
      const entry = _active.get(id);
      if (!entry) return;
      if (entry.tl && entry.tl.kill) entry.tl.kill();
      if (entry.els) entry.els.forEach(el => { if (el) el.style.transition = ''; });
      _active.delete(id);
    },

    unregisterAll() {
      _active.forEach((v, k) => this.unregister(k));
    },

    /** Generate unique animation ID */
    uid(prefix = 'm') { return prefix + (++_counter); },

    /* ── Core Animation Methods ──────────────── */

    /** Fade in an element */
    fadeIn(el, opts = {}) {
      if (!el) return;
      const d = opts.duration || Duration.fade;
      const e = opts.ease || Ease.appleOut;
      const delay = opts.delay || 0;
      el.style.opacity = '0';
      el.style.willChange = 'opacity';
      if (_reducedMotion) { el.style.opacity = '1'; el.style.willChange = ''; return; }
      el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: d, easing: e, delay, fill: 'forwards' });
      setTimeout(() => { el.style.opacity = '1'; el.style.willChange = ''; }, d + delay);
    },

    /** Fade up (in + slide up) */
    fadeUp(el, opts = {}) {
      if (!el) return;
      const d = opts.duration || Duration.slide;
      const e = opts.ease || Ease.appleOut;
      const delay = opts.delay || 0;
      const dist = opts.distance || 20;
      el.style.opacity = '0';
      el.style.transform = `translateY(${dist}px)`;
      el.style.willChange = 'transform, opacity';
      if (_reducedMotion) { el.style.opacity = '1'; el.style.transform = ''; el.style.willChange = ''; return; }
      el.animate([
        { opacity: 0, transform: `translateY(${dist}px)` },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: d, easing: e, delay, fill: 'forwards' });
      setTimeout(() => { el.style.opacity = '1'; el.style.transform = ''; el.style.willChange = ''; }, d + delay);
    },

    /** Stagger children */
    stagger(container, opts = {}) {
      const children = container?.children;
      if (!children) return;
      const d = opts.duration || Duration.slide;
      const e = opts.ease || Ease.appleOut;
      const staggerDelay = opts.stagger || 80;
      const dist = opts.distance || 16;
      Array.from(children).forEach((child, i) => {
        child.style.opacity = '0';
        child.style.transform = `translateY(${dist}px)`;
        child.style.willChange = 'transform, opacity';
        if (_reducedMotion) { child.style.opacity = '1'; child.style.transform = ''; child.style.willChange = ''; return; }
        child.animate([
          { opacity: 0, transform: `translateY(${dist}px)` },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: d, easing: e, delay: i * staggerDelay, fill: 'forwards' });
        setTimeout(() => { child.style.opacity = '1'; child.style.transform = ''; child.style.willChange = ''; }, d + i * staggerDelay);
      });
    },

    /** Scale in */
    scaleIn(el, opts = {}) {
      if (!el) return;
      const d = opts.duration || Duration.slide;
      const e = opts.ease || Ease.appleOut;
      const delay = opts.delay || 0;
      el.style.opacity = '0';
      el.style.transform = 'scale(0.92)';
      el.style.willChange = 'transform, opacity';
      if (_reducedMotion) { el.style.opacity = '1'; el.style.transform = ''; el.style.willChange = ''; return; }
      el.animate([
        { opacity: 0, transform: 'scale(0.92)' },
        { opacity: 1, transform: 'scale(1)' }
      ], { duration: d, easing: e, delay, fill: 'forwards' });
      setTimeout(() => { el.style.opacity = '1'; el.style.transform = ''; el.style.willChange = ''; }, d + delay);
    },

    /** Page transition: outgoing */
    pageOut(section, opts = {}) {
      if (!section) return Promise.resolve();
      return new Promise(resolve => {
        const d = opts.duration || Duration.pageOut;
        const e = opts.ease || Ease.cinIn;
        if (_reducedMotion) { resolve(); return; }
        section.style.willChange = 'transform, opacity, filter';
        section.animate([
          { opacity: 1, transform: 'scale(1)', filter: 'blur(0)' },
          { opacity: 0, transform: 'scale(0.98)', filter: 'blur(4px)' }
        ], { duration: d, easing: e, fill: 'forwards' }).onfinish = () => {
          section.style.willChange = '';
          resolve();
        };
        setTimeout(resolve, d + 50);
      });
    },

    /** Page transition: incoming */
    pageIn(section, opts = {}) {
      if (!section) return Promise.resolve();
      return new Promise(resolve => {
        const d = opts.duration || Duration.pageIn;
        const e = opts.ease || Ease.cinOut;
        if (_reducedMotion) { section.style.opacity = '1'; section.style.transform = ''; resolve(); return; }
        section.style.opacity = '0';
        section.style.transform = 'scale(0.96)';
        section.style.filter = 'blur(8px)';
        section.style.willChange = 'transform, opacity, filter';
        section.animate([
          { opacity: 0, transform: 'scale(0.96)', filter: 'blur(8px)' },
          { opacity: 1, transform: 'scale(1)', filter: 'blur(0)' }
        ], { duration: d, easing: e, fill: 'forwards' }).onfinish = () => {
          section.style.opacity = '1';
          section.style.transform = '';
          section.style.filter = '';
          section.style.willChange = '';
          resolve();
        };
        setTimeout(resolve, d + 50);
      });
    },

    /** Count-up animation for KPI numbers */
    countUp(el, target, opts = {}) {
      if (!el) return;
      const d = opts.duration || 1200;
      const prefix = opts.prefix || '';
      const suffix = opts.suffix || '';
      const start = parseInt(el.textContent.replace(/[^0-9.-]/g, ''), 10) || 0;
      if (_reducedMotion) { el.textContent = prefix + target + suffix; return; }
      const startTime = performance.now();
      const step = (now) => {
        const p = Math.min((now - startTime) / d, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = Math.round(start + (target - start) * eased);
        el.textContent = prefix + val + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    },

    /** Ripple effect on click */
    ripple(e, opts = {}) {
      const el = e.currentTarget;
      if (!el) return;
      const color = opts.color || 'rgba(255,255,255,0.2)';
      const size = opts.size || Math.max(el.offsetWidth, el.offsetHeight);
      const rect = el.getBoundingClientRect();
      const x = (e.clientX || e.touches?.[0]?.clientX || rect.left + rect.width / 2) - rect.left;
      const y = (e.clientY || e.touches?.[0]?.clientY || rect.top + rect.height / 2) - rect.top;
      const ripple = document.createElement('span');
      ripple.style.cssText = `position:absolute;left:${x - size/2}px;top:${y - size/2}px;width:${size}px;height:${size}px;border-radius:50%;background:${color};transform:scale(0);opacity:1;pointer-events:none;`;
      el.style.position = 'relative';
      el.style.overflow = 'hidden';
      el.appendChild(ripple);
      if (_reducedMotion) { ripple.remove(); return; }
      ripple.animate([
        { transform: 'scale(0)', opacity: 0.6 },
        { transform: 'scale(2.5)', opacity: 0 }
      ], { duration: 600, easing: Ease.standard, fill: 'forwards' }).onfinish = () => ripple.remove();
    },

    /** Magnetic attraction: element subtly follows cursor */
    magnetic(el, opts = {}) {
      if (!el || _reducedMotion) return;
      const strength = opts.strength || 6;
      const onMove = (e) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / rect.width * strength;
        const dy = (e.clientY - cy) / rect.height * strength;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      };
      const onLeave = () => {
        el.style.transform = '';
      };
      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', onLeave);
      return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); };
    }
  };
})();
