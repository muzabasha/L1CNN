const ThemeManager = (() => {
  let _currentTheme = 'dark';
  const _root = document.documentElement;

  const _themes = {
    dark: {
      '--bg-primary': '#0a0a1a',
      '--bg-secondary': '#12122a',
      '--bg-card': 'rgba(30, 30, 50, 0.6)',
      '--bg-glass': 'rgba(20, 20, 40, 0.7)',
      '--text-primary': '#e2e8f0',
      '--text-secondary': '#94a3b8',
      '--text-muted': '#64748b',
      '--border': 'rgba(255, 255, 255, 0.08)',
      '--border-hover': 'rgba(255, 255, 255, 0.15)',
      '--shadow': '0 8px 32px rgba(0, 0, 0, 0.4)',
      '--shadow-lg': '0 16px 48px rgba(0, 0, 0, 0.5)',
      '--glow-primary': '0 0 20px rgba(99, 102, 241, 0.3)',
      '--glow-accent': '0 0 20px rgba(20, 184, 166, 0.3)'
    },
    light: {
      '--bg-primary': '#f8fafc',
      '--bg-secondary': '#f1f5f9',
      '--bg-card': 'rgba(255, 255, 255, 0.7)',
      '--bg-glass': 'rgba(255, 255, 255, 0.8)',
      '--text-primary': '#0f172a',
      '--text-secondary': '#475569',
      '--text-muted': '#94a3b8',
      '--border': 'rgba(0, 0, 0, 0.08)',
      '--border-hover': 'rgba(0, 0, 0, 0.15)',
      '--shadow': '0 8px 32px rgba(0, 0, 0, 0.1)',
      '--shadow-lg': '0 16px 48px rgba(0, 0, 0, 0.15)',
      '--glow-primary': '0 0 20px rgba(99, 102, 241, 0.15)',
      '--glow-accent': '0 0 20px rgba(20, 184, 166, 0.15)'
    }
  };

  return {
    getCurrent() { return _currentTheme; },

    setTheme(theme) {
      if (!_themes[theme]) return;
      _currentTheme = theme;
      const vars = _themes[theme];
      Object.entries(vars).forEach(([key, val]) => {
        _root.style.setProperty(key, val);
      });
      _root.setAttribute('data-theme', theme);
      StateManager.set('userPreferences.theme', theme);
      StateManager.savePreferences();
      EventManager.emit('theme:changed', theme);
    },

    toggle() {
      this.setTheme(_currentTheme === 'dark' ? 'light' : 'dark');
    },

    setReducedMotion(enabled) {
      _root.style.setProperty('--animation-speed', enabled ? '0' : '1');
      StateManager.set('userPreferences.reducedMotion', enabled);
      StateManager.savePreferences();
    },

    setHighContrast(enabled) {
      _root.classList.toggle('high-contrast', enabled);
      StateManager.set('userPreferences.highContrast', enabled);
      StateManager.savePreferences();
    },

    init() {
      const prefs = StateManager.get('userPreferences');
      if (prefs) {
        this.setTheme(prefs.theme || 'dark');
        this.setReducedMotion(prefs.reducedMotion || false);
        this.setHighContrast(prefs.highContrast || false);
      } else {
        this.setTheme('dark');
      }
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        this.setReducedMotion(true);
      }
    }
  };
})();
