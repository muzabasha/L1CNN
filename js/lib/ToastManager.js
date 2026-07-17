/**
 * Toast Notification Manager
 * Provides elegant, non-intrusive notifications
 */

const ToastManager = (() => {
  let container = null;
  let toasts = [];
  const maxToasts = 5;

  function init() {
    if (container) return;
    
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-atomic', 'false');
    document.body.appendChild(container);
    
    console.log('[ToastManager] Initialized');
  }

  function show(message, type = 'info', duration = 4000, options = {}) {
    init();
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');
    
    // Icon based on type
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    
    const icon = icons[type] || icons.info;
    
    // Build content
    toast.innerHTML = `
      <div style="flex-shrink: 0; font-size: 18px; font-weight: bold; color: var(--color-${type});">
        ${icon}
      </div>
      <div style="flex: 1;">
        ${options.title ? `<div style="font-weight: 600; margin-bottom: 4px; color: var(--text-primary);">${options.title}</div>` : ''}
        <div style="font-size: 14px; color: var(--text-secondary);">${message}</div>
      </div>
      ${options.dismissible !== false ? `
        <button 
          class="toast-close" 
          aria-label="Close notification"
          style="flex-shrink: 0; background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 4px; transition: color 0.2s;"
          onmouseover="this.style.color='var(--text-primary)'"
          onmouseout="this.style.color='var(--text-muted)'"
        >✕</button>
      ` : ''}
    `;
    
    // Add to DOM
    container.appendChild(toast);
    toasts.push(toast);
    
    // Trigger animation
    requestAnimationFrame(() => {
      toast.style.animation = 'slideInRight 0.3s ease-out';
    });
    
    // Handle dismiss button
    const closeBtn = toast.querySelector('.toast-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => dismiss(toast));
    }
    
    // Auto-dismiss
    if (duration > 0) {
      setTimeout(() => dismiss(toast), duration);
    }
    
    // Limit number of toasts
    if (toasts.length > maxToasts) {
      dismiss(toasts[0]);
    }
    
    // Log for debugging
    console.log(`[ToastManager] ${type.toUpperCase()}:`, message);
    
    return toast;
  }

  function dismiss(toast) {
    if (!toast || !toast.parentElement) return;
    
    // Animate out
    toast.style.animation = 'slideOutRight 0.3s ease-in forwards';
    
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
      const index = toasts.indexOf(toast);
      if (index > -1) {
        toasts.splice(index, 1);
      }
    }, 300);
  }

  function dismissAll() {
    toasts.forEach(toast => dismiss(toast));
  }

  // Convenience methods
  function success(message, options = {}) {
    return show(message, 'success', options.duration || 3000, options);
  }

  function error(message, options = {}) {
    return show(message, 'error', options.duration || 5000, options);
  }

  function warning(message, options = {}) {
    return show(message, 'warning', options.duration || 4000, options);
  }

  function info(message, options = {}) {
    return show(message, 'info', options.duration || 3000, options);
  }

  function promise(promise, messages = {}) {
    const loading = show(
      messages.loading || 'Loading...',
      'info',
      0,
      { dismissible: false }
    );
    
    return promise
      .then((result) => {
        dismiss(loading);
        success(messages.success || 'Success!');
        return result;
      })
      .catch((error) => {
        dismiss(loading);
        this.error(messages.error || error.message || 'Error occurred');
        throw error;
      });
  }

  // Add slide animations to page
  function addAnimations() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes slideOutRight {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Initialize animations
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addAnimations);
  } else {
    addAnimations();
  }

  return {
    show,
    dismiss,
    dismissAll,
    success,
    error,
    warning,
    info,
    promise
  };
})();

// Make available globally
window.ToastManager = ToastManager;
