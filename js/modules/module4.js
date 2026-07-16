ModuleEngine.register('4', {
  init(container) {
    container.innerHTML = `
      <div class="module-content" id="module4-content">
        <h2 class="module-title">Module 4: LI-RADS - The Classification System</h2>
        <p class="module-subtitle">Liver Imaging Reporting and Data System v2018</p>

        <div class="objectives-panel">
          <h3>Learning Objectives</h3>
          <ol>
            <li>Understand the LI-RADS v2018 classification system</li>
            <li>Learn to distinguish LR-3, LR-4, and LR-5 categories</li>
            <li>Identify major imaging features (arterial enhancement, washout, capsule, threshold growth)</li>
            <li>Understand how radiologists use LI-RADS in clinical practice</li>
            <li>Learn why automated LI-RADS classification is challenging</li>
          </ol>
        </div>

        <div class="animation-panel">
          <h3>Interactive LI-RADS Decision Tree</h3>
          <canvas id="lirads-tree-canvas" width="900" height="520" role="img" aria-label="Interactive LI-RADS decision tree diagram showing classification pathways from LR-1 through LR-TIV"></canvas>
          <div id="tree-node-info" class="tree-info-panel" style="display:none;"></div>
          <div class="tree-controls">
            <button id="tree-quiz-toggle" class="btn btn-primary">Toggle Quiz Mode</button>
            <button id="tree-reset" class="btn btn-secondary">Reset Tree</button>
          </div>
        </div>

        <div class="feature-highlights-panel">
          <h3>Major Imaging Features</h3>
          <div class="feature-cards-grid" id="lirads-feature-cards"></div>
        </div>

        <div class="theory-panel">
          <h3>LI-RADS v2018 Overview</h3>
          <p>LI-RADS (Liver Imaging Reporting and Data System) is a standardized system developed by the American College of Radiology (ACR) for reporting CT and MRI findings in patients with cirrhosis at risk for hepatocellular carcinoma (HCC). It provides uniform terminology and categories to reduce variability in interpretation.</p>
          <p>The system classifies liver lesions into distinct categories based on specific imaging features observed on multiphasic contrast-enhanced CT or MRI examinations.</p>

          <div class="classification-table">
            <h4>LI-RADS Categories</h4>
            <table class="data-table">
              <thead>
                <tr><th>Category</th><th>Description</th><th>Color</th><th>Clinical Action</th></tr>
              </thead>
              <tbody>
                <tr><td style="color:#2ecc71;font-weight:bold">LR-1</td><td>Definitely benign</td><td><span class="color-dot" style="background:#2ecc71"></span></td><td>Surveillance continues</td></tr>
                <tr><td style="color:#3498db;font-weight:bold">LR-2</td><td>Probably benign</td><td><span class="color-dot" style="background:#3498db"></span></td><td>Surveillance continues</td></tr>
                <tr><td style="color:#f1c40f;font-weight:bold">LR-3</td><td>Intermediate probability of HCC</td><td><span class="color-dot" style="background:#f1c40f"></span></td><td>Consider short-interval follow-up</td></tr>
                <tr><td style="color:#e67e22;font-weight:bold">LR-4</td><td>Probably HCC</td><td><span class="color-dot" style="background:#e67e22"></span></td><td>Tissue diagnosis or treatment</td></tr>
                <tr><td style="color:#e74c3c;font-weight:bold">LR-5</td><td>Definitely HCC</td><td><span class="color-dot" style="background:#e74c3c"></span></td><td>Meets criteria for treatment</td></tr>
                <tr><td style="color:#9b59b6;font-weight:bold">LR-M</td><td>Malignant, not HCC-specific</td><td><span class="color-dot" style="background:#9b59b6"></span></td><td>Tissue sampling recommended</td></tr>
                <tr><td style="color:#795548;font-weight:bold">LR-TIV</td><td>Tumor in vein</td><td><span class="color-dot" style="background:#795548"></span></td><td>Advanced disease evaluation</td></tr>
              </tbody>
            </table>
          </div>

          <h4>Major Imaging Features</h4>
          <div class="features-detail">
            <div class="feature-detail-card">
              <h5>1. Arterial Phase Hyperenhancement (APHE)</h5>
              <p>Lesion shows higher enhancement than surrounding liver parenchyma during the arterial phase (typically 35-40 seconds post-injection). This reflects the hypervascular nature of HCC due to neoangiogenesis from hepatic arterial supply.</p>
              <ul>
                <li><strong>Subtypes:</strong> Nonrim APHE (most common in HCC) vs. rim APHE (suggests malignancy but not HCC)</li>
                <li><strong>Detection:</strong> Requires proper arterial phase timing</li>
                <li><strong>Significance:</strong> One of the key major features for LI-RADS 5 designation</li>
              </ul>
            </div>
            <div class="feature-detail-card">
              <h5>2. Non-peripheral Washout</h5>
              <p>Decrease in enhancement relative to liver parenchyma from arterial to portal venous or delayed phase. The enhancement decreases ("washes out") within the lesion, making it appear darker than surrounding liver.</p>
              <ul>
                <li><strong>Timing:</strong> Visible on portal venous (60-70s) or delayed (3-5 min) phases</li>
                <li><strong>Pattern:</strong> Diffuse or heterogeneous internal washout</li>
                <li><strong>Significance:</strong> Major feature; contributes to LR-5 when combined with APHE</li>
              </ul>
            </div>
            <div class="feature-detail-card">
              <h5>3. Enhancing Capsule</h5>
              <p>A smooth, thick, enhancing rim visible on portal venous or delayed phases surrounding the lesion. This represents the tumor capsule, a pathological feature of HCC.</p>
              <ul>
                <li><strong>Appearance:</strong> Smooth, complete or incomplete rim</li>
                <li><strong>Enhancement:</strong> Brighter than liver parenchyma on delayed phases</li>
                <li><strong>Significance:</strong> Major feature; helps distinguish HCC from other lesions</li>
              </ul>
            </div>
            <div class="feature-detail-card">
              <h5>4. Threshold Growth</h5>
              <p>Size increase of ≥50% in a short time interval (typically ≤6 months). This reflects the aggressive growth pattern of HCC.</p>
              <ul>
                <li><strong>Measurement:</strong> Based on longest diameter</li>
                <li><strong>Comparison:</b> Requires prior examination for reference</li>
                <li><strong>Significance:</strong> Major feature; indicates rapid tumor growth</li>
              </ul>
            </div>
          </div>

          <h4>Ancillary Features</h4>
          <p>Beyond the four major features, LI-RADS includes ancillary features that can upgrade or downgrade a lesion category:</p>
          <ul>
            <li><strong>Upgrade:</strong> Intravascular tumor thrombosis, fat in mass, washout appearance</li>
            <li><strong>Downgrade:</strong> Size stability, typical hemangioma, cyst, focal fatty sparing</li>
            <li><strong>General:</strong> Mild-moderate T2 hyperintensity, restricted diffusion, mosaic architecture</li>
          </ul>

          <h4>Comparison with Other Systems</h4>
          <table class="data-table comparison-table">
            <thead>
              <tr><th>Feature</th><th>LI-RADS v2018</th><th>OPTN/UNOS</th><th>AASLD</th></tr>
            </thead>
            <tbody>
              <tr><td>Number of categories</td><td>7</td><td>5 (1-5)</td><td>2 (HCC/not HCC)</td></tr>
              <tr><td>Lesion size threshold</td><td>10mm (LR-5)</td><td>1cm (Class 5)</td><td>1cm</td></tr>
              <tr><td>Major features used</td><td>4</td><td>2 (APHE + washout/capsule)</td><td>2 (APHE + washout)</td></tr>
              <tr><td>Ancillary features</td><td>Yes</td><td>No</td><td>Yes</td></tr>
              <tr><td>Inter-reader agreement</td><td>Moderate (κ=0.43-0.68)</td><td>Moderate</td><td>Moderate</td></tr>
            </tbody>
          </table>

          <h4>Inter-Reader Variability</h4>
          <p>A significant limitation of LI-RADS is inter-reader variability. Studies show kappa values ranging from 0.43 to 0.68 for LI-RADS categorization, indicating only moderate agreement among radiologists. This variability is a key motivation for AI-assisted classification.</p>
          <div id="variability-chart" class="chart-container" style="height:280px;"></div>
        </div>

        <div class="simulation-panel">
          <h3>Interactive Lesion Classifier</h3>
          <p>Place a lesion on the liver and adjust its imaging features to see the LI-RADS classification in real-time.</p>
          <div class="classifier-layout">
            <div class="liver-canvas-wrap">
              <canvas id="liver-cross-section" width="400" height="360" role="img" aria-label="Liver cross-section diagram for lesion placement"></canvas>
              <p class="hint">Click on the liver to place a lesion</p>
            </div>
            <div class="classifier-controls">
              <div class="control-group">
                <label for="lesion-size">Lesion Size (mm): <span id="size-val">15</span></label>
                <input type="range" id="lesion-size" min="2" max="80" value="15" step="1">
              </div>
              <div class="control-group">
                <label class="toggle-label">
                  <input type="checkbox" id="toggle-aphe"> Arterial Phase Hyperenhancement (APHE)
                </label>
              </div>
              <div class="control-group">
                <label class="toggle-label">
                  <input type="checkbox" id="toggle-washout"> Non-peripheral Washout
                </label>
              </div>
              <div class="control-group">
                <label class="toggle-label">
                  <input type="checkbox" id="toggle-capsule"> Enhancing Capsule
                </label>
              </div>
              <div class="control-group">
                <label class="toggle-label">
                  <input type="checkbox" id="toggle-growth"> Threshold Growth (≥50%)
                </label>
              </div>
              <div class="result-display" id="classification-result">
                <div class="result-category" id="result-cat">LR-3</div>
                <div class="result-label">LI-RADS Category</div>
                <div class="confidence-meter">
                  <div class="confidence-bar" id="confidence-bar" style="width:60%"></div>
                </div>
                <div class="confidence-text" id="confidence-text">Confidence: 60%</div>
              </div>
              <div class="accuracy-tracker">
                <h5>Case Tracker</h5>
                <div id="case-log"></div>
                <div class="accuracy-score">Accuracy: <span id="accuracy-score">0/0</span></div>
              </div>
            </div>
          </div>
        </div>

        <div class="code-panel">
          <h3>LI-RADS Classification Algorithm</h3>
          <div id="module4-code-block"></div>
        </div>

        <div class="quiz-panel">
          <h3>Knowledge Check</h3>
          <div id="module4-quiz"></div>
        </div>

        <div class="reflection-panel">
          <h3>Reflection & Research Context</h3>
          <div class="reflection-content">
            <h4>Clinical Significance</h4>
            <p>LI-RADS v2018 is the current standard for HCC diagnosis in cirrhotic patients. Its correct application directly impacts patient management decisions, including surveillance, treatment eligibility, and organ transplant listing.</p>
            
            <h4>The Inter-Reader Variability Problem</h4>
            <p>Studies consistently show moderate inter-reader agreement (κ=0.43-0.68) for LI-RADS categorization. This variability arises from:</p>
            <ul>
              <li>Subjective assessment of enhancement patterns</li>
              <li>Difficulty distinguishing subtle washout from background enhancement</li>
              <li>Challenges in measuring capsule appearance</li>
              <li>Reader experience and training differences</li>
              <li>Technical factors (scanner, timing, contrast protocol)</li>
            </ul>
            
            <h4>Why AI Can Help Standardize</h4>
            <p>Automated LI-RADS classification offers several advantages:</p>
            <ul>
              <li>Consistent feature extraction across readers</li>
              <li>Quantitative assessment of enhancement patterns</li>
              <li>Reduction in subjective interpretation variability</li>
              <li>Integration of quantitative imaging biomarkers</li>
              <li>Standardization across institutions and scanner types</li>
            </ul>
            
            <h4>Research Opportunity</h4>
            <p>This research aims to develop deep learning models that can automatically classify liver lesions according to LI-RADS v2018 criteria. By leveraging 3D nnU-Net segmentation and quantitative feature extraction, we can create a system that provides consistent, reproducible classifications while serving as a decision support tool for radiologists.</p>
          </div>
        </div>
      </div>
    `;

    this._quizMode = false;
    this._selectedNode = null;
    this._lesionPlaced = false;
    this._lesionPos = { x: 200, y: 180 };
    this._caseHistory = [];
    this._correct = 0;
    this._total = 0;

    this._initDecisionTree();
    this._initFeatureCards();
    this._initClassifier();
    this._initCode();
    this._initQuiz();
    this._initVariabilityChart();
    this._initEventListeners();
  },

  _initDecisionTree() {
    const canvas = document.getElementById('lirads-tree-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    this._treeCanvas = canvas;
    this._treeCtx = ctx;

    this._treeNodes = [
      { id: 'start', label: 'Apply LI-RADS', x: 450, y: 40, w: 160, h: 36, color: '#555', info: 'LI-RADS is applied to liver lesions detected on multiphasic CT or MRI in patients with cirrhosis or chronic liver disease.' },
      { id: 'cirrhotic', label: 'Cirrhotic liver?', x: 450, y: 110, w: 150, h: 32, color: '#34495e', info: 'Is the lesion in a cirrhotic or chronically diseased liver? LI-RADS is specifically designed for this population.' },
      { id: 'yes1', label: 'Yes', x: 300, y: 180, w: 50, h: 26, color: '#27ae60', info: 'Proceed with LI-RADS assessment for HCC.' },
      { id: 'notapp', label: 'LR-NC\nNot Categorized', x: 650, y: 180, w: 120, h: 32, color: '#95a5a6', info: 'LI-RADS does not apply to non-cirrhotic livers. Use other classification systems.' },
      { id: 'size', label: 'Size > 10mm?', x: 300, y: 250, w: 130, h: 30, color: '#2c3e50', info: 'Lesion diameter measurement is critical. Lesions <10mm require different assessment.' },
      { id: 'small', label: 'LR-3\n(Low risk)', x: 140, y: 320, w: 110, h: 32, color: '#f1c40f', info: 'LR-3: Small lesions (<10mm) are categorized as intermediate probability. Short-interval follow-up recommended.' },
      { id: 'aphe', label: 'APHE present?', x: 300, y: 320, w: 130, h: 30, color: '#8e44ad', info: 'Arterial Phase Hyperenhancement: Does the lesion show increased enhancement compared to liver in the arterial phase?' },
      { id: 'no-aphe', label: 'LR-3\n(No APHE)', x: 140, y: 400, w: 110, h: 32, color: '#f1c40f', info: 'LR-3: Lesions without APHE have lower probability of HCC.' },
      { id: 'features', label: 'Washout +\nCapsule +\nGrowth?', x: 300, y: 400, w: 130, h: 36, color: '#2c3e50', info: 'Assess for non-peripheral washout, enhancing capsule, and threshold growth (≥50% size increase).' },
      { id: 'lr5', label: 'LR-5\nDefinitely HCC', x: 140, y: 480, w: 110, h: 32, color: '#e74c3c', info: 'LR-5: APHE + 2 or more major features = Definitely HCC. Meets criteria for treatment without biopsy.' },
      { id: 'lr4', label: 'LR-4\nProbably HCC', x: 300, y: 480, w: 110, h: 32, color: '#e67e22', info: 'LR-4: APHE + 1 major feature = Probably HCC. Consider tissue diagnosis or treatment.' },
      { id: 'lr3-aphe', label: 'LR-3\n(No features)', x: 460, y: 480, w: 110, h: 32, color: '#f1c40f', info: 'LR-3: APHE without additional major features remains intermediate probability.' },
    ];

    this._treeEdges = [
      { from: 'start', to: 'cirrhotic' },
      { from: 'cirrhotic', to: 'yes1', label: 'Yes' },
      { from: 'cirrhotic', to: 'notapp', label: 'No' },
      { from: 'yes1', to: 'size' },
      { from: 'size', to: 'small', label: 'No' },
      { from: 'size', to: 'aphe', label: 'Yes' },
      { from: 'aphe', to: 'no-aphe', label: 'No' },
      { from: 'aphe', to: 'features', label: 'Yes' },
      { from: 'features', to: 'lr5', label: '≥2 features' },
      { from: 'features', to: 'lr4', label: '1 feature' },
      { from: 'features', to: 'lr3-aphe', label: '0 features' },
    ];

    this._animPulse = 0;
    this._drawTree();
  },

  _drawTree() {
    const ctx = this._treeCtx;
    const canvas = this._treeCanvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this._animPulse = (this._animPulse + 1) % 60;

    this._treeEdges.forEach(edge => {
      const from = this._treeNodes.find(n => n.id === edge.from);
      const to = this._treeNodes.find(n => n.id === edge.to);
      if (!from || !to) return;

      ctx.beginPath();
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 2;
      ctx.moveTo(from.x, from.y + from.h / 2);
      ctx.lineTo(to.x, to.y - to.h / 2);
      ctx.stroke();

      if (edge.label) {
        const mx = (from.x + to.x) / 2;
        const my = (from.y + from.h / 2 + to.y - to.h / 2) / 2;
        ctx.fillStyle = '#888';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(edge.label, mx + 8, my);
      }
    });

    this._treeNodes.forEach(node => {
      const isTerminal = node.id.startsWith('lr') || node.id === 'notapp' || node.id === 'small';
      const pulse = isTerminal ? Math.sin(this._animPulse * 0.1) * 0.15 + 0.85 : 1;

      ctx.fillStyle = node.color;
      ctx.globalAlpha = pulse;
      ctx.beginPath();
      const r = 6;
      ctx.roundRect(node.x - node.w / 2, node.y - node.h / 2, node.w, node.h, r);
      ctx.fill();
      ctx.globalAlpha = 1;

      ctx.strokeStyle = this._selectedNode === node.id ? '#fff' : 'transparent';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      const lines = node.label.split('\n');
      lines.forEach((line, i) => {
        ctx.fillText(line, node.x, node.y - (lines.length - 1) * 7 + i * 14);
      });
    });

    this._treeAnimFrame = requestAnimationFrame(() => this._drawTree());
  },

  _initFeatureCards() {
    const container = document.getElementById('lirads-feature-cards');
    if (!container) return;

    const features = [
      { id: 'aphe', title: 'Arterial Phase Hyperenhancement', color: '#e74c3c', desc: 'Higher enhancement than liver in arterial phase (35-40s post-injection). Reflects neoangiogenesis. Key indicator of HCC.' },
      { id: 'washout', title: 'Non-peripheral Washout', color: '#3498db', desc: 'Decrease in enhancement relative to liver from arterial to portal/delayed phase. Indicates arterial supply with rapid venous drainage.' },
      { id: 'capsule', title: 'Enhancing Capsule', color: '#2ecc71', desc: 'Smooth, thick enhancing rim on portal venous or delayed phases. Represents tumor capsule, a pathological hallmark of HCC.' },
      { id: 'growth', title: 'Threshold Growth', color: '#f39c12', desc: '≥50% size increase in ≤6 months. Reflects aggressive tumor biology. Requires comparison with prior examination.' },
    ];

    features.forEach(f => {
      const card = document.createElement('div');
      card.className = 'feature-card';
      card.dataset.feature = f.id;
      card.innerHTML = `
        <div class="feature-card-header" style="border-left: 4px solid ${f.color}">
          <h4>${f.title}</h4>
          <span class="expand-icon">▼</span>
        </div>
        <div class="feature-card-body" style="display:none;">
          <p>${f.desc}</p>
          <canvas class="feature-demo-canvas" width="300" height="120" data-feature="${f.id}"></canvas>
        </div>
      `;
      card.querySelector('.feature-card-header').addEventListener('click', () => {
        const body = card.querySelector('.feature-card-body');
        const icon = card.querySelector('.expand-icon');
        if (body.style.display === 'none') {
          body.style.display = 'block';
          icon.textContent = '▲';
          this._drawFeatureDemo(f.id);
        } else {
          body.style.display = 'none';
          icon.textContent = '▼';
        }
      });
      container.appendChild(card);
    });
  },

  _drawFeatureDemo(featureId) {
    const canvas = document.querySelector(`.feature-demo-canvas[data-feature="${featureId}"]`);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 300, 120);

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, 300, 120);

    if (featureId === 'aphe') {
      ctx.fillStyle = '#666';
      ctx.fillRect(20, 20, 80, 80);
      ctx.fillStyle = '#e74c3c';
      ctx.globalAlpha = 0.5 + Math.sin(Date.now() * 0.003) * 0.3;
      ctx.beginPath();
      ctx.arc(60, 60, 25, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#fff';
      ctx.font = '10px sans-serif';
      ctx.fillText('Arterial Phase', 110, 40);
      ctx.fillText('Lesion brighter', 110, 60);
      ctx.fillText('than liver', 110, 75);
    } else if (featureId === 'washout') {
      ctx.strokeStyle = '#3498db';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(30, 90);
      ctx.lineTo(70, 30);
      ctx.lineTo(120, 70);
      ctx.lineTo(170, 90);
      ctx.lineTo(220, 95);
      ctx.stroke();
      ctx.fillStyle = '#e74c3c';
      ctx.beginPath();
      ctx.arc(70, 30, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = '10px sans-serif';
      ctx.fillText('Enhancement', 240, 30);
      ctx.fillText('curve shows', 240, 45);
      ctx.fillText('washout', 240, 60);
    } else if (featureId === 'capsule') {
      ctx.fillStyle = '#666';
      ctx.fillRect(40, 15, 100, 90);
      ctx.strokeStyle = '#2ecc71';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(90, 60, 30, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#999';
      ctx.beginPath();
      ctx.arc(90, 60, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = '10px sans-serif';
      ctx.fillText('Enhancing rim', 160, 50);
      ctx.fillText('on delayed phase', 160, 65);
    } else if (featureId === 'growth') {
      ctx.strokeStyle = '#f39c12';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(70, 60, 20, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#f39c12';
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.arc(70, 60, 32, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#fff';
      ctx.font = '10px sans-serif';
      ctx.fillText('≥50% size increase', 160, 50);
      ctx.fillText('in ≤6 months', 160, 65);
    }
  },

  _initClassifier() {
    const liverCanvas = document.getElementById('liver-cross-section');
    if (!liverCanvas) return;
    this._liverCanvas = liverCanvas;
    this._liverCtx = liverCanvas.getContext('2d');
    this._drawLiver();

    liverCanvas.addEventListener('click', (e) => {
      const rect = liverCanvas.getBoundingClientRect();
      this._lesionPos = {
        x: (e.clientX - rect.left) * (liverCanvas.width / rect.width),
        y: (e.clientY - rect.top) * (liverCanvas.height / rect.height)
      };
      this._lesionPlaced = true;
      this._drawLiver();
      this._updateClassification();
    });

    const sizeSlider = document.getElementById('lesion-size');
    if (sizeSlider) {
      sizeSlider.addEventListener('input', (e) => {
        document.getElementById('size-val').textContent = e.target.value;
        this._updateClassification();
      });
    }

    ['toggle-aphe', 'toggle-washout', 'toggle-capsule', 'toggle-growth'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('change', () => this._updateClassification());
    });
  },

  _drawLiver() {
    const ctx = this._liverCtx;
    const canvas = this._liverCanvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.ellipse(200, 180, 150, 120, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#A0522D';
    ctx.beginPath();
    ctx.ellipse(200, 180, 140, 110, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#D2691E';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(200, 180, 150, 120, 0, 0, Math.PI * 2);
    ctx.stroke();

    if (this._lesionPlaced) {
      const size = parseInt(document.getElementById('lesion-size')?.value || 15);
      const radius = Math.max(5, size * 0.8);

      const aphe = document.getElementById('toggle-aphe')?.checked;
      const washout = document.getElementById('toggle-washout')?.checked;

      if (aphe) {
        ctx.fillStyle = '#e74c3c';
        ctx.globalAlpha = 0.4 + Math.sin(Date.now() * 0.003) * 0.2;
      } else if (washout) {
        ctx.fillStyle = '#3498db';
        ctx.globalAlpha = 0.7;
      } else {
        ctx.fillStyle = '#ccc';
        ctx.globalAlpha = 0.8;
      }

      ctx.beginPath();
      ctx.arc(this._lesionPos.x, this._lesionPos.y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      const capsule = document.getElementById('toggle-capsule')?.checked;
      if (capsule) {
        ctx.strokeStyle = '#2ecc71';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(this._lesionPos.x, this._lesionPos.y, radius + 3, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${size}mm`, this._lesionPos.x, this._lesionPos.y + 4);
    }

    ctx.fillStyle = '#aaa';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Liver Cross-Section', 200, 340);
  },

  _updateClassification() {
    const size = parseInt(document.getElementById('lesion-size')?.value || 15);
    const aphe = document.getElementById('toggle-aphe')?.checked || false;
    const washout = document.getElementById('toggle-washout')?.checked || false;
    const capsule = document.getElementById('toggle-capsule')?.checked || false;
    const growth = document.getElementById('toggle-growth')?.checked || false;

    let category, confidence;
    if (!aphe) {
      category = 'LR-3';
      confidence = 45 + (washout ? 10 : 0) + (capsule ? 10 : 0);
    } else {
      const majorCount = [washout, capsule, growth].filter(Boolean).length;
      if (majorCount >= 2) {
        category = 'LR-5';
        confidence = 85 + majorCount * 5;
      } else if (majorCount === 1) {
        category = size >= 10 ? 'LR-4' : 'LR-3';
        confidence = size >= 10 ? 70 : 50;
      } else {
        category = 'LR-3';
        confidence = 40;
      }
    }

    confidence = Math.min(confidence, 99);

    const colors = {
      'LR-1': '#2ecc71', 'LR-2': '#3498db', 'LR-3': '#f1c40f',
      'LR-4': '#e67e22', 'LR-5': '#e74c3c', 'LR-M': '#9b59b6'
    };

    const catEl = document.getElementById('result-cat');
    if (catEl) {
      catEl.textContent = category;
      catEl.style.color = colors[category] || '#fff';
    }

    const bar = document.getElementById('confidence-bar');
    if (bar) {
      bar.style.width = confidence + '%';
      bar.style.background = colors[category] || '#666';
    }

    const text = document.getElementById('confidence-text');
    if (text) text.textContent = `Confidence: ${confidence}%`;

    this._drawLiver();
  },

  _initCode() {
    const codeBlock = document.getElementById('module4-code-block');
    if (!codeBlock) return;

    const code = `# Module 4: LI-RADS Classification Logic
import numpy as np

def lirads_classify(size_mm, aphe, washout, capsule, threshold_growth):
    """
    Simplified LI-RADS v2018 classification.
    
    Parameters:
    -----------
    size_mm : float - lesion size in mm
    aphe : bool - arterial phase hyperenhancement
    washout : bool - non-peripheral washout
    capsule : bool - enhancing capsule
    threshold_growth : bool - ≥50% size increase
    
    Returns:
    --------
    str : LI-RADS category
    """
    if not aphe:
        if size_mm < 20:
            return "LR-3"
        else:
            return "LR-3"
    
    # APHE present
    major_count = sum([washout, capsule, threshold_growth])
    
    if major_count >= 2:
        return "LR-5"
    elif major_count == 1:
        if size_mm >= 10:
            return "LR-4"
        else:
            return "LR-3"
    else:
        if size_mm >= 10:
            return "LR-3"
        else:
            return "LR-2"

# Test cases
test_cases = [
    {"size": 15, "aphe": True, "washout": True, 
     "capsule": True, "growth": False, "expected": "LR-5"},
    {"size": 12, "aphe": True, "washout": True, 
     "capsule": False, "growth": False, "expected": "LR-4"},
    {"size": 8, "aphe": False, "washout": False, 
     "capsule": False, "growth": False, "expected": "LR-3"},
    {"size": 25, "aphe": True, "washout": True, 
     "capsule": True, "growth": True, "expected": "LR-5"},
]

for i, case in enumerate(test_cases):
    result = lirads_classify(
        case["size"], case["aphe"], 
        case["washout"], case["capsule"], case["growth"]
    )
    status = "✓" if result == case["expected"] else "✗"
    print(f"Case {i+1}: {result} {status}")`;

    if (typeof Components !== 'undefined') {
      Components.createCodeBlock(codeBlock, code);
    } else {
      codeBlock.innerHTML = `<pre><code>${code.replace(/</g, '&lt;')}</code></pre>`;
    }
  },

  _initQuiz() {
    const quizContainer = document.getElementById('module4-quiz');
    if (!quizContainer) return;

    const questions = [
      {
        q: 'A 12mm lesion in a cirrhotic liver shows APHE, non-peripheral washout, but no enhancing capsule and no threshold growth. What is the LI-RADS category?',
        options: ['LR-3', 'LR-4', 'LR-5', 'LR-M'],
        correct: 1,
        explanation: 'APHE + 1 major feature (washout only) + size ≥10mm = LR-4 (Probably HCC). Two or more major features would be needed for LR-5.'
      },
      {
        q: 'Which of the following is NOT a major imaging feature in LI-RADS v2018?',
        options: ['Arterial Phase Hyperenhancement (APHE)', 'Non-peripheral washout', 'Mild-moderate T2 hyperintensity', 'Enhancing capsule'],
        correct: 2,
        explanation: 'Mild-moderate T2 hyperintensity is an ancillary feature, not a major feature. The four major features are: APHE, non-peripheral washout, enhancing capsule, and threshold growth.'
      },
      {
        q: 'What is the minimum lesion size for an LR-5 designation in LI-RADS v2018?',
        options: ['5mm', '10mm', '15mm', '20mm'],
        correct: 1,
        explanation: 'LR-5 requires lesions ≥10mm with APHE plus at least 2 additional major features. Lesions smaller than 10mm cannot be classified as LR-5.'
      },
      {
        q: 'What is a key limitation of LI-RADS that motivates AI-based classification?',
        options: ['Too many categories', 'Inter-reader variability (κ=0.43-0.68)', 'Cannot be used with MRI', 'Requires biopsy confirmation'],
        correct: 1,
        explanation: 'Inter-reader variability is a significant limitation, with kappa values of 0.43-0.68 indicating only moderate agreement. AI can help standardize feature extraction and classification.'
      }
    ];

    if (typeof Components !== 'undefined') {
      Components.createQuiz(quizContainer, questions);
    } else {
      questions.forEach((q, i) => {
        const qDiv = document.createElement('div');
        qDiv.className = 'quiz-question';
        qDiv.innerHTML = `<p><strong>Q${i + 1}:</strong> ${q.q}</p>
          ${q.options.map((opt, j) => `<label><input type="radio" name="q4_${i}" value="${j}"> ${opt}</label>`).join('<br>')}
          <p class="explanation" style="display:none;color:#aaa;">${q.explanation}</p>`;
        qDiv.querySelectorAll('input[type=radio]').forEach(r => {
          r.addEventListener('change', () => {
            const exp = qDiv.querySelector('.explanation');
            exp.style.display = 'block';
            exp.style.color = parseInt(r.value) === q.correct ? '#2ecc71' : '#e74c3c';
          });
        });
        quizContainer.appendChild(qDiv);
      });
    }
  },

  _initVariabilityChart() {
    const chartEl = document.getElementById('variability-chart');
    if (!chartEl) return;

    if (typeof Components !== 'undefined') {
      Components.createChart(chartEl, 'bar', {
        labels: ['LR-1/2', 'LR-3', 'LR-4', 'LR-5', 'LR-M', 'Overall'],
        datasets: [{
          label: 'Kappa (κ) Agreement',
          data: [0.68, 0.52, 0.48, 0.61, 0.43, 0.54],
          backgroundColor: ['#2ecc71', '#f1c40f', '#e67e22', '#e74c3c', '#9b59b6', '#3498db'],
          borderWidth: 1
        }]
      }, {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, max: 1, title: { display: true, text: 'Kappa Value' } }
        }
      });
    }
  },

  _initEventListeners() {
    const resetBtn = document.getElementById('tree-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this._selectedNode = null;
        const infoPanel = document.getElementById('tree-node-info');
        if (infoPanel) infoPanel.style.display = 'none';
      });
    }

    const quizToggle = document.getElementById('tree-quiz-toggle');
    if (quizToggle) {
      quizToggle.addEventListener('click', () => {
        this._quizMode = !this._quizMode;
        quizToggle.textContent = this._quizMode ? 'Exit Quiz Mode' : 'Toggle Quiz Mode';
        const infoPanel = document.getElementById('tree-node-info');
        if (this._quizMode) {
          if (infoPanel) {
            infoPanel.style.display = 'block';
            infoPanel.innerHTML = '<h4>Quiz Mode Active</h4><p>You will be presented with lesion scenarios. Click the correct LI-RADS category on the tree.</p>';
          }
        }
      });
    }

    if (this._treeCanvas) {
      this._treeCanvas.addEventListener('click', (e) => {
        const rect = this._treeCanvas.getBoundingClientRect();
        const mx = (e.clientX - rect.left) * (this._treeCanvas.width / rect.width);
        const my = (e.clientY - rect.top) * (this._treeCanvas.height / rect.height);

        for (const node of this._treeNodes) {
          if (mx >= node.x - node.w / 2 && mx <= node.x + node.w / 2 &&
              my >= node.y - node.h / 2 && my <= node.y + node.h / 2) {
            this._selectedNode = node.id;
            const infoPanel = document.getElementById('tree-node-info');
            if (infoPanel) {
              infoPanel.style.display = 'block';
              infoPanel.innerHTML = `<h4>${node.label.replace(/\n/g, ' ')}</h4><p>${node.info}</p>`;
            }
            break;
          }
        }
      });
    }
  },

  destroy() {
    if (this._treeAnimFrame) cancelAnimationFrame(this._treeAnimFrame);
  }
});
