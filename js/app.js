/* ═══════════════════════════════════════════
   Interactive Virtual Research Laboratory
   Main Application Bootstrap v3.0.0
   ═══════════════════════════════════════════ */

const App = (() => {
  let _initialized = false;

  return {
    async init() {
      if (_initialized) return;
      _initialized = true;

      StateManager.loadFromStorage();
      ThemeManager.init();
      _registerRoutes();
      Router.init();
      UIManager.init();
      Renderer.init();
      _registerModulesFromDOM();
      _bindGlobalEvents();
      Router.syncFromURL();

      initParticles();
      initHero3D();
      setTimeout(initScrollAnimations, 100);

      EventManager.emit('app:init');
    }
  };

  function _registerRoutes() {
    Router.register('home', { title: 'Home', moduleId: 'home' });
    for (let i = 1; i <= 18; i++) {
      Router.register(String(i), { title: 'Module ' + i, moduleId: String(i) });
    }
  }

  function _bindGlobalEvents() {
    EventManager.on('route:changed', ({ from, to }) => {
      if (from) ModuleEngine.destroy(from);
      const sectionId = to === 'home' ? 'home' : 'module-' + to;
      Renderer.showSection(sectionId);
      UIManager.updateSidebarActive(to);
      if (to !== 'home') {
        ModuleEngine.init(to);
        _injectModuleNav(to);
      }
      if (window.innerWidth <= 1024) UIManager.toggleSidebar(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-navigate]');
      if (btn) {
        e.preventDefault();
        Router.navigateTo(btn.dataset.navigate);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const btn = e.target.closest('[data-navigate]');
      if (btn && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        Router.navigateTo(btn.dataset.navigate);
      }
      if (e.key === 'ArrowRight') {
        const routes = Router.getAllRoutes();
        const idx = routes.indexOf(Router.getCurrentRoute());
        if (idx > -1 && idx < routes.length - 1) Router.navigateTo(routes[idx + 1]);
      } else if (e.key === 'ArrowLeft') {
        const routes = Router.getAllRoutes();
        const idx = routes.indexOf(Router.getCurrentRoute());
        if (idx > 1) Router.navigateTo(routes[idx - 1]);
      }
    });

    window.addEventListener('popstate', () => Router.syncFromURL());
    window.addEventListener('resize', Utils.debounce(() => UIManager.onResize(), 200));
  }

  function _registerModulesFromDOM() {
    const sections = document.querySelectorAll('.module-section');
    sections.forEach(sec => {
      Renderer.registerSection(sec.id, sec);
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
    prevBtn.setAttribute('aria-label', n === 1 ? 'Go to Home' : 'Go to previous module');
    prevBtn.style.cssText = btnStyle;
    prevBtn.innerHTML = n === 1 ? '\u2190 Home' : ('\u2190 Module ' + (n - 1));
    prevBtn.addEventListener('click', () => Router.navigateTo(prevId));
    prevBtn.addEventListener('mouseover', () => { prevBtn.style.background = 'rgba(59,130,246,0.2)'; prevBtn.style.borderColor = '#93c5fd'; });
    prevBtn.addEventListener('mouseout', () => { prevBtn.style.background = 'rgba(59,130,246,0.08)'; prevBtn.style.borderColor = 'rgba(59,130,246,0.3)'; });

    const counter = document.createElement('span');
    counter.style.cssText = 'font-size:12px;color:#64748b;white-space:nowrap';
    counter.textContent = 'Module ' + n + ' / 18';

    nav.appendChild(prevBtn);
    nav.appendChild(counter);

    if (nextId) {
      const nextBtn = document.createElement('button');
      nextBtn.className = 'module-nav-btn module-nav-next';
      nextBtn.setAttribute('aria-label', 'Go to next module');
      nextBtn.style.cssText = btnStyle;
      nextBtn.innerHTML = 'Module ' + (n + 1) + ' \u2192';
      nextBtn.addEventListener('click', () => Router.navigateTo(nextId));
      nextBtn.addEventListener('mouseover', () => { nextBtn.style.background = 'rgba(59,130,246,0.2)'; nextBtn.style.borderColor = '#93c5fd'; });
      nextBtn.addEventListener('mouseout', () => { nextBtn.style.background = 'rgba(59,130,246,0.08)'; nextBtn.style.borderColor = 'rgba(59,130,246,0.3)'; });
      nav.appendChild(nextBtn);
    } else {
      const homeBtn = document.createElement('button');
      homeBtn.className = 'module-nav-btn module-nav-home';
      homeBtn.setAttribute('aria-label', 'Return to Home');
      homeBtn.style.cssText = btnStyle.replace('08)', '12)').replace('#93c5fd', '#34d399');
      homeBtn.innerHTML = '\u{1F3E0} Back to Home';
      homeBtn.addEventListener('click', () => Router.navigateTo('home'));
      nav.appendChild(homeBtn);
    }

    sec.appendChild(nav);
  }
})();

document.addEventListener('DOMContentLoaded', () => App.init());

window.vrlApp = {
  navigateTo: (id) => Router.navigateTo(id),
  toggleSidebar: (force) => UIManager.toggleSidebar(force),
  getState: () => StateManager.getAll(),
  resetProgress: () => StateManager.reset()
};
