ModuleEngine.register('6', {
  init(container) {
    var header = Components.createModuleHeader('6', '3D nnU-Net');
    container.appendChild(header);
    container.innerHTML += `
      <div class="module-content" id="module6-content">
        <h2 class="module-title">Module 6: 3D nnU-Net</h2>
        <p class="module-subtitle">Advanced Neural Network Architecture for Volumetric Segmentation</p>

        <div class="objectives-panel">
          <h3>Learning Objectives</h3>
          <ol>
            <li>Understand U-Net architecture and its variants</li>
            <li>Learn about encoder-decoder design with skip connections</li>
            <li>Understand 3D convolutions for volumetric data</li>
            <li>Explore nnU-Net's adaptive design choices</li>
            <li>Understand attention mechanisms in medical segmentation</li>
          </ol>
        </div>

        <div class="animation-panel">
          <h3>Interactive U-Net Architecture</h3>
          <canvas id="unet-canvas" width="900" height="520"></canvas>
          <div id="layer-info" class="layer-info-panel" style="display:none;"></div>
          <div class="unet-controls">
            <div class="control-group">
              <label>Base Filters: <span id="base-filters-val">32</span></label>
              <input type="range" id="base-filters" min="16" max="64" value="32" step="8">
            </div>
            <div class="control-group">
              <label>Depth: <span id="m6-depth-val">4</span></label>
              <input type="range" id="unet-depth" min="2" max="5" value="4" step="1">
            </div>
            <div class="control-group">
              <label>Input Mode:</label>
              <select id="conv-mode">
                <option value="3d">3D Convolutions</option>
                <option value="2d">2D Convolutions</option>
              </select>
            </div>
            <button id="run-forward" class="btn btn-primary">Run Forward Pass</button>
            <div class="param-count">Total Parameters: <span id="total-params">0</span></div>
          </div>
        </div>

        <div class="theory-panel">
          <h3>Convolutional Neural Networks Basics</h3>
          <p>Convolutional Neural Networks (CNNs) are the foundation of modern deep learning for image analysis. They learn hierarchical features through convolutional layers that apply learnable filters to input data.</p>
          
          <div class="concept-grid">
            <div class="concept-card">
              <h4>Convolution Operation</h4>
              <canvas class="concept-canvas" width="200" height="120" data-concept="convolution"></canvas>
              <p>A kernel slides over the input, computing element-wise multiplications and sums. This produces feature maps that detect local patterns.</p>
              <code>output[i,j] = Σ kernel[m,n] × input[i+m, j+n]</code>
            </div>
            <div class="concept-card">
              <h4>Pooling</h4>
              <canvas class="concept-canvas" width="200" height="120" data-concept="pooling"></canvas>
              <p>Reduces spatial dimensions while retaining important features. Max pooling takes the maximum value in each window.</p>
              <code>output[i,j] = max(input[2i:2i+2, 2j:2j+2])</code>
            </div>
            <div class="concept-card">
              <h4>Skip Connections</h4>
              <canvas class="concept-canvas" width="200" height="120" data-concept="skip"></canvas>
              <p>Feature maps from encoder are concatenated with decoder features. Preserves spatial detail lost during downsampling.</p>
              <code>decoder_input = cat(encoder_feat, upsampled_decoder)</code>
            </div>
          </div>

          <h4>U-Net Architecture (Ronneberger et al., 2015)</h4>
          <p>The U-Net is an encoder-decoder architecture specifically designed for biomedical image segmentation. Its key innovations are:</p>
          <ul>
            <li><strong>Symmetric design:</strong> Encoder and decoder paths mirror each other</li>
            <li><strong>Skip connections:</strong> Bridge encoder and decoder at each resolution level</li>
            <li><strong>No fully connected layers:</strong> Entirely convolutional, handles variable input sizes</li>
            <li><strong>Efficient use of annotated data:</strong> Data augmentation compensates for small datasets</li>
          </ul>

          <h4>3D U-Net for Volumetric Data</h4>
          <p>3D U-Net extends the original 2D architecture to handle volumetric data directly:</p>
          <ul>
            <li><strong>3D convolutions:</strong> Process volumetric patches instead of slices</li>
            <li><strong>Temporal coherence:</strong> Maintains z-axis relationships</li>
            <li><strong>Computational cost:</strong> Higher memory and GPU requirements</li>
            <li><strong>Patch-based training:</strong> Process sub-volumes to manage memory</li>
          </ul>

          <h4>nnU-Net Framework</h4>
          <p>nnU-Net (neural network U-Net) is a self-configuring framework that automatically adapts to any medical segmentation task:</p>
          <div class="nnunet-features">
            <div class="nnunet-card">
              <h5>Automatic Architecture Design</h5>
              <p>Adapts encoder depth, filter counts, and skip connections based on dataset characteristics.</p>
            </div>
            <div class="nnunet-card">
              <h5>Automatic Preprocessing</h5>
              <p>Selects optimal resampling, normalization, and patch size based on GPU memory constraints.</p>
            </div>
            <div class="nnunet-card">
              <h5>Automatic Training</h5>
              <p>Optimizes learning rate, batch size, and loss function. Uses cross-validation for robust evaluation.</p>
            </div>
            <div class="nnunet-card">
              <h5>Post-processing</h5>
              <p>Applies connected component analysis and size filtering to refine segmentation outputs.</p>
            </div>
          </div>

          <h4>Loss Functions for Segmentation</h4>
          <table class="data-table">
            <thead>
              <tr><th>Loss Function</th><th>Formula</th><th>Pros</th><th>Cons</th></tr>
            </thead>
            <tbody>
              <tr><td>Cross-Entropy</td><td>-Σ y·log(p)</td><td>Simple, stable</td><td>Class imbalance sensitive</td></tr>
              <tr><td>Dice Loss</td><td>1 - (2·Σp·y + s)/(Σp + Σy + s)</td><td>Handles imbalance</td><td>Less stable gradients</td></tr>
              <tr><td>Combined</td><td>CE + Dice</td><td>Best of both</td><td>Hyperparameter tuning</td></tr>
              <tr><td>Focal Loss</td><td>-α(1-p)^γ·log(p)</td><td>Hard example mining</td><td>Extra hyperparameter</td></tr>
            </tbody>
          </table>

          <h4>Data Augmentation for Medical Images</h4>
          <ul>
            <li><strong>Elastic deformations:</strong> Simulate tissue deformation using random displacement fields</li>
            <li><strong>Random rotations:</strong> ±15° to account for patient positioning variability</li>
            <li><strong>Intensity augmentations:</strong> Gaussian noise, contrast/brightness jittering</li>
            <li><strong>Spatial augmentations:</strong> Random scaling, cropping, flipping</li>
            <li><strong>Mixup/CutMix:</strong> Combine patches from different patients</li>
          </ul>

          <h4>Patch-Based Training Strategy</h4>
          <p>Training on full 3D volumes is computationally infeasible. Patch-based training extracts sub-volumes:</p>
          <ul>
            <li><strong>Patch size:</strong> Typically 128³ or 64³ voxels, chosen to fit GPU memory</li>
            <li><strong>Sampling strategy:</strong> Weighted sampling to balance lesion vs. background</li>
            <li><strong>Overlap:</strong> Test-time augmentation with overlapping patches</li>
            <li><strong>Batch size:</strong> Usually 2-4 patches per batch for 3D data</li>
          </ul>
        </div>

        <div class="simulation-panel">
          <h3>Interactive Feature Map Visualizer</h3>
          <div class="featuremap-layout">
            <div class="input-patch">
              <h5>Input Patch</h5>
              <canvas id="input-patch-canvas" width="160" height="160"></canvas>
            </div>
            <div class="layer-flow" id="layer-flow"></div>
            <div class="output-patch">
              <h5>Output Segmentation</h5>
              <canvas id="output-patch-canvas" width="160" height="160"></canvas>
            </div>
          </div>
          <div class="convolution-demo">
            <h5>Convolution Operation Demo</h5>
            <canvas id="conv-demo-canvas" width="400" height="180"></canvas>
            <p class="hint">Click "Run Forward Pass" to see the data flow through the network</p>
          </div>
        </div>

        <div class="code-panel">
          <h3>3D U-Net Implementation</h3>
          <div id="module6-code-block"></div>
        </div>

        <div class="quiz-panel">
          <h3>Knowledge Check</h3>
          <div id="module6-quiz"></div>
        </div>

        <div class="reflection-panel">
          <h3>Reflection & Research Context</h3>
          <div class="reflection-content">
            <h4>Why nnU-Net is the Baseline</h4>
            <p>nnU-Net consistently achieves state-of-the-art results across 23 medical segmentation tasks without manual architecture tuning. It serves as an ideal baseline because:</p>
            <ul>
              <li>Reproducible and well-documented framework</li>
              <li>Adapts automatically to dataset characteristics</li>
              <li>Provides strong benchmark performance</li>
              <li>Established community and extensive comparisons</li>
            </ul>
            
            <h4>Strengths of 3D nnU-Net</h4>
            <ul>
              <li>Captures 3D spatial relationships in volumetric data</li>
              <li>Automatic architecture and training optimization</li>
              <li>Robust to varying input sizes and modalities</li>
              <li>Excellent generalization across medical imaging tasks</li>
            </ul>
            
            <h4>Limitations</h4>
            <ul>
              <li>High computational requirements (24GB+ GPU memory)</li>
              <li>Long training times (days to weeks)</li>
              <li>Limited interpretability of learned features</li>
              <li>May not optimally handle rare lesion types</li>
              <li>Post-processing is relatively simple</li>
            </ul>
            
            <h4>Future Directions</h4>
            <ul>
              <li>Transformer-based architectures (Vision Transformers, Swin UNETR)</li>
              <li>Self-supervised pre-training on unlabeled data</li>
              <li>Multi-modal fusion (CT + MRI + clinical data)</li>
              <li>Federated learning for multi-center collaboration</li>
              <li>Uncertainty quantification for clinical decision support</li>
            </ul>
          </div>
        </div>
      </div>
    ` + '<div style="padding:1rem 1.5rem 2rem;display:flex;justify-content:center;"><button data-navigate="home" class="px-6 py-3 rounded-xl border border-white/20 text-sm text-gray-300 hover:text-white hover:border-primary-400/50 transition-all cursor-pointer" style="background:rgba(255,255,255,0.04);min-height:44px;">&#x2190; Back to Home</button></div>';

    this._baseFilters = 32;
    this._depth = 4;
    this._convMode = '3d';
    this._animFrame = null;
    this._selectedLayer = null;
    this._forwardAnimActive = false;

    this._initUNetCanvas();
    this._initConceptCanvases();
    this._initFeatureMapViz();
    this._initCode();
    this._initQuiz();
    this._initEventListeners();
    this._calculateParams();
  },

  _initUNetCanvas() {
    const canvas = document.getElementById('unet-canvas');
    if (!canvas) return;
    this._unetCanvas = canvas;
    this._unetCtx = canvas.getContext('2d');

    this._layerInfo = this._buildLayerInfo();
    this._drawUNet();
  },

  _buildLayerInfo() {
    const base = this._baseFilters;
    const depth = this._depth;
    const layers = [];
    const filterCounts = [];
    for (let i = 0; i < depth; i++) filterCounts.push(base * Math.pow(2, i));

    const inputSize = 128;
    let currentSize = inputSize;

    for (let i = 0; i < depth; i++) {
      layers.push({
        side: 'encoder', level: i,
        filters: filterCounts[i],
        size: currentSize,
        label: `Enc ${i + 1}`,
        desc: `Double Conv3D: ${filterCounts[i]} filters, ${currentSize}³ voxels`,
        params: this._convParams(filterCounts[i === 0 ? 1 : filterCounts[i - 1]], filterCounts[i]) * 2
      });
      currentSize = Math.floor(currentSize / 2);
    }

    layers.push({
      side: 'bottleneck', level: depth,
      filters: filterCounts[depth - 1] * 2,
      size: currentSize,
      label: 'Bottleneck',
      desc: `Double Conv3D: ${filterCounts[depth - 1] * 2} filters, ${currentSize}³ voxels`,
      params: this._convParams(filterCounts[depth - 1], filterCounts[depth - 1] * 2) * 2
    });

    currentSize = inputSize;
    for (let i = depth - 1; i >= 0; i--) {
      currentSize = currentSize * 2;
      layers.push({
        side: 'decoder', level: i,
        filters: filterCounts[i],
        size: Math.min(currentSize, inputSize),
        label: `Dec ${depth - i}`,
        desc: `Upsample + Double Conv3D: ${filterCounts[i]} filters`,
        params: this._convParams(filterCounts[i + 1] + filterCounts[i], filterCounts[i]) * 2
      });
    }

    layers.push({
      side: 'output', level: -1,
      filters: 3,
      size: inputSize,
      label: 'Output',
      desc: `1×1×1 Conv: 3 classes (background, liver, lesion)`,
      params: this._convParams(filterCounts[0], 3)
    });

    return layers;
  },

  _convParams(inCh, outCh, kernelSize = 3) {
    return inCh * outCh * kernelSize * kernelSize * kernelSize + outCh;
  },

  _drawUNet() {
    const ctx = this._unetCtx;
    const canvas = this._unetCanvas;
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const depth = this._depth;
    const base = this._baseFilters;
    const filterCounts = [];
    for (let i = 0; i < depth; i++) filterCounts.push(base * Math.pow(2, i));

    const encoderX = 150;
    const decoderX = canvas.width - 150;
    const blockW = 100;
    const blockH = 44;
    const levelGap = 90;
    const startY = 60;

    const encoderPositions = [];
    const decoderPositions = [];

    for (let i = 0; i < depth; i++) {
      const x = encoderX;
      const y = startY + i * levelGap;
      encoderPositions.push({ x, y });

      const blockColor = `hsl(${200 + i * 25}, 70%, ${35 + i * 5}%)`;
      ctx.fillStyle = blockColor;
      ctx.beginPath();
      ctx.roundRect(x - blockW / 2, y - blockH / 2, blockW, blockH, 6);
      ctx.fill();

      ctx.strokeStyle = this._selectedLayer === `enc_${i}` ? '#fff' : '#444';
      ctx.lineWidth = this._selectedLayer === `enc_${i}` ? 3 : 1;
      ctx.stroke();

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Encoder ${i + 1}`, x, y - 4);
      ctx.font = '9px sans-serif';
      ctx.fillStyle = '#ccc';
      ctx.fillText(`${filterCounts[i]} filters`, x, y + 10);

      if (i > 0) {
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(x, y - levelGap + blockH / 2);
        ctx.lineTo(x, y - blockH / 2);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#888';
        ctx.font = '8px sans-serif';
        ctx.fillText('Pool 2×2×2', x + 60, y - levelGap / 2);
      }
    }

    const bottleneckY = startY + depth * levelGap;
    const bottleneckX = canvas.width / 2;
    ctx.fillStyle = 'hsl(30, 70%, 35%)';
    ctx.beginPath();
    ctx.roundRect(bottleneckX - blockW / 2, bottleneckY - blockH / 2, blockW, blockH, 6);
    ctx.fill();
    ctx.strokeStyle = this._selectedLayer === 'bottleneck' ? '#fff' : '#444';
    ctx.lineWidth = this._selectedLayer === 'bottleneck' ? 3 : 1;
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Bottleneck', bottleneckX, bottleneckY - 4);
    ctx.font = '9px sans-serif';
    ctx.fillStyle = '#ccc';
    ctx.fillText(`${filterCounts[depth - 1] * 2} filters`, bottleneckX, bottleneckY + 10);

    ctx.strokeStyle = '#555';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(encoderPositions[depth - 1].x, encoderPositions[depth - 1].y + blockH / 2);
    ctx.lineTo(bottleneckX, bottleneckY - blockH / 2);
    ctx.stroke();
    ctx.setLineDash([]);

    for (let i = 0; i < depth; i++) {
      const level = depth - 1 - i;
      const x = decoderX;
      const y = startY + level * levelGap;
      decoderPositions.unshift({ x, y });

      const blockColor = `hsl(${340 + i * 20}, 70%, ${35 + i * 5}%)`;
      ctx.fillStyle = blockColor;
      ctx.beginPath();
      ctx.roundRect(x - blockW / 2, y - blockH / 2, blockW, blockH, 6);
      ctx.fill();
      ctx.strokeStyle = this._selectedLayer === `dec_${level}` ? '#fff' : '#444';
      ctx.lineWidth = this._selectedLayer === `dec_${level}` ? 3 : 1;
      ctx.stroke();

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Decoder ${depth - level}`, x, y - 4);
      ctx.font = '9px sans-serif';
      ctx.fillStyle = '#ccc';
      ctx.fillText(`${filterCounts[level]} filters`, x, y + 10);
    }

    for (let i = 0; i < depth; i++) {
      const enc = encoderPositions[i];
      const dec = decoderPositions[i];
      const midY = (enc.y + dec.y) / 2;

      ctx.strokeStyle = '#f39c12';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 3]);
      ctx.beginPath();
      ctx.moveTo(enc.x + blockW / 2, enc.y);
      ctx.lineTo(dec.x - blockW / 2, dec.y);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#f39c12';
      ctx.beginPath();
      ctx.arc((enc.x + dec.x) / 2, (enc.y + dec.y) / 2, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000';
      ctx.font = 'bold 8px sans-serif';
      ctx.fillText('skip', (enc.x + dec.x) / 2, (enc.y + dec.y) / 2 + 3);
    }

    if (decoderPositions.length > 0) {
      const lastDec = decoderPositions[0];
      const outputY = lastDec.y;
      const outputX = canvas.width - 40;

      ctx.fillStyle = '#2ecc71';
      ctx.beginPath();
      ctx.roundRect(outputX - 25, outputY - 20, 50, 40, 6);
      ctx.fill();
      ctx.strokeStyle = this._selectedLayer === 'output' ? '#fff' : '#444';
      ctx.lineWidth = this._selectedLayer === 'output' ? 3 : 1;
      ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('3 cls', outputX, outputY + 3);
    }

    ctx.fillStyle = '#888';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Encoder (Contracting Path)', encoderX, canvas.height - 20);
    ctx.fillText('Decoder (Expanding Path)', decoderX, canvas.height - 20);

    this._encoderPositions = encoderPositions;
    this._decoderPositions = decoderPositions;
    this._bottleneckPos = { x: bottleneckX, y: bottleneckY };
  },

  _initConceptCanvases() {
    document.querySelectorAll('.concept-canvas').forEach(canvas => {
      const ctx = canvas.getContext('2d');
      const concept = canvas.dataset.concept;
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, 200, 120);

      if (concept === 'convolution') {
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            ctx.fillStyle = `hsl(200, 50%, ${30 + Math.random() * 30}%)`;
            ctx.fillRect(10 + j * 22, 10 + i * 22, 20, 20);
          }
        }
        ctx.strokeStyle = '#e74c3c';
        ctx.lineWidth = 2;
        ctx.strokeRect(32, 10, 44, 44);
        ctx.fillStyle = '#fff';
        ctx.font = '9px sans-serif';
        ctx.fillText('kernel', 110, 30);
        ctx.fillText('slides →', 110, 45);
        ctx.fillText('output', 110, 80);
      } else if (concept === 'pooling') {
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            const v = Math.floor(Math.random() * 9);
            ctx.fillStyle = v > 6 ? '#e74c3c' : `hsl(200, 50%, ${30 + v * 5}%)`;
            ctx.fillRect(10 + j * 22, 10 + i * 22, 20, 20);
            ctx.fillStyle = '#fff';
            ctx.font = '8px sans-serif';
            ctx.fillText(v, 16 + j * 22, 24 + i * 22);
          }
        }
        ctx.fillStyle = '#2ecc71';
        ctx.font = '9px sans-serif';
        ctx.fillText('max pool →', 110, 30);
        for (let i = 0; i < 2; i++) {
          for (let j = 0; j < 2; j++) {
            ctx.fillStyle = `hsl(200, 50%, 50%)`;
            ctx.fillRect(110 + j * 25, 40 + i * 25, 23, 23);
          }
        }
      } else if (concept === 'skip') {
        ctx.fillStyle = '#3498db';
        ctx.fillRect(10, 20, 40, 80);
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(150, 20, 40, 80);
        ctx.strokeStyle = '#f39c12';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.moveTo(50, 60);
        ctx.lineTo(150, 60);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#fff';
        ctx.font = '9px sans-serif';
        ctx.fillText('enc', 30, 100);
        ctx.fillText('dec', 170, 100);
        ctx.fillText('concat →', 85, 55);
      }
    });
  },

  _initFeatureMapViz() {
    const inputCanvas = document.getElementById('input-patch-canvas');
    if (inputCanvas) {
      const ctx = inputCanvas.getContext('2d');
      const size = 160;
      const imageData = ctx.createImageData(size, size);
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const cx = size / 2, cy = size / 2;
          const dx = (x - cx) / 40, dy = (y - cy) / 35;
          const inLiver = (dx * dx + dy * dy) < 1;
          let v = inLiver ? 100 + Math.random() * 20 : 15 + Math.random() * 10;
          if (inLiver && Math.sqrt((x - cx - 15) ** 2 + (y - cy + 10) ** 2) < 12) v = 130 + Math.random() * 15;
          const idx = (y * size + x) * 4;
          imageData.data[idx] = v;
          imageData.data[idx + 1] = v;
          imageData.data[idx + 2] = v;
          imageData.data[idx + 3] = 255;
        }
      }
      ctx.putImageData(imageData, 0, 0);
    }

    const outputCanvas = document.getElementById('output-patch-canvas');
    if (outputCanvas) {
      const ctx = outputCanvas.getContext('2d');
      const size = 160;
      const imageData = ctx.createImageData(size, size);
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const cx = size / 2, cy = size / 2;
          const dx = (x - cx) / 40, dy = (y - cy) / 35;
          const inLiver = (dx * dx + dy * dy) < 1;
          const isLesion = inLiver && Math.sqrt((x - cx - 15) ** 2 + (y - cy + 10) ** 2) < 12;
          const idx = (y * size + x) * 4;
          if (isLesion) {
            imageData.data[idx] = 255; imageData.data[idx + 1] = 80; imageData.data[idx + 2] = 80;
          } else if (inLiver) {
            imageData.data[idx] = 50; imageData.data[idx + 1] = 180; imageData.data[idx + 2] = 50;
          } else {
            imageData.data[idx] = 30; imageData.data[idx + 1] = 30; imageData.data[idx + 2] = 30;
          }
          imageData.data[idx + 3] = 255;
        }
      }
      ctx.putImageData(imageData, 0, 0);
    }
  },

  _calculateParams() {
    let totalParams = 0;
    const base = this._baseFilters;
    const depth = this._depth;
    const filterCounts = [];
    for (let i = 0; i < depth; i++) filterCounts.push(base * Math.pow(2, i));

    for (let i = 0; i < depth; i++) {
      const inCh = i === 0 ? 1 : filterCounts[i - 1];
      totalParams += this._convParams(inCh, filterCounts[i]) * 2;
    }

    const bnParams = filterCounts.reduce((sum, f) => sum + f * 4 * 2, 0);
    totalParams += bnParams;

    totalParams += this._convParams(filterCounts[depth - 1], filterCounts[depth - 1] * 2) * 2;

    for (let i = depth - 1; i >= 0; i--) {
      const upInCh = filterCounts[Math.min(i + 1, depth - 1)] * (i === depth - 1 ? 2 : 1);
      totalParams += this._convParams(upInCh + filterCounts[i], filterCounts[i]) * 2;
    }

    totalParams += this._convParams(filterCounts[0], 3);

    const paramsEl = document.getElementById('total-params');
    if (paramsEl) paramsEl.textContent = totalParams.toLocaleString();
  },

  _initCode() {
    const codeBlock = document.getElementById('module6-code-block');
    if (!codeBlock) return;

    const code = `# Module 6: Understanding 3D U-Net
import torch
import torch.nn as nn

class DoubleConv3D(nn.Module):
    """Two consecutive 3D convolutions with BN and ReLU."""
    def __init__(self, in_ch, out_ch):
        super().__init__()
        self.conv = nn.Sequential(
            nn.Conv3d(in_ch, out_ch, 3, padding=1),
            nn.BatchNorm3d(out_ch),
            nn.ReLU(inplace=True),
            nn.Conv3d(out_ch, out_ch, 3, padding=1),
            nn.BatchNorm3d(out_ch),
            nn.ReLU(inplace=True)
        )
    def forward(self, x):
        return self.conv(x)

class Simple3DUNet(nn.Module):
    def __init__(self, in_channels=1, out_channels=3, 
                 features=[32, 64, 128, 256]):
        super().__init__()
        self.encoder = nn.ModuleList()
        self.decoder = nn.ModuleList()
        self.pool = nn.MaxPool3d(2)
        
        # Encoder path
        for feature in features:
            self.encoder.append(DoubleConv3D(in_channels, feature))
            in_channels = feature
        
        # Bottleneck
        self.bottleneck = DoubleConv3D(features[-1], features[-1] * 2)
        
        # Decoder path
        for feature in reversed(features):
            self.decoder.append(
                nn.ConvTranspose3d(feature * 2, feature, 2, 2)
            )
            self.decoder.append(
                DoubleConv3D(feature * 2, feature)
            )
        
        # Output layer
        self.final_conv = nn.Conv3d(features[0], out_channels, 1)
    
    def forward(self, x):
        skip_connections = []
        
        # Encoder
        for enc in self.encoder:
            x = enc(x)
            skip_connections.append(x)
            x = self.pool(x)
        
        x = self.bottleneck(x)
        skip_connections = skip_connections[::-1]
        
        # Decoder with skip connections
        for i in range(0, len(self.decoder), 2):
            x = self.decoder[i](x)
            skip = skip_connections[i // 2]
            
            if x.shape != skip.shape:
                x = nn.functional.interpolate(
                    x, size=skip.shape[2:]
                )
            
            x = torch.cat([skip, x], dim=1)
            x = self.decoder[i + 1](x)
        
        return self.final_conv(x)

model = Simple3DUNet(in_channels=1, out_channels=3)
total_params = sum(p.numel() for p in model.parameters())
print(f"Model parameters: {total_params:,}")

# Test forward pass
dummy_input = torch.randn(1, 1, 64, 128, 128)
output = model(dummy_input)
print(f"Input shape:  {dummy_input.shape}")
print(f"Output shape: {output.shape}")`;

    if (typeof Components !== 'undefined') {
      Components.createCodeBlock(codeBlock, code);
    } else {
      codeBlock.innerHTML = `<pre><code>${code.replace(/</g, '&lt;')}</code></pre>`;
    }
  },

  _initQuiz() {
    const quizContainer = document.getElementById('module6-quiz');
    if (!quizContainer) return;

    const questions = [
      {
        q: 'What is the primary purpose of skip connections in U-Net architecture?',
        options: ['Reduce number of parameters', 'Preserve spatial detail from encoder for decoder', 'Speed up training', 'Prevent overfitting'],
        correct: 1,
        explanation: 'Skip connections concatenate encoder feature maps with decoder features, preserving fine spatial details that are lost during downsampling operations.'
      },
      {
        q: 'Why is nnU-Net preferred over manual architecture design for medical segmentation?',
        options: ['It has fewer parameters', 'It automatically configures architecture, preprocessing, and training', 'It only works for 2D data', 'It requires no GPU'],
        correct: 1,
        explanation: 'nnU-Net automatically adapts its architecture, preprocessing pipeline, and training strategy to any medical segmentation task, eliminating manual design choices.'
      },
      {
        q: 'What is the main advantage of 3D convolutions over 2D convolutions for volumetric medical data?',
        options: ['Faster computation', 'Captures spatial relationships across all three dimensions', 'Uses less memory', 'Simpler implementation'],
        correct: 1,
        explanation: '3D convolutions process volumetric data holistically, capturing spatial relationships in all three dimensions (x, y, z), which is crucial for maintaining anatomical context.'
      },
      {
        q: 'What is the purpose of patch-based training in 3D U-Net?',
        options: ['Improve model accuracy', 'Manage GPU memory by processing sub-volumes', 'Reduce training data requirements', 'Increase inference speed'],
        correct: 1,
        explanation: 'Training on full 3D volumes exceeds GPU memory. Patch-based training processes small sub-volumes (e.g., 128³ voxels) to fit within memory constraints while maintaining 3D context.'
      }
    ];

    if (typeof Components !== 'undefined') {
      Components.createQuiz(quizContainer, questions);
    } else {
      questions.forEach((q, i) => {
        const qDiv = document.createElement('div');
        qDiv.className = 'quiz-question';
        qDiv.innerHTML = `<p><strong>Q${i + 1}:</strong> ${q.q}</p>
          ${q.options.map((opt, j) => `<label><input type="radio" name="q6_${i}" value="${j}"> ${opt}</label>`).join('<br>')}
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
    const filtersSlider = document.getElementById('base-filters');
    if (filtersSlider) {
      filtersSlider.addEventListener('input', (e) => {
        this._baseFilters = parseInt(e.target.value);
        document.getElementById('base-filters-val').textContent = this._baseFilters;
        this._layerInfo = this._buildLayerInfo();
        this._calculateParams();
        this._drawUNet();
      });
    }

    const depthSlider = document.getElementById('unet-depth');
    if (depthSlider) {
      depthSlider.addEventListener('input', (e) => {
        this._depth = parseInt(e.target.value);
        document.getElementById('m6-depth-val').textContent = this._depth;
        this._layerInfo = this._buildLayerInfo();
        this._calculateParams();
        this._drawUNet();
      });
    }

    const modeSelect = document.getElementById('conv-mode');
    if (modeSelect) {
      modeSelect.addEventListener('change', (e) => {
        this._convMode = e.target.value;
        this._calculateParams();
      });
    }

    const runBtn = document.getElementById('run-forward');
    if (runBtn) {
      runBtn.addEventListener('click', () => {
        this._runForwardAnimation();
      });
    }

    if (this._unetCanvas) {
      this._unetCanvas.addEventListener('click', (e) => {
        const rect = this._unetCanvas.getBoundingClientRect();
        const mx = (e.clientX - rect.left) * (this._unetCanvas.width / rect.width);
        const my = (e.clientY - rect.top) * (this._unetCanvas.height / rect.height);

        this._selectedLayer = null;

        const blockW = 100, blockH = 44;

        if (this._encoderPositions) {
          this._encoderPositions.forEach((pos, i) => {
            if (Math.abs(mx - pos.x) < blockW / 2 && Math.abs(my - pos.y) < blockH / 2) {
              this._selectedLayer = `enc_${i}`;
              this._showLayerInfo(this._layerInfo[i]);
            }
          });
        }

        if (this._bottleneckPos) {
          const bp = this._bottleneckPos;
          if (Math.abs(mx - bp.x) < blockW / 2 && Math.abs(my - bp.y) < blockH / 2) {
            this._selectedLayer = 'bottleneck';
            this._showLayerInfo(this._layerInfo[this._depth]);
          }
        }

        if (this._decoderPositions) {
          this._decoderPositions.forEach((pos, i) => {
            if (Math.abs(mx - pos.x) < blockW / 2 && Math.abs(my - pos.y) < blockH / 2) {
              this._selectedLayer = `dec_${i}`;
              this._showLayerInfo(this._layerInfo[this._depth + 1 + i]);
            }
          });
        }

        this._drawUNet();
      });
    }
  },

  _showLayerInfo(layer) {
    const infoEl = document.getElementById('layer-info');
    if (!infoEl || !layer) return;

    infoEl.style.display = 'block';
    infoEl.innerHTML = `
      <h4>${layer.label}</h4>
      <p><strong>Description:</strong> ${layer.desc}</p>
      <p><strong>Output size:</strong> ${layer.size}³ voxels</p>
      <p><strong>Filters:</strong> ${layer.filters}</p>
      <p><strong>Approx. parameters:</strong> ${layer.params.toLocaleString()}</p>
      ${layer.side === 'encoder' ? '<p><strong>Operation:</strong> Double Conv3D → BatchNorm → ReLU (×2), then MaxPool3D</p>' : ''}
      ${layer.side === 'decoder' ? '<p><strong>Operation:</strong> ConvTranspose3D (upsample) → Concatenate skip → Double Conv3D</p>' : ''}
      ${layer.side === 'bottleneck' ? '<p><strong>Operation:</strong> Double Conv3D at lowest resolution</p>' : ''}
      ${layer.side === 'output' ? '<p><strong>Operation:</strong> 1×1×1 convolution for class prediction</p>' : ''}
    `;
  },

  _runForwardAnimation() {
    if (this._forwardAnimActive) return;
    this._forwardAnimActive = true;

    const ctx = this._unetCtx;
    if (!ctx) { this._forwardAnimActive = false; return; }

    const positions = [
      ...this._encoderPositions,
      this._bottleneckPos,
      ...this._decoderPositions
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step >= positions.length) {
        clearInterval(interval);
        this._forwardAnimActive = false;
        this._drawUNet();
        return;
      }

      this._drawUNet();

      const pos = positions[step];
      const pulse = 20 + Math.sin(step * 0.5) * 10;

      ctx.fillStyle = '#fff';
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 6, 0, Math.PI * 2);
      ctx.fill();

      step++;
    }, 200);
  },

  destroy() {
    if (this._animFrame) cancelAnimationFrame(this._animFrame);
  }
});
