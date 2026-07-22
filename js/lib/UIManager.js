const UIManager = (() => {
  let _progressFill = null;
  let _progressText = null;
  let _sidebarCollapsed = false;

  return {
    init() {
      _progressFill = document.getElementById('progress-fill');
      _progressText = document.getElementById('progress-text');

      // Bind sidebar collapse toggle
      const collapseBtn = document.getElementById('sidebar-toggle-btn');
      if (collapseBtn) {
        collapseBtn.addEventListener('click', () => {
          this.toggleSidebar();
          Motion.sound.playClick();
        });
      }

      // Bind mobile menu toggle
      const mobileBtn = document.getElementById('mobile-menu-btn');
      if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
          const sidebar = document.getElementById('living-sidebar');
          if (sidebar) {
            sidebar.classList.toggle('mobile-open');
          }
          Motion.sound.playClick();
        });
      }

      // Bind sound toggle button
      const soundBtn = document.getElementById('sound-toggle-btn');
      if (soundBtn) {
        soundBtn.addEventListener('click', () => {
          Motion.sound.toggleMute();
        });
      }

      // Initialize Top Bar Module Switcher & Sidebar Search
      this._initModuleSwitcher();
      this._initSidebarSearch();
    },

    _initModuleSwitcher() {
      const btn = document.getElementById('module-switcher-btn');
      const dropdown = document.getElementById('module-switcher-dropdown');
      const searchInput = document.getElementById('module-switcher-search');

      if (!btn || !dropdown) return;

      const toggleDropdown = (show) => {
        const isOpen = typeof show === 'boolean' ? show : !dropdown.classList.contains('open');
        dropdown.classList.toggle('open', isOpen);
        btn.classList.toggle('active', isOpen);
        btn.setAttribute('aria-expanded', String(isOpen));
        if (isOpen && searchInput) {
          setTimeout(() => searchInput.focus(), 100);
        }
      };

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown();
      });

      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          const query = e.target.value.toLowerCase().trim();
          const items = dropdown.querySelectorAll('.switcher-item');
          const groups = dropdown.querySelectorAll('.switcher-group');

          items.forEach(item => {
            const text = item.textContent.toLowerCase();
            const match = !query || text.includes(query);
            item.style.display = match ? 'flex' : 'none';
          });

          groups.forEach(group => {
            const visibleItems = group.querySelectorAll('.switcher-item[style*="display: flex"], .switcher-item:not([style*="display"])');
            const hasVisible = query ? Array.from(group.querySelectorAll('.switcher-item')).some(el => el.style.display !== 'none') : true;
            group.style.display = hasVisible ? 'block' : 'none';
          });
        });
      }

      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.module-switcher-container')) {
          toggleDropdown(false);
        }
      });

      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && dropdown.classList.contains('open')) {
          toggleDropdown(false);
        }
      });

      // Handle item click inside switcher
      dropdown.addEventListener('click', (e) => {
        const item = e.target.closest('[data-navigate]');
        if (item) {
          toggleDropdown(false);
        }
      });
    },

    _initSidebarSearch() {
      const searchInput = document.getElementById('sidebar-search-input');
      if (!searchInput) return;

      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const items = document.querySelectorAll('.sidebar-item');
        const headers = document.querySelectorAll('.sidebar-phase-header');

        items.forEach(item => {
          if (item.dataset.navigate === 'home') return;
          const text = item.textContent.toLowerCase();
          const match = !query || text.includes(query);
          item.style.display = match ? 'flex' : 'none';
        });

        headers.forEach(header => {
          header.style.display = query ? 'none' : 'block';
        });
      });
    },

    updateSidebarActive(moduleId) {
      const normId = String(moduleId).trim().replace(/^module-?/, '');

      // Update sidebar items
      const items = document.querySelectorAll('.sidebar-item, .nav-item');
      items.forEach(item => {
        const itemModule = item.dataset.module || 
                          item.getAttribute('data-navigate') ||
                          (item.getAttribute('href') || '').replace(/.*#/, '').replace('module-', '');
        const itemNorm = String(itemModule).trim().replace(/^module-?/, '');
        const isActive = itemNorm === normId;
        item.classList.toggle('active', isActive);
        if (isActive) {
          item.setAttribute('aria-current', 'page');
          try {
            item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          } catch (e) {}
        } else {
          item.removeAttribute('aria-current');
        }
      });

      // Update topbar switcher active items
      const switcherItems = document.querySelectorAll('.switcher-item');
      switcherItems.forEach(item => {
        const itemNav = item.getAttribute('data-navigate') || '';
        const itemNorm = String(itemNav).trim().replace(/^module-?/, '');
        item.classList.toggle('active', itemNorm === normId);
      });
    },

    toggleSidebar(force) {
      const sidebar = document.getElementById('living-sidebar');
      const body = document.body;
      if (!sidebar) return;

      if (typeof force === 'boolean') {
        _sidebarCollapsed = force;
      } else {
        _sidebarCollapsed = !_sidebarCollapsed;
      }

      sidebar.classList.toggle('collapsed', _sidebarCollapsed);
      body.classList.toggle('sidebar-collapsed', _sidebarCollapsed);

      const toggleBtn = document.getElementById('sidebar-toggle-btn');
      if (toggleBtn) {
        toggleBtn.textContent = _sidebarCollapsed ? '▶' : '◀';
        toggleBtn.setAttribute('aria-label', _sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar');
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

    onResize() {}
  };
})();