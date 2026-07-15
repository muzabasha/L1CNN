ModuleEngine.register('14', {
  init(container) {
    container.innerHTML = `
      <style>
        .m14-root{font-family:'Segoe UI',system-ui,sans-serif;color:#e2e8f0;background:#0a0f1a;padding:0}
        .m14-hero{text-align:center;padding:40px 20px 20px;background:linear-gradient(135deg,#0f172a 0%,#1e1b4b 50%,#0f172a 100%);border-bottom:1px solid rgba(129,140,248,0.1)}
        .m14-hero h1{font-size:2em;background:linear-gradient(90deg,#818cf8,#c084fc,#f472b6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin:0 0 8px}
        .m14-hero p{color:#94a3b8;font-size:1em;margin:0}
        .m14-tabs{display:flex;justify-content:center;gap:4px;padding:16px 20px;background:#0d1321;flex-wrap:wrap}
        .m14-tab{padding:10px 20px;border:1px solid #334155;background:transparent;color:#94a3b8;border-radius:8px;cursor:pointer;font-size:.9em;transition:.2s}
        .m14-tab:hover{border-color:#818cf8;color:#818cf8}
        .m14-tab.active{background:rgba(129,140,248,0.15);border-color:#818cf8;color:#818cf8}
        .m14-panel{display:none;padding:20px}
        .m14-panel.active{display:block}
        .m14-card{background:#111827;border:1px solid #1e293b;border-radius:12px;padding:20px;margin-bottom:16px}
        .m14-card h3{margin:0 0 12px;color:#818cf8;font-size:1.1em}
        .m14-obj-list{list-style:none;padding:0;margin:0}
        .m14-obj-list li{padding:8px 0;border-bottom:1px solid #1e293b;font-size:.9em;color:#cbd5e1;display:flex;align-items:flex-start;gap:8px}
        .m14-obj-list li::before{content:'◈';color:#818cf8;flex-shrink:0}
        .m14-canvas-row{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px}
        .m14-canvas-box{background:#0f172a;border:1px solid #1e293b;border-radius:10px;padding:10px;text-align:center}
        .m14-canvas-box canvas{border-radius:6px;background:#000;width:100%;max-width:180px}
        .m14-canvas-box .lbl{font-size:.78em;color:#94a3b8;margin-top:6px}
        .m14-controls{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-bottom:16px}
        .m14-ctrl{display:flex;flex-direction:column;gap:4px}
        .m14-ctrl label{font-size:.8em;color:#94a3b8}
        .m14-ctrl select,.m14-ctrl input[type=range]{width:100%;background:#1e293b;border:1px solid #334155;color:#e2e8f0;border-radius:6px;padding:6px;font-size:.85em}
        .m14-btn{padding:10px 24px;border:none;border-radius:8px;font-size:.9em;cursor:pointer;font-weight:600;transition:.2s}
        .m14-btn-primary{background:linear-gradient(135deg,#818cf8,#c084fc);color:#000}
        .m14-btn-primary:hover{transform:translateY(-1px);box-shadow:0 4px 15px rgba(129,140,248,0.3)}
        .m14-btn-secondary{background:#1e293b;color:#94a3b8;border:1px solid #334155}
        .m14-btn-secondary:hover{border-color:#818cf8;color:#818cf8}
        .m14-btn:disabled{opacity:.5;cursor:not-allowed}
        .m14-grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
        .m14-grad-step{display:flex;align-items:flex-start;gap:12px;padding:12px;background:#0f172a;border-radius:8px;margin-bottom:8px;border-left:3px solid #334155;transition:.3s}
        .m14-grad-step.active{border-left-color:#818cf8;background:rgba(129,140,248,0.05)}
        .m14-grad-num{width:28px;height:28px;border-radius:50%;background:#1e293b;border:2px solid #334155;display:flex;align-items:center;justify-content:center;font-size:.8em;font-weight:700;flex-shrink:0;transition:.3s}
        .m14-grad-step.active .m14-grad-num{background:#818cf8;border-color:#818cf8;color:#000}
        .m14-grad-text{font-size:.85em;color:#cbd5e1;line-height:1.5}
        .m14-grad-text strong{color:#818cf8}
        .m14-gradient-display{background:#0d1117;border:1px solid #21262d;border-radius:8px;padding:12px;margin-top:12px;font-family:'Fira Code',monospace;font-size:.8em;color:#c9d1d9;line-height:1.7}
        .m14-gradient-display .val{color:#818cf8}
        .m14-gradient-display .act{color:#22c55e}
        .m14-gradient-display .grad{color:#f59e0b}
        .m14-compare-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
        .m14-compare-item{background:#0f172a;border:1px solid #1e293b;border-radius:8px;padding:12px;text-align:center}
        .m14-compare-item canvas{border-radius:4px;background:#000}
        .m14-compare-item .lbl{font-size:.78em;color:#94a3b8;margin-top:6px}
        .m14-code-block{background:#0d1117;border:1px solid #21262d;border-radius:8px;padding:16px;font-family:'Fira Code',monospace;font-size:.8em;color:#c9d1d9;overflow-x:auto;white-space:pre;line-height:1.6;max-height:400px;overflow-y:auto}
        .m14-reflection{background:linear-gradient(135deg,#1e1b4b,#172554);border:1px solid #312e81;border-radius:12px;padding:20px;margin-top:16px}
        .m14-reflection h4{color:#818cf8;margin:0 0 10px}
        .m14-reflection ul{margin:0;padding-left:20px}
        .m14-reflection li{color:#cbd5e1;font-size:.9em;margin:6px 0}
        @media(max-width:900px){.m14-canvas-row{grid-template-columns:1fr 1fr}.m14-compare-grid{grid-template-columns:1fr}}
      </style>
      <div class="m14-root">
        <div class="m14-hero">
          <h1>Module 14: Explainable AI — Opening the Black Box</h1>
          <p>GradCAM, attention maps, and interpretability for medical imaging AI</p>
        </div>
        <div class="m14-tabs">
          <button class="m14-tab active" data-tab="objectives">Objectives</button>
          <button class="m14-tab" data-tab="animation">GradCAM</button>
          <button class="m14-tab" data-tab="theory">Theory</button>
          <button class="m14-tab" data-tab="simulation">Simulation</button>
          <button class="m14-tab" data-tab="code">Code</button>
          <button class="m14-tab" data-tab="quiz">Quiz</button>
          <button class="m14-tab" data-tab="reflection">Reflection</button>
        </div>

        <div class="m14-panel active" data-panel="objectives">
          <div class="m14-card">
            <h3>Learning Objectives</h3>
            <ul class="m14-obj-list">
              <li>Understand why explainability is crucial for clinical adoption of medical AI systems</li>
              <li>Learn GradCAM and attention-based explanation methods step by step</li>
              <li>Generate and interpret heatmaps that reveal which regions drive CNN predictions</li>
              <li>Distinguish between post-hoc methods (GradCAM, LIME, SHAP) and intrinsic explanations (attention, concept bottleneck)</li>
              <li>Evaluate explanation quality through faithfulness, plausibility, and stability metrics</li>
            </ul>
          </div>
        </div>

        <div class="m14-panel" data-panel="animation">
          <div class="m14-card">
            <h3>GradCAM Visualization Pipeline</h3>
            <div style="text-align:center;margin-bottom:16px">
              <button class="m14-btn m14-btn-primary" id="m14-run-grad">▶ Run GradCAM</button>
              <button class="m14-btn m14-btn-secondary" id="m14-reset-grad" style="margin-left:8px">↺ Reset</button>
            </div>
            <div class="m14-canvas-row">
              <div class="m14-canvas-box"><canvas id="m14-cv-orig" width="160" height="160"></canvas><div class="lbl">Original CT Slice</div></div>
              <div class="m14-canvas-box"><canvas id="m14-cv-feat" width="160" height="160"></canvas><div class="lbl">Feature Maps (Layer 5)</div></div>
              <div class="m14-canvas-box"><canvas id="m14-cv-cam" width="160" height="160"></canvas><div class="lbl">GradCAM Heatmap</div></div>
              <div class="m14-canvas-box"><canvas id="m14-cv-over" width="160" height="160"></canvas><div class="lbl">Overlay (α = <span id="m14-alpha-v">0.45</span>)</div></div>
            </div>
            <div class="m14-controls">
              <div class="m14-ctrl">
                <label>Target Layer: <span id="m14-layer-v">5</span></label>
                <input type="range" id="m14-layer" min="1" max="5" value="5" step="1">
              </div>
              <div class="m14-ctrl">
                <label>Target Class</label>
                <select id="m14-target-class">
                  <option value="0">LR-3 (Intermediate)</option>
                  <option value="1">LR-4 (Probably HCC)</option>
                  <option value="2" selected>LR-5 (Definite HCC)</option>
                </select>
              </div>
              <div class="m14-ctrl">
                <label>Overlay Opacity: <span id="m14-opacity-v">45</span>%</label>
                <input type="range" id="m14-opacity" min="0" max="100" value="45">
              </div>
              <div class="m14-ctrl">
                <label>Threshold: <span id="m14-thresh-v">30</span>%</label>
                <input type="range" id="m14-thresh" min="0" max="100" value="30">
              </div>
              <div class="m14-ctrl">
                <label>Color Scheme</label>
                <select id="m14-colorscheme">
                  <option value="jet" selected>Jet</option>
                  <option value="viridis">Viridis</option>
                  <option value="hot">Hot</option>
                  <option value="magma">Magma</option>
                </select>
              </div>
            </div>
            <div class="m14-gradient-display" id="m14-grad-display">
              <div>// GradCAM computation values</div>
              <div>// Run GradCAM to see gradient statistics</div>
            </div>
          </div>
          <div class="m14-card">
            <h3>GradCAM Step-by-Step</h3>
            <div id="m14-steps">
              <div class="m14-grad-step" data-step="1">
                <div class="m14-grad-num">1</div>
                <div class="m14-grad-text"><strong>Forward Pass:</strong> Pass input through the CNN and record feature maps at the target convolutional layer. These activations capture spatial patterns learned by the network.</div>
              </div>
              <div class="m14-grad-step" data-step="2">
                <div class="m14-grad-num">2</div>
                <div class="m14-grad-text"><strong>Backward Pass:</strong> Compute gradients of the target class score with respect to the feature map activations. This tells us how much each activation unit contributes to the target class score.</div>
              </div>
              <div class="m14-grad-step" data-step="3">
                <div class="m14-grad-num">3</div>
                <div class="m14-grad-text"><strong>Weight Computation:</strong> Global average pooling of gradients yields per-channel importance weights α_k = (1/Z) Σ_i Σ_j (∂y^c / ∂A^k_ij).</div>
              </div>
              <div class="m14-grad-step" data-step="4">
                <div class="m14-grad-num">4</div>
                <div class="m14-grad-text"><strong>Weighted Sum:</strong> Combine feature maps using importance weights: L = ReLU(Σ_k α_k · A^k). ReLU ensures only positive contributions are highlighted.</div>
              </div>
              <div class="m14-grad-step" data-step="5">
                <div class="m14-grad-num">5</div>
                <div class="m14-grad-text"><strong>Overlay:</strong> Normalize the heatmap to [0,1], apply colormap, and overlay on the original image with adjustable opacity for visualization.</div>
              </div>
            </div>
          </div>
        </div>

        <div class="m14-panel" data-panel="theory">
          <div class="m14-card">
            <h3>Theoretical Foundation</h3>
            <div class="m14-grid2">
              <div>
                <h4 style="color:#818cf8;margin:0 0 8px;font-size:.95em">The Black Box Problem</h4>
                <p style="font-size:.88em;color:#cbd5e1;line-height:1.6">
                  Deep neural networks achieve high accuracy but operate as black boxes. In clinical settings, a radiologist needs to understand <em>why</em> the model flagged a lesion as LR-5. Without explanations, clinicians cannot verify correctness, detect biases, or build trust.
                </p>
                <h4 style="color:#818cf8;margin:16px 0 8px;font-size:.95em">Post-hoc vs. Intrinsic Explanations</h4>
                <p style="font-size:.88em;color:#cbd5e1;line-height:1.6">
                  <strong>Intrinsic:</strong> Models designed to be interpretable — attention mechanisms highlight relevant regions during forward pass; concept bottleneck models route predictions through human-understandable concepts.<br><br>
                  <strong>Post-hoc:</strong> Applied after training — GradCAM visualizes gradients, LIME approximates locally, SHAP computes Shapley values for feature attribution. These work with any trained model.
                </p>
                <h4 style="color:#818cf8;margin:16px 0 8px;font-size:.95em">Clinical Relevance</h4>
                <p style="font-size:.88em;color:#cbd5e1;line-height:1.6">
                  A GradCAM heatmap showing the model attending to the arterial enhancement rim of a lesion provides face validity — it aligns with how radiologists diagnose HCC. If the model focuses on unrelated regions (e.g., background liver), it suggests a spurious correlation.
                </p>
              </div>
              <div>
                <h4 style="color:#818cf8;margin:0 0 8px;font-size:.95em">GradCAM Mathematical Formulation</h4>
                <p style="font-size:.88em;color:#cbd5e1;line-height:1.6">
                  For a CNN with feature maps A^k at layer l, the class-discriminative localization map for class c is:
                </p>
                <div style="background:#0d1117;border:1px solid #21262d;border-radius:8px;padding:12px;margin:8px 0;font-family:monospace;font-size:.85em;color:#c9d1d9;line-height:1.8">
                  <div>α_k = (1/Z) Σ_i Σ_j (∂y<sup>c</sup> / ∂A<sup>k</sup><sub>ij</sub>)</div>
                  <div style="margin-top:4px">L<sub>GradCAM</sub> = ReLU(Σ_k α_k · A<sup>k</sup>)</div>
                </div>
                <p style="font-size:.88em;color:#cbd5e1;line-height:1.6;margin-top:8px">
                  α_k weights each feature map k by its average gradient importance. The weighted sum produces a coarse localization map. ReLU removes negative values (regions that decrease the target class score).
                </p>
                <h4 style="color:#818cf8;margin:16px 0 8px;font-size:.95em">Evaluation of Explanations</h4>
                <p style="font-size:.88em;color:#cbd5e1;line-height:1.6">
                  <strong>Faithfulness:</strong> Does masking high-importance regions actually reduce the model's predicted probability?<br>
                  <strong>Plausibility:</strong> Do explanations align with known clinical features?<br>
                  <strong>Stability:</strong> Do similar inputs produce similar explanations?<br>
                  <strong>Resolution:</strong> How fine-grained are the highlighted regions?
                </p>
                <h4 style="color:#818cf8;margin:16px 0 8px;font-size:.95em">Limitations</h4>
                <p style="font-size:.88em;color:#cbd5e1;line-height:1.6">
                  GradCAM provides coarse localization (low spatial resolution due to upsampling). It shows <em>where</em> but not <em>what features</em> the model uses. It can be misleading for very deep networks where gradients vanish. Multiple methods should be combined for robust explanations.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="m14-panel" data-panel="simulation">
          <div class="m14-card">
            <h3>Interactive GradCAM Lab — Compare Explanations</h3>
            <div class="m14-controls">
              <div class="m14-ctrl">
                <label>Opacity: <span id="m14-cmp-op-v">40</span>%</label>
                <input type="range" id="m14-cmp-op" min="0" max="100" value="40">
              </div>
              <div class="m14-ctrl">
                <label>Threshold: <span id="m14-cmp-th-v">25</span>%</label>
                <input type="range" id="m14-cmp-th" min="0" max="100" value="25">
              </div>
            </div>
            <div class="m14-compare-grid">
              <div class="m14-compare-item"><canvas id="m14-cmp-lr3" width="150" height="150"></canvas><div class="lbl">GradCAM for LR-3</div></div>
              <div class="m14-compare-item"><canvas id="m14-cmp-lr4" width="150" height="150"></canvas><div class="lbl">GradCAM for LR-4</div></div>
              <div class="m14-compare-item"><canvas id="m14-cmp-lr5" width="150" height="150"></canvas><div class="lbl">GradCAM for LR-5</div></div>
            </div>
            <div style="text-align:center;margin-top:16px">
              <button class="m14-btn m14-btn-primary" id="m14-run-compare">▶ Generate Comparison</button>
            </div>
            <div style="margin-top:16px;padding:16px;background:#0f172a;border-radius:10px">
              <div style="font-size:.85em;color:#94a3b8;margin-bottom:8px">Explanation Analysis</div>
              <div id="m14-compare-analysis" style="font-size:.88em;color:#cbd5e1;line-height:1.6">Generate comparison to see analysis</div>
            </div>
          </div>
        </div>

        <div class="m14-panel" data-panel="code">
          <div class="m14-card">
            <h3>Python Implementation</h3>
            <div class="m14-code-block" id="m14-code"></div>
          </div>
        </div>

        <div class="m14-panel" data-panel="quiz">
          <div class="m14-card">
            <h3>Knowledge Check</h3>
            <div id="m14-quiz"></div>
          </div>
        </div>

        <div class="m14-panel" data-panel="reflection">
          <div class="m14-reflection">
            <h4>Trust and Regulatory Requirements</h4>
            <ul>
              <li>FDA's evolving guidance on AI/ML-based Software as a Medical Device (SaMD) increasingly requires transparency and explainability documentation</li>
              <li>Clinicians are more likely to adopt AI tools when they can verify the reasoning — GradCAM provides visual confirmation that the model attends to clinically relevant regions</li>
              <li>Explanations can reveal failure modes: if a model consistently focuses on imaging artifacts or scanner-specific features rather than pathology, it indicates poor generalization</li>
              <li>The EU AI Act classifies medical AI as high-risk, mandating transparency obligations including providing "sufficiently transparent" outputs to users</li>
            </ul>
          </div>
          <div class="m14-reflection" style="margin-top:12px">
            <h4>Limitations of Current Methods</h4>
            <ul>
              <li>GradCAM highlights regions but not specific features — it cannot distinguish between texture, enhancement, or morphological cues</li>
              <li>Heatmaps can be manipulated through adversarial techniques, raising concerns about reliability as evidence</li>
              <li>Low spatial resolution of GradCAM may miss small but critical features in sub-centimeter lesions</li>
              <li>Explanation quality varies across model architectures — attention-based models may not always provide meaningful attention maps</li>
            </ul>
          </div>
        </div>
      </div>
    `;

    this._initTabs(container);
    this._initGradAnim(container);
    this._initComparison(container);
    this._initQuiz(container);
    this._renderCode();
    this._drawOriginalCT();
  },

  destroy(container) {
    if (this._gradTimer) clearTimeout(this._gradTimer);
  },

  _initTabs(container) {
    container.querySelectorAll('.m14-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        container.querySelectorAll('.m14-tab').forEach(t => t.classList.remove('active'));
        container.querySelectorAll('.m14-panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        container.querySelector(`.m14-panel[data-panel="${tab.dataset.tab}"]`).classList.add('active');
      });
    });
  },

  _drawOriginalCT() {
    const cv = document.getElementById('m14-cv-orig');
    if (!cv) return;
    const ctx = cv.getContext('2d');
    ctx.fillStyle = '#0a0f1a';
    ctx.fillRect(0, 0, 160, 160);
    const grd = ctx.createRadialGradient(80, 80, 10, 80, 80, 65);
    grd.addColorStop(0, '#4a5568');
    grd.addColorStop(0.6, '#2d3748');
    grd.addColorStop(1, '#0a0f1a');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(80, 80, 60, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(55, 70, 18, 0, Math.PI * 2);
    ctx.fillStyle = '#6b7280';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(95, 90, 14, 0, Math.PI * 2);
    ctx.fillStyle = '#9ca3af';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(70, 100, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#7c838a';
    ctx.fill();
  },

  _drawSyntheticSlice(targetClass) {
    const cv = document.getElementById('m14-cv-orig');
    const ctx = cv.getContext('2d');
    ctx.fillStyle = '#0a0f1a';
    ctx.fillRect(0, 0, 160, 160);
    const grd = ctx.createRadialGradient(80, 80, 10, 80, 80, 65);
    grd.addColorStop(0, '#4a5568');
    grd.addColorStop(0.6, '#2d3748');
    grd.addColorStop(1, '#0a0f1a');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(80, 80, 60, 0, Math.PI * 2);
    ctx.fill();
    const lesionX = 65 + targetClass * 5;
    const lesionY = 75 + targetClass * 3;
    const r = 12 + targetClass * 3;
    ctx.beginPath();
    ctx.arc(lesionX, lesionY, r, 0, Math.PI * 2);
    const intensity = ['rgba(120,120,120,0.7)', 'rgba(160,160,160,0.8)', 'rgba(200,200,200,0.9)'][targetClass];
    ctx.fillStyle = intensity;
    ctx.fill();
    if (targetClass >= 1) {
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(40 + targetClass * 8, 50, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#5a6270';
    ctx.fill();
    return { x: lesionX, y: lesionY, r: r };
  },

  _generateHeatmap(w, h, cx, cy, radius, scheme) {
    const data = new Float32Array(w * h);
    const threshold = parseInt(document.getElementById('m14-thresh').value || 30) / 100;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const dx = (x - cx) / (radius * 1.5);
        const dy = (y - cy) / (radius * 1.2);
        const dist = Math.sqrt(dx * dx + dy * dy);
        let val = Math.max(0, 1 - dist * dist) + (Math.random() * 0.08 - 0.04);
        if (dist > 1.5) val *= 0.2;
        data[y * w + x] = Math.max(0, Math.min(1, val));
      }
    }
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const idx = y * w + x;
        const smoothed = (data[idx - 1] + data[idx + 1] + data[(y - 1) * w + x] + data[(y + 1) * w + x] + data[idx]) / 5;
        data[idx] = smoothed;
      }
    }
    for (let i = 0; i < data.length; i++) {
      if (data[i] < threshold) data[i] = 0;
    }
    return data;
  },

  _colorize(value, scheme) {
    let r, g, b;
    if (scheme === 'jet') {
      if (value < 0.25) { r = 0; g = value * 4; b = 1; }
      else if (value < 0.5) { r = 0; g = 1; b = 1 - (value - 0.25) * 4; }
      else if (value < 0.75) { r = (value - 0.5) * 4; g = 1; b = 0; }
      else { r = 1; g = 1 - (value - 0.75) * 4; b = 0; }
    } else if (scheme === 'viridis') {
      r = 0.267 * (1 - value) + 0.993 * value;
      g = 0.004 * (1 - value) + 0.906 * value;
      b = 0.329 * (1 - value) + 0.136 * value;
    } else if (scheme === 'hot') {
      r = Math.min(1, value * 3);
      g = Math.min(1, Math.max(0, value * 3 - 1));
      b = Math.min(1, Math.max(0, value * 3 - 2));
    } else if (scheme === 'magma') {
      r = 0.001 * (1 - value) + 0.988 * value;
      g = 0.000 * (1 - value) + 0.656 * value;
      b = 0.014 * (1 - value) + 0.436 * value;
    } else {
      r = g = b = value;
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  },

  _drawHeatmapOnCanvas(canvasId, data, w, h, scheme) {
    const cv = document.getElementById(canvasId);
    if (!cv) return;
    const ctx = cv.getContext('2d');
    const imgData = ctx.createImageData(w, h);
    for (let i = 0; i < data.length; i++) {
      const [r, g, b] = this._colorize(data[i], scheme);
      imgData.data[i * 4] = r;
      imgData.data[i * 4 + 1] = g;
      imgData.data[i * 4 + 2] = b;
      imgData.data[i * 4 + 3] = data[i] > 0 ? 255 : 0;
    }
    ctx.putImageData(imgData, 0, 0);
  },

  _drawOverlay(origCanvasId, heatData, w, h, alpha, scheme) {
    const srcCv = document.getElementById(origCanvasId);
    const dstCv = document.getElementById('m14-cv-over');
    if (!srcCv || !dstCv) return;
    const srcCtx = srcCv.getContext('2d');
    const dstCtx = dstCv.getContext('2d');
    const srcData = srcCtx.getImageData(0, 0, w, h);
    const dstData = dstCtx.createImageData(w, h);
    for (let i = 0; i < heatData.length; i++) {
      const hv = heatData[i];
      const [hr, hg, hb] = this._colorize(hv, scheme);
      dstData.data[i * 4] = Math.round(srcData.data[i * 4] * (1 - alpha * hv) + hr * alpha * hv);
      dstData.data[i * 4 + 1] = Math.round(srcData.data[i * 4 + 1] * (1 - alpha * hv) + hg * alpha * hv);
      dstData.data[i * 4 + 2] = Math.round(srcData.data[i * 4 + 2] * (1 - alpha * hv) + hb * alpha * hv);
      dstData.data[i * 4 + 3] = 255;
    }
    dstCtx.putImageData(dstData, 0, 0);
  },

  _drawFeatureMaps() {
    const cv = document.getElementById('m14-cv-feat');
    if (!cv) return;
    const ctx = cv.getContext('2d');
    ctx.clearRect(0, 0, 160, 160);
    const layer = parseInt(document.getElementById('m14-layer').value);
    const gridSize = layer;
    const cellW = 160 / gridSize;
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const hue = (i * gridSize + j) * (360 / (gridSize * gridSize));
        ctx.fillStyle = `hsl(${hue}, 60%, ${30 + Math.random() * 25}%)`;
        ctx.fillRect(j * cellW + 1, i * cellW + 1, cellW - 2, cellW - 2);
      }
    }
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 140, 160, 20);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${gridSize}×${gridSize} maps, L${layer}`, 80, 153);
    ctx.textAlign = 'start';
  },

  _initGradAnim() {
    const runBtn = document.getElementById('m14-run-grad');
    const resetBtn = document.getElementById('m14-reset-grad');
    const opacitySlider = document.getElementById('m14-opacity');
    const layerSlider = document.getElementById('m14-layer');

    if (opacitySlider) {
      opacitySlider.addEventListener('input', () => {
        document.getElementById('m14-opacity-v').textContent = opacitySlider.value;
        document.getElementById('m14-alpha-v').textContent = (opacitySlider.value / 100).toFixed(2);
        if (this._lastHeatData) {
          const alpha = opacitySlider.value / 100;
          const scheme = document.getElementById('m14-colorscheme').value;
          this._drawOverlay('m14-cv-orig', this._lastHeatData, 160, 160, alpha, scheme);
        }
      });
    }

    if (layerSlider) {
      layerSlider.addEventListener('input', () => {
        document.getElementById('m14-layer-v').textContent = layerSlider.value;
      });
    }

    if (runBtn) {
      runBtn.addEventListener('click', () => {
        if (this._gradRunning) return;
        this._gradRunning = true;
        runBtn.disabled = true;
        this._runGradCAMAnimation();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (this._gradTimer) clearTimeout(this._gradTimer);
        this._gradRunning = false;
        this._lastHeatData = null;
        if (runBtn) runBtn.disabled = false;
        ['m14-cv-feat', 'm14-cv-cam', 'm14-cv-over'].forEach(id => {
          const cv = document.getElementById(id);
          if (cv) { const ctx = cv.getContext('2d'); ctx.clearRect(0, 0, 160, 160); }
        });
        document.querySelectorAll('.m14-grad-step').forEach(s => s.classList.remove('active'));
        document.getElementById('m14-grad-display').innerHTML = '<div>// GradCAM computation values</div><div>// Run GradCAM to see gradient statistics</div>';
      });
    }
  },

  _runGradCAMAnimation() {
    const targetClass = parseInt(document.getElementById('m14-target-class').value);
    const layer = parseInt(document.getElementById('m14-layer').value);
    const opacity = parseInt(document.getElementById('m14-opacity').value) / 100;
    const scheme = document.getElementById('m14-colorscheme').value;
    const target = this._drawSyntheticSlice(targetClass);

    const steps = document.querySelectorAll('.m14-grad-step');
    const display = document.getElementById('m14-grad-display');
    let step = 0;
    const self = this;

    function advance() {
      steps.forEach(s => s.classList.remove('active'));
      if (step < steps.length) {
        steps[step].classList.add('active');
      }

      if (step === 0) {
        display.innerHTML = `<div><span class="val">y_c</span> = logits[${targetClass}] → softmax → p = ${(0.5 + targetClass * 0.2).toFixed(3)}</div><div>// Forward pass complete</div>`;
        self._drawFeatureMaps();
      } else if (step === 1) {
        display.innerHTML = `<div><span class="grad">∂y<sub>c</sub>/∂A<sup>k</sup></span> computed for ${layer * 16} feature maps</div><div>// Gradient magnitudes: min=0.000, max=${(0.1 + Math.random() * 0.4).toFixed(4)}</div>`;
      } else if (step === 2) {
        const weights = [];
        for (let i = 0; i < layer * 4; i++) weights.push((Math.random() * 0.3 - 0.05).toFixed(3));
        display.innerHTML = `<div><span class="val">α_k</span> = [${weights.slice(0, 8).join(', ')}${weights.length > 8 ? ', ...' : ''}]</div><div>// ${weights.length} channel weights computed</div>`;
      } else if (step === 3) {
        const camData = self._generateHeatmap(160, 160, target.x, target.y, target.r, scheme);
        self._lastHeatData = camData;
        self._drawHeatmapOnCanvas('m14-cv-cam', camData, 160, 160, scheme);
        const maxVal = Math.max(...camData);
        const meanVal = camData.reduce((a, b) => a + b, 0) / camData.length;
        display.innerHTML = `<div><span class="act">L<sub>GradCAM</sub></span> = ReLU(Σ α_k · A^k)</div><div>// Heatmap stats: max=${maxVal.toFixed(3)}, mean=${meanVal.toFixed(4)}, nonzero=${camData.filter(v => v > 0).length}/${camData.length}</div>`;
      } else if (step === 4) {
        self._drawOverlay('m14-cv-orig', self._lastHeatData, 160, 160, opacity, scheme);
        display.innerHTML = `<div><span class="act">Overlay</span> = (1 - α) × image + α × heatmap</div><div>// α = ${opacity.toFixed(2)}, scheme = ${scheme}</div><div>// Target class: LR-${3 + targetClass}</div>`;
        self._gradRunning = false;
        const runBtn = document.getElementById('m14-run-grad');
        if (runBtn) runBtn.disabled = false;
      }

      step++;
      if (step <= 5) {
        self._gradTimer = setTimeout(advance, 900);
      }
    }
    advance();
  },

  _initComparison(container) {
    const runBtn = document.getElementById('m14-run-compare');
    const opSlider = document.getElementById('m14-cmp-op');
    const thSlider = document.getElementById('m14-cmp-th');

    if (opSlider) {
      opSlider.addEventListener('input', () => {
        document.getElementById('m14-cmp-op-v').textContent = opSlider.value;
        if (this._cmpData) this._updateComparison();
      });
    }
    if (thSlider) {
      thSlider.addEventListener('input', () => {
        document.getElementById('m14-cmp-th-v').textContent = thSlider.value;
      });
    }

    if (runBtn) {
      runBtn.addEventListener('click', () => this._generateComparison());
    }
  },

  _generateComparison() {
    const op = parseInt(document.getElementById('m14-cmp-op').value) / 100;
    const targets = [
      { cvId: 'm14-cmp-lr3', cls: 0, cx: 55, cy: 70, r: 12, color: '#f59e0b' },
      { cvId: 'm14-cmp-lr4', cls: 1, cx: 65, cy: 75, r: 15, color: '#f97316' },
      { cvId: 'm14-cmp-lr5', cls: 2, cx: 70, cy: 78, r: 18, color: '#ef4444' }
    ];
    const scheme = document.getElementById('m14-colorscheme').value;
    this._cmpData = [];

    targets.forEach(t => {
      const cv = document.getElementById(t.cvId);
      const ctx = cv.getContext('2d');
      ctx.fillStyle = '#0a0f1a';
      ctx.fillRect(0, 0, 150, 150);
      const grd = ctx.createRadialGradient(75, 75, 5, 75, 75, 55);
      grd.addColorStop(0, '#4a5568');
      grd.addColorStop(1, '#1a1f2e');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(75, 75, 55, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(t.cx, t.cy, t.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(180,180,180,0.6)';
      ctx.fill();

      const heatData = this._generateHeatmap(150, 150, t.cx, t.cy, t.r * (0.8 + t.cls * 0.2), scheme);
      const imgData = ctx.getImageData(0, 0, 150, 150);
      for (let i = 0; i < heatData.length; i++) {
        const hv = heatData[i];
        const [hr, hg, hb] = this._colorize(hv, scheme);
        imgData.data[i * 4] = Math.round(imgData.data[i * 4] * (1 - op * hv) + hr * op * hv);
        imgData.data[i * 4 + 1] = Math.round(imgData.data[i * 4 + 1] * (1 - op * hv) + hg * op * hv);
        imgData.data[i * 4 + 2] = Math.round(imgData.data[i * 4 + 2] * (1 - op * hv) + hb * op * hv);
      }
      ctx.putImageData(imgData, 0, 0);
      this._cmpData.push({ heat: heatData, max: Math.max(...heatData) });
    });

    const analysis = document.getElementById('m14-compare-analysis');
    if (analysis) {
      analysis.innerHTML = `
        <strong style="color:#818cf8">Explanation Comparison:</strong><br>
        • LR-3 GradCAM shows weak, diffuse activation — the model finds mild features but is uncertain.<br>
        • LR-4 GradCAM shows moderate, more focused activation around the lesion — the model identifies probable HCC features.<br>
        • LR-5 GradCAM shows strong, concentrated activation centered on the lesion with high peak intensity (${(this._cmpData[2].max * 100).toFixed(0)}%) — the model is confident about definite HCC characteristics.<br><br>
        <em style="color:#94a3b8">This progression from diffuse to focused activation is clinically plausible and supports the model's classification decisions.</em>
      `;
    }
  },

  _updateComparison() {
    if (!this._cmpData) return;
    const op = parseInt(document.getElementById('m14-cmp-op').value) / 100;
    const scheme = document.getElementById('m14-colorscheme').value;
    const cvIds = ['m14-cmp-lr3', 'm14-cmp-lr4', 'm14-cmp-lr5'];
    cvIds.forEach((cvId, idx) => {
      const cv = document.getElementById(cvId);
      const ctx = cv.getContext('2d');
      ctx.fillStyle = '#0a0f1a';
      ctx.fillRect(0, 0, 150, 150);
      const grd = ctx.createRadialGradient(75, 75, 5, 75, 75, 55);
      grd.addColorStop(0, '#4a5568');
      grd.addColorStop(1, '#1a1f2e');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(75, 75, 55, 0, Math.PI * 2);
      ctx.fill();
      const heat = this._cmpData[idx].heat;
      const imgData = ctx.getImageData(0, 0, 150, 150);
      for (let i = 0; i < heat.length; i++) {
        const hv = heat[i];
        const [hr, hg, hb] = this._colorize(hv, scheme);
        imgData.data[i * 4] = Math.round(imgData.data[i * 4] * (1 - op * hv) + hr * op * hv);
        imgData.data[i * 4 + 1] = Math.round(imgData.data[i * 4 + 1] * (1 - op * hv) + hg * op * hv);
        imgData.data[i * 4 + 2] = Math.round(imgData.data[i * 4 + 2] * (1 - op * hv) + hb * op * hv);
      }
      ctx.putImageData(imgData, 0, 0);
    });
  },

  _initQuiz() {
    const questions = [
      {
        q: 'What does a GradCAM heatmap primarily show?',
        options: [
          'The exact classification probability',
          'Which spatial regions of the input most influence the target class prediction',
          'The pixel-level importance of each input feature',
          'The model\'s training loss over epochs'
        ],
        correct: 1,
        explanation: 'GradCAM produces a coarse localization map showing which regions of the input image most strongly influence the model\'s prediction for a specific class, using gradient-weighted activation maps.'
      },
      {
        q: 'In the GradCAM formula, what does the ReLU function ensure?',
        options: [
          'The output values are between 0 and 1',
          'Only positive contributions to the target class are highlighted, removing negative evidence',
          'The heatmap is the same size as the input image',
          'The gradients do not vanish during backpropagation'
        ],
        correct: 1,
        explanation: 'ReLU(Σ_k α_k · A^k) removes negative values, ensuring only feature map activations that positively contribute to the target class score are included in the heatmap.'
      },
      {
        q: 'Why is it important to evaluate explanation quality in medical AI?',
        options: [
          'It improves the model\'s accuracy on test data',
          'To ensure explanations are faithful to the model\'s actual reasoning and clinically plausible',
          'It is only required for regulatory submission',
          'Explanations are purely cosmetic and do not affect clinical utility'
        ],
        correct: 1,
        explanation: 'Faithful explanations accurately represent the model\'s decision process, while plausible explanations align with clinical knowledge. Both are essential for clinician trust and patient safety.'
      },
      {
        q: 'What is a key limitation of GradCAM compared to pixel-level methods like saliency maps?',
        options: [
          'GradCAM is slower to compute',
          'GradCAM produces coarser spatial resolution due to upsampling from deeper layers',
          'GradCAM cannot be applied to CNNs',
          'GradCAM requires ground truth labels during inference'
        ],
        correct: 1,
        explanation: 'GradCAM operates on feature maps from deep convolutional layers which have lower spatial resolution than the input, resulting in coarser heatmaps that may miss fine-grained details.'
      }
    ];
    Components.createQuiz(document.getElementById('m14-quiz'), questions);
  },

  _renderCode() {
    const code = `import torch
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.colors import LinearSegmentedColormap

class GradCAM:
    def __init__(self, model, target_layer):
        self.model = model
        self.target_layer = target_layer
        self.gradients = None
        self.activations = None
        target_layer.register_forward_hook(self._forward_hook)
        target_layer.register_backward_hook(self._backward_hook)

    def _forward_hook(self, module, input, output):
        self.activations = output.detach()

    def _backward_hook(self, module, grad_input, grad_output):
        self.gradients = grad_output[0].detach()

    def generate(self, input_tensor, target_class):
        self.model.eval()
        output = self.model(input_tensor)

        self.model.zero_grad()
        one_hot = torch.zeros_like(output)
        one_hot[0, target_class] = 1
        output.backward(gradient=one_hot)

        # Step 3: Compute importance weights via global avg pooling
        weights = torch.mean(
            self.gradients, dim=(2, 3, 4), keepdim=True
        )

        # Step 4: Weighted combination of feature maps
        cam = torch.sum(
            weights * self.activations, dim=1, keepdim=True
        )

        # Step 5: ReLU and normalize
        cam = torch.relu(cam)
        cam = cam - cam.min()
        cam = cam / (cam.max() + 1e-8)

        return cam.squeeze().numpy()

    def overlay(self, image, cam, colormap='jet', alpha=0.4):
        """Overlay heatmap on original image."""
        cmap = plt.get_cmap(colormap)
        cam_resized = np.array(
            Image.fromarray(cam).resize(image.shape[:2][::-1])
        )
        heatmap = cmap(cam_resized)[:, :, :3]
        overlay = (1 - alpha) * image + alpha * heatmap
        return np.clip(overlay, 0, 1)

    def faithfulness_test(self, input_tensor, target_class,
                          fractions=[0.1, 0.25, 0.5]):
        """Measure how predictions drop as top regions
        are masked."""
        base_probs = self.model(input_tensor).softmax(dim=1)
        base_prob = base_probs[0, target_class].item()
        cam = self.generate(input_tensor, target_class)
        results = []
        for frac in fractions:
            threshold = np.quantile(cam, 1 - frac)
            mask = cam >= threshold
            masked_input = input_tensor.clone()
            masked_input[0, :, mask] = 0
            masked_probs = self.model(masked_input).softmax(dim=1)
            drop = base_prob - masked_probs[0, target_class].item()
            results.append({'fraction': frac, 'drop': drop})
        return results

# Usage
target_layer = model.arterial_branch.blocks[-1]
gradcam = GradCAM(model, target_layer)
cam = gradcam.generate(arterial_input, target_class=2)
overlay = gradcam.overlay(ct_slice, cam, alpha=0.4)

# Evaluate explanation quality
faithfulness = gradcam.faithfulness_test(
    arterial_input, target_class=2
)
for r in faithfulness:
    print(f"Mask {r['fraction']:.0%}: prob drop = {r['drop']:.4f}")`;
    const el = document.getElementById('m14-code');
    if (el) el.textContent = code;
  }
});
