const Router = (() => {
  let _currentRoute = 'home';
  let _previousRoute = null;
  let _routes = new Map();
  let _initialSyncDone = false;

  const _Route = class {
    constructor(id, config) {
      this.id = id;
      this.title = config.title || '';
      this.moduleId = config.moduleId || id;
      this.init = config.init || null;
      this.destroy = config.destroy || null;
      this.requiresAuth = config.requiresAuth || false;
    }
  };

  return {
    register(id, config) {
      _routes.set(id, new _Route(id, config));
    },

    getRoute(id) {
      return _routes.get(id);
    },

    getAllRoutes() {
      return Array.from(_routes.keys());
    },

    getCurrentRoute() {
      return _currentRoute;
    },

    getPreviousRoute() {
      return _previousRoute;
    },

    navigateTo(id, options = {}) {
      const route = _routes.get(id);
      if (!route) {
        if (id !== 'home') this.navigateTo('home');
        return;
      }

      if (id === _currentRoute && !options.force) return;

      _previousRoute = _currentRoute;
      _currentRoute = id;

      _updateURL(id);

      EventManager.emit('route:changing', { from: _previousRoute, to: id });
      EventManager.emit('route:changed', { from: _previousRoute, to: id });
    },

    goBack() {
      if (_previousRoute) this.navigateTo(_previousRoute, { force: true });
    },

    syncFromURL() {
      const hash = window.location.hash.replace('#', '') || 'home';
      const routeId = hash.startsWith('module-') ? hash : hash;
      if (_routes.has(routeId)) {
        _currentRoute = routeId;
        _updateURL(routeId);
        EventManager.emit('route:changed', { from: null, to: routeId });
      } else {
        _currentRoute = 'home';
        _updateURL('home');
        EventManager.emit('route:changed', { from: null, to: 'home' });
      }
      _initialSyncDone = true;
    },

    _onHashChange() {
      if (!_initialSyncDone) return;
      const hash = window.location.hash.replace('#', '') || 'home';
      const routeId = hash.startsWith('module-') ? hash : hash;
      if (_routes.has(routeId) && routeId !== _currentRoute) {
        this.navigateTo(routeId);
      }
    },

    init() {
      window.addEventListener('hashchange', () => this._onHashChange());
    }
  };

  function _updateURL(id) {
    const hash = id === 'home' ? '' : id;
    const currentHash = window.location.hash.replace('#', '');
    if (currentHash !== hash) {
      history.pushState(null, '', '#' + hash);
    }
  }
})();
