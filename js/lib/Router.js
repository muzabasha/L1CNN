const Router = (() => {
  let _currentRoute = 'home';
  let _previousRoute = null;
  let _routes = new Map();
  let _isNavigating = false;

  return {
    register(id, config) {
      _routes.set(id, {
        id,
        title: config.title || '',
        moduleId: config.moduleId || id
      });
    },

    getRoute(id) { return _routes.get(id); },

    getAllRoutes() { return Array.from(_routes.keys()); },

    getCurrentRoute() { return _currentRoute; },

    getPreviousRoute() { return _previousRoute; },

    navigateTo(id, options = {}) {
      if (_isNavigating) return;
      _isNavigating = true;

      let normId = id.startsWith('module-') ? id.replace('module-', '') : id;
      const route = _routes.get(normId);

      if (!route) {
        _isNavigating = false;
        if (normId !== 'home') this.navigateTo('home');
        return;
      }

      if (normId === _currentRoute && !options.force) {
        _isNavigating = false;
        return;
      }

      _previousRoute = _currentRoute;
      _currentRoute = normId;

      _updateURL(normId, false);
      EventManager.emit('route:changing', { from: _previousRoute, to: normId });
      EventManager.emit('route:changed', { from: _previousRoute, to: normId });
      _isNavigating = false;
    },

    syncFromURL() {
      const hash = window.location.hash.replace('#', '') || 'home';
      const routeId = hash.startsWith('module-') ? hash.replace('module-', '') : hash;

      if (!_routes.has(routeId)) {
        _currentRoute = 'home';
        _updateURL('home', true);
        EventManager.emit('route:changed', { from: null, to: 'home' });
        return;
      }

      if (routeId === _currentRoute) return;

      _previousRoute = _currentRoute;
      _currentRoute = routeId;
      _updateURL(routeId, true);
      EventManager.emit('route:changed', { from: _previousRoute || null, to: routeId });
    },

    init() {
      window.addEventListener('popstate', () => this.syncFromURL());
    },

    destroy() {
      _routes.clear();
    }
  };

  function _updateURL(id, replace) {
    const hash = id === 'home' ? '' : id;
    const curHash = window.location.hash.replace('#', '');
    if (curHash === hash) return;
    const method = replace ? 'replaceState' : 'pushState';
    history[method]({ route: id }, '', '#' + hash);
  }
})();
