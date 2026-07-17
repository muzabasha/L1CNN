/**
 * Debug Helper - Enable detailed logging
 * Add ?debug=true to URL to enable
 */
const DEBUG = (() => {
  const isDebugMode = window.location.search.includes('debug=true') || 
                      localStorage.getItem('vrl-debug') === 'true';

  return {
    enabled: isDebugMode,
    
    log(...args) {
      if (this.enabled) {
        console.log('[DEBUG]', ...args);
      }
    },
    
    warn(...args) {
      if (this.enabled) {
        console.warn('[DEBUG]', ...args);
      }
    },
    
    error(...args) {
      console.error('[DEBUG]', ...args);
    },
    
    table(data, label) {
      if (this.enabled) {
        console.log('[DEBUG]', label || 'Table:');
        console.table(data);
      }
    },
    
    enable() {
      localStorage.setItem('vrl-debug', 'true');
      window.location.reload();
    },
    
    disable() {
      localStorage.removeItem('vrl-debug');
      window.location.reload();
    }
  };
})();

// Make available globally for console access
window.DEBUG = DEBUG;

if (DEBUG.enabled) {
  console.log('%c🐛 Debug Mode Enabled', 'background: #4ade80; color: #000; padding: 4px 8px; border-radius: 4px; font-weight: bold;');
  console.log('To disable: DEBUG.disable() or remove ?debug=true from URL');
}
