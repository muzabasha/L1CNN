ModuleEngine.register('13', {
  init(container) {
    var header = Components.createModuleHeader('13', 'Classification');
    container.appendChild(header);
    container.innerHTML += `
      <style>
        .m13-root{font-family:'Segoe UI',system-ui,sans-serif;color:#e2e8f0;background:#0a0f1a;padding:0}
        .m13-hero{text-align:center;padding:40px 20px 20px;background:linear-gradient(135deg,#0f172a 0%,#1e293b 50%,#0f172a 100%);border-bottom:1px solid rgba(100,200,255,0.1)}
        .m13-hero h1{font-size:2em;background:linear-gradient(90deg,#f59e0b,#ef4444);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin:0 0 8px}
        .m13-hero p{color:#94a3b8;font-size:1em;margin:0}
        .m13-tabs{display:flex;justify-content:center;gap:4px;padding:16px 20px;background:#0d1321;flex-wrap:wrap}
        .m13-tab{padding:10px 20px;border:1px solid #334155;background:transparent;color:#94a3b8;border-radius:8px;cursor:pointer;font-size:.9em;transition:.2s}
        .m13-tab:hover{border-color:#f59e0b;color:#f59e0b}
        .m13-tab.active{background:rgba(245,158,11,0.15);border-color:#f59e0b;color:#f59e0b}
        .m13-panel{display:none;padding:20px}
        .m13-panel.active{display:block}
        .m13-card{background:#111827;border:1px solid #1e293b;border-radius:12px;padding:20px;margin-bottom:16px}
        .m13-card h3{margin:0 0 12px;color:#f59e0b;font-size:1.1em}
        .m13-pipeline-wrap{overflow-x:auto;padding:20px 0}
        .m13-pipeline{display:flex;align-items:center;gap:0;min-width:900px;justify-content:center}
        .m13-pipe-node{background:#1e293b;border:2px solid #334155;border-radius:12px;padding:16px 12px;text-align:center;min-width:120px;position:relative;transition:.4s}
        .m13-pipe-node.active{border-color:#f59e0b;box-shadow:0 0 20px rgba(245,158,11,0.3)}
        .m13-pipe-node.done{border-color:#22c55e;box-shadow:0 0 12px rgba(34,197,94,0.2)}
        .m13-pipe-node .label{font-size:.75em;color:#94a3b8;margin-top:6px}
        .m13-pipe-node canvas{border-radius:6px;background:#000}
        .m13-arrow{width:40px;display:flex;align-items:center;justify-content:center;color:#475569;font-size:1.4em;flex-shrink:0}
        .m13-arrow.active{color:#f59e0b;animation:m13pulse 1s infinite}
        @keyframes m13pulse{0%,100%{opacity:.5}50%{opacity:1}}
        .m13-prob-bar-wrap{margin:10px 0}
        .m13-prob-label{display:flex;justify-content:space-between;font-size:.85em;margin-bottom:4px}
        .m13-prob-track{height:28px;background:#1e293b;border-radius:14px;overflow:hidden;position:relative}
        .m13-prob-fill{height:100%;border-radius:14px;transition:width 1s ease;display:flex;align-items:center;justify-content:flex-end;padding-right:10px;font-size:.8em;font-weight:700;color:#fff;min-width:0}
        .m13-conf-meter{display:flex;align-items:center;gap:12px;padding:16px;background:#0f172a;border-radius:10px;margin-top:12px}
        .m13-conf-circle{width:80px;height:80px;border-radius:50%;border:5px solid #334155;display:flex;align-items:center;justify-content:center;font-size:1.1em;font-weight:700;transition:.8s}
        .m13-explain-box{background:#0f172a;border-left:3px solid #f59e0b;padding:12px 16px;border-radius:0 8px 8px 0;margin-top:12px;font-size:.9em;line-height:1.5;color:#cbd5e1}
        .m13-controls{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin-bottom:16px}
        .m13-ctrl-group{display:flex;flex-direction:column;gap:4px}
        .m13-ctrl-group label{font-size:.8em;color:#94a3b8}
        .m13-ctrl-group select,.m13-ctrl-group input[type=range]{width:100%;background:#1e293b;border:1px solid #334155;color:#e2e8f0;border-radius:6px;padding:6px;font-size:.85em}
        .m13-btn{padding:10px 24px;border:none;border-radius:8px;font-size:.9em;cursor:pointer;font-weight:600;transition:.2s}
        .m13-btn-primary{background:linear-gradient(135deg,#f59e0b,#f97316);color:#000}
        .m13-btn-primary:hover{transform:translateY(-1px);box-shadow:0 4px 15px rgba(245,158,11,0.3)}
        .m13-btn-secondary{background:#1e293b;color:#94a3b8;border:1px solid #334155}
        .m13-btn-secondary:hover{border-color:#f59e0b;color:#f59e0b}
        .m13-btn:disabled{opacity:.5;cursor:not-allowed}
        .m13-grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
        .m13-grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px}
        .m13-metrics-table{width:100%;border-collapse:collapse;font-size:.85em}
        .m13-metrics-table th{text-align:left;padding:8px 10px;background:#1e293b;color:#f59e0b;border-bottom:1px solid #334155}
        .m13-metrics-table td{padding:8px 10px;border-bottom:1px solid #1e293b;color:#cbd5e1}
        .m13-history-table{width:100%;border-collapse:collapse;font-size:.8em}
        .m13-history-table th{text-align:left;padding:6px 8px;background:#1e293b;color:#f59e0b;font-size:.85em}
        .m13-history-table td{padding:6px 8px;border-bottom:1px solid #1e293b;color:#94a3b8}
        .m13-chip{display:inline-block;padding:3px 10px;border-radius:12px;font-size:.8em;font-weight:600}
        .m13-obj-list{list-style:none;padding:0;margin:0}
        .m13-obj-list li{padding:8px 0;border-bottom:1px solid #1e293b;font-size:.9em;color:#cbd5e1;display:flex;align-items:flex-start;gap:8px}
        .m13-obj-list li::before{content:'▸';color:#f59e0b;flex-shrink:0}
        .m13-code-block{background:#0d1117;border:1px solid #21262d;border-radius:8px;padding:16px;font-family:'Fira Code',monospace;font-size:.8em;color:#c9d1d9;overflow-x:auto;white-space:pre;line-height:1.6;max-height:400px;overflow-y:auto}
        .m13-reflection{background:linear-gradient(135deg,#1e1b4b,#172554);border:1px solid #312e81;border-radius:12px;padding:20px;margin-top:16px}
        .m13-reflection h4{color:#818cf8;margin:0 0 10px}
        .m13-reflection ul{margin:0;padding-left:20px}
        .m13-reflection li{color:#cbd5e1;font-size:.9em;margin:6px 0}
        @media(max-width:768px){.m13-grid2,.m13-grid3{grid-template-columns:1fr}.m13-pipeline{flex-direction:wrap;min-width:auto}}
      </style>
      <div class="m13-root">
        <div class="m13-hero">
          <h1>Module 13: LI-RADS Classification Engine</h1>
          <p>Train, run, and interpret a multi-class classifier for hepatocellular carcinoma</p>
        </div>
        <div class="m13-tabs" role="tablist" aria-label="Module sections">
          <button class="m13-tab active" data-tab="objectives" role="tab" aria-selected="true" aria-controls="panel-objectives" id="tab-objectives">Objectives</button>
          <button class="m13-tab" data-tab="animation" role="tab" aria-selected="false" aria-controls="panel-animation" id="tab-animation">Pipeline</button>
          <button class="m13-tab" data-tab="theory" role="tab" aria-selected="false" aria-controls="panel-theory" id="tab-theory">Theory</button>
          <button class="m13-tab" data-tab="simulation" role="tab" aria-selected="false" aria-controls="panel-simulation" id="tab-simulation">Simulation</button>
          <button class="m13-tab" data-tab="code" role="tab" aria-selected="false" aria-controls="panel-code" id="tab-code">Code</button>
          <button class="m13-tab" data-tab="quiz" role="tab" aria-selected="false" aria-controls="panel-quiz" id="tab-quiz">Quiz</button>
          <button class="m13-tab" data-tab="reflection" role="tab" aria-selected="false" aria-controls="panel-reflection" id="tab-reflection">Reflection</button>
        </div>

        <div class="m13-panel active" data-panel="objectives" role="tabpanel" id="panel-objectives" aria-labelledby="tab-objectives">
          <div class="m13-card">
            <h3>Learning Objectives</h3>
            <ul class="m13-obj-list">
              <li>Understand the complete LI-RADS classification pipeline from input volumes to final prediction</li>
              <li>Run the trained model on synthetic test cases and observe outputs in real time</li>
              <li>Interpret softmax probability outputs and confidence scores for clinical relevance</li>
              <li>Analyze per-class performance including sensitivity for each LI-RADS category (LR-3, LR-4, LR-5)</li>
              <li>Understand how AI predictions serve as clinical decision support tools</li>
              <li>Evaluate classification history and track model consistency across multiple runs</li>
            </ul>
          </div>
        </div>

        <div class="m13-panel" data-panel="animation" role="tabpanel" id="panel-animation" aria-labelledby="tab-animation" hidden>
          <div class="m13-card">
            <h3>Classification Pipeline Visualization</h3>
            <div style="text-align:center;margin-bottom:12px">
              <button class="m13-btn m13-btn-primary" id="m13-run-pipe">▶ Run Classification</button>
              <button class="m13-btn m13-btn-secondary" id="m13-reset-pipe" style="margin-left:8px">↺ Reset</button>
            </div>
            <div class="m13-pipeline-wrap">
              <div class="m13-pipeline" id="m13-pipeline">
                <div class="m13-pipe-node" id="m13-pn-input">
                  <canvas id="m13-cv-in1" width="80" height="60"></canvas>
                  <canvas id="m13-cv-in2" width="80" height="60" style="margin-top:4px"></canvas>
                  <canvas id="m13-cv-in3" width="80" height="60" style="margin-top:4px"></canvas>
                  <div class="label">Input CT Phases</div>
                </div>
                <div class="m13-arrow" id="m13-arr1">→</div>
                <div class="m13-pipe-node" id="m13-pn-cnn">
                  <canvas id="m13-cv-cnn" width="100" height="80"></canvas>
                  <div class="label">CNN Branch</div>
                </div>
                <div class="m13-arrow" id="m13-arr2">→</div>
                <div class="m13-pipe-node" id="m13-pn-rad">
                  <canvas id="m13-cv-rad" width="100" height="80"></canvas>
                  <div class="label">Radiomics</div>
                </div>
                <div class="m13-arrow" id="m13-arr3">→</div>
                <div class="m13-pipe-node" id="m13-pn-fuse">
                  <canvas id="m13-cv-fuse" width="100" height="80"></canvas>
                  <div class="label">Fusion</div>
                </div>
                <div class="m13-arrow" id="m13-arr4">→</div>
                <div class="m13-pipe-node" id="m13-pn-class">
                  <canvas id="m13-cv-out" width="120" height="80"></canvas>
                  <div class="label">Classification Head</div>
                </div>
                <div class="m13-arrow" id="m13-arr5">→</div>
                <div class="m13-pipe-node" id="m13-pn-result">
                  <canvas id="m13-cv-bars" width="140" height="100"></canvas>
                  <div class="label">Output Probabilities</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="m13-panel" data-panel="theory" role="tabpanel" id="panel-theory" aria-labelledby="tab-theory" hidden>
          <div class="m13-card">
            <h3>Theoretical Foundation</h3>
            <div class="m13-grid2">
              <div>
                <h4 style="color:#f59e0b;margin:0 0 8px;font-size:.95em">Multi-Class Classification</h4>
                <p style="font-size:.88em;color:#cbd5e1;line-height:1.6">
                  LI-RADS classification requires distinguishing between benign nodules (LR-3), probably HCC (LR-4), 
                  and definite HCC (LR-5). The softmax function converts raw logits into a probability distribution:
                  <code style="background:#1e293b;padding:2px 6px;border-radius:4px">p(i) = exp(z_i) / Σ exp(z_j)</code>.
                  The predicted class is the one with maximum probability.
                </p>
                <h4 style="color:#f59e0b;margin:16px 0 8px;font-size:.95em">Class Imbalance</h4>
                <p style="font-size:.88em;color:#cbd5e1;line-height:1.6">
                  Real-world LI-RADS datasets are heavily skewed. LR-5 lesions are more common in clinical series 
                  while LR-3 is relatively rare. Weighted cross-entropy loss addresses this:
                  <code style="background:#1e293b;padding:2px 6px;border-radius:4px">L = -Σ w_c · y_c · log(p_c)</code> 
                  where w_c is inversely proportional to class frequency.
                </p>
              </div>
              <div>
                <h4 style="color:#f59e0b;margin:0 0 8px;font-size:.95em">Clinical Decision Thresholds</h4>
                <p style="font-size:.88em;color:#cbd5e1;line-height:1.6">
                  Raw probabilities are rarely used directly. Clinicians apply decision thresholds: 
                  if P(LR-5) &gt; 0.7, recommend treatment; if P(LR-4) &gt; 0.5, recommend biopsy; 
                  otherwise, follow-up. These thresholds balance sensitivity against false positives.
                </p>
                <h4 style="color:#f59e0b;margin:16px 0 8px;font-size:.95em">Probability Calibration</h4>
                <p style="font-size:.88em;color:#cbd5e1;line-height:1.6">
                  Neural networks often produce overconfident predictions. Platt scaling or isotonic regression 
                  calibrates predicted probabilities so that when the model says 80% confidence, 
                  approximately 80% of such predictions are correct. This is critical for clinical trust.
                </p>
                <h4 style="color:#f59e0b;margin:16px 0 8px;font-size:.95em">AI as Decision Support</h4>
                <p style="font-size:.88em;color:#cbd5e1;line-height:1.6">
                  The AI system does not replace the radiologist. It serves as a second reader, 
                  flagging potential lesions and providing probability estimates. The final diagnosis 
                  remains with the physician who integrates imaging, clinical history, and laboratory data.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="m13-panel" data-panel="simulation" role="tabpanel" id="panel-simulation" aria-labelledby="tab-simulation" hidden>
          <div class="m13-card">
            <h3>Interactive Classification Engine</h3>
            <div class="m13-grid2">
              <div>
                <div class="m13-controls">
                  <div class="m13-ctrl-group">
                    <label for="m13-testcase">Test Case</label>
                    <select id="m13-testcase">
                      <option value="0">Case 1 – LR-3 (Intermediate)</option>
                      <option value="1">Case 2 – LR-4 (Probably HCC)</option>
                      <option value="2" selected>Case 3 – LR-5 (Definite HCC)</option>
                      <option value="3">Case 4 – Mixed Features</option>
                      <option value="custom">Custom Features</option>
                    </select>
                  </div>
                  <div class="m13-ctrl-group">
                    <label for="m13-feat1">Artificial Enhancement: <span id="m13-feat1-v">75</span>%</label>
                    <input type="range" id="m13-feat1" min="0" max="100" value="75">
                  </div>
                  <div class="m13-ctrl-group">
                    <label for="m13-feat2">Texture Heterogeneity: <span id="m13-feat2-v">60</span>%</label>
                    <input type="range" id="m13-feat2" min="0" max="100" value="60">
                  </div>
                  <div class="m13-ctrl-group">
                    <label for="m13-feat3">Washout Rate: <span id="m13-feat3-v">80</span>%</label>
                    <input type="range" id="m13-feat3" min="0" max="100" value="80">
                  </div>
                  <div class="m13-ctrl-group">
                    <label for="m13-feat4">Lesion Size: <span id="m13-feat4-v">45</span>mm</label>
                    <input type="range" id="m13-feat4" min="10" max="120" value="45">
                  </div>
                  <div class="m13-ctrl-group">
                    <label for="m13-feat5">Margin Irregularity: <span id="m13-feat5-v">70</span>%</label>
                    <input type="range" id="m13-feat5" min="0" max="100" value="70">
                  </div>
                </div>
                <div style="display:flex;gap:8px;margin-top:8px">
                  <button class="m13-btn m13-btn-primary" id="m13-run-class">▶ Run Classification</button>
                  <button class="m13-btn m13-btn-secondary" id="m13-clear-history">Clear History</button>
                </div>
              </div>
              <div>
                <div id="m13-result-panel">
                  <div style="color:#475569;text-align:center;padding:30px;font-size:.9em">Configure features and run classification</div>
                </div>
              </div>
            </div>
          </div>
          <div class="m13-card">
            <h3>Classification History</h3>
            <div style="overflow-x:auto">
              <table class="m13-history-table" id="m13-history">
                <thead><tr><th>#</th><th>Case</th><th>Prediction</th><th>Confidence</th><th>LR-3</th><th>LR-4</th><th>LR-5</th><th>Time</th></tr></thead>
                <tbody id="m13-history-body"></tbody>
              </table>
            </div>
          </div>
          <div class="m13-card">
            <h3>Per-Class Performance Metrics</h3>
            <table class="m13-metrics-table">
              <thead><tr><th>Class</th><th>Precision</th><th>Recall</th><th>F1-Score</th><th>Support</th></tr></thead>
              <tbody>
                <tr><td><span class="m13-chip" style="background:rgba(245,158,11,0.2);color:#f59e0b">LR-3</span></td><td>0.82</td><td>0.76</td><td>0.79</td><td>45</td></tr>
                <tr><td><span class="m13-chip" style="background:rgba(249,115,22,0.2);color:#f97316">LR-4</span></td><td>0.78</td><td>0.84</td><td>0.81</td><td>62</td></tr>
                <tr><td><span class="m13-chip" style="background:rgba(239,68,68,0.2);color:#ef4444">LR-5</span></td><td>0.91</td><td>0.88</td><td>0.89</td><td>93</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="m13-panel" data-panel="code" role="tabpanel" id="panel-code" aria-labelledby="tab-code" hidden>
          <div class="m13-card">
            <h3>Python Implementation</h3>
            <div class="m13-code-block" id="m13-code"></div>
          </div>
        </div>

        <div class="m13-panel" data-panel="quiz" role="tabpanel" id="panel-quiz" aria-labelledby="tab-quiz" hidden>
          <div class="m13-card">
            <h3>Knowledge Check</h3>
            <div id="m13-quiz"></div>
          </div>
        </div>

        <div class="m13-panel" data-panel="reflection" role="tabpanel" id="panel-reflection" aria-labelledby="tab-reflection" hidden>
          <div class="m13-reflection">
            <h4>Clinical Deployment Considerations</h4>
            <ul>
              <li>Regulatory pathways: FDA 510(k), De Novo, and CE marking for AI/ML-based medical devices require extensive validation across diverse patient populations</li>
              <li>Continuous monitoring: Model performance must be tracked post-deployment for data drift and changing patient demographics</li>
              <li>Integration with PACS/RIS: Seamless workflow integration is essential for clinical adoption</li>
              <li>Radiologist-AI collaboration: The optimal paradigm is computer-aided detection where AI augments rather than replaces expert judgment</li>
              <li>Transparency and explainability: Clinicians need to understand why a model makes specific predictions to trust and act on them</li>
            </ul>
          </div>
          <div class="m13-reflection" style="margin-top:12px">
            <h4>Discussion Questions</h4>
            <ul>
              <li>How would you handle a case where the AI prediction contradicts the radiologist's assessment?</li>
              <li>What minimum sensitivity would you require for an AI screening tool for LR-5 lesions?</li>
              <li>Should the model output probabilities or hard classifications for clinical use?</li>
            </ul>
          </div>
        </div>
      </div>
    ` + '<div style="padding:1rem 1.5rem 2rem;display:flex;justify-content:center;"><button data-navigate="home" class="px-6 py-3 rounded-xl border border-white/20 text-sm text-gray-300 hover:text-white hover:border-primary-400/50 transition-all cursor-pointer" style="background:rgba(255,255,255,0.04);min-height:44px;">&#x2190; Back to Home</button></div>';

    this._history = [];
    this._historyCount = 0;
    this._pipeRunning = false;
    this._initTabs(container);
    this._initSliders(container);
    this._initPipeline(container);
    this._initSimulation(container);
    this._initQuiz(container);
    this._renderCode(container);
    this._drawInputPhases();

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

  destroy(container) {
    if (this._pipeTimer) clearInterval(this._pipeTimer);
  },

  _initTabs(container) {
    container.querySelectorAll('.m13-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        container.querySelectorAll('.m13-tab').forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        container.querySelectorAll('.m13-panel').forEach(p => {
          p.classList.remove('active');
          p.setAttribute('hidden', '');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        const panel = container.querySelector(`.m13-panel[data-panel="${tab.dataset.tab}"]`);
        if (panel) { panel.classList.add('active'); panel.removeAttribute('hidden'); }
      });
    });
  },

  _initSliders() {
    let _m13Timer = null;
    const triggerClassification = () => {
      if (_m13Timer) clearTimeout(_m13Timer);
      _m13Timer = setTimeout(() => this._runClassification(), 200);
    };
    ['m13-feat1','m13-feat2','m13-feat3','m13-feat4','m13-feat5'].forEach(id => {
      const slider = document.getElementById(id);
      const vSpan = document.getElementById(id + '-v');
      if (slider && vSpan) {
        slider.addEventListener('input', () => {
          vSpan.textContent = slider.value;
          document.getElementById('m13-testcase').value = 'custom';
          triggerClassification();
        });
      }
    });
    document.getElementById('m13-testcase').addEventListener('change', (e) => {
      const presets = [
        { f1:35, f2:30, f3:25, f4:22, f5:20 },
        { f1:60, f2:55, f3:55, f4:38, f5:55 },
        { f1:90, f2:85, f3:92, f4:55, f5:88 },
        { f1:50, f2:45, f3:60, f4:30, f5:40 }
      ];
      const idx = parseInt(e.target.value);
      if (!isNaN(idx) && presets[idx]) {
        const p = presets[idx];
        ['m13-feat1','m13-feat2','m13-feat3','m13-feat4','m13-feat5'].forEach((sid, i) => {
          const key = 'f' + (i + 1);
          document.getElementById(sid).value = p[key];
          document.getElementById(sid + '-v').textContent = p[key];
        });
        triggerClassification();
      }
    });
  },

  _drawInputPhases() {
    const phases = [
      { id: 'm13-cv-in1', color: '#ef4444', label: 'Arterial' },
      { id: 'm13-cv-in2', color: '#f59e0b', label: 'Portal' },
      { id: 'm13-cv-in3', color: '#3b82f6', label: 'Delayed' }
    ];
    phases.forEach(p => {
      const cv = document.getElementById(p.id);
      if (!cv) return;
      const ctx = cv.getContext('2d');
      ctx.fillStyle = '#0a0f1a';
      ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.beginPath();
      ctx.arc(cv.width / 2, cv.height / 2, 22, 0, Math.PI * 2);
      ctx.fillStyle = '#334155';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cv.width / 2 + 5, cv.height / 2 - 3, 10, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.7;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(p.label, cv.width / 2, cv.height - 4);
    });
  },

  _initPipeline(container) {
    const runBtn = document.getElementById('m13-run-pipe');
    const resetBtn = document.getElementById('m13-reset-pipe');
    if (!runBtn) return;

    runBtn.addEventListener('click', () => {
      if (this._pipeRunning) return;
      this._pipeRunning = true;
      runBtn.disabled = true;
      const nodes = ['m13-pn-input','m13-pn-cnn','m13-pn-rad','m13-pn-fuse','m13-pn-class','m13-pn-result'];
      const arrows = ['m13-arr1','m13-arr2','m13-arr3','m13-arr4','m13-arr5'];
      let step = 0;
      const self = this;

      function advance() {
        nodes.forEach(n => { document.getElementById(n).classList.remove('active','done'); });
        arrows.forEach(a => { document.getElementById(a).classList.remove('active'); });
        if (step > 0) document.getElementById(nodes[step - 1]).classList.add('done');
        if (step < nodes.length) {
          document.getElementById(nodes[step]).classList.add('active');
          if (step > 0 && step <= arrows.length) document.getElementById(arrows[step - 1]).classList.add('active');
          self._drawPipelineStep(step);
          step++;
          self._pipeTimer = setTimeout(advance, 700);
        } else {
          self._pipeRunning = false;
          runBtn.disabled = false;
          document.getElementById(nodes[nodes.length - 1]).classList.add('done');
          self._drawFinalProbs();
        }
      }
      advance();
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (this._pipeTimer) clearTimeout(this._pipeTimer);
        this._pipeRunning = false;
        runBtn.disabled = false;
        ['m13-pn-input','m13-pn-cnn','m13-pn-rad','m13-pn-fuse','m13-pn-class','m13-pn-result'].forEach(n => {
          const el = document.getElementById(n);
          if (el) el.classList.remove('active','done');
        });
        ['m13-arr1','m13-arr2','m13-arr3','m13-arr4','m13-arr5'].forEach(a => {
          const el = document.getElementById(a);
          if (el) el.classList.remove('active');
        });
        ['m13-cv-cnn','m13-cv-rad','m13-cv-fuse','m13-cv-out','m13-cv-bars'].forEach(id => {
          const cv = document.getElementById(id);
          if (cv) { const ctx = cv.getContext('2d'); ctx.clearRect(0, 0, cv.width, cv.height); }
        });
      });
    }
  },

  _drawPipelineStep(step) {
    if (step === 1) {
      const cv = document.getElementById('m13-cv-cnn');
      const ctx = cv.getContext('2d');
      ctx.clearRect(0, 0, cv.width, cv.height);
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 3; j++) {
          ctx.fillStyle = `hsl(${200 + i * 15 + j * 20}, 70%, ${40 + Math.random() * 30}%)`;
          ctx.fillRect(i * 25 + 2, j * 25 + 2, 22, 22);
        }
      }
    } else if (step === 2) {
      const cv = document.getElementById('m13-cv-rad');
      const ctx = cv.getContext('2d');
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      const vals = [20, 45, 30, 65, 50, 75, 40, 60];
      vals.forEach((v, i) => {
        const x = (i / (vals.length - 1)) * cv.width;
        const y = cv.height - (v / 100) * cv.height * 0.8 - 5;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.fillStyle = '#94a3b8';
      ctx.font = '8px sans-serif';
      ctx.fillText('105 radiomic features', 10, cv.height - 3);
    } else if (step === 3) {
      const cv = document.getElementById('m13-cv-fuse');
      const ctx = cv.getContext('2d');
      ctx.clearRect(0, 0, cv.width, cv.height);
      const grd = ctx.createLinearGradient(0, 0, cv.width, cv.height);
      grd.addColorStop(0, '#3b82f6');
      grd.addColorStop(0.5, '#a855f7');
      grd.addColorStop(1, '#f59e0b');
      ctx.fillStyle = grd;
      ctx.fillRect(5, 5, cv.width - 10, cv.height - 10);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('256-D', cv.width / 2, cv.height / 2 - 4);
      ctx.fillText('Fused', cv.width / 2, cv.height / 2 + 10);
      ctx.textAlign = 'start';
    } else if (step === 4) {
      const cv = document.getElementById('m13-cv-out');
      const ctx = cv.getContext('2d');
      ctx.clearRect(0, 0, cv.width, cv.height);
      const colors = ['#f59e0b', '#f97316', '#ef4444'];
      const labels = ['LR-3', 'LR-4', 'LR-5'];
      colors.forEach((c, i) => {
        ctx.fillStyle = c;
        ctx.beginPath();
        ctx.arc(20 + i * 40, cv.height / 2, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 8px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(labels[i], 20 + i * 40, cv.height / 2 + 3);
      });
      ctx.textAlign = 'start';
    }
  },

  _drawFinalProbs() {
    const cv = document.getElementById('m13-cv-bars');
    const ctx = cv.getContext('2d');
    ctx.clearRect(0, 0, cv.width, cv.height);
    const feats = this._getFeatures();
    const probs = this._computeProbs(feats);
    const colors = ['#f59e0b', '#f97316', '#ef4444'];
    const labels = ['LR-3', 'LR-4', 'LR-5'];
    probs.forEach((p, i) => {
      const y = 10 + i * 30;
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, y, cv.width, 20);
      ctx.fillStyle = colors[i];
      ctx.fillRect(0, y, cv.width * p, 20);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText(`${labels[i]} ${(p * 100).toFixed(0)}%`, 4, y + 14);
    });
  },

  _getFeatures() {
    return {
      enhancement: parseInt(document.getElementById('m13-feat1').value),
      texture: parseInt(document.getElementById('m13-feat2').value),
      washout: parseInt(document.getElementById('m13-feat3').value),
      size: parseInt(document.getElementById('m13-feat4').value),
      margin: parseInt(document.getElementById('m13-feat5').value)
    };
  },

  _computeProbs(f) {
    const lr5Score = (f.enhancement * 0.3 + f.washout * 0.3 + f.texture * 0.2 + f.margin * 0.15 + Math.min(f.size / 120, 1) * 100 * 0.05) / 100;
    const lr4Score = (1 - Math.abs(lr5Score - 0.5) * 2) * 0.8;
    const lr3Score = 1 - lr5Score - lr4Score * 0.5;
    let raw = [Math.max(lr3Score, 0.02), Math.max(lr4Score, 0.02), Math.max(lr5Score, 0.02)];
    const sum = raw.reduce((a, b) => a + b, 0);
    return raw.map(r => r / sum);
  },

  _initSimulation(container) {
    const runBtn = document.getElementById('m13-run-class');
    const clearBtn = document.getElementById('m13-clear-history');
    if (runBtn) {
      runBtn.addEventListener('click', () => this._runClassification());
    }
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this._history = [];
        this._historyCount = 0;
        document.getElementById('m13-history-body').innerHTML = '';
      });
    }
  },

  _runClassification() {
    const feats = this._getFeatures();
    const probs = this._computeProbs(feats);
    const predIdx = probs.indexOf(Math.max(...probs));
    const classes = ['LR-3', 'LR-4', 'LR-5'];
    const colors = ['#f59e0b', '#f97316', '#ef4444'];
    const explanations = [
      'Intermediate probability of HCC. Lesion demonstrates some but not all major features. Recommend follow-up imaging in 3-6 months to assess stability or interval change.',
      'Probably HCC. Lesion demonstrates arterial phase hyperenhancement with washout but may lack all major features. Recommend LI-RADS 4 management: consider biopsy for definitive diagnosis or discuss at multidisciplinary tumor board.',
      'Definite HCC characteristics meeting all major LI-RADS 5 criteria. Recommend LI-RADS 5 management: treat with resection, ablation, or list for liver transplantation per Milan criteria.'
    ];
    const confidence = probs[predIdx];
    const panel = document.getElementById('m13-result-panel');
    const now = new Date();
    const timeStr = now.toLocaleTimeString();

    this._historyCount++;
    this._history.push({
      num: this._historyCount,
      pred: classes[predIdx],
      confidence: confidence,
      probs: [...probs],
      time: timeStr
    });

    const rows = this._history.map(h => {
      const chipColor = h.pred === 'LR-3' ? 'rgba(245,158,11,0.2)' : h.pred === 'LR-4' ? 'rgba(249,115,22,0.2)' : 'rgba(239,68,68,0.2)';
      const chipText = h.pred === 'LR-3' ? '#f59e0b' : h.pred === 'LR-4' ? '#f97316' : '#ef4444';
      return `<tr><td>${h.num}</td><td>Custom</td><td><span class="m13-chip" style="background:${chipColor};color:${chipText}">${h.pred}</span></td><td>${(h.confidence * 100).toFixed(1)}%</td><td>${(h.probs[0] * 100).toFixed(1)}%</td><td>${(h.probs[1] * 100).toFixed(1)}%</td><td>${(h.probs[2] * 100).toFixed(1)}%</td><td>${h.time}</td></tr>`;
    }).join('');
    document.getElementById('m13-history-body').innerHTML = rows;

    const confColor = confidence > 0.7 ? '#22c55e' : confidence > 0.4 ? '#f59e0b' : '#ef4444';
    panel.innerHTML = `
      <div style="margin-bottom:12px;color:#94a3b8;font-size:.8em">Results for Case #${this._historyCount}</div>
      ${probs.map((p, i) => `
        <div class="m13-prob-bar-wrap">
          <div class="m13-prob-label"><span style="color:${colors[i]}">${classes[i]}</span><span>${(p * 100).toFixed(1)}%</span></div>
          <div class="m13-prob-track"><div class="m13-prob-fill" style="width:${p * 100}%;background:${colors[i]}">${(p * 100).toFixed(0)}%</div></div>
        </div>
      `).join('')}
      <div class="m13-conf-meter">
        <div class="m13-conf-circle" style="border-color:${confColor};color:${confColor}">${(confidence * 100).toFixed(0)}%</div>
        <div>
          <div style="font-weight:700;color:${confColor};font-size:1.1em">Predicted: ${classes[predIdx]}</div>
          <div style="color:#94a3b8;font-size:.85em;margin-top:2px">Confidence: ${confidence > 0.7 ? 'High' : confidence > 0.4 ? 'Moderate' : 'Low'}</div>
        </div>
      </div>
      <div class="m13-explain-box">
        <strong style="color:#f59e0b">Clinical Explanation:</strong><br>
        ${explanations[predIdx]}
      </div>
      <div style="margin-top:12px;padding:12px;background:#0f172a;border-radius:8px">
        <div style="font-size:.8em;color:#94a3b8;margin-bottom:8px">Input Feature Summary</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;font-size:.82em">
          <span style="color:#94a3b8">Enhancement</span><span style="color:#e2e8f0">${feats.enhancement}%</span>
          <span style="color:#94a3b8">Texture</span><span style="color:#e2e8f0">${feats.texture}%</span>
          <span style="color:#94a3b8">Washout</span><span style="color:#e2e8f0">${feats.washout}%</span>
          <span style="color:#94a3b8">Size</span><span style="color:#e2e8f0">${feats.size}mm</span>
          <span style="color:#94a3b8">Margin</span><span style="color:#e2e8f0">${feats.margin}%</span>
        </div>
      </div>
    `;
  },

  _initQuiz(container) {
    const questions = [
      {
        q: 'In a multi-class LI-RADS classifier, what activation function is applied to the final layer to produce class probabilities?',
        options: ['Sigmoid', 'Softmax', 'ReLU', 'Tanh'],
        correct: 1,
        explanation: 'Softmax converts raw logits into a probability distribution that sums to 1 across all classes, making it ideal for multi-class classification.'
      },
      {
        q: 'Why might a weighted cross-entropy loss function be necessary for LI-RADS classification?',
        options: [
          'To increase training speed',
          'To handle class imbalance where some LI-RADS categories are underrepresented',
          'To reduce model size',
          'To avoid overfitting'
        ],
        correct: 1,
        explanation: 'LI-RADS datasets often have uneven class distributions. Weighted loss assigns higher penalties to misclassified minority classes, preventing the model from ignoring them.'
      },
      {
        q: 'If the model outputs P(LR-3)=0.15, P(LR-4)=0.35, P(LR-5)=0.50, what is the clinical interpretation?',
        options: [
          'Definitive diagnosis of LR-5',
          'Strongest evidence points to LR-5 but confidence is moderate; clinical correlation recommended',
          'Model is uncertain; no action needed',
          'The prediction is invalid because no class exceeds 0.9'
        ],
        correct: 1,
        explanation: 'The model predicts LR-5 with 50% confidence, which is the highest probability but still moderate. This suggests probable HCC but warrants clinical correlation and possibly biopsy.'
      },
      {
        q: 'What is probability calibration and why is it important for clinical deployment?',
        options: [
          'A technique to make models smaller',
          'Adjusting predicted probabilities so they reflect true likelihoods, critical for clinical decision-making',
          'A method for data augmentation',
          'A regularization technique for training'
        ],
        correct: 1,
        explanation: 'Calibration ensures that when the model predicts 80% confidence, approximately 80% of such predictions are correct. This is essential for clinicians who make treatment decisions based on confidence levels.'
      }
    ];
    Components.createQuiz(container.querySelector('#m13-quiz'), questions);
  },

  _renderCode() {
    const code = `import torch
import torch.nn.functional as F
import numpy as np

class LIClassificationEngine:
    def __init__(self, model):
        self.model = model
        self.class_names = ['LR-3', 'LR-4', 'LR-5']
        self.class_colors = ['#f59e0b', '#f97316', '#ef4444']

    def predict(self, arterial, portal, delayed):
        self.model.eval()
        with torch.no_grad():
            logits, probs, attn = self.model(arterial, portal, delayed)
        return {
            'predictions': torch.argmax(probs, dim=1),
            'probabilities': probs,
            'attention_weights': attn,
            'class_names': self.class_names
        }

    def explain_prediction(self, probs):
        pred_class = torch.argmax(probs).item()
        confidence = probs[0, pred_class].item()
        explanations = {
            0: "Intermediate probability of HCC. "
               "Recommend follow-up imaging in 3-6 months.",
            1: "Probably HCC. Recommend LI-RADS 4 management: "
               "consider biopsy or treatment.",
            2: "Definite HCC characteristics. Recommend LI-RADS 5 "
               "management: treat or list for transplantation."
        }
        return {
            'class': self.class_names[pred_class],
            'confidence': confidence,
            'explanation': explanations[pred_class],
            'all_probs': {
                name: probs[0, i].item()
                for i, name in enumerate(self.class_names)
            }
        }

    def batch_evaluate(self, test_loader):
        all_preds, all_labels = [], []
        for batch in test_loader:
            result = self.predict(*batch['inputs'])
            all_preds.extend(result['predictions'].tolist())
            all_labels.extend(batch['labels'].tolist())
        from sklearn.metrics import classification_report
        report = classification_report(
            all_labels, all_preds,
            target_names=self.class_names,
            output_dict=True
        )
        return report

    def calibrate(self, val_loader, method='platt'):
        all_probs, all_labels = [], []
        for batch in val_loader:
            result = self.predict(*batch['inputs'])
            all_probs.append(result['probabilities'])
            all_labels.extend(batch['labels'].tolist())
        all_probs = torch.cat(all_probs)
        if method == 'platt':
            from sklearn.linear_model import LogisticRegression
            lr = LogisticRegression()
            lr.fit(all_probs.numpy(), all_labels)
            self.calibrator = lr
        return self

# Example usage
engine = LIClassificationEngine(model)
result = engine.explain_prediction(probs)
print(f"Prediction: {result['class']}"
      f" ({result['confidence']:.1%})")
print(f"Explanation: {result['explanation']}")`;
    const codeEl = document.getElementById('m13-code');
    if (codeEl) codeEl.textContent = code;
  }
});
