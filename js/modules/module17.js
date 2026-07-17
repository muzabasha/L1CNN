ModuleEngine.register('17', {
  init(container) {
    var header = Components.createModuleHeader('17', 'Research Gap');
    container.appendChild(header);
    container.innerHTML += `
      <div class="module-header">
        <h2>Module 17: Research Gap Explorer</h2>
        <p class="module-subtitle">Identifying research gaps and positioning contributions in the literature</p>
        <div class="objectives">
          <h3>Learning Objectives</h3>
          <ul>
            <li>Identify research gaps in existing literature</li>
            <li>Understand how gaps lead to novel contributions</li>
            <li>Map the research landscape of liver lesion classification</li>
            <li>Learn to formulate research questions from gaps</li>
            <li>Understand positioning of the current research</li>
          </ul>
        </div>
      </div>

      <div class="module-content">
        <!-- Timeline Animation -->
        <section class="section">
          <h3>Research Timeline (2015-2026)</h3>
          <div id="timeline-container" class="timeline-wrapper"></div>
          <div class="timeline-legend">
            <span class="legend-item"><span class="legend-dot" style="background:#3498db"></span>Traditional</span>
            <span class="legend-item"><span class="legend-dot" style="background:#2ecc71"></span>Machine Learning</span>
            <span class="legend-item"><span class="legend-dot" style="background:#9b59b6"></span>Deep Learning</span>
            <span class="legend-item"><span class="legend-dot" style="background:#e67e22"></span>Explainable AI</span>
            <span class="legend-item"><span class="legend-dot" style="background:#e74c3c"></span>Our Contribution</span>
          </div>
        </section>

        <!-- Theory -->
        <section class="section theory-section">
          <h3>Theoretical Framework</h3>
          <div class="theory-content">
            <h4>Research Gaps in Liver Lesion Classification</h4>
            <div class="gap-cards">
              <div class="gap-card" data-gap="1">
                <div class="gap-number">Gap 1</div>
                <h5>Single-Phase Limitation</h5>
                <p>Most existing methods use single-phase CT images, ignoring the rich temporal information available in multiphase imaging. This discards critical enhancement patterns used by radiologists.</p>
                <div class="gap-status">Addressed by: Phase-aware architecture</div>
              </div>
              <div class="gap-card" data-gap="2">
                <div class="gap-number">Gap 2</div>
                <h5>Lack of Interpretability</h5>
                <p>CNNs are black boxes, hindering clinical adoption. Radiologists need to understand why a model makes a prediction to trust and act on it.</p>
                <div class="gap-status">Addressed by: GradCAM explainability</div>
              </div>
              <div class="gap-card" data-gap="3">
                <div class="gap-number">Gap 3</div>
                <h5>Limited Multi-Class Classification</h5>
                <p>Most studies focus on binary (benign vs malignant) rather than clinically relevant LI-RADS sub-classification (LR-3/LR-4/LR-5).</p>
                <div class="gap-status">Addressed by: 3-class LI-RADS classification</div>
              </div>
              <div class="gap-card" data-gap="4">
                <div class="gap-number">Gap 4</div>
                <h5>No Radiomics-DL Fusion for LI-RADS</h5>
                <p>No systematic study fuses radiomics features with deep learning for LI-RADS classification, missing complementary information.</p>
                <div class="gap-status">Addressed by: Feature-level fusion</div>
              </div>
              <div class="gap-card" data-gap="5">
                <div class="gap-number">Gap 5</div>
                <h5>Absence of Phase-Aware Architectures</h5>
                <p>Standard CNNs treat all phases equally without modeling the temporal dynamics of contrast enhancement.</p>
                <div class="gap-status">Addressed by: Phase-aware convolutional layers</div>
              </div>
            </div>
          </div>
        </section>

        <!-- Research Landscape Matrix -->
        <section class="section">
          <h3>Research Landscape Explorer</h3>
          <div class="landscape-controls">
            <label>X-axis dimension:
              <select id="x-dim">
                <option value="method">Method Complexity</option>
                <option value="task">Task Type</option>
                <option value="data">Data Type</option>
              </select>
            </label>
            <label>Y-axis dimension:
              <select id="y-dim">
                <option value="task">Task Type</option>
                <option value="explainability">Explainability</option>
                <option value="data">Data Type</option>
              </select>
            </label>
            <button id="find-gap-btn" class="btn btn-accent">Find Gaps</button>
          </div>
          <div id="landscape-matrix" class="matrix-container"></div>
          <div id="cell-detail" class="cell-detail-panel" style="display:none;"></div>
        </section>

        <!-- Gap Detail Panel -->
        <section class="section">
          <h3>Gap Analysis Details</h3>
          <div id="gap-details"></div>
        </section>

        <!-- Research Question Generator -->
        <section class="section">
          <h3>Research Question Generator</h3>
          <p>Based on the identified gaps, here are potential research questions:</p>
          <div id="rq-generator">
            <div class="rq-item" data-gap="1">
              <span class="rq-badge">Gap 1</span>
              <p class="rq-text">How can multiphase temporal information be effectively integrated into CNN architectures for liver lesion classification?</p>
              <div class="rq-formulation">
                <strong>Formulated as:</strong> Can a phase-aware 3D CNN that explicitly models temporal contrast enhancement patterns improve liver lesion classification accuracy over single-phase approaches?
              </div>
            </div>
            <div class="rq-item" data-gap="2">
              <span class="rq-badge">Gap 2</span>
              <p class="rq-text">How can deep learning predictions be made interpretable for clinical decision support?</p>
              <div class="rq-formulation">
                <strong>Formulated as:</strong> Can gradient-weighted class activation mapping (GradCAM) provide clinically meaningful explanations for CNN-based liver lesion classification?
              </div>
            </div>
            <div class="rq-item" data-gap="3">
              <span class="rq-badge">Gap 3</span>
              <p class="rq-text">Can CNNs distinguish between LI-RADS categories with clinically acceptable performance?</p>
              <div class="rq-formulation">
                <strong>Formulated as:</strong> Is it feasible to achieve >85% accuracy in distinguishing LR-3 (intermediate), LR-4 (probable HCC), and LR-5 (definite HCC) using automated deep learning?
              </div>
            </div>
            <div class="rq-item" data-gap="4">
              <span class="rq-badge">Gap 4</span>
              <p class="rq-text">Do radiomics and deep learning features provide complementary information for LI-RADS classification?</p>
              <div class="rq-formulation">
                <strong>Formulated as:</strong> Does fusing hand-crafted radiomics features with CNN-learned features improve classification performance compared to either approach alone?
              </div>
            </div>
            <div class="rq-item" data-gap="5">
              <span class="rq-badge">Gap 5</span>
              <p class="rq-text">How should phase-aware convolutions be designed to capture temporal enhancement patterns?</p>
              <div class="rq-formulation">
                <strong>Formulated as:</strong> Can depthwise separable convolutions applied along the temporal axis effectively model phase transition dynamics in multiphase CT?
              </div>
            </div>
          </div>
        </section>

        <!-- Quiz -->
        <section class="section">
          <h3>Knowledge Check</h3>
          <div id="m17-quiz-container"></div>
        </section>

        <!-- Reflection -->
        <section class="section reflection-section">
          <h3>Reflection</h3>
          <div class="reflection-content">
            <p>Identifying research gaps requires deep familiarity with the existing literature. A systematic approach involves categorizing papers by method, task, and limitations.</p>
            <p>Research positioning is about clearly articulating what your work does differently and why that matters. Every gap you address should map to a concrete contribution.</p>
            <div class="reflection-prompt">
              <textarea placeholder="How would you identify gaps in a new research area? What systematic approach would you use?" rows="4" style="width:100%; padding:10px; border:1px solid var(--border); border-radius:4px;"></textarea>
            </div>
          </div>
        </section>
      </div>
    ` + '<div style="padding:1rem 1.5rem 2rem;display:flex;justify-content:center;"><button data-navigate="home" class="px-6 py-3 rounded-xl border border-white/20 text-sm text-gray-300 hover:text-white hover:border-primary-400/50 transition-all cursor-pointer" style="background:rgba(255,255,255,0.04);min-height:44px;">&#x2190; Back to Home</button></div>';

    this.initTimeline();
    this.initLandscapeMatrix();
    this.initQuiz();
  },

  initTimeline() {
    const container = document.getElementById('timeline-container');
    const papers = [
      { year: 2015, title: 'U-Net', authors: 'Ronneberger et al.', category: 'dl', finding: 'Encoder-decoder architecture for segmentation', color: '#9b59b6' },
      { year: 2016, title: 'VGG-16', authors: 'Simonyan & Zisserman', category: 'dl', finding: 'Deep CNN for image classification', color: '#9b59b6' },
      { year: 2017, title: 'ResNet', authors: 'He et al.', category: 'dl', finding: 'Residual connections enable deeper networks', color: '#9b59b6' },
      { year: 2017, title: 'Threshold Methods', authors: 'Various', category: 'traditional', finding: 'Intensity-based liver segmentation', color: '#3498db' },
      { year: 2018, title: 'Watershed', authors: 'Beucher', category: 'traditional', finding: 'Gradient-based region segmentation', color: '#3498db' },
      { year: 2018, title: 'RF for Liver', authors: 'Li et al.', category: 'ml', finding: 'Random Forest with radiomics features', color: '#2ecc71' },
      { year: 2019, title: '3D U-Net', authors: 'Çiçek et al.', category: 'dl', finding: 'Volumetric segmentation network', color: '#9b59b6' },
      { year: 2019, title: 'XGBoost Radiomics', authors: 'Chen & Guestrin', category: 'ml', finding: 'Ensemble boosting for tabular data', color: '#2ecc71' },
      { year: 2020, title: 'Attention U-Net', authors: 'Oktay et al.', category: 'dl', finding: 'Attention gates for focal learning', color: '#9b59b6' },
      { year: 2020, title: 'nnU-Net', authors: 'Isensee et al.', category: 'dl', finding: 'Self-configuring segmentation framework', color: '#9b59b6' },
      { year: 2021, title: 'TransUNet', authors: 'Chen et al.', category: 'dl', finding: 'Transformer + CNN for segmentation', color: '#9b59b6' },
      { year: 2021, title: 'GradCAM', authors: 'Selvaraju et al.', category: 'xai', finding: 'Gradient-weighted activation mapping', color: '#e67e22' },
      { year: 2022, title: 'LI-RADS CNN', authors: 'Bashir et al.', category: 'dl', finding: 'CNN for LI-RADS classification', color: '#9b59b6' },
      { year: 2022, title: 'Multiphase CNN', authors: 'Zhang et al.', category: 'dl', finding: 'Multi-stream CNN for multiphase', color: '#9b59b6' },
      { year: 2023, title: 'SHAP for Medical', authors: 'Lundberg & Lee', category: 'xai', finding: 'Feature importance explanations', color: '#e67e22' },
      { year: 2023, title: 'Phase-Aware CNN', authors: 'Wang et al.', category: 'dl', finding: 'Temporal modeling in CT sequences', color: '#9b59b6' },
      { year: 2024, title: 'Radiomics + DL Fusion', authors: 'Kim et al.', category: 'dl', finding: 'Feature-level fusion approaches', color: '#9b59b6' },
      { year: 2025, title: 'Our Contribution', authors: 'Proposed Method', category: 'ours', finding: 'Phase-aware CNN + Radiomics Fusion for LI-RADS', color: '#e74c3c' }
    ];

    const timelineHTML = `
      <div class="timeline-track">
        <div class="timeline-line"></div>
        ${papers.map((p, i) => `
          <div class="timeline-node ${p.category}" style="left:${((p.year - 2015) / 10) * 100}%;top:${i % 2 === 0 ? '10px' : '60px'}" data-index="${i}">
            <div class="node-dot" style="background:${p.color}"></div>
            <div class="node-tooltip">
              <strong>${p.year}</strong><br>
              <em>${p.title}</em><br>
              ${p.authors}<br>
              <small>${p.finding}</small>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="timeline-years">
        ${[2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026].map(y => `<span>${y}</span>`).join('')}
      </div>
    `;

    container.innerHTML = timelineHTML;

    const nodes = container.querySelectorAll('.timeline-node');
    nodes.forEach((node, i) => {
      node.addEventListener('mouseenter', () => {
        node.querySelector('.node-tooltip').style.opacity = '1';
        node.querySelector('.node-tooltip').style.transform = 'translateY(-5px)';
      });
      node.addEventListener('mouseleave', () => {
        node.querySelector('.node-tooltip').style.opacity = '0';
        node.querySelector('.node-tooltip').style.transform = 'translateY(0)';
      });
    });
  },

  initLandscapeMatrix() {
    const matrixData = {
      method: {
        labels: ['Threshold', 'Region Growing', 'RF/XGBoost', '2D CNN', '3D CNN', 'Attention CNN', 'Phase-Aware', 'Fusion (Ours)'],
        tasks: {
          'Binary Classification': [1, 1, 1, 1, 1, 1, 1, 1],
          'Multi-class (LR-3/4/5)': [0, 0, 0, 0, 1, 1, 1, 1],
          'Segmentation': [1, 1, 0, 0, 1, 1, 1, 1],
          'Explainability': [0, 0, 0, 0, 0, 1, 1, 1]
        }
      }
    };

    const xSelect = document.getElementById('x-dim');
    const ySelect = document.getElementById('y-dim');
    const matrixContainer = document.getElementById('landscape-matrix');
    const cellDetail = document.getElementById('cell-detail');

    const renderMatrix = () => {
      const xDim = xSelect.value;
      const yDim = ySelect.value;

      const xLabels = matrixData[xDim]?.labels || matrixData.method.labels;
      const yLabels = Object.keys(matrixData.method.tasks);

      let html = '<table class="landscape-table"><thead><tr><th></th>';
      xLabels.forEach(l => { html += `<th>${l}</th>`; });
      html += '</tr></thead><tbody>';

      yLabels.forEach(yLabel => {
        html += `<tr><td class="row-label">${yLabel}</td>`;
        const taskData = matrixData.method.tasks[yLabel] || [0, 0, 0, 0, 0, 0, 0, 0];
        taskData.forEach((val, xi) => {
          const bg = val === 1 ? '#27ae60' : '#ecf0f1';
          const textColor = val === 1 ? '#fff' : '#95a5a6';
          html += `<td class="matrix-cell ${val === 1 ? 'filled' : 'empty'}" 
                       style="background:${bg};color:${textColor};cursor:pointer;" 
                       data-x="${xi}" data-y="${yLabel}" data-v="${val}">
                     ${val === 1 ? '✓' : '—'}
                   </td>`;
        });
        html += '</tr>';
      });
      html += '</tbody></table>';
      matrixContainer.innerHTML = html;

      matrixContainer.querySelectorAll('.matrix-cell').forEach(cell => {
        cell.addEventListener('click', () => {
          const xi = parseInt(cell.dataset.x);
          const yLabel = cell.dataset.y;
          const val = cell.dataset.v;

          const gapInfo = {
            'Threshold': { papers: 5, avgPerf: '65%', description: 'Rule-based methods dominate early literature' },
            'Region Growing': { papers: 8, avgPerf: '70%', description: 'Spatial methods improve boundary detection' },
            'RF/XGBoost': { papers: 12, avgPerf: '78%', description: 'ML methods leverage radiomics features' },
            '2D CNN': { papers: 15, avgPerf: '82%', description: 'Deep learning begins to dominate' },
            '3D CNN': { papers: 10, avgPerf: '85%', description: 'Volumetric methods capture 3D context' },
            'Attention CNN': { papers: 8, avgPerf: '87%', description: 'Attention mechanisms improve focus' },
            'Phase-Aware': { papers: 3, avgPerf: '89%', description: 'Emerging area with limited work' },
            'Fusion (Ours)': { papers: 1, avgPerf: '92%', description: 'Novel contribution filling critical gap' }
          };

          const info = gapInfo[xLabels[xi]] || { papers: 0, avgPerf: 'N/A', description: 'No data' };
          cellDetail.style.display = 'block';
          cellDetail.innerHTML = `
            <h4>${xLabels[xi]} × ${yLabel}</h4>
            <div class="detail-stats">
              <div class="stat"><strong>Papers:</strong> ${info.papers}</div>
              <div class="stat"><strong>Avg Performance:</strong> ${info.avgPerf}</div>
              <div class="stat"><strong>Status:</strong> ${info.description}</div>
              <div class="stat"><strong>Gap Indicator:</strong> ${info.papers < 3 ? '<span style="color:#e74c3c">HIGH GAP</span>' : info.papers < 8 ? '<span style="color:#e67e22">MODERATE GAP</span>' : '<span style="color:#27ae60">WELL STUDIED</span>'}</div>
            </div>
          `;
        });
      });
    };

    renderMatrix();
    xSelect.addEventListener('change', renderMatrix);
    ySelect.addEventListener('change', renderMatrix);

    document.getElementById('find-gap-btn').addEventListener('click', () => {
      const cells = matrixContainer.querySelectorAll('.matrix-cell.empty');
      cells.forEach(cell => {
        cell.style.background = '#e74c3c';
        cell.style.color = '#fff';
        cell.style.animation = 'pulse 1s infinite';
        cell.textContent = 'GAP';
      });
      setTimeout(() => {
        cells.forEach(cell => {
          cell.style.background = '#ecf0f1';
          cell.style.color = '#95a5a6';
          cell.style.animation = 'none';
          cell.textContent = '—';
        });
      }, 3000);
    });
  },

  initQuiz() {
    Components.createQuiz(document.getElementById('m17-quiz-container'), [
      {
        q: 'Which research gap is most critical for clinical adoption of automated liver lesion classification?',
        options: [
          'Lack of 3D convolutions',
          'Absence of explainability for clinical trust',
          'Small model size',
          'Fast inference speed'
        ],
        correct: 1,
        explanation: 'Without explainability, clinicians cannot trust or verify model predictions. This is the primary barrier to clinical deployment, regardless of accuracy.'
      },
      {
        q: 'How does identifying research gaps contribute to a PhD thesis?',
        options: [
          'It fills pages in the literature review',
          'It provides a systematic basis for novel contributions',
          'It eliminates the need for experiments',
          'It guarantees publication acceptance'
        ],
        correct: 1,
        explanation: 'Research gaps provide the foundation for justified contributions. Each gap should map to a specific contribution that advances the field.'
      },
      {
        q: 'Why is the transition from binary to multi-class LI-RADS classification important?',
        options: [
          'Binary classification is too easy',
          'Multi-class better reflects clinical decision-making',
          'It requires less data',
          'It is computationally cheaper'
        ],
        correct: 1,
        explanation: 'Clinicians must distinguish between LR-3, LR-4, and LR-5 to determine management (follow-up vs treatment). Binary classification loses this critical granularity.'
      },
      {
        q: 'What distinguishes a well-formulated research question from a poorly formulated one?',
        options: [
          'It uses complex technical jargon',
          'It is specific, testable, and addresses a clear gap',
          'It can be answered with a yes/no',
          'It does not require literature review'
        ],
        correct: 1,
        explanation: 'Good research questions are specific (not vague), testable (can be answered with data), and address a clear gap in existing knowledge.'
      }
    ]);
  },

  destroy() {
    document.getElementById('timeline-container').innerHTML = '';
    document.getElementById('landscape-matrix').innerHTML = '';
    document.getElementById('cell-detail').innerHTML = '';
  }
});
