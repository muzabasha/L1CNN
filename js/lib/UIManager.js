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
      console.log('[UIManager] Updating sidebar active state for:', moduleId);
      
      document.querySelectorAll('.nav-item').forEach(item => {
        // Get the module ID from multiple possible sources
        const itemModule = item.dataset.module || 
                          item.getAttribute('data-navigate') ||
                          (item.getAttribute('href') || '').replace(/.*#/, '').replace('module-', '');
        
        // Normalize both IDs for comparison
        const itemNorm = String(itemModule).trim().replace(/^module-?/, '');
        const normId = String(moduleId).trim().replace(/^module-?/, '');
        
        const isActive = itemNorm === normId;
        
        // Update visual state
        item.classList.toggle('active', isActive);
        
        // Update ARIA attributes
        if (isActive) {
          item.setAttribute('aria-current', 'page');
          item.setAttribute('tabindex', '0');
        } else {
          item.removeAttribute('aria-current');
          item.setAttribute('tabindex', '0');
        }
      });
      
      console.log('[UIManager] Sidebar active state updated');
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
        document.body.classList.toggle('sidebar-open', show);
        if (_mobileMenuBtn) {
          _mobileMenuBtn.style.display = show ? 'none' : 'flex';
          _mobileMenuBtn.setAttribute('aria-expanded', String(show));
        }
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
        const toggleBtn = document.getElementById('sidebar-toggle');
        if (toggleBtn) {
          toggleBtn.setAttribute('aria-expanded', String(!shouldCollapse));
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
      const progressBar = document.querySelector('[role="progressbar"]');
      if (progressBar) progressBar.setAttribute('aria-valuenow', String(pct));
    },

    showToast(message, type = 'info', duration = 3000) {
      const toast = document.createElement('div');
      toast.className = 'toast toast-' + type;
      toast.setAttribute('role', 'alert');
      toast.setAttribute('aria-live', 'assertive');
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
      } else {
        if (_sidebar) {
          _sidebar.classList.remove('mobile-open');
          StateManager.set('sidebarOpen', false);
        }
        if (_sidebarOverlay) _sidebarOverlay.classList.remove('active');
        if (!StateManager.get('sidebarCollapsed')) {
          if (_sidebar) _sidebar.style.width = '';
          if (_sidebarSpacer) _sidebarSpacer.style.width = '';
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
      // Use event delegation for better performance
      navItems.addEventListener('click', (e) => {
        const item = e.target.closest('.nav-item');
        if (!item) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        // Extract target route from multiple possible sources
        let target = item.dataset.module || 
                     item.getAttribute('data-navigate') ||
                     (item.getAttribute('href') || '').replace(/.*#/, '').replace('module-', '');
        
        // Normalize
        target = String(target).trim();
        if (target.startsWith('module-')) target = target.replace('module-', '');
        if (!target || target === '') target = 'home';
        
        console.log('[UIManager] Nav item clicked:', target);
        
        if (target) {
          Router.navigateTo(target);
          
          // Close mobile sidebar after navigation
          if (window.innerWidth <= 1024) {
            setTimeout(() => UIManager.toggleSidebar(false), 100);
          }
        }
      });
      
      // Also handle keyboard navigation
      navItems.addEventListener('keydown', (e) => {
        const item = e.target.closest('.nav-item');
        if (!item) return;
        
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          item.click();
        }
      });
      
      console.log('[UIManager] Nav items bound successfully');
    } else {
      console.warn('[UIManager] Nav items container not found');
    }
  }
})();
