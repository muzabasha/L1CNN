/**
 * Module 1: Clinical Background - Understanding Liver Cancer
 * Foundation knowledge about hepatocellular carcinoma, risk factors,
 * clinical presentation, and the motivation for automated classification.
 */
(function () {
  var moduleId = '1';
  var _animId = null;
  var _simId = null;

  ModuleEngine.register(moduleId, {
    init: function () {
      populateObjectives();
      init3DLiver();
      populateTheory();
      initSimulation();
      populateCode();
      populateQuiz();
      populateReflection();
    },
    destroy: function () {
      if (_animId) cancelAnimationFrame(_animId);
      if (_simId) cancelAnimationFrame(_simId);
    }
  });

  /* ── Learning Objectives ──────────────────── */

  function populateObjectives() {
    var container = document.querySelector('#module-' + moduleId + '-objectives .objectives-grid');
    if (!container) return;

    var objectives = [
      { num: 1, text: 'Understand the gross and microscopic anatomy of the liver, including its lobes, vasculature, and functional units (lobules).' },
      { num: 2, text: 'Learn about hepatocellular carcinoma (HCC) — its pathophysiology, staging, and why it is the most common primary liver malignancy.' },
      { num: 3, text: 'Identify the major risk factors for liver cancer, including chronic hepatitis B/C infection, cirrhosis, aflatoxin exposure, and alcohol use.' },
      { num: 4, text: 'Understand the radiology workflow for liver lesion detection, from initial screening ultrasound to confirmatory multiphase CT/MRI.' },
      { num: 5, text: 'Learn why automated LI-RADS classification is needed: inter-observer variability, radiologist workload, and the promise of AI-assisted diagnosis.' }
    ];

    objectives.forEach(function (o) {
      var card = document.createElement('div');
      card.className = 'objective-item';
      card.innerHTML =
        '<div class="objective-number">' + o.num + '</div>' +
        '<div class="objective-text">' + o.text + '</div>';
      container.appendChild(card);
    });
  }

  /* ── Interactive 3-D Liver Visualization ─── */

  function init3DLiver() {
    var wrapper = document.querySelector('#module-' + moduleId + '-animation .animation-container');
    if (!wrapper) return;
    wrapper.innerHTML =
      '<div style="position:relative;width:100%;min-height:520px;background:radial-gradient(ellipse at center,#0f172a 0%,#020617 100%);border-radius:12px;overflow:hidden;">' +
        '<canvas id="module1-liver-canvas" style="display:block;width:100%;height:460px;"></canvas>' +
        '<div id="liver-info-panel" style="position:absolute;top:16px;right:16px;width:220px;padding:14px;background:rgba(15,23,42,.85);backdrop-filter:blur(12px);border:1px solid rgba(59,130,246,.3);border-radius:10px;color:#e2e8f0;font-size:13px;line-height:1.5;display:none;"></div>' +
      '</div>' +
      '<div id="liver-controls" style="display:flex;flex-wrap:wrap;gap:16px;padding:16px 0;"></div>';

    var canvas = document.getElementById('module1-liver-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var W, H;
    var rotation = 0;
    var opacity = 0.85;
    var showTumor = true;
    var showVessels = true;
    var hoverRegion = null;
    var time = 0;

    function resize() {
      var rect = canvas.parentElement.getBoundingClientRect();
      W = canvas.width = rect.width * (window.devicePixelRatio || 1);
      H = canvas.height = 460 * (window.devicePixelRatio || 1);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = '460px';
      ctx.setTransform(window.devicePixelRatio || 1, 0, 0, window.devicePixelRatio || 1, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    var regions = {
      rightLobe:  { label: 'Right Lobe',   desc: 'The largest lobe (~60-65% of liver mass). Located on the right side, it performs the bulk of metabolic, synthetic, and detoxification functions. Most HCC tumours arise in the right lobe due to its larger volume and blood supply.', cx: 0, cy: 0 },
      leftLobe:   { label: 'Left Lobe',     desc: 'Smaller lobe (~30%) extending across the midline. Shares functional capacity with the right lobe. Divided into medial and segments II, III, IV per Couinaud classification.', cx: 0, cy: 0 },
      caudate:    { label: 'Caudate Lobe',   desc: 'Posterior lobe with independent blood supply from both portal vein and hepatic artery. Has direct venous drainage into the IVC, making it important in cirrhosis evaluation.', cx: 0, cy: 0 },
      tumor:      { label: 'HCC Tumour',     desc: 'Hepatocellular carcinoma — a primary liver malignancy. On CT it shows arterial-phase hyperenhancement with portal venous washout (LI-RADS 5 feature). The pulsing indicates active tumour angiogenesis.', cx: 0, cy: 0 },
      vessels:    { label: 'Hepatic Vasculature', desc: 'Dual blood supply: hepatic artery (25%, oxygenated — red) and portal vein (75%, nutrient-rich — blue). The hepatic veins drain into the IVC. Understanding vascular anatomy is critical for surgical planning.', cx: 0, cy: 0 }
    };

    /* controls */
    var ctrl = document.getElementById('liver-controls');
    if (ctrl) {
      Components.createSlider(ctrl, { label: 'Opacity', min: 20, max: 100, value: 85, step: 1, onChange: function (v) { opacity = v / 100; } });
      Components.createSlider(ctrl, { label: 'Rotation Speed', min: 0, max: 50, value: 12, step: 1, onChange: function (v) { rotSpeed = v / 500; } });
    }

    var rotSpeed = 0.012;
    var mouseX = 0, mouseY = 0;

    canvas.addEventListener('mousemove', function (e) {
      var r = canvas.getBoundingClientRect();
      mouseX = e.clientX - r.left;
      mouseY = e.clientY - r.top;
    });

    function drawLiver() {
      ctx.clearRect(0, 0, W / (window.devicePixelRatio || 1), H / (window.devicePixelRatio || 1));
      var cw = W / (window.devicePixelRatio || 1);
      var ch = H / (window.devicePixelRatio || 1);
      var cx = cw / 2;
      var cy = ch / 2 + 10;
      var scale = Math.min(cw, ch) / 520;

      rotation += rotSpeed;
      time += 0.02;
      var wobble = Math.sin(rotation * 2) * 8 * scale;

      /*肝 shadow */
      ctx.save();
      ctx.globalAlpha = 0.15;
      ctx.beginPath();
      ctx.ellipse(cx + 4, cy + 12, 160 * scale, 95 * scale, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#000';
      ctx.fill();
      ctx.restore();

      /* right lobe */
      var rX = cx + 30 * scale + wobble;
      var rY = cy;
      var rRx = 125 * scale;
      var rRy = 80 * scale;
      regions.rightLobe.cx = rX; regions.rightLobe.cy = rY;

      ctx.save();
      ctx.globalAlpha = opacity;
      var rGrad = ctx.createRadialGradient(rX - 20, rY - 20, 10, rX, rY, rRx);
      rGrad.addColorStop(0, '#b94a3a');
      rGrad.addColorStop(0.6, '#8b2e24');
      rGrad.addColorStop(1, '#5c1a15');
      ctx.fillStyle = rGrad;
      ctx.beginPath();
      ctx.ellipse(rX, rY, rRx, rRy, -0.1, 0, Math.PI * 2);
      ctx.fill();

      /* left lobe */
      var lX = cx - 100 * scale - wobble * 0.5;
      var lY = cy + 5 * scale;
      var lRx = 80 * scale;
      var lRy = 55 * scale;
      regions.leftLobe.cx = lX; regions.leftLobe.cy = lY;

      var lGrad = ctx.createRadialGradient(lX + 10, lY - 10, 5, lX, lY, lRx);
      lGrad.addColorStop(0, '#c45a48');
      lGrad.addColorStop(0.7, '#94352b');
      lGrad.addColorStop(1, '#6b2219');
      ctx.fillStyle = lGrad;
      ctx.beginPath();
      ctx.ellipse(lX, lY, lRx, lRy, 0.2, 0, Math.PI * 2);
      ctx.fill();

      /* caudate lobe */
      var cX = cx - 25 * scale;
      var cY = cy - 70 * scale;
      regions.caudate.cx = cX; regions.caudate.cy = cY;

      var cGrad = ctx.createRadialGradient(cX, cY, 3, cX, cY, 35 * scale);
      cGrad.addColorStop(0, '#a84a3a');
      cGrad.addColorStop(1, '#6b2a1e');
      ctx.fillStyle = cGrad;
      ctx.beginPath();
      ctx.ellipse(cX, cY, 35 * scale, 25 * scale, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      /* vessels */
      if (showVessels) {
        regions.vessels.cx = cx; regions.vessels.cy = cy;
        ctx.save();
        ctx.globalAlpha = opacity * 0.9;
        /* hepatic artery */
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3 * scale;
        ctx.beginPath();
        ctx.moveTo(cx - 10 * scale, cy - 100 * scale);
        ctx.bezierCurveTo(cx + 20 * scale, cy - 40 * scale, cx + 60 * scale, cy - 10 * scale, cx + 80 * scale, cy + 20 * scale);
        ctx.stroke();
        /* portal vein */
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 4 * scale;
        ctx.beginPath();
        ctx.moveTo(cx + 10 * scale, cy - 95 * scale);
        ctx.bezierCurveTo(cx - 10 * scale, cy - 30 * scale, cx - 50 * scale, cy + 10 * scale, cx - 90 * scale, cy + 30 * scale);
        ctx.stroke();
        /* branches */
        ctx.lineWidth = 1.5 * scale;
        ctx.globalAlpha = opacity * 0.5;
        for (var b = 0; b < 5; b++) {
          var bx = cx + (b * 30 - 60) * scale;
          var by = cy + (20 + Math.sin(b) * 15) * scale;
          ctx.beginPath();
          ctx.moveTo(bx, cy - 60 * scale);
          ctx.quadraticCurveTo(bx + 10 * scale, cy, bx, by + 40 * scale);
          ctx.stroke();
        }
        ctx.restore();
      }

      /* tumor */
      if (showTumor) {
        var tX = cx + 60 * scale + wobble;
        var tY = cy - 15 * scale;
        var tR = 14 * scale + Math.sin(time * 3) * 2 * scale;
        regions.tumor.cx = tX; regions.tumor.cy = tY;

        ctx.save();
        ctx.globalAlpha = opacity;
        var tGrad = ctx.createRadialGradient(tX, tY, 1, tX, tY, tR);
        tGrad.addColorStop(0, '#fbbf24');
        tGrad.addColorStop(0.5, '#f59e0b');
        tGrad.addColorStop(1, '#b45309');
        ctx.fillStyle = tGrad;
        ctx.beginPath();
        ctx.arc(tX, tY, tR, 0, Math.PI * 2);
        ctx.fill();

        /* pulsing ring */
        ctx.globalAlpha = 0.3 * (0.5 + 0.5 * Math.sin(time * 4));
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(tX, tY, tR + 6 * scale + Math.sin(time * 3) * 3 * scale, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        /* label */
        ctx.save();
        ctx.font = (11 * scale) + 'px Inter, sans-serif';
        ctx.fillStyle = '#fbbf24';
        ctx.fillText('HCC', tX + tR + 6, tY + 4);
        ctx.restore();
      }

      /* hover detection */
      hoverRegion = null;
      var keys = Object.keys(regions);
      for (var i = 0; i < keys.length; i++) {
        var r = regions[keys[i]];
        if (keys[i] === 'tumor') {
          if (Math.hypot(mouseX - r.cx, mouseY - r.cy) < 20 * scale) { hoverRegion = keys[i]; break; }
        } else if (keys[i] === 'vessels') {
          if (Math.abs(mouseX - r.cx) < 30 * scale && Math.abs(mouseY - r.cy) < 50 * scale) { hoverRegion = keys[i]; break; }
        } else {
          if (Math.abs(mouseX - r.cx) < 100 * scale && Math.abs(mouseY - r.cy) < 60 * scale) { hoverRegion = keys[i]; break; }
        }
      }

      /* cursor */
      canvas.style.cursor = hoverRegion ? 'pointer' : 'default';

      /* info panel */
      var panel = document.getElementById('liver-info-panel');
      if (panel && hoverRegion) {
        var info = regions[hoverRegion];
        panel.innerHTML = '<strong style="color:#60a5fa;font-size:14px;">' + info.label + '</strong><br/>' + info.desc;
        panel.style.display = 'block';
      } else if (panel) {
        panel.style.display = 'none';
      }

      _animId = requestAnimationFrame(drawLiver);
    }

    drawLiver();
  }

  /* ── Theory Content ───────────────────────── */

  function populateTheory() {
    var container = document.querySelector('#module-' + moduleId + '-theory .theory-content');
    if (!container) return;

    container.innerHTML =
      '<div style="display:grid;gap:20px;">' +

      /* Anatomy */
      '<div style="padding:20px;border-radius:12px;background:rgba(59,130,246,.06);border:1px solid rgba(59,130,246,.15);">' +
        '<h4 style="color:#60a5fa;margin-bottom:10px;">1. Liver Anatomy</h4>' +
        '<p style="color:#94a3b8;line-height:1.7;">The liver is the largest solid organ in the body, weighing approximately 1.4–1.6 kg in adults. It is located in the right upper quadrant of the abdomen, protected by the rib cage. The liver performs over 500 vital functions including protein synthesis, bile production, detoxification, and metabolic regulation.</p>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-top:12px;">' +
          '<div style="padding:12px;border-radius:8px;background:rgba(30,41,59,.6);border:1px solid rgba(148,163,184,.1);">' +
            '<strong style="color:#e2e8f0;">Right Lobe</strong><br/><span style="color:#94a3b8;font-size:13px;">~60–65% of liver mass. Located anteriorly and to the right. Most HCC tumours develop here.</span></div>' +
          '<div style="padding:12px;border-radius:8px;background:rgba(30,41,59,.6);border:1px solid rgba(148,163,184,.1);">' +
            '<strong style="color:#e2e8f0;">Left Lobe</strong><br/><span style="color:#94a3b8;font-size:13px;">~30%, extends across the midline. Divided into medial and lateral segments (Couinaud II–IV).</span></div>' +
          '<div style="padding:12px;border-radius:8px;background:rgba(30,41,59,.6);border:1px solid rgba(148,163,184,.1);">' +
            '<strong style="color:#e2e8f0;">Caudate Lobe</strong><br/><span style="color:#94a3b8;font-size:13px;">Segment I — receives dual blood supply and drains directly into the IVC. Enlarges in cirrhosis.</span></div>' +
          '<div style="padding:12px;border-radius:8px;background:rgba(30,41,59,.6);border:1px solid rgba(148,163,184,.1);">' +
            '<strong style="color:#e2e8f0;">Quadrate Lobe</strong><br/><span style="color:#94a3b8;font-size:13px;">Segment IVb — located on the visceral surface between the gallbladder fossa and fissure for ligamentum teres.</span></div>' +
        '</div>' +
      '</div>' +

      /* HCC */
      '<div style="padding:20px;border-radius:12px;background:rgba(239,68,68,.06);border:1px solid rgba(239,68,68,.15);">' +
        '<h4 style="color:#f87171;margin-bottom:10px;">2. Hepatocellular Carcinoma (HCC)</h4>' +
        '<p style="color:#94a3b8;line-height:1.7;">HCC is the sixth most common cancer worldwide and the third leading cause of cancer-related death. It arises primarily from hepatocytes in the setting of chronic liver disease. The classical imaging feature of HCC on multiphase CT is <strong style="color:#fbbf24;">arterial-phase hyperenhancement (APHE)</strong> with <strong style="color:#fbbf24;">portal venous or delayed-phase washout</strong>, reflecting the tumour\'s predominantly arterial blood supply.</p>' +
        '<div style="margin-top:12px;display:flex;gap:12px;flex-wrap:wrap;">' +
          '<div style="flex:1;min-width:180px;padding:12px;border-radius:8px;background:rgba(30,41,59,.6);text-align:center;">' +
            '<div style="font-size:28px;font-weight:700;color:#f87171;">924K</div><div style="font-size:12px;color:#94a3b8;">Global new cases/year</div></div>' +
          '<div style="flex:1;min-width:180px;padding:12px;border-radius:8px;background:rgba(30,41,59,.6);text-align:center;">' +
            '<div style="font-size:28px;font-weight:700;color:#f87171;">830K</div><div style="font-size:12px;color:#94a3b8;">Deaths/year (3rd cancer killer)</div></div>' +
          '<div style="flex:1;min-width:180px;padding:12px;border-radius:8px;background:rgba(30,41,59,.6);text-align:center;">' +
            '<div style="font-size:28px;font-weight:700;color:#10b981;">60–70%</div><div style="font-size:12px;color:#94a3b8;">5-year survival if caught early</div></div>' +
          '<div style="flex:1;min-width:180px;padding:12px;border-radius:8px;background:rgba(30,41,59,.6);text-align:center;">' +
            '<div style="font-size:28px;font-weight:700;color:#ef4444;">5%</div><div style="font-size:12px;color:#94a3b8;">5-year survival if diagnosed late</div></div>' +
        '</div>' +
      '</div>' +

      /* Risk Factors */
      '<div style="padding:20px;border-radius:12px;background:rgba(245,158,11,.06);border:1px solid rgba(245,158,11,.15);">' +
        '<h4 style="color:#fbbf24;margin-bottom:10px;">3. Risk Factors</h4>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin-top:8px;">' +
          '<div style="padding:14px;border-radius:8px;background:rgba(30,41,59,.6);border-left:3px solid #ef4444;"><strong style="color:#e2e8f0;">Hepatitis B (HBV)</strong><br/><span style="color:#94a3b8;font-size:13px;">Most common cause globally. 296 million chronic carriers. Integrates into hepatocyte DNA causing genomic instability.</span></div>' +
          '<div style="padding:14px;border-radius:8px;background:rgba(30,41,59,.6);border-left:3px solid #f59e0b;"><strong style="color:#e2e8f0;">Hepatitis C (HCV)</strong><br/><span style="color:#94a3b8;font-size:13px;">Leading cause in Western countries. 58 million chronic infections. Progresses via chronic inflammation → fibrosis → cirrhosis → HCC.</span></div>' +
          '<div style="padding:14px;border-radius:8px;background:rgba(30,41,59,.6);border-left:3px solid #8b5cf6;"><strong style="color:#e2e8f0;">Cirrhosis</strong><br/><span style="color:#94a3b8;font-size:13px;">Present in 80–90% of HCC patients. Any cause (viral, alcoholic, NAFLD) leads to regenerative nodules and dysplasia.</span></div>' +
          '<div style="padding:14px;border-radius:8px;background:rgba(30,41,59,.6);border-left:3px solid #06b6d4;"><strong style="color:#e2e8f0;">Alcohol &amp; NAFLD</strong><br/><span style="color:#94a3b8;font-size:13px;">Heavy alcohol use (>3 drinks/day). Non-alcoholic fatty liver disease is an emerging risk factor with rising prevalence.</span></div>' +
        '</div>' +
      '</div>' +

      /* Role of Imaging */
      '<div style="padding:20px;border-radius:12px;background:rgba(16,185,129,.06);border:1px solid rgba(16,185,129,.15);">' +
        '<h4 style="color:#34d399;margin-bottom:10px;">4. Role of Imaging in Diagnosis</h4>' +
        '<p style="color:#94a3b8;line-height:1.7;">Multiphase contrast-enhanced CT and MRI are the gold standards for HCC diagnosis. The <strong style="color:#e2e8f0;">LI-RADS (Liver Imaging Reporting and Data System)</strong> provides a standardized framework for interpreting liver lesions in patients at risk for HCC. Key imaging features include: arterial phase hyperenhancement (APHE), washout, capsule appearance, and threshold growth.</p>' +
        '<div id="module1-epi-chart" style="max-width:500px;margin:16px auto 0;"></div>' +
      '</div>' +

      '</div>';

    /* epidemiology chart */
    setTimeout(function () {
      var chartEl = document.getElementById('module1-epi-chart');
      if (chartEl) {
        Components.createChart(chartEl, 'doughnut', {
          labels: ['Asia-Pacific', 'Sub-Saharan Africa', 'Europe', 'North America', 'Other'],
          datasets: [{
            data: [75, 10, 5, 5, 5],
            backgroundColor: ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#64748b'],
            borderColor: '#0f172a',
            borderWidth: 3
          }]
        }, {
          plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', padding: 12, font: { size: 12 } } } },
          title: { display: true, text: 'Global HCC Distribution by Region (%)', color: '#e2e8f0', font: { size: 14 } }
        });
      }
    }, 100);
  }

  /* ── Tumour Growth Simulation ─────────────── */

  function initSimulation() {
    var container = document.querySelector('#module-' + moduleId + '-simulation .simulation-container');
    if (!container) return;

    container.innerHTML =
      '<div style="padding:16px;">' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">' +
          '<div><canvas id="sim1-canvas" style="width:100%;height:320px;background:radial-gradient(ellipse,#1e293b,#0f172a);border-radius:10px;border:1px solid rgba(59,130,246,.15);"></canvas></div>' +
          '<div id="sim1-data" style="padding:12px;display:flex;flex-direction:column;gap:10px;">' +
            '<h4 style="color:#e2e8f0;margin:0 0 4px;">Tumour Growth Dynamics</h4>' +
            '<div id="sim1-bars"></div>' +
            '<div id="sim1-li-rads" style="margin-top:auto;padding:14px;border-radius:10px;background:rgba(30,41,59,.6);border:1px solid rgba(148,163,184,.1);">' +
              '<div style="font-size:12px;color:#94a3b8;">Predicted LI-RADS Category</div>' +
              '<div id="sim1-lirads-value" style="font-size:22px;font-weight:700;color:#fbbf24;">LR-3 (Indeterminate)</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div id="sim1-controls" style="display:flex;flex-wrap:wrap;gap:16px;margin-top:16px;"></div>' +
      '</div>';

    var simCanvas = document.getElementById('sim1-canvas');
    if (!simCanvas) return;
    var sCtx = simCanvas.getContext('2d');
    var tumorSize = 10;
    var elapsed = 6;
    var aggressiveness = 1;

    function resizeSim() {
      var r = simCanvas.parentElement.getBoundingClientRect();
      simCanvas.width = r.width;
      simCanvas.height = 320;
    }
    resizeSim();

    var ctrlEl = document.getElementById('sim1-controls');
    if (ctrlEl) {
      Components.createSlider(ctrlEl, { label: 'Tumour Size (mm)', min: 1, max: 50, value: 10, step: 1, onChange: function (v) { tumorSize = v; } });
      Components.createSlider(ctrlEl, { label: 'Elapsed Time (months)', min: 0, max: 24, value: 6, step: 1, onChange: function (v) { elapsed = v; } });
      Components.createSlider(ctrlEl, { label: 'Aggressiveness', min: 1, max: 3, value: 1, step: 1, onChange: function (v) { aggressiveness = v; } });
    }

    function drawSim() {
      var w = simCanvas.width;
      var h = simCanvas.height;
      sCtx.clearRect(0, 0, w, h);

      var cx = w / 2;
      var cy = h / 2;

      /* liver cross-section */
      sCtx.save();
      var lGrad = sCtx.createRadialGradient(cx, cy, 10, cx, cy, 120);
      lGrad.addColorStop(0, '#8b2e24');
      lGrad.addColorStop(1, '#4a1a12');
      sCtx.fillStyle = lGrad;
      sCtx.beginPath();
      sCtx.ellipse(cx, cy, 130, 90, 0, 0, Math.PI * 2);
      sCtx.fill();
      sCtx.restore();

      /* tumor */
      var effSize = tumorSize * (1 + (aggressiveness - 1) * 0.3) * (1 + elapsed * 0.05);
      var rPx = Math.min(effSize * 2.5, 80);

      sCtx.save();
      var tGrad = sCtx.createRadialGradient(cx + 20, cy - 10, 1, cx + 20, cy - 10, rPx);
      tGrad.addColorStop(0, '#fbbf24');
      tGrad.addColorStop(0.6, '#b45309');
      tGrad.addColorStop(1, 'rgba(180,83,9,0)');
      sCtx.fillStyle = tGrad;
      sCtx.beginPath();
      sCtx.arc(cx + 20, cy - 10, rPx, 0, Math.PI * 2);
      sCtx.fill();

      /* border */
      sCtx.strokeStyle = '#f59e0b';
      sCtx.lineWidth = 2;
      sCtx.setLineDash([4, 4]);
      sCtx.stroke();
      sCtx.setLineDash([]);
      sCtx.restore();

      /* labels */
      sCtx.font = '12px Inter, sans-serif';
      sCtx.fillStyle = '#fbbf24';
      sCtx.fillText('Tumour: ' + effSize.toFixed(1) + ' mm', cx + 20 + rPx + 8, cy - 10);
      sCtx.fillStyle = '#94a3b8';
      sCtx.fillText('Liver parenchyma', cx - 60, cy + 60);

      /* grid */
      sCtx.strokeStyle = 'rgba(148,163,184,0.08)';
      sCtx.lineWidth = 1;
      for (var gx = 0; gx < w; gx += 30) { sCtx.beginPath(); sCtx.moveTo(gx, 0); sCtx.lineTo(gx, h); sCtx.stroke(); }
      for (var gy = 0; gy < h; gy += 30) { sCtx.beginPath(); sCtx.moveTo(0, gy); sCtx.lineTo(w, gy); sCtx.stroke(); }

      /* update side panel */
      var barsEl = document.getElementById('sim1-bars');
      if (barsEl) {
        var detProb = Math.min(100, Math.round(effSize * 2.2));
        var riskPct = Math.min(100, Math.round(effSize * 1.8 + aggressiveness * 10));
        barsEl.innerHTML =
          buildBar('Detection Probability', detProb, detProb > 70 ? '#10b981' : detProb > 40 ? '#f59e0b' : '#ef4444') +
          buildBar('Malignancy Risk', riskPct, riskPct > 60 ? '#ef4444' : '#f59e0b') +
          buildBar('Tumour Size', Math.round(effSize), '#3b82f6');
      }

      /* LI-RADS */
      var lrEl = document.getElementById('sim1-lirads-value');
      if (lrEl) {
        if (effSize < 10) { lrEl.textContent = 'LR-3 (Indeterminate)'; lrEl.style.color = '#fbbf24'; }
        else if (effSize < 20) { lrEl.textContent = 'LR-4 (Probably HCC)'; lrEl.style.color = '#f97316'; }
        else { lrEl.textContent = 'LR-5 (Definite HCC)'; lrEl.style.color = '#ef4444'; }
      }

      _simId = requestAnimationFrame(drawSim);
    }

    function buildBar(label, val, color) {
      return '<div style="margin:4px 0;">' +
        '<div style="display:flex;justify-content:space-between;font-size:12px;color:#94a3b8;"><span>' + label + '</span><span>' + val + '%</span></div>' +
        '<div style="width:100%;height:6px;background:rgba(148,163,184,.1);border-radius:3px;overflow:hidden;">' +
        '<div style="width:' + val + '%;height:100%;background:' + color + ';border-radius:3px;transition:width .4s;"></div></div></div>';
    }

    drawSim();
  }

  /* ── Code Block ───────────────────────────── */

  function populateCode() {
    var container = document.querySelector('#module-' + moduleId + '-code .code-container');
    if (!container) return;

    var code = [
      '# Module 1: Liver Anatomy & Synthetic Tumour Generation',
      'import numpy as np',
      'import matplotlib.pyplot as plt',
      'from mpl_toolkits.mplot3d import Axes3D',
      '',
      'def create_synthetic_liver(size=128):',
      '    """Generate a 3D synthetic liver volume."""',
      '    x, y, z = np.meshgrid(',
      '        np.linspace(-1, 1, size),',
      '        np.linspace(-1, 1, size),',
      '        np.linspace(-1, 1, size)',
      '    )',
      '    # Ellipsoidal shape with right lobe larger',
      '    liver = ((x / 0.8)**2 + (y / 0.6)**2 + (z / 0.5)**2) < 1',
      '    return liver.astype(np.float32)',
      '',
      'def add_tumor(volume, center, radius, label=2):',
      '    """Add a spherical tumour at given centre & radius."""',
      '    x, y, z = np.meshgrid(',
      '        np.linspace(-1, 1, volume.shape[0]),',
      '        np.linspace(-1, 1, volume.shape[1]),',
      '        np.linspace(-1, 1, volume.shape[2])',
      '    )',
      '    tumour = ((x - center[0])**2 + (y - center[1])**2 +',
      '              (z - center[2])**2) < radius**2',
      '    volume[tumour] = label',
      '    return volume',
      '',
      '# Create synthetic liver with tumour',
      'liver = create_synthetic_liver(128)',
      'liver = add_tumor(liver, center=(0.2, 0.1, 0), radius=0.1)',
      '',
      '# Visualise',
      'fig = plt.figure(figsize=(10, 5))',
      'ax1 = fig.add_subplot(121, projection="3d")',
      'ax1.set_title("Liver with Tumour")',
      'ax2 = fig.add_subplot(122)',
      'mid = liver.shape[2] // 2',
      'ax2.imshow(liver[:, :, mid], cmap="hot")',
      'ax2.set_title(f"Cross-section (slice {mid})")',
      'plt.tight_layout()',
      'plt.show()',
      '',
      'print(f"Liver voxels:  {np.sum(liver > 0):,}")',
      'print(f"Tumour voxels: {np.sum(liver == 2):,}")',
      'print(f"Tumour ratio:  {np.sum(liver == 2) / np.sum(liver > 0) * 100:.1f}%")'
    ].join('\n');

    Components.createCodeBlock(container, code);
  }

  /* ── Quiz ─────────────────────────────────── */

  function populateQuiz() {
    var container = document.querySelector('#module-' + moduleId + '-quiz .quiz-container');
    if (!container) return;

    Components.createQuiz(container, [
      {
        q: 'Which is the largest lobe of the liver?',
        options: ['Right lobe', 'Left lobe', 'Caudate lobe', 'Quadrate lobe'],
        correct: 0,
        explanation: 'The right lobe comprises approximately 60–65% of the total liver mass and is the most common site for HCC development.'
      },
      {
        q: 'Which viral hepatitis is most commonly associated with HCC worldwide?',
        options: ['Hepatitis A', 'Hepatitis B', 'Hepatitis D', 'Hepatitis E'],
        correct: 1,
        explanation: 'Hepatitis B is the most common cause of HCC globally, especially in endemic regions of Asia and Sub-Saharan Africa, with 296 million chronic carriers worldwide.'
      },
      {
        q: 'What is the approximate 5-year survival rate for early-stage HCC?',
        options: ['5–10%', '20–30%', '40–50%', '60–70%'],
        correct: 3,
        explanation: 'Early detection and treatment can achieve 60–70% five-year survival, compared to only ~5% for late-stage diagnosis. This underscores the critical importance of screening.'
      },
      {
        q: 'What is the classic imaging feature of HCC on multiphase CT?',
        options: [
          'Uniform enhancement in all phases',
          'Arterial hyperenhancement with portal venous washout',
          'Progressive centripetal enhancement',
          'Peripheral rim enhancement only'
        ],
        correct: 1,
        explanation: 'The hallmark of HCC is arterial-phase hyperenhancement (APHE) with washout on portal venous or delayed phases, reflecting the tumour\'s predominantly arterial blood supply.'
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
          '<h4 style="color:#a78bfa;margin-bottom:8px;">Research Motivation</h4>' +
          '<p style="color:#94a3b8;line-height:1.7;">The accurate classification of liver lesions is one of the most challenging tasks in abdominal radiology. Inter-observer agreement among radiologists for LI-RADS classification is only moderate (κ ≈ 0.54–0.68), with significant variability between general radiologists and subspecialty-trained abdominal radiologists.</p>' +
        '</div>' +
        '<div style="padding:20px;border-radius:12px;background:rgba(59,130,246,.06);border:1px solid rgba(59,130,246,.15);">' +
          '<h4 style="color:#60a5fa;margin-bottom:8px;">Why Automate LI-RADS Classification?</h4>' +
          '<p style="color:#94a3b8;line-height:1.7;">Automated classification can: (1) reduce diagnostic variability, (2) serve as a second-reader to catch missed lesions, (3) provide quantitative measurements that are more reproducible than visual assessment, and (4) help resource-limited settings where subspecialty radiologists are scarce.</p>' +
        '</div>' +
        '<div style="padding:20px;border-radius:12px;background:rgba(16,185,129,.06);border:1px solid rgba(16,185,129,.15);">' +
          '<h4 style="color:#34d399;margin-bottom:8px;">Looking Ahead</h4>' +
          '<p style="color:#94a3b8;line-height:1.7;">In the modules that follow, we will explore how CT imaging works, understand multiphase acquisition, master the LI-RADS criteria, and then build AI models that can automatically classify liver lesions. Each module builds on this clinical foundation.</p>' +
        '</div>' +
      '</div>';
  }

})();
