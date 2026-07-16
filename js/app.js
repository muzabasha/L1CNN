/**
 * Interactive Virtual Research Laboratory - Main Application Engine
 * Single Page Application with modular architecture, particle effects,
 * Three.js hero scene, GSAP animations, and interactive components.
 * @version 2.0.0
 */

/* ─────────────────────────────────────────────
   1. Utilities
   ───────────────────────────────────────────── */

const Utils = {
  formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },

  debounce(fn, delay = 200) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  },

  randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  },

  lerp(start, end, t) {
    return start + (end - start) * t;
  },

  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  },

  copyToClipboard(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    this.showNotification('Copied to clipboard!', 'success');
  },

  downloadFile(content, filename, type = 'text/plain') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  showNotification(message, type = 'info') {
    let container = document.getElementById('notification-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'notification-container';
      container.style.cssText =
        'position:fixed;top:20px;right:20px;z-index:10000;display:flex;flex-direction:column;gap:10px;';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    const colors = { success: '#10b981', error: '#ef4444', info: '#3b82f6', warning: '#f59e0b' };
    toast.style.cssText =
      `padding:12px 20px;border-radius:8px;color:#fff;font-size:14px;box-shadow:0 4px 12px rgba(0,0,0,.3);` +
      `background:${colors[type] || colors.info};opacity:0;transform:translateX(40px);transition:all .3s ease;`;
    toast.textContent = message;
    container.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(0)';
    });
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(40px)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  isMobile() {
    return window.innerWidth <= 768;
  },

  isTablet() {
    return window.innerWidth <= 1024;
  },

  normalizeModuleId(id) {
    return String(id).replace(/^module-?/, '');
  },

  toSectionId(id) {
    return id === 'home' ? 'home' : 'module-' + this.normalizeModuleId(id);
  }
};

/* ─────────────────────────────────────────────
   2. Event Bus
   ───────────────────────────────────────────── */

const EventBus = {
  _listeners: {},

  on(event, callback) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(callback);
  },

  off(event, callback) {
    if (!this._listeners[event]) return;
    this._listeners[event] = this._listeners[event].filter(cb => cb !== callback);
  },

  emit(event, data) {
    (this._listeners[event] || []).forEach(cb => cb(data));
  }
};

/* ─────────────────────────────────────────────
   3. Module Engine
   ───────────────────────────────────────────── */

const ModuleEngine = {
  _modules: {},

  register(moduleId, config) {
    this._modules[moduleId] = {
      init: config.init || (() => {}),
      destroy: config.destroy || (() => {}),
      data: config.data || (() => ({})),
      initialized: false
    };
  },

  init(moduleId) {
    let mod = this._modules[moduleId];
    let resolvedId = moduleId;
    if (!mod) {
      const numId = String(moduleId).replace(/^module-?/, '');
      mod = this._modules[numId];
      resolvedId = numId;
    }
    if (!mod) {
      mod = this._modules['module' + moduleId];
      resolvedId = moduleId;
    }
    if (mod && !mod.initialized) {
      const section = document.getElementById('module-' + resolvedId) || document.getElementById(resolvedId);
      mod.init(section);
      mod.initialized = true;
      EventBus.emit('module:init', resolvedId);
    }
  },

  destroy(moduleId) {
    const mod = this._modules[moduleId];
    if (mod && mod.initialized) {
      mod.destroy();
      mod.initialized = false;
      EventBus.emit('module:destroy', moduleId);
    }
  },

  isRegistered(moduleId) {
    return !!this._modules[moduleId];
  }
};

/* ─────────────────────────────────────────────
   4. Interactive Component Helpers
   ───────────────────────────────────────────── */

const Components = {
  createSlider(container, options = {}) {
    const { label = 'Slider', min = 0, max = 100, value = 50, step = 1, onChange } = options;
    const wrapper = document.createElement('div');
    wrapper.className = 'slider-component';
    wrapper.style.cssText = 'margin:12px 0;';
    wrapper.innerHTML = `
      <label style="display:block;font-size:14px;color:#cbd5e1;margin-bottom:6px;">${label}</label>
      <div style="display:flex;align-items:center;gap:12px;">
        <input type="range" min="${min}" max="${max}" value="${value}" step="${step}"
          style="flex:1;accent-color:#3b82f6;" />
        <span class="slider-value" style="min-width:48px;text-align:center;font-weight:600;color:#60a5fa;">${value}</span>
      </div>`;
    const input = wrapper.querySelector('input');
    const display = wrapper.querySelector('.slider-value');
    input.addEventListener('input', () => {
      display.textContent = input.value;
      if (onChange) onChange(Number(input.value));
    });
    container.appendChild(wrapper);
    return { element: wrapper, getValue: () => Number(input.value), setValue: v => { input.value = v; display.textContent = v; } };
  },

  createQuiz(container, questions) {
    const state = { answers: new Array(questions.length).fill(null), submitted: false };
    const wrapper = document.createElement('div');
    wrapper.className = 'quiz-component';

    questions.forEach((q, qi) => {
      const qEl = document.createElement('div');
      qEl.className = 'quiz-question';
      qEl.style.cssText = 'margin-bottom:20px;padding:16px;border-radius:10px;background:rgba(30,41,59,.6);';
      let html = `<p style="font-weight:600;margin-bottom:10px;color:#e2e8f0;">${qi + 1}. ${q.q}</p>`;
      q.options.forEach((opt, oi) => {
        html += `
          <label style="display:flex;align-items:center;gap:8px;padding:8px 12px;margin:4px 0;
            border-radius:6px;cursor:pointer;transition:background .2s;" class="quiz-option">
            <input type="radio" name="quiz-q-${qi}" value="${oi}" style="accent-color:#3b82f6;" />
            <span style="color:#cbd5e1;">${opt}</span>
          </label>`;
      });
      qEl.innerHTML = html;
      qEl.querySelectorAll('input[type=radio]').forEach(radio => {
        radio.addEventListener('change', () => { state.answers[qi] = Number(radio.value); });
      });
      wrapper.appendChild(qEl);
    });

    const btn = document.createElement('button');
    btn.className = 'btn btn-primary';
    btn.textContent = 'Submit Answers';
    btn.style.cssText = 'margin-top:16px;';
    btn.addEventListener('click', () => {
      if (state.submitted) return;
      state.submitted = true;
      btn.disabled = true;
      btn.textContent = 'Submitted';
      let score = 0;
      questions.forEach((q, qi) => {
        const qEl = wrapper.children[qi];
        const options = qEl.querySelectorAll('.quiz-option');
        options.forEach((opt, oi) => {
          if (oi === q.correct) opt.style.background = 'rgba(16,185,129,.25)';
          if (state.answers[qi] === oi && oi !== q.correct) opt.style.background = 'rgba(239,68,68,.25)';
        });
        if (state.answers[qi] === q.correct) score++;
        if (q.explanation) {
          const exp = document.createElement('div');
          exp.style.cssText = 'margin-top:8px;padding:8px 12px;border-radius:6px;background:rgba(59,130,246,.15);font-size:13px;color:#93c5fd;';
          exp.textContent = q.explanation;
          qEl.appendChild(exp);
        }
      });
      EventBus.emit('quiz:complete', { score, total: questions.length });
      Utils.showNotification(`Score: ${score}/${questions.length}`, score === questions.length ? 'success' : 'info');
    });
    wrapper.appendChild(btn);
    container.appendChild(wrapper);
    return { element: wrapper, getState: () => ({ ...state, score: state.submitted ? state.answers.reduce((s, a, i) => s + (a === questions[i].correct ? 1 : 0), 0) : null }) };
  },

  createCodeBlock(container, code, language = 'python') {
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-component';
    wrapper.style.cssText = 'position:relative;margin:12px 0;border-radius:10px;overflow:hidden;background:#0d1117;';
    const header = document.createElement('div');
    header.style.cssText =
      'display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#161b22;border-bottom:1px solid #30363d;';
    header.innerHTML = `<span style="font-size:12px;color:#8b949e;">${language}</span>`;
    const actions = document.createElement('div');
    actions.style.cssText = 'display:flex;gap:8px;';

    const copyBtn = document.createElement('button');
    copyBtn.textContent = 'Copy';
    copyBtn.style.cssText =
      'padding:4px 10px;font-size:12px;border:1px solid #30363d;border-radius:4px;background:#21262d;color:#c9d1d9;cursor:pointer;';
    copyBtn.addEventListener('click', () => Utils.copyToClipboard(code));

    const dlBtn = document.createElement('button');
    dlBtn.textContent = 'Download';
    dlBtn.style.cssText = copyBtn.style.cssText;
    const ext = { python: '.py', javascript: '.js', r: '.R', bash: '.sh' };
    dlBtn.addEventListener('click', () => Utils.downloadFile(code, `code${ext[language] || '.txt'}`));

    actions.appendChild(copyBtn);
    actions.appendChild(dlBtn);
    header.appendChild(actions);
    wrapper.appendChild(header);

    const pre = document.createElement('pre');
    pre.style.cssText = 'margin:0;padding:16px;overflow-x:auto;font-size:13px;line-height:1.6;';
    const codeEl = document.createElement('code');
    codeEl.className = `language-${language}`;
    codeEl.textContent = code;
    pre.appendChild(codeEl);
    wrapper.appendChild(pre);
    container.appendChild(wrapper);

    if (window.Prism) Prism.highlightElement(codeEl);

    return { element: wrapper };
  },

  createChart(container, type, data, options = {}) {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'max-height:400px;';
    container.appendChild(canvas);
    if (window.Chart) {
      return new Chart(canvas.getContext('2d'), { type, data, options: { responsive: true, maintainAspectRatio: true, ...options } });
    }
    return null;
  },

  createPlotlyChart(container, data, options = {}) {
    const div = document.createElement('div');
    div.style.cssText = 'width:100%;min-height:400px;';
    container.appendChild(div);
    if (window.Plotly) {
      Plotly.newPlot(div, data, { responsive: true, ...options });
      return div;
    }
    return null;
  },

  createConfidenceMeter(container, label, value = 0) {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'margin:10px 0;';
    wrapper.innerHTML = `
      <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
        <span style="font-size:13px;color:#94a3b8;">${label}</span>
        <span class="confidence-val" style="font-size:13px;font-weight:600;color:#60a5fa;">${value}%</span>
      </div>
      <div style="width:100%;height:8px;background:#1e293b;border-radius:4px;overflow:hidden;">
        <div class="confidence-bar" style="width:${value}%;height:100%;border-radius:4px;
          background:linear-gradient(90deg,#3b82f6,#8b5cf6);transition:width .8s ease;"></div>
      </div>`;
    container.appendChild(wrapper);
    return {
      element: wrapper,
      setValue(v) {
        wrapper.querySelector('.confidence-bar').style.width = `${v}%`;
        wrapper.querySelector('.confidence-val').textContent = `${v}%`;
      }
    };
  },

  createComparisonTable(container, data) {
    if (!data || !data.length) return null;
    const table = document.createElement('table');
    table.style.cssText = 'width:100%;border-collapse:collapse;font-size:14px;';
    const keys = Object.keys(data[0]);
    let html = '<thead><tr>';
    keys.forEach(k => { html += `<th style="padding:10px;text-align:left;border-bottom:2px solid #334155;color:#94a3b8;cursor:pointer;" data-key="${k}">${k} ↕</th>`; });
    html += '</tr></thead><tbody>';
    let sorted = [...data];
    const render = (rows) => {
      let b = '';
      rows.forEach(r => {
        b += '<tr>';
        keys.forEach(k => { b += `<td style="padding:10px;border-bottom:1px solid #1e293b;color:#e2e8f0;">${r[k]}</td>`; });
        b += '</tr>';
      });
      table.querySelector('tbody').innerHTML = b;
    };
    sorted.forEach(r => {
      html += '<tr>';
      keys.forEach(k => { html += `<td style="padding:10px;border-bottom:1px solid #1e293b;color:#e2e8f0;">${r[k]}</td>`; });
      html += '</tr>';
    });
    html += '</tbody>';
    table.innerHTML = html;

    let sortDir = {};
    table.querySelectorAll('th').forEach(th => {
      th.addEventListener('click', () => {
        const key = th.dataset.key;
        sortDir[key] = !sortDir[key];
        sorted.sort((a, b) => sortDir[key] ? (a[key] > b[key] ? 1 : -1) : (a[key] < b[key] ? 1 : -1));
        render(sorted);
      });
    });

    container.appendChild(table);
    return { element: table };
  },

  destroyChart(chartInstance) {
    if (chartInstance && typeof chartInstance.destroy === 'function') {
      chartInstance.destroy();
    }
  }
};

/* ─────────────────────────────────────────────
   5. NavigationController
   ───────────────────────────────────────────── */

const NavigationController = {
  currentModule: 'home',
  modules: {},
  sidebarCollapsed: false,
  sidebarOpen: false,
  _navigating: false,
  _navItems: [],
  _moduleSections: [],

  init() {
    this._cacheDOM();
    this._populateModuleRegistry();
    this._bindDelegatedEvents();
    this._syncFromURL();
  },

  _cacheDOM() {
    this.sidebar = document.getElementById('sidebar');
    this.sidebarOverlay = document.getElementById('sidebar-overlay');
    this.sidebarSpacer = document.getElementById('sidebar-spacer');
    this.progressFill = document.getElementById('progress-fill');
    this.progressText = document.getElementById('progress-text');
    this.mobileMenuBtn = document.getElementById('mobile-menu-btn');
    this.mainContent = document.getElementById('main-content');
  },

  _populateModuleRegistry() {
    const sections = document.querySelectorAll('.module-section');
    this._moduleSections = [];
    this.modules = {};
    sections.forEach((sec, i) => {
      const rawId = sec.id || sec.dataset.module;
      if (!rawId) return;
      const key = rawId === 'home' ? 'home' : Utils.normalizeModuleId(rawId);
      this.modules[key] = { index: i, element: sec, initialized: false };
      this._moduleSections.push(sec);
    });
  },

  _bindDelegatedEvents() {
    // Sidebar navigation via event delegation
    document.getElementById('nav-items').addEventListener('click', (e) => {
      const item = e.target.closest('.nav-item');
      if (!item) return;
      e.preventDefault();
      const target = item.dataset.module || (item.getAttribute('href') || '').replace(/.*#/, '') || '';
      if (target) {
        this.navigate(Utils.normalizeModuleId(target));
      }
    });

    // Sidebar toggle
    if (this.sidebar) {
      this.sidebar.addEventListener('click', (e) => {
        const toggle = e.target.closest('#sidebar-toggle, .sidebar-toggle');
        if (toggle) {
          e.preventDefault();
          this.toggleSidebar();
        }
      });
    }

    // Mobile menu button
    if (this.mobileMenuBtn) {
      this.mobileMenuBtn.addEventListener('click', () => this.toggleSidebar());
    }

    // Sidebar overlay close
    if (this.sidebarOverlay) {
      this.sidebarOverlay.addEventListener('click', () => this.toggleSidebar(false));
    }

    // data-navigate delegation (pipeline steps, featured cards)
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-navigate]');
      if (btn) {
        e.preventDefault();
        const target = btn.dataset.navigate;
        if (target) this.navigate(target);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const btn = e.target.closest('[data-navigate]');
      if (btn && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        const target = btn.dataset.navigate;
        if (target) this.navigate(target);
      }
    });

    // keyboard nav: arrow keys
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        this._navigateByOffset(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this._navigateByOffset(-1);
      }
    });

    // Hash change
    window.addEventListener('hashchange', () => this._onHashChange());

    // Resize
    window.addEventListener('resize', Utils.debounce(() => this._onResize(), 250));
  },

  navigate(moduleId) {
    const normalized = Utils.normalizeModuleId(moduleId);
    const mod = this.modules[normalized];

    // Guard: if module doesn't exist, go home
    if (!mod && normalized !== 'home') {
      this.navigate('home');
      return;
    }

    // Guard: skip if already on this module — but allow re-navigate if never initialized
    if (normalized === this.currentModule && mod && mod.initialized) return;

    // Destroy previous module
    const prevKey = this.currentModule;
    const prevMod = this.modules[prevKey];
    if (prevMod && prevMod.initialized) {
      ModuleEngine.destroy(prevKey);
      prevMod.initialized = false;
    }

    // Hide all sections
    this._moduleSections.forEach(sec => {
      sec.classList.add('hidden');
      sec.classList.remove('active');
      sec.style.opacity = '0';
      sec.style.transform = 'translateY(10px)';
    });

    // Show target section
    const sectionId = Utils.toSectionId(normalized);
    const target = document.getElementById(sectionId);
    if (target) {
      target.classList.remove('hidden');
      target.style.opacity = '0';
      target.style.transform = 'translateY(10px)';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          target.classList.add('active');
          target.style.opacity = '1';
          target.style.transform = 'translateY(0)';
        });
      });
    }

    // Update state
    this.currentModule = normalized;
    this._updateSidebarActive(normalized);
    this._syncURL(normalized);

    // Initialize module
    this._initModuleIfFirst(normalized);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Auto-close sidebar on mobile
    if (Utils.isMobile()) this.toggleSidebar(false);

    EventBus.emit('module:change', normalized);
  },

  _initModuleIfFirst(moduleId) {
    const mod = this.modules[moduleId];
    if (mod && !mod.initialized) {
      mod.initialized = true;
      ModuleEngine.init(moduleId);
      // Record visit & update progress
      this._recordVisit(moduleId);
      this._updateProgress();
      EventBus.emit('module:firstInit', moduleId);
    }
  },

  _syncURL(moduleId) {
    const sectionId = Utils.toSectionId(moduleId);
    const currentHash = window.location.hash.replace('#', '');
    if (currentHash !== sectionId) {
      this._navigating = true;
      window.location.hash = sectionId;
      this._navigating = false;
    }
  },

  _onHashChange() {
    if (this._navigating) return;
    const hash = window.location.hash.replace('#', '') || 'home';
    const moduleId = hash.startsWith('module-') ? hash.replace('module-', '') : hash;
    if (this.modules[moduleId]) {
      this.navigate(moduleId);
    } else if (hash !== 'home') {
      window.location.hash = 'home';
    }
  },

  _syncFromURL() {
    const hash = window.location.hash.replace('#', '') || 'home';
    const moduleId = hash.startsWith('module-') ? hash.replace('module-', '') : hash;
    if (this.modules[moduleId]) {
      this.currentModule = moduleId;
      this._showSection(moduleId);
      this._updateSidebarActive(moduleId);
      this._initModuleIfFirst(moduleId);
    } else {
      this._showSection('home');
      this._updateSidebarActive('home');
    }
  },

  _showSection(moduleId) {
    this._moduleSections.forEach(sec => {
      sec.classList.add('hidden');
      sec.classList.remove('active');
      sec.style.opacity = '0';
      sec.style.transform = 'translateY(10px)';
    });
    const sectionId = Utils.toSectionId(moduleId);
    const target = document.getElementById(sectionId);
    if (target) {
      target.classList.remove('hidden');
      target.classList.add('active');
      target.style.opacity = '1';
      target.style.transform = 'translateY(0)';
    }
  },

  _navigateByOffset(offset) {
    const ids = Object.keys(this.modules);
    const idx = ids.indexOf(this.currentModule);
    const next = ids[idx + offset];
    if (next) this.navigate(next);
  },

  _updateSidebarActive(moduleId) {
    document.querySelectorAll('.nav-item').forEach(item => {
      const raw = item.dataset.module || (item.getAttribute('href') || '').replace(/.*#/, '') || '';
      const itemNorm = Utils.normalizeModuleId(raw);
      const isActive = itemNorm === moduleId;
      item.classList.toggle('active', isActive);
      if (isActive) {
        item.setAttribute('aria-current', 'page');
      } else {
        item.removeAttribute('aria-current');
      }
    });
  },

  toggleSidebar(force) {
    var isTab = Utils.isTablet();
    if (isTab) {
      var show = force !== undefined ? force : !this.sidebarOpen;
      this.sidebarOpen = show;
      if (this.sidebar) {
        this.sidebar.classList.toggle('mobile-open', show);
        this.sidebar.style.width = '';
        this.sidebar.style.transform = show ? 'translateX(0)' : '';
        this.sidebar.classList.remove('collapsed');
      }
      if (this.sidebarOverlay) {
        this.sidebarOverlay.classList.toggle('active', show);
      }
      if (this.mobileMenuBtn) {
        this.mobileMenuBtn.style.display = show ? 'none' : 'flex';
      }
    } else {
      var shouldCollapse = force !== undefined ? force : !this.sidebarCollapsed;
      this.sidebarCollapsed = shouldCollapse;
      if (this.sidebar) {
        this.sidebar.style.width = shouldCollapse ? '60px' : '';
        this.sidebar.style.transform = '';
        this.sidebar.classList.toggle('collapsed', shouldCollapse);
        this.sidebar.classList.remove('mobile-open');
      }
      if (this.sidebarSpacer) {
        this.sidebarSpacer.style.width = shouldCollapse ? '60px' : '';
      }
      if (this.mainContent) {
        this.mainContent.style.marginLeft = shouldCollapse ? '60px' : '';
      }
      if (this.sidebarOverlay) {
        this.sidebarOverlay.classList.remove('active');
      }
    }
  },

  _recordVisit(moduleId) {
    if (moduleId === 'home') return;
    let visited = new Set();
    try {
      const saved = localStorage.getItem('lab-visited');
      if (saved) visited = new Set(JSON.parse(saved));
    } catch (e) { /* noop */ }
    visited.add(moduleId);
    try { localStorage.setItem('lab-visited', JSON.stringify([...visited])); } catch (e) { /* noop */ }
  },

  _updateProgress() {
    const total = Object.keys(this.modules).length - 1; // exclude home
    if (total <= 0) return;
    let visited = new Set();
    try {
      const saved = localStorage.getItem('lab-visited');
      if (saved) visited = new Set(JSON.parse(saved));
    } catch (e) { /* noop */ }
    const pct = Math.round((visited.size / total) * 100);
    if (this.progressFill) this.progressFill.style.width = `${pct}%`;
    if (this.progressText) this.progressText.textContent = `${pct}%`;
  },

  _onResize() {
    var isTab = Utils.isTablet();
    if (isTab) {
      if (this.sidebar) {
        this.sidebar.classList.remove('collapsed');
        this.sidebar.style.width = '';
        this.sidebar.style.transform = '';
      }
      if (this.sidebarSpacer) this.sidebarSpacer.style.width = '0';
      if (this.mainContent) this.mainContent.style.marginLeft = '0';
    } else {
      if (this.sidebar) {
        this.sidebar.classList.remove('mobile-open');
        this.sidebarOpen = false;
      }
      if (this.sidebarOverlay) {
        this.sidebarOverlay.classList.remove('active');
      }
      if (!this.sidebarCollapsed) {
        if (this.sidebar) this.sidebar.style.width = '';
        if (this.sidebarSpacer) this.sidebarSpacer.style.width = '';
        if (this.mainContent) this.mainContent.style.marginLeft = '';
      }
    }
    if (this.mobileMenuBtn) {
      this.mobileMenuBtn.style.display = isTab ? 'flex' : 'none';
    }
  }
};

/* ─────────────────────────────────────────────
   6. Particles Background Animation
   ───────────────────────────────────────────── */

function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;
  const PARTICLE_COUNT = window.innerWidth < 768 ? 50 : 100;
  const COLORS = ['rgba(59,130,246,', 'rgba(34,211,238,', 'rgba(139,92,246,'];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Utils.randomBetween(1, 3),
      vx: Utils.randomBetween(-0.4, 0.4),
      vy: Utils.randomBetween(-0.4, 0.4),
      opacity: Utils.randomBetween(0.2, 0.6),
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    };
  }

  function init() {
    resize();
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(createParticle());
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color}${p.opacity})`;
      ctx.fill();
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `${p.color}${(1 - dist / 150) * 0.25})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    animId = requestAnimationFrame(draw);
  }

  init();
  draw();
  window.addEventListener('resize', Utils.debounce(() => { resize(); }, 300));

  return { destroy() { cancelAnimationFrame(animId); } };
}

/* ─────────────────────────────────────────────
   7. Three.js Hero Scene
   ───────────────────────────────────────────── */

function initHero3D() {
  const container = document.getElementById('hero-3d');
  if (!container || !window.THREE) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const group = new THREE.Group();

  const mainMat = new THREE.MeshPhongMaterial({
    color: 0x2563eb, transparent: true, opacity: 0.55,
    shininess: 80, side: THREE.DoubleSide
  });
  const mainGeo = new THREE.SphereGeometry(1.2, 32, 32);
  mainGeo.scale(1.3, 0.9, 1.1);
  const mainMesh = new THREE.Mesh(mainGeo, mainMat);
  group.add(mainMesh);

  const wireMat = new THREE.MeshBasicMaterial({ color: 0x60a5fa, wireframe: true, transparent: true, opacity: 0.25 });
  const wireMesh = new THREE.Mesh(mainGeo.clone(), wireMat);
  wireMesh.scale.set(1.02, 1.02, 1.02);
  group.add(wireMesh);

  const lobeGeo = new THREE.SphereGeometry(0.6, 24, 24);
  const lobeR = new THREE.Mesh(lobeGeo, mainMat.clone());
  lobeR.position.set(0.8, 0.3, 0.2);
  lobeR.material.opacity = 0.45;
  group.add(lobeR);

  const lobeL = new THREE.Mesh(lobeGeo.clone(), mainMat.clone());
  lobeL.position.set(-0.85, 0.2, 0.15);
  lobeL.scale.set(0.85, 0.85, 0.85);
  lobeL.material.opacity = 0.4;
  group.add(lobeL);

  scene.add(group);

  const ambientLight = new THREE.AmbientLight(0x4c1d95, 0.6);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0x7c3aed, 1.2);
  dirLight.position.set(3, 4, 5);
  scene.add(dirLight);

  const backLight = new THREE.DirectionalLight(0x06b6d4, 0.5);
  backLight.position.set(-3, -2, -4);
  scene.add(backLight);

  const particleCount = 60;
  const pGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = Utils.randomBetween(-3, 3);
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const pMat = new THREE.PointsMaterial({ color: 0x60a5fa, size: 0.04, transparent: true, opacity: 0.7 });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  let animId;
  function animate() {
    animId = requestAnimationFrame(animate);
    group.rotation.y += 0.004;
    group.rotation.x = Math.sin(Date.now() * 0.0005) * 0.1;
    particles.rotation.y += 0.001;
    particles.rotation.x += 0.0005;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', Utils.debounce(() => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }, 200));

  return { destroy() { cancelAnimationFrame(animId); renderer.dispose(); container.removeChild(renderer.domElement); } };
}

/* ─────────────────────────────────────────────
   8. GSAP Scroll Animations
   ───────────────────────────────────────────── */

function initScrollAnimations() {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray('.animate-in').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
      }
    );
  });

  const heroTitle = document.querySelector('.hero-glow');
  if (heroTitle) {
    gsap.fromTo(heroTitle, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: 'power3.out' });
  }

  const heroSub = document.querySelector('#home .text-accent-400');
  if (heroSub) {
    gsap.fromTo(heroSub, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.6, ease: 'power2.out' });
  }

  gsap.utils.toArray('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target, duration: 2, ease: 'power1.out', delay: 0.5,
      scrollTrigger: { trigger: el, start: 'top 85%' },
      onUpdate() { el.textContent = Utils.formatNumber(Math.round(obj.val)); }
    });
  });
}

/* ─────────────────────────────────────────────
   9. Module Prev/Next Navigation Builder
   ───────────────────────────────────────────── */

function buildModuleNavigation() {
  const TOTAL = 18;
  for (let n = 1; n <= TOTAL; n++) {
    const sec = document.getElementById('module-' + n);
    if (!sec) continue;
    if (sec.querySelector('.module-nav-footer')) continue;

    const prevId = n === 1 ? 'home' : String(n - 1);
    const nextId = n === TOTAL ? null : String(n + 1);

    const nav = document.createElement('div');
    nav.className = 'module-nav-footer';
    nav.style.cssText = [
      'display:flex',
      'justify-content:space-between',
      'align-items:center',
      'padding:1.5rem 2rem',
      'margin-top:2rem',
      'border-top:1px solid rgba(59,130,246,0.2)',
      'gap:1rem'
    ].join(';');

    const btnStyle = [
      'display:inline-flex',
      'align-items:center',
      'gap:8px',
      'padding:10px 20px',
      'border-radius:10px',
      'font-size:14px',
      'font-weight:600',
      'cursor:pointer',
      'border:1px solid rgba(59,130,246,0.35)',
      'background:rgba(59,130,246,0.1)',
      'color:#60a5fa',
      'transition:all .2s ease',
      'text-decoration:none'
    ].join(';');

    const prevLabel = n === 1 ? '← Home' : ('← Module ' + (n - 1));
    const prevBtn = document.createElement('button');
    prevBtn.className = 'module-nav-btn module-nav-prev';
    prevBtn.setAttribute('aria-label', n === 1 ? 'Go to Home' : 'Go to previous module');
    prevBtn.style.cssText = btnStyle;
    prevBtn.innerHTML = prevLabel;
    prevBtn.addEventListener('click', () => NavigationController.navigate(prevId));
    prevBtn.addEventListener('mouseover', () => { prevBtn.style.background = 'rgba(59,130,246,0.25)'; prevBtn.style.borderColor = '#60a5fa'; });
    prevBtn.addEventListener('mouseout', () => { prevBtn.style.background = 'rgba(59,130,246,0.1)'; prevBtn.style.borderColor = 'rgba(59,130,246,0.35)'; });

    const counter = document.createElement('span');
    counter.style.cssText = 'font-size:12px;color:#64748b;white-space:nowrap;';
    counter.textContent = 'Module ' + n + ' / ' + TOTAL;

    nav.appendChild(prevBtn);
    nav.appendChild(counter);

    if (nextId) {
      const nextLabel = 'Module ' + (n + 1) + ' →';
      const nextBtn = document.createElement('button');
      nextBtn.className = 'module-nav-btn module-nav-next';
      nextBtn.setAttribute('aria-label', 'Go to next module');
      const nextBtnStyle = btnStyle
        .replace('rgba(59,130,246,0.1)', 'rgba(59,130,246,0.2)')
        .replace('color:#60a5fa', 'color:#93c5fd');
      nextBtn.style.cssText = nextBtnStyle;
      nextBtn.innerHTML = nextLabel;
      nextBtn.addEventListener('click', () => NavigationController.navigate(nextId));
      nextBtn.addEventListener('mouseover', () => { nextBtn.style.background = 'rgba(59,130,246,0.35)'; nextBtn.style.borderColor = '#93c5fd'; });
      nextBtn.addEventListener('mouseout', () => { nextBtn.style.background = 'rgba(59,130,246,0.2)'; nextBtn.style.borderColor = 'rgba(59,130,246,0.35)'; });
      nav.appendChild(nextBtn);
    } else {
      const homeBtn = document.createElement('button');
      homeBtn.className = 'module-nav-btn module-nav-home';
      homeBtn.setAttribute('aria-label', 'Return to Home');
      homeBtn.style.cssText = btnStyle
        .replace('rgba(59,130,246,0.1)', 'rgba(16,185,129,0.15)')
        .replace('rgba(59,130,246,0.35)', 'rgba(16,185,129,0.4)')
        .replace('color:#60a5fa', 'color:#34d399');
      homeBtn.innerHTML = '\u{1F3E0} Back to Home';
      homeBtn.addEventListener('click', () => NavigationController.navigate('home'));
      nav.appendChild(homeBtn);
    }

    sec.appendChild(nav);
  }
}

/* ─────────────────────────────────────────────
   10. Bootstrap
   ───────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  NavigationController.init();
  buildModuleNavigation();
  initParticles();
  initHero3D();
  setTimeout(initScrollAnimations, 100);
});

// Expose for inline onclick in index.html
window.vrlApp = {
  navigateTo: (id) => NavigationController.navigate(id),
  toggleSidebar: (force) => NavigationController.toggleSidebar(force)
};
