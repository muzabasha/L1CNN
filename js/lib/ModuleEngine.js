const ModuleEngine = (() => {
  const _modules = new Map();
  const _activeModuleId = { current: null };

  return {
    register(id, config) {
      _modules.set(id, {
        init: config.init || (() => {}),
        destroy: config.destroy || (() => {}),
        update: config.update || null,
        data: config.data || null,
        initialized: false
      });
    },

    init(moduleId) {
      const mod = _modules.get(moduleId);
      if (!mod || mod.initialized) return false;

      const container = document.getElementById('module-' + moduleId) ||
                        document.getElementById(moduleId);
      if (!container) return false;

      mod.init(container);
      mod.initialized = true;
      _activeModuleId.current = moduleId;

      StorageManager.addVisitedModule(moduleId);
      UIManager.updateProgress();
      EventManager.emit('module:init', moduleId);
      return true;
    },

    destroy(moduleId) {
      const mod = _modules.get(moduleId);
      if (!mod || !mod.initialized) return;

      mod.destroy();
      mod.initialized = false;
      if (_activeModuleId.current === moduleId) {
        _activeModuleId.current = null;
      }
      EventManager.emit('module:destroy', moduleId);
    },

    getActiveModule() {
      return _activeModuleId.current;
    },

    isInitialized(moduleId) {
      const mod = _modules.get(moduleId);
      return mod ? mod.initialized : false;
    },

    update(moduleId, data) {
      const mod = _modules.get(moduleId);
      if (mod && mod.update) mod.update(data);
    }
  };
})();
