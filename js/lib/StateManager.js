const StateManager = (() => {
  let _state = {
    currentModule: 'home',
    previousModule: null,
    sidebarCollapsed: false,
    sidebarOpen: false,
    visitedModules: new Set(),
    moduleProgress: {},
    userPreferences: {
      theme: 'dark',
      animationSpeed: 1.0,
      reducedMotion: false,
      highContrast: false
    },
    experimentState: {}
  };

  const _listeners = new Map();

  function _get(key) {
    return key.split('.').reduce((o, k) => o && o[k] !== undefined ? o[k] : undefined, _state);
  }

  function _set(key, value) {
    const keys = key.split('.');
    const target = keys.slice(0, -1).reduce((o, k) => {
      if (!(k in o)) o[k] = {};
      return o[k];
    }, _state);
    const lastKey = keys[keys.length - 1];
    const oldValue = target[lastKey];
    target[lastKey] = value;
    _notify(key, value, oldValue);
  }

  function _notify(key, newVal, oldVal) {
    _listeners.forEach((cb, k) => {
      if (key.startsWith(k)) cb(newVal, oldVal, key);
    });
  }

  return {
    get(key) { return _get(key); },

    set(key, value) { _set(key, value); },

    getAll() { return _state; },

    observe(key, callback) {
      _listeners.set(key, callback);
      return () => _listeners.delete(key);
    },

    recordVisit(moduleId) {
      _state.visitedModules.add(moduleId);
      _state.previousModule = _state.currentModule;
      _state.currentModule = moduleId;
      try {
        localStorage.setItem('lab-visited', JSON.stringify([..._state.visitedModules]));
      } catch (e) { /* noop */ }
      _notify('currentModule', moduleId, _state.previousModule);
      _notify('visitedModules', _state.visitedModules, null);
    },

    loadFromStorage() {
      try {
        const visited = localStorage.getItem('lab-visited');
        if (visited) _state.visitedModules = new Set(JSON.parse(visited));
      } catch (e) { /* noop */ }
      try {
        const prefs = localStorage.getItem('lab-preferences');
        if (prefs) Object.assign(_state.userPreferences, JSON.parse(prefs));
      } catch (e) { /* noop */ }
    },

    savePreferences() {
      try {
        localStorage.setItem('lab-preferences', JSON.stringify(_state.userPreferences));
      } catch (e) { /* noop */ }
    },

    getProgress() {
      const total = 18;
      return Math.round((_state.visitedModules.size / total) * 100);
    },

    reset() {
      _state.visitedModules = new Set();
      _state.currentModule = 'home';
      _state.previousModule = null;
      try { localStorage.removeItem('lab-visited'); } catch (e) { /* noop */ }
    }
  };
})();
