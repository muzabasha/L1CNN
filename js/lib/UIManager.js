const UIManager = (() => {
  let _sidebar = null;
  let _sidebarOverlay = null;
  let _sidebarSpacer = null;
  let _mainContent = null;
  let _mobileMenuBtn = null;
  let _progressFill = null;
  let _progressText = null;

  return {
    init() {
      _sidebar = document.getElementById('sidebar');
      _sidebarOverlay = document.getElementById('sidebar-overlay');
      _sidebarSpacer = document.getElementById('sidebar-spacer');
      _mainContent = document.getElementById('main-content');
      _mobileMenuBtn = document.getElementById('mobile-menu-btn');
      _progressFill = document.getElementById('progress-fill');
      _progressText = document.getElementById('progress-text');

      _bindSidebarToggle();
      _bindMobileToggle();
      _bindOverlayClose();
      _bindNavItems();
    },

    updateSidebarActive(moduleId) {
      document.querySelectorAll('.nav-item').forEach(item => {
        const raw = item.dataset.module || (item.getAttribute('href') || '').replace(/.*#/, '') || '';
        const itemNorm = String(raw).replace(/^module-?/, '');
        const normId = String(moduleId).replace(/^module-?/, '');
        const isActive = itemNorm === normId;
        item.classList.toggle('active', isActive);
        item.setAttribute('aria-current', isActive ? 'page' : 'false');
        item.setAttribute('tabindex', isActive ? '-1' : '0');
      });
    },

    toggleSidebar(force) {
      const isTab = window.innerWidth <= 1024;

      if (isTab) {
        const show = force !== undefined ? force : !StateManager.get('sidebarOpen');
        StateManager.set('sidebarOpen', show);
        if (_sidebar) {
          _sidebar.classList.toggle('mobile-open', show);
          _sidebar.style.width = '';
          _sidebar.style.transform = show ? 'translateX(0)' : '';
          _sidebar.classList.remove('collapsed');
        }
        if (_sidebarOverlay) _sidebarOverlay.classList.toggle('active', show);
        if (_mobileMenuBtn) _mobileMenuBtn.style.display = show ? 'none' : 'flex';
      } else {
        const shouldCollapse = force !== undefined ? force : !StateManager.get('sidebarCollapsed');
        StateManager.set('sidebarCollapsed', shouldCollapse);
        if (_sidebar) {
          _sidebar.style.width = shouldCollapse ? '60px' : '';
          _sidebar.style.transform = '';
          _sidebar.classList.toggle('collapsed', shouldCollapse);
          _sidebar.classList.remove('mobile-open');
          _sidebar.querySelectorAll('.nav-label').forEach(el => {
            el.style.display = shouldCollapse ? 'none' : '';
            el.style.opacity = shouldCollapse ? '0' : '1';
          });
          _sidebar.querySelectorAll('.nav-item').forEach(el => {
            el.style.justifyContent = shouldCollapse ? 'center' : '';
            el.style.padding = shouldCollapse ? '0.75rem' : '';
          });
          const logoText = _sidebar.querySelector('h1.font-orbitron');
          if (logoText) logoText.parentElement.style.display = shouldCollapse ? 'none' : '';
        }
        if (_sidebarSpacer) _sidebarSpacer.style.width = shouldCollapse ? '60px' : '';
        if (_mainContent) _mainContent.style.marginLeft = shouldCollapse ? '60px' : '';
        const toggleBtn = document.getElementById('sidebar-toggle');
        if (toggleBtn) {
          const svg = toggleBtn.querySelector('svg');
          if (svg) svg.style.transform = shouldCollapse ? 'rotate(180deg)' : '';
        }
        if (_sidebarOverlay) _sidebarOverlay.classList.remove('active');
      }
    },

    updateProgress() {
      const pct = StorageManager.getProgress();
      if (_progressFill) _progressFill.style.width = `${pct}%`;
      if (_progressText) _progressText.textContent = `${pct}%`;
    },

    showToast(message, type = 'info', duration = 3000) {
      const toast = document.createElement('div');
      toast.className = 'toast toast-' + type;
      toast.textContent = message;
      toast.style.cssText = [
        'position:fixed', 'bottom:24px', 'right:24px', 'z-index:10000',
        'padding:12px 24px', 'border-radius:12px', 'font-size:14px',
        'font-weight:500', 'backdrop-filter:blur(12px)',
        'background:' + (type === 'error' ? 'rgba(239,68,68,0.9)' :
          type === 'success' ? 'rgba(34,197,94,0.9)' :
          'rgba(59,130,246,0.9)'),
        'color:#fff', 'box-shadow:0 8px 32px rgba(0,0,0,0.3)',
        'transform:translateY(20px)', 'opacity:0',
        'transition:all 0.3s ease'
      ].join(';');
      document.body.appendChild(toast);
      requestAnimationFrame(() => {
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
      });
      setTimeout(() => {
        toast.style.transform = 'translateY(20px)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
      }, duration);
    },

    onResize() {
      const isTab = window.innerWidth <= 1024;
      if (isTab) {
        if (_sidebar) {
          _sidebar.classList.remove('collapsed');
          _sidebar.style.width = '';
          _sidebar.style.transform = '';
        }
        if (_sidebarSpacer) _sidebarSpacer.style.width = '0';
        if (_mainContent) _mainContent.style.marginLeft = '0';
      } else {
        if (_sidebar) {
          _sidebar.classList.remove('mobile-open');
          StateManager.set('sidebarOpen', false);
        }
        if (_sidebarOverlay) _sidebarOverlay.classList.remove('active');
        if (!StateManager.get('sidebarCollapsed')) {
          if (_sidebar) _sidebar.style.width = '';
          if (_sidebarSpacer) _sidebarSpacer.style.width = '';
          if (_mainContent) _mainContent.style.marginLeft = '';
        }
      }
      if (_mobileMenuBtn) _mobileMenuBtn.style.display = isTab ? 'flex' : 'none';
    }
  };

  function _bindSidebarToggle() {
    if (_sidebar) {
      _sidebar.addEventListener('click', (e) => {
        const toggle = e.target.closest('#sidebar-toggle, .sidebar-toggle');
        if (toggle) {
          e.preventDefault();
          UIManager.toggleSidebar();
        }
      });
    }
  }

  function _bindMobileToggle() {
    if (_mobileMenuBtn) {
      _mobileMenuBtn.addEventListener('click', () => UIManager.toggleSidebar());
    }
  }

  function _bindOverlayClose() {
    if (_sidebarOverlay) {
      _sidebarOverlay.addEventListener('click', () => UIManager.toggleSidebar(false));
    }
  }

  function _bindNavItems() {
    const navItems = document.getElementById('nav-items');
    if (navItems) {
      navItems.addEventListener('click', (e) => {
        const item = e.target.closest('.nav-item');
        if (!item) return;
        e.preventDefault();
        const target = item.dataset.module || (item.getAttribute('href') || '').replace(/.*#/, '');
        if (target) {
          Router.navigateTo(target);
        }
      });
    }
  }
})();
