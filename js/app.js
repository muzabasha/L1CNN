const App = (() => {
  let _initialized = false;
  let _currentModuleId = null;

  return {
    async init() {
      if (_initialized) {
        console.warn('[App] Already initialized');
        return;
      }
      
      console.log('[App] Initializing application...');
      _initialized = true;

      // Load state from storage
      StateManager.loadFromStorage();
      
      // Initialize theme
      ThemeManager.init();
      
      // Register all routes
      _registerRoutes();
      
      // Initialize core systems
      Router.init();
      UIManager.init();
      Renderer.init();
      
      // Register modules from DOM
      _registerModulesFromDOM();
      
      // Bind global events
      _bindGlobalEvents();
      
      // Sync from URL (handle deep linking and page refresh)
      Router.syncFromURL();
      
      // Initialize visual effects & background particle engines (non-critical, wrapped)
      try { initParticles(); } catch (e) { console.warn('[App] Particles init failed:', e); }
      try { initHero3D(); } catch (e) { console.warn('[App] Hero3D init failed:', e); }
      setTimeout(() => { try { initScrollAnimations(); } catch (e) { console.warn('[App] ScrollAnimations init failed:', e); } }, 100);

      // Run Cinematic Initialization Loader Sequence (3-5s)
      _runCinematicLoaderSequence();

      // Bind 3D Card Tilt effects on interactive elements
      _bindCardTilts();

      EventManager.emit('app:init');
      console.log('[App] Initialization complete');
    }
  };

  function _runCinematicLoaderSequence() {
    const loader = document.getElementById('cinematic-loader');
    if (!loader) return;

    if (Motion.reducedMotion) {
      loader.classList.add('loader-finish');
      setTimeout(() => loader.remove(), 800);
      return;
    }

    const circle = document.getElementById('loader-ring-circle');
    const pctEl = document.getElementById('loader-pct');
    const statusEl = document.getElementById('loader-status-text');

    const circumference = 414;
    const duration = 3200;
    const startTime = performance.now();

    const phrases = [
      "Initializing AI Neural Network Architecture...",
      "Loading Multiphase CT Datasets & DICOM Metadata...",
      "Calibrating 3D nnU-Net Segmentation Engines...",
      "Synthesizing Multimodal Radiomics-CNN Feature Space...",
      "Laboratory Ready. Welcome to VRL."
    ];

    function updateLoader(now) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      
      const currentPct = Math.round(easedProgress * 100);
      if (pctEl) pctEl.textContent = currentPct + '%';

      if (circle) {
        const offset = circumference - (easedProgress * circumference);
        circle.style.strokeDashoffset = offset;
      }

      const phraseIdx = Math.min(phrases.length - 1, Math.floor(easedProgress * phrases.length));
      if (statusEl && statusEl.textContent !== phrases[phraseIdx]) {
        statusEl.textContent = phrases[phraseIdx];
      }

      if (progress < 1) {
        requestAnimationFrame(updateLoader);
      } else {
        Motion.sound.playSuccess();
        setTimeout(() => {
          loader.classList.add('loader-finish');
          setTimeout(() => {
            if (loader.parentNode) loader.parentNode.removeChild(loader);
          }, 850);
        }, 300);
        // Ensure home section is visible after loader completes
        setTimeout(() => {
          const home = document.getElementById('home');
          if (home) {
            home.style.opacity = '1';
            home.style.transform = 'none';
            home.style.filter = 'none';
          }
        }, 400);
      }
    }

    requestAnimationFrame(updateLoader);
  }

  function _bindCardTilts() {
    document.querySelectorAll('.module-card, .card, .simulation-panel').forEach(card => {
      Motion.tilt(card, { maxTilt: 6 });
      card.addEventListener('mouseenter', () => Motion.sound.playHover());
    });
  }

  function _registerRoutes() {
    console.log('[App] Registering routes...');
    Router.register('home', { title: 'Home', moduleId: 'home' });
    for (let i = 1; i <= 18; i++) {
      Router.register(String(i), { title: 'Module ' + i, moduleId: String(i) });
    }
    console.log('[App] Routes registered');
  }

  function _bindGlobalEvents() {
    console.log('[App] Binding global events...');
    
    // Handle route changes
    EventManager.on('route:changed', ({ from, to }) => {
      console.log('[App] Route changed from', from, 'to', to);
      Motion.sound.playTransition();
      
      try {
        const sectionId = to === 'home' ? 'home' : 'module-' + to;
        const prevSectionId = from && from !== 'home' ? 'module-' + from : from === 'home' ? 'home' : null;
        
        // Animate out previous section (fire-and-forget, don't await)
        let prevSection = prevSectionId ? Renderer.getSection(prevSectionId) || document.getElementById(prevSectionId) : null;
        if (prevSection && !prevSection.classList.contains('hidden')) {
          Motion.pageOut(prevSection, { duration: 200 });
        }
        
        // Destroy previous module if leaving a module
        if (from && from !== 'home' && from !== to) {
          console.log('[App] Destroying previous module:', from);
          try {
            ModuleEngine.destroy(from);
          } catch (e) {
            console.error('[App] Error destroying module:', from, e);
          }
        }

        // Ensure section exists and is registered
        let section = Renderer.getSection(sectionId);
        if (!section) {
          section = document.getElementById(sectionId);
          if (section) {
            console.log('[App] Found unregistered section in DOM, registering:', sectionId);
            Renderer.registerSection(sectionId, section);
          } else if (to !== 'home') {
            console.log('[App] Creating new container for module:', to);
            section = Renderer.createModuleContainer(to);
          }
        }

        // Show target section in DOM
        if (section) {
          section.classList.remove('hidden');
          Renderer.showSection(sectionId, false);
          // Run pageIn animation for all target sections to reveal cleanly
          requestAnimationFrame(() => Motion.pageIn(section, { duration: 350 }));
        }

        // Update sidebar highlighting
        UIManager.updateSidebarActive(to);
        
        // Initialize module if not home
        if (to !== 'home') {
          console.log('[App] Scheduling module init:', to);
          requestAnimationFrame(() => {
            try {
              const initialized = ModuleEngine.init(to);
              console.log('[App] Module init result:', to, initialized);
              const sec = document.getElementById('module-' + to) || document.getElementById(to);
              if (sec) {
                _injectModuleSubNav(sec, to);
              }
              _injectModuleNav(to);
              _currentModuleId = to;
              setTimeout(_bindCardTilts, 150);
            } catch (e) {
              console.error('[App] Error initializing module:', to, e);
            }
          });
        } else {
          _currentModuleId = null;
        }

        // Close mobile menu if open
        if (window.innerWidth <= 1024) {
          setTimeout(() => UIManager.toggleSidebar(false), 150);
        }

        // Scroll to top
        requestAnimationFrame(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Announce to screen readers
        const announcer = document.getElementById('sr-announcer');
        if (announcer) {
          const label = to === 'home' ? 'Home' : 'Module ' + to;
          announcer.textContent = 'Now viewing ' + label;
        }
        
        console.log('[App] Route change complete:', to);
        
      } catch (error) {
        console.error('[App] Critical error in route:changed handler:', error);
        console.error('[App] Stack:', error.stack);
        if (to !== 'home') {
          console.log('[App] Attempting recovery - navigating to home');
          setTimeout(() => Router.navigateTo('home', { force: true }), 100);
        }
      }
    });

    // Global click handler for data-navigate attributes
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-navigate]');
      if (btn) {
        e.preventDefault();
        const target = btn.dataset.navigate;
        console.log('[App] Navigate button clicked:', target);
        Motion.ripple(e);
        Router.navigateTo(target);
      }
    });

    // Global keyboard handler for navigation buttons
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || 
          e.target.tagName === 'TEXTAREA' || 
          e.target.tagName === 'SELECT' || 
          e.target.closest('.simulation-panel') || 
          e.target.closest('[role="tab"]')) {
        return;
      }

      const btn = e.target.closest('[data-navigate]');
      if (btn && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        const target = btn.dataset.navigate;
        Router.navigateTo(target);
        return;
      }

      if (e.key === 'ArrowRight') {
        const routes = Router.getAllRoutes();
        const idx = routes.indexOf(Router.getCurrentRoute());
        if (idx > -1 && idx < routes.length - 1) {
          e.preventDefault();
          Router.navigateTo(routes[idx + 1]);
        }
      } else if (e.key === 'ArrowLeft') {
        const routes = Router.getAllRoutes();
        const idx = routes.indexOf(Router.getCurrentRoute());
        if (idx > 0) {
          e.preventDefault();
          Router.navigateTo(routes[idx - 1]);
        }
      }
    });

    window.addEventListener('resize', Utils.debounce(() => {
      UIManager.onResize();
    }, 200));
    
    console.log('[App] Global events bound');
  }

  function _registerModulesFromDOM() {
    console.log('[App] Registering modules from DOM...');
    const sections = document.querySelectorAll('.module-section');
    sections.forEach(sec => {
      Renderer.registerSection(sec.id, sec);
      console.log('[App] Registered section:', sec.id);
    });
  }

  function _injectModuleSubNav(sec, moduleId) {
    if (!sec) return;
    let existing = sec.querySelector('.module-subnav');
    if (existing) existing.remove();

    const sections = [];
    const objEl = sec.querySelector('[id*="-objectives"], .objectives-panel, .objectives-grid');
    if (objEl) sections.push({ name: '🎯 Objectives', el: objEl });

    const animEl = sec.querySelector('[id*="-animation"], [id*="-anatomy-wrap"], [id*="-ctphases-wrap"], .animation-panel');
    if (animEl) sections.push({ name: '🔬 Visuals & Animation', el: animEl });

    const simEl = sec.querySelector('[id*="-simulation"], [id*="-risk-wrap"], .simulation-panel, .simulation-container');
    if (simEl && simEl !== animEl) sections.push({ name: '⚡ Interactive Lab', el: simEl });

    const theoryEl = sec.querySelector('[id*="-theory"], .theory-panel, .theory-content');
    if (theoryEl) sections.push({ name: '📚 Theory & Concepts', el: theoryEl });

    const codeEl = sec.querySelector('[id*="-code"], .code-container, .code-panel');
    if (codeEl) sections.push({ name: '💻 Python Code', el: codeEl });

    const quizEl = sec.querySelector('[id*="-quiz"], .quiz-container, .quiz-panel');
    if (quizEl) sections.push({ name: '✏️ Quiz & Evaluation', el: quizEl });

    if (sections.length < 2) return;

    const subnav = document.createElement('nav');
    subnav.className = 'module-subnav';
    subnav.setAttribute('aria-label', 'Module Content Quick Links');

    sections.forEach((s, idx) => {
      if (!s.el.id) s.el.id = 'mod-' + moduleId + '-sec-' + idx;
      const pill = document.createElement('button');
      pill.className = 'subnav-pill' + (idx === 0 ? ' active' : '');
      pill.innerHTML = s.name;
      pill.setAttribute('aria-label', 'Jump to ' + s.name);
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        subnav.querySelectorAll('.subnav-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const yOffset = -75;
        const y = s.el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      });
      subnav.appendChild(pill);
    });

    const header = sec.querySelector('.module-header, .module-title, h1, h2');
    if (header && header.nextSibling) {
      sec.insertBefore(subnav, header.nextSibling);
    } else {
      sec.insertBefore(subnav, sec.firstChild);
    }
  }

  function _injectModuleNav(moduleId) {
    const sec = document.getElementById('module-' + moduleId) || document.getElementById(moduleId);
    if (!sec) return;

    let existingNav = sec.querySelector('.module-nav-footer');
    if (existingNav) existingNav.remove();

    const n = parseInt(moduleId, 10);
    if (isNaN(n) || n < 1 || n > 18) return;

    const prevId = n === 1 ? 'home' : String(n - 1);
    const nextId = n === 18 ? null : String(n + 1);

    const nav = document.createElement('div');
    nav.className = 'module-nav-footer';

    const btnStyle = 'display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;border:1px solid rgba(59,130,246,0.3);background:rgba(59,130,246,0.08);color:#93c5fd;transition:all .2s ease;text-decoration:none';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'module-nav-btn module-nav-prev';
    prevBtn.setAttribute('data-navigate', prevId);
    prevBtn.setAttribute('aria-label', n === 1 ? 'Go to Home' : 'Go to previous module');
    prevBtn.style.cssText = btnStyle;
    prevBtn.innerHTML = n === 1 ? '← Home Overview' : ('← Module ' + (n - 1));

    const counter = document.createElement('span');
    counter.style.cssText = 'font-size:13px;font-weight:600;color:#94a3b8;white-space:nowrap;font-family:Orbitron,sans-serif';
    counter.textContent = 'Module ' + n + ' of 18';

    nav.appendChild(prevBtn);
    nav.appendChild(counter);

    if (nextId) {
      const nextBtn = document.createElement('button');
      nextBtn.className = 'module-nav-btn module-nav-next';
      nextBtn.setAttribute('data-navigate', nextId);
      nextBtn.setAttribute('aria-label', 'Go to next module');
      nextBtn.style.cssText = btnStyle;
      nextBtn.innerHTML = 'Module ' + (n + 1) + ' →';
      nav.appendChild(nextBtn);
    } else {
      const homeBtn = document.createElement('button');
      homeBtn.className = 'module-nav-btn module-nav-home';
      homeBtn.setAttribute('data-navigate', 'home');
      homeBtn.setAttribute('aria-label', 'Return to Home Overview');
      homeBtn.style.cssText = btnStyle.replace('08)', '12)').replace('#93c5fd', '#34d399');
      homeBtn.innerHTML = '🏠 Return to Home';
      nav.appendChild(homeBtn);
    }

    sec.appendChild(nav);
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  console.log('[DOM] DOMContentLoaded - Initializing app');
  App.init();
});

window.vrlApp = {
  navigateTo: (id) => Router.navigateTo(id),
  toggleSidebar: (force) => UIManager.toggleSidebar(force),
  getState: () => StateManager.getAll(),
  resetProgress: () => StateManager.reset(),
  getCurrentRoute: () => Router.getCurrentRoute()
};
