const Renderer = (() => {
  let _mainContent = null;
  let _sections = new Map();
  let _activeSectionId = null;

  const _transitionDuration = 300;

  return {
    init() {
      console.log('[Renderer] Initializing...');
      _mainContent = document.getElementById('main-content');
      if (!_mainContent) {
        _mainContent = document.querySelector('.main-content') || document.body;
      }
      
      // Register and activate home section by default
      const homeSection = document.getElementById('home');
      if (homeSection) {
        this.registerSection('home', homeSection);
        homeSection.classList.remove('hidden');
        homeSection.classList.add('active');
        homeSection.style.display = 'block';
        homeSection.style.opacity = '1';
        homeSection.style.transform = 'translateY(0)';
        _activeSectionId = 'home';
        console.log('[Renderer] Home section registered and activated');
      } else {
        console.error('[Renderer] Home section not found in DOM!');
      }
      
      // Register all existing module sections (start hidden)
      document.querySelectorAll('.module-section').forEach(section => {
        if (section.id && section.id !== 'home') {
          this.registerSection(section.id, section);
          section.classList.add('hidden');
          section.classList.remove('active');
          section.style.display = 'none';
          console.log('[Renderer] Registered section:', section.id);
        }
      });
      
      console.log('[Renderer] Initialized with', _sections.size, 'sections');
    },

    registerSection(id, element) {
      if (!element) {
        console.warn('[Renderer] Attempted to register null section:', id);
        return;
      }
      _sections.set(id, element);
      console.log('[Renderer] Section registered:', id);
    },

    getSection(id) {
      return _sections.get(id);
    },

    showSection(id, animate = true) {
      console.log('[Renderer] Showing section:', id, 'animate:', animate);
      
      const target = _sections.get(id);
      if (!target) {
        console.error('[Renderer] Section not found:', id);
        // Try to find in DOM and auto-register
        const domSection = document.getElementById(id);
        if (domSection) {
          console.log('[Renderer] Auto-registering section found in DOM:', id);
          this.registerSection(id, domSection);
          return this.showSection(id, animate); // Retry
        }
        return false;
      }

      if (_activeSectionId === id) {
        console.log('[Renderer] Section already active:', id);
        return true;
      }

      // Hide current section
      if (_activeSectionId) {
        const current = _sections.get(_activeSectionId);
        if (current) {
          console.log('[Renderer] Hiding current section:', _activeSectionId);
          if (animate) {
            current.style.opacity = '0';
            current.style.transform = 'translateY(10px)';
            setTimeout(() => {
              current.classList.add('hidden');
              current.classList.remove('active');
              current.style.display = 'none'; // Explicitly hide
            }, _transitionDuration);
          } else {
            current.classList.add('hidden');
            current.classList.remove('active');
            current.style.opacity = '0';
            current.style.transform = 'translateY(10px)';
            current.style.display = 'none'; // Explicitly hide
          }
        }
      }

      // Show target section
      target.classList.remove('hidden');
      target.style.display = 'block'; // Explicitly show

      if (animate) {
        target.style.opacity = '0';
        target.style.transform = 'translateY(10px)';
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            target.classList.add('active');
            target.style.opacity = '1';
            target.style.transform = 'translateY(0)';
          });
        });
      } else {
        target.classList.add('active');
        target.style.opacity = '1';
        target.style.transform = 'translateY(0)';
      }

      _activeSectionId = id;
      console.log('[Renderer] Section now active and visible:', id);
      return true;
    },

    getActiveSectionId() {
      return _activeSectionId;
    },

    createModuleContainer(moduleId) {
      const sectionId = 'module-' + moduleId;
      
      // Check if already exists in DOM
      let section = document.getElementById(sectionId);
      if (section) {
        console.log('[Renderer] Module container already exists:', sectionId);
        if (!_sections.has(sectionId)) {
          this.registerSection(sectionId, section);
        }
        return section;
      }

      console.log('[Renderer] Creating new module container:', sectionId);
      
      section = document.createElement('section');
      section.id = sectionId;
      section.className = 'module-section hidden';
      section.setAttribute('role', 'region');
      section.setAttribute('aria-label', 'Module ' + moduleId);
      section.style.display = 'none'; // Start hidden
      
      if (_mainContent) {
        _mainContent.appendChild(section);
      } else {
        console.error('[Renderer] Main content container not found!');
        return null;
      }
      
      this.registerSection(sectionId, section);
      console.log('[Renderer] Module container created and registered:', sectionId);
      return section;
    },

    clearContent(container) {
      if (container) {
        console.log('[Renderer] Clearing content from container');
        container.innerHTML = '';
      }
    }
  };
})();
