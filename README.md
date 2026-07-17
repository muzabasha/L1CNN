# 🧬 Interactive Virtual Research Laboratory

> Phase-aware 3D CNN-Radiomics Fusion for Automated LI-RADS v2018 Classification of Hepatocellular Carcinoma

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://your-deployment-url.vercel.app)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![WCAG 2.1](https://img.shields.io/badge/WCAG-2.1%20AA-green)](https://www.w3.org/WAI/WCAG21/quickref/)

## 📋 Overview

An interactive, browser-based virtual laboratory for teaching AI-driven medical imaging research. This application guides users through a complete research pipeline: from clinical background to deep learning implementation for automated liver cancer classification.

**Key Features:**
- 🎓 18 Interactive Learning Modules
- 🧪 10+ Simulation Labs
- 📊 Real-time Visualizations
- 🎨 3D Canvas Animations
- 📱 Fully Responsive Design
- ♿ WCAG 2.1 Accessible
- 🔒 Security-Hardened

## 🚀 Quick Start

### Option 1: Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Option 2: Local Development Server

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (http-server)
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

Then open: `http://localhost:8000`

### Option 3: Static File Server

Simply open `index.html` in a modern browser. However, for full functionality (routing, etc.), use a local server.

## 🏗️ Architecture

```
ps/
├── index.html              # Main entry point
├── 404.html               # Error page
├── vercel.json            # Deployment config
├── css/
│   └── styles.css         # Global styles
├── js/
│   ├── app.js            # Application entry
│   ├── lib/              # Core libraries (14 files)
│   │   ├── Router.js
│   │   ├── StateManager.js
│   │   ├── ModuleEngine.js
│   │   ├── ThemeManager.js
│   │   └── ...
│   └── modules/          # Learning modules (18 files)
│       ├── module1.js
│       ├── module2.js
│       └── ...
└── assets/               # (Empty - for future assets)
```

## 📚 Module Overview

### Research Pipeline
1. **Clinical Background** - Liver anatomy, HCC pathology, risk factors
2. **CT Imaging** - CT physics, Hounsfield units, acquisition
3. **Multiphase CT** - Arterial, portal, delayed phases
4. **LI-RADS** - Classification system, decision trees
5. **Synthetic Dataset** - Data generation, augmentation
6. **3D nnU-Net** - Segmentation architecture
7. **Segmentation** - Liver and tumor segmentation
8. **Radiomics** - Feature extraction, texture analysis
9. **Traditional ML** - SVM, Random Forest, XGBoost
10. **3D CNN** - Deep learning for volumetric data
11. **CNN Visualization** - Grad-CAM, feature maps
12. **Fusion** - Radiomics + CNN hybrid models
13. **Classification** - LR-3/4/5 prediction
14. **Explainable AI** - SHAP, attention mechanisms
15. **Performance Metrics** - ROC, AUC, confusion matrix
16. **Comparison** - Model benchmarking
17. **Research Gap** - Literature review
18. **PhD Workflow** - Complete research methodology

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic markup, Canvas API
- **CSS3** - Custom properties, Grid, Flexbox
- **JavaScript (ES6)** - Vanilla JS, no framework
- **TailwindCSS** - Utility-first styling (CDN)

### Libraries (CDN)
- **Chart.js** - Data visualization
- **Prism.js** - Code syntax highlighting
- **Google Fonts** - Inter, Orbitron typography

### Deployment
- **Vercel** - Static hosting, edge network
- **Git** - Version control

## 🔒 Security Features

- ✅ Content Security Policy (CSP)
- ✅ X-Frame-Options (Clickjacking protection)
- ✅ X-XSS-Protection
- ✅ Strict-Transport-Security (HSTS)
- ✅ X-Content-Type-Options (nosniff)
- ✅ Referrer-Policy

## ♿ Accessibility

This application meets WCAG 2.1 Level AA standards:

- ✅ Semantic HTML structure
- ✅ ARIA landmarks and labels
- ✅ Keyboard navigation support
- ✅ Screen reader compatibility
- ✅ Color contrast compliance
- ✅ Focus indicators
- ✅ Reduced motion support
- ✅ Responsive touch targets (44px minimum)

## 📱 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome  | 90+     | ✅ Full Support |
| Firefox | 88+     | ✅ Full Support |
| Safari  | 14+     | ✅ Full Support |
| Edge    | 90+     | ✅ Full Support |
| Mobile Chrome | 90+ | ✅ Full Support |
| iOS Safari | 14+ | ✅ Full Support |

## 🎨 Features

### Interactive Simulations
- Real-time parameter adjustment
- Live canvas animations
- Interactive decision trees
- Phase comparison viewers
- Hands-on segmentation tools

### Visualizations
- 3D liver anatomy models
- CT phase animations
- Risk factor explorers
- Performance metric charts
- Confusion matrices
- ROC curves

### Learning Tools
- Learning objectives per module
- Knowledge check quizzes
- Code examples (Python)
- Reflection prompts
- Progress tracking
- Module navigation

## 🧪 Testing

### Manual Testing
```bash
# Test all modules load
# Navigate through all 18 modules via sidebar

# Test responsive design
# Resize browser window or use DevTools

# Test keyboard navigation
# Tab through all interactive elements

# Test screen reader
# Use NVDA (Windows) or VoiceOver (Mac)
```

### Automated Testing (Optional)
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse http://localhost:8000 --view
```

## 📊 Performance

Expected Lighthouse scores:
- **Performance:** 90+
- **Accessibility:** 95+
- **Best Practices:** 95+
- **SEO:** 90+

## 🐛 Known Issues

None identified. See `AUDIT_REPORT.md` for detailed assessment.

## 🔮 Future Enhancements

- [ ] Add service worker for offline support
- [ ] Implement progressive web app (PWA)
- [ ] Add dark/light theme toggle
- [ ] Include downloadable datasets
- [ ] Add interactive Python notebooks
- [ ] Multi-language support
- [ ] Add video tutorials
- [ ] Implement user progress export

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Credits

**Research Team:**
- Interactive Virtual Research Laboratory Team
- VRL Research Division

**Technology:**
- Built with modern web standards
- Powered by Vercel
- Styled with TailwindCSS

## 📧 Contact

For questions, feedback, or collaboration:
- **GitHub Issues:** [Project Issues](https://github.com/your-repo/issues)
- **Email:** research@vrl.edu (placeholder)

## 🎯 Citation

If you use this educational resource in your research or teaching, please cite:

```bibtex
@software{interactive_vrl_2026,
  title={Interactive Virtual Research Laboratory: Phase-aware 3D CNN-Radiomics Fusion for Automated LI-RADS Classification},
  author={VRL Research Team},
  year={2026},
  url={https://your-deployment-url.vercel.app}
}
```

## 🌟 Acknowledgments

- American College of Radiology (ACR) for LI-RADS standards
- Medical imaging research community
- Open-source web development community

---

**Status:** ✅ Production Ready | **Version:** 1.0.0 | **Last Updated:** January 2026
