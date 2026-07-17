/**
 * Components.js - Reusable UI Component Builders
 * Uses the design system from css/design-system.css and css/components.css
 */

const Components = (() => {
  
  /**
   * Create a button element with design system classes
   * @param {Object} options
   * @param {string} options.text - Button text
   * @param {string} options.variant - Button variant (primary, secondary, accent, success, warning, error, ghost, outline)
   * @param {string} options.size - Button size (sm, base, lg, xl)
   * @param {string} options.icon - Optional icon (emoji or HTML)
   * @param {Function} options.onClick - Click handler
   * @param {string} options.navigate - Optional navigation target
   * @param {string} options.className - Additional classes
   * @param {boolean} options.disabled - Disabled state
   * @returns {HTMLButtonElement}
   */
  function createButton(options = {}) {
    const {
      text = 'Button',
      variant = 'primary',
      size = 'base',
      icon = null,
      onClick = null,
      navigate = null,
      className = '',
      disabled = false,
      ariaLabel = null
    } = options;

    const btn = document.createElement('button');
    btn.className = `btn btn-${variant} ${size !== 'base' ? 'btn-' + size : ''} ${className}`.trim();
    btn.disabled = disabled;
    
    if (ariaLabel) {
      btn.setAttribute('aria-label', ariaLabel);
    }
    
    if (navigate) {
      btn.setAttribute('data-navigate', navigate);
    }
    
    if (icon) {
      btn.innerHTML = `${icon} <span>${text}</span>`;
    } else {
      btn.textContent = text;
    }
    
    if (onClick) {
      btn.addEventListener('click', onClick);
    }
    
    return btn;
  }

  /**
   * Create a card element with design system classes
   * @param {Object} options
   * @param {string} options.title - Card title
   * @param {string} options.subtitle - Card subtitle
   * @param {string} options.body - Card body content (HTML)
   * @param {Array} options.footer - Footer buttons/elements
   * @param {string} options.variant - Card variant (interactive, elevated, flat, gradient)
   * @param {string} options.size - Card size (sm, base, lg)
   * @param {string} options.className - Additional classes
   * @returns {HTMLDivElement}
   */
  function createCard(options = {}) {
    const {
      title = null,
      subtitle = null,
      body = '',
      footer = null,
      variant = null,
      size = 'base',
      className = ''
    } = options;

    const card = document.createElement('div');
    const classes = ['card'];
    if (variant) classes.push('card-' + variant);
    if (size !== 'base') classes.push('card-' + size);
    if (className) classes.push(className);
    card.className = classes.join(' ');

    if (title || subtitle) {
      const header = document.createElement('div');
      header.className = 'card-header';
      
      if (title) {
        const titleEl = document.createElement('h3');
        titleEl.className = 'card-title';
        titleEl.textContent = title;
        header.appendChild(titleEl);
      }
      
      if (subtitle) {
        const subtitleEl = document.createElement('p');
        subtitleEl.className = 'card-subtitle';
        subtitleEl.textContent = subtitle;
        header.appendChild(subtitleEl);
      }
      
      card.appendChild(header);
    }

    if (body) {
      const bodyEl = document.createElement('div');
      bodyEl.className = 'card-body';
      bodyEl.innerHTML = body;
      card.appendChild(bodyEl);
    }

    if (footer) {
      const footerEl = document.createElement('div');
      footerEl.className = 'card-footer';
      
      if (Array.isArray(footer)) {
        footer.forEach(el => footerEl.appendChild(el));
      } else {
        footerEl.appendChild(footer);
      }
      
      card.appendChild(footerEl);
    }

    return card;
  }

  /**
   * Create a slider control with label and value display
   * @param {HTMLElement} parent - Parent element to append to
   * @param {Object} options
   * @param {string} options.label - Slider label
   * @param {number} options.min - Minimum value
   * @param {number} options.max - Maximum value
   * @param {number} options.value - Initial value
   * @param {number} options.step - Step increment
   * @param {Function} options.onChange - Change handler
   * @param {string} options.unit - Unit suffix (e.g., '%', 'px')
   * @param {Function} options.formatter - Custom value formatter
   * @returns {HTMLDivElement}
   */
  function createSlider(parent, options = {}) {
    const {
      label = 'Slider',
      min = 0,
      max = 100,
      value = 50,
      step = 1,
      onChange = null,
      unit = '',
      formatter = null
    } = options;

    const container = document.createElement('div');
    container.className = 'control-group';
    container.style.cssText = 'display:flex;flex-direction:column;gap:var(--space-2);min-width:200px;';

    const labelRow = document.createElement('div');
    labelRow.style.cssText = 'display:flex;justify-content:space-between;align-items:center;';

    const labelEl = document.createElement('label');
    labelEl.style.cssText = 'font-size:var(--text-sm);color:var(--text-secondary);font-weight:var(--font-medium);';
    labelEl.textContent = label;

    const valueEl = document.createElement('span');
    valueEl.style.cssText = 'font-size:var(--text-sm);color:var(--color-primary-400);font-weight:var(--font-semibold);font-family:var(--font-mono);';
    const updateValueDisplay = (val) => {
      if (formatter) {
        valueEl.textContent = formatter(val);
      } else {
        valueEl.textContent = val + unit;
      }
    };
    updateValueDisplay(value);

    labelRow.appendChild(labelEl);
    labelRow.appendChild(valueEl);

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.className = 'input';
    slider.min = min;
    slider.max = max;
    slider.value = value;
    slider.step = step;
    slider.style.cssText = 'width:100%;height:8px;cursor:pointer;';

    slider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      updateValueDisplay(val);
      if (onChange) onChange(val);
    });

    container.appendChild(labelRow);
    container.appendChild(slider);
    
    if (parent) {
      parent.appendChild(container);
    }

    return container;
  }

  /**
   * Create a toggle/checkbox control
   * @param {HTMLElement} parent - Parent element to append to
   * @param {Object} options
   * @param {string} options.label - Toggle label
   * @param {boolean} options.checked - Initial checked state
   * @param {Function} options.onChange - Change handler
   * @returns {HTMLDivElement}
   */
  function createToggle(parent, options = {}) {
    const {
      label = 'Toggle',
      checked = false,
      onChange = null
    } = options;

    const container = document.createElement('div');
    container.className = 'control-group';
    container.style.cssText = 'display:flex;align-items:center;gap:var(--space-3);';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = checked;
    checkbox.style.cssText = 'width:18px;height:18px;cursor:pointer;accent-color:var(--color-primary-500);';

    const labelEl = document.createElement('label');
    labelEl.style.cssText = 'font-size:var(--text-sm);color:var(--text-secondary);cursor:pointer;user-select:none;';
    labelEl.textContent = label;

    checkbox.addEventListener('change', (e) => {
      if (onChange) onChange(e.target.checked);
    });

    labelEl.addEventListener('click', () => {
      checkbox.checked = !checkbox.checked;
      if (onChange) onChange(checkbox.checked);
    });

    container.appendChild(checkbox);
    container.appendChild(labelEl);
    
    if (parent) {
      parent.appendChild(container);
    }

    return container;
  }

  /**
   * Create a badge element
   * @param {Object} options
   * @param {string} options.text - Badge text
   * @param {string} options.variant - Badge variant (primary, accent, success, warning, error, gray)
   * @returns {HTMLSpanElement}
   */
  function createBadge(options = {}) {
    const {
      text = 'Badge',
      variant = 'primary'
    } = options;

    const badge = document.createElement('span');
    badge.className = `badge badge-${variant}`;
    badge.textContent = text;
    
    return badge;
  }

  /**
   * Create an alert element
   * @param {Object} options
   * @param {string} options.message - Alert message
   * @param {string} options.type - Alert type (info, success, warning, error)
   * @param {string} options.icon - Optional icon
   * @returns {HTMLDivElement}
   */
  function createAlert(options = {}) {
    const {
      message = 'Alert message',
      type = 'info',
      icon = null
    } = options;

    const icons = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    };

    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    
    if (icon !== null) {
      alert.innerHTML = `${icon || icons[type]} ${message}`;
    } else {
      alert.textContent = message;
    }
    
    return alert;
  }

  /**
   * Create a loading skeleton
   * @param {string} type - Skeleton type (text, title, button, card)
   * @returns {HTMLDivElement}
   */
  function createSkeleton(type = 'text') {
    const skeleton = document.createElement('div');
    skeleton.className = `skeleton skeleton-${type}`;
    return skeleton;
  }

  /**
   * Create a spinner element
   * @param {string} size - Spinner size (base, lg)
   * @returns {HTMLDivElement}
   */
  function createSpinner(size = 'base') {
    const spinner = document.createElement('div');
    spinner.className = `spinner ${size !== 'base' ? 'spinner-' + size : ''}`;
    return spinner;
  }

  /**
   * Create a progress bar
   * @param {Object} options
   * @param {number} options.value - Progress value (0-100)
   * @param {boolean} options.striped - Striped animation
   * @returns {HTMLDivElement}
   */
  function createProgressBar(options = {}) {
    const {
      value = 0,
      striped = false
    } = options;

    const container = document.createElement('div');
    container.className = `progress ${striped ? 'progress-striped' : ''}`;

    const bar = document.createElement('div');
    bar.className = 'progress-bar';
    bar.style.width = `${Math.min(100, Math.max(0, value))}%`;

    container.appendChild(bar);
    
    // Method to update progress
    container.setProgress = (newValue) => {
      bar.style.width = `${Math.min(100, Math.max(0, newValue))}%`;
    };

    return container;
  }

  /**
   * Create a section header with consistent styling
   * @param {Object} options
   * @param {string} options.title - Section title
   * @param {string} options.subtitle - Optional subtitle
   * @param {Array} options.actions - Optional action buttons
   * @returns {HTMLDivElement}
   */
  function createSectionHeader(options = {}) {
    const {
      title = 'Section Title',
      subtitle = null,
      actions = null
    } = options;

    const header = document.createElement('div');
    header.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:var(--space-6) var(--space-6) 0;flex-wrap:wrap;gap:var(--space-4);';

    const textContainer = document.createElement('div');
    
    const titleEl = document.createElement('h2');
    titleEl.className = 'font-orbitron text-2xl font-bold gradient-text';
    titleEl.style.margin = '0';
    titleEl.textContent = title;
    textContainer.appendChild(titleEl);

    if (subtitle) {
      const subtitleEl = document.createElement('p');
      subtitleEl.style.cssText = 'margin:var(--space-2) 0 0;color:var(--text-secondary);font-size:var(--text-sm);';
      subtitleEl.textContent = subtitle;
      textContainer.appendChild(subtitleEl);
    }

    header.appendChild(textContainer);

    if (actions) {
      const actionsContainer = document.createElement('div');
      actionsContainer.style.cssText = 'display:flex;gap:var(--space-2);flex-wrap:wrap;';
      
      actions.forEach(action => {
        actionsContainer.appendChild(action);
      });
      
      header.appendChild(actionsContainer);
    }

    return header;
  }

  /**
   * Create a module header with back button
   * @param {string} moduleNumber - Module number
   * @param {string} title - Module title
   * @param {string} subtitle - Optional subtitle
   * @returns {HTMLDivElement}
   */
  function createModuleHeader(moduleNumber, title, subtitle = null) {
    const backBtn = createButton({
      text: 'Home',
      icon: '←',
      variant: 'secondary',
      size: 'sm',
      navigate: 'home',
      ariaLabel: 'Back to Home'
    });

    const header = createSectionHeader({
      title: `Module ${moduleNumber}: ${title}`,
      subtitle: subtitle,
      actions: [backBtn]
    });

    return header;
  }

  /**
   * Create a grid container for objectives
   * @param {Array<string>} objectives - Array of objective texts
   * @returns {HTMLDivElement}
   */
  function createObjectivesGrid(objectives = []) {
    const container = document.createElement('div');
    container.className = 'objectives-grid';
    container.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:var(--space-4);padding:var(--space-6);';

    objectives.forEach((text, index) => {
      const item = document.createElement('div');
      item.className = 'objective-item';
      item.style.cssText = 'display:flex;gap:var(--space-3);padding:var(--space-4);background:var(--glass-bg);border:1px solid var(--border-color);border-radius:var(--radius-lg);transition:all var(--transition-base) var(--ease-in-out);opacity:0;transform:translateY(12px);';
      
      const number = document.createElement('div');
      number.style.cssText = 'flex-shrink:0;width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:var(--gradient-primary);color:white;border-radius:var(--radius-full);font-weight:var(--font-bold);font-size:var(--text-sm);';
      number.textContent = index + 1;

      const textEl = document.createElement('div');
      textEl.style.cssText = 'color:var(--text-secondary);font-size:var(--text-sm);line-height:var(--leading-relaxed);';
      textEl.textContent = text;

      item.appendChild(number);
      item.appendChild(textEl);
      container.appendChild(item);

      // Animate in
      setTimeout(() => {
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, 80 * index);
    });

    return container;
  }

  return {
    createButton,
    createCard,
    createSlider,
    createToggle,
    createBadge,
    createAlert,
    createSkeleton,
    createSpinner,
    createProgressBar,
    createSectionHeader,
    createModuleHeader,
    createObjectivesGrid
  };
})();

// Make available globally
window.Components = Components;
