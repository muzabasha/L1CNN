/**
 * EMERGENCY FIX - Add this script BEFORE app.js if modules aren't loading
 * This ensures all sections are properly registered and visible
 */

(function() {
  console.log('%c🚑 EMERGENCY FIX LOADED', 'background: #ef4444; color: white; padding: 4px 8px; font-weight: bold;');
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  function init() {
    console.log('[EmergencyFix] Initializing...');
    
    // Ensure home section is visible by default
    const homeSection = document.getElementById('home');
    if (homeSection) {
      homeSection.classList.remove('hidden');
      homeSection.classList.add('active');
      homeSection.style.display = 'block';
      homeSection.style.opacity = '1';
      homeSection.style.transform = 'translateY(0)';
      console.log('[EmergencyFix] Home section activated');
    }
    
    // Ensure all module sections start hidden
    document.querySelectorAll('.module-section').forEach(section => {
      if (section.id !== 'home') {
        section.classList.add('hidden');
        section.classList.remove('active', 'show');
        section.style.display = 'none';
      }
      console.log('[EmergencyFix] Section prepared:', section.id);
    });
    
    // Patch Renderer if it exists but sections aren't registered
    setTimeout(() => {
      if (typeof Renderer !== 'undefined') {
        const originalShowSection = Renderer.showSection;
        
        Renderer.showSection = function(sectionId, animate = true) {
          console.log('[EmergencyFix] Patched showSection called:', sectionId);
          
          // Find section in DOM if not registered
          let section = this.getSection(sectionId);
          if (!section) {
            section = document.getElementById(sectionId);
            if (section) {
              console.log('[EmergencyFix] Auto-registering section:', sectionId);
              this.registerSection(sectionId, section);
            } else {
              console.error('[EmergencyFix] Section not found:', sectionId);
              return false;
            }
          }
          
          // Call original method
          return originalShowSection.call(this, sectionId, animate);
        };
        
        console.log('[EmergencyFix] Renderer patched');
      }
    }, 100);
    
    console.log('[EmergencyFix] Ready');
  }
  
  function runDiagnostics() {
    console.clear();
    console.log('%c🔍 DIAGNOSTICS REPORT', 'background: #3b82f6; color: white; padding: 8px; font-size: 16px; font-weight: bold;');
    console.log('='.repeat(60));
    
    // Check global objects
    console.log('\n📦 GLOBAL OBJECTS:');
    const globals = ['Router', 'Renderer', 'ModuleEngine', 'UIManager', 'StateManager', 'EventManager'];
    globals.forEach(name => {
      console.log(`  ${typeof window[name] !== 'undefined' ? '✓' : '✗'} ${name}`);
    });
    
    // Check DOM sections
    console.log('\n📄 DOM SECTIONS:');
    const home = document.getElementById('home');
    console.log(`  ${home ? '✓' : '✗'} Home section`, home ? `(${home.classList})` : '');
    
    for (let i = 1; i <= 18; i++) {
      const section = document.getElementById(`module-${i}`);
      console.log(`  ${section ? '✓' : '✗'} Module ${i}`, section ? `(${section.classList})` : '');
    }
    
    // Check registered sections in Renderer
    if (typeof Renderer !== 'undefined') {
      console.log('\n🎨 RENDERER STATE:');
      console.log('  Active section:', Renderer.getActiveSectionId());
      console.log('  Home registered:', !!Renderer.getSection('home'));
      for (let i = 1; i <= 18; i++) {
        const registered = !!Renderer.getSection(`module-${i}`);
        if (registered) {
          console.log(`  ✓ Module ${i} registered`);
        }
      }
    }
    
    // Check Router state
    if (typeof Router !== 'undefined') {
      console.log('\n🧭 ROUTER STATE:');
      console.log('  Current route:', Router.getCurrentRoute());
      console.log('  Previous route:', Router.getPreviousRoute());
      console.log('  All routes:', Router.getAllRoutes());
      console.log('  URL hash:', window.location.hash);
    }
    
    // Check ModuleEngine state
    if (typeof ModuleEngine !== 'undefined') {
      console.log('\n⚙️ MODULE ENGINE STATE:');
      console.log('  Active module:', ModuleEngine.getActiveModule());
      for (let i = 1; i <= 3; i++) {
        console.log(`  Module ${i} initialized:`, ModuleEngine.isInitialized(String(i)));
      }
    }
    
    // Check EventManager listeners
    if (typeof EventManager !== 'undefined' && EventManager._listeners) {
      console.log('\n📡 EVENT LISTENERS:');
      Object.keys(EventManager._listeners || {}).forEach(event => {
        const count = (EventManager._listeners[event] || []).length;
        console.log(`  ${event}: ${count} listener(s)`);
      });
    }
    
    // Check navigation elements
    console.log('\n🔗 NAVIGATION ELEMENTS:');
    const navItems = document.querySelectorAll('.nav-item');
    console.log('  Sidebar items:', navItems.length);
    navItems.forEach((item, index) => {
      const module = item.dataset.module || item.getAttribute('href')?.replace('#', '');
      const isActive = item.classList.contains('active');
      if (index < 5) {
        console.log(`    ${isActive ? '→' : ' '} ${module || 'unknown'}`);
      }
    });
    
    // Check visible sections
    console.log('\n👁️ VISIBLE SECTIONS:');
    document.querySelectorAll('.module-section, #home').forEach(section => {
      const isVisible = !section.classList.contains('hidden') && section.style.display !== 'none';
      if (isVisible) {
        console.log(`  ✓ ${section.id}`);
      }
    });
    
    console.log('\n' + '='.repeat(60));
    console.log('%c✅ Diagnostics complete', 'color: #10b981; font-weight: bold;');
    console.log('Check the output above for issues.');
  }
  
  // Make diagnostic available globally in dev console
  window.runDiagnostics = runDiagnostics;
})();
