const SimulationManager = (() => {
  const _experiments = new Map();

  return {
    createControls(container, config = {}) {
      const { onRun, onReset, runLabel, resetLabel, initialStatus } = config;
      const wrapper = document.createElement('div');
      wrapper.className = 'sim-controls';
      wrapper.style.justifyContent = 'flex-end';

      const status = document.createElement('span');
      status.className = 'run-indicator';
      status.textContent = initialStatus || 'Ready';
      wrapper.appendChild(status);

      if (onRun) {
        const runBtn = document.createElement('button');
        runBtn.className = 'btn btn-success btn-sm';
        runBtn.innerHTML = '\u25B6 ' + (runLabel || 'Run Simulation');
        runBtn.addEventListener('click', () => {
          onRun();
          status.textContent = 'Running...';
          status.classList.add('pulse');
        });
        wrapper.appendChild(runBtn);
      }

      if (onReset) {
        const resetBtn = document.createElement('button');
        resetBtn.className = 'btn btn-warning btn-sm';
        resetBtn.innerHTML = '\u21BA ' + (resetLabel || 'Reset');
        resetBtn.addEventListener('click', () => {
          onReset();
          status.textContent = 'Ready';
          status.classList.remove('pulse');
        });
        wrapper.appendChild(resetBtn);
      }

      container.appendChild(wrapper);
      return { status, setStatus: (s) => { status.textContent = s; status.classList.toggle('pulse', s === 'Running...'); } };
    },

    trackExperiment(id, initialState = {}) {
      const state = { ...initialState, started: Date.now(), completed: false };
      _experiments.set(id, state);
      return {
        getState: () => _experiments.get(id),
        update: (updates) => {
          Object.assign(state, updates);
          return state;
        },
        complete: () => { state.completed = true; state.ended = Date.now(); },
        reset: () => { Object.assign(state, initialState, { started: Date.now(), completed: false }); }
      };
    },

    getExperiment(id) {
      return _experiments.get(id);
    }
  };
})();
