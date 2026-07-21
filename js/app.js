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
      
      // Initialize visual effects
      initParticles();
      initHero3D();
      setTimeout(initScrollAnimations, 100);

      EventManager.emit('app:init');
      console.log('[App] Initialization complete');
    }
  };

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
    EventManager.on('route:changed', async ({ from, to }) => {
      console.log('[App] Route changed from', from, 'to', to);
      
      try {
        // Determine section IDs
        const sectionId = to === 'home' ? 'home' : 'module-' + to;
        const prevSectionId = from && from !== 'home' ? 'module-' + from : from === 'home' ? 'home' : null;
        
        // Animate out previous section
        let prevSection = prevSectionId ? Renderer.getSection(prevSectionId) || document.getElementById(prevSectionId) : null;
        if (prevSection && !prevSection.classList.contains('hidden')) {
          await Motion.pageOut(prevSection, { duration: 350 });
        }
        
        // Destroy previous module
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

        // Remove hidden class so section is visible for animation
        if (section) {
          section.classList.remove('hidden');
        }

        // Update sidebar highlighting
        UIManager.updateSidebarActive(to);
        
        // Initialize module if not home (deferred for paint)
        if (to !== 'home') {
          console.log('[App] Scheduling module init:', to);
          requestAnimationFrame(() => {
            try {
              const initialized = ModuleEngine.init(to);
              if (initialized) {
                console.log('[App] Module initialized:', to);
                _injectModuleNav(to);
                _currentModuleId = to;
                // Stagger children after init
                requestAnimationFrame(() => {
                  if (section) Motion.stagger(section, { duration: 400, stagger: 60 });
                });
              } else {
                console.warn('[App] Module already initialized or failed:', to);
              }
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
        // Attempt recovery by going to home
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
        Router.navigateTo(target);
      }
    });

    // Global keyboard handler for navigation buttons
    document.addEventListener('keydown', (e) => {
      // Skip if user is typing in an input
      if (e.target.tagName === 'INPUT' || 
          e.target.tagName === 'TEXTAREA' || 
          e.target.tagName === 'SELECT' || 
          e.target.closest('.simulation-panel') || 
          e.target.closest('[role="tab"]')) {
        return;
      }

      // Handle Enter/Space on data-navigate buttons
      const btn = e.target.closest('[data-navigate]');
      if (btn && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        const target = btn.dataset.navigate;
        Router.navigateTo(target);
        return;
      }

      // Arrow key navigation between modules
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

    // Debounced resize handler
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

  function _injectModuleNav(moduleId) {
    const sec = document.getElementById('module-' + moduleId);
    if (!sec) return;
    if (sec.querySelector('.module-nav-footer')) return;

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
    prevBtn.innerHTML = n === 1 ? '\u2190 Home' : ('\u2190 Module ' + (n - 1));

    const counter = document.createElement('span');
    counter.style.cssText = 'font-size:12px;color:#64748b;white-space:nowrap';
    counter.textContent = 'Module ' + n + ' / 18';

    nav.appendChild(prevBtn);
    nav.appendChild(counter);

    if (nextId) {
      const nextBtn = document.createElement('button');
      nextBtn.className = 'module-nav-btn module-nav-next';
      nextBtn.setAttribute('data-navigate', nextId);
      nextBtn.setAttribute('aria-label', 'Go to next module');
      nextBtn.style.cssText = btnStyle;
      nextBtn.innerHTML = 'Module ' + (n + 1) + ' \u2192';
      nav.appendChild(nextBtn);
    } else {
      const homeBtn = document.createElement('button');
      homeBtn.className = 'module-nav-btn module-nav-home';
      homeBtn.setAttribute('data-navigate', 'home');
      homeBtn.setAttribute('aria-label', 'Return to Home');
      homeBtn.style.cssText = btnStyle.replace('08)', '12)').replace('#93c5fd', '#34d399');
      homeBtn.innerHTML = '\u{1F3E0} Back to Home';
      nav.appendChild(homeBtn);
    }

    sec.appendChild(nav);
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  console.log('[DOM] DOMContentLoaded - Initializing app');
  App.init();
  
  // Show welcome toast after initialization
  setTimeout(() => {
    if (window.ToastManager) {
      ToastManager.success('Application initialized successfully!', {
        title: 'Welcome',
        duration: 3000
      });
    }
  }, 500);
});

window.vrlApp = {
  navigateTo: (id) => Router.navigateTo(id),
  toggleSidebar: (force) => UIManager.toggleSidebar(force),
  getState: () => StateManager.getAll(),
  resetProgress: () => StateManager.reset(),
  getCurrentRoute: () => Router.getCurrentRoute()
};
