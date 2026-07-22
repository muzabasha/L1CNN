const Router = (() => {
  let _currentRoute = 'home';
  let _previousRoute = null;
  let _routes = new Map();
  let _isNavigating = false;
  let _initialized = false;
  let _popstateHandler = null;

  function normalizeRouteId(id) {
    if (!id) return 'home';
    let s = String(id).trim().toLowerCase();
    if (s.startsWith('#')) s = s.substring(1).trim();
    if (s === '' || s === '/' || s === 'home') return 'home';

    // Matches 'module-5', 'module5', 'm5', '5', 'module_5', etc.
    const match = s.match(/^(?:module[-_]?|m)(\d{1,2})$/i) || s.match(/^(\d{1,2})$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num >= 1 && num <= 18) {
        return String(num);
      }
    }
    return s;
  }

  return {
    register(id, config) {
      _routes.set(id, {
        id,
        title: config.title || '',
        moduleId: config.moduleId || id
      });
    },

    getRoute(id) { return _routes.get(normalizeRouteId(id)); },

    getAllRoutes() { return Array.from(_routes.keys()); },

    getCurrentRoute() { return _currentRoute; },

    getPreviousRoute() { return _previousRoute; },

    navigateTo(id, options = {}) {
      if (_isNavigating && !options.force) {
        console.log('[Router] Navigation already in progress, queuing...');
        setTimeout(() => this.navigateTo(id, options), 50);
        return;
      }
      
      _isNavigating = true;

      // Normalize route ID using robust helper
      let normId = normalizeRouteId(id);

      const route = _routes.get(normId);

      if (!route) {
        console.warn('[Router] Route not found:', id, '-> normalized:', normId, 'redirecting to home');
        _isNavigating = false;
        if (normId !== 'home') {
          this.navigateTo('home', { force: true });
        }
        return;
      }

      // Skip if already on this route (unless forced)
      if (normId === _currentRoute && !options.force) {
        console.log('[Router] Already on route:', normId);
        _isNavigating = false;
        return;
      }

      console.log('[Router] Navigating from', _currentRoute, 'to', normId);

      _previousRoute = _currentRoute;
      _currentRoute = normId;

      // Update URL first
      _updateURL(normId, options.replace || false);
      
      // Update document title
      document.title = route.title 
        ? `${route.title} — Virtual Research Lab` 
        : 'Interactive Virtual Research Laboratory';

      // Emit events
      EventManager.emit('route:changing', { from: _previousRoute, to: normId });
      EventManager.emit('route:changed', { from: _previousRoute, to: normId });
      _isNavigating = false;
    },

    syncFromURL() {
      console.log('[Router] Syncing from URL:', window.location.hash);
      
      const rawHash = window.location.hash;
      let routeId = normalizeRouteId(rawHash);

      // Validate route exists
      if (!_routes.has(routeId) && routeId !== 'home') {
        console.warn('[Router] Invalid route in URL:', rawHash, '-> normalized:', routeId, 'redirecting to home');
        _currentRoute = 'home';
        _updateURL('home', true);
        EventManager.emit('route:changed', { from: null, to: 'home' });
        return;
      }

      // Skip if already on this route
      if (routeId === _currentRoute) {
        console.log('[Router] Already on route:', routeId);
        return;
      }

      console.log('[Router] URL sync: changing route from', _currentRoute, 'to', routeId);

      _previousRoute = _currentRoute;
      _currentRoute = routeId;
      
      // Update title
      const route = _routes.get(routeId);
      if (route && route.title) {
        document.title = `${route.title} — Virtual Research Lab`;
      }
      
      EventManager.emit('route:changed', { from: _previousRoute || null, to: routeId });
    },

    init() {
      if (_initialized) {
        console.warn('[Router] Already initialized');
        return;
      }
      
      console.log('[Router] Initializing...');
      
      // Remove any existing popstate/hashchange handlers
      if (_popstateHandler) {
        window.removeEventListener('popstate', _popstateHandler);
      }
      
      // Create unified handler for both popstate and hashchange
      _popstateHandler = () => {
        console.log('[Router] History event triggered');
        this.syncFromURL();
      };
      
      window.addEventListener('popstate', _popstateHandler);
      window.addEventListener('hashchange', _popstateHandler);
      
      // Do NOT set _currentRoute here — let syncFromURL() handle initial navigation
      // so it can emit route:changed for deep links and page refreshes
      
      _initialized = true;
    },

    destroy() {
      if (_popstateHandler) {
        window.removeEventListener('popstate', _popstateHandler);
        window.removeEventListener('hashchange', _popstateHandler);
        _popstateHandler = null;
      }
      _routes.clear();
      _initialized = false;
      console.log('[Router] Destroyed');
    }
  };

  function _updateURL(id, replace) {
    const hash = id === 'home' ? '' : `#${id}`;
    const currentHash = window.location.hash;
    const targetHash = hash;
    
    if (currentHash === targetHash) {
      console.log('[Router] URL already correct:', targetHash);
      return;
    }
    
    const method = replace ? 'replaceState' : 'pushState';
    const url = window.location.pathname + window.location.search + hash;
    
    try {
      history[method]({ route: id, timestamp: Date.now() }, '', url);
      console.log('[Router] URL updated to:', url, 'via', method);
    } catch (e) {
      console.error('[Router] Failed to update URL:', e);
    }
  }
})();
