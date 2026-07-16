const EventManager = (() => {
  const _events = new Map();

  return {
    on(event, callback) {
      if (!_events.has(event)) _events.set(event, []);
      _events.get(event).push(callback);
      return () => this.off(event, callback);
    },

    off(event, callback) {
      const cbs = _events.get(event);
      if (!cbs) return;
      const idx = cbs.indexOf(callback);
      if (idx > -1) cbs.splice(idx, 1);
    },

    emit(event, data) {
      const cbs = _events.get(event);
      if (!cbs) return;
      cbs.forEach(cb => { try { cb(data); } catch (e) { console.warn('[EventManager]', event, e); } });
    },

    clear(event) {
      if (event) _events.delete(event);
      else _events.clear();
    }
  };
})();
