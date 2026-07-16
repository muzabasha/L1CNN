const AnimationManager = (() => {
  let _animations = new Map();
  let _frameId = null;
  let _lastTime = 0;
  let _running = false;

  return {
    start() {
      if (_running) return;
      _running = true;
      _lastTime = performance.now();
      _loop(_lastTime);
    },

    stop() {
      _running = false;
      if (_frameId) {
        cancelAnimationFrame(_frameId);
        _frameId = null;
      }
    },

    add(id, callback) {
      _animations.set(id, callback);
      if (!_running) this.start();
      return () => this.remove(id);
    },

    remove(id) {
      _animations.delete(id);
      if (_animations.size === 0) this.stop();
    },

    clear() {
      _animations.clear();
      this.stop();
    },

    animate(element, keyframes, options = {}) {
      const duration = options.duration || 300;
      const easing = options.easing || 'ease-out';
      const delay = options.delay || 0;

      return new Promise(resolve => {
        element.style.transition = `all ${duration}ms ${easing} ${delay}ms`;
        Object.assign(element.style, keyframes);
        setTimeout(resolve, duration + delay);
      });
    },

    fadeIn(element, duration = 300) {
      return this.animate(element, { opacity: '1' }, { duration });
    },

    fadeOut(element, duration = 300) {
      return this.animate(element, { opacity: '0' }, { duration });
    },

    slideIn(element, direction = 'left', duration = 300) {
      const props = {
        left: { transform: 'translateX(0)' },
        right: { transform: 'translateX(0)' },
        up: { transform: 'translateY(0)' },
        down: { transform: 'translateY(0)' }
      };
      return this.animate(element, props[direction], { duration });
    },

    countUp(element, target, duration = 1000) {
      const start = performance.now();
      const initial = parseFloat(element.textContent) || 0;
      const remove = this.add('countup-' + Date.now(), (now) => {
        const elapsed = now - start;
        const progress = Math.min(1, elapsed / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = Math.round(initial + (target - initial) * eased);
        if (progress >= 1) remove();
      });
    },

    parallax(element, speed = 0.5) {
      const handler = () => {
        const rect = element.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const viewCenter = window.innerHeight / 2;
        const offset = (center - viewCenter) * speed;
        element.style.transform = `translateY(${-offset}px)`;
      };
      window.addEventListener('scroll', handler, { passive: true });
      return () => window.removeEventListener('scroll', handler);
    },

    typewriter(element, text, speed = 50) {
      return new Promise(resolve => {
        let i = 0;
        element.textContent = '';
        const id = setInterval(() => {
          element.textContent += text[i];
          i++;
          if (i >= text.length) {
            clearInterval(id);
            resolve();
          }
        }, speed);
      });
    }
  };

  function _loop(now) {
    if (!_running) return;
    _frameId = requestAnimationFrame(_loop);
    _animations.forEach(cb => cb(now));
  }
})();
