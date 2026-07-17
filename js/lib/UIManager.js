const UIManager = (() => {
  let _progressFill = null;
  let _progressText = null;

  return {
    init() {
      _progressFill = document.getElementById('progress-fill');
      _progressText = document.getElementById('progress-text');
    },

    updateSidebarActive(moduleId) {
      document.querySelectorAll('.nav-item').forEach(item => {
        const itemModule = item.dataset.module || 
                          item.getAttribute('data-navigate') ||
                          (item.getAttribute('href') || '').replace(/.*#/, '').replace('module-', '');
        const itemNorm = String(itemModule).trim().replace(/^module-?/, '');
        const normId = String(moduleId).trim().replace(/^module-?/, '');
        item.classList.toggle('active', itemNorm === normId);
        if (itemNorm === normId) {
          item.setAttribute('aria-current', 'page');
        } else {
          item.removeAttribute('aria-current');
        }
      });
    },

    toggleSidebar() {},

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