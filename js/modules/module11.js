let _m11AnimFrame = null;
let _m11Animating = false;

ModuleEngine.register('11', {
  init(container) {
    var header = Components.createModuleHeader('11', 'CNN Feature Visualization');
    container.appendChild(header);

    const state = {
      layerDepth: 1,
      animating: false,
      animStep: 0,
      selectedFilter: null,
      showActivation: true,
      inputImage: 'liver_ct'
    };

    const page = document.createElement('div');
    page.className = 'module-page';

    const objectives = document.createElement('div');
    objectives.className = 'module-card objectives';
    objectives.innerHTML = '<h2>Learning Objectives</h2><ul><li>Understand what CNN layers learn at different depths</li><li>Visualize feature maps, activation maps, and attention maps</li><li>Interpret filter responses for medical images</li><li>Learn about feature hierarchy (edges → textures → parts → objects)</li><li>Understand why visualization matters for building trust in medical AI</li></ul>';
    page.appendChild(objectives);

    const vizSection = document.createElement('div');
    vizSection.className = 'module-card';
    vizSection.innerHTML = '<h2>Interactive Feature Visualization</h2>';
    page.appendChild(vizSection);

    const vizContainer = document.createElement('div');
    vizContainer.style.cssText = 'display:flex;gap:16px;flex-wrap:wrap;';
    vizSection.appendChild(vizContainer);

    const canvasWrap = document.createElement('div');
    canvasWrap.style.cssText = 'flex:1;min-width:280px;';
    const canvas = document.createElement('canvas');
    canvas.width = 720;
    canvas.height = 480;
    canvas.style.cssText = 'width:100%;border-radius:8px;background:#0d1117;border:1px solid #30363d;';
    canvasWrap.appendChild(canvas);
    vizContainer.appendChild(canvasWrap);

    const infoPanel = document.createElement('div');
    infoPanel.style.cssText = 'width:280px;min-height:480px;background:#161b22;border:1px solid #30363d;border-radius:8px;padding:16px;overflow-y:auto;font-size:13px;';
    vizContainer.appendChild(infoPanel);

    const layerInfo = {
      1: { title: 'Layer 1: Edge Detectors', desc: 'First convolutional layers detect low-level features like edges, gradients, and simple shapes. Filters are typically small (3×3) and respond to intensity changes.\n\nIn CT images, these capture:\n• Tissue boundaries\n• Vessel edges\n• Lesion contours\n• Density gradients\n\nThese are universal features shared across all image domains.', filters: ['Horizontal edge', 'Vertical edge', 'Diagonal 45°', 'Diagonal 135°', 'Blob detector', 'Ridge detector', 'Corner detector', 'High-pass'] },
      2: { title: 'Layer 2: Texture Patterns', desc: 'Second layer combines edge responses to detect texture patterns. These capture repeating structures and local arrangements.\n\nIn CT images:\n• Liver parenchyma texture\n• Tumor内部 heterogeneity\n• Vascular patterns\n• Artifact patterns\n\nTexture features correlate with tissue composition and pathology.', filters: ['Grating 0°', 'Grating 45°', 'Grating 90°', 'Grating 135°', 'Spotty texture', 'Striped texture', 'Checkered', 'Circular'] },
      3: { title: 'Layer 3: Part Detectors', desc: 'Middle layers detect meaningful parts and structures. Features become more specific to the task domain.\n\nIn liver CT:\n• Lesion boundaries\n• Vascular bifurcations\n• Enhancement margins\n• Capsule patterns\n\nThese features are more clinically relevant and begin to capture diagnostic information.', filters: ['Lesion boundary', 'Vessel cross', 'Enhancement rim', 'Central region', 'Marginal zone', 'Peri-lesional', 'Texture boundary', 'Intensity peak'] },
      4: { title: 'Layer 4: Concept Detectors', desc: 'Deep layers respond to high-level semantic concepts. These are task-specific and directly relevant to classification.\n\nIn LI-RADS:\n• Arterial enhancement pattern\n• Washout region\n• Capsule appearance\n• Threshold growth\n\nThese align with the LI-RADS diagnostic criteria used by radiologists.', filters: ['Arterial enhance', 'Washout pattern', 'Capsule sign', 'Growth pattern', 'Nodule shape', 'Margin irregularity', 'Fat density', 'Enhancement homogeneity'] },
      5: { title: 'Layer 5: Class-Specific Features', desc: 'Final layers before classification encode class-specific discriminative features. These are highly abstract and task-specific.\n\nFor LI-RADS classification:\n• LR-3 benign features\n• LR-4 probable HCC patterns\n• LR-5 definite HCC signatures\n\nThese features directly drive the classification decision and can be traced back to clinically meaningful regions.', filters: ['LR-3 pattern', 'LR-4 pattern', 'LR-5 pattern', 'Benign texture', 'Malignant enhance', 'Washout severity', 'Capsule completeness', 'Size threshold'] }
    };

    const controlsRow = document.createElement('div');
    controlsRow.style.cssText = 'display:flex;flex-wrap:wrap;gap:12px;margin-top:16px;';
    vizSection.appendChild(controlsRow);

    Components.createSlider(controlsRow, { label: 'Layer Depth', min: 1, max: 5, value: 1, step: 1, onChange: v => { state.layerDepth = v; drawViz(); } });

    const btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;gap:10px;margin-top:12px;';
    vizSection.appendChild(btnRow);

    function makeBtn(label, onClick) {
      const b = document.createElement('button');
      b.textContent = label;
      b.className = 'btn-primary';
      b.onclick = onClick;
      btnRow.appendChild(b);
      return b;
    }

    makeBtn('Animate Layer Progression', () => {
      state.animating = !state.animating;
      state.animStep = 0;
      if (state.animating) animateProgression();
    });
    makeBtn('Show Activation Heatmap', () => { state.showActivation = !state.showActivation; drawViz(); });

    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    function draw3DBoxSmall(c, x, y, w, h, fill, stroke) {
      const d = 8;
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

    function genFeatureMaps(layer, count) {
      const maps = [];
      const seed = layer * 100 + count;
      for (let i = 0; i < count; i++) {
        const data = [];
        const res = layer <= 2 ? 28 : layer <= 3 ? 14 : 7;
        for (let r = 0; r < res; r++) {
          for (let c = 0; c < res; c++) {
            let v = 0;
            if (layer === 1) {
              v = Math.sin((r + c + seed + i * 7) * 0.5) * 0.3 + Math.cos((r - c + i * 3) * 0.7) * 0.2;
            } else if (layer === 2) {
              v = Math.sin((r * 2 + i * 5) * 0.4) * Math.cos((c * 3 + seed) * 0.3) * 0.5;
            } else if (layer === 3) {
              const cx = res / 2, cy = res / 2;
              const dist = Math.sqrt((r - cx) ** 2 + (c - cy) ** 2) / res;
              v = Math.sin(dist * 10 + i) * 0.4 * (1 - dist);
            } else {
              v = Math.sin((r + seed) * 0.8 + i) * Math.cos((c + i * 4) * 0.6) * 0.6;
              if (Math.random() > 0.7) v += 0.3;
            }
            v = Math.max(-1, Math.min(1, v));
            data.push(v);
          }
        }
        maps.push({ data, res });
      }
      return maps;
    }

    function drawViz() {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#0d1117';
      ctx.fillRect(0, 0, W, H);

      const layer = state.layerDepth;
      const info = layerInfo[layer];

      ctx.fillStyle = '#58a6ff';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('Layer ' + layer + ' Feature Maps', 20, 24);
      ctx.fillStyle = '#8b949e';
      ctx.font = '12px sans-serif';
      ctx.fillText(info.title, 20, 42);

      ctx.fillStyle = '#c9d1d9';
      ctx.font = '11px monospace';
      ctx.fillText('Input CT → ', 20, 72);
      let flowX = 100;
      for (let l = 1; l <= 5; l++) {
        const isActive = l <= layer;
        ctx.fillStyle = isActive ? (l === layer ? '#58a6ff' : '#238636') : '#21262d';
        ctx.strokeStyle = l === layer ? '#58a6ff' : '#30363d';
        ctx.lineWidth = l === layer ? 2 : 1;
        ctx.beginPath();
        ctx.roundRect(flowX, 60, 50, 24, 4);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = isActive ? '#fff' : '#484f58';
        ctx.font = '10px monospace';
        ctx.fillText('L' + l, flowX + 18, 76);
        if (l < 5) {
          ctx.strokeStyle = isActive ? '#30363d' : '#21262d';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(flowX + 50, 72);
          ctx.lineTo(flowX + 60, 72);
          ctx.stroke();
        }
        flowX += 60;
      }
      ctx.fillStyle = '#c9d1d9';
      ctx.font = '11px monospace';
      ctx.fillText('→ Class', flowX + 4, 76);

      const inputX = 20;
      const inputY = 100;
      const inputSize = 90;
      ctx.fillStyle = '#161b22';
      ctx.strokeStyle = '#30363d';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(inputX, inputY, inputSize + 10, inputSize + 20, 4);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#8b949e';
      ctx.font = '9px monospace';
      ctx.fillText('Input CT', inputX + 15, inputY + 12);

      for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 6; c++) {
          const v = Math.sin((r + c) * 0.8) * 30 + 80;
          ctx.fillStyle = 'rgb(' + Math.floor(v) + ',' + Math.floor(v * 0.9) + ',' + Math.floor(v * 0.85) + ')';
          ctx.fillRect(inputX + 5 + c * 14, inputY + 18 + r * 13, 13, 12);
        }
      }

      ctx.strokeStyle = '#30363d';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(inputX + inputSize + 10, inputY + inputSize / 2 + 10);
      ctx.lineTo(inputX + inputSize + 40, inputY + inputSize / 2 + 10);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#58a6ff';
      ctx.beginPath();
      ctx.moveTo(inputX + inputSize + 35, inputY + inputSize / 2 + 5);
      ctx.lineTo(inputX + inputSize + 42, inputY + inputSize / 2 + 10);
      ctx.lineTo(inputX + inputSize + 35, inputY + inputSize / 2 + 15);
      ctx.fill();

      const mapsStartX = inputX + inputSize + 50;
      const maps = genFeatureMaps(layer, 16);
      const cellSize = layer <= 2 ? 52 : layer <= 3 ? 40 : 30;
      const cellGap = 4;
      const cols = 4;
      const gridX = mapsStartX;
      const gridY = inputY;

      ctx.fillStyle = '#58a6ff';
      ctx.font = '11px monospace';
      ctx.fillText('Feature Maps (16 filters)', gridX, gridY - 4);

      maps.forEach((map, idx) => {
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const cx = gridX + col * (cellSize + cellGap);
        const cy = gridY + row * (cellSize + cellGap);
        const pixSize = (cellSize - 2) / map.res;

        for (let r = 0; r < map.res; r++) {
          for (let c = 0; c < map.res; c++) {
            const v = map.data[r * map.res + c];
            if (v > 0) {
              ctx.fillStyle = 'rgba(37,99,235,' + v.toFixed(2) + ')';
            } else {
              ctx.fillStyle = 'rgba(218,54,51,' + Math.abs(v).toFixed(2) + ')';
            }
            ctx.fillRect(cx + c * pixSize, cy + r * pixSize, pixSize, pixSize);
          }
        }
        ctx.strokeStyle = '#30363d';
        ctx.lineWidth = 1;
        ctx.strokeRect(cx, cy, cellSize, cellSize);
      });

      const filterX = 20;
      const filterY = inputY + inputSize + 50;
      ctx.fillStyle = '#f0883e';
      ctx.font = '11px monospace';
      ctx.fillText('Learned Filters / Kernel Visualization', filterX, filterY - 4);

      const filterKernels = [];
      const kSize = layer <= 2 ? 32 : 28;
      for (let i = 0; i < 8; i++) {
        const kernel = [];
        const ks = 5;
        for (let r = 0; r < ks; r++) {
          for (let c = 0; c < ks; c++) {
            let v = 0;
            if (layer === 1) {
              v = Math.sin((r - 2) * 1.5 + i * 0.8) * Math.cos((c - 2) * 1.2 + i * 0.5);
            } else if (layer === 2) {
              v = Math.sin((r + c + i) * 1.2) * 0.8;
            } else if (layer === 3) {
              const d = Math.sqrt((r - 2) ** 2 + (c - 2) ** 2);
              v = Math.exp(-d) * Math.sin(i + d);
            } else {
              v = (Math.sin(r * i * 0.5 + c) + Math.cos(c * i * 0.3)) * 0.5;
            }
            kernel.push(v);
          }
        }
        filterKernels.push(kernel);
      }

      filterKernels.forEach((kernel, idx) => {
        const col = idx % 4;
        const row = Math.floor(idx / 4);
        const fx = filterX + col * (kSize + 6);
        const fy = filterY + row * (kSize + 6);
        const pixS = kSize / 5;
        for (let r = 0; r < 5; r++) {
          for (let c = 0; c < 5; c++) {
            const v = kernel[r * 5 + c];
            if (v > 0) ctx.fillStyle = 'rgba(240,136,62,' + Math.abs(v).toFixed(2) + ')';
            else ctx.fillStyle = 'rgba(6,182,212,' + Math.abs(v).toFixed(2) + ')';
            ctx.fillRect(fx + c * pixS, fy + r * pixS, pixS, pixS);
          }
        }
        ctx.strokeStyle = '#30363d';
        ctx.strokeRect(fx, fy, kSize, kSize);
      });

      if (state.showActivation) {
        const actX = 320;
        const actY = filterY;
        ctx.fillStyle = '#3fb950';
        ctx.font = '11px monospace';
        ctx.fillText('Activation Heatmap (Overlay)', actX, actY - 4);

        const actSize = 160;
        ctx.fillStyle = '#161b22';
        ctx.beginPath();
        ctx.roundRect(actX, actY, actSize, actSize, 4);
        ctx.fill();

        for (let r = 0; r < 16; r++) {
          for (let c = 0; c < 16; c++) {
            const cx2 = 8, cy2 = 8;
            const dist = Math.sqrt((r - cy2) ** 2 + (c - cx2) ** 2) / 16;
            const angle = Math.atan2(r - cy2, c - cx2);
            let intensity = Math.exp(-dist * 3) * (0.5 + 0.5 * Math.sin(angle * 2 + layer));
            if (layer >= 3) {
              intensity = Math.exp(-dist * 4) * (0.7 + 0.3 * Math.cos(r * 0.5 + c * 0.3 + layer));
            }
            intensity = Math.max(0, Math.min(1, intensity));
            const red = Math.floor(intensity * 255);
            const green = Math.floor(intensity * 100 * (1 - intensity));
            ctx.fillStyle = 'rgba(' + red + ',' + green + ',0,0.8)';
            ctx.fillRect(actX + c * 10, actY + r * 10, 10, 10);
          }
        }

        ctx.strokeStyle = '#3fb950';
        ctx.lineWidth = 1;
        ctx.strokeRect(actX, actY, actSize, actSize);
        ctx.fillStyle = '#c9d1d9';
        ctx.font = '9px monospace';
        ctx.fillText('Hot = high activation', actX + 5, actY + actSize + 14);
        ctx.fillText('Blue = low activation', actX + 5, actY + actSize + 26);

        const dimX = actX + actSize + 20;
        const dimY = actY;
        ctx.fillStyle = '#d29922';
        ctx.font = '11px monospace';
        ctx.fillText('Dimension Tracking', dimX, dimY - 4);

        const dims = [
          { layer: 1, size: '64³ × 32', spatial: '64×64×64', params: '864' },
          { layer: 2, size: '32³ × 64', spatial: '32×32×32', params: '18,496' },
          { layer: 3, size: '16³ × 128', spatial: '16×16×16', params: '221,440' },
          { layer: 4, size: '8³ × 256', spatial: '8×8×8', params: '893,184' },
          { layer: 5, size: '4³ × 512', spatial: '4×4×4', params: '3,539,968' }
        ];

        dims.forEach((d, i) => {
          const dy = dimY + i * 44;
          const isActive = i + 1 <= layer;
          ctx.fillStyle = isActive ? '#161b22' : '#0d1117';
          ctx.strokeStyle = i + 1 === layer ? '#d29922' : '#21262d';
          ctx.lineWidth = i + 1 === layer ? 2 : 1;
          ctx.beginPath();
          ctx.roundRect(dimX, dy, 220, 40, 4);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = isActive ? '#e6edf3' : '#484f58';
          ctx.font = '10px monospace';
          ctx.fillText('Layer ' + d.layer + ': ' + d.size, dimX + 6, dy + 14);
          ctx.fillStyle = isActive ? '#8b949e' : '#30363d';
          ctx.fillText('Spatial: ' + d.spatial, dimX + 6, dy + 28);
          ctx.fillStyle = isActive ? '#d29922' : '#30363d';
          ctx.fillText('Params: ' + d.params, dimX + 120, dy + 28);
        });
      }

      infoPanel.innerHTML = '<h3 style="color:#58a6ff;margin-top:0">' + info.title + '</h3>' +
        '<p style="color:#c9d1d9;line-height:1.5;white-space:pre-wrap">' + info.desc + '</p>' +
        '<h4 style="color:#f0883e;margin-top:12px">Typical Filter Responses</h4>' +
        '<ul style="color:#8b949e;font-size:12px;padding-left:16px">' +
        info.filters.map(f => '<li>' + f + '</li>').join('') +
        '</ul>' +
        '<h4 style="color:#3fb950;margin-top:12px">Layer Statistics</h4>' +
        '<div style="font-size:12px;color:#c9d1d9">' +
        '<div>Feature maps: ' + (layer <= 2 ? 32 : layer <= 3 ? 64 : layer <= 4 ? 128 : 256) + '</div>' +
        '<div>Spatial: ' + (layer === 1 ? '64³' : layer === 2 ? '32³' : layer === 3 ? '16³' : layer === 4 ? '8³' : '4³') + '</div>' +
        '<div>Receptive field: ' + (layer * 4 + 2) + '×' + (layer * 4 + 2) + '×' + (layer * 4 + 2) + '</div>' +
        '<div>Activation: ' + (layer <= 2 ? 'ReLU' : layer <= 3 ? 'ReLU + BN' : 'ReLU + BN + Dropout') + '</div>' +
        '</div>';
    }

    function animateProgression() {
      if (!state.animating) {
        _m11Animating = false;
        return;
      }
      _m11Animating = true;
      state.animStep += 0.5;
      if (state.animStep > 300) {
        state.animating = false;
        return;
      }
      const layer = Math.min(5, Math.floor(state.animStep / 60) + 1);
      if (layer !== state.layerDepth) {
        state.layerDepth = layer;
        document.querySelector('[data-label="Layer Depth"]').dispatchEvent(new Event('input'));
      }
      drawViz();

      const progress = (state.animStep % 60) / 60;
      const phaseX = 20 + progress * 680;
      ctx.beginPath();
      ctx.arc(phaseX, 260, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#58a6ff';
      ctx.shadowColor = '#58a6ff';
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0;

      _m11AnimFrame = requestAnimationFrame(animateProgression);
    }

    drawViz();

    const theorySection = document.createElement('div');
    theorySection.className = 'module-card';
    theorySection.innerHTML = '<h2>Theory: Feature Hierarchy in CNNs</h2>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">' +
      '<div class="theory-card"><h3>Feature Hierarchy</h3><p>CNNs learn a hierarchy of features from low-level to high-level:</p><ol><li><strong>Layer 1-2</strong>: Edges, gradients, simple textures — universal features shared across domains</li><li><strong>Layer 3-4</strong>: Parts, complex textures — domain-specific features (lesion boundaries, vessel patterns)</li><li><strong>Layer 5+</strong>: Semantic concepts — task-specific features (LI-RADS class discriminators)</li></ol><p>This hierarchy emerges naturally from the training process without explicit supervision at intermediate layers.</p></div>' +
      '<div class="theory-card"><h3>Receptive Field Growth</h3><p>Each convolutional layer increases the <strong>effective receptive field</strong> — the region of the input that influences a given feature map neuron.</p><p>Layer 1: 3×3×3 (local edges)<br>Layer 2: 5×5×5 (small patterns)<br>Layer 3: 7×7×7 (parts)<br>Layer 4: 9×9×9 (regions)<br>Layer 5: 11×11×11 (global context)</p><p>Deeper layers have access to more contextual information, enabling them to make more globally-informed decisions.</p></div>' +
      '<div class="theory-card"><h3>Activation Maximization</h3><p>Activation maximization finds the input that maximally activates a specific neuron or channel:</p><p>x* = argmax<sub>x</sub> f<sub>k</sub>(x) − λ‖x‖²</p><p>The regularization term (λ‖x‖²) ensures the maximized input remains plausible. This reveals what each filter is "looking for" and helps interpret learned features.</p></div>' +
      '<div class="theory-card"><h3>Trust and Interpretability</h3><p>In medical AI, interpretability is not optional — it is <strong>clinically required</strong>:</p><ul><li><strong>Regulatory</strong>: FDA requires explainability for clinical decision support</li><li><strong>Adoption</strong>: Radiologists trust systems they can understand</li><li><strong>Safety</strong>: Understanding failure modes prevents harmful misdiagnoses</li><li><strong>Science</strong>: Visualizations reveal if the model learns clinically relevant features</li></ul><p>Feature visualization bridges the gap between model performance and clinical trust.</p></div>' +
      '</div>';
    page.appendChild(theorySection);

    const simSection = document.createElement('div');
    simSection.className = 'module-card';
    simSection.innerHTML = '<h2>Feature Visualization Comparison Chart</h2>';
    Components.createChart(simSection, 'radar', {
      labels: ['Edge Detection', 'Texture Sensitivity', 'Spatial Resolution', 'Semantic Abstraction', 'Clinical Relevance', 'Computational Cost'],
      datasets: [
        { label: 'Layer 1', data: [95, 20, 95, 5, 10, 10], borderColor: '#2563eb', backgroundColor: '#2563eb22' },
        { label: 'Layer 3', data: [40, 70, 50, 55, 60, 40], borderColor: '#9333ea', backgroundColor: '#9333ea22' },
        { label: 'Layer 5', data: [5, 40, 10, 95, 90, 80], borderColor: '#da3633', backgroundColor: '#da363322' }
      ]
    }, { responsive: true, scales: { r: { beginAtZero: true, max: 100, ticks: { color: '#8b949e' }, grid: { color: '#21262d' }, pointLabels: { color: '#c9d1d9', font: { size: 11 } } } }, plugins: { legend: { labels: { color: '#c9d1d9' } } } });
    page.appendChild(simSection);

    const codeSection = document.createElement('div');
    codeSection.className = 'module-card';
    codeSection.innerHTML = '<h2>Implementation: Feature Visualization with PyTorch Hooks</h2>';
    Components.createCodeBlock(codeSection, `import torch
import torch.nn as nn
import numpy as np
import matplotlib.pyplot as plt
from torchvision import models, transforms

class FeatureVisualizer:
    def __init__(self, model):
        self.model = model
        self.activations = {}
        self.hooks = []
        self._register_hooks()

    def _register_hooks(self):
        for name, module in self.model.named_modules():
            if isinstance(module, nn.Conv3d):
                hook = module.register_forward_hook(
                    self._create_hook(name)
                )
                self.hooks.append(hook)

    def _create_hook(self, name):
        def hook_fn(module, input, output):
            self.activations[name] = output.detach()
        return hook_fn

    def visualize_layer(self, layer_name, n_maps=16):
        if layer_name not in self.activations:
            print(f"Layer {layer_name} not found")
            return
        act = self.activations[layer_name][0]
        n_maps = min(n_maps, act.shape[0])
        fig, axes = plt.subplots(4, 4, figsize=(12, 12))
        for i, ax in enumerate(axes.flat):
            if i < n_maps:
                mid = act.shape[2] // 2
                ax.imshow(act[i, mid].cpu().numpy(), cmap='viridis')
            ax.axis('off')
        plt.suptitle(f'Feature Maps: {layer_name}')
        plt.tight_layout()
        plt.show()

    def compute_saliency(self, input_tensor, target_class):
        self.model.eval()
        input_tensor.requires_grad_(True)
        output = self.model(input_tensor)
        self.model.zero_grad()
        output[0, target_class].backward()
        saliency = input_tensor.grad.abs().squeeze()
        return saliency

    def grad_cam(self, input_tensor, target_layer, target_class):
        self.model.eval()
        gradients = []
        activations = []

        def forward_hook(module, inp, out):
            activations.append(out.detach())

        def backward_hook(module, grad_in, grad_out):
            gradients.append(grad_out[0].detach())

        handle_fwd = target_layer.register_forward_hook(forward_hook)
        handle_bwd = target_layer.register_full_backward_hook(backward_hook)

        output = self.model(input_tensor)
        self.model.zero_grad()
        output[0, target_class].backward()

        handle_fwd.remove()
        handle_bwd.remove()

        grads = gradients[0]
        acts = activations[0]
        weights = grads.mean(dim=(2, 3, 4), keepdim=True)
        cam = torch.relu((weights * acts).sum(dim=1))
        cam = cam / cam.max()
        return cam

    def remove_hooks(self):
        for hook in self.hooks:
            hook.remove()
        self.hooks.clear()

model = models.resnet18(pretrained=False)
visualizer = FeatureVisualizer(model)

dummy_input = torch.randn(1, 3, 64, 64, 64)
with torch.no_grad():
    output = model(dummy_input)

for layer_name in list(visualizer.activations.keys())[:4]:
    visualizer.visualize_layer(layer_name)
`);
    page.appendChild(codeSection);

    const quizSection = document.createElement('div');
    quizSection.className = 'module-card';
    quizSection.innerHTML = '<h2>Knowledge Check</h2>';
    Components.createQuiz(quizSection, [
      { q: 'What types of features do the earliest convolutional layers (Layer 1-2) typically detect?', options: ['High-level semantic concepts like tumor types', 'Low-level features like edges, gradients, and simple textures', 'Classification decisions for LI-RADS categories', 'Attention weights between different image regions'], correct: 1, explanation: 'Early layers detect universal low-level features such as edges, gradients, and simple texture patterns. These are shared across all image domains and do not encode task-specific information. They form the building blocks that deeper layers combine into more complex representations.' },
      { q: 'Why does the receptive field grow deeper in the network?', options: ['Because deeper layers use larger input images', 'Because each convolutional layer adds to the effective input region a neuron can see', 'Because pooling layers decrease the number of parameters', 'Because deeper networks always have more filters'], correct: 1, explanation: 'Each convolutional and pooling layer increases the effective receptive field — the region of the original input that influences a given neuron. This allows deeper neurons to incorporate more contextual information, enabling them to recognize larger structures and make more globally-informed decisions.' },
      { q: 'What is the primary purpose of activation maximization in feature visualization?', options: ['To speed up model training', 'To find the input that maximally activates a specific neuron, revealing what it detects', 'To reduce the number of parameters in the model', 'To improve the accuracy of the final classification'], correct: 1, explanation: 'Activation maximization generates a synthetic input that maximally activates a target neuron, revealing what that neuron is "looking for." This provides direct insight into the learned features without requiring access to training data, making it valuable for model interpretation and debugging.' },
      { q: 'Why is feature visualization particularly important for medical AI systems?', options: ['It makes models run faster on clinical hardware', 'It reduces the amount of training data needed', 'It builds trust by showing radiologists what the model learned, which is required for clinical adoption and regulatory approval', 'It eliminates the need for external validation studies'], correct: 2, explanation: 'Feature visualization builds trust by revealing that the model learns clinically meaningful features rather than spurious correlations. This is essential for clinical adoption (radiologists need to trust the system), regulatory approval (FDA requires explainability), and safety (understanding failure modes prevents harmful errors).' }
    ]);
    page.appendChild(quizSection);

    const reflectionSection = document.createElement('div');
    reflectionSection.className = 'module-card reflection';
    reflectionSection.innerHTML = '<h2>Reflection: Trust and Interpretability</h2>' +
      '<div class="theory-card"><h3>The Trust Gap in Medical AI</h3><p>Deep learning models often achieve impressive quantitative metrics but remain "black boxes" to clinicians. Feature visualization addresses this by revealing <strong>what</strong> the model learned and <strong>why</strong> it makes specific predictions.</p><p>For liver lesion classification, visualization can confirm whether the model focuses on clinically relevant regions (arterial enhancement, washout patterns) rather than artifacts or irrelevant features.</p></div>' +
      '<div class="theory-card"><h3>From Pixels to Diagnosis</h3><p>The feature hierarchy in CNNs mirrors the diagnostic process: radiologists first identify boundaries (edge detectors), then assess texture (texture features), evaluate enhancement patterns (part detectors), and finally classify the lesion (high-level features). This parallel suggests that deep networks learn clinically meaningful representations.</p></div>' +
      '<div class="theory-card"><h3>Practical Applications</h3><ul><li><strong>Quality assurance</strong>: Verify the model uses relevant image regions</li><li><strong>Error analysis</strong>: Understand why misclassifications occur</li><li><strong>Model improvement</strong>: Identify underperforming layers or features</li><li><strong>Clinical communication</strong>: Explain predictions to treating physicians</li><li><strong>Regulatory documentation</strong>: Demonstrate safe and appropriate feature learning</li></ul></div>' +
      '<div class="theory-card"><h3>Limitations</h3><p>Feature visualizations are approximations of model behavior. They may not perfectly represent the true decision process, especially for complex non-linear models. Complementary approaches like LIME, SHAP, and attention visualization provide additional interpretability perspectives.</p></div>';
    page.appendChild(reflectionSection);


    const navHeader = document.createElement('div');
    navHeader.style.cssText = 'padding:1.5rem 1.5rem 0;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.5rem;';
    navHeader.innerHTML = '<h2 class="font-orbitron text-2xl font-bold gradient-text" style="margin:0;">Module 11: CNN Visualization</h2><button data-navigate="home" class="px-4 py-2 rounded-lg border border-white/20 text-sm text-gray-300 hover:text-white hover:border-primary-400/50 transition-all cursor-pointer" style="background:rgba(255,255,255,0.04);min-height:40px;" aria-label="Back to Home">&#x2190; Home</button>';
    container.insertBefore(navHeader, container.firstChild);

    container.appendChild(page);
    const navFooter = document.createElement('div');
    navFooter.style.cssText = 'padding:1rem 1.5rem 2rem;display:flex;justify-content:center;';
    navFooter.innerHTML = '<button data-navigate="home" class="px-6 py-3 rounded-xl border border-white/20 text-sm text-gray-300 hover:text-white hover:border-primary-400/50 transition-all cursor-pointer" style="background:rgba(255,255,255,0.04);min-height:44px;">&#x2190; Back to Home</button>';
    container.appendChild(navFooter);

  },

  destroy() {
    state.animating = false;
    _m11Animating = false;
    if (_m11AnimFrame) {
      cancelAnimationFrame(_m11AnimFrame);
      _m11AnimFrame = null;
    }
  }
});
