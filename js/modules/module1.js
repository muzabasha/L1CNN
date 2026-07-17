/**
 * Module 1: Clinical Background – Full Interactive Playground
 * Rich animated liver anatomy, CT phase viewer, risk factor explorer,
 * tumour growth simulation, epidemiology dashboard, quiz, and code.
 */
(function () {
  var M = '1';
  var _af = [];
  var _raf = function (id) { _af.push(id); };
  var _cancel = function () { _af.forEach(function (id) { cancelAnimationFrame(id); }); _af = []; };

  ModuleEngine.register(M, {
    init: function (container) {
      _cancel();
      
      // Create module header using design system
      var header = Components.createModuleHeader('1', 'Clinical Background');
      container.appendChild(header);
      
      // Create content sections
      container.innerHTML += 
        '<div id="module-1-objectives"><div class="objectives-grid"></div></div>' +
        '<div id="module-1-anatomy-wrap"></div>' +
        '<div id="module-1-ctphases-wrap"></div>' +
        '<div id="module-1-risk-wrap"></div>' +
        '<div id="module-1-theory"><div class="theory-content"></div></div>' +
        '<div id="module-1-simulation"><div class="simulation-container"></div></div>' +
        '<div id="module-1-epi-wrap"></div>' +
        '<div id="module-1-code"><div class="code-container"></div></div>' +
        '<div id="module-1-quiz"><div class="quiz-container"></div></div>' +
        '<div id="module-1-reflection"><div class="reflection-content"></div></div>' +
        '<div style="padding:var(--space-6);display:flex;justify-content:center;"></div>';
      
      // Add footer button using design system
      var footerBtn = Components.createButton({
        text: 'Home',
        icon: '←',
        variant: 'secondary',
        navigate: 'home',
        ariaLabel: 'Back to Home'
      });
      container.querySelector('div[style*="justify-content:center"]').appendChild(footerBtn);
      buildObjectives();
      buildAnatomy();
      buildCTPhases();
      buildRiskFactors();
      buildTheory();
      buildSimulation();
      buildEpiDashboard();
      buildCode();
      buildQuiz();
      buildReflection();
    },
    destroy: function () {
      _cancel();
      if (_resizeHandler) window.removeEventListener('resize', _resizeHandler);
      if (_resizeCTHandler) window.removeEventListener('resize', _resizeCTHandler);
    }
  });

  /* ═══════════════════════════════════════════
     1. Learning Objectives
     ═══════════════════════════════════════════ */
  function buildObjectives() {
    var container = q('#module-1-objectives');
    if (!container) return;
    
    var objectives = [
      'Understand the gross and microscopic anatomy of the liver, including lobes, vasculature, and Couinaud segments.',
      'Learn about hepatocellular carcinoma (HCC) — pathophysiology, staging, and why it is the most common primary liver malignancy.',
      'Identify major risk factors: chronic hepatitis B/C, cirrhosis, aflatoxin exposure, alcohol, and NAFLD.',
      'Understand the radiology workflow for liver lesion detection, from screening ultrasound to confirmatory multiphase CT/MRI.',
      'Learn why automated LI-RADS classification is needed: inter-observer variability, workload, and the promise of AI-assisted diagnosis.'
    ];
    
    // Use design system component
    var grid = Components.createObjectivesGrid(objectives);
    container.innerHTML = '';
    container.appendChild(grid);
  }

  /* ═══════════════════════════════════════════
     2. Interactive Liver Anatomy (Canvas)
     ═══════════════════════════════════════════ */
  function buildAnatomy() {
    var wrap = q('#module-1-anatomy-wrap');
    if (!wrap) return;
    wrap.innerHTML =
      '<div style="position:relative;width:100%;overflow:hidden;border-radius:12px;background:radial-gradient(ellipse at 50% 40%,#0f172a,#020617);">' +
        '<canvas id="m1-anatomy-cv" style="display:block;width:100%;height:500px;"></canvas>' +
        '<div id="m1-info" style="position:absolute;top:14px;right:14px;width:240px;padding:14px;background:rgba(15,23,42,.92);backdrop-filter:blur(14px);border:1px solid rgba(59,130,246,.3);border-radius:10px;color:#e2e8f0;font-size:13px;line-height:1.55;display:none;pointer-events:none;"></div>' +
        '<div id="m1-anatomy-legend" style="position:absolute;bottom:14px;left:14px;display:flex;gap:12px;flex-wrap:wrap;"></div>' +
      '</div>' +
      '<div id="m1-anatomy-ctrls" style="display:flex;flex-wrap:wrap;gap:18px;padding:14px 0;"></div>';

    var cv = document.getElementById('m1-anatomy-cv');
    if (!cv) return;
    var ctx = cv.getContext('2d');
    var W, H, dpr = window.devicePixelRatio || 1;
    var rot = 0, time = 0, mouseX = -999, mouseY = -999;
    var showVessels = true, showTumor = true, showLabels = true, opacity = 0.88;
    var hoverRegion = null;
    var particles = [];

    function resize() {
      var r = cv.parentElement.getBoundingClientRect();
      W = r.width; H = 500;
      cv.width = W * dpr; cv.height = H * dpr;
      cv.style.width = W + 'px'; cv.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    var _resizeHandler = resize;
    window.addEventListener('resize', _resizeHandler);

    cv.addEventListener('mousemove', function (e) { var r = cv.getBoundingClientRect(); mouseX = e.clientX - r.left; mouseY = e.clientY - r.top; });
    cv.addEventListener('mouseleave', function () { mouseX = -999; mouseY = -999; });

    var regions = {};
    var rotSpeed = 0.008;

    /* controls */
    var ctrl = document.getElementById('m1-anatomy-ctrls');
    if (ctrl) {
      Components.createSlider(ctrl, {label: 'Opacity', min: 20, max: 100, value: 88, unit: '%', onChange: function (v) { opacity = v / 100; }});
      Components.createSlider(ctrl, {label: 'Rotation Speed', min: 0, max: 50, value: 8, onChange: function (v) { rotSpeed = v / 5000; }});
      Components.createToggle(ctrl, {label: 'Show Vessels', checked: true, onChange: function (v) { showVessels = v; }});
      Components.createToggle(ctrl, {label: 'Show Tumour', checked: true, onChange: function (v) { showTumor = v; }});
      Components.createToggle(ctrl, {label: 'Show Labels', checked: true, onChange: function (v) { showLabels = v; }});
    }

    /* legend */
    var leg = document.getElementById('m1-anatomy-legend');
    if (leg) {
      var legs = [
        ['Right Lobe', '#b94a3a'], ['Left Lobe', '#c45a48'], ['Caudate', '#a84a3a'],
        ['Hepatic Artery', '#ef4444'], ['Portal Vein', '#3b82f6'], ['HCC Tumour', '#fbbf24']
      ];
      legs.forEach(function (l) {
        var s = document.createElement('span');
        s.style.cssText = 'display:inline-flex;align-items:center;gap:4px;font-size:11px;color:#94a3b8;';
        s.innerHTML = '<span style="width:10px;height:10px;border-radius:50%;background:' + l[1] + ';display:inline-block;"></span>' + l[0];
        leg.appendChild(s);
      });
    }

    /* blood flow particles */
    function spawnParticle(type) {
      var cx = W / 2, cy = H / 2;
      return {
        type: type,
        x: type === 'artery' ? cx - 10 : cx + 10,
        y: cy - 100 + Math.random() * 20,
        vx: (Math.random() - 0.5) * 0.8,
        vy: 1.2 + Math.random() * 1.5,
        life: 1,
        size: 2 + Math.random() * 2
      };
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      var cx = W / 2, cy = H / 2 + 10;
      var sc = Math.min(W, H) / 540;
      rot += rotSpeed;
      time += 0.016;
      var wobble = Math.sin(rot * 2) * 10 * sc;

      /* glow background */
      var bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 200 * sc);
      bgGrad.addColorStop(0, 'rgba(59,130,246,0.04)');
      bgGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      /* shadow */
      ctx.save();
      ctx.globalAlpha = 0.12;
      ctx.beginPath();
      ctx.ellipse(cx + 4, cy + 14, 165 * sc, 100 * sc, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#000';
      ctx.fill();
      ctx.restore();

      /* right lobe */
      var rX = cx + 32 * sc + wobble, rY = cy, rRx = 130 * sc, rRy = 85 * sc;
      regions.rightLobe = { x: rX, y: rY, label: 'Right Lobe', desc: 'The largest lobe (~60-65% of liver mass). Performs bulk of metabolic, synthetic, and detoxification functions. Most HCC tumours arise here due to larger volume and blood supply.' };

      ctx.save(); ctx.globalAlpha = opacity;
      var rg = ctx.createRadialGradient(rX - 20, rY - 20, 10, rX, rY, rRx);
      rg.addColorStop(0, '#c75a48'); rg.addColorStop(0.5, '#8b2e24'); rg.addColorStop(1, '#5c1a15');
      ctx.fillStyle = rg;
      ctx.beginPath(); ctx.ellipse(rX, rY, rRx, rRy, -0.1, 0, Math.PI * 2); ctx.fill();

      /* surface texture */
      ctx.globalAlpha = opacity * 0.08;
      for (var tx = -3; tx <= 3; tx++) {
        for (var ty = -2; ty <= 2; ty++) {
          var nx = rX + tx * 30 * sc + Math.sin(time + tx) * 3;
          var ny = rY + ty * 25 * sc + Math.cos(time + ty) * 2;
          ctx.beginPath(); ctx.arc(nx, ny, 12 * sc, 0, Math.PI * 2); ctx.fillStyle = '#ff9'; ctx.fill();
        }
      }
      ctx.restore();

      /* left lobe */
      var lX = cx - 105 * sc - wobble * 0.5, lY = cy + 6 * sc, lRx = 82 * sc, lRy = 58 * sc;
      regions.leftLobe = { x: lX, y: lY, label: 'Left Lobe', desc: 'Smaller lobe (~30%) extending across the midline. Divided into medial and lateral segments (Couinaud II-IV). Shares functional capacity.' };

      ctx.save(); ctx.globalAlpha = opacity;
      var lg = ctx.createRadialGradient(lX + 10, lY - 10, 5, lX, lY, lRx);
      lg.addColorStop(0, '#c45a48'); lg.addColorStop(0.7, '#94352b'); lg.addColorStop(1, '#6b2219');
      ctx.fillStyle = lg;
      ctx.beginPath(); ctx.ellipse(lX, lY, lRx, lRy, 0.2, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      /* caudate */
      var cX = cx - 25 * sc, cY = cy - 75 * sc;
      regions.caudate = { x: cX, y: cY, label: 'Caudate Lobe (Seg I)', desc: 'Posterior lobe with independent blood supply from both portal vein and hepatic artery. Direct venous drainage into IVC — important in cirrhosis evaluation.' };

      ctx.save(); ctx.globalAlpha = opacity;
      var cg = ctx.createRadialGradient(cX, cY, 3, cX, cY, 38 * sc);
      cg.addColorStop(0, '#a84a3a'); cg.addColorStop(1, '#6b2a1e');
      ctx.fillStyle = cg;
      ctx.beginPath(); ctx.ellipse(cX, cY, 38 * sc, 28 * sc, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      /* vessels */
      if (showVessels) {
        regions.vessels = { x: cx, y: cy, label: 'Hepatic Vasculature', desc: 'Dual blood supply: hepatic artery (25%, oxygenated, red) and portal vein (75%, nutrient-rich, blue). Hepatic veins drain into IVC. Understanding vascular anatomy is critical for surgical planning.' };

        ctx.save(); ctx.globalAlpha = opacity * 0.9;
        /* hepatic artery */
        ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3.5 * sc;
        ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 8 * sc;
        ctx.beginPath();
        ctx.moveTo(cx - 8 * sc, cy - 105 * sc);
        ctx.bezierCurveTo(cx + 25 * sc, cy - 40 * sc, cx + 65 * sc, cy - 10 * sc, cx + 85 * sc, cy + 22 * sc);
        ctx.stroke();
        ctx.shadowBlur = 0;

        /* portal vein */
        ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 4.5 * sc;
        ctx.shadowColor = '#3b82f6'; ctx.shadowBlur = 8 * sc;
        ctx.beginPath();
        ctx.moveTo(cx + 12 * sc, cy - 100 * sc);
        ctx.bezierCurveTo(cx - 12 * sc, cy - 30 * sc, cx - 55 * sc, cy + 10 * sc, cx - 95 * sc, cy + 32 * sc);
        ctx.stroke();
        ctx.shadowBlur = 0;

        /* branches */
        ctx.lineWidth = 1.5 * sc; ctx.globalAlpha = opacity * 0.4;
        for (var b = 0; b < 6; b++) {
          var bx = cx + (b * 28 - 70) * sc;
          var by = cy + (22 + Math.sin(b + time * 0.5) * 8) * sc;
          ctx.strokeStyle = b % 2 === 0 ? '#ef4444' : '#3b82f6';
          ctx.beginPath();
          ctx.moveTo(bx, cy - 65 * sc);
          ctx.quadraticCurveTo(bx + 12 * sc, cy + 5 * sc, bx, by + 45 * sc);
          ctx.stroke();
        }
        ctx.restore();
      }

      /* blood flow particles */
      if (showVessels && Math.random() < 0.3) {
        particles.push(spawnParticle('artery'));
        particles.push(spawnParticle('portal'));
      }
      ctx.save();
      for (var pi = particles.length - 1; pi >= 0; pi--) {
        var p = particles[pi];
        p.x += p.vx; p.y += p.vy; p.life -= 0.008;
        if (p.life <= 0 || p.y > cy + 60 * sc) { particles.splice(pi, 1); continue; }
        ctx.globalAlpha = p.life * 0.6;
        ctx.fillStyle = p.type === 'artery' ? '#ff6b6b' : '#60a5fa';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * sc, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
      if (particles.length > 200) particles.splice(0, 50);

      /* tumour */
      if (showTumor) {
        var tX = cx + 65 * sc + wobble, tY = cy - 18 * sc;
        var tR = (15 + Math.sin(time * 3) * 2.5) * sc;
        regions.tumor = { x: tX, y: tY, label: 'HCC Tumour', desc: 'Hepatocellular carcinoma. On CT: arterial-phase hyperenhancement with portal venous washout (LI-RADS 5). The pulsing glow represents active tumour angiogenesis — abnormal new blood vessel formation.' };

        ctx.save(); ctx.globalAlpha = opacity;
        /* outer glow */
        var glow = ctx.createRadialGradient(tX, tY, tR * 0.5, tX, tY, tR * 2.5);
        glow.addColorStop(0, 'rgba(251,191,36,0.2)');
        glow.addColorStop(1, 'rgba(251,191,36,0)');
        ctx.fillStyle = glow;
        ctx.beginPath(); ctx.arc(tX, tY, tR * 2.5, 0, Math.PI * 2); ctx.fill();

        /* tumour body */
        var tg = ctx.createRadialGradient(tX - 3, tY - 3, 1, tX, tY, tR);
        tg.addColorStop(0, '#fde68a'); tg.addColorStop(0.4, '#fbbf24'); tg.addColorStop(0.7, '#f59e0b'); tg.addColorStop(1, '#b45309');
        ctx.fillStyle = tg;
        ctx.beginPath(); ctx.arc(tX, tY, tR, 0, Math.PI * 2); ctx.fill();

        /* pulsing rings */
        for (var ri = 1; ri <= 3; ri++) {
          ctx.globalAlpha = 0.15 * (1 - ri * 0.3) * (0.5 + 0.5 * Math.sin(time * 4 + ri));
          ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(tX, tY, tR + ri * 8 * sc + Math.sin(time * 3 + ri) * 3 * sc, 0, Math.PI * 2); ctx.stroke();
        }
        ctx.restore();

        /* label */
        if (showLabels) {
          ctx.save(); ctx.font = 'bold ' + (12 * sc) + 'px Inter, sans-serif';
          ctx.fillStyle = '#fbbf24'; ctx.fillText('HCC', tX + tR + 8, tY + 4);
          ctx.restore();
        }
      }

      /* lobe labels */
      if (showLabels) {
        ctx.save(); ctx.font = (11 * sc) + 'px Inter, sans-serif'; ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fillText('Right Lobe', rX + 10, rY + 5);
        ctx.fillText('Left Lobe', lX, lY + 5);
        ctx.fillText('Caudate', cX, cY + 4);
        if (showVessels) {
          ctx.fillStyle = '#ef4444'; ctx.fillText('Hepatic A.', cx + 40 * sc, cy - 90 * sc);
          ctx.fillStyle = '#3b82f6'; ctx.fillText('Portal V.', cx - 40 * sc, cy - 85 * sc);
        }
        ctx.restore();
      }

      /* hover detection */
      hoverRegion = null;
      Object.keys(regions).forEach(function (k) {
        if (hoverRegion) return;
        var r = regions[k];
        var dist = Math.hypot(mouseX - r.x, mouseY - r.y);
        var hitR = k === 'tumor' ? 25 * sc : k === 'vessels' ? 40 * sc : 90 * sc;
        if (dist < hitR) hoverRegion = k;
      });
      cv.style.cursor = hoverRegion ? 'pointer' : 'default';

      /* highlight on hover */
      if (hoverRegion) {
        var hr = regions[hoverRegion];
        ctx.save();
        ctx.globalAlpha = 0.15 + 0.08 * Math.sin(time * 5);
        ctx.fillStyle = '#60a5fa';
        ctx.beginPath(); ctx.arc(hr.x, hr.y, (hoverRegion === 'tumor' ? 25 : 40) * sc, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }

      /* info panel */
      var panel = document.getElementById('m1-info');
      if (panel) {
        if (hoverRegion) {
          var info = regions[hoverRegion];
          panel.innerHTML = '<strong style="color:#60a5fa;font-size:14px;">' + info.label + '</strong><br/><span style="color:#cbd5e1;">' + info.desc + '</span>';
          panel.style.display = 'block';
        } else {
          panel.style.display = 'none';
        }
      }

      _raf(requestAnimationFrame(draw));
    }
    draw();
  }

  /* ═══════════════════════════════════════════
     3. Multiphase CT Phase Viewer
     ═══════════════════════════════════════════ */
  function buildCTPhases() {
    var wrap = q('#module-1-ctphases-wrap');
    if (!wrap) return;
    wrap.innerHTML =
      '<div style="display:grid;grid-template-columns:1fr 320px;gap:16px;">' +
        '<div style="position:relative;border-radius:12px;overflow:hidden;background:#0a0e1a;">' +
          '<canvas id="m1-ct-cv" style="display:block;width:100%;height:400px;"></canvas>' +
          '<div id="m1-ct-phase-label" style="position:absolute;bottom:12px;left:12px;padding:6px 14px;background:rgba(0,0,0,.7);backdrop-filter:blur(8px);border:1px solid rgba(59,130,246,.3);border-radius:8px;color:#60a5fa;font-weight:600;font-size:13px;"></div>' +
        '</div>' +
        '<div style="display:flex;flex-direction:column;gap:10px;">' +
          '<h4 style="color:#e2e8f0;margin:0;">CT Phase Controls</h4>' +
          '<div id="m1-ct-phases-btns" style="display:flex;flex-direction:column;gap:6px;"></div>' +
          '<div id="m1-ct-info" style="margin-top:auto;padding:14px;border-radius:10px;background:rgba(30,41,59,.6);border:1px solid rgba(148,163,184,.1);font-size:13px;color:#94a3b8;line-height:1.6;"></div>' +
        '</div>' +
      '</div>';

    var phases = [
      { name: 'Non-Contrast', time: 0, desc: 'Baseline scan before contrast injection. Liver parenchyma appears homogeneous. Calcifications and fat may be visible. No tumour enhancement yet.', color: '#94a3b8', arterial: 0.1, portal: 0.1, washout: 0 },
      { name: 'Arterial Phase (25-30s)', time: 1, desc: 'Peak arterial enhancement. HCC shows ARTERIAL PHASE HYPERENHANCEMENT (APHE) due to hepatic artery supply. Tumour lights up brighter than surrounding liver.', color: '#ef4444', arterial: 0.95, portal: 0.2, washout: 0 },
      { name: 'Portal Venous Phase (60-70s)', time: 2, desc: 'Portal vein peak enhancement. Liver parenchyma brightens (75% portal supply). HCC begins WASHOUT — appears relatively darker than enhanced liver.', color: '#3b82f6', arterial: 0.4, portal: 0.9, washout: 0.3 },
      { name: 'Delayed Phase (3-5 min)', time: 3, desc: 'Contrast washes out of tumour. HCC shows definite WASHOUT — darker than surrounding liver. CAPSULE APPEARANCE may be visible as an enhancing rim around the tumour.', color: '#a78bfa', arterial: 0.2, portal: 0.5, washout: 0.8 },
      { name: 'LI-RADS Classification', time: 4, desc: 'Combining all phases: LR-5 requires APHE + washout + capsule + threshold growth. LR-4 has some but not all features. LR-3 is indeterminate.', color: '#fbbf24', arterial: 0.7, portal: 0.6, washout: 0.6 }
    ];
    var currentPhase = 0;
    var phaseTime = 0;

    /* buttons */
    var btnWrap = document.getElementById('m1-ct-phases-btns');
    phases.forEach(function (p, i) {
      var btn = document.createElement('button');
      btn.className = 'btn';
      btn.style.cssText = 'padding:8px 12px;font-size:12px;text-align:left;border:1px solid rgba(148,163,184,.15);background:rgba(30,41,59,.4);color:#94a3b8;border-radius:8px;transition:all .2s;min-height:40px;';
      btn.textContent = p.name;
      btn.addEventListener('click', function () { currentPhase = i; updatePhaseButtons(); });
      btnWrap.appendChild(btn);
    });
    updatePhaseButtons();

    function updatePhaseButtons() {
      var btns = btnWrap.querySelectorAll('button');
      btns.forEach(function (b, i) {
        if (i === currentPhase) {
          b.style.borderColor = phases[i].color;
          b.style.color = phases[i].color;
          b.style.background = phases[i].color + '15';
        } else {
          b.style.borderColor = 'rgba(148,163,184,.15)';
          b.style.color = '#94a3b8';
          b.style.background = 'rgba(30,41,59,.4)';
        }
      });
      var info = document.getElementById('m1-ct-info');
      if (info) info.innerHTML = '<strong style="color:' + phases[currentPhase].color + ';">' + phases[currentPhase].name + '</strong><br/>' + phases[currentPhase].desc;
      var lbl = document.getElementById('m1-ct-phase-label');
      if (lbl) { lbl.textContent = phases[currentPhase].name; lbl.style.color = phases[currentPhase].color; lbl.style.borderColor = phases[currentPhase].color + '50'; }
    }

    /* canvas */
    var cv = document.getElementById('m1-ct-cv');
    if (!cv) return;
    var ctx = cv.getContext('2d');
    var dpr = window.devicePixelRatio || 1;

    function resizeCT() {
      var r = cv.parentElement.getBoundingClientRect();
      cv.width = r.width * dpr; cv.height = 400 * dpr;
      cv.style.width = r.width + 'px'; cv.style.height = '400px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resizeCT();
    var _resizeCTHandler = resizeCT;
    window.addEventListener('resize', _resizeCTHandler);

    function drawCT() {
      var w = cv.width / dpr, h = cv.height / dpr;
      ctx.clearRect(0, 0, w, h);
      phaseTime += 0.02;
      var ph = phases[currentPhase];
      var cx = w / 2, cy = h / 2;

      /* CT circular field of view */
      ctx.save();
      var fovR = Math.min(w, h) * 0.42;
      ctx.beginPath(); ctx.arc(cx, cy, fovR, 0, Math.PI * 2); ctx.clip();

      /* liver background — brightness varies with phase */
      var liverBrightness = 0.15 + ph.portal * 0.35;
      var liverG = ctx.createRadialGradient(cx, cy, 0, cx, cy, fovR);
      liverG.addColorStop(0, 'rgba(80,50,30,' + (liverBrightness + 0.1) + ')');
      liverG.addColorStop(0.7, 'rgba(50,30,20,' + liverBrightness + ')');
      liverG.addColorStop(1, 'rgba(20,10,5,0.8)');
      ctx.fillStyle = liverG;
      ctx.fillRect(0, 0, w, h);

      /* liver outline */
      ctx.strokeStyle = 'rgba(120,70,40,0.4)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(cx + 10, cy, fovR * 0.85, fovR * 0.6, 0, 0, Math.PI * 2); ctx.stroke();

      /* tumour */
      var tX = cx + fovR * 0.25, tY = cy - fovR * 0.1;
      var tR = fovR * 0.12;
      var tumEnhance = ph.arterial * (1 - ph.washout * 0.7);
      var tBright = Math.floor(60 + tumEnhance * 195);
      var tColor = 'rgb(' + tBright + ',' + Math.floor(tBright * 0.8) + ',' + Math.floor(tBright * 0.3) + ')';

      ctx.fillStyle = tColor;
      ctx.beginPath(); ctx.arc(tX, tY, tR, 0, Math.PI * 2); ctx.fill();

      /* capsule in delayed */
      if (currentPhase === 3 || currentPhase === 4) {
        ctx.strokeStyle = 'rgba(200,180,120,0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(tX, tY, tR + 3, 0, Math.PI * 2); ctx.stroke();
      }

      /* enhancement indicator ring */
      var glowAlpha = 0.2 + 0.3 * Math.sin(phaseTime * 3);
      ctx.globalAlpha = glowAlpha * ph.arterial;
      ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(tX, tY, tR + 8 + Math.sin(phaseTime * 2) * 3, 0, Math.PI * 2); ctx.stroke();
      ctx.globalAlpha = 1;

      ctx.restore();

      /* FOV border */
      ctx.strokeStyle = 'rgba(148,163,184,0.2)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(cx, cy, fovR, 0, Math.PI * 2); ctx.stroke();

      /* Hounsfield scale bar */
      var barX = w - 50, barY = cy - 80, barH = 160;
      var grad = ctx.createLinearGradient(barX, barY, barX, barY + barH);
      grad.addColorStop(0, '#fff'); grad.addColorStop(0.5, '#888'); grad.addColorStop(1, '#000');
      ctx.fillStyle = grad;
      ctx.fillRect(barX, barY, 12, barH);
      ctx.strokeStyle = 'rgba(148,163,184,0.3)'; ctx.strokeRect(barX, barY, 12, barH);
      ctx.font = '10px Inter, sans-serif'; ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'left';
      ctx.fillText('+1000', barX + 16, barY + 8);
      ctx.fillText('0', barX + 16, barY + barH / 2 + 4);
      ctx.fillText('-1000', barX + 16, barY + barH);

      /* phase-specific annotation */
      if (currentPhase >= 1 && currentPhase <= 3) {
        ctx.save();
        ctx.font = 'bold 13px Inter, sans-serif';
        ctx.fillStyle = ph.color;
        var annoText = currentPhase === 1 ? 'APHE: Tumour bright' : currentPhase === 2 ? 'Washout begins' : 'Definite washout + capsule';
        ctx.fillText(annoText, 20, 30);

        /* arrow to tumour */
        ctx.strokeStyle = ph.color; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.moveTo(20 + ctx.measureText(annoText).width + 10, 26);
        ctx.lineTo(tX - tR - 12, tY);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }

      _raf(requestAnimationFrame(drawCT));
    }
    drawCT();
  }

  /* ═══════════════════════════════════════════
     4. Risk Factor Explorer
     ═══════════════════════════════════════════ */
  function buildRiskFactors() {
    var wrap = q('#module-1-risk-wrap');
    if (!wrap) return;

    var factors = [
      { name: 'Hepatitis B (HBV)', pct: 50, color: '#ef4444', icon: '🦠', desc: 'Most common cause globally. 296M chronic carriers. Integrates into hepatocyte DNA, causing genomic instability and chronic inflammation leading to cirrhosis and HCC.', countries: 'Asia-Pacific, Sub-Saharan Africa', mechanism: 'DNA integration → genomic instability → clonal expansion → HCC' },
      { name: 'Hepatitis C (HCV)', pct: 25, color: '#f59e0b', icon: '🔬', desc: 'Leading cause in Western countries. 58M chronic infections. Progresses via chronic inflammation → fibrosis → cirrhosis → dysplasia → HCC over 20-30 years.', countries: 'Europe, North America, Japan', mechanism: 'Chronic inflammation → fibrosis → cirrhosis → dysplastic nodules → HCC' },
      { name: 'Alcohol / Cirrhosis', pct: 15, color: '#8b5cf6', icon: '🍷', desc: 'Heavy alcohol use (>3 drinks/day). Cirrhosis present in 80-90% of HCC patients. Any cause (viral, alcoholic, NAFLD) leads to regenerative nodules and dysplasia.', countries: 'Global', mechanism: 'Chronic injury → hepatocyte death → regeneration → fibrosis → cirrhosis → dysplasia → HCC' },
      { name: 'NAFLD / NASH', pct: 8, color: '#06b6d4', icon: '🫀', desc: 'Non-alcoholic fatty liver disease — emerging risk factor with rising prevalence due to obesity/diabetes epidemic. NASH (steatohepatitis) has higher HCC risk.', countries: 'Global (rising)', mechanism: 'Metabolic syndrome → steatosis → inflammation (NASH) → fibrosis → cirrhosis → HCC' },
      { name: 'Aflatoxin B1', pct: 5, color: '#10b981', icon: '🍄', desc: 'Mycotoxin from Aspergillus fungi contaminating grain/nuts. Synergistic with HBV. Causes p53 mutation at codon 249 (R249S), a signature mutation in aflatoxin-related HCC.', countries: 'Sub-Saharan Africa, China', mechanism: 'Aflatoxin-DNA adducts → p53 R249S mutation → hepatocyte malignant transformation' },
      { name: 'Other Factors', pct: 5, color: '#64748b', icon: '🧬', desc: 'Hereditary hemochromatosis, alpha-1 antitrypsin deficiency, Wilson disease, primary biliary cirrhosis, and autoimmune hepatitis all increase HCC risk.', countries: 'Global', mechanism: 'Chronic liver injury → fibrosis → cirrhosis → dysplasia → HCC' }
    ];

    wrap.innerHTML =
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
        factors.map(function (f, i) {
          return '<div class="m1-risk-card" data-idx="' + i + '" style="padding:16px;border-radius:12px;background:rgba(30,41,59,.5);border:1px solid ' + f.color + '20;cursor:pointer;transition:all .3s ease;position:relative;overflow:hidden;">' +
            '<div style="position:absolute;top:0;left:0;width:100%;height:3px;background:' + f.color + ';transform:scaleX(0);transform-origin:left;transition:transform .6s ease;" class="m1-risk-bar"></div>' +
            '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">' +
              '<span style="font-size:24px;">' + f.icon + '</span>' +
              '<div><div style="font-weight:600;color:#e2e8f0;font-size:14px;">' + f.name + '</div>' +
              '<div style="font-size:12px;color:' + f.color + ';">' + f.pct + '% of global HCC</div></div>' +
            '</div>' +
            '<div class="m1-risk-detail" style="max-height:0;overflow:hidden;transition:max-height .4s ease;">' +
              '<p style="font-size:13px;color:#94a3b8;line-height:1.6;margin:8px 0;">' + f.desc + '</p>' +
              '<div style="padding:8px 10px;border-radius:6px;background:rgba(0,0,0,.3);font-size:11px;color:#64748b;"><strong style="color:#94a3b8;">Countries:</strong> ' + f.countries + '</div>' +
              '<div style="padding:8px 10px;border-radius:6px;background:rgba(0,0,0,.3);font-size:11px;color:#64748b;margin-top:4px;"><strong style="color:#94a3b8;">Mechanism:</strong> ' + f.mechanism + '</div>' +
            '</div>' +
          '</div>';
        }).join('') +
      '</div>' +
      '<div id="m1-risk-chart" style="margin-top:16px;"></div>';

    /* expand/collapse cards */
    wrap.querySelectorAll('.m1-risk-card').forEach(function (card) {
      card.addEventListener('click', function () {
        var detail = card.querySelector('.m1-risk-detail');
        var bar = card.querySelector('.m1-risk-bar');
        var isOpen = detail.style.maxHeight && detail.style.maxHeight !== '0px';
        /* close all */
        wrap.querySelectorAll('.m1-risk-detail').forEach(function (d) { d.style.maxHeight = '0'; });
        wrap.querySelectorAll('.m1-risk-bar').forEach(function (b) { b.style.transform = 'scaleX(0)'; });
        wrap.querySelectorAll('.m1-risk-card').forEach(function (c) { c.style.borderColor = c.style.borderColor.replace(/[0-9a-f]{2}$/i, '20'); });
        if (!isOpen) {
          detail.style.maxHeight = '300px';
          bar.style.transform = 'scaleX(1)';
          card.style.borderColor = card.style.borderColor.replace(/20$/, '60');
        }
      });
    });

    /* doughnut chart */
    setTimeout(function () {
      var chartEl = document.getElementById('m1-risk-chart');
      if (chartEl) {
        Components.createChart(chartEl, 'doughnut', {
          labels: factors.map(function (f) { return f.name; }),
          datasets: [{ data: factors.map(function (f) { return f.pct; }), backgroundColor: factors.map(function (f) { return f.color; }), borderColor: '#0f172a', borderWidth: 3 }]
        }, {
          plugins: { legend: { position: 'right', labels: { color: '#94a3b8', padding: 10, font: { size: 12 } } } },
          title: { display: true, text: 'Risk Factor Contribution to Global HCC (%)', color: '#e2e8f0', font: { size: 14 } },
          cutout: '55%'
        });
      }
    }, 200);
  }

  /* ═══════════════════════════════════════════
     5. Theory Content
     ═══════════════════════════════════════════ */
  function buildTheory() {
    var wrap = q('#module-1-theory .theory-content');
    if (!wrap) return;
    wrap.innerHTML =
      '<div style="display:grid;gap:20px;">' +

      '<div style="padding:20px;border-radius:12px;background:rgba(59,130,246,.06);border:1px solid rgba(59,130,246,.15);">' +
        '<h4 style="color:#60a5fa;margin-bottom:10px;">1. Liver Anatomy</h4>' +
        '<p style="color:#94a3b8;line-height:1.7;">The liver is the largest solid organ (~1.4-1.6 kg), located in the right upper quadrant. It performs over 500 vital functions: protein synthesis, bile production, detoxification, and metabolic regulation. The liver has dual blood supply — hepatic artery (25%, oxygenated) and portal vein (75%, nutrient-rich from GI tract).</p>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-top:12px;">' +
          '<div style="padding:12px;border-radius:8px;background:rgba(30,41,59,.6);border:1px solid rgba(148,163,184,.1);"><strong style="color:#e2e8f0;">Couinaud Classification</strong><br/><span style="color:#94a3b8;font-size:13px;">8 functionally independent segments, each with its own vascular inflow, biliary drainage, and venous outflow.</span></div>' +
          '<div style="padding:12px;border-radius:8px;background:rgba(30,41,59,.6);border:1px solid rgba(148,163,184,.1);"><strong style="color:#e2e8f0;">Functional Lobes</strong><br/><span style="color:#94a3b8;font-size:13px;">Right (~65%), Left (~30%), Caudate (Seg I, ~5%). Caudate has independent blood supply and drains directly into IVC.</span></div>' +
          '<div style="padding:12px;border-radius:8px;background:rgba(30,41,59,.6);border:1px solid rgba(148,163,184,.1);"><strong style="color:#e2e8f0;">Regenerative Capacity</strong><br/><span style="color:#94a3b8;font-size:13px;">The liver can regenerate to full size from as little as 25% of its original mass. This remarkable capacity underlies living donor liver transplantation.</span></div>' +
        '</div>' +
      '</div>' +

      '<div style="padding:20px;border-radius:12px;background:rgba(239,68,68,.06);border:1px solid rgba(239,68,68,.15);">' +
        '<h4 style="color:#f87171;margin-bottom:10px;">2. Hepatocellular Carcinoma (HCC)</h4>' +
        '<p style="color:#94a3b8;line-height:1.7;">HCC is the 6th most common cancer worldwide and the 3rd leading cause of cancer death. It arises from hepatocytes in chronic liver disease. The hallmark imaging feature on multiphase CT is <strong style="color:#fbbf24;">arterial-phase hyperenhancement (APHE)</strong> with <strong style="color:#fbbf24;">portal venous or delayed washout</strong>, reflecting the tumour\'s predominantly arterial blood supply.</p>' +
        '<div style="margin-top:12px;display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;">' +
          '<div style="padding:14px;border-radius:8px;background:rgba(30,41,59,.6);text-align:center;"><div style="font-size:26px;font-weight:700;color:#f87171;">924K</div><div style="font-size:11px;color:#94a3b8;">New cases/year</div></div>' +
          '<div style="padding:14px;border-radius:8px;background:rgba(30,41,59,.6);text-align:center;"><div style="font-size:26px;font-weight:700;color:#f87171;">830K</div><div style="font-size:11px;color:#94a3b8;">Deaths/year</div></div>' +
          '<div style="padding:14px;border-radius:8px;background:rgba(30,41,59,.6);text-align:center;"><div style="font-size:26px;font-weight:700;color:#10b981;">60-70%</div><div style="font-size:11px;color:#94a3b8;">5yr survival (early)</div></div>' +
          '<div style="padding:14px;border-radius:8px;background:rgba(30,41,59,.6);text-align:center;"><div style="font-size:26px;font-weight:700;color:#ef4444;">~5%</div><div style="font-size:11px;color:#94a3b8;">5yr survival (late)</div></div>' +
        '</div>' +
      '</div>' +

      '<div style="padding:20px;border-radius:12px;background:rgba(16,185,129,.06);border:1px solid rgba(16,185,129,.15);">' +
        '<h4 style="color:#34d399;margin-bottom:10px;">3. LI-RADS & Why Automate?</h4>' +
        '<p style="color:#94a3b8;line-height:1.7;">LI-RADS (Liver Imaging Reporting and Data System) provides a standardized framework for interpreting liver lesions. Key features: APHE, washout, capsule appearance, threshold growth. Inter-observer agreement is only moderate (κ ≈ 0.54-0.68). Automated classification can reduce variability, serve as second-reader, provide reproducible measurements, and help resource-limited settings.</p>' +
        '<div style="margin-top:12px;padding:14px;border-radius:8px;background:rgba(30,41,59,.6);border:1px solid rgba(59,130,246,.15);">' +
          '<div style="display:flex;gap:12px;flex-wrap:wrap;">' +
            '<div style="flex:1;min-width:120px;text-align:center;"><div style="font-size:20px;font-weight:700;color:#fbbf24;">LR-3</div><div style="font-size:11px;color:#94a3b8;">Indeterminate</div></div>' +
            '<div style="flex:1;min-width:120px;text-align:center;"><div style="font-size:20px;font-weight:700;color:#f97316;">LR-4</div><div style="font-size:11px;color:#94a3b8;">Probably HCC</div></div>' +
            '<div style="flex:1;min-width:120px;text-align:center;"><div style="font-size:20px;font-weight:700;color:#ef4444;">LR-5</div><div style="font-size:11px;color:#94a3b8;">Definite HCC</div></div>' +
            '<div style="flex:1;min-width:120px;text-align:center;"><div style="font-size:20px;font-weight:700;color:#64748b;">LR-TIV</div><div style="font-size:11px;color:#94a3b8;">Tumour in Vein</div></div>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '</div>';
  }

  /* ═══════════════════════════════════════════
     6. Tumour Growth Simulation
     ═══════════════════════════════════════════ */
  function buildSimulation() {
    var wrap = q('#module-1-simulation .simulation-container');
    if (!wrap) return;
    wrap.innerHTML =
      '<div style="padding:16px;">' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">' +
          '<div style="position:relative;"><canvas id="m1-sim-cv" style="width:100%;height:340px;background:radial-gradient(ellipse,#1e293b,#0f172a);border-radius:10px;border:1px solid rgba(59,130,246,.15);"></canvas></div>' +
          '<div style="display:flex;flex-direction:column;gap:10px;">' +
            '<h4 style="color:#e2e8f0;margin:0 0 4px;">Tumour Growth Dynamics</h4>' +
            '<canvas id="m1-sim-chart-cv" style="width:100%;height:180px;background:rgba(0,0,0,.2);border-radius:8px;border:1px solid rgba(59,130,246,.1);"></canvas>' +
            '<div id="m1-sim-bars"></div>' +
            '<div style="margin-top:auto;padding:14px;border-radius:10px;background:rgba(30,41,59,.6);border:1px solid rgba(148,163,184,.1);">' +
              '<div style="font-size:12px;color:#94a3b8;">Predicted LI-RADS</div>' +
              '<div id="m1-sim-lr" style="font-size:20px;font-weight:700;color:#fbbf24;">LR-3 (Indeterminate)</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div id="m1-sim-ctrls" style="display:flex;flex-wrap:wrap;gap:18px;margin-top:16px;"></div>' +
      '</div>';

    var tumorSize = 10, elapsed = 6, aggressiveness = 1;
    var ctrl = document.getElementById('m1-sim-ctrls');
    if (ctrl) {
      Components.createSlider(ctrl, {label: 'Tumour Size', min: 1, max: 50, value: 10, unit: 'mm', onChange: function (v) { tumorSize = v; }});
      Components.createSlider(ctrl, {label: 'Months Elapsed', min: 0, max: 24, value: 6, unit: ' months', onChange: function (v) { elapsed = v; }});
      Components.createSlider(ctrl, {label: 'Aggressiveness', min: 1, max: 3, value: 1, onChange: function (v) { aggressiveness = v; }});
    }

    var cv = document.getElementById('m1-sim-cv');
    var chartCv = document.getElementById('m1-sim-chart-cv');
    if (!cv || !chartCv) return;
    var ctx = cv.getContext('2d');
    var cCtx = chartCv.getContext('2d');
    var dpr = window.devicePixelRatio || 1;

    function resizeSim() {
      [cv, chartCv].forEach(function (c) {
        var r = c.parentElement.getBoundingClientRect();
        c.width = r.width * dpr; c.height = (c === cv ? 340 : 180) * dpr;
        c.style.width = r.width + 'px';
        c.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
      });
    }
    resizeSim();

    /* growth curve history */
    var history = [];

    function drawSim() {
      var w = cv.width / dpr, h = cv.height / dpr;
      ctx.clearRect(0, 0, w, h);
      var cx = w / 2, cy = h / 2;

      /* liver cross-section */
      var lg = ctx.createRadialGradient(cx, cy, 10, cx, cy, 130);
      lg.addColorStop(0, '#8b2e24'); lg.addColorStop(1, '#4a1a12');
      ctx.fillStyle = lg;
      ctx.beginPath(); ctx.ellipse(cx, cy, 140, 100, 0, 0, Math.PI * 2); ctx.fill();

      /* texture */
      ctx.save(); ctx.globalAlpha = 0.06;
      for (var i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.arc(cx + Math.cos(i * 0.7) * 80, cy + Math.sin(i * 1.1) * 50, 15, 0, Math.PI * 2);
        ctx.fillStyle = '#ff9'; ctx.fill();
      }
      ctx.restore();

      /* tumour */
      var effSize = tumorSize * (1 + (aggressiveness - 1) * 0.3) * (1 + elapsed * 0.05);
      var rPx = Math.min(effSize * 2.5, 90);
      var tX = cx + 25, tY = cy - 12;

      /* glow */
      var glow = ctx.createRadialGradient(tX, tY, rPx * 0.3, tX, tY, rPx * 2);
      glow.addColorStop(0, 'rgba(251,191,36,0.15)'); glow.addColorStop(1, 'rgba(251,191,36,0)');
      ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(tX, tY, rPx * 2, 0, Math.PI * 2); ctx.fill();

      /* tumour body */
      var tg = ctx.createRadialGradient(tX - 3, tY - 3, 1, tX, tY, rPx);
      tg.addColorStop(0, '#fde68a'); tg.addColorStop(0.5, '#f59e0b'); tg.addColorStop(1, '#92400e');
      ctx.fillStyle = tg; ctx.beginPath(); ctx.arc(tX, tY, rPx, 0, Math.PI * 2); ctx.fill();

      /* dashed border */
      ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2; ctx.setLineDash([5, 3]);
      ctx.beginPath(); ctx.arc(tX, tY, rPx + 2, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);

      /* label */
      ctx.font = 'bold 13px Inter, sans-serif'; ctx.fillStyle = '#fbbf24';
      ctx.fillText('Tumour: ' + effSize.toFixed(1) + ' mm', tX + rPx + 10, tY + 4);
      ctx.font = '12px Inter, sans-serif'; ctx.fillStyle = '#64748b';
      ctx.fillText('Liver parenchyma', cx - 60, cy + 70);

      /* grid */
      ctx.strokeStyle = 'rgba(148,163,184,0.06)'; ctx.lineWidth = 1;
      for (var gx = 0; gx < w; gx += 30) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
      for (var gy = 0; gy < h; gy += 30) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }

      /* update bars */
      var barsEl = document.getElementById('m1-sim-bars');
      if (barsEl) {
        var det = Math.min(100, Math.round(effSize * 2.2));
        var risk = Math.min(100, Math.round(effSize * 1.8 + aggressiveness * 10));
        barsEl.innerHTML =
          mkBar('Detection Prob.', det, det > 70 ? '#10b981' : det > 40 ? '#f59e0b' : '#ef4444') +
          mkBar('Malignancy Risk', risk, risk > 60 ? '#ef4444' : '#f59e0b') +
          mkBar('Effective Size', Math.min(100, Math.round(effSize * 2)), '#3b82f6');
      }

      /* LI-RADS */
      var lr = document.getElementById('m1-sim-lr');
      if (lr) {
        if (effSize < 10) { lr.textContent = 'LR-3 (Indeterminate)'; lr.style.color = '#fbbf24'; }
        else if (effSize < 20) { lr.textContent = 'LR-4 (Probably HCC)'; lr.style.color = '#f97316'; }
        else { lr.textContent = 'LR-5 (Definite HCC)'; lr.style.color = '#ef4444'; }
      }

      /* growth curve */
      history.push({ month: elapsed, size: effSize });
      if (history.length > 60) history.shift();
      drawGrowthCurve();

      _raf(requestAnimationFrame(drawSim));
    }

    function drawGrowthCurve() {
      var w = chartCv.width / dpr, h = chartCv.height / dpr;
      cCtx.clearRect(0, 0, w, h);
      var pad = { t: 25, r: 15, b: 30, l: 45 };
      var pw = w - pad.l - pad.r, ph = h - pad.t - pad.b;

      /* axes */
      cCtx.strokeStyle = 'rgba(148,163,184,0.2)'; cCtx.lineWidth = 1;
      cCtx.beginPath(); cCtx.moveTo(pad.l, pad.t); cCtx.lineTo(pad.l, h - pad.b); cCtx.lineTo(w - pad.r, h - pad.b); cCtx.stroke();

      /* labels */
      cCtx.font = '10px Inter, sans-serif'; cCtx.fillStyle = '#64748b'; cCtx.textAlign = 'center';
      cCtx.fillText('Time (months)', w / 2, h - 5);
      cCtx.save(); cCtx.translate(12, h / 2); cCtx.rotate(-Math.PI / 2); cCtx.fillText('Size (mm)', 0, 0); cCtx.restore();

      /* title */
      cCtx.font = 'bold 11px Inter, sans-serif'; cCtx.fillStyle = '#94a3b8'; cCtx.textAlign = 'left';
      cCtx.fillText('Growth Curve', pad.l, 14);

      if (history.length < 2) return;
      var maxS = 0; history.forEach(function (p) { if (p.size > maxS) maxS = p.size; });
      maxS = Math.max(maxS, 30);

      /* fill under curve */
      cCtx.save();
      cCtx.beginPath();
      history.forEach(function (p, i) {
        var x = pad.l + (p.month / 24) * pw;
        var y = h - pad.b - (p.size / maxS) * ph;
        if (i === 0) cCtx.moveTo(x, y); else cCtx.lineTo(x, y);
      });
      cCtx.lineTo(pad.l + (history[history.length - 1].month / 24) * pw, h - pad.b);
      cCtx.lineTo(pad.l + (history[0].month / 24) * pw, h - pad.b);
      cCtx.closePath();
      var fg = cCtx.createLinearGradient(0, pad.t, 0, h - pad.b);
      fg.addColorStop(0, 'rgba(251,191,36,0.2)'); fg.addColorStop(1, 'rgba(251,191,36,0)');
      cCtx.fillStyle = fg; cCtx.fill();
      cCtx.restore();

      /* line */
      cCtx.beginPath();
      cCtx.strokeStyle = '#fbbf24'; cCtx.lineWidth = 2;
      history.forEach(function (p, i) {
        var x = pad.l + (p.month / 24) * pw;
        var y = h - pad.b - (p.size / maxS) * ph;
        if (i === 0) cCtx.moveTo(x, y); else cCtx.lineTo(x, y);
      });
      cCtx.stroke();

      /* threshold lines */
      [{ thr: 10, label: 'LR-3→4', color: '#f97316' }, { thr: 20, label: 'LR-4→5', color: '#ef4444' }].forEach(function (th) {
        if (th.thr <= maxS) {
          var y = h - pad.b - (th.thr / maxS) * ph;
          cCtx.strokeStyle = th.color + '40'; cCtx.lineWidth = 1; cCtx.setLineDash([4, 3]);
          cCtx.beginPath(); cCtx.moveTo(pad.l, y); cCtx.lineTo(w - pad.r, y); cCtx.stroke();
          cCtx.setLineDash([]);
          cCtx.font = '9px Inter, sans-serif'; cCtx.fillStyle = th.color; cCtx.textAlign = 'right';
          cCtx.fillText(th.label, w - pad.r - 4, y - 3);
        }
      });
    }

    drawSim();
  }

  /* ═══════════════════════════════════════════
     7. Epidemiology Dashboard
     ═══════════════════════════════════════════ */
  function buildEpiDashboard() {
    var wrap = q('#module-1-epi-wrap');
    if (!wrap) return;
    wrap.innerHTML =
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-bottom:16px;">' +
        mkStatCard('924K', 'New Cases/Year', '#ef4444') +
        mkStatCard('830K', 'Deaths/Year', '#f97316') +
        mkStatCard('#1', 'Cause of Cancer Death (Africa)', '#f59e0b') +
        mkStatCard('#3', 'Cause of Cancer Death (Global)', '#8b5cf6') +
        mkStatCard('60-70%', '5yr Survival (Early)', '#10b981') +
        mkStatCard('~5%', '5yr Survival (Late)', '#ef4444') +
      '</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">' +
        '<div id="m1-epi-region"></div>' +
        '<div id="m1-epi-trend"></div>' +
      '</div>';

    setTimeout(function () {
      var reg = document.getElementById('m1-epi-region');
      if (reg) {
        Components.createChart(reg, 'doughnut', {
          labels: ['Asia-Pacific', 'Sub-Saharan Africa', 'Europe', 'North America', 'Other'],
          datasets: [{ data: [75, 10, 5, 5, 5], backgroundColor: ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#64748b'], borderColor: '#0f172a', borderWidth: 3 }]
        }, {
          plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', padding: 8, font: { size: 11 } } } },
          title: { display: true, text: 'HCC Distribution by Region (%)', color: '#e2e8f0', font: { size: 13 } },
          cutout: '50%'
        });
      }
      var trend = document.getElementById('m1-epi-trend');
      if (trend) {
        Components.createChart(trend, 'line', {
          labels: ['2000', '2005', '2010', '2015', '2020', '2025'],
          datasets: [{
            label: 'Global HCC Incidence (thousands)',
            data: [560, 620, 700, 780, 860, 924],
            borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)',
            fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#ef4444'
          }, {
            label: 'HCC Mortality (thousands)',
            data: [510, 560, 630, 710, 780, 830],
            borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.1)',
            fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#f59e0b'
          }]
        }, {
          plugins: { legend: { labels: { color: '#94a3b8', font: { size: 11 } } } },
          title: { display: true, text: 'HCC Incidence & Mortality Trend', color: '#e2e8f0', font: { size: 13 } },
          scales: { x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(148,163,184,0.08)' } }, y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(148,163,184,0.08)' } } }
        });
      }
    }, 200);
  }

  /* ═══════════════════════════════════════════
     8. Code Block
     ═══════════════════════════════════════════ */
  function buildCode() {
    var wrap = q('#module-1-code .code-container');
    if (!wrap) return;
    var code = [
      '# Module 1: Synthetic Liver Volume & Tumour Generation',
      'import numpy as np',
      'import matplotlib.pyplot as plt',
      'from mpl_toolkits.mplot3d import Axes3D',
      '',
      'def create_synthetic_liver(size=128):',
      '    """Generate a 3D synthetic liver volume."""',
      '    x, y, z = np.meshgrid(',
      '        np.linspace(-1, 1, size),',
      '        np.linspace(-1, 1, size),',
      '        np.linspace(-1, 1, size))',
      '    # Ellipsoidal shape — right lobe larger',
      '    liver = ((x/0.8)**2 + (y/0.6)**2 + (z/0.5)**2) < 1',
      '    return liver.astype(np.float32)',
      '',
      'def add_tumour(volume, center, radius, label=2):',
      '    """Add a spherical tumour at given centre & radius."""',
      '    x, y, z = np.meshgrid(',
      '        np.linspace(-1, 1, volume.shape[0]),',
      '        np.linspace(-1, 1, volume.shape[1]),',
      '        np.linspace(-1, 1, volume.shape[2]))',
      '    mask = ((x-center[0])**2 + (y-center[1])**2 +',
      '            (z-center[2])**2) < radius**2',
      '    volume[mask] = label',
      '    return volume',
      '',
      '# Create synthetic liver with tumour',
      'liver = create_synthetic_liver(128)',
      'liver = add_tumour(liver, center=(0.2, 0.1, 0), radius=0.1)',
      '',
      '# Visualise 3D volume + cross-section',
      'fig = plt.figure(figsize=(12, 5))',
      'ax1 = fig.add_subplot(121, projection="3d")',
      'ax1.set_title("Liver with HCC Tumour")',
      'ax2 = fig.add_subplot(122)',
      'mid = liver.shape[2] // 2',
      'ax2.imshow(liver[:, :, mid], cmap="hot")',
      'ax2.set_title(f"Axial slice {mid}")',
      'plt.tight_layout(); plt.show()',
      '',
      '# Statistics',
      'print(f"Liver voxels:  {np.sum(liver > 0):,}")',
      'print(f"Tumour voxels: {np.sum(liver == 2):,}")',
      'print(f"Tumour ratio:  {np.sum(liver==2)/np.sum(liver>0)*100:.1f}%")'
    ].join('\n');
    Components.createCodeBlock(wrap, code);
  }

  /* ═══════════════════════════════════════════
     9. Quiz
     ═══════════════════════════════════════════ */
  function buildQuiz() {
    var wrap = q('#module-1-quiz .quiz-container');
    if (!wrap) return;
    Components.createQuiz(wrap, [
      { q: 'Which is the largest lobe of the liver?', options: ['Right lobe', 'Left lobe', 'Caudate lobe', 'Quadrate lobe'], correct: 0, explanation: 'The right lobe comprises ~60-65% of total liver mass and is the most common site for HCC development.' },
      { q: 'Which viral hepatitis is most commonly associated with HCC worldwide?', options: ['Hepatitis A', 'Hepatitis B', 'Hepatitis D', 'Hepatitis E'], correct: 1, explanation: 'Hepatitis B is the most common cause globally, with 296 million chronic carriers worldwide, especially in endemic regions of Asia and Sub-Saharan Africa.' },
      { q: 'What is the approximate 5-year survival rate for early-stage HCC?', options: ['5-10%', '20-30%', '40-50%', '60-70%'], correct: 3, explanation: 'Early detection and treatment achieve 60-70% five-year survival, compared to ~5% for late-stage. This underscores the critical importance of screening.' },
      { q: 'What is the classic imaging feature of HCC on multiphase CT?', options: ['Uniform enhancement', 'Arterial hyperenhancement with portal venous washout', 'Progressive centripetal enhancement', 'Peripheral rim enhancement only'], correct: 1, explanation: 'The hallmark of HCC is APHE with washout on portal venous/delayed phases, reflecting the tumour\'s predominantly arterial blood supply.' },
      { q: 'What percentage of HCC patients have underlying cirrhosis?', options: ['20-30%', '40-50%', '60-70%', '80-90%'], correct: 3, explanation: 'Cirrhosis is present in 80-90% of HCC patients, making cirrhotic patients the primary screening population.' },
      { q: 'Which CT phase shows maximum arterial enhancement?', options: ['Non-contrast (0s)', 'Arterial phase (25-30s)', 'Portal venous (60-70s)', 'Delayed phase (3-5 min)'], correct: 1, explanation: 'The arterial phase at 25-30 seconds post-injection shows peak arterial enhancement, which is when HCC tumours demonstrate maximum brightness.' }
    ]);
  }

  /* ═══════════════════════════════════════════
     10. Research Insight / Reflection
     ═══════════════════════════════════════════ */
  function buildReflection() {
    var wrap = q('#module-1-reflection .reflection-content');
    if (!wrap) return;
    wrap.innerHTML =
      '<div style="display:grid;gap:16px;">' +
        '<div style="padding:20px;border-radius:12px;background:rgba(139,92,246,.06);border:1px solid rgba(139,92,246,.15);">' +
          '<h4 style="color:#a78bfa;margin-bottom:8px;">Research Motivation</h4>' +
          '<p style="color:#94a3b8;line-height:1.7;">The accurate classification of liver lesions is one of the most challenging tasks in abdominal radiology. Inter-observer agreement among radiologists for LI-RADS classification is only moderate (κ ≈ 0.54-0.68), with significant variability between general radiologists and subspecialty-trained abdominal radiologists.</p>' +
        '</div>' +
        '<div style="padding:20px;border-radius:12px;background:rgba(59,130,246,.06);border:1px solid rgba(59,130,246,.15);">' +
          '<h4 style="color:#60a5fa;margin-bottom:8px;">Why Automate LI-RADS?</h4>' +
          '<p style="color:#94a3b8;line-height:1.7;">Automated classification can: (1) reduce diagnostic variability, (2) serve as a second-reader to catch missed lesions, (3) provide quantitative measurements more reproducible than visual assessment, and (4) help resource-limited settings where subspecialty radiologists are scarce.</p>' +
        '</div>' +
        '<div style="padding:20px;border-radius:12px;background:rgba(16,185,129,.06);border:1px solid rgba(16,185,129,.15);">' +
          '<h4 style="color:#34d399;margin-bottom:8px;">Looking Ahead</h4>' +
          '<p style="color:#94a3b8;line-height:1.7;">In the modules that follow, we will explore how CT imaging works, understand multiphase acquisition, master the LI-RADS criteria, and then build AI models that automatically classify liver lesions. Each module builds on this clinical foundation.</p>' +
        '</div>' +
      '</div>';
  }

  /* ═══════════════════════════════════════════
     Helpers
     ═══════════════════════════════════════════ */
  function q(sel) { return document.querySelector(sel); }

  function mkSlider(parent, label, min, max, val, cb) {
    var w = document.createElement('div');
    w.style.cssText = 'flex:1;min-width:180px;margin:4px 0;';
    w.innerHTML =
      '<label style="display:block;font-size:13px;color:#cbd5e1;margin-bottom:4px;">' + label + '</label>' +
      '<div style="display:flex;align-items:center;gap:10px;">' +
        '<input type="range" min="' + min + '" max="' + max + '" value="' + val + '" step="1" style="flex:1;accent-color:#3b82f6;" />' +
        '<span style="min-width:40px;text-align:center;font-weight:600;color:#60a5fa;font-size:13px;">' + val + '</span>' +
      '</div>';
    var inp = w.querySelector('input');
    var disp = w.querySelector('span');
    inp.addEventListener('input', function () { disp.textContent = inp.value; cb(Number(inp.value)); });
    parent.appendChild(w);
  }

  function mkToggle(parent, label, val, cb) {
    var w = document.createElement('label');
    w.style.cssText = 'display:inline-flex;align-items:center;gap:8px;cursor:pointer;font-size:13px;color:#cbd5e1;margin:4px 0;';
    var inp = document.createElement('input');
    inp.type = 'checkbox';
    inp.checked = val;
    inp.style.cssText = 'accent-color:#3b82f6;width:16px;height:16px;';
    inp.addEventListener('change', function () { cb(inp.checked); });
    w.appendChild(inp);
    w.appendChild(document.createTextNode(label));
    parent.appendChild(w);
  }

  function mkBar(label, val, color) {
    return '<div style="margin:3px 0;">' +
      '<div style="display:flex;justify-content:space-between;font-size:11px;color:#94a3b8;"><span>' + label + '</span><span>' + val + '%</span></div>' +
      '<div style="width:100%;height:5px;background:rgba(148,163,184,.1);border-radius:3px;overflow:hidden;">' +
      '<div style="width:' + val + '%;height:100%;background:' + color + ';border-radius:3px;transition:width .4s;"></div></div></div>';
  }

  function mkStatCard(value, label, color) {
    return '<div style="padding:14px;border-radius:12px;background:rgba(30,41,59,.5);border:1px solid ' + color + '20;text-align:center;">' +
      '<div style="font-size:22px;font-weight:700;color:' + color + ';font-family:Orbitron,monospace;">' + value + '</div>' +
      '<div style="font-size:11px;color:#94a3b8;margin-top:2px;">' + label + '</div></div>';
  }

})();
