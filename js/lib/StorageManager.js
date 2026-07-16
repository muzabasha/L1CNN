const StorageManager = (() => {
  const _prefix = 'vrlab_';

  return {
    get(key) {
      try {
        const val = localStorage.getItem(_prefix + key);
        return val ? JSON.parse(val) : null;
      } catch (e) { return null; }
    },

    set(key, value) {
      try {
        localStorage.setItem(_prefix + key, JSON.stringify(value));
        return true;
      } catch (e) { return false; }
    },

    remove(key) {
      try {
        localStorage.removeItem(_prefix + key);
        return true;
      } catch (e) { return false; }
    },

    getVisitedModules() {
      return this.get('visited') || [];
    },

    addVisitedModule(id) {
      const visited = this.getVisitedModules();
      if (!visited.includes(id)) {
        visited.push(id);
        this.set('visited', visited);
      }
    },

    getProgress() {
      const visited = this.getVisitedModules();
      return Math.round((visited.length / 18) * 100);
    },

    saveExperimentState(moduleId, state) {
      this.set('experiment_' + moduleId, state);
    },

    loadExperimentState(moduleId) {
      return this.get('experiment_' + moduleId) || {};
    },

    clearAll() {
      const keys = Object.keys(localStorage);
      keys.forEach(k => {
        if (k.startsWith(_prefix)) localStorage.removeItem(k);
      });
    }
  };
})();
