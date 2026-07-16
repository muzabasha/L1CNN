const Renderer = (() => {
  let _mainContent = null;
  let _sections = new Map();
  let _activeSectionId = null;

  const _transitionDuration = 300;

  return {
    init() {
      _mainContent = document.getElementById('main-content');
      if (!_mainContent) {
        _mainContent = document.querySelector('.main-content') || document.body;
      }
    },

    registerSection(id, element) {
      _sections.set(id, element);
    },

    getSection(id) {
      return _sections.get(id);
    },

    showSection(id, animate = true) {
      const target = _sections.get(id);
      if (!target) return;

      if (_activeSectionId === id) return;

      if (_activeSectionId) {
        const current = _sections.get(_activeSectionId);
        if (current) {
          if (animate) {
            current.style.opacity = '0';
            current.style.transform = 'translateY(10px)';
            setTimeout(() => {
              current.classList.add('hidden');
              current.classList.remove('active');
            }, _transitionDuration);
          } else {
            current.classList.add('hidden');
            current.classList.remove('active');
            current.style.opacity = '0';
            current.style.transform = 'translateY(10px)';
          }
        }
      }

      target.classList.remove('hidden');

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
    },

    getActiveSectionId() {
      return _activeSectionId;
    },

    createModuleContainer(moduleId) {
      const section = document.createElement('section');
      section.id = 'module-' + moduleId;
      section.className = 'module-section hidden';
      section.setAttribute('role', 'region');
      section.setAttribute('aria-label', 'Module ' + moduleId);
      if (_mainContent) _mainContent.appendChild(section);
      this.registerSection('module-' + moduleId, section);
      return section;
    },

    clearContent(container) {
      if (container) {
        container.innerHTML = '';
      }
    }
  };
})();
