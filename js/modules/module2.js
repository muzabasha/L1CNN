/**
 * Module 2: Understanding CT Imaging
 * Principles of computed tomography, Hounsfield units, reconstruction
 * algorithms, acquisition parameters, and their impact on image quality.
 */
(function () {
  var moduleId = '2';
  var _animId = null;
  var _simId = null;

  ModuleEngine.register(moduleId, {
    init: function (container) {
      container.innerHTML =
        '<div id="module-2-objectives"><div class="objectives-grid"></div></div>' +
        '<div id="module-2-animation"><div class="animation-container"></div></div>' +
        '<div id="module-2-theory"><div class="theory-content"></div></div>' +
        '<div id="module-2-simulation"><div class="simulation-container"></div></div>' +
        '<div id="module-2-code"><div class="code-container"></div></div>' +
        '<div id="module-2-quiz"><div class="quiz-container"></div></div>' +
        '<div id="module-2-reflection"><div class="reflection-content"></div></div>';
      populateObjectives();
      initCTScannerAnimation();
      populateTheory();
      initCTSimulation();
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
      { num: 1, text: 'Understand the fundamental physics of X-ray production and attenuation that underpin CT imaging, including the Beer-Lambert law.' },
      { num: 2, text: 'Learn how Hounsfield Units (HU) quantify tissue density and how different tissues appear on CT images.' },
      { num: 3, text: 'Understand CT image reconstruction methods: filtered back projection (FBP) and iterative reconstruction (IR).' },
      { num: 4, text: 'Identify how acquisition parameters (kVp, mAs, slice thickness, reconstruction kernel) affect image quality and radiation dose.' },
      { num: 5, text: 'Recognize common CT artefacts (beam hardening, motion, ring) and strategies to minimize them in liver imaging.' }
    ];

    items.forEach(function (o) {
      var card = document.createElement('div');
      card.className = 'objective-item';
      card.innerHTML = '<div class="objective-number">' + o.num + '</div><div class="objective-text">' + o.text + '</div>';
      container.appendChild(card);
    });
  }

  /* ── Interactive CT Scanner Animation ─────── */

  function initCTScannerAnimation() {
    var wrapper = document.querySelector('#module-' + moduleId + '-animation .animation-container');
    if (!wrapper) return;
    wrapper.innerHTML =
      '<div style="position:relative;width:100%;min-height:500px;background:radial-gradient(ellipse at center,#0f172a 0%,#020617 100%);border-radius:12px;overflow:hidden;">' +
        '<canvas id="ct-scanner-canvas" style="display:block;width:100%;height:440px;"></canvas>' +
      '</div>' +
      '<div id="ct-anim-controls" style="display:flex;flex-wrap:wrap;gap:16px;padding:16px 0;"></div>';

    var canvas = document.getElementById('ct-scanner-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var W, H, angle = 0, beamWidth = 0.4, showDetectors = true;
    var gantrySpeed = 0.015;

    function resize() {
      var r = canvas.parentElement.getBoundingClientRect();
      W = canvas.width = r.width;
      H = canvas.height = 440;
    }
    resize();
    var _resizeHandler = resize;
    window.addEventListener('resize', _resizeHandler);

    var ctrl = document.getElementById('ct-anim-controls');
    if (ctrl) {
      Components.createSlider(ctrl, { label: 'Gantry Speed', min: 1, max: 50, value: 15, step: 1, onChange: function (v) { gantrySpeed = v / 1000; } });
      Components.createSlider(ctrl, { label: 'Beam Width', min: 10, max: 80, value: 40, step: 1, onChange: function (v) { beamWidth = v / 100; } });
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      var cx = W / 2;
      var cy = H / 2;
      var R = Math.min(W, H) * 0.36;

      angle += gantrySpeed;

      /* gantry ring */
      ctx.save();
      ctx.strokeStyle = 'rgba(59,130,246,0.25)';
      ctx.lineWidth = 18;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(96,165,250,0.12)';
      ctx.lineWidth = 22;
      ctx.beginPath();
      ctx.arc(cx, cy, R + 14, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      /* patient (bed) */
      ctx.save();
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(cx - R * 0.45, cy + R * 0.55, R * 0.9, 8);
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.ellipse(cx, cy + R * 0.45, R * 0.22, R * 0.18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(148,163,184,0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      /* cross-section inside patient */
      ctx.save();
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = '#7c2d12';
      ctx.beginPath();
      ctx.ellipse(cx, cy + R * 0.45, R * 0.16, R * 0.12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      /* x-ray source */
      var srcX = cx + R * Math.cos(angle);
      var srcY = cy + R * Math.sin(angle);
      ctx.save();
      ctx.fillStyle = '#ef4444';
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(srcX, srcY, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.font = '11px Inter';
      ctx.fillStyle = '#fca5a5';
      ctx.fillText('X-ray Source', srcX + 12, srcY - 10);
      ctx.restore();

      /* beam cone */
      ctx.save();
      var bHalf = beamWidth;
      ctx.globalAlpha = 0.12;
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(srcX, srcY);
      ctx.lineTo(cx + R * Math.cos(angle - bHalf), cy + R * Math.sin(angle - bHalf));
      ctx.lineTo(cx + R * Math.cos(angle + bHalf), cy + R * Math.sin(angle + bHalf));
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      /* detectors (arc opposite to source) */
      if (showDetectors) {
        var detStart = angle + Math.PI - beamWidth * 1.5;
        var detEnd = angle + Math.PI + beamWidth * 1.5;
        ctx.save();
        for (var d = detStart; d <= detEnd; d += 0.06) {
          var dx = cx + (R + 6) * Math.cos(d);
          var dy = cy + (R + 6) * Math.sin(d);
          var distFromCenter = Math.hypot(dx - cx, dy - cy);
          var brightness = (140 + Math.sin(angle - d) * 60);
          ctx.fillStyle = 'rgba(34,211,238,' + (brightness / 255) + ')';
          ctx.fillRect(dx - 2, dy - 2, 4, 4);
        }
        ctx.font = '11px Inter';
        ctx.fillStyle = '#67e8f9';
        var detLabelX = cx + (R + 24) * Math.cos(angle + Math.PI);
        var detLabelY = cy + (R + 24) * Math.sin(angle + Math.PI);
        ctx.fillText('Detectors', detLabelX - 25, detLabelY);
        ctx.restore();
      }

      /* label */
      ctx.save();
      ctx.font = '13px Inter';
      ctx.fillStyle = '#64748b';
      ctx.fillText('CT Gantry — Cross-Sectional View', 12, 24);
      ctx.fillText('X-ray tube rotates ' + Math.round(angle * 180 / Math.PI % 360) + '° around patient', 12, 42);
      ctx.restore();

      _animId = requestAnimationFrame(draw);
    }
    draw();
  }

  /* ── Theory Content ───────────────────────── */

  function populateTheory() {
    var container = document.querySelector('#module-' + moduleId + '-theory .theory-content');
    if (!container) return;

    container.innerHTML =
      '<div style="display:grid;gap:20px;">' +

      /* X-ray Physics */
      '<div style="padding:20px;border-radius:12px;background:rgba(59,130,246,.06);border:1px solid rgba(59,130,246,.15);">' +
        '<h4 style="color:#60a5fa;margin-bottom:10px;">1. X-ray Physics &amp; Attenuation</h4>' +
        '<p style="color:#94a3b8;line-height:1.7;">CT imaging is based on the attenuation of X-rays as they pass through tissue. The Beer-Lambert law describes this: <code>I = I₀ · e<sup>−μx</sup></code>, where I₀ is the incident intensity, μ is the linear attenuation coefficient (tissue-dependent), and x is the path length. Three physical processes contribute: <strong style="color:#e2e8f0;">photoelectric absorption</strong> (dominant at low energies, Z-dependent), <strong style="color:#e2e8f0;">Compton scattering</strong> (dominant at diagnostic energies, electron-density dependent), and <strong style="color:#e2e8f0;">pair production</strong> (relevant only above 1.022 MeV, not in diagnostic CT).</p>' +
      '</div>' +

      /* Hounsfield Units */
      '<div style="padding:20px;border-radius:12px;background:rgba(16,185,129,.06);border:1px solid rgba(16,185,129,.15);">' +
        '<h4 style="color:#34d399;margin-bottom:10px;">2. Hounsfield Units (HU)</h4>' +
        '<p style="color:#94a3b8;line-height:1.7;">The Hounsfield scale normalizes attenuation values to water (0 HU) and air (−1000 HU):</p>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;margin-top:12px;">' +
          '<div style="text-align:center;padding:12px;border-radius:8px;background:rgba(30,41,59,.6);"><div style="font-size:24px;font-weight:700;color:#94a3b8;">−1000</div><div style="font-size:12px;color:#64748b;">Air</div></div>' +
          '<div style="text-align:center;padding:12px;border-radius:8px;background:rgba(30,41,59,.6);"><div style="font-size:24px;font-weight:700;color:#60a5fa;">−100 to −50</div><div style="font-size:12px;color:#64748b;">Fat</div></div>' +
          '<div style="text-align:center;padding:12px;border-radius:8px;background:rgba(30,41,59,.6);"><div style="font-size:24px;font-weight:700;color:#fbbf24;">0</div><div style="font-size:12px;color:#64748b;">Water</div></div>' +
          '<div style="text-align:center;padding:12px;border-radius:8px;background:rgba(30,41,59,.6);"><div style="font-size:24px;font-weight:700;color:#f97316;">+40 to +60</div><div style="font-size:12px;color:#64748b;">Liver</div></div>' +
          '<div style="text-align:center;padding:12px;border-radius:8px;background:rgba(30,41,59,.6);"><div style="font-size:24px;font-weight:700;color:#ef4444;">+70 to +140</div><div style="font-size:12px;color:#64748b;">Bone</div></div>' +
        '</div>' +
      '</div>' +

      /* Reconstruction */
      '<div style="padding:20px;border-radius:12px;background:rgba(139,92,246,.06);border:1px solid rgba(139,92,246,.15);">' +
        '<h4 style="color:#a78bfa;margin-bottom:10px;">3. Image Reconstruction</h4>' +
        '<p style="color:#94a3b8;line-height:1.7;">CT reconstruction converts raw projection data (sinograms) into cross-sectional images. Two main approaches:</p>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px;">' +
          '<div style="padding:14px;border-radius:8px;background:rgba(30,41,59,.6);border-left:3px solid #60a5fa;"><strong style="color:#e2e8f0;">Filtered Back Projection (FBP)</strong><br/><span style="color:#94a3b8;font-size:13px;">Analytical, fast (~1 sec). Applies ramp filter to projections then back-projects. Can produce noise and streak artefacts at low dose.</span></div>' +
          '<div style="padding:14px;border-radius:8px;background:rgba(30,41,59,.6);border-left:3px solid #10b981;"><strong style="color:#e2e8f0;">Iterative Reconstruction (IR)</strong><br/><span style="color:#94a3b8;font-size:13px;">Model-based, slower. Iteratively optimises image to match projections while applying noise models. Reduces dose by 30–50%.</span></div>' +
        '</div>' +
      '</div>' +

      /* Parameters */
      '<div style="padding:20px;border-radius:12px;background:rgba(245,158,11,.06);border:1px solid rgba(245,158,11,.15);">' +
        '<h4 style="color:#fbbf24;margin-bottom:10px;">4. Acquisition Parameters</h4>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin-top:8px;">' +
          '<div style="padding:14px;border-radius:8px;background:rgba(30,41,59,.6);border-left:3px solid #f59e0b;"><strong style="color:#e2e8f0;">kVp (kV peak)</strong><br/><span style="color:#94a3b8;font-size:13px;">Controls X-ray energy/penetration. 120 kVp standard; 100 kVp for contrast studies (improves iodine signal). Lower kVp = more noise but better contrast.</span></div>' +
          '<div style="padding:14px;border-radius:8px;background:rgba(30,41,59,.6);border-left:3px solid #f59e0b;"><strong style="color:#e2e8f0;">mAs (milliampere-seconds)</strong><br/><span style="color:#94a3b8;font-size:13px;">Controls photon quantity (tube current × exposure time). Higher mAs = less noise but higher dose. Dose ∝ mAs linearly.</span></div>' +
          '<div style="padding:14px;border-radius:8px;background:rgba(30,41,59,.6);border-left:3px solid #f59e0b;"><strong style="color:#e2e8f0;">Slice Thickness</strong><br/><span style="color:#94a3b8;font-size:13px;">Thinner slices = better z-resolution, less partial-volume artefact, but more noise. Typical: 1–5 mm for liver CT.</span></div>' +
          '<div style="padding:14px;border-radius:8px;background:rgba(30,41,59,.6);border-left:3px solid #f59e0b;"><strong style="color:#e2e8f0;">Reconstruction Kernel</strong><br/><span style="color:#94a3b8;font-size:13px;">"Soft tissue" kernel for smooth images; "bone" or "sharp" kernel for edge detail. Kernel choice affects noise texture and spatial resolution.</span></div>' +
        '</div>' +
      '</div>' +

      /* Artifacts */
      '<div style="padding:20px;border-radius:12px;background:rgba(239,68,68,.06);border:1px solid rgba(239,68,68,.15);">' +
        '<h4 style="color:#f87171;margin-bottom:10px;">5. Common CT Artifacts</h4>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin-top:8px;">' +
          '<div style="padding:12px;border-radius:8px;background:rgba(30,41,59,.6);"><strong style="color:#e2e8f0;">Beam Hardening</strong><br/><span style="color:#94a3b8;font-size:13px;">Polychromatic X-rays harden as low-energy photons are preferentially absorbed. Causes dark streaks between dense structures (e.g. spine to ribs).</span></div>' +
          '<div style="padding:12px;border-radius:8px;background:rgba(30,41,59,.6);"><strong style="color:#e2e8f0;">Motion Artefacts</strong><br/><span style="color:#94a3b8;font-size:13px;">Patient breathing or cardiac motion causes blurring, ghosting, and misregistration. Breath-hold protocols and gating mitigate this.</span></div>' +
          '<div style="padding:12px;border-radius:8px;background:rgba(30,41,59,.6);"><strong style="color:#e2e8f0;">Ring Artefacts</strong><br/><span style="color:#94a3b8;font-size:13px;">Caused by miscalibrated or faulty detector elements. Appears as concentric rings. Corrected by detector calibration and software correction.</span></div>' +
          '<div style="padding:12px;border-radius:8px;background:rgba(30,41,59,.6);"><strong style="color:#e2e8f0;">Partial Volume</strong><br/><span style="color:#94a3b8;font-size:13px;">Thick slices average different tissues within a voxel. Can obscure small lesions or create false low-density areas. Thinner slices reduce this effect.</span></div>' +
        '</div>' +
      '</div>' +

      '</div>';
  }

  /* ── Interactive CT Simulation ────────────── */

  function initCTSimulation() {
    var container = document.querySelector('#module-' + moduleId + '-simulation .simulation-container');
    if (!container) return;

    container.innerHTML =
      '<div style="padding:16px;">' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">' +
          '<div><canvas id="sim2-canvas" style="width:100%;height:320px;background:#0a0e1a;border-radius:10px;border:1px solid rgba(59,130,246,.15);"></canvas></div>' +
          '<div id="sim2-output" style="padding:12px;display:flex;flex-direction:column;gap:8px;">' +
            '<h4 style="color:#e2e8f0;margin:0 0 4px;">CT Image Quality Simulator</h4>' +
            '<p style="color:#94a3b8;font-size:13px;margin:0;">Adjust parameters below to observe their effect on image quality. The simulated CT slice shows a liver cross-section with a small lesion.</p>' +
            '<div id="sim2-metrics" style="margin-top:auto;"></div>' +
          '</div>' +
        '</div>' +
        '<div id="sim2-controls" style="display:flex;flex-wrap:wrap;gap:16px;margin-top:16px;"></div>' +
      '</div>';

    var simCanvas = document.getElementById('sim2-canvas');
    if (!simCanvas) return;
    var sCtx = simCanvas.getContext('2d');

    var kVp = 120, mAs = 200, sliceThk = 3, kernel = 0;

    function resizeSim() {
      var r = simCanvas.parentElement.getBoundingClientRect();
      simCanvas.width = r.width;
      simCanvas.height = 320;
    }
    resizeSim();

    var ctrlEl = document.getElementById('sim2-controls');
    if (ctrlEl) {
      Components.createSlider(ctrlEl, { label: 'kVp (kV peak)', min: 70, max: 140, value: 120, step: 10, onChange: function (v) { kVp = v; } });
      Components.createSlider(ctrlEl, { label: 'mAs', min: 50, max: 400, value: 200, step: 10, onChange: function (v) { mAs = v; } });
      Components.createSlider(ctrlEl, { label: 'Slice Thickness (mm)', min: 1, max: 5, value: 3, step: 0.5, onChange: function (v) { sliceThk = v; } });
    }

    function renderSim() {
      var w = simCanvas.width;
      var h = simCanvas.height;
      sCtx.clearRect(0, 0, w, h);

      var cx = w / 2;
      var cy = h / 2;
      var R = Math.min(w, h) * 0.35;

      /* noise level inversely proportional to sqrt(mAs) and proportional to 1/sqrt(kVp) */
      var noiseLevel = Math.max(0, 180 / Math.sqrt(mAs) * (120 / kVp) * (5 / sliceThk));

      /* liver ellipse */
      sCtx.save();
      sCtx.fillStyle = '#4a3520';
      sCtx.beginPath();
      sCtx.ellipse(cx, cy, R * 1.1, R * 0.75, 0, 0, Math.PI * 2);
      sCtx.fill();
      sCtx.restore();

      /* lesion */
      sCtx.save();
      sCtx.fillStyle = '#6b5030';
      sCtx.beginPath();
      sCtx.arc(cx + R * 0.3, cy - R * 0.15, R * 0.12, 0, Math.PI * 2);
      sCtx.fill();
      sCtx.restore();

      /* simulated noise overlay */
      if (noiseLevel > 1) {
        var imgData = sCtx.getImageData(0, 0, w, h);
        var data = imgData.data;
        for (var i = 0; i < data.length; i += 16) {
          var noise = (Math.random() - 0.5) * noiseLevel * 2;
          data[i] = Math.max(0, Math.min(255, data[i] + noise));
          data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
          data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
        }
        sCtx.putImageData(imgData, 0, 0);
      }

      /* edge enhancement for sharp kernel */
      if (kernel > 0) {
        sCtx.save();
        sCtx.strokeStyle = 'rgba(148,163,184,' + (0.05 * kernel) + ')';
        sCtx.lineWidth = 1;
        sCtx.beginPath();
        sCtx.ellipse(cx, cy, R * 1.1, R * 0.75, 0, 0, Math.PI * 2);
        sCtx.stroke();
        sCtx.beginPath();
        sCtx.arc(cx + R * 0.3, cy - R * 0.15, R * 0.12, 0, Math.PI * 2);
        sCtx.stroke();
        sCtx.restore();
      }

      /* labels */
      sCtx.save();
      sCtx.font = '11px Inter';
      sCtx.fillStyle = 'rgba(148,163,184,0.7)';
      sCtx.fillText('Liver', cx - 15, cy + 4);
      sCtx.fillStyle = '#fbbf24';
      sCtx.fillText('Lesion', cx + R * 0.3 - 15, cy - R * 0.15 - 8);
      sCtx.fillStyle = '#475569';
      sCtx.fillText('Noise: ' + noiseLevel.toFixed(1) + ' HU (σ)', 10, 20);
      sCtx.fillText('kVp: ' + kVp + '  mAs: ' + mAs + '  Slice: ' + sliceThk + ' mm', 10, 36);
      sCtx.restore();

      /* metrics */
      var metricsEl = document.getElementById('sim2-metrics');
      if (metricsEl) {
        var snr = Math.round(40 + mAs * 0.15 + kVp * 0.1 - sliceThk * 2);
        var dose = Math.round(mAs * kVp * 0.005);
        var spatialRes = kernel > 0 ? 'High' : 'Standard';
        metricsEl.innerHTML =
          '<div style="padding:12px;border-radius:8px;background:rgba(30,41,59,.6);display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;">' +
            '<div style="text-align:center;"><div style="font-size:20px;font-weight:700;color:#10b981;">' + snr + '</div><div style="font-size:11px;color:#94a3b8;">SNR (dB)</div></div>' +
            '<div style="text-align:center;"><div style="font-size:20px;font-weight:700;color:#f59e0b;">' + dose + '</div><div style="font-size:11px;color:#94a3b8;">Rel. Dose</div></div>' +
            '<div style="text-align:center;"><div style="font-size:20px;font-weight:700;color:#3b82f6;">' + spatialRes + '</div><div style="font-size:11px;color:#94a3b8;">Resolution</div></div>' +
          '</div>';
      }
    }

    /* render loop (throttled) */
    var lastRender = 0;
    function loop(t) {
      if (t - lastRender > 100) { renderSim(); lastRender = t; }
      _simId = requestAnimationFrame(loop);
    }
    _simId = requestAnimationFrame(loop);
  }

  /* ── Code Block ───────────────────────────── */

  function populateCode() {
    var container = document.querySelector('#module-' + moduleId + '-code .code-container');
    if (!container) return;

    var code = [
      '# Module 2: Synthetic CT Image Generation',
      'import numpy as np',
      'import matplotlib.pyplot as plt',
      '',
      'def simulate_ct_slice(liver_hu=55, lesion_hu=None,',
      '                      noise_sigma=15, size=256):',
      '    """Simulate an axial CT slice of the liver."""',
      '    img = np.zeros((size, size), dtype=np.float32)',
      '',
      '    # Create liver ellipse',
      '    y, x = np.ogrid[:size, :size]',
      '    cx, cy = size // 2, size // 2',
      '    rx, ry = size * 0.4, size * 0.3',
      '    liver_mask = ((x - cx)/rx)**2 + ((y - cy)/ry)**2 < 1',
      '    img[liver_mask] = liver_hu',
      '',
      '    # Add lesion if specified',
      '    if lesion_hu is not None:',
      '        lx, ly = cx + int(rx * 0.4), cy - int(ry * 0.2)',
      '        lr = size // 12',
      '        lesion_mask = ((x - lx)**2 + (y - ly)**2) < lr**2',
      '        img[lesion_mask] = lesion_hu',
      '',
      '    # Add Gaussian noise',
      '    noise = np.random.normal(0, noise_sigma, img.shape)',
      '    img += noise',
      '',
      '    # Clip to HU range',
      '    img = np.clip(img, -1000, 3000)',
      '    return img',
      '',
      '# Generate images with different noise levels',
      'fig, axes = plt.subplots(1, 3, figsize=(14, 4))',
      'sigmas = [5, 15, 40]  # Low, medium, high noise',
      'titles = ["Low Noise (σ=5)", "Medium (σ=15)", "High Noise (σ=40)"]',
      '',
      'for ax, sigma, title in zip(axes, sigmas, titles):',
      '    img = simulate_ct_slice(',
      '        liver_hu=55, lesion_hu=38,',
      '        noise_sigma=sigma, size=256',
      '    )',
      '    ax.imshow(img, cmap="gray", vmin=-20, vmax=100)',
      '    ax.set_title(title)',
      '    ax.axis("off")',
      '',
      'plt.suptitle("Effect of Noise on Liver CT Appearance")',
      'plt.tight_layout()',
      'plt.show()',
      '',
      '# HU Statistics',
      'print(f"Mean liver HU: {np.mean(img[liver_mask]):.1f}")',
      'print(f"Mean lesion HU: {np.mean(img[lesion_mask]):.1f}")',
      'print(f"Contrast (liver-lesion): {liver_hu - lesion_hu} HU")'
    ].join('\n');

    Components.createCodeBlock(container, code);
  }

  /* ── Quiz ─────────────────────────────────── */

  function populateQuiz() {
    var container = document.querySelector('#module-' + moduleId + '-quiz .quiz-container');
    if (!container) return;

    Components.createQuiz(container, [
      {
        q: 'What is the Hounsfield Unit (HU) value assigned to water?',
        options: ['−1000', '−500', '0', '+100'],
        correct: 2,
        explanation: 'Water is defined as 0 HU on the Hounsfield scale. Air is −1000 HU, and these serve as the two reference points for the linear scale.'
      },
      {
        q: 'Which reconstruction method is faster but noisier at low radiation doses?',
        options: ['Iterative reconstruction', 'Filtered back projection (FBP)', 'Deep learning reconstruction', 'Template matching'],
        correct: 1,
        explanation: 'FBP is an analytical method that runs in ~1 second but does not model noise. Iterative reconstruction is slower but can reduce noise by 30–50% at the same dose.'
      },
      {
        q: 'What happens to image noise when you decrease mAs?',
        options: ['Noise decreases', 'Noise increases', 'Noise stays the same', 'Image becomes brighter'],
        correct: 1,
        explanation: 'Noise is inversely proportional to √mAs. Decreasing mAs reduces the number of photons, increasing quantum noise. This is the primary trade-off between dose and image quality.'
      },
      {
        q: 'Which CT artefact appears as dark bands between dense structures?',
        options: ['Motion artefact', 'Ring artefact', 'Beam hardening', 'Partial volume effect'],
        correct: 2,
        explanation: 'Beam hardening occurs because low-energy X-ray photons are preferentially absorbed, making the beam "harder." This causes dark streaks between bones or other dense structures.'
      }
    ]);
  }

  /* ── Reflection ───────────────────────────── */

  function populateReflection() {
    var container = document.querySelector('#module-' + moduleId + '-reflection .reflection-content');
    if (!container) return;

    container.innerHTML =
      '<div style="display:grid;gap:16px;">' +
        '<div style="padding:20px;border-radius:12px;background:rgba(59,130,246,.06);border:1px solid rgba(59,130,246,.15);">' +
          '<h4 style="color:#60a5fa;margin-bottom:8px;">Why CT Parameters Matter for AI</h4>' +
          '<p style="color:#94a3b8;line-height:1.7;">CT acquisition parameters directly influence the quality and characteristics of images fed into AI models. Variations in kVp, mAs, slice thickness, and reconstruction kernel can cause significant domain shifts that degrade model generalization. A CNN trained on 120 kVp, 3 mm slices may perform poorly on 100 kVp, 1 mm slices from a different scanner.</p>' +
        '</div>' +
        '<div style="padding:20px;border-radius:12px;background:rgba(16,185,129,.06);border:1px solid rgba(16,185,129,.15);">' +
          '<h4 style="color:#34d399;margin-bottom:8px;">Practical Implications</h4>' +
          '<p style="color:#94a3b8;line-height:1.7;">For robust AI deployment, models should be trained on heterogeneous data that captures the full range of clinical acquisition parameters. Data augmentation strategies should include noise injection, resolution changes, and intensity windowing to improve generalization across scanners and protocols.</p>' +
        '</div>' +
        '<div style="padding:20px;border-radius:12px;background:rgba(139,92,246,.06);border:1px solid rgba(139,92,246,.15);">' +
          '<h4 style="color:#a78bfa;margin-bottom:8px;">The ALARA Principle</h4>' +
          '<p style="color:#94a3b8;line-height:1.7;">As Low As Reasonably Achievable — radiation dose should be minimised while maintaining diagnostic image quality. Understanding the noise-dose trade-off is essential for both clinical practice and for designing AI systems that can work with lower-quality (lower-dose) images.</p>' +
        '</div>' +
      '</div>';
  }

})();
