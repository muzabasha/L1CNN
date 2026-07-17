ModuleEngine.register('16', {
  init(container) {
    container.innerHTML = '<div style="padding:1.5rem 1.5rem 0;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.5rem;"><h2 class="font-orbitron text-2xl font-bold gradient-text" style="margin:0;">Module 16: Comparison</h2><button data-navigate="home" class="px-4 py-2 rounded-lg border border-white/20 text-sm text-gray-300 hover:text-white hover:border-primary-400/50 transition-all cursor-pointer" style="background:rgba(255,255,255,0.04);min-height:40px;" aria-label="Back to Home">&#x2190; Home</button></div>' + `
      <div class="module-header">
        <h2>Module 16: Traditional vs Proposed Methods</h2>
        <p class="module-subtitle">Systematic comparison of all methods and incremental improvement analysis</p>
        <div class="objectives">
          <h3>Learning Objectives</h3>
          <ul>
            <li>Systematically compare all methods implemented in this research</li>
            <li>Understand the advantages and limitations of each approach</li>
            <li>Analyze the incremental improvement of the proposed method</li>
            <li>Understand computational cost vs accuracy tradeoffs</li>
            <li>Justify the proposed architecture design choices</li>
          </ul>
        </div>
      </div>

      <div class="module-content">
        <!-- Comparison Animation -->
        <section class="section">
          <h3>Method Comparison Race</h3>
          <div id="comparison-race" class="race-container"></div>
          <button id="start-race-btn" class="btn btn-primary">Start Comparison Race</button>
          <div id="race-progress" class="progress-bar" style="display:none;">
            <div class="progress-fill"></div>
          </div>
        </section>

        <!-- Theory -->
        <section class="section theory-section">
          <h3>Theoretical Framework</h3>
          <div class="theory-content">
            <h4>Comparison Framework</h4>
            <p>Our research evaluates methods across four categories, each representing an evolution in approach sophistication:</p>
            <div class="method-categories">
              <div class="category">
                <h5>Traditional Methods</h5>
                <p>Thresholding, Region Growing, Watershed, K-Means. These are rule-based approaches requiring no training data. Fast but limited in handling complex lesion boundaries.</p>
              </div>
              <div class="category">
                <h5>Classical Machine Learning</h5>
                <p>Random Forest, SVM, XGBoost with hand-crafted radiomics features. Leverage domain expertise but limited by feature engineering quality.</p>
              </div>
              <div class="category">
                <h5>Deep Learning (Standard)</h5>
                <p>2D CNN, 3D CNN, Attention CNN, nnU-Net. Learn features automatically but may not capture temporal dynamics.</p>
              </div>
              <div class="category">
                <h5>Proposed Architecture</h5>
                <p>Phase-aware CNN + Radiomics Fusion. Combines temporal modeling with hand-crafted features for maximum performance.</p>
              </div>
            </div>
            <h4>Why Each Improvement Helps</h4>
            <ul>
              <li><strong>Thresholding → Region Growing:</strong> Spatial coherence improves boundary detection</li>
              <li><strong>Region Growing → ML Methods:</strong> Statistical learning captures non-linear patterns</li>
              <li><strong>ML → CNN:</strong> Automatic feature learning eliminates manual engineering</li>
              <li><strong>CNN → Attention:</strong> Focus on discriminative regions improves precision</li>
              <li><strong>Attention → Phase-aware:</strong> Temporal patterns across CT phases are captured</li>
              <li><strong>Phase-aware → Fusion:</strong> Complementary features from radiomics boost accuracy</li>
            </ul>
            <h4>Computational Complexity Analysis</h4>
            <p>The tradeoff between inference time and accuracy must be considered for clinical deployment:</p>
            <ul>
              <li>Traditional methods: O(n) - Excellent for real-time screening</li>
              <li>ML methods: O(n·d) - Good balance for clinical workflows</li>
              <li>CNN methods: O(n·d·k²) - Acceptable for batch processing</li>
              <li>Proposed method: O(n·d·k² + f) - Slight overhead for significant gain</li>
            </ul>
          </div>
        </section>

        <!-- Simulation -->
        <section class="section">
          <h3>Interactive Comparison Dashboard</h3>
          <div id="comparison-table-container"></div>
          <div id="method-detail-panel" class="detail-panel" style="display:none;"></div>
        </section>

        <section class="section">
          <h3>Visual Analytics</h3>
          <div class="chart-grid">
            <div class="chart-item">
              <h4>Accuracy Comparison</h4>
              <div id="accuracy-bar-chart"></div>
            </div>
            <div class="chart-item">
              <h4>AUC-ROC Curves</h4>
              <div id="auc-roc-chart"></div>
            </div>
            <div class="chart-item">
              <h4>Radar: Top 4 Methods</h4>
              <div id="radar-chart"></div>
            </div>
            <div class="chart-item">
              <h4>Efficiency: Accuracy vs Parameters</h4>
              <div id="efficiency-scatter"></div>
            </div>
          </div>
        </section>

        <!-- Improvement Tracker -->
        <section class="section">
          <h3>Cumulative Improvement Tracker</h3>
          <div id="improvement-tracker"></div>
        </section>

        <!-- Quiz -->
        <section class="section">
          <h3>Knowledge Check</h3>
          <div id="m16-quiz-container"></div>
        </section>

        <!-- Reflection -->
        <section class="section reflection-section">
          <h3>Reflection</h3>
          <div class="reflection-content">
            <p>Why do incremental improvements matter in research? Each step builds confidence that the proposed changes genuinely contribute to better performance, rather than random variation.</p>
            <p>The value of systematic comparison lies in establishing a fair baseline. Without it, claiming superiority of a new method is meaningless.</p>
            <div class="reflection-prompt">
              <textarea placeholder="Write your reflection here..." rows="4" style="width:100%; padding:10px; border:1px solid var(--border); border-radius:4px;"></textarea>
            </div>
          </div>
        </section>
      </div>
    ` + '<div style="padding:1rem 1.5rem 2rem;display:flex;justify-content:center;"><button data-navigate="home" class="px-6 py-3 rounded-xl border border-white/20 text-sm text-gray-300 hover:text-white hover:border-primary-400/50 transition-all cursor-pointer" style="background:rgba(255,255,255,0.04);min-height:44px;">&#x2190; Back to Home</button></div>';

    this.initRace();
    this.initComparisonTable();
    this.initCharts();
    this.initImprovementTracker();
    this.initQuiz();
  },

  initRace() {
    const container = document.getElementById('comparison-race');
    const methods = [
      { name: 'Threshold', accuracy: 0.65, color: '#e74c3c' },
      { name: 'Region Growing', accuracy: 0.70, color: '#e67e22' },
      { name: 'Watershed', accuracy: 0.68, color: '#f39c12' },
      { name: 'K-Means', accuracy: 0.72, color: '#27ae60' },
      { name: 'RF+Radiomics', accuracy: 0.78, color: '#2980b9' },
      { name: 'SVM+Radiomics', accuracy: 0.76, color: '#8e44ad' },
      { name: 'XGBoost+Radiomics', accuracy: 0.80, color: '#16a085' },
      { name: '2D CNN', accuracy: 0.82, color: '#d35400' },
      { name: '3D CNN', accuracy: 0.85, color: '#c0392b' },
      { name: 'Attention CNN', accuracy: 0.87, color: '#7f8c8d' },
      { name: 'nnU-Net', accuracy: 0.86, color: '#2c3e50' },
      { name: 'Phase-aware CNN', accuracy: 0.89, color: '#1abc9c' },
      { name: 'Proposed (Fusion)', accuracy: 0.92, color: '#f1c40f' }
    ];

    container.innerHTML = methods.map((m, i) => `
      <div class="race-row" data-index="${i}">
        <span class="race-label">${m.name}</span>
        <div class="race-track">
          <div class="race-bar" style="background:${m.color};width:0%;" data-target="${m.accuracy}"></div>
        </div>
        <span class="race-value">0%</span>
      </div>
    `).join('');

    document.getElementById('start-race-btn').addEventListener('click', () => {
      const bars = container.querySelectorAll('.race-bar');
      const values = container.querySelectorAll('.race-value');
      const progress = document.getElementById('race-progress');
      progress.style.display = 'block';
      const fill = progress.querySelector('.progress-fill');

      bars.forEach((bar, i) => {
        const target = parseFloat(bar.dataset.target) * 100;
        setTimeout(() => {
          bar.style.transition = 'width 1.5s ease-out';
          bar.style.width = target + '%';
          let current = 0;
          const interval = setInterval(() => {
            current += 1;
            values[i].textContent = current + '%';
            if (current >= target) clearInterval(interval);
          }, 15);
          fill.style.width = ((i + 1) / bars.length * 100) + '%';
        }, i * 200);
      });
    });
  },

  initComparisonTable() {
    const data = {
      columns: ['Method', 'Accuracy', 'AUC', 'Dice', 'Precision', 'Recall', 'F1', 'Kappa', 'Params', 'Inference'],
      rows: [
        ['Threshold', '65%', '-', '0.62', '0.60', '0.65', '0.62', '0.35', '0', '<1ms'],
        ['Region Growing', '70%', '-', '0.68', '0.67', '0.70', '0.68', '0.42', '0', '<1ms'],
        ['Watershed', '68%', '-', '0.65', '0.63', '0.68', '0.65', '0.38', '0', '<1ms'],
        ['K-Means', '72%', '-', '0.70', '0.69', '0.72', '0.70', '0.45', '0', '<1ms'],
        ['RF+Radiomics', '78%', '0.82', '-', '0.76', '0.78', '0.77', '0.58', '10K', '<5ms'],
        ['SVM+Radiomics', '76%', '0.80', '-', '0.74', '0.76', '0.75', '0.55', '5K', '<5ms'],
        ['XGBoost+Radiomics', '80%', '0.84', '-', '0.79', '0.80', '0.79', '0.62', '50K', '<10ms'],
        ['2D CNN', '82%', '0.86', '0.78', '0.81', '0.82', '0.81', '0.65', '500K', '50ms'],
        ['3D CNN', '85%', '0.89', '0.82', '0.84', '0.85', '0.84', '0.70', '2M', '150ms'],
        ['Attention CNN', '87%', '0.91', '0.84', '0.86', '0.87', '0.86', '0.73', '2.5M', '180ms'],
        ['nnU-Net', '86%', '0.90', '0.83', '0.85', '0.86', '0.85', '0.72', '30M', '200ms'],
        ['Phase-aware CNN', '89%', '0.93', '0.86', '0.88', '0.89', '0.88', '0.76', '3M', '200ms'],
        ['Proposed (Fusion)', '92%', '0.95', '0.89', '0.91', '0.92', '0.91', '0.82', '3.2M', '220ms']
      ]
    };

    Components.createComparisonTable(document.getElementById('comparison-table-container'), data);

    const detailInfo = [
      { strengths: ['Extremely fast', 'No training needed', 'Simple to implement'], weaknesses: ['Cannot handle intensity variation', 'Poor boundary detection', 'Not suitable for clinical use'], when: ['Quick screening', 'Petrochemical thresholding tasks'], why: 'Cannot capture spatial relationships or intensity gradients' },
      { strengths: ['Spatial coherence', 'Better boundaries', 'Seed-based flexibility'], weaknesses: ['Seed selection sensitive', 'Over-segmentation', 'Poor for heterogeneous lesions'], when: ['Well-defined lesions', 'Homogeneous backgrounds'], why: 'Fails with complex lesion textures and multi-class scenarios' },
      { strengths: ['Handles overlapping regions', 'Watershed lines provide boundaries'], weaknesses: ['Over-segmentation', 'Gradient computation sensitive', 'No shape priors'], when: ['Separating touching objects'], why: 'Does not learn from data and lacks classification capability' },
      { strengths: ['Intensity clustering', 'Unsupervised', 'Fast convergence'], weaknesses: ['Assumes spherical clusters', 'K selection required', 'No spatial information'], when: ['Homogeneous tissue segmentation'], why: 'Clustering alone cannot distinguish complex lesion patterns' },
      { strengths: ['Interpretable features', 'Handles tabular data well', 'Fast training'], weaknesses: ['Feature engineering required', 'Limited spatial information', 'No texture hierarchy'], when: ['Small datasets', 'When interpretability is key'], why: 'Radiomics features alone miss spatial context and texture patterns' },
      { strengths: ['Strong generalization', 'Effective in high dimensions', 'Memory efficient'], weaknesses: ['Kernel selection', 'Less effective with noisy features', 'Binary naturally'], when: ['Binary classification', 'High-dimensional sparse data'], why: 'SVM limitations with multi-class and inability to capture spatial features' },
      { strengths: ['Handles missing values', 'Feature importance', 'Ensemble robustness'], weaknesses: ['Still needs radiomics', 'Less effective for images', 'Feature selection critical'], when: ['Tabular clinical data', 'Mixed feature types'], why: 'XGBoost cannot learn spatial representations from raw images' },
      { strengths: ['Automatic feature learning', 'Translation invariant', 'End-to-end'], weaknesses: ['2D slices miss 3D context', 'Large data needed', 'Limited receptive field'], when: ['Slice-level analysis', '2D imaging modalities'], why: 'Loses volumetric context critical for 3D lesion characterization' },
      { strengths: ['3D spatial context', 'Volumetric convolutions', 'Better than 2D'], weaknesses: ['Computational cost', 'Memory intensive', 'No temporal modeling'], when: ['Volumetric data', 'When 3D context matters'], why: 'Treats all phases equally without modeling temporal dynamics' },
      { strengths: ['Focus on discriminative regions', 'Reduces noise', 'Interpretable attention maps'], weaknesses: ['Attention overhead', 'Still no phase modeling', 'Complexity'], when: ['When localization matters', 'Partial volume effects'], why: 'Does not explicitly model phase transition patterns' },
      { strengths: ['Adaptive architecture', 'Self-configuring', 'Strong baselines'], weaknesses: ['Very large model', 'Overkill for small datasets', 'Black box'], when: ['Benchmark comparison', 'Large datasets'], why: 'General architecture not specialized for multiphase imaging' },
      { strengths: ['Phase-aware convolutions', 'Temporal pattern capture', 'Clinical alignment'], weaknesses: ['Requires multiphase data', 'Phase alignment critical', 'Limited to CT'], when: ['Multiphase CT imaging', 'Dynamic contrast studies'], why: 'Deep features alone may miss texture patterns captured by radiomics' },
      { strengths: ['Best accuracy', 'Complementary features', 'Explainable outputs', 'Multi-scale analysis'], weaknesses: ['Slightly slower', 'Feature fusion complexity', 'Requires both pipelines'], when: ['Clinical deployment', 'Multi-class LI-RADS', 'When every % matters'], why: 'This IS the proposed method - combining all advantages' }
    ];

    document.getElementById('comparison-table-container').addEventListener('click', (e) => {
      const row = e.target.closest('tr');
      if (!row || row.parentElement.tagName === 'THEAD') return;
      const idx = Array.from(row.parentElement.children).indexOf(row);
      if (idx < 0 || idx >= detailInfo.length) return;
      const info = detailInfo[idx];
      const panel = document.getElementById('method-detail-panel');
      panel.style.display = 'block';
      panel.innerHTML = `
        <h4>${data.rows[idx][0]} - Details</h4>
        <div class="detail-grid">
          <div class="detail-col">
            <h5 style="color:#27ae60;">Strengths</h5>
            <ul>${info.strengths.map(s => `<li>${s}</li>`).join('')}</ul>
          </div>
          <div class="detail-col">
            <h5 style="color:#e74c3c;">Weaknesses</h5>
            <ul>${info.weaknesses.map(w => `<li>${w}</li>`).join('')}</ul>
          </div>
          <div class="detail-col">
            <h5 style="color:#2980b9;">When to Use</h5>
            <ul>${info.when.map(w => `<li>${w}</li>`).join('')}</ul>
          </div>
          <div class="detail-col">
            <h5 style="color:#8e44ad;">Why Improve?</h5>
            <p>${info.why}</p>
          </div>
        </div>
        <button class="btn btn-sm" onclick="this.parentElement.style.display='none'">Close</button>
      `;
      panel.scrollIntoView({ behavior: 'smooth' });
    });
  },

  initCharts() {
    const methods = ['Threshold', 'Reg. Growing', 'Watershed', 'K-Means', 'RF+Rad', 'SVM+Rad', 'XGB+Rad', '2D CNN', '3D CNN', 'Attn CNN', 'nnU-Net', 'Phase CNN', 'Fusion'];
    const accuracies = [65, 70, 68, 72, 78, 76, 80, 82, 85, 87, 86, 89, 92];
    const barColors = accuracies.map(a => a >= 90 ? '#f1c40f' : a >= 85 ? '#27ae60' : a >= 80 ? '#2980b9' : a >= 75 ? '#8e44ad' : '#e74c3c');

    Components.createChart(document.getElementById('accuracy-bar-chart'), 'bar', {
      labels: methods,
      datasets: [{
        label: 'Accuracy (%)',
        data: accuracies,
        backgroundColor: barColors,
        borderColor: barColors.map(c => c),
        borderWidth: 1
      }]
    }, {
      indexAxis: 'y',
      scales: { x: { min: 50, max: 100, title: { display: true, text: 'Accuracy (%)' } } },
      plugins: { legend: { display: false } }
    });

    const mlMethods = ['RF', 'SVM', 'XGBoost'];
    const dlMethods = ['2D CNN', '3D CNN', 'Attention CNN', 'nnU-Net', 'Phase CNN', 'Fusion'];
    const fpr = [0, 0.05, 0.1, 0.2, 0.3, 0.5, 0.7, 1.0];

    const rocDatasets = [
      { label: 'RF (AUC=0.82)', data: fpr.map((x, i) => ({ x, y: [0, 0.45, 0.62, 0.75, 0.82, 0.88, 0.93, 1.0][i] })), borderColor: '#e74c3c', tension: 0.4 },
      { label: 'SVM (AUC=0.80)', data: fpr.map((x, i) => ({ x, y: [0, 0.40, 0.58, 0.72, 0.80, 0.86, 0.92, 1.0][i] })), borderColor: '#e67e22', tension: 0.4 },
      { label: 'XGBoost (AUC=0.84)', data: fpr.map((x, i) => ({ x, y: [0, 0.48, 0.65, 0.78, 0.84, 0.90, 0.95, 1.0][i] })), borderColor: '#f39c12', tension: 0.4 },
      { label: '2D CNN (AUC=0.86)', data: fpr.map((x, i) => ({ x, y: [0, 0.52, 0.70, 0.80, 0.86, 0.92, 0.96, 1.0][i] })), borderColor: '#3498db', tension: 0.4 },
      { label: '3D CNN (AUC=0.89)', data: fpr.map((x, i) => ({ x, y: [0, 0.58, 0.75, 0.84, 0.89, 0.94, 0.97, 1.0][i] })), borderColor: '#9b59b6', tension: 0.4 },
      { label: 'Attention CNN (AUC=0.91)', data: fpr.map((x, i) => ({ x, y: [0, 0.62, 0.78, 0.87, 0.91, 0.95, 0.98, 1.0][i] })), borderColor: '#1abc9c', tension: 0.4 },
      { label: 'Phase CNN (AUC=0.93)', data: fpr.map((x, i) => ({ x, y: [0, 0.68, 0.82, 0.90, 0.93, 0.96, 0.98, 1.0][i] })), borderColor: '#2ecc71', tension: 0.4 },
      { label: 'Fusion (AUC=0.95)', data: fpr.map((x, i) => ({ x, y: [0, 0.72, 0.85, 0.92, 0.95, 0.97, 0.99, 1.0][i] })), borderColor: '#f1c40f', tension: 0.4 }
    ];

    Components.createChart(document.getElementById('auc-roc-chart'), 'line', {
      datasets: rocDatasets
    }, {
      scales: {
        x: { type: 'linear', title: { display: true, text: 'False Positive Rate' }, min: 0, max: 1 },
        y: { title: { display: true, text: 'True Positive Rate' }, min: 0, max: 1 }
      },
      elements: { point: { radius: 2 } }
    });

    Components.createChart(document.getElementById('radar-chart'), 'radar', {
      labels: ['Accuracy', 'AUC', 'Dice', 'Precision', 'Recall', 'F1'],
      datasets: [
        { label: 'XGBoost', data: [80, 84, 65, 79, 80, 79], borderColor: '#f39c12', fill: false },
        { label: '3D CNN', data: [85, 89, 82, 84, 85, 84], borderColor: '#9b59b6', fill: false },
        { label: 'Attention CNN', data: [87, 91, 84, 86, 87, 86], borderColor: '#1abc9c', fill: false },
        { label: 'Proposed', data: [92, 95, 89, 91, 92, 91], borderColor: '#f1c40f', backgroundColor: 'rgba(241,196,15,0.1)', fill: true }
      ]
    }, {
      scales: { r: { min: 60, max: 100 } }
    });

    const params = [0, 0, 0, 0, 10000, 5000, 50000, 500000, 2000000, 2500000, 30000000, 3000000, 3200000];
    const accScatter = accuracies;
    const scatterData = methods.map((m, i) => ({ x: Math.log10(params[i] + 1), y: accScatter[i] }));

    Components.createChart(document.getElementById('efficiency-scatter'), 'scatter', {
      datasets: [{
        label: 'Methods',
        data: scatterData,
        backgroundColor: barColors,
        pointRadius: 8,
        pointHoverRadius: 12
      }]
    }, {
      scales: {
        x: { title: { display: true, text: 'Log₁₀(Parameters)' } },
        y: { title: { display: true, text: 'Accuracy (%)' }, min: 60, max: 95 }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: (ctx) => `${methods[ctx.dataIndex]}: Acc=${accScatter[ctx.dataIndex]}%, Params=${params[ctx.dataIndex].toLocaleString()}`
          }
        }
      }
    });
  },

  initImprovementTracker() {
    const container = document.getElementById('improvement-tracker');
    const steps = [
      { from: 'Threshold (65%)', to: 'Region Growing (70%)', gain: '+5.0%', reason: 'Spatial coherence' },
      { from: 'Region Growing (70%)', to: 'K-Means (72%)', gain: '+2.0%', reason: 'Statistical learning' },
      { from: 'K-Means (72%)', to: 'RF+Radiomics (78%)', gain: '+6.0%', reason: 'Hand-crafted features' },
      { from: 'RF+Radiomics (78%)', to: 'XGBoost (80%)', gain: '+2.0%', reason: 'Ensemble boosting' },
      { from: 'XGBoost (80%)', to: '2D CNN (82%)', gain: '+2.0%', reason: 'Automatic features' },
      { from: '2D CNN (82%)', to: '3D CNN (85%)', gain: '+3.0%', reason: '3D spatial context' },
      { from: '3D CNN (85%)', to: 'Attention CNN (87%)', gain: '+2.0%', reason: 'Focus mechanism' },
      { from: 'Attention CNN (87%)', to: 'Phase-aware CNN (89%)', gain: '+2.0%', reason: 'Temporal modeling' },
      { from: 'Phase-aware CNN (89%)', to: 'Proposed Fusion (92%)', gain: '+3.0%', reason: 'Complementary features' }
    ];

    container.innerHTML = `
      <div class="improvement-summary">
        <h4>Total Improvement: 65% → 92% (+27 percentage points)</h4>
      </div>
      <div class="improvement-steps">
        ${steps.map((s, i) => `
          <div class="improvement-step" style="animation-delay:${i * 0.2}s">
            <div class="step-from">${s.from}</div>
            <div class="step-arrow">
              <span class="gain-badge">${s.gain}</span>
              <span class="arrow">→</span>
              <span class="reason">${s.reason}</span>
            </div>
            <div class="step-to">${s.to}</div>
          </div>
        `).join('')}
      </div>
    `;
  },

  initQuiz() {
    Components.createQuiz(document.getElementById('m16-quiz-container'), [
      {
        q: 'Why does the proposed fusion method outperform the phase-aware CNN alone?',
        options: [
          'Radiomics captures texture patterns that CNNs may miss',
          'The fusion model has more parameters',
          'Radiomics features are always better than learned features',
          'Fusion eliminates the need for data augmentation'
        ],
        correct: 0,
        explanation: 'Radiomics captures hand-crafted texture, shape, and intensity patterns that complement the learned deep features. This diversity improves robustness.'
      },
      {
        q: 'What is the main advantage of attention mechanisms over standard CNNs?',
        options: [
          'They reduce model size',
          'They focus computation on discriminative regions',
          'They eliminate the need for training data',
          'They work without convolutional layers'
        ],
        correct: 1,
        explanation: 'Attention mechanisms learn to weight different spatial regions by their importance, effectively focusing on the most discriminative parts of the image.'
      },
      {
        q: 'Why is nnU-Net not the best choice despite strong performance?',
        options: [
          'It is too slow for any clinical use',
          'It does not use 3D convolutions',
          'It lacks phase-awareness and has 30M parameters',
          'It cannot perform segmentation'
        ],
        correct: 2,
        explanation: 'nnU-Net achieves 86% accuracy but with 30M parameters and no temporal modeling. The proposed method achieves 92% with only 3.2M parameters and explicit phase modeling.'
      },
      {
        q: 'Which metric shows the largest gap between traditional and proposed methods?',
        options: [
          'Accuracy',
          "Cohen's Kappa (0.35 vs 0.82)",
          'Inference time',
          'Model size'
        ],
        correct: 1,
        explanation: "Cohen's Kappa improves from 0.35 (threshold) to 0.82 (fusion), showing dramatic improvement in agreement beyond chance. Accuracy goes from 65% to 92%, but Kappa shows the real clinical impact."
      }
    ]);
  },

  destroy() {
    document.getElementById('comparison-table-container').innerHTML = '';
    document.getElementById('accuracy-bar-chart').innerHTML = '';
    document.getElementById('auc-roc-chart').innerHTML = '';
    document.getElementById('radar-chart').innerHTML = '';
    document.getElementById('efficiency-scatter').innerHTML = '';
  }
});
