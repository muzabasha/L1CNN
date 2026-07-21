ModuleEngine.register('5', {
  init(container) {
    var header = Components.createModuleHeader('5', 'Synthetic Dataset');
    container.appendChild(header);
    container.innerHTML += `
      <div class="module-content" id="module5-content">
        <h2 class="module-title">Module 5: Synthetic Dataset Generator</h2>
        <p class="module-subtitle">Creating Realistic Training Data for Deep Learning</p>

        <div class="objectives-panel">
          <h3>Learning Objectives</h3>
          <ol>
            <li>Understand why synthetic data is valuable for research</li>
            <li>Learn to generate realistic synthetic liver CT data</li>
            <li>Control lesion characteristics (size, shape, texture, enhancement)</li>
            <li>Generate multiphase CT volumes with ground truth</li>
            <li>Understand data augmentation techniques</li>
          </ol>
        </div>

        <div class="animation-panel">
          <h3>Synthetic Data Generation Pipeline</h3>
          <canvas id="pipeline-canvas" width="900" height="200"></canvas>
        </div>

        <div class="theory-panel">
          <h3>Why Synthetic Data?</h3>
          <div class="theory-grid">
            <div class="theory-card">
              <h4>Privacy Protection</h4>
              <p>Patient data is protected by HIPAA/GDPR regulations. Synthetic data allows sharing and collaboration without privacy concerns. No IRB approval needed for synthetic datasets.</p>
            </div>
            <div class="theory-card">
              <h4>Data Scarcity</h4>
              <p>Labeled medical images are rare. Annotating liver lesions requires expert radiologists. Synthetic data can generate unlimited training examples with perfect ground truth labels.</p>
            </div>
            <div class="theory-card">
              <h4>Class Balance</h4>
              <p>Real datasets are imbalanced (few HCC cases, many normal). Synthetic data can generate balanced classes, improving model training and reducing bias.</p>
            </div>
            <div class="theory-card">
              <h4>Reproducibility</h4>
              <p>Synthetic datasets are reproducible. Different research groups can generate identical datasets, enabling fair comparison of algorithms.</p>
            </div>
          </div>

          <h4>Types of Synthetic Data Generation</h4>
          <table class="data-table">
            <thead>
              <tr><th>Method</th><th>Description</th><th>Pros</th><th>Cons</th></tr>
            </thead>
            <tbody>
              <tr><td>Rule-based</td><td>Mathematical models of anatomy</td><td>Controlled, interpretable</td><td>Limited realism</td></tr>
              <tr><td>Statistical</td><td>Probability distributions from real data</td><td>Data-driven</td><td>Requires real data</td></tr>
              <tr><td>GAN-based</td><td>Generative Adversarial Networks</td><td>High realism</td><td>Unstable training, artifacts</td></tr>
              <tr><td>Hybrid</td><td>Combination approaches</td><td>Best of both</td><td>Complex implementation</td></tr>
            </tbody>
          </table>

          <h4>Modeling Liver Anatomy</h4>
          <p>The liver is modeled as an ellipsoidal shape with realistic size variations. Key anatomical features include:</p>
          <ul>
            <li><strong>Shape:</strong> Ellipsoidal with adjustable eccentricity</li>
            <li><strong>Size:</strong> Normal (15-18cm) or cirrhotic (shrunken, irregular)</li>
            <li><strong>Texture:</strong> Homogeneous parenchyma with noise</li>
            <li><strong>Vessels:</strong> Portal vein, hepatic arteries (simplified)</li>
          </ul>

          <h4>Modeling Lesion Appearance</h4>
          <p>Lesions are generated with varying characteristics:</p>
          <ul>
            <li><strong>Shape:</strong> Round, irregular, or infiltrative</li>
            <li><strong>Size:</strong> 2-80mm diameter</li>
            <li><strong>Texture:</strong> Homogeneous or heterogeneous</li>
            <li><strong>Enhancement:</strong> APHE, washout, capsule patterns</li>
            <li><strong>Margin:</strong> Well-defined or ill-defined</li>
          </ul>

          <h4>CT Physics Simplification</h4>
          <p>CT imaging follows Beer-Lambert law for X-ray attenuation. We model Hounsfield Units (HU) for different tissues:</p>
          <table class="data-table">
            <thead>
              <tr><th>Tissue</th><th>HU Range</th><th>NC Phase</th><th>Arterial</th><th>Portal</th><th>Delayed</th></tr>
            </thead>
            <tbody>
              <tr><td>Liver parenchyma</td><td>40-70</td><td>55</td><td>75</td><td>95</td><td>80</td></tr>
              <tr><td>HCC lesion</td><td>-10 to 120</td><td>40</td><td>120</td><td>70</td><td>55</td></tr>
              <tr><td>Hemangioma</td><td>10-50</td><td>10</td><td>30</td><td>60</td><td>80</td></tr>
              <tr><td>Cyst</td><td>-10 to 15</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
            </tbody>
          </table>

          <h4>Noise Models</h4>
          <div class="noise-models">
            <div class="noise-card">
              <h5>Gaussian Noise</h5>
              <canvas class="noise-canvas" width="150" height="100" data-type="gaussian"></canvas>
              <p>Most common model. Simulates electronic noise in CT detectors.</p>
              <code>I(x) = I_clean(x) + N(0, σ²)</code>
            </div>
            <div class="noise-card">
              <h5>Poisson Noise</h5>
              <canvas class="noise-canvas" width="150" height="100" data-type="poisson"></canvas>
              <p>Models photon counting statistics. Signal-dependent noise.</p>
              <code>I(x) ~ Poisson(λ)</code>
            </div>
            <div class="noise-card">
              <h5>Rician Noise</h5>
              <canvas class="noise-canvas" width="150" height="100" data-type="rician"></canvas>
              <p>Common in MRI. Background noise follows Rician distribution.</p>
              <code>I(x) = √(X² + Y²)</code>
            </div>
          </div>

          <h4>Data Augmentation Techniques</h4>
          <ul>
            <li><strong>Elastic deformation:</strong> Simulates tissue deformation</li>
            <li><strong>Random rotation:</strong> ±15° to account for patient positioning</li>
            <li><strong>Intensity jittering:</strong> Adjusts contrast/brightness</li>
            <li><strong>Cropping/scaling:</strong> Different field-of-view sizes</li>
            <li><strong>Noise injection:</strong> Various noise levels and types</li>
          </ul>
        </div>

        <div class="simulation-panel">
          <h3>Interactive Dataset Generator</h3>
          <div class="generator-layout">
            <div class="generator-controls">
              <div class="control-section">
                <h4>Liver Parameters</h4>
                <div class="control-group">
                  <label for="liver-condition">Liver Condition: <span id="liver-cond-val">Normal</span></label>
                  <input type="range" id="liver-condition" min="0" max="100" value="0" step="1">
                  <div class="slider-labels"><span>Normal</span><span>Cirrhotic</span></div>
                </div>
                <div class="control-group">
                  <label for="noise-level">Background Noise: <span id="noise-val">20</span> HU</label>
                  <input type="range" id="noise-level" min="0" max="50" value="20" step="1">
                </div>
                <div class="control-group">
                  <label for="slice-thickness">Slice Thickness: <span id="slice-val">3</span>mm</label>
                  <input type="range" id="slice-thickness" min="1" max="8" value="3" step="1">
                </div>
              </div>

              <div class="control-section">
                <h4>Lesion Parameters</h4>
                <div class="control-group">
                  <label for="num-lesions">Number of Lesions: <span id="num-lesions-val">3</span></label>
                  <input type="range" id="num-lesions" min="1" max="10" value="3" step="1">
                </div>
                <div class="control-group">
                  <label for="min-size">Min Size: <span id="min-size-val">5</span>mm</label>
                  <input type="range" id="min-size" min="2" max="40" value="5" step="1">
                </div>
                <div class="control-group">
                  <label for="max-size">Max Size: <span id="max-size-val">30</span>mm</label>
                  <input type="range" id="max-size" min="10" max="80" value="30" step="1">
                </div>
                <div class="control-group">
                  <label for="lesion-shape">Lesion Shape:</label>
                  <select id="lesion-shape">
                    <option value="round">Round</option>
                    <option value="irregular">Irregular</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>
                <div class="control-group">
                  <label for="enhancement-pattern">Enhancement Pattern:</label>
                  <select id="enhancement-pattern">
                    <option value="hcc">HCC (APHE + washout)</option>
                    <option value="hemangioma">Hemangioma (peripheral nodular)</option>
                    <option value="metastasis">Metastasis (rim enhancement)</option>
                    <option value="cyst">Cyst (no enhancement)</option>
                  </select>
                </div>
              </div>

              <div class="control-section">
                <h4>Output Parameters</h4>
                <div class="control-group">
                  <label for="matrix-size">Matrix Size: <span id="matrix-val">128</span></label>
                  <input type="range" id="matrix-size" min="64" max="512" value="128" step="64">
                </div>
                <div class="control-group">
                  <label for="volume-depth">Volume Depth: <span id="m5-depth-val">32</span>slices</label>
                  <input type="range" id="volume-depth" min="16" max="64" value="32" step="8">
                </div>
              </div>

              <button id="generate-btn" class="btn btn-primary btn-large">Generate Dataset</button>
              <button id="download-btn" class="btn btn-secondary" disabled>Download as .npy</button>
            </div>

            <div class="generator-output">
              <h4>Generated Phases</h4>
              <div class="phase-grid">
                <div class="phase-card">
                  <h5>Non-Contrast (NC)</h5>
                  <canvas id="phase-nc" width="200" height="200"></canvas>
                </div>
                <div class="phase-card">
                  <h5>Arterial Phase</h5>
                  <canvas id="phase-arterial" width="200" height="200"></canvas>
                </div>
                <div class="phase-card">
                  <h5>Portal Venous</h5>
                  <canvas id="phase-portal" width="200" height="200"></canvas>
                </div>
                <div class="phase-card">
                  <h5>Delayed Phase</h5>
                  <canvas id="phase-delayed" width="200" height="200"></canvas>
                </div>
              </div>
              <div class="phase-card" style="margin-top:10px;">
                <h5>Ground Truth Mask</h5>
                <canvas id="phase-mask" width="200" height="200"></canvas>
              </div>
              <div class="generation-progress" id="gen-progress" style="display:none;">
                <div class="progress-bar"><div class="progress-fill m5-progress-fill"></div></div>
                <p class="m5-progress-text">Generating...</p>
              </div>
            </div>
          </div>
        </div>

        <div class="code-panel">
          <h3>Synthetic CT Generator Code</h3>
          <div id="module5-code-block"></div>
        </div>

        <div class="quiz-panel">
          <h3>Knowledge Check</h3>
          <div id="module5-quiz"></div>
        </div>

        <div class="reflection-panel">
          <h3>Reflection & Research Context</h3>
          <div class="reflection-content">
            <h4>Synthetic Data Limitations</h4>
            <ul>
              <li>May not capture all real-world variability</li>
              <li>Domain gap between synthetic and real data</li>
              <li>Models trained only on synthetic data may underperform on clinical data</li>
              <li>Cannot replace the need for real clinical validation</li>
            </ul>
            
            <h4>Validation Strategies</h4>
            <ul>
              <li>Compare statistical distributions with real datasets</li>
              <li>Expert review of generated images</li>
              <li>Train on synthetic, test on real data</li>
              <li>Measure domain adaptation performance</li>
              <li>Use metrics: FID, SSIM, PSNR for image quality</li>
            </ul>
            
            <h4>Combining with Real Data</h4>
            <p>The optimal strategy is to use synthetic data for pre-training or augmentation, then fine-tune on real clinical data. This hybrid approach leverages the strengths of both data sources.</p>
          </div>
        </div>
      </div>
    ` + '<div style="padding:1rem 1.5rem 2rem;display:flex;justify-content:center;"><button data-navigate="home" class="px-6 py-3 rounded-xl border border-white/20 text-sm text-gray-300 hover:text-white hover:border-primary-400/50 transition-all cursor-pointer" style="background:rgba(255,255,255,0.04);min-height:44px;">&#x2190; Back to Home</button></div>';

    this._generatedData = null;
    this._animFrame = null;
    this._pipelineStep = 0;

    this._initPipelineAnimation();
    this._initNoiseCanvases();
    this._initGenerator();
    this._initCode();
    this._initQuiz();
    this._initEventListeners();

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

  _initPipelineAnimation() {
    const canvas = document.getElementById('pipeline-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    this._pipelineCanvas = canvas;
    this._pipelineCtx = ctx;

    this._pipelineStages = [
      { label: 'Random\nParameters', color: '#3498db', icon: '?' },
      { label: 'Shape\nGeneration', color: '#2ecc71', icon: '◯' },
      { label: 'Texture\nSynthesis', color: '#f39c12', icon: '~' },
      { label: 'Enhancement\nModeling', color: '#e74c3c', icon: '▲' },
      { label: 'Noise\nAddition', color: '#9b59b6', icon: '±' },
      { label: 'Multiphase\nCT Output', color: '#1abc9c', icon: '◎' },
    ];

    this._animTime = 0;
    this._drawPipeline();
  },

  _drawPipeline() {
    const ctx = this._pipelineCtx;
    const canvas = this._pipelineCanvas;
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    this._animTime += 0.02;

    const stageWidth = 110;
    const gap = 30;
    const startX = (canvas.width - (this._pipelineStages.length * (stageWidth + gap) - gap)) / 2;

    this._pipelineStages.forEach((stage, i) => {
      const x = startX + i * (stageWidth + gap);
      const y = 70;
      const pulse = Math.sin(this._animTime + i * 0.8) * 5;

      ctx.fillStyle = stage.color;
      ctx.globalAlpha = 0.15;
      ctx.beginPath();
      ctx.roundRect(x, y - 30 + pulse, stageWidth, 60, 8);
      ctx.fill();
      ctx.globalAlpha = 1;

      ctx.strokeStyle = stage.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(x, y - 30 + pulse, stageWidth, 60, 8);
      ctx.stroke();

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      const lines = stage.label.split('\n');
      lines.forEach((line, li) => {
        ctx.fillText(line, x + stageWidth / 2, y - 5 + li * 14 + pulse);
      });

      if (i < this._pipelineStages.length - 1) {
        const arrowX1 = x + stageWidth + 5;
        const arrowX2 = arrowX1 + gap - 10;
        const arrowY = y + pulse;

        const flowPos = ((this._animTime * 0.5 + i * 0.3) % 1);

        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(arrowX1, arrowY);
        ctx.lineTo(arrowX2, arrowY);
        ctx.stroke();

        const dotX = arrowX1 + (arrowX2 - arrowX1) * flowPos;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(dotX, arrowY, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    this._animFrame = requestAnimationFrame(() => this._drawPipeline());
  },

  _initNoiseCanvases() {
    document.querySelectorAll('.noise-canvas').forEach(canvas => {
      const ctx = canvas.getContext('2d');
      const type = canvas.dataset.type;
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, 150, 100);

      for (let x = 0; x < 150; x++) {
        for (let y = 0; y < 100; y++) {
          let noise;
          if (type === 'gaussian') {
            const u1 = Math.random();
            const u2 = Math.random();
            noise = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
            noise = 128 + noise * 40;
          } else if (type === 'poisson') {
            const lambda = 50 + Math.sin(x * 0.1) * 20;
            let sum = 0;
            for (let k = 0; k < lambda; k++) sum += Math.random() < (lambda / 100) ? 1 : 0;
            noise = sum * 2;
          } else {
            const u1 = Math.random();
            const u2 = Math.random();
            const x1 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
            const x2 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
            noise = Math.sqrt(x1 * x1 + x2 * x2) * 80;
          }
          const v = Math.max(0, Math.min(255, noise));
          ctx.fillStyle = `rgb(${v},${v},${v})`;
          ctx.fillRect(x, y, 1, 1);
        }
      }
    });
  },

  _initGenerator() {
    const generateBtn = document.getElementById('generate-btn');
    if (!generateBtn) return;

    generateBtn.addEventListener('click', () => {
      this._runGeneration();
    });
  },

  _runGeneration() {
    const progressEl = document.getElementById('gen-progress');
    const fillEl = progressEl?.querySelector('.m5-progress-fill');
    const textEl = progressEl?.querySelector('.m5-progress-text');
    if (progressEl) progressEl.style.display = 'block';

    const steps = [
      'Generating liver shape...',
      'Placing lesions...',
      'Computing NC phase...',
      'Computing arterial phase...',
      'Computing portal phase...',
      'Computing delayed phase...',
      'Adding noise...',
      'Creating ground truth mask...',
      'Complete!'
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step >= steps.length) {
        clearInterval(interval);
        this._drawAllPhases();
        const downloadBtn = document.getElementById('download-btn');
        if (downloadBtn) downloadBtn.disabled = false;
        return;
      }
      if (fillEl) fillEl.style.width = ((step + 1) / steps.length * 100) + '%';
      if (textEl) textEl.textContent = steps[step];
      step++;
    }, 300);
  },

  _drawAllPhases() {
    const matrixSize = parseInt(document.getElementById('matrix-size')?.value || 128);
    const numLesions = parseInt(document.getElementById('num-lesions')?.value || 3);
    const noise = parseInt(document.getElementById('noise-level')?.value || 20);
    const minSize = parseInt(document.getElementById('min-size')?.value || 5);
    const maxSize = parseInt(document.getElementById('max-size')?.value || 30);
    const pattern = document.getElementById('enhancement-pattern')?.value || 'hcc';
    const liverCond = parseInt(document.getElementById('liver-condition')?.value || 0);

    const phases = ['nc', 'arterial', 'portal', 'delayed'];
    const phaseColors = {
      nc: [55, 55, 55],
      arterial: [75, 75, 75],
      portal: [95, 95, 95],
      delayed: [80, 80, 80]
    };

    const lesions = [];
    for (let i = 0; i < numLesions; i++) {
      const r = minSize + Math.random() * (maxSize - minSize);
      lesions.push({
        x: 60 + Math.random() * (matrixSize - 120),
        y: 60 + Math.random() * (matrixSize - 120),
        radius: r * 0.5,
        pattern: pattern
      });
    }

    phases.forEach(phase => {
      const canvas = document.getElementById(`phase-${phase}`);
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const displaySize = 200;
      const scale = displaySize / matrixSize;

      const imageData = ctx.createImageData(displaySize, displaySize);

      for (let py = 0; py < displaySize; py++) {
        for (let px = 0; px < displaySize; px++) {
          const ox = px / scale;
          const oy = py / scale;

          const cx = matrixSize / 2;
          const cy = matrixSize / 2;
          const dx = (ox - cx) / (matrixSize * 0.35);
          const dy = (oy - cy) / (matrixSize * 0.28);
          const inLiver = (dx * dx + dy * dy) < 1;

          let intensity = 0;
          if (inLiver) {
            const cirrhoticMod = liverCond / 100 * 15;
            intensity = phaseColors[phase][0] - cirrhoticMod + (Math.random() - 0.5) * noise;
          } else {
            intensity = 10 + (Math.random() - 0.5) * noise * 0.3;
          }

          lesions.forEach(lesion => {
            const ldx = ox - lesion.x;
            const ldy = oy - lesion.y;
            const dist = Math.sqrt(ldx * ldx + ldy * ldy);

            if (dist < lesion.radius) {
              if (lesion.pattern === 'hcc') {
                if (phase === 'arterial') intensity = 120 + (Math.random() - 0.5) * noise;
                else if (phase === 'portal') intensity = 50 + (Math.random() - 0.5) * noise;
                else if (phase === 'delayed') intensity = 35 + (Math.random() - 0.5) * noise;
                else intensity = 40 + (Math.random() - 0.5) * noise;
              } else if (lesion.pattern === 'hemangioma') {
                if (phase === 'nc') intensity = 10;
                else if (phase === 'arterial') intensity = 30;
                else if (phase === 'portal') intensity = 60;
                else intensity = 80;
                intensity += (Math.random() - 0.5) * noise;
              } else if (lesion.pattern === 'cyst') {
                intensity = 0 + (Math.random() - 0.5) * 5;
              } else {
                if (phase === 'arterial') intensity = 100;
                else intensity = 60;
                intensity += (Math.random() - 0.5) * noise;
              }
            } else if (dist < lesion.radius + 2) {
              if (lesion.pattern === 'hcc' && phase !== 'nc') {
                intensity = 110;
              }
            }
          });

          const idx = (py * displaySize + px) * 4;
          const v = Math.max(0, Math.min(255, Math.round(intensity)));
          imageData.data[idx] = v;
          imageData.data[idx + 1] = v;
          imageData.data[idx + 2] = v;
          imageData.data[idx + 3] = 255;
        }
      }
      ctx.putImageData(imageData, 0, 0);
    });

    const maskCanvas = document.getElementById('phase-mask');
    if (maskCanvas) {
      const mCtx = maskCanvas.getContext('2d');
      const displaySize = 200;
      const scale = displaySize / matrixSize;
      const maskData = mCtx.createImageData(displaySize, displaySize);

      const maskColors = [
        [50, 50, 50],
        [255, 80, 80],
        [80, 255, 80],
        [80, 80, 255],
        [255, 255, 80],
        [255, 80, 255]
      ];

      for (let py = 0; py < displaySize; py++) {
        for (let px = 0; px < displaySize; px++) {
          const ox = px / scale;
          const oy = py / scale;
          const idx = (py * displaySize + px) * 4;

          const cx = matrixSize / 2;
          const cy = matrixSize / 2;
          const dx = (ox - cx) / (matrixSize * 0.35);
          const dy = (oy - cy) / (matrixSize * 0.28);
          const inLiver = (dx * dx + dy * dy) < 1;

          let color = maskColors[0];

          if (inLiver) {
            let lesionIdx = -1;
            lesions.forEach((lesion, li) => {
              const ldx = ox - lesion.x;
              const ldy = oy - lesion.y;
              if (Math.sqrt(ldx * ldx + ldy * ldy) < lesion.radius) {
                lesionIdx = li;
              }
            });
            if (lesionIdx >= 0) {
              color = maskColors[(lesionIdx % (maskColors.length - 1)) + 1];
            } else {
              color = [80, 80, 80];
            }
          }

          maskData.data[idx] = color[0];
          maskData.data[idx + 1] = color[1];
          maskData.data[idx + 2] = color[2];
          maskData.data[idx + 3] = 255;
        }
      }
      mCtx.putImageData(maskData, 0, 0);
    }

    this._generatedData = { lesions, matrixSize, noise };
  },

  _initCode() {
    const codeBlock = document.getElementById('module5-code-block');
    if (!codeBlock) return;

    const code = `import numpy as np
from scipy.ndimage import gaussian_filter
import matplotlib.pyplot as plt

class SyntheticCTGenerator:
    def __init__(self, volume_size=(128, 128, 64)):
        self.size = volume_size
        self.hounsfield_liver = 60
        self.hounsfield_tumor = 40
        
    def generate_liver_mask(self):
        """Generate ellipsoidal liver mask."""
        z, y, x = np.ogrid[:self.size[0], :self.size[1], :self.size[2]]
        cx, cy, cz = [s // 2 for s in self.size]
        mask = (((x - cx) / (self.size[2] * 0.35))**2 +
                ((y - cy) / (self.size[1] * 0.28))**2 +
                ((z - cz) / (self.size[0] * 0.25))**2) < 1
        return mask.astype(np.float32)
    
    def generate_lesion(self, center, size, shape='round'):
        """Generate a lesion within the liver."""
        z, y, x = np.ogrid[:self.size[0], :self.size[1], :self.size[2]]
        radius = size / 2
        if shape == 'round':
            mask = ((x - center[0])**2 + (y - center[1])**2 +
                    (z - center[2])**2) < radius**2
        else:
            noise = np.random.randn(*self.size) * 0.3
            mask = ((x - center[0])**2 + (y - center[1])**2 +
                    (z - center[2])**2) < (radius * (1 + noise))**2
        return mask.astype(np.float32)
    
    def apply_enhancement(self, mask, phase, pattern='HCC'):
        """Apply phase-specific enhancement patterns."""
        enhancement = {
            'nc': 0,
            'arterial': 80 if pattern == 'HCC' else 20,
            'portal': 10 if pattern == 'HCC' else 40,
            'delayed': -5 if pattern == 'HCC' else 20
        }
        return mask * enhancement.get(phase, 0)
    
    def add_noise(self, volume, noise_level=20):
        """Add Gaussian noise simulating CT noise."""
        noise = np.random.normal(0, noise_level, volume.shape)
        return volume + noise
    
    def generate_multiphase(self, n_lesions=3):
        """Generate complete multiphase CT dataset."""
        liver = self.generate_liver_mask()
        base_volume = liver * self.hounsfield_liver
        
        nc = self.add_noise(base_volume.copy())
        
        volumes = {'nc': nc}
        lesion_masks = np.zeros(self.size, dtype=np.int32)
        
        for i in range(n_lesions):
            center = tuple(np.random.randint(s // 4, 3 * s // 4) 
                          for s in self.size)
            size = np.random.randint(5, 30)
            lesion = self.generate_lesion(center, size)
            lesion_masks[lesion > 0] = i + 1
            
            for phase in ['arterial', 'portal', 'delayed']:
                enhancement = self.apply_enhancement(
                    lesion, phase, 'HCC'
                )
                if phase not in volumes:
                    volumes[phase] = base_volume.copy()
                volumes[phase] += enhancement
        
        for phase in volumes:
            volumes[phase] = self.add_noise(volumes[phase])
        
        return volumes, lesion_masks

# Usage example
generator = SyntheticCTGenerator(volume_size=(128, 128, 32))
volumes, masks = generator.generate_multiphase(n_lesions=5)
print(f"Generated shapes: {volumes['nc'].shape}")
print(f"Lesion mask values: {np.unique(masks)}")`;

    if (typeof Components !== 'undefined') {
      Components.createCodeBlock(codeBlock, code);
    } else {
      codeBlock.innerHTML = `<pre><code>${code.replace(/</g, '&lt;')}</code></pre>`;
    }
  },

  _initQuiz() {
    const quizContainer = document.getElementById('module5-quiz');
    if (!quizContainer) return;

    const questions = [
      {
        q: 'What is the PRIMARY advantage of using synthetic data for medical image analysis?',
        options: ['It is always more realistic than real data', 'It eliminates privacy concerns and provides unlimited labeled examples', 'It does not require any validation', 'It replaces the need for clinical trials'],
        correct: 1,
        explanation: 'Synthetic data eliminates HIPAA/GDPR privacy concerns and can generate unlimited labeled examples with perfect ground truth, addressing both data scarcity and privacy challenges.'
      },
      {
        q: 'Which noise model is most commonly used to simulate CT imaging noise?',
        options: ['Poisson noise', 'Salt and pepper noise', 'Gaussian noise', 'Rayleigh noise'],
        correct: 2,
        explanation: 'Gaussian noise is the most commonly used model for CT noise because it approximates the combined effects of electronic noise and photon statistics in CT detectors.'
      },
      {
        q: 'What is "domain gap" in the context of synthetic data?',
        options: ['The difference between synthetic and real data distributions', 'The gap between training and test sets', 'The difference in resolution between images', 'The time gap between data collection and analysis'],
        correct: 0,
        explanation: 'Domain gap refers to the distribution difference between synthetic and real clinical data. Models trained only on synthetic data may underperform on real data due to this gap.'
      },
      {
        q: 'What is the recommended strategy for combining synthetic and real data?',
        options: ['Use only synthetic data', 'Use only real data', 'Pre-train on synthetic, fine-tune on real', 'Mix synthetic and real data equally'],
        correct: 2,
        explanation: 'The optimal approach is to pre-train on synthetic data (leveraging its volume and perfect labels) then fine-tune on real clinical data (to bridge the domain gap).'
      }
    ];

    if (typeof Components !== 'undefined') {
      Components.createQuiz(quizContainer, questions);
    } else {
      questions.forEach((q, i) => {
        const qDiv = document.createElement('div');
        qDiv.className = 'quiz-question';
        qDiv.innerHTML = `<p><strong>Q${i + 1}:</strong> ${q.q}</p>
          ${q.options.map((opt, j) => `<label><input type="radio" name="q5_${i}" value="${j}"> ${opt}</label>`).join('<br>')}
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

  _initEventListeners() {
    const sliders = [
      { id: 'liver-condition', valId: 'liver-cond-val', format: v => v == 0 ? 'Normal' : v < 50 ? 'Mild Cirrhosis' : 'Severe Cirrhosis' },
      { id: 'noise-level', valId: 'noise-val' },
      { id: 'slice-thickness', valId: 'slice-val', suffix: 'mm' },
      { id: 'num-lesions', valId: 'num-lesions-val' },
      { id: 'min-size', valId: 'min-size-val', suffix: 'mm' },
      { id: 'max-size', valId: 'max-size-val', suffix: 'mm' },
      { id: 'matrix-size', valId: 'matrix-val' },
      { id: 'volume-depth', valId: 'depth-val', suffix: 'slices' },
    ];

    sliders.forEach(s => {
      const el = document.getElementById(s.id);
      if (!el) return;
      el.addEventListener('input', (e) => {
        const valEl = document.getElementById(s.valId);
        if (valEl) {
          if (s.format) valEl.textContent = s.format(parseInt(e.target.value));
          else valEl.textContent = e.target.value;
        }
      });
    });

    const downloadBtn = document.getElementById('download-btn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        if (!this._generatedData) return;
        const dataStr = JSON.stringify(this._generatedData);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'synthetic_dataset.json';
        a.click();
        URL.revokeObjectURL(url);
      });
    }
  },

  destroy() {
    if (this._animFrame) cancelAnimationFrame(this._animFrame);
  }
});
