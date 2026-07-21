let _m10AnimFrame = null;

ModuleEngine.register('10', {
  init(container) {
    var header = Components.createModuleHeader('10', 'Phase-aware 3D CNN');
    container.appendChild(header);

    const state = {
      inputSize: 64,
      filters: 32,
      nBlocks: 3,
      fusionMethod: 'attention',
      dropoutRate: 0.5,
      animating: false,
      showAttention: true,
      showResidual: true,
      selectedComponent: null,
      pulseStep: 0,
      compareMode: false,
      compareFilters: 64
    };

    const page = document.createElement('div');
    page.className = 'module-page';

    const objectives = document.createElement('div');
    objectives.className = 'module-card objectives';
    objectives.innerHTML = '<h2>Learning Objectives</h2><ul><li>Understand why multiphase CT requires phase-aware processing</li><li>Learn the three-branch CNN architecture design</li><li>Understand attention-based feature fusion</li><li>Explore residual connections and their benefits</li><li>Compare phase-aware vs standard 3D CNN approaches</li></ul>';
    page.appendChild(objectives);

    const archSection = document.createElement('div');
    archSection.className = 'module-card';
    archSection.innerHTML = '<h2>Interactive Architecture Explorer</h2>';
    page.appendChild(archSection);

    const archContainer = document.createElement('div');
    archContainer.style.cssText = 'display:flex;gap:16px;flex-wrap:wrap;';
    const canvasWrap = document.createElement('div');
    canvasWrap.style.cssText = 'flex:1;min-width:280px;';
    const canvas = document.createElement('canvas');
    canvas.width = 900;
    canvas.height = 620;
    canvas.style.cssText = 'width:100%;border-radius:8px;background:var(--bg-primary);border:1px solid var(--border);';
    canvasWrap.appendChild(canvas);
    archContainer.appendChild(canvasWrap);

    const detailPanel = document.createElement('div');
    detailPanel.style.cssText = 'width:300px;min-height:620px;background:var(--bg-secondary);border:1px solid var(--border);border-radius:8px;padding:16px;overflow-y:auto;font-size:13px;';
    detailPanel.innerHTML = '<h3 style="color:var(--color-primary-light);margin-top:0">Component Details</h3><p style="color:var(--text-muted)">Click any component in the diagram to see details.</p>';
    archContainer.appendChild(detailPanel);
    archSection.appendChild(archContainer);

    const controlsRow = document.createElement('div');
    controlsRow.style.cssText = 'display:flex;flex-wrap:wrap;gap:12px;margin-top:16px;';
    archSection.appendChild(controlsRow);

    Components.createSlider(controlsRow, { label: 'Filters per Branch', min: 16, max: 64, value: 32, step: 8, onChange: v => { state.filters = v; draw(); } });
    Components.createSlider(controlsRow, { label: 'Conv Blocks per Branch', min: 2, max: 5, value: 3, step: 1, onChange: v => { state.nBlocks = v; draw(); } });
    Components.createSlider(controlsRow, { label: 'Input Size', min: 32, max: 128, value: 64, step: 16, onChange: v => { state.inputSize = v; draw(); } });
    Components.createSlider(controlsRow, { label: 'Dropout Rate', min: 0, max: 0.5, value: 0.5, step: 0.05, onChange: v => { state.dropoutRate = v; } });

    const btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;flex-wrap:wrap;gap:10px;margin-top:12px;';
    archSection.appendChild(btnRow);

    const fusionSelect = document.createElement('select');
    fusionSelect.style.cssText = 'padding:6px 10px;border-radius:6px;background:var(--color-surface);color:var(--text-primary);border:1px solid var(--border);';
    ['attention', 'concatenation', 'gating'].forEach(m => {
      const o = document.createElement('option');
      o.value = m;
      o.textContent = m.charAt(0).toUpperCase() + m.slice(1);
      fusionSelect.appendChild(o);
    });
    fusionSelect.onchange = () => { state.fusionMethod = fusionSelect.value; draw(); };
    btnRow.appendChild(fusionSelect);

    function makeBtn(label, onClick) {
      const b = document.createElement('button');
      b.textContent = label;
      b.className = 'btn-primary';
      b.onclick = onClick;
      btnRow.appendChild(b);
      return b;
    }

    makeBtn('Animate Data Flow', () => { state.animating = !state.animating; state.pulseStep = 0; });
    const attnBtn = makeBtn('Toggle Attention Weights', () => { state.showAttention = !state.showAttention; draw(); });
    const resBtn = makeBtn('Toggle Residual Connections', () => { state.showResidual = !state.showResidual; draw(); });

    const paramDisplay = document.createElement('div');
    paramDisplay.style.cssText = 'margin-top:16px;padding:16px;background:var(--bg-secondary);border:1px solid var(--border);border-radius:8px;display:flex;flex-wrap:wrap;gap:24px;';
    archSection.appendChild(paramDisplay);

    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    const componentInfo = {
      'conv3d': { title: '3D Convolution', desc: 'Kernel size (3,3,3) captures spatial-temporal features across volumetric data.\n\nFormula: (f*x)(t,i,j) = ΣΣΣ f(k,l,m)·x(t+k,i+l,j+m)\n\nEach filter learns to detect specific 3D patterns across the CT volume.' },
      'batchnorm': { title: 'Batch Normalization', desc: 'Normalizes activations across the batch dimension.\n\nReduces internal covariate shift, enabling faster training and higher learning rates.\n\nFormula: y = (x - μ) / √(σ² + ε) · γ + β' },
      'residual': { title: 'Residual Connection', desc: 'Skip connection: y = F(x) + x\n\nAllows gradients to flow directly through the network, preventing vanishing gradients.\n\nEnables training of deeper networks by providing a shortcut for information flow.' },
      'attention': { title: 'Cross-Attention Fusion', desc: 'Attention(Q,K,V) = softmax(QK^T / √d) · V\n\nQueries from one phase attend to keys/values from all phases.\n\nLearns which phases contribute most for each feature, enabling adaptive fusion.' },
      'classifier': { title: 'Classification Head', desc: 'Fully connected layers: 512 → 256 → 128 → 3\n\nMaps fused features to LI-RADS class probabilities.\n\nDropout regularization prevents overfitting on small medical datasets.' },
      'pool': { title: 'Global Average Pooling', desc: 'Reduces each feature map to a single value by averaging.\n\nDrastically reduces parameters while retaining spatial information.\n\nOutput: (B, C, 1, 1, 1) → (B, C)' },
      'input': { title: '3D CT Volume Input', desc: 'Single-phase volumetric input of shape (B, 1, D, H, W).\n\nEach branch receives its respective contrast phase of the multiphase CT scan.' },
      'fusion_concat': { title: 'Concatenation Fusion', desc: 'Simply concatenates feature vectors from all branches.\n\nOutput dim = 3 × feature_dim.\n\nSimple but does not model inter-phase relationships.' },
      'fusion_gating': { title: 'Gated Fusion', desc: 'Learnable gating mechanism that weights each branch.\n\ng = σ(W·[f1; f2; f3])\noutput = g⊙f1 + (1-g)⊙f2 + (1-g)⊙f3\n\nAdaptive but simpler than full attention.' }
    };

    let componentBoxes = [];

    function calcParams() {
      const f = state.filters;
      const nb = state.nBlocks;
      const convParams = (1 * f * 27 + f) + (nb - 1) * (f * 27 * f + f);
      const branchParams = convParams * 3 + f * 3;
      const totalBranch = branchParams * 3;
      let fusionP = 0;
      if (state.fusionMethod === 'attention') fusionP = f * f * 3 + f * 3;
      else if (state.fusionMethod === 'concatenation') fusionP = f * 3;
      else fusionP = f * 3 * 3 + f;
      const clsP = f * 256 + 256 + 256 * 128 + 128 + 128 * 3 + 3;
      const total = totalBranch + fusionP + clsP;
      const sizeMB = (total * 4) / (1024 * 1024);
      return { total, sizeMB, totalBranch, fusionP, clsP };
    }

    function draw() {
      componentBoxes = [];
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#0d1117';
      ctx.fillRect(0, 0, W, H);

      const branches = [
        { label: 'Arterial Phase', color: '#2563eb', x: 80 },
        { label: 'Portal Venous Phase', color: '#9333ea', x: 340 },
        { label: 'Delayed Phase', color: '#06b6d4', x: 600 }
      ];
      const f = state.filters;
      const nb = state.nBlocks;
      const inputDim = state.inputSize;
      const featDim = Math.floor(inputDim / (nb > 0 ? Math.pow(2, Math.ceil(nb / 2)) : 1));
      const labelY = 14;

      ctx.fillStyle = '#8b949e';
      ctx.font = '13px monospace';
      ctx.fillText('Input: (' + inputDim + ',' + inputDim + ',' + inputDim + ')', 320, labelY);

      const branchY = [80, 80, 80];
      branches.forEach((br, bi) => {
        const x = br.x;
        const y = branchY[bi];
        ctx.fillStyle = br.color + '33';
        ctx.strokeStyle = br.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(x, y, 220, 360, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = br.color;
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(br.label, x + 110, y - 6);
        ctx.textAlign = 'left';

        ctx.fillStyle = '#c9d1d9';
        ctx.font = '10px monospace';
        ctx.fillText('Vol: ' + inputDim + '³', x + 10, y + 18);
        draw3DBox(ctx, x + 70, y + 8, 50, 40, br.color + '66', br.color);

        componentBoxes.push({ x, y: y - 10, w: 220, h: 20, type: 'input', branch: bi });

        let cy = y + 60;
        for (let b = 0; b < nb; b++) {
          const bx = x + 15;
          const bw = 190;
          const bh = 36;
          ctx.fillStyle = '#1c2533';
          ctx.strokeStyle = '#444d56';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(bx, cy, bw, bh, 4);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = '#e6edf3';
          ctx.font = '10px monospace';
          ctx.fillText('Conv3D ' + (b === 0 ? '1→' + f : f + '→' + f), bx + 8, cy + 14);
          ctx.fillStyle = '#8b949e';
          ctx.font = '9px monospace';
          ctx.fillText('BN + ReLU', bx + 8, cy + 28);
          ctx.fillStyle = br.color + '44';
          ctx.font = '9px monospace';
          ctx.textAlign = 'right';
          ctx.fillText('k=3,3,3', bx + bw - 6, cy + 14);
          ctx.textAlign = 'left';

          componentBoxes.push({ x: bx, y: cy, w: bw, h: bh, type: 'conv3d', branch: bi, block: b });

          if (state.showResidual && b > 0) {
            ctx.strokeStyle = br.color + 'aa';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(x + 25, cy);
            ctx.quadraticCurveTo(x - 5, cy - 18, x + 25, cy + 10);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = br.color + 'cc';
            ctx.font = '8px monospace';
            ctx.fillText('skip', x - 18, cy - 4);

            componentBoxes.push({ x: x - 20, y: cy - 22, w: 40, h: 14, type: 'residual', branch: bi });
          }
          cy += bh + 6;
        }

        const poolY = cy;
        ctx.fillStyle = '#1a2332';
        ctx.strokeStyle = '#2d6a4f';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(x + 15, poolY, 190, 24, 4);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#7ee787';
        ctx.font = '10px monospace';
        ctx.fillText('MaxPool3D → GAP', x + 30, poolY + 16);

        componentBoxes.push({ x: x + 15, y: poolY, w: 190, h: 24, type: 'pool', branch: bi });

        const fvY = poolY + 34;
        ctx.fillStyle = br.color + '22';
        ctx.strokeStyle = br.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(x + 40, fvY, 140, 22, 4);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = br.color;
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('Feature vec: ' + f, x + 110, fvY + 15);
        ctx.textAlign = 'left';
      });

      const fusionY = 200;
      const fusionX = 340;
      ctx.fillStyle = '#ff6b35';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Fusion Module: ' + state.fusionMethod.toUpperCase(), fusionX + 110, fusionY - 4);
      ctx.textAlign = 'left';

      branches.forEach((br, bi) => {
        ctx.strokeStyle = br.color + '88';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 3]);
        ctx.beginPath();
        ctx.moveTo(br.x + 110, 420);
        ctx.quadraticCurveTo(br.x + 110, fusionY + 30, fusionX + 30 + bi * 60, fusionY + 30);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      const fbY = fusionY + 20;
      ctx.fillStyle = '#2d1f0e';
      ctx.strokeStyle = '#ff6b35';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(fusionX, fbY, 220, 60, 8);
      ctx.fill();
      ctx.stroke();

      if (state.fusionMethod === 'attention') {
        ctx.fillStyle = '#f0883e';
        ctx.font = '10px monospace';
        ctx.fillText('Cross-Attention', fusionX + 10, fbY + 18);
        ctx.fillStyle = '#8b949e';
        ctx.fillText('Q, K, V projections', fusionX + 10, fbY + 32);
        ctx.fillText('Attention(Q,K,V) = softmax(QK^T/√d)·V', fusionX + 10, fbY + 46);
      } else if (state.fusionMethod === 'concatenation') {
        ctx.fillStyle = '#f0883e';
        ctx.font = '10px monospace';
        ctx.fillText('Concatenation', fusionX + 10, fbY + 18);
        ctx.fillStyle = '#8b949e';
        ctx.fillText('dim: 3 × ' + f + ' = ' + (f * 3), fusionX + 10, fbY + 32);
        ctx.fillText('No learned interaction', fusionX + 10, fbY + 46);
      } else {
        ctx.fillStyle = '#f0883e';
        ctx.font = '10px monospace';
        ctx.fillText('Gated Fusion', fusionX + 10, fbY + 18);
        ctx.fillStyle = '#8b949e';
        ctx.fillText('g = σ(W·[f1;f2;f3])', fusionX + 10, fbY + 32);
        ctx.fillText('output = Σ gi·fi', fusionX + 10, fbY + 46);
      }

      componentBoxes.push({ x: fusionX, y: fbY, w: 220, h: 60, type: state.fusionMethod === 'attention' ? 'attention' : state.fusionMethod === 'gating' ? 'fusion_gating' : 'fusion_concat' });

      if (state.showAttention && state.fusionMethod === 'attention') {
        const attnY = fbY + 70;
        ctx.fillStyle = '#1a2332';
        ctx.strokeStyle = '#f0883eaa';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(fusionX + 10, attnY, 200, 20, 3);
        ctx.fill();
        ctx.stroke();
        const weights = [0.42, 0.35, 0.23];
        const cols = ['#2563eb', '#9333ea', '#06b6d4'];
        let wx = fusionX + 12;
        weights.forEach((w, i) => {
          ctx.fillStyle = cols[i] + 'cc';
          ctx.fillRect(wx, attnY + 2, 200 * w - 2, 16);
          ctx.fillStyle = '#fff';
          ctx.font = '8px monospace';
          ctx.fillText((w * 100).toFixed(0) + '%', wx + 4, attnY + 14);
          wx += 200 * w;
        });
      }

      const fusedVY = fbY + (state.showAttention && state.fusionMethod === 'attention' ? 98 : 76);
      ctx.fillStyle = '#ff6b3522';
      ctx.strokeStyle = '#ff6b35';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#ff6b35';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.roundRect(fusionX + 30, fusedVY, 160, 24, 6);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ff6b35';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Fused: ' + f + ' features', fusionX + 110, fusedVY + 16);
      ctx.textAlign = 'left';

      const clsY = fusedVY + 44;
      const clsW = 220;
      ctx.fillStyle = '#1c2533';
      ctx.strokeStyle = '#da3633';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(fusionX, clsY, clsW, 50, 8);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#da3633';
      ctx.font = '10px monospace';
      ctx.fillText('FC: ' + f + '→256→128→3', fusionX + 10, clsY + 16);
      ctx.fillStyle = '#8b949e';
      ctx.fillText('Dropout: ' + state.dropoutRate.toFixed(2), fusionX + 10, clsY + 32);
      ctx.fillText('Softmax', fusionX + 10, clsY + 44);

      componentBoxes.push({ x: fusionX, y: clsY, w: clsW, h: 50, type: 'classifier' });

      const probY = clsY + 60;
      const classes = ['LR-3 (Benign)', 'LR-4 (Probable HCC)', 'LR-5 (Definite HCC)'];
      const probs = [0.15, 0.35, 0.50];
      const pcols = ['#3fb950', '#d29922', '#da3633'];
      classes.forEach((cl, i) => {
        ctx.fillStyle = '#1c2533';
        ctx.beginPath();
        ctx.roundRect(fusionX, probY + i * 22, clsW, 18, 3);
        ctx.fill();
        ctx.fillStyle = pcols[i] + 'cc';
        ctx.fillRect(fusionX + 1, probY + i * 22 + 1, (clsW - 2) * probs[i], 16);
        ctx.fillStyle = '#e6edf3';
        ctx.font = '9px monospace';
        ctx.fillText(cl + ' (' + (probs[i] * 100).toFixed(0) + '%)', fusionX + 6, probY + i * 22 + 13);
      });

      componentBoxes.push({ x: fusionX, y: probY, w: clsW, h: 66, type: 'classifier' });

      const params = calcParams();
      paramDisplay.innerHTML = [
        '<div style="flex:1;min-width:140px"><div style="color:var(--text-muted);font-size:11px">Total Parameters</div><div style="color:var(--color-primary-light);font-size:20px;font-weight:bold">' + params.total.toLocaleString() + '</div></div>',
        '<div style="flex:1;min-width:140px"><div style="color:var(--text-muted);font-size:11px">Model Size</div><div style="color:var(--color-primary-light);font-size:20px;font-weight:bold">' + params.sizeMB.toFixed(2) + ' MB</div></div>',
        '<div style="flex:1;min-width:140px"><div style="color:var(--text-muted);font-size:11px">Branch Params</div><div style="color:var(--color-success);font-size:20px;font-weight:bold">' + params.totalBranch.toLocaleString() + '</div></div>',
        '<div style="flex:1;min-width:140px"><div style="color:var(--text-muted);font-size:11px">Fusion Params</div><div style="color:var(--color-warning);font-size:20px;font-weight:bold">' + params.fusionP.toLocaleString() + '</div></div>',
        '<div style="flex:1;min-width:140px"><div style="color:var(--text-muted);font-size:11px">Classifier Params</div><div style="color:var(--color-error);font-size:20px;font-weight:bold">' + params.clsP.toLocaleString() + '</div></div>',
        '<div style="flex:1;min-width:140px"><div style="color:var(--text-muted);font-size:11px">Feature Dim</div><div style="color:var(--text-primary);font-size:20px;font-weight:bold">' + f + '</div></div>'
      ].join('');
    }

    function draw3DBox(c, x, y, w, h, fill, stroke) {
      const d = 12;
      c.fillStyle = fill;
      c.strokeStyle = stroke;
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(x, y);
      c.lineTo(x + w, y);
      c.lineTo(x + w, y + h);
      c.lineTo(x, y + h);
      c.closePath();
      c.fill();
      c.stroke();
      c.beginPath();
      c.moveTo(x + w, y);
      c.lineTo(x + w + d, y - d);
      c.lineTo(x + w + d, y + h - d);
      c.lineTo(x + w, y + h);
      c.closePath();
      c.fill();
      c.stroke();
      c.beginPath();
      c.moveTo(x, y);
      c.lineTo(x + d, y - d);
      c.lineTo(x + w + d, y - d);
      c.lineTo(x + w, y);
      c.closePath();
      c.fill();
      c.stroke();
    }

    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const mx = (e.clientX - rect.left) * scaleX;
      const my = (e.clientY - rect.top) * scaleY;
      let found = null;
      for (const box of componentBoxes) {
        if (mx >= box.x && mx <= box.x + box.w && my >= box.y && my <= box.y + box.h) {
          found = box;
          break;
        }
      }
      if (found && componentInfo[found.type]) {
        const info = componentInfo[found.type];
        detailPanel.innerHTML = '<h3 style="color:var(--color-primary-light);margin-top:0">' + info.title + '</h3><pre style="white-space:pre-wrap;color:var(--text-primary);font-size:12px;line-height:1.5">' + info.desc + '</pre>';
      } else {
detailPanel.innerHTML = '<h3 style="color:var(--color-primary-light);margin-top:0">Component Details</h3><p style="color:var(--text-muted)">Click any component in the diagram to see details.</p>';
      }
    });

    function animatePulse() {
      if (!state.animating) return;
      state.pulseStep = (state.pulseStep + 2) % 600;
      draw();
      const step = state.pulseStep;
      const phases = [
        { x: 190, color: '#2563eb', target: 450 },
        { x: 450, color: '#9333ea', target: 450 },
        { x: 710, color: '#06b6d4', target: 450 }
      ];
      phases.forEach(p => {
        const progress = Math.min(1, step / 200);
        const py = 420 + (250 - 420) * progress;
        const px = p.x + (450 - p.x) * progress;
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      if (step > 100 && step < 350) {
        const fp = (step - 100) / 250;
        const fx = 340 + 110;
        const fy = 240 + (450 - 240) * Math.min(1, fp);
        ctx.beginPath();
        ctx.arc(fx, fy, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#ff6b35';
        ctx.shadowColor = '#ff6b35';
        ctx.shadowBlur = 20;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      _m10AnimFrame = requestAnimationFrame(animatePulse);
    }

    const origToggle = makeBtn('Stop Animation', () => {
      state.animating = false;
      if (animFrame) cancelAnimationFrame(animFrame);
    });

    draw();

    const theorySection = document.createElement('div');
    theorySection.className = 'module-card';
    theorySection.innerHTML = '<h2>Theory: Phase-aware Architecture Design</h2>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">' +
      '<div class="theory-card"><h3>Why Phase-Aware Processing?</h3><p>Standard 3D CNNs treat all contrast phases equally, losing critical phase-specific diagnostic information. Hepatocellular carcinoma (HCC) exhibits characteristic <strong>arterial enhancement</strong> and <strong>washout</strong> patterns across phases that are essential for LI-RADS classification.</p><p>A phase-aware architecture processes each contrast phase through dedicated feature extractors, preserving and learning phase-specific discriminative patterns before fusing them.</p></div>' +
      '<div class="theory-card"><h3>Three-Branch Design Philosophy</h3><p>Each branch operates on a single contrast phase:</p><ul><li><strong>Arterial Phase</strong>: Captures enhancement patterns of hypervascular tumors</li><li><strong>Portal Venous Phase</strong>: Detects washout characteristics and parenchymal enhancement</li><li><strong>Delayed Phase</strong>: Identifies capsule appearance and threshold growth</li></ul><p>This mirrors how radiologists evaluate multiphase CT — systematically comparing phase-specific features.</p></div>' +
      '<div class="theory-card"><h3>Cross-Attention Mechanism</h3><p>Unlike simple concatenation, cross-attention learns <strong>which phases contribute most</strong> for each feature:</p><p>Attention(Q,K,V) = softmax(QK<sup>T</sup> / √d) · V</p><p>Queries from one branch attend to keys/values from all branches, creating a context-aware representation that captures inter-phase relationships.</p></div>' +
      '<div class="theory-card"><h3>Residual Connections</h3><p>y = F(x) + x</p><p>Skip connections allow gradients to flow directly through the network, solving the vanishing gradient problem. This enables training of deeper networks while preserving low-level features from early layers.</p><p>Empirically, residual connections improve convergence speed by 30-50% and enable training of networks with 20+ layers.</p></div>' +
      '</div>';
    page.appendChild(theorySection);

    const mathSection = document.createElement('div');
    mathSection.className = 'module-card';
    mathSection.innerHTML = '<h2>Mathematical Formulations</h2>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">' +
      '<div class="theory-card" style="font-family:monospace"><h3>3D Convolution</h3><p>(f ∗ x)(t, i, j) = Σ<sub>k</sub> Σ<sub>l</sub> Σ<sub>m</sub> f(k, l, m) · x(t+k, i+l, j+m)</p><p style="font-size:11px;color:var(--text-muted)">Output at position (t,i,j) is the weighted sum of the input volume overlapped by the 3D kernel.</p></div>' +
      '<div class="theory-card" style="font-family:monospace"><h3>Batch Normalization</h3><p>y = (x − μ<sub>B</sub>) / √(σ²<sub>B</sub> + ε) · γ + β</p><p style="font-size:11px;color:var(--text-muted)">γ and β are learnable scale and shift parameters. BN stabilizes training by normalizing layer inputs.</p></div>' +
      '<div class="theory-card" style="font-family:monospace"><h3>Multi-Head Attention</h3><p>head<sub>i</sub> = Attention(QW<sup>Q</sup><sub>i</sub>, KW<sup>K</sup><sub>i</sub>, VW<sup>V</sup><sub>i</sub>)</p><p>MultiHead(Q,K,V) = Concat(head<sub>1</sub>, ..., head<sub>h</sub>)W<sup>O</sup></p></div>' +
      '<div class="theory-card" style="font-family:monospace"><h3>Residual Block</h3><p>y = F(x, {W<sub>i</sub>}) + x</p><p>When dimensions differ: y = F(x) + W<sub>s</sub>·x</p><p style="font-size:11px;color:var(--text-muted)">W<sub>s</sub> is a learned projection matrix for dimension matching.</p></div>' +
      '</div>';
    page.appendChild(mathSection);

    const noveltySection = document.createElement('div');
    noveltySection.className = 'module-card';
    noveltySection.innerHTML = '<h2>Research Novelty</h2>' +
      '<div class="theory-card"><h3>Comparison with Existing Approaches</h3>' +
      '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:13px"><thead><tr style="border-bottom:2px solid var(--border)"><th style="text-align:left;padding:8px;color:var(--color-primary-light)">Approach</th><th style="text-align:left;padding:8px;color:var(--color-primary-light)">Phase Info</th><th style="text-align:left;padding:8px;color:var(--color-primary-light)">Inter-phase Fusion</th><th style="text-align:left;padding:8px;color:var(--color-primary-light)">Adaptive Weighting</th><th style="text-align:left;padding:8px;color:var(--color-primary-light)">Residual</th></tr></thead><tbody>' +
      '<tr style="border-bottom:1px solid var(--color-surface)"><td style="padding:8px">Single-phase 3D CNN</td><td style="padding:8px;color:var(--color-error)">✗ One phase only</td><td style="padding:8px;color:var(--color-error)">✗ N/A</td><td style="padding:8px;color:var(--color-error)">✗</td><td style="padding:8px;color:var(--color-warning)">Optional</td></tr>' +
      '<tr style="border-bottom:1px solid var(--color-surface)"><td style="padding:8px">Multi-phase Concatenation</td><td style="padding:8px;color:var(--color-warning)">✓ All phases</td><td style="padding:8px;color:var(--color-error)">✗ Naive concat</td><td style="padding:8px;color:var(--color-error)">✗</td><td style="padding:8px;color:var(--color-warning)">Optional</td></tr>' +
      '<tr style="border-bottom:1px solid var(--color-surface)"><td style="padding:8px">Two-stream networks</td><td style="padding:8px;color:var(--color-warning)">✓ Two phases</td><td style="padding:8px;color:var(--color-warning)">✓ Limited</td><td style="padding:8px;color:var(--color-error)">✗</td><td style="padding:8px;color:var(--color-success)">✓</td></tr>' +
      '<tr style="border-bottom:1px solid var(--color-surface)"><td style="padding:8px"><strong>Our Phase-Aware CNN</strong></td><td style="padding:8px;color:var(--color-success)"><strong>✓ All 3 phases</strong></td><td style="padding:8px;color:var(--color-success)"><strong>✓ Cross-attention</strong></td><td style="padding:8px;color:var(--color-success)"><strong>✓ Learned weights</strong></td><td style="padding:8px;color:var(--color-success)"><strong>✓</strong></td></tr>' +
      '</tbody></table></div></div>';
    page.appendChild(noveltySection);

    const codeSection = document.createElement('div');
    codeSection.className = 'module-card';
    codeSection.innerHTML = '<h2>Implementation Code</h2>';
    Components.createCodeBlock(codeSection, `import torch
import torch.nn as nn
import torch.nn.functional as F

class PhaseBranch3D(nn.Module):
    def __init__(self, in_channels=1, filters=32, n_blocks=3):
        super().__init__()
        self.blocks = nn.ModuleList()
        self.blocks.append(nn.Sequential(
            nn.Conv3d(in_channels, filters, 3, padding=1),
            nn.BatchNorm3d(filters),
            nn.ReLU(inplace=True)
        ))
        for _ in range(n_blocks - 1):
            self.blocks.append(nn.Sequential(
                nn.Conv3d(filters, filters, 3, padding=1),
                nn.BatchNorm3d(filters),
                nn.ReLU(inplace=True)
            ))
        self.pool = nn.MaxPool3d(2)
        self.global_pool = nn.AdaptiveAvgPool3d(1)

    def forward(self, x):
        for block in self.blocks:
            residual = block(x) if block[0].in_channels == block[0].out_channels else None
            x = block(x)
            if residual is not None:
                x = x + residual
        x = self.pool(x)
        x = self.global_pool(x)
        return x.view(x.size(0), -1)

class CrossAttentionFusion(nn.Module):
    def __init__(self, feature_dim, n_heads=4):
        super().__init__()
        self.attention = nn.MultiheadAttention(feature_dim, n_heads, batch_first=True)
        self.norm = nn.LayerNorm(feature_dim)

    def forward(self, features_list):
        stacked = torch.stack(features_list, dim=1)
        fused, weights = self.attention(stacked, stacked, stacked)
        fused = self.norm(fused.mean(dim=1))
        return fused, weights

class PhaseAware3DCNN(nn.Module):
    def __init__(self, in_channels=1, n_classes=3, filters=32, n_blocks=3):
        super().__init__()
        self.arterial_branch = PhaseBranch3D(in_channels, filters, n_blocks)
        self.portal_branch = PhaseBranch3D(in_channels, filters, n_blocks)
        self.delayed_branch = PhaseBranch3D(in_channels, filters, n_blocks)
        self.fusion = CrossAttentionFusion(filters)
        self.classifier = nn.Sequential(
            nn.Linear(filters, 256),
            nn.ReLU(inplace=True),
            nn.Dropout(0.5),
            nn.Linear(256, 128),
            nn.ReLU(inplace=True),
            nn.Dropout(0.3),
            nn.Linear(128, n_classes)
        )

    def forward(self, arterial, portal, delayed):
        feat_a = self.arterial_branch(arterial)
        feat_p = self.portal_branch(portal)
        feat_d = self.delayed_branch(delayed)
        fused, attn_weights = self.fusion([feat_a, feat_p, feat_d])
        logits = self.classifier(fused)
        probs = F.softmax(logits, dim=1)
        return logits, probs, attn_weights

model = PhaseAware3DCNN(in_channels=1, n_classes=3, filters=32)
total_params = sum(p.numel() for p in model.parameters())
print(f"Phase-aware CNN parameters: {total_params:,}")

arterial = torch.randn(2, 1, 64, 64, 64)
portal = torch.randn(2, 1, 64, 64, 64)
delayed = torch.randn(2, 1, 64, 64, 64)
logits, probs, attn = model(arterial, portal, delayed)
print(f"Output shape: {logits.shape}")
print(f"Probabilities: {probs}")
print(f"Attention weights: {attn}")
`);
    page.appendChild(codeSection);

    const quizSection = document.createElement('div');
    quizSection.className = 'module-card';
    quizSection.innerHTML = '<h2>Knowledge Check</h2>';
    Components.createQuiz(quizSection, [
      { q: 'Why does the Phase-aware 3D CNN use separate branches for each contrast phase instead of concatenating all phases into a single input?', options: ['To reduce computational cost', 'To preserve phase-specific feature representations before fusion', 'To use different architectures for each phase', 'To enable parallel training on multiple GPUs'], correct: 1, explanation: 'Separary branches allow each phase to be processed by dedicated filters that learn phase-specific patterns (e.g., arterial enhancement, portal washout). This preserves phase-specific information that would be lost if all phases were naively concatenated into a single input volume.' },
      { q: 'In the cross-attention fusion module, what do the attention weights represent?', options: ['The spatial importance of each voxel', 'The relative importance of each contrast phase for the classification', 'The learning rate for each branch', 'The number of filters to allocate per branch'], correct: 1, explanation: 'Attention weights quantify how much each phase contributes to the fused representation. Higher weights indicate that the corresponding phase carries more discriminative information for the current input. This allows the model to adaptively focus on the most informative phase.' },
      { q: 'What is the primary benefit of residual connections in the phase branches?', options: ['They increase the number of parameters', 'They reduce memory usage during inference', 'They prevent vanishing gradients and enable deeper networks', 'They eliminate the need for batch normalization'], correct: 2, explanation: 'Residual connections (y = F(x) + x) create shortcut paths that allow gradients to flow directly through the network during backpropagation. This mitigates the vanishing gradient problem, enabling training of deeper networks while preserving low-level features from early layers.' },
      { q: 'How does the attention-based fusion compare to simple concatenation for multi-phase feature merging?', options: ['Concatenation always performs better due to more parameters', 'Attention adds no computational overhead compared to concatenation', 'Attention learns adaptive phase weighting while concatenation treats all phases equally', 'Concatenation is more interpretable than attention'], correct: 2, explanation: 'Attention-based fusion learns to weight each phase adaptively based on its relevance, while concatenation treats all phases equally by simply stacking feature vectors. Attention enables the model to focus on the most discriminative phases for each input, leading to more nuanced and accurate classifications.' }
    ]);
    page.appendChild(quizSection);

    const reflectionSection = document.createElement('div');
    reflectionSection.className = 'module-card reflection';
    reflectionSection.innerHTML = '<h2>Reflection: Research Contribution</h2>' +
      '<div class="theory-card"><h3>Novelty of the Approach</h3><p>This phase-aware 3D CNN represents a <strong>novel contribution</strong> to medical image analysis by:</p><ul><li><strong>Clinical grounding</strong>: The architecture mirrors how radiologists systematically evaluate multiphase CT, processing each phase before integrating findings</li><li><strong>Adaptive fusion</strong>: Cross-attention dynamically weights phase contributions, unlike fixed concatenation approaches</li><li><strong>End-to-end learning</strong>: Joint optimization of phase-specific features and fusion strategy</li><li><strong>Interpretable attention maps</strong>: The learned attention weights provide clinical insights into which phases are most diagnostic</li></ul></div>' +
      '<div class="theory-card"><h3>Comparison with Single-Phase Methods</h3><p>Single-phase approaches discard 2/3 of the available diagnostic information. Studies show that LI-RADS classification requires evaluation across all contrast phases to distinguish between LR-4 (probable HCC) and LR-5 (definite HCC), as the characteristic enhancement-washout pattern is inherently a multi-phase phenomenon.</p></div>' +
      '<div class="theory-card"><h3>Clinical Rationale</h3><p>The AASLD and EASL guidelines explicitly require multiphase imaging for HCC diagnosis. Our architecture design is thus not merely an engineering choice but a <strong>clinically-motivated design decision</strong> that encodes domain knowledge about how liver lesions are characterized in practice.</p></div>' +
      '<div class="theory-card"><h3>Future Directions</h3><ul><li>Investigate temporal attention across phases</li><li>Explore contrast-enhanced MRI as alternative modality</li><li>Investigate self-supervised pre-training on multiphase CT</li><li>Clinical validation with external cohorts</li></ul></div>';
    page.appendChild(reflectionSection);


    const navHeader = document.createElement('div');
    navHeader.style.cssText = 'padding:1.5rem 1.5rem 0;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.5rem;';
    navHeader.innerHTML = '<h2 class="font-orbitron text-2xl font-bold gradient-text" style="margin:0;">Module 10: 3D CNN</h2><button data-navigate="home" class="px-4 py-2 rounded-lg border border-white/20 text-sm text-gray-300 hover:text-white hover:border-primary-400/50 transition-all cursor-pointer" style="background:rgba(255,255,255,0.04);min-height:40px;" aria-label="Back to Home">&#x2190; Home</button>';
    container.insertBefore(navHeader, container.firstChild);

    container.appendChild(page);
    const navFooter = document.createElement('div');
    navFooter.style.cssText = 'padding:1rem 1.5rem 2rem;display:flex;justify-content:center;';
    navFooter.innerHTML = '<button data-navigate="home" class="px-6 py-3 rounded-xl border border-white/20 text-sm text-gray-300 hover:text-white hover:border-primary-400/50 transition-all cursor-pointer" style="background:rgba(255,255,255,0.04);min-height:44px;">&#x2190; Back to Home</button>';
    container.appendChild(navFooter);

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

  destroy() {
    if (_m10AnimFrame) {
      cancelAnimationFrame(_m10AnimFrame);
      _m10AnimFrame = null;
    }
  }
});
