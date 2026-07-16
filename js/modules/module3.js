/**
 * Module 3: Multiphase CT — The Power of Contrast
 * Contrast-enhanced multiphase CT imaging: phases, pharmacokinetics,
 * enhancement patterns of HCC, and DCE curve simulation.
 */
(function () {
  var moduleId = '3';
  var _animId = null;
  var _simId = null;

  ModuleEngine.register(moduleId, {
    init: function (container) {
      container.innerHTML =
        '<div id="module-3-objectives"><div class="objectives-grid"></div></div>' +
        '<div id="module-3-animation"><div class="animation-container"></div></div>' +
        '<div id="module-3-theory"><div class="theory-content"></div></div>' +
        '<div id="module-3-simulation"><div class="simulation-container"></div></div>' +
        '<div id="module-3-code"><div class="code-container"></div></div>' +
        '<div id="module-3-quiz"><div class="quiz-container"></div></div>' +
        '<div id="module-3-reflection"><div class="reflection-content"></div></div>';
      populateObjectives();
      initPhaseTimeline();
      populateTheory();
      initDCESimulation();
      populateCode();
      populateQuiz();
      populateReflection();
    },
    destroy: function () {
      if (_animId) cancelAnimationFrame(_animId);
      if (_simId) cancelAnimationFrame(_simId);
      if (_resizeHandler) window.removeEventListener('resize', _resizeHandler);
    }
  });

  /* ── Learning Objectives ──────────────────── */

  function populateObjectives() {
    var container = document.querySelector('#module-' + moduleId + '-objectives .objectives-grid');
    if (!container) return;

    var items = [
      { num: 1, text: 'Understand the four phases of multiphase liver CT: non-contrast (NC), arterial (AP), portal venous (PVP), and delayed (DP).' },
      { num: 2, text: 'Learn how iodinated contrast media travels through the cardiovascular system and enhances tissues differently at each phase.' },
      { num: 3, text: 'Identify the classic enhancement pattern of HCC: arterial-phase hyperenhancement (APHE) with portal venous or delayed-phase washout.' },
      { num: 4, text: 'Understand the pharmacokinetics of contrast injection: dose, rate, delay timing, and how these affect enhancement curves.' },
      { num: 5, text: 'Learn why phase-aware analysis is critical for AI models — how mixing phases or mislabelling degrades classification performance.' }
    ];

    items.forEach(function (o) {
      var card = document.createElement('div');
      card.className = 'objective-item';
      card.innerHTML = '<div class="objective-number">' + o.num + '</div><div class="objective-text">' + o.text + '</div>';
      container.appendChild(card);
    });
  }

  /* ── Interactive Phase Timeline Animation ─── */

  function initPhaseTimeline() {
    var wrapper = document.querySelector('#module-' + moduleId + '-animation .animation-container');
    if (!wrapper) return;

    wrapper.innerHTML =
      '<div style="padding:20px;">' +
        '<div id="phase-timeline" style="display:flex;gap:0;overflow-x:auto;padding-bottom:10px;">' +
          '<div class="phase-card" data-phase="nc" style="flex:1;min-width:200px;padding:16px;border-radius:10px;background:rgba(148,163,184,.08);border:2px solid rgba(148,163,184,.2);cursor:pointer;transition:all .3s;">' +
            '<div style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:.05em;">Phase 0</div>' +
            '<div style="font-size:16px;font-weight:700;color:#e2e8f0;margin:4px 0;">Non-Contrast</div>' +
            '<div style="font-size:12px;color:#94a3b8;">0 sec</div>' +
            '<div style="margin-top:10px;font-size:12px;color:#94a3b8;line-height:1.5;">Baseline before contrast. Detects calcifications, fat, and hemorrhage.</div>' +
          '</div>' +
          '<div class="phase-card" data-phase="ap" style="flex:1;min-width:200px;padding:16px;border-radius:10px;background:rgba(239,68,68,.08);border:2px solid rgba(239,68,68,.3);cursor:pointer;transition:all .3s;">' +
            '<div style="font-size:11px;color:#ef4444;text-transform:uppercase;letter-spacing:.05em;">Phase 1</div>' +
            '<div style="font-size:16px;font-weight:700;color:#e2e8f0;margin:4px 0;">Arterial Phase</div>' +
            '<div style="font-size:12px;color:#94a3b8;">~20–30 sec</div>' +
            '<div style="margin-top:10px;font-size:12px;color:#94a3b8;line-height:1.5;">HCC shows intense APHE. Hepatic artery delivers contrast first. Key for detecting hypervascular lesions.</div>' +
          '</div>' +
          '<div class="phase-card" data-phase="pvp" style="flex:1;min-width:200px;padding:16px;border-radius:10px;background:rgba(59,130,246,.08);border:2px solid rgba(59,130,246,.3);cursor:pointer;transition:all .3s;">' +
            '<div style="font-size:11px;color:#3b82f6;text-transform:uppercase;letter-spacing:.05em;">Phase 2</div>' +
            '<div style="font-size:16px;font-weight:700;color:#e2e8f0;margin:4px 0;">Portal Venous</div>' +
            '<div style="font-size:12px;color:#94a3b8;">~60–70 sec</div>' +
            '<div style="margin-top:10px;font-size:12px;color:#94a3b8;line-height:1.5;">Liver parenchyma enhances maximally. HCC washes out relative to liver. Best for overall liver assessment.</div>' +
          '</div>' +
          '<div class="phase-card" data-phase="dp" style="flex:1;min-width:200px;padding:16px;border-radius:10px;background:rgba(139,92,246,.08);border:2px solid rgba(139,92,246,.3);cursor:pointer;transition:all .3s;">' +
            '<div style="font-size:11px;color:#8b5cf6;text-transform:uppercase;letter-spacing:.05em;">Phase 3</div>' +
            '<div style="font-size:16px;font-weight:700;color:#e2e8f0;margin:4px 0;">Delayed Phase</div>' +
            '<div style="font-size:12px;color:#94a3b8;">~180–300 sec</div>' +
            '<div style="margin-top:10px;font-size:12px;color:#94a3b8;line-height:1.5;">Capsule appearance of HCC. Contrast washes out of tumour but persists in capsule. Important for LR-5 diagnosis.</div>' +
          '</div>' +
        '</div>' +

        '<div style="margin-top:20px;border-radius:12px;overflow:hidden;background:rgba(10,14,26,.6);border:1px solid rgba(59,130,246,.15);">' +
          '<canvas id="phase-canvas" style="display:block;width:100%;height:280px;"></canvas>' +
        '</div>' +
        '<div id="phase-description" style="margin-top:12px;padding:14px;border-radius:10px;background:rgba(30,41,59,.4);color:#94a3b8;font-size:13px;line-height:1.6;">Click a phase above to see how contrast distributes through the liver vasculature and parenchyma at that time point.</div>' +
      '</div>';

    var canvas = document.getElementById('phase-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var W, H;
    var activePhase = 'nc';
    var animTime = 0;

    function resize() {
      var r = canvas.parentElement.getBoundingClientRect();
      W = canvas.width = r.width;
      H = canvas.height = 280;
    }
    resize();
    var _resizeHandler = resize;
    window.addEventListener('resize', _resizeHandler);

    /* phase click */
    var cards = wrapper.querySelectorAll('.phase-card');
    var phaseDescs = {
      nc: '<strong style="color:#94a3b8;">Non-Contrast Phase (0 sec):</strong> No contrast has been administered yet. The liver appears relatively homogeneous at ~55–65 HU. Calcifications, fat, and acute hemorrhage may be visible. This phase serves as the baseline for comparison with later phases.',
      ap: '<strong style="color:#ef4444;">Arterial Phase (20–30 sec):</strong> Contrast arrives via the hepatic artery. HCC receives ~80% of its blood supply from the hepatic artery, so it lights up brightly (APHE). The liver parenchyma has minimal enhancement since it receives most blood from the portal vein, which has not yet been opacified.',
      pvp: '<strong style="color:#3b82f6;">Portal Venous Phase (60–70 sec):</strong> Contrast returns via the portal vein, which supplies 75% of liver blood. Liver parenchyma reaches peak enhancement. HCC washes out relative to the now-enhanced liver, creating the "washout" appearance. This is the best phase for overall liver assessment and detecting hypovascular lesions.',
      dp: '<strong style="color:#8b5cf6;">Delayed Phase (180–300 sec):</strong> Contrast has largely cleared from the liver. HCC may show a "capsule appearance" — a rim of enhancement around the washed-out tumour. This capsule is a key LI-RADS 5 feature. Cholangiocarcinoma typically shows progressive enhancement (opposite pattern to HCC).'
    };

    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        activePhase = card.dataset.phase;
        cards.forEach(function (c) { c.style.transform = ''; c.style.boxShadow = ''; });
        card.style.transform = 'translateY(-4px)';
        card.style.boxShadow = '0 8px 24px rgba(0,0,0,.3)';
        var descEl = document.getElementById('phase-description');
        if (descEl) descEl.innerHTML = phaseDescs[activePhase] || '';
      });
    });

    function drawPhase() {
      ctx.clearRect(0, 0, W, H);
      animTime += 0.015;

      var cx = W / 2;
      var cy = H / 2;

      /* liver */
      var lGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 100);
      var liverBase = activePhase === 'pvp' ? '#c45a48' : '#8b2e24';
      lGrad.addColorStop(0, liverBase);
      lGrad.addColorStop(1, '#4a1a12');
      ctx.fillStyle = lGrad;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 110, 75, 0, 0, Math.PI * 2);
      ctx.fill();

      /* hepatic artery */
      ctx.save();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx - 20, cy - 80);
      ctx.bezierCurveTo(cx + 30, cy - 30, cx + 70, cy, cx + 80, cy + 30);
      ctx.stroke();

      /* portal vein */
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cx + 15, cy - 80);
      ctx.bezierCurveTo(cx - 10, cy - 20, cx - 50, cy + 10, cx - 80, cy + 30);
      ctx.stroke();

      /* hepatic veins (drainage) */
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy - 10);
      ctx.lineTo(cx, cy - 80);
      ctx.stroke();
      ctx.restore();

      /* tumour */
      var tX = cx + 40;
      var tY = cy - 10;
      var tR = 16;
      var tColor;
      if (activePhase === 'ap') { tColor = '#fbbf24'; } else if (activePhase === 'pvp') { tColor = '#6b4a20'; } else if (activePhase === 'dp') { tColor = '#8b6a30'; } else { tColor = '#7a5a30'; }

      ctx.save();
      ctx.fillStyle = tColor;
      ctx.beginPath();
      ctx.arc(tX, tY, tR, 0, Math.PI * 2);
      ctx.fill();
      if (activePhase === 'dp') {
        ctx.strokeStyle = '#a78bfa';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(tX, tY, tR + 4, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      /* animated contrast particles */
      var phaseColors = { nc: 'rgba(148,163,184,0.15)', ap: '#ef4444', pvp: '#3b82f6', dp: '#8b5cf6' };
      var particleColor = phaseColors[activePhase];
      var particleCount = activePhase === 'nc' ? 5 : 30;

      ctx.save();
      for (var p = 0; p < particleCount; p++) {
        var t = (animTime + p * 0.12) % 1;
        var px, py;
        if (activePhase === 'ap') {
          px = cx - 20 + (100) * t;
          py = cy - 80 + (110) * t + Math.sin(t * 6 + p) * 8;
        } else if (activePhase === 'pvp') {
          px = cx + 15 + (-95) * t;
          py = cy - 80 + (110) * t + Math.sin(t * 5 + p) * 10;
        } else if (activePhase === 'dp') {
          px = cx + Math.sin(animTime * 2 + p * 0.8) * 80;
          py = cy + Math.cos(animTime * 2 + p * 0.8) * 50;
        } else {
          px = cx + Math.sin(animTime + p) * 50;
          py = cy + Math.cos(animTime + p) * 30;
        }
        ctx.globalAlpha = 0.6 + 0.4 * Math.sin(t * Math.PI);
        ctx.fillStyle = particleColor;
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      /* phase label */
      ctx.save();
      ctx.font = 'bold 13px Inter';
      var labels = { nc: 'Non-Contrast', ap: 'Arterial Phase', pvp: 'Portal Venous Phase', dp: 'Delayed Phase' };
      var labelColors = { nc: '#94a3b8', ap: '#ef4444', pvp: '#3b82f6', dp: '#8b5cf6' };
      ctx.fillStyle = labelColors[activePhase];
      ctx.fillText(labels[activePhase], 12, 20);
      ctx.font = '11px Inter';
      ctx.fillStyle = '#64748b';
      ctx.fillText('Contrast-enhanced multiphase liver CT simulation', 12, 36);
      ctx.restore();

      /* HU indicators */
      ctx.save();
      ctx.font = '11px Inter';
      var huData = {
        nc:  { liver: '55 HU', tumour: '45 HU' },
        ap:  { liver: '65 HU', tumour: '130 HU' },
        pvp: { liver: '110 HU', tumour: '70 HU' },
        dp:  { liver: '80 HU', tumour: '55 HU' }
      };
      ctx.fillStyle = '#fbbf24';
      ctx.fillText('Tumour: ' + huData[activePhase].tumour, W - 130, 20);
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Liver: ' + huData[activePhase].liver, W - 130, 36);
      ctx.restore();

      _animId = requestAnimationFrame(drawPhase);
    }
    drawPhase();
  }

  /* ── Theory Content ───────────────────────── */

  function populateTheory() {
    var container = document.querySelector('#module-' + moduleId + '-theory .theory-content');
    if (!container) return;

    container.innerHTML =
      '<div style="display:grid;gap:20px;">' +

      /* Contrast Media */
      '<div style="padding:20px;border-radius:12px;background:rgba(59,130,246,.06);border:1px solid rgba(59,130,246,.15);">' +
        '<h4 style="color:#60a5fa;margin-bottom:10px;">1. Contrast Media Pharmacokinetics</h4>' +
        '<p style="color:#94a3b8;line-height:1.7;">Iodinated contrast media are injected intravenously at a typical dose of <strong style="color:#e2e8f0;">1.5–2.0 mL/kg</strong> at a rate of <strong style="color:#e2e8f0;">3–5 mL/s</strong>, followed by a saline chaser. The contrast bolus travels: injection site → superior vena cava → right heart → pulmonary circulation → left heart → aorta → hepatic artery (first pass) → liver parenchyma via both hepatic artery (25%) and portal vein (75%) → hepatic veins → systemic circulation. The timing of each CT acquisition relative to this bolus determines which phase is captured.</p>' +
        '<div id="pharmacokinetics-chart" style="margin-top:12px;"></div>' +
      '</div>' +

      /* Enhancement Patterns */
      '<div style="padding:20px;border-radius:12px;background:rgba(239,68,68,.06);border:1px solid rgba(239,68,68,.15);">' +
        '<h4 style="color:#f87171;margin-bottom:10px;">2. Enhancement Patterns of HCC</h4>' +
        '<p style="color:#94a3b8;line-height:1.7;">The hallmark of HCC on multiphase CT is a characteristic temporal enhancement pattern that reflects its unique vascular physiology:</p>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin-top:12px;">' +
          '<div style="padding:14px;border-radius:8px;background:rgba(30,41,59,.6);border-left:3px solid #ef4444;"><strong style="color:#e2e8f0;">Arterial Hyperenhancement (APHE)</strong><br/><span style="color:#94a3b8;font-size:13px;">HCC receives 80% blood supply from hepatic artery → lights up brightly in arterial phase while liver is still relatively dark.</span></div>' +
          '<div style="padding:14px;border-radius:8px;background:rgba(30,41,59,.6);border-left:3px solid #3b82f6;"><strong style="color:#e2e8f0;">Washout</strong><br/><span style="color:#94a3b8;font-size:13px;">Portal venous phase: liver enhances maximally (portal blood supply) but HCC loses contrast → appears darker than surrounding liver.</span></div>' +
          '<div style="padding:14px;border-radius:8px;background:rgba(30,41,59,.6);border-left:3px solid #8b5cf6;"><strong style="color:#e2e8f0;">Capsule Appearance</strong><br/><span style="color:#94a3b8;font-size:13px;">Delayed phase: a rim of persistent enhancement around the tumour due to fibrous capsule. A key LI-RADS 5 feature.</span></div>' +
          '<div style="padding:14px;border-radius:8px;background:rgba(30,41,59,.6);border-left:3px solid #10b981;"><strong style="color:#e2e8f0;">Threshold Growth</strong><br/><span style="color:#94a3b8;font-size:13px;">≥50% size increase in ≤6 months. Measured by comparing current and prior imaging. A major LR-5 feature.</span></div>' +
        '</div>' +
      '</div>' +

      /* Timing */
      '<div style="padding:20px;border-radius:12px;background:rgba(16,185,129,.06);border:1px solid rgba(16,185,129,.15);">' +
        '<h4 style="color:#34d399;margin-bottom:10px;">3. Phase Timing &amp; Clinical Significance</h4>' +
        '<div style="overflow-x:auto;">' +
          '<table style="width:100%;border-collapse:collapse;font-size:13px;margin-top:8px;">' +
            '<thead><tr style="border-bottom:2px solid rgba(148,163,184,.2);">' +
              '<th style="padding:8px;text-align:left;color:#94a3b8;">Phase</th>' +
              '<th style="padding:8px;text-align:left;color:#94a3b8;">Timing</th>' +
              '<th style="padding:8px;text-align:left;color:#94a3b8;">Key Findings</th>' +
              '<th style="padding:8px;text-align:left;color:#94a3b8;">Clinical Use</th>' +
            '</tr></thead>' +
            '<tbody>' +
              '<tr style="border-bottom:1px solid rgba(148,163,184,.08);"><td style="padding:8px;color:#e2e8f0;">Non-Contrast</td><td style="padding:8px;color:#94a3b8;">0 sec</td><td style="padding:8px;color:#94a3b8;">Calcification, fat, haemorrhage</td><td style="padding:8px;color:#94a3b8;">Baseline comparison</td></tr>' +
              '<tr style="border-bottom:1px solid rgba(148,163,184,.08);"><td style="padding:8px;color:#ef4444;">Arterial</td><td style="padding:8px;color:#94a3b8;">20–30 sec</td><td style="padding:8px;color:#94a3b8;">APHE, hypervascular lesions</td><td style="padding:8px;color:#94a3b8;">HCC detection</td></tr>' +
              '<tr style="border-bottom:1px solid rgba(148,163,184,.08);"><td style="padding:8px;color:#3b82f6;">Portal Venous</td><td style="padding:8px;color:#94a3b8;">60–70 sec</td><td style="padding:8px;color:#94a3b8;">Washout, liver enhancement</td><td style="padding:8px;color:#94a3b8;">Lesion characterization</td></tr>' +
              '<tr><td style="padding:8px;color:#8b5cf6;">Delayed</td><td style="padding:8px;color:#94a3b8;">180–300 sec</td><td style="padding:8px;color:#94a3b8;">Capsule, persistent rim</td><td style="padding:8px;color:#94a3b8;">LR-5 confirmation</td></tr>' +
            '</tbody>' +
          '</table>' +
        '</div>' +
      '</div>' +

      '</div>';

    /* pharmacokinetics chart */
    setTimeout(function () {
      var chartEl = document.getElementById('pharmacokinetics-chart');
      if (chartEl && window.Chart) {
        var timePoints = [];
        for (var t = 0; t <= 300; t += 5) timePoints.push(t);
        var hepArtery = timePoints.map(function (t) { return 50 + 120 * Math.exp(-((t - 20) * (t - 20)) / 200); });
        var portalVein = timePoints.map(function (t) { return 50 + 90 * Math.exp(-((t - 65) * (t - 65)) / 600); });
        var liver = timePoints.map(function (t) { return 55 + 55 * (1 - Math.exp(-t / 30)) * Math.exp(-t / 200); });
        var tumour = timePoints.map(function (t) { return 45 + 90 * Math.exp(-((t - 22) * (t - 22)) / 150); });

        Components.createChart(chartEl, 'line', {
          labels: timePoints.map(function (t) { return t + 's'; }),
          datasets: [
            { label: 'Hepatic Artery', data: hepArtery, borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,.1)', fill: false, tension: 0.4, pointRadius: 0 },
            { label: 'Portal Vein', data: portalVein, borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,.1)', fill: false, tension: 0.4, pointRadius: 0 },
            { label: 'Liver Parenchyma', data: liver, borderColor: '#f97316', backgroundColor: 'rgba(249,115,22,.1)', fill: false, tension: 0.4, pointRadius: 0 },
            { label: 'HCC Tumour', data: tumour, borderColor: '#fbbf24', backgroundColor: 'rgba(251,191,36,.1)', fill: false, tension: 0.4, pointRadius: 0, borderDash: [5, 3] }
          ]
        }, {
          responsive: true,
          plugins: { legend: { labels: { color: '#94a3b8', padding: 10, font: { size: 11 } } } },
          scales: {
            x: { title: { display: true, text: 'Time (seconds)', color: '#94a3b8' }, ticks: { color: '#64748b', maxTicksLimit: 10 }, grid: { color: 'rgba(148,163,184,.06)' } },
            y: { title: { display: true, text: 'Enhancement (HU)', color: '#94a3b8' }, ticks: { color: '#64748b' }, grid: { color: 'rgba(148,163,184,.06)' } }
          },
          title: { display: true, text: 'Contrast Enhancement Curves (DCE)', color: '#e2e8f0', font: { size: 13 } }
        });
      }
    }, 100);
  }

  /* ── DCE Curve Simulation ─────────────────── */

  function initDCESimulation() {
    var container = document.querySelector('#module-' + moduleId + '-simulation .simulation-container');
    if (!container) return;

    container.innerHTML =
      '<div style="padding:16px;">' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">' +
          '<div><canvas id="sim3-canvas" style="width:100%;height:320px;background:radial-gradient(ellipse,#1e293b,#0f172a);border-radius:10px;border:1px solid rgba(59,130,246,.15);"></canvas></div>' +
          '<div id="sim3-output" style="padding:12px;display:flex;flex-direction:column;gap:8px;">' +
            '<h4 style="color:#e2e8f0;margin:0 0 4px;">DCE Enhancement Simulator</h4>' +
            '<p style="color:#94a3b8;font-size:13px;margin:0;">Adjust contrast injection parameters and observe real-time changes to the enhancement curves of hepatic artery, portal vein, liver, and tumour.</p>' +
            '<div id="sim3-peak-info" style="margin-top:auto;"></div>' +
          '</div>' +
        '</div>' +
        '<div id="sim3-controls" style="display:flex;flex-wrap:wrap;gap:16px;margin-top:16px;"></div>' +
      '</div>';

    var simCanvas = document.getElementById('sim3-canvas');
    if (!simCanvas) return;
    var sCtx = simCanvas.getContext('2d');

    var contrastDose = 1.5;
    var injRate = 3;
    var delayTime = 25;

    function resizeSim() {
      var r = simCanvas.parentElement.getBoundingClientRect();
      simCanvas.width = r.width;
      simCanvas.height = 320;
    }
    resizeSim();

    var ctrlEl = document.getElementById('sim3-controls');
    if (ctrlEl) {
      Components.createSlider(ctrlEl, { label: 'Contrast Dose (mL/kg)', min: 1, max: 2, value: 1.5, step: 0.1, onChange: function (v) { contrastDose = v; } });
      Components.createSlider(ctrlEl, { label: 'Injection Rate (mL/s)', min: 1, max: 5, value: 3, step: 0.5, onChange: function (v) { injRate = v; } });
      Components.createSlider(ctrlEl, { label: 'Arterial Delay (sec)', min: 10, max: 40, value: 25, step: 1, onChange: function (v) { delayTime = v; } });
    }

    function calcCurves() {
      var dose = contrastDose * 70;
      var tPeakHA = delayTime;
      var tPeakPV = delayTime + 40;
      var ampHA = dose * injRate * 0.3;
      var ampPV = dose * injRate * 0.22;
      var ampTumour = ampHA * 0.75;

      var timePoints = [];
      var ha = [], pv = [], liv = [], tum = [];
      for (var t = 0; t <= 300; t += 3) {
        timePoints.push(t);
        var haVal = 40 + ampHA * Math.exp(-((t - tPeakHA) * (t - tPeakHA)) / (200 + injRate * 20));
        var pvVal = 45 + ampPV * Math.exp(-((t - tPeakPV) * (t - tPeakPV)) / (500 + injRate * 30));
        var livVal = 55 + (ampPV * 0.5) * (1 - Math.exp(-t / (25 + injRate * 3))) * Math.exp(-t / 250);
        var tumVal = 42 + ampTumour * Math.exp(-((t - tPeakHA - 2) * (t - tPeakHA - 2)) / (150));

        ha.push(haVal);
        pv.push(pvVal);
        liv.push(livVal);
        tum.push(tumVal);
      }

      return { timePoints: timePoints, ha: ha, pv: pv, liv: liv, tum: tum };
    }

    function drawSim() {
      var w = simCanvas.width;
      var h = simCanvas.height;
      sCtx.clearRect(0, 0, w, h);

      var curves = calcCurves();
      var pad = { left: 50, right: 20, top: 30, bottom: 40 };
      var gW = w - pad.left - pad.right;
      var gH = h - pad.top - pad.bottom;

      var allVals = curves.ha.concat(curves.pv, curves.liv, curves.tum);
      var maxVal = Math.max.apply(null, allVals) * 1.1;
      var minVal = 0;

      /* axes */
      sCtx.strokeStyle = 'rgba(148,163,184,0.2)';
      sCtx.lineWidth = 1;
      for (var gy = 0; gy <= 4; gy++) {
        var yLine = pad.top + gH * (gy / 4);
        sCtx.beginPath();
        sCtx.moveTo(pad.left, yLine);
        sCtx.lineTo(pad.left + gW, yLine);
        sCtx.stroke();
        sCtx.font = '10px Inter';
        sCtx.fillStyle = '#64748b';
        sCtx.fillText(Math.round(maxVal - (maxVal - minVal) * gy / 4), 4, yLine + 3);
      }

      /* x labels */
      for (var gx = 0; gx <= 5; gx++) {
        var xLine = pad.left + gW * (gx / 5);
        sCtx.fillStyle = '#64748b';
        sCtx.fillText(Math.round(300 * gx / 5) + 's', xLine - 10, h - 8);
      }

      /* draw curves */
      function drawCurve(data, color) {
        sCtx.save();
        sCtx.strokeStyle = color;
        sCtx.lineWidth = 2;
        sCtx.beginPath();
        for (var i = 0; i < data.length; i++) {
          var x = pad.left + (i / (data.length - 1)) * gW;
          var y = pad.top + gH * (1 - (data[i] - minVal) / (maxVal - minVal));
          if (i === 0) sCtx.moveTo(x, y); else sCtx.lineTo(x, y);
        }
        sCtx.stroke();
        sCtx.restore();
      }

      drawCurve(curves.ha, '#ef4444');
      drawCurve(curves.pv, '#3b82f6');
      drawCurve(curves.liv, '#f97316');
      drawCurve(curves.tum, '#fbbf24');

      /* legend */
      sCtx.save();
      sCtx.font = '10px Inter';
      var legendData = [
        { label: 'Hepatic Artery', color: '#ef4444', y: pad.top + 10 },
        { label: 'Portal Vein', color: '#3b82f6', y: pad.top + 24 },
        { label: 'Liver', color: '#f97316', y: pad.top + 38 },
        { label: 'Tumour (HCC)', color: '#fbbf24', y: pad.top + 52 }
      ];
      legendData.forEach(function (l) {
        sCtx.fillStyle = l.color;
        sCtx.fillRect(w - 120, l.y - 4, 10, 10);
        sCtx.fillStyle = '#94a3b8';
        sCtx.fillText(l.label, w - 106, l.y + 5);
      });
      sCtx.restore();

      /* update metrics */
      var infoEl = document.getElementById('sim3-peak-info');
      if (infoEl) {
        var peakHA = Math.round(Math.max.apply(null, curves.ha));
        var peakPV = Math.round(Math.max.apply(null, curves.pv));
        infoEl.innerHTML =
          '<div style="padding:12px;border-radius:8px;background:rgba(30,41,59,.6);display:grid;grid-template-columns:1fr 1fr;gap:10px;">' +
            '<div style="text-align:center;"><div style="font-size:18px;font-weight:700;color:#ef4444;">' + peakHA + ' HU</div><div style="font-size:11px;color:#94a3b8;">Peak HA Enhancement</div></div>' +
            '<div style="text-align:center;"><div style="font-size:18px;font-weight:700;color:#3b82f6;">' + peakPV + ' HU</div><div style="font-size:11px;color:#94a3b8;">Peak PV Enhancement</div></div>' +
          '</div>';
      }
    }

    var lastRender = 0;
    function loop(t) {
      if (t - lastRender > 120) { drawSim(); lastRender = t; }
      _simId = requestAnimationFrame(loop);
    }
    _simId = requestAnimationFrame(loop);
  }

  /* ── Code Block ───────────────────────────── */

  function populateCode() {
    var container = document.querySelector('#module-' + moduleId + '-code .code-container');
    if (!container) return;

    var code = [
      '# Module 3: Synthetic Multiphase CT Volume Generation',
      'import numpy as np',
      'from scipy.ndimage import gaussian_filter',
      '',
      'def generate_phase_volume(size=128, phase="arterial",',
      '                          lesion_enhancement=80):',
      '    """',
      '    Create a synthetic liver CT volume for a given phase.',
      '    Returns a 3D numpy array with realistic HU values.',
      '    """',
      '    vol = np.zeros((size, size, size), dtype=np.float32)',
      '',
      '    # Liver ellipsoid',
      '    z, y, x = np.meshgrid(',
      '        np.linspace(-1, 1, size),',
      '        np.linspace(-1, 1, size),',
      '        np.linspace(-1, 1, size)',
      '    )',
      '    liver = ((x/0.85)**2 + (y/0.65)**2 + (z/0.55)**2) < 1',
      '',
      '    # Phase-dependent baseline HU',
      '    baselines = {',
      '        "non_contrast": 55,',
      '        "arterial":     65,',
      '        "portal":      110,',
      '        "delayed":      80',
      '    }',
      '    vol[liver] = baselines.get(phase, 55)',
      '',
      '    # Add lesion',
      '    lesion = ((x-0.25)**2 + (y-0.15)**2 + (z)**2) < 0.04',
      '    if phase == "arterial":',
      '        vol[lesion] = baselines["arterial"] + lesion_enhancement',
      '    elif phase == "portal":',
      '        vol[lesion] = baselines["portal"] - 30',
      '    elif phase == "delayed":',
      '        vol[lesion] = baselines["delayed"] - 20',
      '    else:',
      '        vol[lesion] = baselines["non_contrast"] - 10',
      '',
      '    # Add noise',
      '    noise = np.random.normal(0, 10, vol.shape)',
      '    vol += noise.astype(np.float32)',
      '',
      '    # Smooth to simulate scanner point-spread function',
      '    vol = gaussian_filter(vol, sigma=0.8)',
      '    return vol',
      '',
      '# Generate all four phases',
      'phases = ["non_contrast", "arterial", "portal", "delayed"]',
      'volumes = {',
      '    p: generate_phase_volume(128, p) for p in phases',
      '}',
      '',
      'for name, vol in volumes.items():',
      '    mid = vol.shape[2] // 2',
      '    liver_hu = np.mean(vol[vol > 30])',
      '    print(f"{name:>15}: mean liver = {liver_hu:.1f} HU")',
      '',
      'print("\\nVolumes ready for phase-aware 3D CNN training.")'
    ].join('\n');

    Components.createCodeBlock(container, code);
  }

  /* ── Quiz ─────────────────────────────────── */

  function populateQuiz() {
    var container = document.querySelector('#module-' + moduleId + '-quiz .quiz-container');
    if (!container) return;

    Components.createQuiz(container, [
      {
        q: 'At which phase does the liver parenchyma reach peak enhancement?',
        options: ['Non-contrast', 'Arterial phase', 'Portal venous phase', 'Delayed phase'],
        correct: 2,
        explanation: 'The portal venous phase (60–70 sec) shows peak liver parenchyma enhancement because ~75% of liver blood supply comes from the portal vein, which opacifies after the contrast passes through the GI circulation.'
      },
      {
        q: 'What is the classic enhancement pattern of HCC on multiphase CT?',
        options: [
          'Progressive enhancement from NC to delayed',
          'Arterial hyperenhancement with portal venous washout',
          'Uniform enhancement across all phases',
          'Peripheral rim enhancement with central enhancement'
        ],
        correct: 1,
        explanation: 'HCC shows arterial-phase hyperenhancement (APHE) due to its arterial blood supply, followed by washout in portal venous/delayed phases as the liver parenchyma enhances but the tumour does not.'
      },
      {
        q: 'What does the "capsule appearance" on delayed phase indicate?',
        options: ['Benign cyst', 'HCC (LI-RADS 5 feature)', 'Hemangioma', 'Fatty infiltration'],
        correct: 1,
        explanation: 'The capsule appearance — a rim of persistent enhancement on delayed phase — is one of the major LI-RADS 5 features for definite HCC diagnosis. It represents the fibrous capsule of the tumour.'
      },
      {
        q: 'What is the typical portal venous phase delay after contrast injection?',
        options: ['5–10 seconds', '20–30 seconds', '60–70 seconds', '180–300 seconds'],
        correct: 2,
        explanation: 'The portal venous phase is acquired at 60–70 seconds post-injection, allowing time for contrast to circulate through the GI tract and return to the liver via the portal vein.'
      }
    ]);
  }

  /* ── Reflection ───────────────────────────── */

  function populateReflection() {
    var container = document.querySelector('#module-' + moduleId + '-reflection .reflection-content');
    if (!container) return;

    container.innerHTML =
      '<div style="display:grid;gap:16px;">' +
        '<div style="padding:20px;border-radius:12px;background:rgba(139,92,246,.06);border:1px solid rgba(139,92,246,.15);">' +
          '<h4 style="color:#a78bfa;margin-bottom:8px;">Why Phase-Aware Analysis Matters for AI</h4>' +
          '<p style="color:#94a3b8;line-height:1.7;">Most existing AI models for LI-RADS classification treat each CT phase independently or concatenate them naively. However, the diagnostic information in multiphase CT is inherently <em>temporal</em> — the pattern of enhancement <em>change</em> across phases is what defines HCC. A model that understands phase-specific temporal dynamics should outperform one that sees each phase in isolation.</p>' +
        '</div>' +
        '<div style="padding:20px;border-radius:12px;background:rgba(59,130,246,.06);border:1px solid rgba(59,130,246,.15);">' +
          '<h4 style="color:#60a5fa;margin-bottom:8px;">The Phase Labelling Challenge</h4>' +
          '<p style="color:#94a3b8;line-height:1.7;">In clinical practice, phase timing varies between scanners, patients, and institutions. Bolus-tracking, patient cardiac output, and injection protocols all affect when each phase is actually captured. AI models must be robust to this temporal variability. Phase-aware architectures with attention mechanisms can learn to identify and weight phases automatically.</p>' +
        '</div>' +
        '<div style="padding:20px;border-radius:12px;background:rgba(16,185,129,.06);border:1px solid rgba(16,185,129,.15);">' +
          '<h4 style="color:#34d399;margin-bottom:8px;">Our Research Approach</h4>' +
          '<p style="color:#94a3b8;line-height:1.7;">In this laboratory, we will build a <strong style="color:#e2e8f0;">phase-aware 3D CNN</strong> that processes each CT phase through dedicated branches with phase-specific feature extraction, then fuses the information for final LI-RADS classification. This architecture mirrors how radiologists integrate information across phases mentally.</p>' +
        '</div>' +
      '</div>';
  }

})();
