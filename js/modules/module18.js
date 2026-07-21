ModuleEngine.register('18', {
  init(container) {
    container.innerHTML = `
      <div class="module-header">
        <h2>Module 18: Complete PhD Workflow</h2>
        <p class="module-subtitle">Capstone: Execute the end-to-end research pipeline from data generation to clinical validation</p>
        <div class="objectives">
          <h3>Learning Objectives</h3>
          <ul>
            <li>Execute the complete research pipeline end-to-end</li>
            <li>Understand how each module connects to form the complete research</li>
            <li>Experience the full workflow from data generation to clinical validation</li>
            <li>Make decisions about method design choices</li>
            <li>Generate a research summary report</li>
          </ul>
        </div>
      </div>

      <div class="module-content">
        <!-- Pipeline Animation -->
        <section class="section">
          <h3>Complete Pipeline Overview</h3>
          <div id="pipeline-animation" class="pipeline-flow"></div>
          <div id="pipeline-progress" class="pipeline-progress-bar">
            <div class="progress-fill" id="pipeline-fill"></div>
            <span class="m18-progress-text" id="m18-progress-text">0% Complete</span>
          </div>
        </section>

        <!-- Theory -->
        <section class="section theory-section">
          <h3>Pipeline Theory</h3>
          <div class="theory-content">
            <h4>The Complete Research Workflow</h4>
            <p>This capstone module executes the entire PhD research pipeline, demonstrating how each component from previous modules integrates into a coherent research workflow.</p>
            <div class="pipeline-stages-info">
              <div class="stage-info">
                <h5>Data Collection & Generation</h5>
                <p>Synthetic multiphase CT data is generated mimicking clinical characteristics. In real research, this involves IRB-approved clinical data collection.</p>
                <p><strong>Time estimate:</strong> Months 1-3 (data acquisition), implemented here as instant generation.</p>
              </div>
              <div class="stage-info">
                <h5>Preprocessing</h5>
                <p>Normalization, resampling, and data augmentation ensure consistent input format across all samples.</p>
                <p><strong>Time estimate:</strong> 2-4 weeks for pipeline development and validation.</p>
              </div>
              <div class="stage-info">
                <h5>Segmentation</h5>
                <p>nnU-Net segments liver lesions from background tissue, providing regions of interest for downstream analysis.</p>
                <p><strong>Time estimate:</strong> 1-2 months for nnU-Net training and optimization.</p>
              </div>
              <div class="stage-info">
                <h5>Feature Extraction</h5>
                <p>Parallel extraction of radiomics features (105 features) and CNN features (512 features) for complementary representation.</p>
                <p><strong>Time estimate:</strong> 2-3 weeks for feature engineering and CNN training.</p>
              </div>
              <div class="stage-info">
                <h5>Fusion & Classification</h5>
                <p>Feature-level fusion combines radiomics and CNN features, fed into the classification network for LI-RADS prediction.</p>
                <p><strong>Time estimate:</strong> 1-2 months for fusion architecture development and tuning.</p>
              </div>
              <div class="stage-info">
                <h5>Explainability & Validation</h5>
                <p>GradCAM provides visual explanations. Statistical validation ensures results are reproducible and clinically meaningful.</p>
                <p><strong>Time estimate:</strong> 1-2 months for validation and paper writing.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- CAPSTONE SIMULATION -->
        <section class="section simulation-section">
          <h3>CAPSTONE PIPELINE RUNNER</h3>
          <div id="pipeline-steps" class="pipeline-steps-container">
            <!-- Step 1 -->
            <div class="pipeline-step" id="step1" data-step="1">
              <div class="step-header">
                <span class="step-number">1</span>
                <h4>Data Generation</h4>
                <button class="btn btn-run" data-step="1">Run</button>
                <span class="step-status" id="step1-status">Pending</span>
              </div>
              <div class="step-content" id="step1-content" style="display:none;">
                <div class="step-output">
                  <div id="data-gen-output"></div>
                </div>
              </div>
            </div>
            <!-- Step 2 -->
            <div class="pipeline-step" id="step2" data-step="2">
              <div class="step-header">
                <span class="step-number">2</span>
                <h4>Preprocessing</h4>
                <button class="btn btn-run" data-step="2" disabled>Run</button>
                <span class="step-status" id="step2-status">Pending</span>
              </div>
              <div class="step-content" id="step2-content" style="display:none;">
                <div class="step-output">
                  <div id="preprocess-output"></div>
                </div>
              </div>
            </div>
            <!-- Step 3 -->
            <div class="pipeline-step" id="step3" data-step="3">
              <div class="step-header">
                <span class="step-number">3</span>
                <h4>Segmentation</h4>
                <button class="btn btn-run" data-step="3" disabled>Run</button>
                <span class="step-status" id="step3-status">Pending</span>
              </div>
              <div class="step-content" id="step3-content" style="display:none;">
                <div class="step-output">
                  <div id="segmentation-output"></div>
                </div>
              </div>
            </div>
            <!-- Step 4 -->
            <div class="pipeline-step" id="step4" data-step="4">
              <div class="step-header">
                <span class="step-number">4</span>
                <h4>Radiomics Extraction</h4>
                <button class="btn btn-run" data-step="4" disabled>Run</button>
                <span class="step-status" id="step4-status">Pending</span>
              </div>
              <div class="step-content" id="step4-content" style="display:none;">
                <div class="step-output">
                  <div id="radiomics-output"></div>
                </div>
              </div>
            </div>
            <!-- Step 5 -->
            <div class="pipeline-step" id="step5" data-step="5">
              <div class="step-header">
                <span class="step-number">5</span>
                <h4>CNN Feature Extraction</h4>
                <button class="btn btn-run" data-step="5" disabled>Run</button>
                <span class="step-status" id="step5-status">Pending</span>
              </div>
              <div class="step-content" id="step5-content" style="display:none;">
                <div class="step-output">
                  <div id="cnn-features-output"></div>
                </div>
              </div>
            </div>
            <!-- Step 6 -->
            <div class="pipeline-step" id="step6" data-step="6">
              <div class="step-header">
                <span class="step-number">6</span>
                <h4>Feature Fusion</h4>
                <button class="btn btn-run" data-step="6" disabled>Run</button>
                <span class="step-status" id="step6-status">Pending</span>
              </div>
              <div class="step-content" id="step6-content" style="display:none;">
                <div class="step-output">
                  <div id="fusion-output"></div>
                </div>
              </div>
            </div>
            <!-- Step 7 -->
            <div class="pipeline-step" id="step7" data-step="7">
              <div class="step-header">
                <span class="step-number">7</span>
                <h4>Classification</h4>
                <button class="btn btn-run" data-step="7" disabled>Run</button>
                <span class="step-status" id="step7-status">Pending</span>
              </div>
              <div class="step-content" id="step7-content" style="display:none;">
                <div class="step-output">
                  <div id="classification-output"></div>
                </div>
              </div>
            </div>
            <!-- Step 8 -->
            <div class="pipeline-step" id="step8" data-step="8">
              <div class="step-header">
                <span class="step-number">8</span>
                <h4>Explainability</h4>
                <button class="btn btn-run" data-step="8" disabled>Run</button>
                <span class="step-status" id="step8-status">Pending</span>
              </div>
              <div class="step-content" id="step8-content" style="display:none;">
                <div class="step-output">
                  <div id="explainability-output"></div>
                </div>
              </div>
            </div>
            <!-- Step 9 -->
            <div class="pipeline-step" id="step9" data-step="9">
              <div class="step-header">
                <span class="step-number">9</span>
                <h4>Evaluation</h4>
                <button class="btn btn-run" data-step="9" disabled>Run</button>
                <span class="step-status" id="step9-status">Pending</span>
              </div>
              <div class="step-content" id="step9-content" style="display:none;">
                <div class="step-output">
                  <div id="evaluation-output"></div>
                </div>
              </div>
            </div>
            <!-- Step 10 -->
            <div class="pipeline-step" id="step10" data-step="10">
              <div class="step-header">
                <span class="step-number">10</span>
                <h4>Research Report</h4>
                <button class="btn btn-run" data-step="10" disabled>Run</button>
                <span class="step-status" id="step10-status">Pending</span>
              </div>
              <div class="step-content" id="step10-content" style="display:none;">
                <div class="step-output">
                  <div id="report-output"></div>
                </div>
              </div>
            </div>
          </div>
          <div id="run-all-container">
            <button id="run-all-btn" class="btn btn-primary btn-lg">Run Complete Pipeline</button>
          </div>
        </section>

        <!-- Quiz -->
        <section class="section">
          <h3>Knowledge Check</h3>
          <div id="m18-quiz-container"></div>
        </section>

        <!-- Reflection -->
        <section class="section reflection-section">
          <h3>Final Reflection</h3>
          <div class="reflection-content">
            <h4>What You've Learned</h4>
            <p>This virtual lab has walked you through the complete PhD research process in medical image analysis. You've experienced data generation, preprocessing, segmentation, feature extraction, deep learning, fusion, explainability, and evaluation.</p>

            <h4>Transitioning to Real Research</h4>
            <ul>
              <li><strong>Data:</strong> Move from synthetic to IRB-approved clinical data. Partner with radiologists for ground truth.</li>
              <li><strong>Validation:</strong> Add external validation on datasets from different institutions and scanners.</li>
              <li><strong>Clinical Integration:</strong> Work with clinicians to ensure the system fits into existing workflows.</li>
              <li><strong>Regulatory:</strong> Understand FDA/CE marking requirements for clinical AI tools.</li>
            </ul>

            <h4>Next Steps</h4>
            <ul>
              <li>Write your literature review chapter based on Module 17's gap analysis</li>
              <li>Collect real clinical data with proper ethical approvals</li>
              <li>Implement and validate each pipeline component systematically</li>
              <li>Conduct proper statistical analysis with cross-validation</li>
              <li>Prepare manuscripts for peer-reviewed publication</li>
            </ul>

            <h4>Ethical Considerations in Medical AI</h4>
            <ul>
              <li>Patient privacy and data de-identification</li>
              <li>Bias across demographics (age, sex, ethnicity)</li>
              <li>Informed consent for AI-assisted diagnosis</li>
              <li>Liability and accountability in clinical deployment</li>
              <li>Continuous monitoring and model updates</li>
            </ul>

            <h4>Future Directions</h4>
            <ul>
              <li>Federated learning for multi-institutional collaboration</li>
              <li>Foundation models for medical imaging</li>
              <li>Real-time inference for interventional guidance</li>
              <li>Multimodal integration (CT + MRI + pathology)</li>
              <li>Personalized risk prediction models</li>
            </ul>

            <div class="reflection-prompt">
              <h4>Your Research Plan</h4>
              <textarea placeholder="Based on what you've learned, outline your research plan. What will be your first step? What gaps will you address?" rows="6" style="width:100%; padding:10px; border:1px solid var(--border); border-radius:4px;"></textarea>
            </div>
          </div>
        </section>
      </div>
    ` + '<div style="padding:1rem 1.5rem 2rem;display:flex;justify-content:center;"><button data-navigate="home" class="px-6 py-3 rounded-xl border border-white/20 text-sm text-gray-300 hover:text-white hover:border-primary-400/50 transition-all cursor-pointer" style="background:rgba(255,255,255,0.04);min-height:44px;">&#x2190; Back to Home</button></div>';

    this.pipelineData = {};
    this.currentStep = 0;
    this.initPipelineAnimation();
    this.initQuiz();
    document.querySelectorAll('#pipeline-steps .btn-run').forEach(function(btn) {
      var step = parseInt(btn.getAttribute('data-step'));
      if (step) btn.addEventListener('click', function() { ModuleEngine._modules['18'].runStep(step); });
    });
    var runAllBtn = document.getElementById('run-all-btn');
    if (runAllBtn) runAllBtn.addEventListener('click', function() { ModuleEngine._modules['18'].runAllSteps(); });

    // Motion entrance animations
    requestAnimationFrame(() => {
      const header = container.querySelector('[style*="justify-content:space-between"]');
      if (header) Motion.fadeIn(header, { duration: 300 });
      const sections = container.querySelectorAll(':scope > div:not([style*="padding"])');
      sections.forEach((el, i) => {
        if (el === header) return;
        Motion.fadeUp(el, { duration: 400, delay: i * 60, distance: 16 });
      });
      container.querySelectorAll('[data-navigate="home"]').forEach(btn => {
        btn.addEventListener('click', (e) => Motion.ripple(e));
      });
    });
  },

  initPipelineAnimation() {
    const stages = [
      'Data Collection', 'Preprocessing', 'Registration', 'Segmentation',
      'Radiomics', 'CNN Features', 'Fusion', 'Classification', 'Explainability', 'Validation', 'Deployment'
    ];
    const container = document.getElementById('pipeline-animation');
    container.innerHTML = stages.map((s, i) => `
      <div class="pipeline-node" id="pnode-${i}" data-stage="${i}">
        <div class="node-icon">${['📊', '🔧', '📐', '🔍', '📈', '🧠', '🔗', '🎯', '💡', '✅', '🏥'][i]}</div>
        <div class="node-label">${s}</div>
        ${i < stages.length - 1 ? '<div class="node-arrow">→</div>' : ''}
      </div>
    `).join('');
  },

  updatePipelineProgress(step, total) {
    const pct = (step / total) * 100;
    document.getElementById('pipeline-fill').style.width = pct + '%';
    document.getElementById('m18-progress-text').textContent = Math.round(pct) + '% Complete';
  },

  updateStepUI(step, status) {
    const stepEl = document.getElementById('step' + step);
    const statusEl = document.getElementById('step' + step + '-status');
    stepEl.classList.add('completed');
    statusEl.textContent = status;
    statusEl.classList.add('status-' + status.toLowerCase());
    if (step < 10) {
      const nextBtn = document.querySelector('#step' + (step + 1) + ' .btn-run');
      if (nextBtn) nextBtn.disabled = false;
    }
    const node = document.getElementById('pnode-' + (step - 1));
    if (node) node.classList.add('active');
  },

  runStep(step) {
    const contentEl = document.getElementById('step' + step + '-content');
    contentEl.style.display = 'block';
    this.updateStepUI(step, 'Running');
    this.currentStep = Math.max(this.currentStep, step);
    this.updatePipelineProgress(step, 10);

    switch (step) {
      case 1: this.step1_GenerateData(); break;
      case 2: this.step2_Preprocess(); break;
      case 3: this.step3_Segment(); break;
      case 4: this.step4_Radiomics(); break;
      case 5: this.step5_CNNFeatures(); break;
      case 6: this.step6_Fusion(); break;
      case 7: this.step7_Classify(); break;
      case 8: this.step8_Explain(); break;
      case 9: this.step9_Evaluate(); break;
      case 10: this.step10_Report(); break;
    }
  },

  step1_GenerateData() {
    const output = document.getElementById('data-gen-output');
    const phases = ['arterial', 'portal_venous', 'delayed', 'non_contrast'];
    const nLesions = Math.floor(Math.random() * 3) + 1;
    const labels = [];
    for (let i = 0; i < nLesions; i++) {
      const r = Math.random();
      labels.push(r < 0.3 ? 'LR-3' : r < 0.6 ? 'LR-4' : 'LR-5');
    }
    this.pipelineData.labels = labels;
    this.pipelineData.nLesions = nLesions;

    output.innerHTML = `
      <h4>Generated Synthetic Multiphase CT</h4>
      <div class="data-cards">
        ${phases.map(p => `
          <div class="data-card">
            <canvas id="phase-canvas-${p}" width="120" height="120"></canvas>
            <span>${p.replace('_', ' ')}</span>
          </div>
        `).join('')}
      </div>
      <div class="data-stats">
        <p><strong>Volume size:</strong> 64 × 64 × 32 voxels</p>
        <p><strong>Number of lesions:</strong> ${nLesions}</p>
        <p><strong>Lesion labels:</strong> ${labels.join(', ')}</p>
        <p><strong>Spacing:</strong> 1.0 × 1.0 × 2.0 mm</p>
      </div>
    `;

    phases.forEach(p => {
      const canvas = document.getElementById('phase-canvas-' + p);
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const imgData = ctx.createImageData(120, 120);
      const intensities = {
        arterial: [80, 160, 120, 100],
        portal_venous: [90, 140, 110, 95],
        delayed: [85, 130, 105, 90],
        non_contrast: [70, 100, 85, 75]
      };
      const ints = intensities[p] || [100, 100, 100, 100];
      for (let y = 0; y < 120; y++) {
        for (let x = 0; x < 120; x++) {
          const idx = (y * 120 + x) * 4;
          let v = ints[0] + Math.random() * 20 - 10;
          const cx = 60, cy = 60, dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
          if (dist < 30) v = ints[1] + Math.random() * 30 - 15;
          if (dist < 15) v = ints[2] + Math.random() * 20 - 10;
          imgData.data[idx] = v;
          imgData.data[idx + 1] = v * 0.9;
          imgData.data[idx + 2] = v * 0.85;
          imgData.data[idx + 3] = 255;
        }
      }
      ctx.putImageData(imgData, 0, 0);
    });

    this.updateStepUI(1, 'Done');
    const btn = document.querySelector('#step2 .btn-run');
    if (btn) btn.disabled = false;
  },

  step2_Preprocess() {
    const output = document.getElementById('preprocess-output');
    output.innerHTML = `
      <h4>Preprocessing Pipeline</h4>
      <div class="preprocess-steps">
        <div class="pp-step">
          <h5>1. Intensity Normalization</h5>
          <p>Z-score normalization: μ = 0, σ = 1</p>
          <div class="before-after">
            <div class="before"><strong>Before:</strong> Range [0, 3071] HU</div>
            <div class="arrow">→</div>
            <div class="after"><strong>After:</strong> Range [-3.2, 4.1] σ</div>
          </div>
        </div>
        <div class="pp-step">
          <h5>2. Resampling</h5>
          <p>Target spacing: 1.0 × 1.0 × 2.0 mm³ (isotropic in-plane)</p>
        </div>
        <div class="pp-step">
          <h5>3. Data Augmentation</h5>
          <p>Random rotation (±15°), flipping, elastic deformation, intensity jittering</p>
          <p><strong>Effective training set:</strong> 200 → 800 samples (4× augmentation)</p>
        </div>
      </div>
      <div id="norm-chart"></div>
    `;

    Components.createChart(document.getElementById('norm-chart'), 'bar', {
      labels: ['Before Norm', 'After Norm'],
      datasets: [{
        label: 'Mean Intensity',
        data: [450, 0],
        backgroundColor: ['#e74c3c', '#27ae60']
      }, {
        label: 'Std Intensity',
        data: [280, 1],
        backgroundColor: ['#e67e22', '#2980b9']
      }]
    }, { plugins: { legend: { position: 'top' } } });

    this.updateStepUI(2, 'Done');
    const btn = document.querySelector('#step3 .btn-run');
    if (btn) btn.disabled = false;
  },

  step3_Segment() {
    const output = document.getElementById('segmentation-output');
    const diceScore = (0.85 + Math.random() * 0.10).toFixed(3);
    this.pipelineData.dice = diceScore;

    output.innerHTML = `
      <h4>nnU-Net Segmentation Results</h4>
      <div class="seg-result">
        <div class="seg-display">
          <canvas id="seg-canvas" width="200" height="200"></canvas>
          <div class="seg-overlay"></div>
        </div>
        <div class="seg-metrics">
          <div class="metric-card">
            <span class="metric-value">${diceScore}</span>
            <span class="metric-label">Dice Score</span>
          </div>
          <div class="metric-card">
            <span class="metric-value">${(0.88 + Math.random() * 0.08).toFixed(3)}</span>
            <span class="metric-label">Hausdorff 95%</span>
          </div>
          <div class="metric-card">
            <span class="metric-value">${(0.90 + Math.random() * 0.08).toFixed(3)}</span>
            <span class="metric-label">Volume Similarity</span>
          </div>
        </div>
      </div>
      <p><strong>Segmentation time:</strong> 2.3 seconds per volume</p>
      <p><strong>Lesions segmented:</strong> ${this.pipelineData.nLesions}</p>
    `;

    const canvas = document.getElementById('seg-canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, 200, 200);
      ctx.fillStyle = '#16213e';
      ctx.beginPath();
      ctx.arc(100, 100, 70, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#e74c3c';
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.ellipse(100, 100, 30, 25, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = '#f1c40f';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(100, 100, 32, 27, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    this.updateStepUI(3, 'Done');
    const btn = document.querySelector('#step4 .btn-run');
    if (btn) btn.disabled = false;
  },

  step4_Radiomics() {
    const output = document.getElementById('radiomics-output');
    const features = {
      'First Order': ['Mean', 'Std', 'Skewness', 'Kurtosis', 'Entropy', 'Energy', 'Uniformity', 'Range', 'Median', 'Interquartile'],
      'GLCM': ['Contrast', 'Correlation', 'Energy', 'Homogeneity', 'Entropy', 'Dissimilarity', 'Cluster Shade', 'Cluster Prominence'],
      'GLRLM': ['SRE', 'LRE', 'GLNU', 'RLNU', 'RP', 'LGRE', 'HGRE', 'SRLGLE', 'SRHGLE', 'LRLGLE', 'LRHGLE'],
      'Shape': ['Volume', 'Surface Area', 'Sphericity', 'Elongation', 'Compactness', 'Flatness', 'Maximum 3D Diameter']
    };

    let featureBars = '';
    const categories = Object.keys(features);
    categories.forEach(cat => {
      features[cat].forEach(f => {
        const val = (Math.random() * 2 - 1).toFixed(2);
        featureBars += `<div class="feature-bar" style="height:${Math.abs(val) * 40 + 5}px;background:${val > 0 ? '#27ae60' : '#e74c3c'}" title="${cat}: ${f} = ${val}"></div>`;
      });
    });

    output.innerHTML = `
      <h4>Radiomics Feature Extraction</h4>
      <div class="radiomics-stats">
        <div class="stat"><strong>Total features:</strong> 105</div>
        <div class="stat"><strong>First Order:</strong> ${features['First Order'].length}</div>
        <div class="stat"><strong>GLCM:</strong> ${features['GLCM'].length}</div>
        <div class="stat"><strong>GLRLM:</strong> ${features['GLRLM'].length}</div>
        <div class="stat"><strong>Shape:</strong> ${features['Shape'].length}</div>
      </div>
      <div class="feature-vector" style="display:flex;align-items:flex-end;gap:2px;height:100px;padding:10px;">
        ${featureBars}
      </div>
      <p><strong>Feature selection:</strong> 105 → 85 features (removing highly correlated >0.95)</p>
    `;

    this.pipelineData.radiomicsFeatures = 85;
    this.updateStepUI(4, 'Done');
    const btn = document.querySelector('#step5 .btn-run');
    if (btn) btn.disabled = false;
  },

  step5_CNNFeatures() {
    const output = document.getElementById('cnn-features-output');
    output.innerHTML = `
      <h4>CNN Feature Extraction</h4>
      <div class="cnn-arch">
        <p><strong>Architecture:</strong> Phase-Aware 3D CNN</p>
        <p><strong>Layers:</strong> PhaseConv → ResBlock × 4 → GlobalAvgPool → Dense(512)</p>
        <p><strong>Input:</strong> 4 × 64 × 64 × 32 (4 phases)</p>
        <p><strong>Output:</strong> 512-dimensional feature vector</p>
      </div>
      <div id="cnn-feature-chart"></div>
      <div class="feature-map-viz">
        <h5>Feature Maps (sample channels)</h5>
        <div class="feature-maps" style="display:flex;gap:8px;flex-wrap:wrap;">
          ${Array.from({ length: 16 }, (_, i) => `
            <canvas id="fmap-${i}" width="40" height="40"></canvas>
          `).join('')}
        </div>
      </div>
    `;

    const featureData = Array.from({ length: 32 }, () => (Math.random() * 2 - 1).toFixed(2));
    Components.createChart(document.getElementById('cnn-feature-chart'), 'bar', {
      labels: Array.from({ length: 32 }, (_, i) => 'F' + i),
      datasets: [{
        label: 'Feature Values (first 32 of 512)',
        data: featureData.map(Number),
        backgroundColor: featureData.map(v => v > 0 ? 'rgba(39,174,96,0.7)' : 'rgba(231,76,60,0.7)')
      }]
    }, { plugins: { legend: { display: false } } });

    for (let i = 0; i < 16; i++) {
      const canvas = document.getElementById('fmap-' + i);
      if (!canvas) continue;
      const ctx = canvas.getContext('2d');
      const imgData = ctx.createImageData(40, 40);
      for (let y = 0; y < 40; y++) {
        for (let x = 0; x < 40; x++) {
          const idx = (y * 40 + x) * 4;
          const v = Math.random() * 255;
          imgData.data[idx] = v;
          imgData.data[idx + 1] = v * 0.8;
          imgData.data[idx + 2] = v * 0.6;
          imgData.data[idx + 3] = 255;
        }
      }
      ctx.putImageData(imgData, 0, 0);
    }

    this.pipelineData.cnnFeatures = 512;
    this.updateStepUI(5, 'Done');
    const btn = document.querySelector('#step6 .btn-run');
    if (btn) btn.disabled = false;
  },

  step6_Fusion() {
    const output = document.getElementById('fusion-output');
    const totalFeatures = this.pipelineData.radiomicsFeatures + this.pipelineData.cnnFeatures;

    output.innerHTML = `
      <h4>Feature Fusion</h4>
      <div class="fusion-diagram">
        <div class="fusion-input">
          <div class="fusion-box radiomics">
            <h5>Radiomics Features</h5>
            <span class="feature-count">${this.pipelineData.radiomicsFeatures}</span>
          </div>
          <div class="fusion-plus">+</div>
          <div class="fusion-box cnn">
            <h5>CNN Features</h5>
            <span class="feature-count">${this.pipelineData.cnnFeatures}</span>
          </div>
        </div>
        <div class="fusion-arrow">↓ Concatenate ↓</div>
        <div class="fusion-output-box">
          <h5>Combined Feature Vector</h5>
          <span class="feature-count total">${totalFeatures}</span>
        </div>
      </div>
      <div class="fusion-details">
        <p><strong>Fusion method:</strong> Feature-level concatenation</p>
        <p><strong>Normalization:</strong> L2 normalization per feature set</p>
        <p><strong>Feature selection:</strong> ${totalFeatures} → ${Math.floor(totalFeatures * 0.85)} (removing low-variance features)</p>
        <p><strong>Rationale:</strong> Radiomics captures texture/shape, CNN captures spatial patterns. Concatenation preserves all information.</p>
      </div>
    `;

    this.pipelineData.fusedFeatures = Math.floor(totalFeatures * 0.85);
    this.updateStepUI(6, 'Done');
    const btn = document.querySelector('#step7 .btn-run');
    if (btn) btn.disabled = false;
  },

  step7_Classify() {
    const output = document.getElementById('classification-output');
    const accuracy = (0.90 + Math.random() * 0.04).toFixed(3);
    const auc = (0.93 + Math.random() * 0.04).toFixed(3);
    const f1 = (0.89 + Math.random() * 0.04).toFixed(3);
    this.pipelineData.metrics = { accuracy, auc, f1 };

    const confMatrix = [
      [Math.floor(15 + Math.random() * 5), Math.floor(Math.random() * 3), Math.floor(Math.random() * 2)],
      [Math.floor(Math.random() * 3), Math.floor(18 + Math.random() * 5), Math.floor(Math.random() * 3)],
      [Math.floor(Math.random() * 2), Math.floor(Math.random() * 3), Math.floor(20 + Math.random() * 5)]
    ];

    output.innerHTML = `
      <h4>Classification Results</h4>
      <div class="training-viz">
        <div id="loss-chart"></div>
      </div>
      <div class="prediction-results">
        <h5>Sample Predictions (Test Set)</h5>
        <div class="predictions">
          ${this.pipelineData.labels.map((label, i) => {
            const conf = (0.75 + Math.random() * 0.24).toFixed(2);
            return `<div class="pred-card">
              <span class="pred-true">True: ${label}</span>
              <span class="pred-pred">Pred: ${label}</span>
              <span class="pred-conf" style="color:${conf > 0.9 ? '#27ae60' : '#e67e22'}">Conf: ${conf}</span>
            </div>`;
          }).join('')}
        </div>
      </div>
      <div class="confusion-matrix">
        <h5>Confusion Matrix</h5>
        <table class="conf-table">
          <thead><tr><th></th><th>LR-3</th><th>LR-4</th><th>LR-5</th></tr></thead>
          <tbody>
            <tr><td><strong>LR-3</strong></td>${confMatrix[0].map(v => `<td class="${v > 2 ? 'conf-error' : ''}">${v}</td>`).join('')}</tr>
            <tr><td><strong>LR-4</strong></td>${confMatrix[1].map(v => `<td class="${v > 2 ? 'conf-error' : ''}">${v}</td>`).join('')}</tr>
            <tr><td><strong>LR-5</strong></td>${confMatrix[2].map(v => `<td class="${v > 2 ? 'conf-error' : ''}">${v}</td>`).join('')}</tr>
          </tbody>
        </table>
      </div>
      <div class="metrics-summary">
        <div class="metric-card"><span class="metric-value">${accuracy}</span><span class="metric-label">Accuracy</span></div>
        <div class="metric-card"><span class="metric-value">${auc}</span><span class="metric-label">AUC</span></div>
        <div class="metric-card"><span class="metric-value">${f1}</span><span class="metric-label">F1-Score</span></div>
        <div class="metric-card"><span class="metric-value">${(0.78 + Math.random() * 0.06).toFixed(3)}</span><span class="metric-label">Kappa</span></div>
      </div>
    `;

    const epochs = Array.from({ length: 50 }, (_, i) => i + 1);
    const trainLoss = epochs.map(e => 1.5 * Math.exp(-e / 15) + 0.05 + Math.random() * 0.02);
    const valLoss = epochs.map(e => 1.6 * Math.exp(-e / 18) + 0.08 + Math.random() * 0.03);

    Components.createChart(document.getElementById('loss-chart'), 'line', {
      labels: epochs,
      datasets: [
        { label: 'Train Loss', data: trainLoss, borderColor: '#3498db', tension: 0.4 },
        { label: 'Val Loss', data: valLoss, borderColor: '#e74c3c', tension: 0.4, borderDash: [5, 5] }
      ]
    }, {
      scales: {
        x: { title: { display: true, text: 'Epoch' } },
        y: { title: { display: true, text: 'Loss' } }
      }
    });

    this.updateStepUI(7, 'Done');
    const btn = document.querySelector('#step8 .btn-run');
    if (btn) btn.disabled = false;
  },

  step8_Explain() {
    const output = document.getElementById('explainability-output');
    output.innerHTML = `
      <h4>GradCAM Explanations</h4>
      <div class="gradcam-display">
        ${['LR-3 Lesion', 'LR-4 Lesion', 'LR-5 Lesion'].map((label, i) => `
          <div class="gradcam-case">
            <h5>${label}</h5>
            <canvas id="gradcam-${i}" width="150" height="150"></canvas>
            <div class="gradcam-info">
              <p><strong>Prediction:</strong> ${label} (${(0.80 + Math.random() * 0.19).toFixed(2)})</p>
              <p><strong>Key regions:</strong> ${['Peritumoral enhancement', 'Arterial hyperenhancement', 'Washout pattern'][i]}</p>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="attention-weights">
        <h5>Phase Attention Weights</h5>
        <div id="attention-chart"></div>
      </div>
    `;

    for (let i = 0; i < 3; i++) {
      const canvas = document.getElementById('gradcam-' + i);
      if (!canvas) continue;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, 150, 150);
      ctx.fillStyle = '#333';
      ctx.beginPath();
      ctx.arc(75, 75, 50, 0, Math.PI * 2);
      ctx.fill();
      const gradient = ctx.createRadialGradient(75, 75, 10, 75, 75, 50);
      const colors = [
        ['rgba(255,0,0,0.8)', 'rgba(255,255,0,0.4)', 'rgba(0,0,255,0.1)'],
        ['rgba(255,100,0,0.9)', 'rgba(255,200,0,0.5)', 'rgba(0,100,255,0.1)'],
        ['rgba(255,0,0,1)', 'rgba(255,100,0,0.7)', 'rgba(255,255,0,0.2)']
      ][i];
      gradient.addColorStop(0, colors[0]);
      gradient.addColorStop(0.5, colors[1]);
      gradient.addColorStop(1, colors[2]);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(75, 75, 40, 0, Math.PI * 2);
      ctx.fill();
    }

    Components.createChart(document.getElementById('attention-chart'), 'bar', {
      labels: ['Arterial', 'Portal Venous', 'Delayed', 'Non-Contrast'],
      datasets: [{
        label: 'Attention Weight',
        data: [0.35, 0.30, 0.25, 0.10],
        backgroundColor: ['#e74c3c', '#3498db', '#2ecc71', '#95a5a6']
      }]
    }, { plugins: { legend: { display: false } } });

    this.updateStepUI(8, 'Done');
    const btn = document.querySelector('#step9 .btn-run');
    if (btn) btn.disabled = false;
  },

  step9_Evaluate() {
    const output = document.getElementById('evaluation-output');
    const m = this.pipelineData.metrics;
    const kappa = (0.78 + Math.random() * 0.06).toFixed(3);
    const dice = (0.87 + Math.random() * 0.05).toFixed(3);

    output.innerHTML = `
      <h4>Complete Evaluation Dashboard</h4>
      <div class="eval-grid">
        <div class="eval-metrics">
          <h5>Classification Metrics</h5>
          <div class="metrics-table">
            <table>
              <tr><td>Accuracy</td><td><strong>${m.accuracy}</strong></td></tr>
              <tr><td>AUC</td><td><strong>${m.auc}</strong></td></tr>
              <tr><td>F1-Score</td><td><strong>${m.f1}</strong></td></tr>
              <tr><td>Precision</td><td><strong>${(0.89 + Math.random() * 0.04).toFixed(3)}</strong></td></tr>
              <tr><td>Recall</td><td><strong>${(0.90 + Math.random() * 0.04).toFixed(3)}</strong></td></tr>
              <tr><td>Cohen's Kappa</td><td><strong>${kappa}</strong></td></tr>
              <tr><td>Dice (Segmentation)</td><td><strong>${dice}</strong></td></tr>
            </table>
          </div>
        </div>
        <div class="eval-comparison">
          <h5>Comparison with Baselines</h5>
          <div id="eval-comparison-chart"></div>
        </div>
      </div>
      <div class="eval-significance">
        <h5>Statistical Significance</h5>
        <p>Wilcoxon signed-rank test (Proposed vs nnU-Net): <strong>p = 0.0023</strong> (statistically significant)</p>
        <p>5-fold cross-validation: Mean ± Std = ${m.accuracy} ± 0.012</p>
        <p>95% Confidence Interval: [${(parseFloat(m.accuracy) - 0.02).toFixed(3)}, ${(parseFloat(m.accuracy) + 0.02).toFixed(3)}]</p>
      </div>
    `;

    Components.createChart(document.getElementById('eval-comparison-chart'), 'bar', {
      labels: ['Threshold', 'RF+Rad', 'XGBoost', '3D CNN', 'nnU-Net', 'Phase CNN', 'Proposed'],
      datasets: [{
        label: 'Accuracy',
        data: [65, 78, 80, 85, 86, 89, 92],
        backgroundColor: ['#e74c3c', '#e67e22', '#f39c12', '#9b59b6', '#2c3e50', '#1abc9c', '#f1c40f']
      }]
    }, { plugins: { legend: { display: false } } });

    this.updateStepUI(9, 'Done');
    const btn = document.querySelector('#step10 .btn-run');
    if (btn) btn.disabled = false;
  },

  step10_Report() {
    const output = document.getElementById('report-output');
    const m = this.pipelineData.metrics;
    const kappa = (0.78 + Math.random() * 0.06).toFixed(3);
    const dice = (0.87 + Math.random() * 0.05).toFixed(3);

    output.innerHTML = `
      <h4>PhD Research Summary Report</h4>
      <div class="report-document">
        <div class="report-header">
          <h3>Phase-Aware 3D CNN-Radiomics Fusion for LI-RADS Classification</h3>
          <p class="report-subtitle">Virtual Research Laboratory — Complete Pipeline Results</p>
        </div>
        <div class="report-body">
          <div class="report-section">
            <h5>Abstract</h5>
            <p>This research proposes a novel phase-aware 3D CNN architecture combined with radiomics feature fusion for automated classification of liver lesions using multiphase CT imaging. The method addresses five critical research gaps: single-phase limitation, lack of interpretability, limited multi-class classification, absence of radiomics-DL fusion for LI-RADS, and the need for phase-aware architectures.</p>
          </div>
          <div class="report-section">
            <h5>Key Results</h5>
            <table class="report-table">
              <tr><td>Metric</td><td>Value</td><td>Baseline (nnU-Net)</td><td>Improvement</td></tr>
              <tr><td>Accuracy</td><td><strong>${m.accuracy}</strong></td><td>0.860</td><td>+${((parseFloat(m.accuracy) - 0.86) * 100).toFixed(1)}%</td></tr>
              <tr><td>AUC</td><td><strong>${m.auc}</strong></td><td>0.900</td><td>+${((parseFloat(m.auc) - 0.90) * 100).toFixed(1)}%</td></tr>
              <tr><td>F1-Score</td><td><strong>${m.f1}</strong></td><td>0.850</td><td>+${((parseFloat(m.f1) - 0.85) * 100).toFixed(1)}%</td></tr>
              <tr><td>Dice</td><td><strong>${dice}</strong></td><td>0.830</td><td>+${((parseFloat(dice) - 0.83) * 100).toFixed(1)}%</td></tr>
              <tr><td>Kappa</td><td><strong>${kappa}</strong></td><td>0.720</td><td>+${((parseFloat(kappa) - 0.72) * 100).toFixed(1)}%</td></tr>
            </table>
          </div>
          <div class="report-section">
            <h5>Contributions</h5>
            <ol>
              <li>Novel phase-aware 3D convolutional architecture modeling temporal CT dynamics</li>
              <li>Systematic CNN-radiomics fusion capturing complementary features</li>
              <li>Multi-class LI-RADS (LR-3/LR-4/LR-5) classification with 92% accuracy</li>
              <li>Explainable predictions via GradCAM for clinical trust</li>
              <li>Comprehensive comparison against 12 baseline methods</li>
            </ol>
          </div>
          <div class="report-section">
            <h5>Publication Plan</h5>
            <ul>
              <li><strong>Paper 1:</strong> Phase-aware CNN architecture (MICCAI / IEEE TMI)</li>
              <li><strong>Paper 2:</strong> Radiomics-DL fusion for LI-RADS (Medical Image Analysis)</li>
              <li><strong>Paper 3:</strong> Explainable AI for clinical liver lesion classification (Radiology: AI)</li>
            </ul>
          </div>
          <div class="report-section">
            <h5>Future Work</h5>
            <ul>
              <li>External validation on multi-institutional clinical data</li>
              <li>Federated learning for privacy-preserving multi-site training</li>
              <li>Integration with clinical PACS for workflow deployment</li>
              <li>Prospective clinical trial for validation</li>
            </ul>
          </div>
        </div>
        <div class="report-footer">
          <p>Generated by Interactive Virtual Research Laboratory — Module 18: Complete PhD Workflow</p>
          <p>Simulation Date: ${new Date().toLocaleDateString()}</p>
        </div>
      </div>
    `;

    this.updateStepUI(10, 'Done');
    this.updatePipelineProgress(10, 10);
    for (let i = 1; i <= 11; i++) {
      const node = document.getElementById('pnode-' + (i - 1));
      if (node) node.classList.add('completed');
    }
  },

  runAllSteps() {
    const btn = document.getElementById('run-all-btn');
    btn.disabled = true;
    btn.textContent = 'Running Pipeline...';

    let step = 1;
    const runNext = () => {
      if (step > 10) {
        btn.textContent = 'Pipeline Complete!';
        return;
      }
      this.runStep(step);
      step++;
      this._runTimer = setTimeout(runNext, 800);
    };
    runNext();
  },

  initQuiz() {
    Components.createQuiz(document.getElementById('m18-quiz-container'), [
      {
        q: 'Why is feature-level fusion preferred over decision-level fusion in this pipeline?',
        options: [
          'Feature-level fusion is computationally cheaper',
          'It preserves complementary information from both radiomics and CNN features before classification',
          'Decision-level fusion requires multiple models',
          'Feature-level fusion always outperforms decision-level'
        ],
        correct: 1,
        explanation: 'Feature-level fusion concatenates representations before the classifier, allowing it to learn optimal combinations of radiomics and CNN features. This preserves complementary information that might be lost in decision-level fusion.'
      },
      {
        q: 'What is the primary purpose of GradCAM in this pipeline?',
        options: [
          'To improve classification accuracy',
          'To reduce model parameters',
          'To provide visual explanations of model predictions for clinical trust',
          'To speed up inference time'
        ],
        correct: 2,
        explanation: 'GradCAM generates heatmaps showing which image regions most influenced the prediction, enabling radiologists to verify the model focuses on clinically relevant areas.'
      },
      {
        q: 'Why is the Wilcoxon signed-rank test used instead of a simple accuracy comparison?',
        options: [
          'It is faster to compute',
          'It tests whether performance differences are statistically significant, not just due to chance',
          'It works only for binary classification',
          'It does not require cross-validation'
        ],
        correct: 1,
        explanation: 'Statistical tests determine whether observed performance differences are likely genuine or could occur by random chance. A low p-value (p < 0.05) indicates the improvement is statistically significant.'
      },
      {
        q: 'What is the most critical next step before clinical deployment?',
        options: [
          'Increasing model parameters',
          'External validation on independent clinical datasets from multiple institutions',
          'Adding more training epochs',
          'Reducing the model size'
        ],
        correct: 1,
        explanation: 'External validation ensures the model generalizes beyond the training data. Multi-institutional testing accounts for variations in scanners, protocols, and patient populations, which is essential before clinical use.'
      }
    ]);
  },

  destroy() {
    this.pipelineData = {};
    this.currentStep = 0;
    if (this._runTimer) { clearTimeout(this._runTimer); this._runTimer = null; }
    document.querySelectorAll('.step-content').forEach(el => { el.style.display = 'none'; });
  }
});
