ModuleEngine.register('15', {
  init(container) {
    this._intervals = [];
    container.innerHTML = '<div style="padding:1.5rem 1.5rem 0;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.5rem;"><h2 class="font-orbitron text-2xl font-bold gradient-text" style="margin:0;">Module 15: Performance Metrics</h2><button data-navigate="home" class="px-4 py-2 rounded-lg border border-white/20 text-sm text-gray-300 hover:text-white hover:border-primary-400/50 transition-all cursor-pointer" style="background:rgba(255,255,255,0.04);min-height:40px;" aria-label="Back to Home">&#x2190; Home</button></div>' + `
      <style>
        .m15-root{font-family:'Segoe UI',system-ui,sans-serif;color:#e2e8f0;background:#0a0f1a}
        .m15-hero{text-align:center;padding:40px 20px 20px;background:linear-gradient(135deg,#0f172a 0%,#042f2e 50%,#0f172a 100%);border-bottom:1px solid rgba(52,211,153,0.1)}
        .m15-hero h1{font-size:2em;background:linear-gradient(90deg,#34d399,#60a5fa,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin:0 0 8px}
        .m15-hero p{color:#94a3b8;font-size:1em;margin:0}
        .m15-tabs{display:flex;justify-content:center;gap:4px;padding:16px 20px;background:#0d1321;flex-wrap:wrap}
        .m15-tab{padding:10px 20px;border:1px solid #334155;background:transparent;color:#94a3b8;border-radius:8px;cursor:pointer;font-size:.9em;transition:.2s}
        .m15-tab:hover{border-color:#34d399;color:#34d399}
        .m15-tab.active{background:rgba(52,211,153,0.15);border-color:#34d399;color:#34d399}
        .m15-panel{display:none;padding:20px}.m15-panel.active{display:block}
        .m15-card{background:#111827;border:1px solid #1e293b;border-radius:12px;padding:20px;margin-bottom:16px}
        .m15-card h3{margin:0 0 12px;color:#34d399;font-size:1.1em}
        .m15-obj-list{list-style:none;padding:0;margin:0}
        .m15-obj-list li{padding:8px 0;border-bottom:1px solid #1e293b;font-size:.9em;color:#cbd5e1;display:flex;gap:8px}
        .m15-obj-list li::before{content:'\u25C6';color:#34d399;flex-shrink:0}
        .m15-g2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
        .m15-g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px}
        .m15-ctrls{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-bottom:16px}
        .m15-ctrl{display:flex;flex-direction:column;gap:4px}
        .m15-ctrl label{font-size:.8em;color:#94a3b8}
        .m15-ctrl select,.m15-ctrl input[type=range]{width:100%;background:#1e293b;border:1px solid #334155;color:#e2e8f0;border-radius:6px;padding:6px;font-size:.85em}
        .m15-btn{padding:10px 24px;border:none;border-radius:8px;font-size:.9em;cursor:pointer;font-weight:600;transition:.2s}
        .m15-bp{background:linear-gradient(135deg,#34d399,#2dd4bf);color:#000}
        .m15-bp:hover{transform:translateY(-1px);box-shadow:0 4px 15px rgba(52,211,153,0.3)}
        .m15-bs{background:#1e293b;color:#94a3b8;border:1px solid #334155}
        .m15-bs:hover{border-color:#34d399;color:#34d399}
        .m15-mc{background:#0f172a;border:1px solid #1e293b;border-radius:10px;padding:16px;text-align:center}
        .m15-mc .v{font-size:1.8em;font-weight:700;margin:4px 0}
        .m15-mc .l{font-size:.8em;color:#94a3b8}
        .m15-cbox{background:#0f172a;border:1px solid #1e293b;border-radius:10px;padding:10px;text-align:center;margin-bottom:12px}
        .m15-cbox canvas{border-radius:6px;background:#0a0f1a;width:100%;max-height:280px}
        .m15-code{background:#0d1117;border:1px solid #21262d;border-radius:8px;padding:16px;font-family:'Fira Code',monospace;font-size:.8em;color:#c9d1d9;overflow-x:auto;white-space:pre;line-height:1.6;max-height:400px;overflow-y:auto}
        .m15-fm{background:#0d1117;border:1px solid #21262d;border-radius:8px;padding:12px 16px;margin:8px 0;font-family:monospace;font-size:.85em;color:#c9d1d9;line-height:1.8}
        .m15-fm .fn{color:#34d399}
        .m15-ref{background:linear-gradient(135deg,#042f2e,#172554);border:1px solid #065f46;border-radius:12px;padding:20px;margin-top:16px}
        .m15-ref h4{color:#34d399;margin:0 0 10px}
        .m15-ref ul{margin:0;padding-left:20px}
        .m15-ref li{color:#cbd5e1;font-size:.9em;margin:6px 0}
        @media(max-width:768px){.m15-g2,.m15-g3{grid-template-columns:1fr}}
      </style>
      <div class="m15-root">
        <div class="m15-hero">
          <h1>Module 15: Performance Evaluation Metrics</h1>
          <p>Confusion matrices, ROC curves, precision-recall, calibration, and beyond</p>
        </div>
        <div class="m15-tabs" role="tablist" aria-label="Module sections">
          <button class="m15-tab active" data-tab="objectives" role="tab" aria-selected="true">Objectives</button>
          <button class="m15-tab" data-tab="animation" role="tab" aria-selected="false">Visualizer</button>
          <button class="m15-tab" data-tab="theory" role="tab" aria-selected="false">Theory</button>
          <button class="m15-tab" data-tab="simulation" role="tab" aria-selected="false">Simulation</button>
          <button class="m15-tab" data-tab="code" role="tab" aria-selected="false">Code</button>
          <button class="m15-tab" data-tab="quiz" role="tab" aria-selected="false">Quiz</button>
          <button class="m15-tab" data-tab="reflection" role="tab" aria-selected="false">Reflection</button>
        </div>
        <div class="m15-panel active" data-panel="objectives" role="tabpanel">
          <div class="m15-card"><h3>Learning Objectives</h3>
            <ul class="m15-obj-list">
              <li>Compute and interpret standard evaluation metrics: accuracy, sensitivity, specificity, precision, F1</li>
              <li>Understand ROC curves and AUC as threshold-independent performance measures</li>
              <li>Analyze precision-recall tradeoffs for imbalanced classification problems</li>
              <li>Evaluate probability calibration using reliability diagrams and expected calibration error</li>
              <li>Compare metrics across different problem settings using radar charts and bootstrap confidence intervals</li>
            </ul>
          </div>
        </div>
        <div class="m15-panel" data-panel="animation" role="tabpanel" hidden>
          <div class="m15-card"><h3>Interactive Metric Visualizer</h3>
            <div style="text-align:center;margin-bottom:16px">
              <button class="m15-btn m15-bp" id="m15-anim">&#9654; Animate All</button>
              <button class="m15-btn m15-bs" id="m15-ranim" style="margin-left:8px">&#8634; Reset</button>
            </div>
            <div class="m15-g3">
              <div class="m15-cbox"><canvas id="m15-cv-cm" width="240" height="220"></canvas><div style="font-size:.8em;color:#94a3b8">Confusion Matrix</div></div>
              <div class="m15-cbox"><canvas id="m15-cv-roc" width="240" height="220"></canvas><div style="font-size:.8em;color:#94a3b8">ROC Curve</div></div>
              <div class="m15-cbox"><canvas id="m15-cv-pr" width="240" height="220"></canvas><div style="font-size:.8em;color:#94a3b8">Precision-Recall Curve</div></div>
            </div>
          </div>
        </div>
        <div class="m15-panel" data-panel="theory" role="tabpanel" hidden>
          <div class="m15-card"><h3>Theoretical Foundation</h3>
            <div class="m15-g2">
              <div>
                <h4 style="color:#34d399;margin:0 0 8px">Confusion Matrix Metrics</h4>
                <div class="m15-fm">
                  <div><span class="fn">Accuracy</span> = (TP + TN) / (TP + TN + FP + FN)</div>
                  <div><span class="fn">Sensitivity</span> = TP / (TP + FN) <span style="color:#94a3b8">-- recall, TPR</span></div>
                  <div><span class="fn">Specificity</span> = TN / (TN + FP) <span style="color:#94a3b8">-- TNR</span></div>
                  <div><span class="fn">Precision</span> = TP / (TP + FP) <span style="color:#94a3b8">-- PPV</span></div>
                  <div><span class="fn">F1</span> = 2 * Precision * Recall / (Precision + Recall)</div>
                </div>
                <h4 style="color:#34d399;margin:16px 0 8px">Multi-Class Averaging</h4>
                <p style="font-size:.88em;color:#cbd5e1;line-height:1.6">
                  <strong>Macro:</strong> Unweighted mean across classes. <strong>Micro:</strong> Global aggregation (dominated by frequent classes). <strong>Weighted:</strong> By class support.
                </p>
                <h4 style="color:#34d399;margin:16px 0 8px">Cohen's Kappa</h4>
                <p style="font-size:.88em;color:#cbd5e1;line-height:1.6">
                  kappa = (p_o - p_e) / (1 - p_e), where p_o = observed agreement, p_e = chance agreement. kappa > 0.8 = strong agreement.
                </p>
              </div>
              <div>
                <h4 style="color:#34d399;margin:0 0 8px">ROC Curve &amp; AUC</h4>
                <p style="font-size:.88em;color:#cbd5e1;line-height:1.6">
                  ROC plots TPR vs FPR at every threshold. AUC: 0.5 = random, 1.0 = perfect. For multi-class: one-vs-rest AUC per class.
                </p>
                <h4 style="color:#34d399;margin:16px 0 8px">Precision-Recall Curve</h4>
                <p style="font-size:.88em;color:#cbd5e1;line-height:1.6">
                  More informative under class imbalance. PR-AUC focuses on positive class performance. High ROC-AUC can still yield poor PR-AUC.
                </p>
                <h4 style="color:#34d399;margin:16px 0 8px">Calibration</h4>
                <p style="font-size:.88em;color:#cbd5e1;line-height:1.6">
                  Well-calibrated probabilities match true event rates. ECE bins predictions, measures gap between mean predicted and actual accuracy.
                </p>
                <h4 style="color:#34d399;margin:16px 0 8px">Bootstrap Confidence Intervals</h4>
                <p style="font-size:.88em;color:#cbd5e1;line-height:1.6">
                  Resample with replacement (1000+ iters) to estimate CIs for any metric without distributional assumptions.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="m15-panel" data-panel="simulation" role="tabpanel" hidden>
          <div class="m15-card"><h3>Interactive Metrics Dashboard</h3>
            <div class="m15-ctrls">
              <div class="m15-ctrl"><label for="m15-q">TP Rate: <span id="m15-qv">80</span>%</label><input type="range" id="m15-q" min="10" max="99" value="80"></div>
              <div class="m15-ctrl"><label for="m15-b">Imbalance: <span id="m15-bv">1</span>:1</label><input type="range" id="m15-b" min="1" max="10" value="1"></div>
              <div class="m15-ctrl"><label for="m15-s">Samples: <span id="m15-sv">500</span></label><input type="range" id="m15-s" min="50" max="2000" value="500" step="50"></div>
              <div class="m15-ctrl"><label for="m15-t">Threshold: <span id="m15-tv">0.50</span></label><input type="range" id="m15-t" min="5" max="95" value="50"></div>
              <div class="m15-ctrl"><label for="m15-ms">Model</label><select id="m15-ms"><option value="current">Current Model</option><option value="a">A (High Sensitivity)</option><option value="b">B (High Specificity)</option><option value="c">C (Balanced)</option></select></div>
            </div>
            <div style="text-align:center;margin-bottom:16px"><button class="m15-btn m15-bp" id="m15-run">&#9654; Generate &amp; Evaluate</button></div>
          </div>
          <div class="m15-g3" style="margin-bottom:16px">
            <div class="m15-mc"><div class="l">Accuracy</div><div class="v" id="m15-ma" style="color:#34d399">&mdash;</div></div>
            <div class="m15-mc"><div class="l">Sensitivity</div><div class="v" id="m15-ms2" style="color:#60a5fa">&mdash;</div></div>
            <div class="m15-mc"><div class="l">Specificity</div><div class="v" id="m15-mp" style="color:#a78bfa">&mdash;</div></div>
            <div class="m15-mc"><div class="l">Precision</div><div class="v" id="m15-mpc" style="color:#f59e0b">&mdash;</div></div>
            <div class="m15-mc"><div class="l">F1 Score</div><div class="v" id="m15-mf" style="color:#f472b6">&mdash;</div></div>
            <div class="m15-mc"><div class="l">AUC-ROC</div><div class="v" id="m15-mauc" style="color:#34d399">&mdash;</div></div>
          </div>
          <div class="m15-g2">
            <div class="m15-card"><h3>Confusion Matrix</h3><div id="m15-cmc"></div></div>
            <div class="m15-card"><h3>ROC &amp; PR Curves</h3>
              <div class="m15-g2">
                <div class="m15-cbox"><canvas id="m15-sroc" width="200" height="200"></canvas><div style="font-size:.75em;color:#94a3b8">ROC (AUC=<span id="m15-ru">&mdash;</span>)</div></div>
                <div class="m15-cbox"><canvas id="m15-spr" width="200" height="200"></canvas><div style="font-size:.75em;color:#94a3b8">PR Curve</div></div>
              </div>
            </div>
          </div>
          <div class="m15-card"><h3>Calibration Curve</h3>
            <div class="m15-cbox"><canvas id="m15-scl" width="400" height="200"></canvas></div>
            <div style="text-align:center;font-size:.82em;color:#94a3b8" id="m15-ece">ECE: &mdash;</div>
          </div>
          <div class="m15-card"><h3>Radar Chart &mdash; Multi-Model Comparison</h3>
            <div class="m15-cbox"><canvas id="m15-srd" width="300" height="300"></canvas></div>
          </div>
          <div class="m15-card"><h3>Bootstrap 95% Confidence Intervals</h3>
            <div id="m15-ci" style="font-size:.88em;color:#cbd5e1">Generate predictions to see bootstrap CIs</div>
          </div>
        </div>
        <div class="m15-panel" data-panel="code" role="tabpanel" hidden>
          <div class="m15-card"><h3>Python Implementation</h3><div class="m15-code" id="m15-code"></div></div>
        </div>
        <div class="m15-panel" data-panel="quiz" role="tabpanel" hidden>
          <div class="m15-card"><h3>Knowledge Check</h3><div id="m15-quiz"></div></div>
        </div>
        <div class="m15-panel" data-panel="reflection" role="tabpanel" hidden>
          <div class="m15-ref"><h4>Which Metrics Matter for Clinical Deployment?</h4>
            <ul>
              <li><strong>Sensitivity is paramount for screening:</strong> Missing LR-5 has severe consequences; maximize sensitivity even at cost of more FPs</li>
              <li><strong>Specificity matters for resource allocation:</strong> High FPR leads to unnecessary biopsies, patient anxiety, and cost</li>
              <li><strong>F1 balances both:</strong> Single harmonic mean useful for comparison but may mask failure modes</li>
              <li><strong>Calibration enables shared decision-making:</strong> Well-calibrated probability of 60% HCC allows clinician-patient risk discussion</li>
              <li><strong>Threshold is a clinical decision:</strong> Operating point on ROC should reflect FP vs FN cost asymmetry</li>
            </ul>
          </div>
          <div class="m15-ref" style="margin-top:12px"><h4>Class Imbalance Effects</h4>
            <ul>
              <li>Accuracy is misleading under imbalance -- majority-class prediction scores high</li>
              <li>PR curves more informative than ROC under imbalance; ROC appears optimistic</li>
              <li>Macro-averaged metrics treat rare classes equally -- essential when all LI-RADS categories matter</li>
              <li>Resampling must be fold-level to avoid data leakage</li>
            </ul>
          </div>
        </div>
      </div>
    ` + '<div style="padding:1rem 1.5rem 2rem;display:flex;justify-content:center;"><button data-navigate="home" class="px-6 py-3 rounded-xl border border-white/20 text-sm text-gray-300 hover:text-white hover:border-primary-400/50 transition-all cursor-pointer" style="background:rgba(255,255,255,0.04);min-height:44px;">&#x2190; Back to Home</button></div>';
    this._initTabs(container);
    this._initSliders();
    this._initAnim();
    this._initSim();
    this._initQuiz();
    this._renderCode();
  },
  destroy() {
    this._intervals.forEach(function(id) { clearInterval(id); });
    this._intervals = [];
  },
  _initTabs(c) {
    c.querySelectorAll('.m15-tab').forEach(t => t.addEventListener('click', () => {
      c.querySelectorAll('.m15-tab').forEach(x => { x.classList.remove('active'); x.setAttribute('aria-selected', 'false'); });
      c.querySelectorAll('.m15-panel').forEach(x => { x.classList.remove('active'); x.setAttribute('hidden', ''); });
      t.classList.add('active');
      t.setAttribute('aria-selected', 'true');
      const panel = c.querySelector('.m15-panel[data-panel="'+t.dataset.tab+'"]');
      if (panel) { panel.classList.add('active'); panel.removeAttribute('hidden'); }
    }));
  },
  _initSliders() {
    let _m15Timer = null;
    const debounceSim = () => {
      if (_m15Timer) clearTimeout(_m15Timer);
      _m15Timer = setTimeout(() => this._runSim(), 300);
    };
    [['m15-q','m15-qv',v=>v+'%'],['m15-b','m15-bv',v=>v+':1'],['m15-s','m15-sv',v=>v],['m15-t','m15-tv',v=>(v/100).toFixed(2)]].forEach(([si,li,fn]) => {
      const s=document.getElementById(si),l=document.getElementById(li);
      if(s&&l) s.addEventListener('input',()=>{l.textContent=fn(parseInt(s.value));debounceSim();});
    });
    const ms = document.getElementById('m15-ms');
    if (ms) ms.addEventListener('change', debounceSim);
  },
  _initAnim() {
    document.getElementById('m15-anim')?.addEventListener('click',()=>this._runAnim());
    document.getElementById('m15-ranim')?.addEventListener('click',()=>['m15-cv-cm','m15-cv-roc','m15-cv-pr'].forEach(id=>{const c=document.getElementById(id);if(c)c.getContext('2d').clearRect(0,0,c.width,c.height);}));
  },
  _runAnim() { this._animCM(); setTimeout(()=>this._animROC(),800); setTimeout(()=>this._animPR(),1600); },
  _animCM() {
    const cv=document.getElementById('m15-cv-cm'); if(!cv)return;
    const ctx=cv.getContext('2d'),w=cv.width,h=cv.height;
    ctx.clearRect(0,0,w,h);
    const cm=[[85,10,5],[8,78,14],[3,12,85]],labels=['LR-3','LR-4','LR-5'];
    const cW=55,cH=50,sX=(w-cW*3)/2,sY=40;
    ctx.fillStyle='#94a3b8';ctx.font='11px sans-serif';ctx.textAlign='center';
    ctx.fillText('Predicted',w/2,16);
    ctx.save();ctx.translate(16,sY+cH*1.5);ctx.rotate(-Math.PI/2);ctx.fillText('Actual',0,0);ctx.restore();
    const cells=[];for(let r=0;r<3;r++)for(let c=0;c<3;c++)cells.push({r,c,v:cm[r][c]});
    let idx=0;const iv=setInterval(()=>{
      if(idx>=cells.length){clearInterval(iv);return;}
      const cl=cells[idx],x=sX+cl.c*cW,y=sY+cl.r*cH;
      ctx.fillStyle=cl.r===cl.c?`rgba(34,197,94,${0.1+cl.v/100*0.2})`:`rgba(239,68,68,${0.05+cl.v/100*0.15})`;
      ctx.fillRect(x,y,cW-2,cH-2);
      ctx.fillStyle=cl.r===cl.c?'#22c55e':'#ef4444';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
      ctx.fillText(cl.v,x+cW/2,y+cH/2+5);idx++;
    },120);this._intervals.push(iv);
    labels.forEach((l,i)=>{ctx.fillStyle='#94a3b8';ctx.font='10px sans-serif';ctx.textAlign='center';ctx.fillText(l,sX+i*cW+cW/2,sY+3*cH+16);ctx.textAlign='right';ctx.fillText(l,sX-6,sY+i*cH+cH/2+4);});
  },
  _animROC() {
    const cv=document.getElementById('m15-cv-roc');if(!cv)return;
    const ctx=cv.getContext('2d'),w=cv.width,h=cv.height;ctx.clearRect(0,0,w,h);
    const p=35;ctx.strokeStyle='#334155';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(p,p);ctx.lineTo(p,h-p);ctx.lineTo(w-p,h-p);ctx.stroke();
    ctx.fillStyle='#94a3b8';ctx.font='9px sans-serif';ctx.textAlign='center';ctx.fillText('False Positive Rate',w/2,h-6);
    ctx.save();ctx.translate(10,h/2);ctx.rotate(-Math.PI/2);ctx.fillText('True Positive Rate',0,0);ctx.restore();
    ctx.strokeStyle='#475569';ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(p,h-p);ctx.lineTo(w-p,p);ctx.stroke();ctx.setLineDash([]);
    const pts=[];for(let i=0;i<=20;i++){const t=i/20;pts.push({x:p+t*(w-2*p),y:(h-p)-(1-Math.pow(1-t,2.7))*(h-2*p)});}
    let dn=0;const iv=setInterval(()=>{if(dn>=pts.length-1){clearInterval(iv);return;}ctx.strokeStyle='#34d399';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(pts[dn].x,pts[dn].y);ctx.lineTo(pts[dn+1].x,pts[dn+1].y);ctx.stroke();dn++;},80);this._intervals.push(iv);
    ctx.fillStyle='rgba(52,211,153,0.08)';ctx.beginPath();ctx.moveTo(p,h-p);pts.forEach(pt=>ctx.lineTo(pt.x,pt.y));ctx.lineTo(w-p,h-p);ctx.closePath();ctx.fill();
    ctx.fillStyle='#34d399';ctx.font='bold 11px sans-serif';ctx.textAlign='left';ctx.fillText('AUC = 0.89',p+8,p+16);
  },
  _animPR() {
    const cv=document.getElementById('m15-cv-pr');if(!cv)return;
    const ctx=cv.getContext('2d'),w=cv.width,h=cv.height;ctx.clearRect(0,0,w,h);
    const p=35;ctx.strokeStyle='#334155';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(p,p);ctx.lineTo(p,h-p);ctx.lineTo(w-p,h-p);ctx.stroke();
    ctx.fillStyle='#94a3b8';ctx.font='9px sans-serif';ctx.textAlign='center';ctx.fillText('Recall',w/2,h-6);
    ctx.save();ctx.translate(10,h/2);ctx.rotate(-Math.PI/2);ctx.fillText('Precision',0,0);ctx.restore();
    const pts=[];for(let i=0;i<=20;i++){const r=i/20;pts.push({x:p+r*(w-2*p),y:(h-p)-Math.max(0.3,0.95-r*0.4-r*r*0.15)*(h-2*p)});}
    let dn=0;const iv=setInterval(()=>{if(dn>=pts.length-1){clearInterval(iv);return;}ctx.strokeStyle='#60a5fa';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(pts[dn].x,pts[dn].y);ctx.lineTo(pts[dn+1].x,pts[dn+1].y);ctx.stroke();dn++;},80);this._intervals.push(iv);
  },
  _initSim() { document.getElementById('m15-run')?.addEventListener('click',()=>this._runSim()); },
  _genPreds(tpR,bal,n) {
    const nP=Math.round(n/(1+bal)),nN=n-nP,preds=[];
    const specR=Math.min(tpR*0.9+Math.random()*0.08,0.98);
    for(let i=0;i<nP;i++){const tp=Math.random()<tpR;preds.push({a:1,p:tp?1:0,c:tp?0.5+Math.random()*0.5:Math.random()*0.5});}
    for(let i=0;i<nN;i++){const tn=Math.random()<specR;preds.push({a:0,p:tn?0:1,c:tn?Math.random()*0.5:0.5+Math.random()*0.5});}
    return preds;
  },
  _calcMetrics(preds) {
    let tp=0,tn=0,fp=0,fn=0;
    preds.forEach(p=>{if(p.a===1&&p.p===1)tp++;else if(p.a===0&&p.p===0)tn++;else if(p.a===0&&p.p===1)fp++;else fn++;});
    const acc=(tp+tn)/(tp+tn+fp+fn)||0,sens=tp/(tp+fn)||0,spec=tn/(tn+fp)||0,prec=tp/(tp+fp)||0,f1=2*prec*sens/(prec+sens)||0;
    const tpr=sens,fpr=1-spec;const auc=Math.min(1,Math.max(0,(tpr+1-fpr)/2+0.1*(Math.random()-0.5)));
    return{tp,tn,fp,fn,acc,sens,spec,prec,f1,auc:Math.max(0.5,Math.min(0.99,auc))};
  },
  _runSim() {
    const tpR=parseInt(document.getElementById('m15-q').value)/100;
    const bal=parseInt(document.getElementById('m15-b').value);
    const n=parseInt(document.getElementById('m15-s').value);
    const model=document.getElementById('m15-ms').value;
    let adjTP=tpR;
    if(model==='a')adjTP=Math.min(0.98,tpR+0.1);
    else if(model==='b')adjTP=Math.max(0.2,tpR-0.1);
    const preds=this._genPreds(adjTP,bal,n);
    const m=this._calcMetrics(preds);
    document.getElementById('m15-ma').textContent=(m.acc*100).toFixed(1)+'%';
    document.getElementById('m15-ms2').textContent=(m.sens*100).toFixed(1)+'%';
    document.getElementById('m15-mp').textContent=(m.spec*100).toFixed(1)+'%';
    document.getElementById('m15-mpc').textContent=(m.prec*100).toFixed(1)+'%';
    document.getElementById('m15-mf').textContent=(m.f1*100).toFixed(1)+'%';
    document.getElementById('m15-mauc').textContent=m.auc.toFixed(3);
    this._drawCM(m);
    this._drawSimROC(m);
    this._drawSimPR(m);
    this._drawCalibration(preds);
    this._drawRadar(m);
    this._drawBootstrap(preds,m);
  },
  _drawCM(m) {
    const el=document.getElementById('m15-cmc');if(!el)return;
    const tp=m.tp,tn=m.tn,fp=m.fp,fn=m.fn;
    el.innerHTML=`<table style="border-collapse:collapse;margin:0 auto"><tr><td></td><td style="padding:6px;font-size:.78em;color:#94a3b8;text-align:center">Pred+</td><td style="padding:6px;font-size:.78em;color:#94a3b8;text-align:center">Pred-</td></tr>
    <tr><td style="padding:6px;font-size:.78em;color:#94a3b8">Actual+</td><td style="padding:10px 20px;background:rgba(34,197,94,0.15);color:#22c55e;font-weight:700;border-radius:6px;text-align:center">${tp}</td><td style="padding:10px 20px;background:rgba(239,68,68,0.1);color:#ef4444;font-weight:700;border-radius:6px;text-align:center">${fn}</td></tr>
    <tr><td style="padding:6px;font-size:.78em;color:#94a3b8">Actual-</td><td style="padding:10px 20px;background:rgba(239,68,68,0.1);color:#ef4444;font-weight:700;border-radius:6px;text-align:center">${fp}</td><td style="padding:10px 20px;background:rgba(34,197,94,0.15);color:#22c55e;font-weight:700;border-radius:6px;text-align:center">${tn}</td></tr></table>`;
  },
  _drawSimROC(m) {
    const cv=document.getElementById('m15-sroc');if(!cv)return;
    const ctx=cv.getContext('2d'),w=cv.width,h=cv.height;ctx.clearRect(0,0,w,h);
    const p=30;ctx.strokeStyle='#334155';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(p,p);ctx.lineTo(p,h-p);ctx.lineTo(w-p,h-p);ctx.stroke();
    ctx.strokeStyle='#475569';ctx.setLineDash([3,3]);ctx.beginPath();ctx.moveTo(p,h-p);ctx.lineTo(w-p,p);ctx.stroke();ctx.setLineDash([]);
    const pts=[];
    for(let i=0;i<=20;i++){const t=i/20;const tpr=Math.pow(t,1/(m.auc*1.5+0.3));pts.push({x:p+t*(w-2*p),y:(h-p)-tpr*(h-2*p)});}
    ctx.fillStyle='rgba(52,211,153,0.1)';ctx.beginPath();ctx.moveTo(p,h-p);pts.forEach(pt=>ctx.lineTo(pt.x,pt.y));ctx.lineTo(w-p,h-p);ctx.closePath();ctx.fill();
    ctx.strokeStyle='#34d399';ctx.lineWidth=2;ctx.beginPath();pts.forEach((pt,i)=>{i===0?ctx.moveTo(pt.x,pt.y):ctx.lineTo(pt.x,pt.y);});ctx.stroke();
    ctx.fillStyle='#34d399';ctx.font='bold 10px sans-serif';ctx.textAlign='left';ctx.fillText('AUC='+m.auc.toFixed(3),p+4,p+14);
    document.getElementById('m15-ru').textContent=m.auc.toFixed(3);
  },
  _drawSimPR(m) {
    const cv=document.getElementById('m15-spr');if(!cv)return;
    const ctx=cv.getContext('2d'),w=cv.width,h=cv.height;ctx.clearRect(0,0,w,h);
    const p=30;ctx.strokeStyle='#334155';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(p,p);ctx.lineTo(p,h-p);ctx.lineTo(w-p,h-p);ctx.stroke();
    const pts=[];for(let i=0;i<=20;i++){const r=i/20;const pr=m.prec*(1-r*0.6)+0.1*(1-r);pts.push({x:p+r*(w-2*p),y:(h-p)-Math.max(0.05,pr)*(h-2*p)});}
    ctx.strokeStyle='#60a5fa';ctx.lineWidth=2;ctx.beginPath();pts.forEach((pt,i)=>{i===0?ctx.moveTo(pt.x,pt.y):ctx.lineTo(pt.x,pt.y);});ctx.stroke();
  },
  _drawCalibration(preds) {
    const cv=document.getElementById('m15-scl');if(!cv)return;
    const ctx=cv.getContext('2d'),w=cv.width,h=cv.height;ctx.clearRect(0,0,w,h);
    const p=35;ctx.strokeStyle='#334155';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(p,p);ctx.lineTo(p,h-p);ctx.lineTo(w-p,h-p);ctx.stroke();
    ctx.strokeStyle='#475569';ctx.setLineDash([3,3]);ctx.beginPath();ctx.moveTo(p,h-p);ctx.lineTo(w-p,p);ctx.stroke();ctx.setLineDash([]);
    const bins=Array.from({length:10},()=>({sum:0,cnt:0,correct:0}));
    preds.forEach(pr=>{const b=Math.min(9,Math.floor(pr.c*10));bins[b].sum+=pr.c;bins[b].cnt++;if(pr.a===pr.p)bins[b].correct++;});
    const pts=[];bins.forEach((b,i)=>{if(b.cnt>0){const mp=b.sum/b.cnt;const ma=b.correct/b.cnt;pts.push({x:p+mp*(w-2*p),y:(h-p)-ma*(h-2*p)});}});
    ctx.fillStyle='rgba(96,165,250,0.15)';ctx.beginPath();pts.forEach((pt,i)=>{i===0?ctx.moveTo(pt.x,pt.y):ctx.lineTo(pt.x,pt.y);});ctx.lineTo(pts[pts.length-1].x,h-p);ctx.lineTo(pts[0].x,h-p);ctx.closePath();ctx.fill();
    ctx.strokeStyle='#60a5fa';ctx.lineWidth=2;ctx.beginPath();pts.forEach((pt,i)=>{i===0?ctx.moveTo(pt.x,pt.y):ctx.lineTo(pt.x,pt.y);});ctx.stroke();
    pts.forEach(pt=>{ctx.fillStyle='#60a5fa';ctx.beginPath();ctx.arc(pt.x,pt.y,4,0,Math.PI*2);ctx.fill();});
    ctx.fillStyle='#94a3b8';ctx.font='9px sans-serif';ctx.textAlign='center';ctx.fillText('Mean Predicted Probability',w/2,h-4);
    let ece=0;bins.forEach(b=>{if(b.cnt>0){const mp=b.sum/b.cnt;const ma=b.correct/b.cnt;ece+=b.cnt/preds.length*Math.abs(mp-ma);}});
    document.getElementById('m15-ece').textContent='ECE: '+(ece*100).toFixed(2)+'%';
  },
  _drawRadar(m) {
    const cv=document.getElementById('m15-srd');if(!cv)return;
    const ctx=cv.getContext('2d'),cx=150,cy=150,r=110;ctx.clearRect(0,0,300,300);
    const labels=['Accuracy','Sensitivity','Specificity','Precision','F1'];const vals=[m.acc,m.sens,m.spec,m.prec,m.f1];
    const n=labels.length;
    for(let ring=1;ring<=5;ring++){
      ctx.strokeStyle='#1e293b';ctx.beginPath();
      for(let i=0;i<=n;i++){const a=-Math.PI/2+i*2*Math.PI/n;ctx.lineTo(cx+Math.cos(a)*r*ring/5,cy+Math.sin(a)*r*ring/5);}
      ctx.closePath();ctx.stroke();
    }
    for(let i=0;i<n;i++){const a=-Math.PI/2+i*2*Math.PI/n;ctx.strokeStyle='#334155';ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);ctx.stroke();}
    ctx.fillStyle='#34d399';ctx.globalAlpha=0.2;ctx.beginPath();
    vals.forEach((v,i)=>{const a=-Math.PI/2+i*2*Math.PI/n;const px=cx+Math.cos(a)*r*v;const py=cy+Math.sin(a)*r*v;i===0?ctx.moveTo(px,py):ctx.lineTo(px,py);});
    ctx.closePath();ctx.fill();ctx.globalAlpha=1;
    ctx.strokeStyle='#34d399';ctx.lineWidth=2;ctx.beginPath();
    vals.forEach((v,i)=>{const a=-Math.PI/2+i*2*Math.PI/n;const px=cx+Math.cos(a)*r*v;const py=cy+Math.sin(a)*r*v;i===0?ctx.moveTo(px,py):ctx.lineTo(px,py);});
    ctx.closePath();ctx.stroke();
    vals.forEach((v,i)=>{const a=-Math.PI/2+i*2*Math.PI/n;ctx.fillStyle='#34d399';ctx.beginPath();ctx.arc(cx+Math.cos(a)*r*v,cy+Math.sin(a)*r*v,4,0,Math.PI*2);ctx.fill();});
    labels.forEach((l,i)=>{const a=-Math.PI/2+i*2*Math.PI/n;ctx.fillStyle='#94a3b8';ctx.font='10px sans-serif';ctx.textAlign='center';ctx.fillText(l,cx+Math.cos(a)*(r+18),cy+Math.sin(a)*(r+18)+3);});
  },
  _drawBootstrap(preds,m) {
    const el=document.getElementById('m15-ci');if(!el)return;
    const nIter=500;const metrics={acc:[],sens:[],spec:[],f1:[]};
    for(let iter=0;iter<nIter;iter++){
      const sample=[];for(let i=0;i<preds.length;i++)sample.push(preds[Math.floor(Math.random()*preds.length)]);
      const sm=this._calcMetrics(sample);metrics.acc.push(sm.acc);metrics.sens.push(sm.sens);metrics.spec.push(sm.spec);metrics.f1.push(sm.f1);
    }
    const ci95=(arr)=>{const s=arr.sort((a,b)=>a-b);const lo=s[Math.floor(nIter*0.025)];const hi=s[Math.floor(nIter*0.975)];return[lo,hi];};
    const items=[['Accuracy',metrics.acc,m.acc],['Sensitivity',metrics.sens,m.sens],['Specificity',metrics.spec,m.spec],['F1',metrics.f1,m.f1]];
    el.innerHTML=items.map(([name,arr,point])=>{
      const[lo,hi]=ci95(arr);const c=point>0.8?'#22c55e':point>0.6?'#f59e0b':'#ef4444';
      return`<div style="margin:8px 0;padding:10px;background:#0f172a;border-radius:8px;border-left:3px solid ${c}">
        <strong style="color:${c}">${name}</strong>: ${(point*100).toFixed(1)}%
        <span style="color:#94a3b8;margin-left:12px">95% CI: [${(lo*100).toFixed(1)}%, ${(hi*100).toFixed(1)}%]</span>
      </div>`;
    }).join('');
  },
  _initQuiz() {
    Components.createQuiz(document.getElementById('m15-quiz'),[
      {q:'A model has accuracy=95% but sensitivity=40% for LR-5. What does this indicate?',options:['The model is excellent overall','The model misses most LR-5 lesions despite high overall accuracy, dangerous for clinical use','The model has perfect specificity','The threshold is too low'],correct:1,explanation:'High accuracy with low sensitivity for the critical class indicates class imbalance effects. The model correctly classifies majority negatives but misses dangerous LR-5 lesions.'},
      {q:'Why is the PR curve more informative than ROC under class imbalance?',options:['PR curves are easier to compute','PR focuses on the positive (minority) class performance while ROC can appear optimistic when negatives dominate','PR curves always show higher AUC','ROC cannot handle multi-class problems'],correct:1,explanation:'ROC uses FPR (FP/total negatives), which stays low when negatives vastly outnumber positives, making the curve appear better than actual minority-class performance.'},
      {q:'What does Expected Calibration Error (ECE) measure?',options:['The model training loss','The gap between predicted probabilities and actual observed frequencies across probability bins','The number of misclassified samples','The model inference speed'],correct:1,explanation:'ECE bins predictions by confidence, compares mean predicted probability to actual accuracy in each bin, and weights by bin size. Lower ECE means better calibrated.'},
      {q:'When should you prioritize sensitivity over specificity in a clinical AI system?',options:['When biopsies are cheap and risk-free','When missing a positive case (false negative) has severe consequences, such as screening for HCC','When the dataset is perfectly balanced','When compute resources are limited'],correct:1,explanation:'In cancer screening, false negatives (missed cancers) have life-threatening consequences, so sensitivity should be maximized even at the cost of more false positives requiring follow-up.'}
    ]);
  },
  _renderCode() {
    const code=`import numpy as np
from sklearn.metrics import (classification_report, confusion_matrix,
                             roc_curve, auc, precision_recall_curve)

class MetricsEngine:
    def __init__(self, y_true, y_pred, y_prob=None):
        self.y_true = np.array(y_true)
        self.y_pred = np.array(y_pred)
        self.y_prob = np.array(y_prob) if y_prob is not None else None

    def confusion_matrix(self):
        return confusion_matrix(self.y_true, self.y_pred)

    def classification_report(self, target_names=None):
        return classification_report(
            self.y_true, self.y_pred,
            target_names=target_names, output_dict=True
        )

    def roc_auc(self, average='macro'):
        if self.y_prob is None:
            raise ValueError("y_prob required for AUC")
        from sklearn.metrics import roc_auc_score
        return roc_auc_score(
            self.y_true, self.y_prob, average=average,
            multi_class='ovr'
        )

    def calibration_curve(self, n_bins=10):
        if self.y_prob is None:
            raise ValueError("y_prob required")
        prob_true, prob_pred = [], []
        bin_edges = np.linspace(0, 1, n_bins + 1)
        for i in range(n_bins):
            mask = (self.y_prob >= bin_edges[i]) & \
                   (self.y_prob < bin_edges[i + 1])
            if mask.sum() > 0:
                prob_true.append(self.y_true[mask].mean())
                prob_pred.append(self.y_prob[mask].mean())
        return np.array(prob_true), np.array(prob_pred)

    def ece(self, n_bins=10):
        prob_true, prob_pred = self.calibration_curve(n_bins)
        n = len(self.y_true)
        ece = 0
        for i in range(len(prob_true)):
            bin_mask = (self.y_prob >= i / n_bins) & \
                       (self.y_prob < (i + 1) / n_bins)
            ece += bin_mask.sum() / n * \
                   abs(prob_true[i] - prob_pred[i])
        return ece

    def bootstrap_ci(self, metric_fn, n_boot=1000, ci=0.95):
        scores = []
        for _ in range(n_boot):
            idx = np.random.choice(
                len(self.y_true), len(self.y_true), replace=True
            )
            scores.append(metric_fn(self.y_true[idx], self.y_pred[idx]))
        lo = np.percentile(scores, (1 - ci) / 2 * 100)
        hi = np.percentile(scores, (1 + ci) / 2 * 100)
        return lo, hi, np.mean(scores)

# Usage
engine = MetricsEngine(y_true, y_pred, y_prob)
print(engine.confusion_matrix())
print(f"AUC: {engine.roc_auc():.4f}")
print(f"ECE: {engine.ece():.4f}")
lo, hi, mean = engine.bootstrap_ci(
    lambda yt, yp: (yt == yp).mean()
)
print(f"Accuracy: {mean:.3f} 95% CI: [{lo:.3f}, {hi:.3f}]")`;
    const el=document.getElementById('m15-code');if(el)el.textContent=code;
  }
});
