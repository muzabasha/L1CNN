ModuleEngine.register('12', {
  init(container) {
    container.innerHTML = '';

    const state = {
      fusionMethod: 'concatenation',
      featureSelection: 'none',
      normalization: 'none',
      topK: 20,
      pcaComponents: 10,
      showCNNOnly: false,
      showRadiomicsOnly: false,
      showFused: true,
      animating: false,
      animStep: 0
    };

    const page = document.createElement('div');
    page.className = 'module-page';

    const header = document.createElement('div');
    header.className = 'module-header';
    header.innerHTML = '<h1>Module 12: CNN + Radiomics Fusion</h1><p class="subtitle">Combining Deep Learning and Hand-Crafted Features for Enhanced Classification</p>';
    page.appendChild(header);

    const objectives = document.createElement('div');
    objectives.className = 'module-card objectives';
    objectives.innerHTML = '<h2>Learning Objectives</h2><ul><li>Understand why combining CNN and radiomics features improves performance</li><li>Learn different fusion strategies (early, intermediate, late)</li><li>Understand feature normalization and selection</li><li>Explore the feature-level fusion pipeline</li><li>Compare fusion approaches quantitatively</li></ul>';
    page.appendChild(objectives);

    const pipelineSection = document.createElement('div');
    pipelineSection.className = 'module-card';
    pipelineSection.innerHTML = '<h2>Interactive Fusion Pipeline</h2>';
    page.appendChild(pipelineSection);

    const pipelineContainer = document.createElement('div');
    pipelineContainer.style.cssText = 'display:flex;gap:16px;flex-wrap:wrap;';
    pipelineSection.appendChild(pipelineContainer);

    const canvasWrap = document.createElement('div');
    canvasWrap.style.cssText = 'flex:1;min-width:600px;';
    const canvas = document.createElement('canvas');
    canvas.width = 820;
    canvas.height = 420;
    canvas.style.cssText = 'width:100%;border-radius:8px;background:#0d1117;border:1px solid #30363d;';
    canvasWrap.appendChild(canvas);
    pipelineContainer.appendChild(canvasWrap);

    const sidebar = document.createElement('div');
    sidebar.style.cssText = 'width:260px;min-height:420px;background:#161b22;border:1px solid #30363d;border-radius:8px;padding:16px;overflow-y:auto;font-size:13px;';
    pipelineContainer.appendChild(sidebar);

    const controlsRow = document.createElement('div');
    controlsRow.style.cssText = 'display:flex;flex-wrap:wrap;gap:12px;margin-top:16px;';
    pipelineSection.appendChild(controlsRow);

    const methodSelect = document.createElement('select');
    methodSelect.style.cssText = 'padding:6px 10px;border-radius:6px;background:#21262d;color:#c9d1d9;border:1px solid #30363d;';
    ['concatenation', 'attention', 'element-wise'].forEach(m => {
      const o = document.createElement('option');
      o.value = m;
      o.textContent = m.charAt(0).toUpperCase() + m.slice(1).replace('-', ' ');
      methodSelect.appendChild(o);
    });
    methodSelect.onchange = () => { state.fusionMethod = methodSelect.value; drawPipeline(); };
    controlsRow.appendChild(methodSelect);

    const selSelect = document.createElement('select');
    selSelect.style.cssText = 'padding:6px 10px;border-radius:6px;background:#21262d;color:#c9d1d9;border:1px solid #30363d;';
    ['none', 'topk', 'pca'].forEach(m => {
      const o = document.createElement('option');
      o.value = m;
      o.textContent = m === 'none' ? 'No Selection' : m === 'topk' ? 'Top-K Selection' : 'PCA Reduction';
      selSelect.appendChild(o);
    });
    selSelect.onchange = () => { state.featureSelection = selSelect.value; drawPipeline(); };
    controlsRow.appendChild(selSelect);

    const normSelect = document.createElement('select');
    normSelect.style.cssText = 'padding:6px 10px;border-radius:6px;background:#21262d;color:#c9d1d9;border:1px solid #30363d;';
    ['none', 'minmax', 'zscore'].forEach(m => {
      const o = document.createElement('option');
      o.value = m;
      o.textContent = m === 'none' ? 'No Normalization' : m === 'minmax' ? 'Min-Max [0,1]' : 'Z-Score (μ=0,σ=1)';
      normSelect.appendChild(o);
    });
    normSelect.onchange = () => { state.normalization = normSelect.value; drawPipeline(); };
    controlsRow.appendChild(normSelect);

    Components.createSlider(controlsRow, { label: 'Top-K Features', min: 5, max: 50, value: 20, step: 5, onChange: v => { state.topK = v; drawPipeline(); } });
    Components.createSlider(controlsRow, { label: 'PCA Components', min: 3, max: 20, value: 10, step: 1, onChange: v => { state.pcaComponents = v; drawPipeline(); } });

    const btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;gap:10px;margin-top:12px;';
    pipelineSection.appendChild(btnRow);

    function makeBtn(label, onClick) {
      const b = document.createElement('button');
      b.textContent = label;
      b.className = 'btn-primary';
      b.onclick = onClick;
      btnRow.appendChild(b);
      return b;
    }

    makeBtn('Animate Data Flow', () => { state.animating = !state.animating; state.animStep = 0; if (state.animating) animateFlow(); });
    const cnnBtn = makeBtn('CNN Only', () => { state.showCNNOnly = !state.showCNNOnly; state.showRadiomicsOnly = false; drawPipeline(); });
    const radBtn = makeBtn('Radiomics Only', () => { state.showRadiomicsOnly = !state.showRadiomicsOnly; state.showCNNOnly = false; drawPipeline(); });
    makeBtn('Show Fused', () => { state.showCNNOnly = false; state.showRadiomicsOnly = false; state.showFused = true; drawPipeline(); });

    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    function genFeatures(type, count) {
      const features = [];
      const names = type === 'cnn' ?
        ['Conv_f1', 'Conv_f2', 'Conv_f3', 'Conv_f4', 'Conv_f5', 'Conv_f6', 'Conv_f7', 'Conv_f8', 'Pool_1', 'Pool_2', 'Pool_3', 'Pool_4', 'FC_1', 'FC_2', 'FC_3', 'FC_4', 'BN_1', 'BN_2', 'Act_1', 'Act_2', 'Drop_1', 'Drop_2', 'Res_1', 'Res_2', 'Attn_1', 'Attn_2', 'Gate_1', 'Gate_2', 'Proj_1', 'Proj_2', 'Norm_1', 'Norm_2'] :
        ['GLCM_Con', 'GLCM_Cor', 'GLCM_Ent', 'GLCM_Hom', 'GLCM_Ene', 'GLDM_Sre', 'GLDM_Lre', 'GLDM_Gln', 'RLM_Sre', 'RLM_Lre', 'RLM_Gln', 'SZM_Sze', 'SZM_Lze', 'First_Mean', 'First_Var', 'First_Skw', 'First_Kur', 'Shape_Vol', 'Shape_Sur', 'Shape_Sph', 'Int_Mean', 'Int_Var', 'Int_Skw', 'Int_Ent', 'Int_Max', 'Int_Min', 'Int_Rng', 'Int_Med', 'Wave_L1', 'Wave_L2', 'Wave_L3', 'Wave_L4'];
      for (let i = 0; i < count; i++) {
        const seed = type === 'cnn' ? i * 7 + 3 : i * 11 + 7;
        const v = (Math.sin(seed) * 0.5 + Math.cos(seed * 0.7) * 0.3 + 0.5);
        features.push({ name: names[i] || (type + '_' + i), value: Math.max(0, Math.min(1, v)) });
      }
      return features;
    }

    function drawPipeline() {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#0d1117';
      ctx.fillRect(0, 0, W, H);

      const cnnFeatures = genFeatures('cnn', 32);
      const radFeatures = genFeatures('radiomics', 20);

      ctx.fillStyle = '#2563eb';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('CNN Feature Extraction', 60, 24);
      ctx.fillStyle = '#8b949e';
      ctx.font = '10px monospace';
      ctx.fillText('32 features from 3D CNN', 60, 40);

      const barW = 8;
      const barMaxH = 60;
      const barGap = 2;
      let bx = 20;
      const barY = 50;
      cnnFeatures.forEach((f, i) => {
        const h = f.value * barMaxH;
        ctx.fillStyle = '#2563eb' + (state.showCNNOnly ? 'ff' : 'cc');
        ctx.fillRect(bx, barY + barMaxH - h, barW, h);
        ctx.strokeStyle = '#2563eb88';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(bx, barY + barMaxH - h, barW, h);
        bx += barW + barGap;
      });

      ctx.fillStyle = '#9333ea';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('Radiomics Feature Extraction', 60, 140);
      ctx.fillStyle = '#8b949e';
      ctx.font = '10px monospace';
      ctx.fillText('20 hand-crafted features (texture, shape, intensity)', 60, 156);

      bx = 20;
      const radY = 166;
      radFeatures.forEach((f, i) => {
        const h = f.value * barMaxH;
        ctx.fillStyle = '#9333ea' + (state.showRadiomicsOnly ? 'ff' : 'cc');
        ctx.fillRect(bx, radY + barMaxH - h, barW, h);
        ctx.strokeStyle = '#9333ea88';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(bx, radY + barMaxH - h, barW, h);
        bx += barW + barGap;
      });

      if (!state.showCNNOnly && !state.showRadiomicsOnly) {
        const normX = 280;
        const normY = 60;
        ctx.fillStyle = '#161b22';
        ctx.strokeStyle = state.normalization !== 'none' ? '#3fb950' : '#30363d';
        ctx.lineWidth = state.normalization !== 'none' ? 2 : 1;
        ctx.beginPath();
        ctx.roundRect(normX, normY, 160, 50, 6);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = state.normalization !== 'none' ? '#3fb950' : '#484f58';
        ctx.font = '10px monospace';
        const normLabels = { none: 'Normalization: None', minmax: 'Min-Max [0,1]', zscore: 'Z-Score (μ=0,σ=1)' };
        ctx.fillText(normLabels[state.normalization], normX + 10, normY + 20);
        ctx.fillStyle = '#8b949e';
        ctx.fillText('52 → normalized features', normX + 10, normY + 36);

        const selX = 280;
        const selY = 130;
        ctx.fillStyle = '#161b22';
        ctx.strokeStyle = state.featureSelection !== 'none' ? '#d29922' : '#30363d';
        ctx.lineWidth = state.featureSelection !== 'none' ? 2 : 1;
        ctx.beginPath();
        ctx.roundRect(selX, selY, 160, 50, 6);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = state.featureSelection !== 'none' ? '#d29922' : '#484f58';
        ctx.font = '10px monospace';
        const selLabels = { none: 'Feature Selection: None', topk: 'Top-K (K=' + state.topK + ')', pca: 'PCA (' + state.pcaComponents + ' comp)' };
        ctx.fillText(selLabels[state.featureSelection], selX + 10, selY + 20);
        ctx.fillStyle = '#8b949e';
        const outDim = state.featureSelection === 'none' ? 52 : state.featureSelection === 'topk' ? state.topK : state.pcaComponents;
        ctx.fillText('→ ' + outDim + ' selected features', selX + 10, selY + 36);

        const fusionX = 280;
        const fusionY = 210;
        const fusionH = 70;
        ctx.fillStyle = '#1c2533';
        ctx.strokeStyle = '#ff6b35';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(fusionX, fusionY, 160, fusionH, 8);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#ff6b35';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText('FUSION MODULE', fusionX + 10, fusionY + 16);
        ctx.font = '10px monospace';
        ctx.fillText('Method: ' + state.fusionMethod, fusionX + 10, fusionY + 34);
        const fusedDim = state.featureSelection === 'none' ? 52 : outDim;
        ctx.fillStyle = '#e6edf3';
        ctx.fillText('Output: ' + fusedDim + ' features', fusionX + 10, fusionY + 52);

        ctx.strokeStyle = '#2563eb88';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(200, barY + barMaxH / 2);
        ctx.quadraticCurveTo(240, barY + barMaxH / 2, fusionX, fusionY + 20);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(200, radY + barMaxH / 2);
        ctx.quadraticCurveTo(240, radY + barMaxH / 2, fusionX, fusionY + 50);
        ctx.stroke();
        ctx.setLineDash([]);

        const clsX = 500;
        const clsY = 220;
        ctx.fillStyle = '#1c2533';
        ctx.strokeStyle = '#da3633';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(clsX, clsY, 150, 50, 6);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#da3633';
        ctx.font = '10px monospace';
        ctx.fillText('Classifier Head', clsX + 10, clsY + 18);
        ctx.fillStyle = '#8b949e';
        ctx.fillText(fusedDim + '→128→64→3', clsX + 10, clsY + 34);

        ctx.strokeStyle = '#ff6b35aa';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(fusionX + 160, fusionY + fusionH / 2);
        ctx.lineTo(clsX, clsY + 25);
        ctx.stroke();
        ctx.setLineDash([]);

        const probX = 500;
        const probY = 290;
        const classes = ['LR-3', 'LR-4', 'LR-5'];
        const probs = [0.12, 0.31, 0.57];
        const pcols = ['#3fb950', '#d29922', '#da3633'];
        classes.forEach((cl, i) => {
          ctx.fillStyle = '#161b22';
          ctx.beginPath();
          ctx.roundRect(probX, probY + i * 22, 150, 18, 3);
          ctx.fill();
          ctx.fillStyle = pcols[i] + 'cc';
          ctx.fillRect(probX + 1, probY + i * 22 + 1, 148 * probs[i], 16);
          ctx.fillStyle = '#e6edf3';
          ctx.font = '9px monospace';
          ctx.fillText(cl + ': ' + (probs[i] * 100).toFixed(0) + '%', probX + 6, probY + i * 22 + 13);
        });

        const chartX = 500;
        const chartY = 50;
        ctx.fillStyle = '#58a6ff';
        ctx.font = '11px sans-serif';
        ctx.fillText('Feature Distribution', chartX, chartY - 4);

        const fusedFeats = [];
        for (let i = 0; i < 32; i++) {
          const cv = cnnFeatures[i] ? cnnFeatures[i].value : 0.5;
          fusedFeats.push(cv * (0.6 + Math.random() * 0.4));
        }

        for (let i = 0; i < 32; i++) {
          const fh = fusedFeats[i] * 80;
          const fx = chartX + i * 9;
          ctx.fillStyle = i < 20 ? '#2563eb88' : '#9333ea88';
          ctx.fillRect(fx, chartY + 100 - fh, 7, fh);
        }

        ctx.fillStyle = '#8b949e';
        ctx.font = '9px monospace';
        ctx.fillText('CNN features (blue)', chartX, chartY + 118);
        ctx.fillText('Radiomics features (purple)', chartX, chartY + 130);

      } else if (state.showCNNOnly) {
        const clsX = 350;
        const clsY = 80;
        ctx.fillStyle = '#1c2533';
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(clsX, clsY, 160, 50, 6);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#2563eb';
        ctx.font = '11px monospace';
        ctx.fillText('CNN-only Classifier', clsX + 10, clsY + 20);
        ctx.fillStyle = '#8b949e';
        ctx.fillText('32→128→64→3', clsX + 10, clsY + 36);

        const probX = 350;
        const probY = 160;
        const classes = ['LR-3', 'LR-4', 'LR-5'];
        const probs = [0.20, 0.38, 0.42];
        const pcols = ['#3fb950', '#d29922', '#da3633'];
        classes.forEach((cl, i) => {
          ctx.fillStyle = '#161b22';
          ctx.beginPath();
          ctx.roundRect(probX, probY + i * 22, 160, 18, 3);
          ctx.fill();
          ctx.fillStyle = pcols[i] + 'cc';
          ctx.fillRect(probX + 1, probY + i * 22 + 1, 158 * probs[i], 16);
          ctx.fillStyle = '#e6edf3';
          ctx.font = '9px monospace';
          ctx.fillText(cl + ': ' + (probs[i] * 100).toFixed(0) + '%', probX + 6, probY + i * 22 + 13);
        });

        ctx.fillStyle = '#8b949e';
        ctx.font = '10px monospace';
        ctx.fillText('Note: CNN-only misses texture', probX, probY + 74);
        ctx.fillText('and shape features from radiomics', probX, probY + 88);

      } else if (state.showRadiomicsOnly) {
        const clsX = 350;
        const clsY = 180;
        ctx.fillStyle = '#1c2533';
        ctx.strokeStyle = '#9333ea';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(clsX, clsY, 160, 50, 6);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#9333ea';
        ctx.font = '11px monospace';
        ctx.fillText('Radiomics-only Classifier', clsX + 10, clsY + 20);
        ctx.fillStyle = '#8b949e';
        ctx.fillText('20→64→32→3', clsX + 10, clsY + 36);

        const probX = 350;
        const probY = 260;
        const classes = ['LR-3', 'LR-4', 'LR-5'];
        const probs = [0.25, 0.40, 0.35];
        const pcols = ['#3fb950', '#d29922', '#da3633'];
        classes.forEach((cl, i) => {
          ctx.fillStyle = '#161b22';
          ctx.beginPath();
          ctx.roundRect(probX, probY + i * 22, 160, 18, 3);
          ctx.fill();
          ctx.fillStyle = pcols[i] + 'cc';
          ctx.fillRect(probX + 1, probY + i * 22 + 1, 158 * probs[i], 16);
          ctx.fillStyle = '#e6edf3';
          ctx.font = '9px monospace';
          ctx.fillText(cl + ': ' + (probs[i] * 100).toFixed(0) + '%', probX + 6, probY + i * 22 + 13);
        });

        ctx.fillStyle = '#8b949e';
        ctx.font = '10px monospace';
        ctx.fillText('Note: Radiomics misses learned', probX, probY + 74);
        ctx.fillText('deep spatial features from CNN', probX, probY + 88);
      }

      const outDim = state.featureSelection === 'none' ? 52 : state.featureSelection === 'topk' ? state.topK : state.pcaComponents;
      sidebar.innerHTML = '<h3 style="color:#58a6ff;margin-top:0">Fusion Pipeline Status</h3>' +
        '<div style="font-size:12px;color:#c9d1d9;line-height:1.6">' +
        '<div style="margin-bottom:8px"><strong style="color:#2563eb">CNN Features:</strong> 32 dimensions</div>' +
        '<div style="margin-bottom:8px"><strong style="color:#9333ea">Radiomics Features:</strong> 20 dimensions</div>' +
        '<hr style="border-color:#21262d;margin:12px 0">' +
        '<div style="margin-bottom:6px"><strong style="color:#3fb950">Normalization:</strong> ' + (state.normalization === 'none' ? 'None' : state.normalization === 'minmax' ? 'Min-Max [0,1]' : 'Z-Score') + '</div>' +
        '<div style="margin-bottom:6px"><strong style="color:#d29922">Feature Selection:</strong> ' + (state.featureSelection === 'none' ? 'None (52 total)' : state.featureSelection === 'topk' ? 'Top-K (K=' + state.topK + ')' : 'PCA (' + state.pcaComponents + ' components)') + '</div>' +
        '<div style="margin-bottom:8px"><strong style="color:#ff6b35">Fusion Method:</strong> ' + state.fusionMethod + '</div>' +
        '<hr style="border-color:#21262d;margin:12px 0">' +
        '<div style="margin-bottom:6px"><strong style="color:#e6edf3">Output Dimension:</strong> ' + outDim + '</div>' +
        '</div>' +
        '<h4 style="color:#f0883e;margin-top:16px">Fusion Method Details</h4>' +
        '<div style="font-size:11px;color:#8b949e;line-height:1.5">' +
        (state.fusionMethod === 'concatenation' ?
          '<p><strong>Concatenation</strong> simply stacks feature vectors: f = [f_cnn; f_rad]</p><p>Output dim = 32 + 20 = 52</p><p>Simple, no learned interaction, but preserves all information.</p>' :
          state.fusionMethod === 'attention' ?
          '<p><strong>Attention fusion</strong> learns to weight features: f = Attn(Q_fused, K, V)</p><p>Captures inter-feature dependencies.</p><p>More parameters but more expressive.</p>' :
          '<p><strong>Element-wise</strong> requires matching dimensions: f = f_cnn + f_rad</p><p>Requires projection layers to match dims.</p><p>Additive fusion, compact representation.</p>') +
        '</div>' +
        '<h4 style="color:#da3633;margin-top:16px">Expected Performance</h4>' +
        '<div style="font-size:11px;color:#8b949e;line-height:1.5">' +
        '<div>CNN-only: <span style="color:#2563eb">~78% accuracy</span></div>' +
        '<div>Radiomics-only: <span style="color:#9333ea">~72% accuracy</span></div>' +
        '<div>Fused: <span style="color:#3fb950">~85% accuracy</span></div>' +
        '</div>';
    }

    function animateFlow() {
      if (!state.animating) return;
      state.animStep += 1;
      if (state.animStep > 300) { state.animating = false; return; }
      drawPipeline();

      const t = state.animStep;
      const particles = [
        { sx: 100, sy: 80, ex: 280, ey: 100, color: '#2563eb' },
        { sx: 100, sy: 200, ex: 280, ey: 100, color: '#9333ea' },
        { sx: 360, sy: 100, ex: 360, ey: 250, color: '#3fb950' },
        { sx: 360, sy: 250, ex: 575, ey: 245, color: '#ff6b35' },
        { sx: 575, sy: 245, ex: 575, ey: 310, color: '#da3633' }
      ];
      particles.forEach((p, i) => {
        const progress = Math.max(0, Math.min(1, (t - i * 20) / 150));
        if (progress <= 0 || progress >= 1) return;
        const px = p.sx + (p.ex - p.sx) * progress;
        const py = p.sy + (p.ey - p.sy) * progress;
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      requestAnimationFrame(animateFlow);
    }

    drawPipeline();

    const theorySection = document.createElement('div');
    theorySection.className = 'module-card';
    theorySection.innerHTML = '<h2>Theory: Feature Fusion for Medical Image Analysis</h2>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">' +
      '<div class="theory-card"><h3>Why Fusion?</h3><p>CNN features and radiomics features capture <strong>complementary information</strong>:</p><ul><li><strong>CNN features</strong>: Automatically learned discriminative representations capturing spatial hierarchies, contextual relationships, and complex non-linear patterns</li><li><strong>Radiomics features</strong>: Hand-crafted quantitative measurements of texture (GLCM, GLRLM), shape, intensity distribution, and wavelet transforms</li></ul><p>Fusion combines the representation power of deep learning with the clinical interpretability of radiomics.</p></div>' +
      '<div class="theory-card"><h3>Fusion Strategies</h3><p><strong>Early Fusion</strong>: Concatenate raw features before classification. Simple but may include redundant or irrelevant features.</p><p><strong>Intermediate Fusion</strong>: Merge features at hidden layer level. Allows the model to learn cross-feature interactions.</p><p><strong>Late Fusion</strong>: Combine predictions from separate models. Robust but cannot learn inter-feature relationships.</p><p>Our approach uses <strong>feature-level (intermediate) fusion</strong> for optimal balance.</p></div>' +
      '<div class="theory-card"><h3>Feature Normalization</h3><p>CNN and radiomics features have different scales and distributions. Normalization ensures fair contribution:</p><p><strong>Min-Max Scaling</strong>: x\' = (x − x<sub>min</sub>) / (x<sub>max</sub> − x<sub>min</sub>)</p><p><strong>Z-Score Standardization</strong>: x\' = (x − μ) / σ</p><p>Without normalization, features with larger magnitudes would dominate the fusion, regardless of their discriminative power.</p></div>' +
      '<div class="theory-card"><h3>Feature Selection</h3><p>Not all features contribute positively to classification. Redundant or noisy features can hurt performance:</p><p><strong>Correlation filtering</strong>: Remove features with correlation > 0.95</p><p><strong>mRMR</strong>: Minimum Redundancy Maximum Relevance</p><p><strong>PCA</strong>: Dimensionality reduction preserving maximum variance</p><p><strong>Top-K selection</strong>: Keep K features with highest mutual information</p></div>' +
      '</div>';
    page.appendChild(theorySection);

    const comparisonChart = document.createElement('div');
    comparisonChart.className = 'module-card';
    comparisonChart.innerHTML = '<h2>Fusion Approach Comparison</h2>';
    Components.createChart(comparisonChart, 'bar', {
      labels: ['CNN Only', 'Radiomics Only', 'Early Fusion', 'Intermediate Fusion', 'Late Fusion', 'Attention Fusion'],
      datasets: [
        { label: 'Accuracy (%)', data: [78.2, 72.5, 82.1, 85.3, 80.7, 87.1], backgroundColor: ['#2563eb88', '#9333ea88', '#3fb95088', '#ff6b3588', '#d2992288', '#da363388'], borderColor: ['#2563eb', '#9333ea', '#3fb950', '#ff6b35', '#d29922', '#da3633'], borderWidth: 2 }
      ]
    }, {
      responsive: true,
      scales: {
        y: { beginAtZero: true, max: 100, ticks: { color: '#8b949e' }, grid: { color: '#21262d' } },
        x: { ticks: { color: '#c9d1d9', font: { size: 11 } }, grid: { color: '#21262d' } }
      },
      plugins: { legend: { labels: { color: '#c9d1d9' } } }
    });
    page.appendChild(comparisonChart);

    const featureImportanceSection = document.createElement('div');
    featureImportanceSection.className = 'module-card';
    featureImportanceSection.innerHTML = '<h2>Top Feature Importance After Fusion</h2>';
    Components.createChart(featureImportanceSection, 'doughnut', {
      labels: ['CNN Spatial', 'CNN Texture', 'CNN Context', 'GLCM Texture', 'GLRLM Texture', 'Shape Features', 'Intensity Stats', 'Wavelet Features'],
      datasets: [{
        data: [22, 15, 12, 16, 10, 8, 9, 8],
        backgroundColor: ['#2563eb', '#1d4ed8', '#60a5fa', '#9333ea', '#a855f7', '#d29922', '#3fb950', '#06b6d4'],
        borderColor: '#0d1117',
        borderWidth: 2
      }]
    }, { responsive: true, plugins: { legend: { position: 'right', labels: { color: '#c9d1d9', padding: 12 } } } });
    page.appendChild(featureImportanceSection);

    const codeSection = document.createElement('div');
    codeSection.className = 'module-card';
    codeSection.innerHTML = '<h2>Implementation: CNN + Radiomics Fusion Model</h2>';
    Components.createCodeBlock(codeSection, `import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np

class RadiomicsEncoder(nn.Module):
    def __init__(self, in_features=20, out_features=32):
        super().__init__()
        self.encoder = nn.Sequential(
            nn.Linear(in_features, 64),
            nn.BatchNorm1d(64),
            nn.ReLU(inplace=True),
            nn.Dropout(0.3),
            nn.Linear(64, out_features),
            nn.BatchNorm1d(out_features),
            nn.ReLU(inplace=True)
        )

    def forward(self, x):
        return self.encoder(x)

class CNNFeatureExtractor(nn.Module):
    def __init__(self, in_channels=1, feature_dim=32):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv3d(in_channels, 32, 3, padding=1),
            nn.BatchNorm3d(32),
            nn.ReLU(inplace=True),
            nn.MaxPool3d(2),
            nn.Conv3d(32, 64, 3, padding=1),
            nn.BatchNorm3d(64),
            nn.ReLU(inplace=True),
            nn.MaxPool3d(2),
            nn.Conv3d(64, 128, 3, padding=1),
            nn.BatchNorm3d(128),
            nn.ReLU(inplace=True),
            nn.AdaptiveAvgPool3d(1)
        )
        self.fc = nn.Linear(128, feature_dim)

    def forward(self, x):
        x = self.features(x)
        x = x.view(x.size(0), -1)
        return self.fc(x)

class AttentionFusion(nn.Module):
    def __init__(self, cnn_dim, rad_dim, fused_dim):
        super().__init__()
        self.cnn_proj = nn.Linear(cnn_dim, fused_dim)
        self.rad_proj = nn.Linear(rad_dim, fused_dim)
        self.attention = nn.MultiheadAttention(fused_dim, 4, batch_first=True)
        self.norm = nn.LayerNorm(fused_dim)

    def forward(self, cnn_feat, rad_feat):
        c = self.cnn_proj(cnn_feat).unsqueeze(1)
        r = self.rad_proj(rad_feat).unsqueeze(1)
        stacked = torch.cat([c, r], dim=1)
        fused, weights = self.attention(stacked, stacked, stacked)
        fused = self.norm(fused.mean(dim=1))
        return fused, weights

class FusionClassifier(nn.Module):
    def __init__(self, fused_dim=32, n_classes=3, fusion='attention'):
        super().__init__()
        self.cnn_encoder = CNNFeatureExtractor(feature_dim=32)
        self.rad_encoder = RadiomicsEncoder(in_features=20, out_features=32)
        self.fusion_method = fusion

        if fusion == 'attention':
            self.fusion = AttentionFusion(32, 32, fused_dim)
            classifier_in = fused_dim
        elif fusion == 'concatenation':
            classifier_in = 64
        else:
            self.proj = nn.Linear(32, fused_dim)
            classifier_in = fused_dim

        self.classifier = nn.Sequential(
            nn.Linear(classifier_in, 128),
            nn.ReLU(inplace=True),
            nn.Dropout(0.5),
            nn.Linear(128, 64),
            nn.ReLU(inplace=True),
            nn.Dropout(0.3),
            nn.Linear(64, n_classes)
        )

    def forward(self, ct_volume, radiomics_features):
        cnn_feat = self.cnn_encoder(ct_volume)
        rad_feat = self.rad_encoder(radiomics_features)

        if self.fusion_method == 'attention':
            fused, weights = self.fusion(cnn_feat, rad_feat)
        elif self.fusion_method == 'concatenation':
            fused = torch.cat([cnn_feat, rad_feat], dim=1)
            weights = None
        else:
            fused = self.proj(cnn_feat) + self.rad_encoder(radiomics_features)
            weights = None

        logits = self.classifier(fused)
        probs = F.softmax(logits, dim=1)
        return logits, probs, weights

model = FusionClassifier(fused_dim=32, n_classes=3, fusion='attention')
total_params = sum(p.numel() for p in model.parameters())
print(f"Fusion model parameters: {total_params:,}")

ct = torch.randn(4, 1, 64, 64, 64)
rad = torch.randn(4, 20)
logits, probs, weights = model(ct, rad)
print(f"Output: {probs.shape}")
print(f"Class probabilities: {probs}")
if weights is not None:
    print(f"Attention weights: {weights}")

# Feature normalization utilities
def normalize_features(features, method='zscore'):
    if method == 'minmax':
        fmin = features.min(dim=0, keepdim=True)[0]
        fmax = features.max(dim=0, keepdim=True)[0]
        return (features - fmin) / (fmax - fmin + 1e-8)
    elif method == 'zscore':
        mean = features.mean(dim=0, keepdim=True)
        std = features.std(dim=0, keepdim=True)
        return (features - mean) / (std + 1e-8)
    return features

# Feature selection using mutual information
from sklearn.feature_selection import mutual_info_classif

def select_topk_features(X, y, k=20):
    mi_scores = mutual_info_classif(X, y)
    top_indices = np.argsort(mi_scores)[-k:]
    return X[:, top_indices], top_indices
`);
    page.appendChild(codeSection);

    const quizSection = document.createElement('div');
    quizSection.className = 'module-card';
    quizSection.innerHTML = '<h2>Knowledge Check</h2>';
    Components.createQuiz(quizSection, [
      { q: 'Why is feature-level fusion often preferred over late fusion for combining CNN and radiomics features?', options: ['Late fusion requires more computational resources', 'Feature-level fusion allows the model to learn cross-feature interactions between CNN and radiomics representations', 'Late fusion cannot handle different feature dimensions', 'Feature-level fusion always uses fewer parameters'], correct: 1, explanation: 'Feature-level fusion concatenates or merges feature vectors before classification, allowing the model to learn complex interactions between CNN and radiomics features. Late fusion only combines final predictions, missing opportunities to leverage complementary information at the feature level.' },
      { q: 'What problem does feature normalization solve in the fusion pipeline?', options: ['It reduces the total number of features', 'It prevents features with larger magnitudes from dominating the fusion, ensuring fair contribution', 'It increases model accuracy by 10-15%', 'It eliminates the need for feature selection'], correct: 1, explanation: 'CNN and radiomics features have different scales and distributions. Without normalization, features with larger magnitudes would dominate the fusion process regardless of their discriminative power. Normalization (Min-Max or Z-Score) ensures all features contribute proportionally to their information content.' },
      { q: 'Which feature selection method would be most appropriate when the goal is to reduce dimensionality while preserving maximum variance?', options: ['Top-K selection with mutual information', 'PCA (Principal Component Analysis)', 'Correlation filtering', 'Manual selection based on clinical knowledge'], correct: 1, explanation: 'PCA reduces dimensionality by projecting features onto orthogonal components that capture maximum variance. Unlike Top-K selection (which keeps original features), PCA creates new composite features that may better represent the data structure, especially when features are correlated.' },
      { q: 'Why do CNN features and radiomics features capture complementary information?', options: ['They use the same mathematical operations', 'CNN learns spatial patterns automatically while radiomics captures interpretable hand-crafted measurements of texture, shape, and intensity', 'Radiomics features always outperform CNN features', 'CNN cannot extract texture information'], correct: 1, explanation: 'CNN features are automatically learned hierarchical representations optimized for the classification task, capturing complex spatial patterns. Radiomics features are hand-crafted measurements of specific image properties (texture metrics, shape descriptors, intensity statistics) that are clinically interpretable. Their different origins and design philosophies make them complementary.' }
    ]);
    page.appendChild(quizSection);

    const reflectionSection = document.createElement('div');
    reflectionSection.className = 'module-card reflection';
    reflectionSection.innerHTML = '<h2>Reflection: Complementarity of Features</h2>' +
      '<div class="theory-card"><h3>The Best of Both Worlds</h3><p>Fusion combines the strengths of two paradigms:</p><ul><li><strong>Deep learning power</strong>: CNN automatically discovers discriminative features that may not be apparent to human observers, capturing subtle patterns in high-dimensional data</li><li><strong>Clinical interpretability</strong>: Radiomics features have established clinical meaning — texture heterogeneity correlates with tumor aggressiveness, shape irregularity suggests malignancy</li></ul><p>This combination achieves higher accuracy than either approach alone while maintaining a degree of clinical interpretability.</p></div>' +
      '<div class="theory-card"><h3>Clinical Interpretability</h3><p>Radiomics features provide a bridge between AI predictions and clinical reasoning:</p><ul><li>GLCM texture features relate to tissue heterogeneity (malignant tumors tend to be more heterogeneous)</li><li>Shape features correlate with tumor aggressiveness (irregular margins suggest invasion)</li><li>Intensity statistics capture enhancement patterns (key to LI-RADS classification)</li></ul><p>When radiomics features drive the classification, clinicians can understand and validate the reasoning process.</p></div>' +
      '<div class="theory-card"><h3>Practical Considerations</h3><ul><li><strong>Feature redundancy</strong>: Some radiomics features may be redundant with CNN-learned features; selection helps</li><li><strong>Data quality</strong>: Radiomics features are sensitive to image acquisition parameters and ROI delineation</li><li><strong>Reproducibility</strong>: Radiomics features require standardized extraction pipelines (IBSI)</li><li><strong>Computational cost</strong>: Feature extraction adds preprocessing time but is typically fast</li></ul></div>' +
      '<div class="theory-card"><h3>Future Directions</h3><ul><li>Deep radiomics: learning hand-crafted features end-to-end</li><li>Self-supervised pre-training for better CNN feature quality</li><li>Multi-scale fusion for capturing features at different resolutions</li><li>Clinical validation of fused models in prospective studies</li></ul></div>';
    page.appendChild(reflectionSection);

    container.appendChild(page);
  },

  destroy() {
  }
});
