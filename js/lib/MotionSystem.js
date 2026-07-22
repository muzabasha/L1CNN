/**
 * Motion Design System v2.0 - Scientific Cinematic Motion Engine
 * Inspired by Apple Vision Pro, Material Motion, and Pixar-level spatial design.
 * Features centralized lifecycle management, Web Audio API sound synthesis, 
 * GSAP choreography helpers, magnetic interaction, card 3D tilt, and reduced-motion fallback.
 */
const Motion = (() => {
  /* ── Easing Curves ─────────────────────────── */
  const Ease = {
    appleIn:     'cubic-bezier(0.36, 0.0, 0.66, -0.56)',
    appleOut:    'cubic-bezier(0.34, 1.56, 0.64, 1.0)',
    appleInOut:  'cubic-bezier(0.65, 0.0, 0.35, 1.0)',
    spring:      'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    standard:    'cubic-bezier(0.4, 0.0, 0.2, 1.0)',
    decelerate:  'cubic-bezier(0.0, 0.0, 0.2, 1.0)',
    accelerate:  'cubic-bezier(0.4, 0.0, 1.0, 1.0)',
    cinIn:       'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
    cinOut:      'cubic-bezier(0.215, 0.61, 0.355, 1.0)',
    cinInOut:    'cubic-bezier(0.645, 0.045, 0.355, 1.0)',
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
    pageOut:   { opacity: 0, scale: 0.98, filter: 'blur(4px)', y: -10, willChange: 'transform, opacity, filter' },
    pageIn:    { opacity: 0, scale: 0.96, filter: 'blur(8px)', y: 15, willChange: 'transform, opacity, filter' },
    cardIdle:  { y: 0, scale: 1, boxShadow: 'var(--shadow)' },
    cardHover: { y: -6, scale: 1.01, boxShadow: 'var(--shadow-lg)' },
    lift:      { y: -8 },
    drop:      { y: 4 },
    fadeUp:    { opacity: 0, y: 20 },
    fadeDown:  { opacity: 0, y: -20 },
    fadeIn:    { opacity: 0 },
    scaleIn:   { opacity: 0, scale: 0.92 },
    blurIn:    { filter: 'blur(12px)', opacity: 0 },
  };

  /* ── Reduced Motion ────────────────────────── */
  let _reducedMotion = false;
  function _checkReducedMotion() {
    _reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  _checkReducedMotion();
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', _checkReducedMotion);

  /* ── Web Audio API Sound Synthesizer ───────── */
  let _audioCtx = null;
  let _isMuted = localStorage.getItem('vrl_muted') === 'true';

  function _getAudioContext() {
    if (!_audioCtx && typeof window.AudioContext !== 'undefined') {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      _audioCtx = new AudioContextClass();
    }
    if (_audioCtx && _audioCtx.state === 'suspended') {
      _audioCtx.resume().catch(() => {});
    }
    return _audioCtx;
  }

  const SoundEngine = {
    isMuted: () => _isMuted,
    toggleMute: () => {
      _isMuted = !_isMuted;
      localStorage.setItem('vrl_muted', _isMuted ? 'true' : 'false');
      const btn = document.getElementById('sound-toggle-btn');
      if (btn) {
        btn.innerHTML = _isMuted ? '🔇 <span class="sr-only">Muted</span>' : '🔊 <span class="sr-only">Sound On</span>';
        btn.setAttribute('aria-label', _isMuted ? 'Unmute Sound' : 'Mute Sound');
      }
      return _isMuted;
    },
    playClick: () => {
      if (_isMuted) return;
      try {
        const ctx = _getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } catch (e) {}
    },
    playHover: () => {
      if (_isMuted) return;
      try {
        const ctx = _getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(520, ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.02, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
      } catch (e) {}
    },
    playTransition: () => {
      if (_isMuted) return;
      try {
        const ctx = _getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } catch (e) {}
    },
    playScan: () => {
      if (_isMuted) return;
      try {
        const ctx = _getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(900, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(1400, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } catch (e) {}
    },
    playSuccess: () => {
      if (_isMuted) return;
      try {
        const ctx = _getAudioContext();
        if (!ctx) return;
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const startTime = ctx.currentTime + idx * 0.08;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, startTime);
          gain.gain.setValueAtTime(0.06, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(startTime);
          osc.stop(startTime + 0.2);
        });
      } catch (e) {}
    }
  };

  /* ── Animation Controller ──────────────────── */
  const _active = new Map();
  let _counter = 0;

  return {
    Ease, Duration, Preset, sound: SoundEngine,

    get reducedMotion() { return _reducedMotion; },

    register(id, config) {
      _active.set(id, { ...config, id });
      return id;
    },

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

    uid(prefix = 'm') { return prefix + (++_counter); },

    /* ── Core Animation Methods ──────────────── */

    fadeIn(el, opts = {}) {
      if (!el) return;
      const d = opts.duration || Duration.fade;
      const e = opts.ease || Ease.appleOut;
      const delay = opts.delay || 0;
      if (el.getAnimations) el.getAnimations().forEach(a => a.cancel());
      el.style.opacity = '0';
      el.style.willChange = 'opacity';
      if (_reducedMotion) { el.style.opacity = '1'; el.style.willChange = ''; return; }
      const anim = el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: d, easing: e, delay, fill: 'forwards' });
      anim.onfinish = () => {
        anim.cancel();
        el.style.opacity = '1';
        el.style.willChange = '';
      };
    },

    fadeUp(el, opts = {}) {
      if (!el) return;
      const d = opts.duration || Duration.slide;
      const e = opts.ease || Ease.appleOut;
      const delay = opts.delay || 0;
      const dist = opts.distance || 20;
      if (el.getAnimations) el.getAnimations().forEach(a => a.cancel());
      el.style.opacity = '0';
      el.style.transform = `translateY(${dist}px)`;
      el.style.willChange = 'transform, opacity';
      if (_reducedMotion) { el.style.opacity = '1'; el.style.transform = ''; el.style.willChange = ''; return; }
      const anim = el.animate([
        { opacity: 0, transform: `translateY(${dist}px)` },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: d, easing: e, delay, fill: 'forwards' });
      anim.onfinish = () => {
        anim.cancel();
        el.style.opacity = '1';
        el.style.transform = '';
        el.style.willChange = '';
      };
    },

    stagger(container, opts = {}) {
      const children = container?.children;
      if (!children) return;
      const d = opts.duration || Duration.slide;
      const e = opts.ease || Ease.appleOut;
      const staggerDelay = opts.stagger || 70;
      const dist = opts.distance || 16;
      Array.from(children).forEach((child, i) => {
        if (child.getAnimations) child.getAnimations().forEach(a => a.cancel());
        child.style.opacity = '0';
        child.style.transform = `translateY(${dist}px)`;
        child.style.willChange = 'transform, opacity';
        if (_reducedMotion) { child.style.opacity = '1'; child.style.transform = ''; child.style.willChange = ''; return; }
        const anim = child.animate([
          { opacity: 0, transform: `translateY(${dist}px)` },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: d, easing: e, delay: i * staggerDelay, fill: 'forwards' });
        anim.onfinish = () => {
          anim.cancel();
          child.style.opacity = '1';
          child.style.transform = '';
          child.style.willChange = '';
        };
      });
    },

    scaleIn(el, opts = {}) {
      if (!el) return;
      const d = opts.duration || Duration.slide;
      const e = opts.ease || Ease.appleOut;
      const delay = opts.delay || 0;
      if (el.getAnimations) el.getAnimations().forEach(a => a.cancel());
      el.style.opacity = '0';
      el.style.transform = 'scale(0.92)';
      el.style.willChange = 'transform, opacity';
      if (_reducedMotion) { el.style.opacity = '1'; el.style.transform = ''; el.style.willChange = ''; return; }
      const anim = el.animate([
        { opacity: 0, transform: 'scale(0.92)' },
        { opacity: 1, transform: 'scale(1)' }
      ], { duration: d, easing: e, delay, fill: 'forwards' });
      anim.onfinish = () => {
        anim.cancel();
        el.style.opacity = '1';
        el.style.transform = '';
        el.style.willChange = '';
      };
    },

    pageOut(section, opts = {}) {
      if (!section) return Promise.resolve();
      return new Promise(resolve => {
        const d = opts.duration || Duration.pageOut;
        const e = opts.ease || Ease.cinIn;
        if (section.getAnimations) {
          section.getAnimations().forEach(a => a.cancel());
        }
        if (_reducedMotion) {
          section.style.opacity = '0';
          resolve();
          return;
        }
        section.style.willChange = 'transform, opacity, filter';
        const anim = section.animate([
          { opacity: 1, transform: 'scale(1) translateY(0)', filter: 'blur(0)' },
          { opacity: 0, transform: 'scale(0.98) translateY(-10px)', filter: 'blur(4px)' }
        ], { duration: d, easing: e, fill: 'forwards' });
        anim.onfinish = () => {
          section.style.opacity = '0';
          section.style.willChange = '';
          resolve();
        };
        setTimeout(resolve, d + 50);
      });
    },

    pageIn(section, opts = {}) {
      if (!section) return Promise.resolve();
      return new Promise(resolve => {
        const d = opts.duration || Duration.pageIn;
        const e = opts.ease || Ease.cinOut;
        if (section.getAnimations) {
          section.getAnimations().forEach(a => a.cancel());
        }
        if (_reducedMotion) {
          section.style.opacity = '1';
          section.style.transform = '';
          section.style.filter = '';
          resolve();
          return;
        }
        section.style.opacity = '0';
        section.style.transform = 'scale(0.96) translateY(15px)';
        section.style.filter = 'blur(8px)';
        section.style.willChange = 'transform, opacity, filter';
        const anim = section.animate([
          { opacity: 0, transform: 'scale(0.96) translateY(15px)', filter: 'blur(8px)' },
          { opacity: 1, transform: 'scale(1) translateY(0)', filter: 'blur(0)' }
        ], { duration: d, easing: e, fill: 'forwards' });
        anim.onfinish = () => {
          anim.cancel(); // Cancel Web Animation so fill state doesn't lock inline styles!
          section.style.opacity = '1';
          section.style.transform = '';
          section.style.filter = '';
          section.style.willChange = '';
          resolve();
        };
        setTimeout(resolve, d + 50);
      });
    },

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

    ripple(e, opts = {}) {
      const el = e.currentTarget;
      if (!el) return;
      SoundEngine.playClick();
      const color = opts.color || 'rgba(255,255,255,0.2)';
      const size = opts.size || Math.max(el.offsetWidth, el.offsetHeight);
      const rect = el.getBoundingClientRect();
      const x = (e.clientX || e.touches?.[0]?.clientX || rect.left + rect.width / 2) - rect.left;
      const y = (e.clientY || e.touches?.[0]?.clientY || rect.top + rect.height / 2) - rect.top;
      const ripple = document.createElement('span');
      ripple.style.cssText = `position:absolute;left:${x - size/2}px;top:${y - size/2}px;width:${size}px;height:${size}px;border-radius:50%;background:${color};transform:scale(0);opacity:1;pointer-events:none;z-index:99;`;
      el.style.position = 'relative';
      el.style.overflow = 'hidden';
      el.appendChild(ripple);
      if (_reducedMotion) { ripple.remove(); return; }
      ripple.animate([
        { transform: 'scale(0)', opacity: 0.6 },
        { transform: 'scale(2.5)', opacity: 0 }
      ], { duration: 600, easing: Ease.standard, fill: 'forwards' }).onfinish = () => ripple.remove();
    },

    magnetic(el, opts = {}) {
      if (!el || _reducedMotion) return;
      const strength = opts.strength || 6;
      const onMove = (e) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / rect.width * strength;
        const dy = (e.clientY - cy) / rect.height * strength;
        el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      };
      const onLeave = () => {
        el.style.transform = '';
      };
      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', onLeave);
      return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); };
    },

    tilt(el, opts = {}) {
      if (!el || _reducedMotion) return;
      const maxTilt = opts.maxTilt || 8;
      const onMove = (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotateX = ((cy - y) / cy) * maxTilt;
        const rotateY = ((x - cx) / cx) * maxTilt;
        el.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(6px)`;
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
