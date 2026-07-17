let _m8AnimFrame = null;

ModuleEngine.register('8', {
    init(container) {
        var header = Components.createModuleHeader('8', 'Radiomics');
        container.appendChild(header);
        container.innerHTML += `
        <div class="module-container">
            <div class="module-header">
                <h2>Module 8: Radiomics — Extracting Texture Features</h2>
                <p class="module-subtitle">Understand and compute quantitative imaging features for clinical prediction</p>
            </div>

            <div class="section objectives-section">
                <h3>🎯 Learning Objectives</h3>
                <ul>
                    <li>Understand what radiomics features represent mathematically</li>
                    <li>Learn about first-order, second-order, and higher-order features</li>
                    <li>Extract and interpret GLCM, GLRLM, GLSZM features</li>
                    <li>Understand feature selection and dimensionality reduction</li>
                    <li>Learn PyRadiomics workflow and feature engineering pipeline</li>
                </ul>
            </div>

            <div class="section animation-section">
                <h3>🎬 Feature Extraction Visualization</h3>
                <div class="canvas-container">
                    <canvas id="radAnimCanvas" width="800" height="320"></canvas>
                </div>
                <div class="animation-controls">
                    <div class="btn-group-inline">
                        <button class="btn btn-sm active" data-feature="firstorder">First-Order</button>
                        <button class="btn btn-sm" data-feature="glcm">GLCM</button>
                        <button class="btn btn-sm" data-feature="glrlm">GLRLM</button>
                        <button class="btn btn-sm" data-feature="shape">Shape</button>
                    </div>
                    <span class="anim-status" id="radAnimStatus">Hover over a feature category to explore</span>
                </div>
            </div>

            <div class="section theory-section">
                <h3>📖 Theory: Radiomics</h3>

                <div class="info-box highlight">
                    <h4>What is Radiomics?</h4>
                    <p>Radiomics is the high-throughput extraction of quantitative features from medical images. These features capture phenotypic characteristics — shape, texture, intensity patterns — that are invisible to the human eye but correlated with underlying biology, treatment response, and prognosis.</p>
                    <div class="formula">Radiomics Pipeline: Image → Segmentation → Feature Extraction → Feature Selection → Model Building → Clinical Decision</div>
                </div>

                <h4>Feature Categories</h4>

                <div class="feature-grid">
                    <div class="feature-card" id="firstOrderCard">
                        <h5>📊 First-Order Statistics</h5>
                        <p>Describe the distribution of individual voxel intensities within the ROI, ignoring spatial relationships.</p>
                        <div class="formula-block">
                            <div>Mean: μ = (1/N) Σ I(i)</div>
                            <div>Variance: σ² = (1/N) Σ (I(i) - μ)²</div>
                            <div>Skewness: (1/N) Σ ((I(i) - μ)/σ)³</div>
                            <div>Kurtosis: (1/N) Σ ((I(i) - μ)/σ)⁴ - 3</div>
                            <div>Entropy: H = -Σ p(i) log₂(p(i))</div>
                            <div>Energy: E = Σ I(i)²</div>
                        </div>
                        <p class="clinical-note">Clinical: High entropy → heterogeneous tissue → may indicate malignancy</p>
                    </div>

                    <div class="feature-card" id="shapeCard">
                        <h5>📐 Shape Features</h5>
                        <p>Capture the 3D geometric properties of the segmented volume.</p>
                        <div class="formula-block">
                            <div>Volume: V = Σ voxels × voxel_volume</div>
                            <div>Surface Area: A = Σ boundary faces</div>
                            <div>Sphericity: π^(1/3) × (6V)^(2/3) / A</div>
                            <div>Elongation: λ_min / λ_max (eigenvalue ratio)</div>
                            <div>Flatness: λ_min / λ_2</div>
                            <div>Compactness: V^(1/2) / A</div>
                        </div>
                        <p class="clinical-note">Clinical: Sphericity near 1 = round tumor; low sphericity = irregular margins</p>
                    </div>

                    <div class="feature-card" id="glcmCard">
                        <h5>🔢 GLCM (Second-Order)</h5>
                        <p>Gray Level Co-occurrence Matrix captures spatial relationships between pairs of pixels at specific distances and angles.</p>
                        <div class="formula-block">
                            <div>P(i,j|d,θ) = count of pairs (p1,p2) where I(p1)=i, I(p2)=j</div>
                            <div>Contrast: Σ|i-j|² × P(i,j)</div>
                            <div>Correlation: Σ(i-μx)(j-μy)×P(i,j) / (σx×σy)</div>
                            <div>Energy: Σ P(i,j)² (ASM)</div>
                            <div>Homogeneity: Σ P(i,j) / (1+|i-j|)</div>
                            <div>Entropy: -Σ P(i,j) × log(P(i,j))</div>
                        </div>
                        <p class="clinical-note">Clinical: High contrast + low homogeneity → coarse texture → aggressive tumors</p>
                    </div>

                    <div class="feature-card" id="glrlmCard">
                        <h5>📏 GLRLM (Second-Order)</h5>
                        <p>Gray Level Run Length Matrix captures consecutive voxels with the same gray level in a specific direction.</p>
                        <div class="formula-block">
                            <div>Short Run Emphasis: Σ P(i,j) / j²</div>
                            <div>Long Run Emphasis: Σ P(i,j) × j²</div>
                            <div>Gray Level Non-Uniformity: Σ (Σj P(i,j))²</div>
                            <div>Run Percentage: N_runs / N_voxels</div>
                        </div>
                        <p class="clinical-note">Clinical: High SRE → fine texture; High LRE → coarse/homogeneous regions</p>
                    </div>

                    <div class="feature-card" id="glszmCard">
                        <h5>📦 GLSZM (Second-Order)</h5>
                        <p>Gray Level Size Zone Matrix groups connected voxels of the same intensity into zones and measures their sizes.</p>
                        <div class="formula-block">
                            <div>Small Area Emphasis: Σ P(i,j) / j²</div>
                            <div>Large Area Emphasis: Σ P(i,j) × j²</div>
                            <div>Gray Level Variance: Σi (μ_zone(i) - μ)² × P(i)</div>
                            <div>Zone Variance: Σj (μ_size(j) - μ)² × P(j)</div>
                        </div>
                        <p class="clinical-note">Clinical: High SAE + low LAE → fragmented lesion → heterogeneous internal structure</p>
                    </div>

                    <div class="feature-card" id="higherCard">
                        <h5>🌊 Higher-Order Features</h5>
                        <p>Apply mathematical transforms to the image before feature extraction.</p>
                        <div class="formula-block">
                            <div>Wavelet: Decompose into LL, LH, HL, HH sub-bands</div>
                            <div>LoG (Laplacian of Gaussian): Multi-scale edge detection</div>
                            <div>Exponential: log(1 + x) transform</div>
                            <div>Square/SquareRoot: Power transforms</div>
                            <div>Logarithm: ln(1 + x) transform</div>
                        </div>
                        <p class="clinical-note">Clinical: Wavelet features capture multi-scale texture patterns</p>
                    </div>
                </div>

                <h4>Feature Selection & Dimensionality Reduction</h4>
                <div class="info-box">
                    <div class="two-column">
                        <div class="col">
                            <h5>Why Feature Selection?</h5>
                            <ul>
                                <li>Radiomics can yield 100-1000+ features</li>
                                <li>Curse of dimensionality with small datasets</li>
                                <li>Overfitting risk increases with more features</li>
                                <li>Clinical interpretability requires fewer features</li>
                            </ul>
                        </div>
                        <div class="col">
                            <h5>Common Methods</h5>
                            <ul>
                                <li><strong>mRMR:</strong> Minimum Redundancy Maximum Relevance</li>
                                <li><strong>LASSO:</strong> L1 regularization for sparsity</li>
                                <li><strong>Correlation filtering:</strong> Remove features with |r| > 0.9</li>
                                <li><strong>Boruta:</strong> All-relevant feature selection</li>
                                <li><strong>Univariate:</strong> Mann-Whitney U test, chi-squared</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="info-box highlight">
                    <h4>PyRadiomics Overview</h4>
                    <p>PyRadiomics is the standard open-source library for radiomics extraction. It supports:</p>
                    <ul>
                        <li>All standard feature classes (first-order, GLCM, GLRLM, GLSZM, NGTDM, NGLDM)</li>
                        <li>Multiple image filters (wavelet, LoG, square, etc.)</li>
                        <li>Configurable parameters via YAML</li>
                        <li>CSV output for direct integration with ML pipelines</li>
                    </ul>
                    <div class="formula">pip install pyradiomics && radiomicsextractor.exe params.yaml input.nrrd mask.nrrd</div>
                </div>
            </div>

            <div class="section simulation-section">
                <h3>🧪 Interactive GLCM Calculator</h3>

                <div class="sim-container">
                    <div class="sim-left">
                        <h4>Texture Patch Editor</h4>
                        <p class="hint">Click cells to modify gray levels. Use controls below to compute GLCM.</p>
                        <div class="canvas-container">
                            <canvas id="glcmTextureCanvas" width="320" height="320"></canvas>
                        </div>

                        <div class="sim-controls">
                            <div class="control-group">
                                <label for="glcmGrayLevels">Gray Levels:</label>
                                <select id="glcmGrayLevels" class="form-select">
                                    <option value="4">4</option>
                                    <option value="6">6</option>
                                    <option value="8" selected>8</option>
                                    <option value="12">12</option>
                                    <option value="16">16</option>
                                </select>
                            </div>
                            <div class="control-group">
                                <label for="glcmDistance">Distance (d):</label>
                                <select id="glcmDistance" class="form-select">
                                    <option value="1" selected>1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="5">5</option>
                                </select>
                            </div>
                            <div class="control-group">
                                <label for="glcmAngle">Angle (θ):</label>
                                <select id="glcmAngle" class="form-select">
                                    <option value="0" selected>0°</option>
                                    <option value="45">45°</option>
                                    <option value="90">90°</option>
                                    <option value="135">135°</option>
                                    <option value="all">All (avg)</option>
                                </select>
                            </div>
                            <div class="button-group">
                                <button class="btn btn-primary" id="btnComputeGLCM">🔢 Compute GLCM</button>
                                <button class="btn btn-secondary" id="btnRandomTexture">🎲 Random Texture</button>
                            </div>
                        </div>
                    </div>

                    <div class="sim-right">
                        <h4>GLCM Visualization</h4>
                        <div class="canvas-container">
                            <canvas id="glcmMatrixCanvas" width="300" height="300"></canvas>
                        </div>
                        <div id="glcmFeaturesDisplay" class="features-panel">
                            <h5>Computed Features</h5>
                            <div class="feature-row">
                                <span class="feature-label">Contrast:</span>
                                <span class="feature-value" id="glcmContrast">—</span>
                                <span class="feature-desc">Intensity differences between neighboring pixels</span>
                            </div>
                            <div class="feature-row">
                                <span class="feature-label">Correlation:</span>
                                <span class="feature-value" id="glcmCorrelation">—</span>
                                <span class="feature-desc">Linear dependency between pixel pairs</span>
                            </div>
                            <div class="feature-row">
                                <span class="feature-label">Energy (ASM):</span>
                                <span class="feature-value" id="glcmEnergy">—</span>
                                <span class="feature-desc">Sum of squared GLCM elements</span>
                            </div>
                            <div class="feature-row">
                                <span class="feature-label">Homogeneity:</span>
                                <span class="feature-value" id="glcmHomogeneity">—</span>
                                <span class="feature-desc">Closeness of GLCM diagonal distribution</span>
                            </div>
                            <div class="feature-row">
                                <span class="feature-label">Entropy:</span>
                                <span class="feature-value" id="glcmEntropy">—</span>
                                <span class="feature-desc">Randomness / complexity of texture</span>
                            </div>
                        </div>
                    </div>
                </div>

                <h4 style="margin-top:2rem;">📊 Interactive Histogram — First-Order Features</h4>
                <div class="sim-container">
                    <div class="sim-left">
                        <div class="chart-container">
                            <canvas id="firstOrderHistChart" width="450" height="280"></canvas>
                        </div>
                    </div>
                    <div class="sim-right">
                        <div id="firstOrderFeaturesDisplay" class="features-panel">
                            <h5>First-Order Statistics</h5>
                            <div class="feature-row">
                                <span class="feature-label">Mean:</span>
                                <span class="feature-value" id="foMean">—</span>
                            </div>
                            <div class="feature-row">
                                <span class="feature-label">Std Dev:</span>
                                <span class="feature-value" id="foStd">—</span>
                            </div>
                            <div class="feature-row">
                                <span class="feature-label">Skewness:</span>
                                <span class="feature-value" id="foSkew">—</span>
                                <span class="feature-desc">Asymmetry of intensity distribution</span>
                            </div>
                            <div class="feature-row">
                                <span class="feature-label">Kurtosis:</span>
                                <span class="feature-value" id="foKurt">—</span>
                                <span class="feature-desc">Peakedness of distribution</span>
                            </div>
                            <div class="feature-row">
                                <span class="feature-label">Entropy:</span>
                                <span class="feature-value" id="foEntropy">—</span>
                            </div>
                            <div class="feature-row">
                                <span class="feature-label">Energy:</span>
                                <span class="feature-value" id="foEnergy">—</span>
                            </div>
                            <div class="feature-row">
                                <span class="feature-label">Range:</span>
                                <span class="feature-value" id="foRange">—</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="section code-section">
                <h3>💻 Implementation Reference</h3>
                <div class="code-block-container" id="radCodeBlock"></div>
            </div>

            <div class="section quiz-section">
                <h3>📝 Knowledge Check</h3>
                <div id="radQuizContainer"></div>
            </div>

            <div class="section reflection-section">
                <h3>💭 Reflection</h3>
                <div class="reflection-box">
                    <h4>Radiomics vs Deep Learning Features</h4>
                    <p>Radiomics features are hand-crafted based on domain knowledge, making them interpretable and reproducible. Deep learning features are learned automatically but act as "black boxes." In clinical settings, radiomics features often achieve comparable performance with better explainability, especially for small datasets common in medical imaging.</p>

                    <h4>Interpretability Advantage</h4>
                    <p>When a radiologist sees that "high GLCM contrast predicts poor prognosis," they can relate this to visual texture patterns they observe daily. This clinical interpretability facilitates adoption and trust. Deep learning models may require post-hoc explanation methods (Grad-CAM, SHAP) to achieve similar insight.</p>

                    <h4>Clinical Radiomics Studies</h4>
                    <p>Landmark studies like Aerts et al. (2014) demonstrated that radiomics features are prognostic across multiple cancer types. The IBSI (Image Biomarker Standardisation Initiative) has since standardized feature definitions to ensure reproducibility across implementations.</p>

                    <h4>The Radiomics + Deep Learning Fusion</h4>
                    <p>Modern approaches combine radiomics features as inputs to deep learning networks, or use radiomics-guided loss functions. This hybrid approach leverages both the interpretability of hand-crafted features and the representation power of learned features.</p>
                </div>
            </div>
        </div>` + '<div style="padding:1rem 1.5rem 2rem;display:flex;justify-content:center;"><button data-navigate="home" class="px-6 py-3 rounded-xl border border-white/20 text-sm text-gray-300 hover:text-white hover:border-primary-400/50 transition-all cursor-pointer" style="background:rgba(255,255,255,0.04);min-height:44px;">&#x2190; Back to Home</button></div>';

        this.setupAnimation(container);
        this.setupGLCMSimulation(container);
        this.setupFirstOrderChart(container);
        this.setupCodeBlock(container);
        this.setupQuiz(container);
    },

    setupAnimation(container) {
        const canvas = document.getElementById('radAnimCanvas');
        const ctx = canvas.getContext('2d');
        let activeFeature = 'firstorder';
        let hoverT = 0;

        const patchSize = 8;
        const patch = [];
        for (let y = 0; y < patchSize; y++) {
            patch[y] = [];
            for (let x = 0; x < patchSize; x++) {
                patch[y][x] = Math.floor(Math.random() * 8);
            }
        }

        function drawPatch(ox, oy, cellSize, highlightFn) {
            for (let y = 0; y < patchSize; y++) {
                for (let x = 0; x < patchSize; x++) {
                    const val = patch[y][x];
                    const intensity = Math.floor((val / 7) * 200 + 40);
                    const hl = highlightFn ? highlightFn(x, y, val) : null;

                    if (hl) {
                        ctx.fillStyle = hl;
                    } else {
                        ctx.fillStyle = `rgb(${intensity},${intensity},${intensity})`;
                    }
                    ctx.fillRect(ox + x * cellSize, oy + y * cellSize, cellSize - 1, cellSize - 1);

                    ctx.fillStyle = val > 3 ? '#fff' : '#000';
                    ctx.font = `${Math.max(8, cellSize * 0.4)}px monospace`;
                    ctx.textAlign = 'center';
                    ctx.fillText(val, ox + x * cellSize + cellSize / 2, oy + y * cellSize + cellSize / 2 + 3);
                }
            }
        }

        function computeGLCM(d, angles) {
            const maxLevel = 8;
            const glcm = [];
            for (let i = 0; i < maxLevel; i++) {
                glcm[i] = [];
                for (let j = 0; j < maxLevel; j++) glcm[i][j] = 0;
            }

            const angleOffsets = {
                0: [[0, d]],
                45: [[-d, d]],
                90: [[d, 0]],
                135: [[d, d]]
            };

            const usedAngles = angles === 'all' ? [0, 45, 90, 135] : [parseInt(angles)];

            for (const angle of usedAngles) {
                const offsets = angleOffsets[angle];
                for (let y = 0; y < patchSize; y++) {
                    for (let x = 0; x < patchSize; x++) {
                        for (const [dy, dx] of offsets) {
                            const ny = y + dy, nx = x + dx;
                            if (ny >= 0 && ny < patchSize && nx >= 0 && nx < patchSize) {
                                glcm[patch[y][x]][patch[ny][nx]]++;
                            }
                        }
                    }
                }
            }

            let total = 0;
            for (let i = 0; i < maxLevel; i++) for (let j = 0; j < maxLevel; j++) total += glcm[i][j];
            if (total > 0) for (let i = 0; i < maxLevel; i++) for (let j = 0; j < maxLevel; j++) glcm[i][j] /= total;
            return glcm;
        }

        function drawGLCMMatrix(glcm, ox, oy, w, h) {
            const n = glcm.length;
            const cellW = w / n;
            const cellH = h / n;
            const maxVal = Math.max(...glcm.flat());
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    const norm = maxVal > 0 ? glcm[i][j] / maxVal : 0;
                    const r = Math.floor(norm * 255);
                    const g = Math.floor(norm * 100);
                    const b = Math.floor((1 - norm) * 200);
                    ctx.fillStyle = `rgb(${r},${g},${b})`;
                    ctx.fillRect(ox + j * cellW, oy + i * cellH, cellW - 1, cellH - 1);

                    if (glcm[i][j] > 0.01) {
                        ctx.fillStyle = norm > 0.5 ? '#fff' : '#000';
                        ctx.font = `${Math.max(7, cellW * 0.3)}px monospace`;
                        ctx.textAlign = 'center';
                        ctx.fillText(glcm[i][j].toFixed(2), ox + j * cellW + cellW / 2, oy + i * cellH + cellH / 2 + 3);
                    }
                }
            }
            ctx.strokeStyle = '#888';
            ctx.strokeRect(ox, oy, w, h);
        }

        function drawHistogram(data, ox, oy, w, h, bins) {
            const hist = new Array(bins).fill(0);
            const min = Math.min(...data);
            const max = Math.max(...data);
            const range = max - min || 1;
            for (const v of data) {
                const b = Math.min(bins - 1, Math.floor(((v - min) / range) * bins));
                hist[b]++;
            }
            const maxH = Math.max(...hist);

            ctx.fillStyle = '#e0e0e0';
            ctx.fillRect(ox, oy, w, h);

            const barW = w / bins;
            for (let i = 0; i < bins; i++) {
                const bh = (hist[i] / maxH) * (h - 30);
                const hue = (i / bins) * 120;
                ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
                ctx.fillRect(ox + i * barW, oy + h - 30 - bh, barW - 1, bh);
            }

            ctx.strokeStyle = '#ff4444';
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let i = 0; i < bins; i++) {
                const bh = (hist[i] / maxH) * (h - 30);
                const x = ox + i * barW + barW / 2;
                const y = oy + h - 30 - bh;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
            ctx.lineWidth = 1;
        }

        function drawShapeOverlay(ox, oy, cellSize) {
            ctx.strokeStyle = '#ff6644';
            ctx.lineWidth = 3;
            ctx.beginPath();
            const points = [];
            for (let y = 0; y < patchSize; y++) {
                for (let x = 0; x < patchSize; x++) {
                    if (patch[y][x] > 3) {
                        points.push({ x: ox + x * cellSize + cellSize / 2, y: oy + y * cellSize + cellSize / 2 });
                    }
                }
            }
            if (points.length > 2) {
                ctx.moveTo(points[0].x, points[0].y);
                for (let i = 1; i < points.length; i++) {
                    ctx.lineTo(points[i].x, points[i].y);
                }
                ctx.closePath();
                ctx.stroke();
                ctx.fillStyle = 'rgba(255,102,68,0.2)';
                ctx.fill();
            }
        }

        function render() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#0d1117';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const cellSize = 36;
            const patchOx = 30, patchOy = 40;

            ctx.fillStyle = '#e0e0e0';
            ctx.font = 'bold 13px Arial';
            ctx.textAlign = 'left';
            ctx.fillText('8×8 Texture Patch', patchOx, 25);

            let hlFn = null;
            if (activeFeature === 'firstorder') {
                hlFn = (x, y, val) => {
                    const avg = patch.flat().reduce((a, b) => a + b, 0) / 64;
                    if (Math.abs(val - avg) < 1) return 'rgba(68,136,255,0.6)';
                    return null;
                };
                ctx.fillText('(Blue = values near mean intensity)', patchOx, patchOy + patchSize * cellSize + 20);
            } else if (activeFeature === 'glcm') {
                const d = parseInt(document.getElementById('glcmDistance')?.value || 1);
                const angle = document.getElementById('glcmAngle')?.value || '0';
                const pulse = Math.sin(hoverT * 3) * 0.5 + 0.5;

                hlFn = (x, y, val) => {
                    const offsets = {
                        0: [[0, d]], 45: [[-d, d]], 90: [[d, 0]], 135: [[d, d]]
                    };
                    const usedAngles = angle === 'all' ? [0, 45, 90, 135] : [parseInt(angle)];
                    for (const a of usedAngles) {
                        for (const [dy, dx] of offsets[a]) {
                            const ny = y + dy, nx = x + dx;
                            if (ny >= 0 && ny < patchSize && nx >= 0 && nx < patchSize) {
                                return `rgba(255,${100 + pulse * 100},0,0.6)`;
                            }
                        }
                    }
                    return null;
                };

                ctx.fillText(`(Orange = pixel pairs at d=${d}, θ=${angle}°)`, patchOx, patchOy + patchSize * cellSize + 20);
            } else if (activeFeature === 'shape') {
                ctx.fillText('(Red outline = contour of high-intensity pixels)', patchOx, patchOy + patchSize * cellSize + 20);
            } else if (activeFeature === 'glrlm') {
                hlFn = (x, y, val) => {
                    if (x > 0 && patch[y][x - 1] === val) return 'rgba(0,204,102,0.6)';
                    if (x < patchSize - 1 && patch[y][x + 1] === val) return 'rgba(0,204,102,0.6)';
                    return null;
                };
                ctx.fillText('(Green = pixels in horizontal runs)', patchOx, patchOy + patchSize * cellSize + 20);
            }

            drawPatch(patchOx, patchOy, cellSize, hlFn);

            if (activeFeature === 'shape') {
                drawShapeOverlay(patchOx, patchOy, cellSize);
            }

            const glcmOx = 380, glcmOy = 40;
            ctx.fillStyle = '#e0e0e0';
            ctx.font = 'bold 13px Arial';
            ctx.fillText('GLCM Matrix', glcmOx, 25);

            const d = parseInt(document.getElementById('glcmDistance')?.value || 1);
            const angle = document.getElementById('glcmAngle')?.value || '0';
            const glcm = computeGLCM(d, angle);
            drawGLCMMatrix(glcm, glcmOx, glcmOy, 240, 240);

            const histOx = 380, histOy = 40;
            if (activeFeature === 'firstorder') {
                const data = patch.flat();
                ctx.fillStyle = '#e0e0e0';
                ctx.font = 'bold 13px Arial';
                ctx.fillText('Intensity Histogram', histOx, 25);
                drawHistogram(data, histOx, histOy, 240, 240, 8);
            }

            hoverT += 0.02;
            _m8AnimFrame = requestAnimationFrame(render);
        }

        container.querySelectorAll('[data-feature]').forEach(btn => {
            btn.addEventListener('click', () => {
                container.querySelectorAll('[data-feature]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                activeFeature = btn.dataset.feature;
                document.getElementById('radAnimStatus').textContent =
                    `Exploring: ${activeFeature.charAt(0).toUpperCase() + activeFeature.slice(1)} features`;
            });
        });

        render();
    },

    setupGLCMSimulation(container) {
        const textureCanvas = document.getElementById('glcmTextureCanvas');
        const glcmCanvas = document.getElementById('glcmMatrixCanvas');
        const texCtx = textureCanvas.getContext('2d');
        const glcmCtx = glcmCanvas.getContext('2d');

        const patchSize = 8;
        let texture = [];
        let grayLevels = 8;

        function initTexture() {
            texture = [];
            for (let y = 0; y < patchSize; y++) {
                texture[y] = [];
                for (let x = 0; x < patchSize; x++) {
                    texture[y][x] = Math.floor(Math.random() * grayLevels);
                }
            }
        }

        function drawTexture() {
            const cellSize = textureCanvas.width / patchSize;
            texCtx.clearRect(0, 0, textureCanvas.width, textureCanvas.height);

            for (let y = 0; y < patchSize; y++) {
                for (let x = 0; x < patchSize; x++) {
                    const val = texture[y][x];
                    const intensity = Math.floor((val / (grayLevels - 1)) * 220 + 20);
                    texCtx.fillStyle = `rgb(${intensity},${intensity},${intensity})`;
                    texCtx.fillRect(x * cellSize, y * cellSize, cellSize - 2, cellSize - 2);

                    texCtx.fillStyle = intensity > 140 ? '#000' : '#fff';
                    texCtx.font = 'bold 14px monospace';
                    texCtx.textAlign = 'center';
                    texCtx.fillText(val, x * cellSize + cellSize / 2, y * cellSize + cellSize / 2 + 5);
                }
            }
        }

        function computeGLCMMatrix() {
            const d = parseInt(document.getElementById('glcmDistance').value);
            const angle = document.getElementById('glcmAngle').value;
            const n = grayLevels;
            const glcm = Array.from({ length: n }, () => new Array(n).fill(0));

            const offsets = {
                '0': [[0, d]], '45': [[-d, d]], '90': [[d, 0]], '135': [[d, d]]
            };
            const angles = angle === 'all' ? ['0', '45', '90', '135'] : [angle];

            for (const a of angles) {
                for (const [dy, dx] of offsets[a]) {
                    for (let y = 0; y < patchSize; y++) {
                        for (let x = 0; x < patchSize; x++) {
                            const ny = y + dy, nx = x + dx;
                            if (ny >= 0 && ny < patchSize && nx >= 0 && nx < patchSize) {
                                glcm[texture[y][x]][texture[ny][nx]]++;
                            }
                        }
                    }
                }
            }

            let total = 0;
            for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) total += glcm[i][j];
            const normalized = glcm.map(row => row.map(v => total > 0 ? v / total : 0));

            return normalized;
        }

        function drawGLCM(glcm) {
            const n = glcm.length;
            const cellW = glcmCanvas.width / n;
            const cellH = glcmCanvas.height / n;
            const maxVal = Math.max(...glcm.flat());

            glcmCtx.clearRect(0, 0, glcmCanvas.width, glcmCanvas.height);

            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    const norm = maxVal > 0 ? glcm[i][j] / maxVal : 0;
                    const r = Math.floor(20 + norm * 235);
                    const g = Math.floor(20 + (1 - norm) * 80);
                    const b = Math.floor((1 - norm) * 200);
                    glcmCtx.fillStyle = `rgb(${r},${g},${b})`;
                    glcmCtx.fillRect(j * cellW, i * cellH, cellW - 1, cellH - 1);

                    if (glcm[i][j] > 0.005) {
                        glcmCtx.fillStyle = norm > 0.5 ? '#fff' : '#ddd';
                        glcmCtx.font = `${Math.max(8, cellW * 0.28)}px monospace`;
                        glcmCtx.textAlign = 'center';
                        glcmCtx.fillText(glcm[i][j].toFixed(3), j * cellW + cellW / 2, i * cellH + cellH / 2 + 3);
                    }
                }
            }

            glcmCtx.strokeStyle = '#666';
            glcmCtx.strokeRect(0, 0, glcmCanvas.width, glcmCanvas.height);

            glcmCtx.fillStyle = '#aaa';
            glcmCtx.font = '11px Arial';
            glcmCtx.textAlign = 'center';
            for (let i = 0; i < n; i++) {
                glcmCtx.fillText(i, i * cellW + cellW / 2, glcmCanvas.height + 15);
                glcmCtx.fillText(i, -15, i * cellH + cellH / 2 + 3);
            }
        }

        function computeFeatures(glcm) {
            const n = glcm.length;
            const iArr = Array.from({ length: n }, (_, i) => i);
            const jArr = Array.from({ length: n }, (_, j) => j);

            let muI = 0, muJ = 0;
            for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
                muI += i * glcm[i][j];
                muJ += j * glcm[i][j];
            }

            let sigmaI = 0, sigmaJ = 0;
            for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
                sigmaI += (i - muI) ** 2 * glcm[i][j];
                sigmaJ += (j - muJ) ** 2 * glcm[i][j];
            }
            sigmaI = Math.sqrt(sigmaI + 1e-10);
            sigmaJ = Math.sqrt(sigmaJ + 1e-10);

            let contrast = 0, correlation = 0, energy = 0, homogeneity = 0, entropy = 0;
            for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
                contrast += (i - j) ** 2 * glcm[i][j];
                correlation += (i - muI) * (j - muJ) * glcm[i][j];
                energy += glcm[i][j] ** 2;
                homogeneity += glcm[i][j] / (1 + Math.abs(i - j));
                if (glcm[i][j] > 0) entropy -= glcm[i][j] * Math.log2(glcm[i][j]);
            }
            correlation /= (sigmaI * sigmaJ + 1e-10);

            return { contrast, correlation, energy, homogeneity, entropy };
        }

        function computeFirstOrder(data) {
            const n = data.length;
            const mean = data.reduce((a, b) => a + b, 0) / n;
            const std = Math.sqrt(data.reduce((a, b) => a + (b - mean) ** 2, 0) / n);
            const skew = data.reduce((a, b) => a + ((b - mean) / (std + 1e-10)) ** 3, 0) / n;
            const kurt = data.reduce((a, b) => a + ((b - mean) / (std + 1e-10)) ** 4, 0) / n - 3;
            const min = Math.min(...data);
            const max = Math.max(...data);
            const hist = {};
            for (const v of data) hist[v] = (hist[v] || 0) + 1;
            let entropy = 0;
            for (const v in hist) {
                const p = hist[v] / n;
                entropy -= p * Math.log2(p + 1e-10);
            }
            const energy = data.reduce((a, b) => a + b ** 2, 0);
            return { mean, std, skew, kurt, entropy, energy, min, max };
        }

        function updateFirstOrderChart() {
            const data = texture.flat();
            const fo = computeFirstOrder(data);

            document.getElementById('foMean').textContent = fo.mean.toFixed(2);
            document.getElementById('foStd').textContent = fo.std.toFixed(2);
            document.getElementById('foSkew').textContent = fo.skew.toFixed(4);
            document.getElementById('foKurt').textContent = fo.kurt.toFixed(4);
            document.getElementById('foEntropy').textContent = fo.entropy.toFixed(4);
            document.getElementById('foEnergy').textContent = fo.energy.toFixed(2);
            document.getElementById('foRange').textContent = `[${fo.min}, ${fo.max}]`;

            const histCanvas = document.getElementById('firstOrderHistChart');
            const hctx = histCanvas.getContext('2d');
            const bins = grayLevels;
            const hist = new Array(bins).fill(0);
            for (const v of data) hist[Math.min(v, bins - 1)]++;
            const maxH = Math.max(...hist);

            hctx.clearRect(0, 0, histCanvas.width, histCanvas.height);
            hctx.fillStyle = '#1a1a2e';
            hctx.fillRect(0, 0, histCanvas.width, histCanvas.height);

            const barW = (histCanvas.width - 80) / bins;
            const chartH = histCanvas.height - 60;

            for (let i = 0; i < bins; i++) {
                const bh = maxH > 0 ? (hist[i] / maxH) * chartH : 0;
                const hue = (i / bins) * 120;
                hctx.fillStyle = `hsl(${hue}, 65%, 55%)`;
                hctx.fillRect(50 + i * barW, 30 + chartH - bh, barW - 4, bh);

                hctx.fillStyle = '#e0e0e0';
                hctx.font = '10px monospace';
                hctx.textAlign = 'center';
                hctx.fillText(i, 50 + i * barW + barW / 2, 30 + chartH + 15);
            }

            hctx.strokeStyle = '#ff6644';
            hctx.lineWidth = 2;
            hctx.beginPath();
            for (let i = 0; i < bins; i++) {
                const bh = maxH > 0 ? (hist[i] / maxH) * chartH : 0;
                const x = 50 + i * barW + barW / 2;
                const y = 30 + chartH - bh;
                if (i === 0) hctx.moveTo(x, y);
                else hctx.lineTo(x, y);
            }
            hctx.stroke();
            hctx.lineWidth = 1;

            hctx.fillStyle = '#aaa';
            hctx.font = '12px Arial';
            hctx.textAlign = 'center';
            hctx.fillText('Gray Level', histCanvas.width / 2, histCanvas.height - 5);

            hctx.save();
            hctx.translate(15, histCanvas.height / 2);
            hctx.rotate(-Math.PI / 2);
            hctx.fillText('Count', 0, 0);
            hctx.restore();
        }

        function computeAndDisplayGLCM() {
            const glcm = computeGLCMMatrix();
            drawGLCM(glcm);
            const features = computeFeatures(glcm);
            document.getElementById('glcmContrast').textContent = features.contrast.toFixed(4);
            document.getElementById('glcmCorrelation').textContent = features.correlation.toFixed(4);
            document.getElementById('glcmEnergy').textContent = features.energy.toFixed(4);
            document.getElementById('glcmHomogeneity').textContent = features.homogeneity.toFixed(4);
            document.getElementById('glcmEntropy').textContent = features.entropy.toFixed(4);
        }

        textureCanvas.addEventListener('click', (e) => {
            const rect = textureCanvas.getBoundingClientRect();
            const scaleX = textureCanvas.width / rect.width;
            const scaleY = textureCanvas.height / rect.height;
            const mx = (e.clientX - rect.left) * scaleX;
            const my = (e.clientY - rect.top) * scaleY;
            const cellSize = textureCanvas.width / patchSize;
            const x = Math.floor(mx / cellSize);
            const y = Math.floor(my / cellSize);
            if (x >= 0 && x < patchSize && y >= 0 && y < patchSize) {
                texture[y][x] = (texture[y][x] + 1) % grayLevels;
                drawTexture();
                computeAndDisplayGLCM();
                updateFirstOrderChart();
            }
        });

        document.getElementById('glcmGrayLevels').addEventListener('change', (e) => {
            grayLevels = parseInt(e.target.value);
            initTexture();
            drawTexture();
            computeAndDisplayGLCM();
            updateFirstOrderChart();
        });

        document.getElementById('glcmDistance').addEventListener('change', () => {
            computeAndDisplayGLCM();
        });

        document.getElementById('glcmAngle').addEventListener('change', () => {
            computeAndDisplayGLCM();
        });

        document.getElementById('btnComputeGLCM').addEventListener('click', () => {
            computeAndDisplayGLCM();
        });

        document.getElementById('btnRandomTexture').addEventListener('click', () => {
            initTexture();
            drawTexture();
            computeAndDisplayGLCM();
            updateFirstOrderChart();
        });

        initTexture();
        drawTexture();
        computeAndDisplayGLCM();
        updateFirstOrderChart();
    },

    setupFirstOrderChart(container) {
        // Already handled within GLCM simulation
    },

    setupCodeBlock(container) {
        const code = `import numpy as np
from collections import Counter

def compute_glcm(image, distance=1, angle=0):
    """Compute Gray Level Co-occurrence Matrix."""
    max_level = image.max() + 1
    glcm = np.zeros((max_level, max_level), dtype=int)
    
    rows, cols = image.shape
    for y in range(rows):
        for x in range(cols):
            if angle == 0:
                ny, nx = y, x + distance
            elif angle == 45:
                ny, nx = y - distance, x + distance
            elif angle == 90:
                ny, nx = y + distance, x
            elif angle == 135:
                ny, nx = y + distance, x + distance
            
            if 0 <= ny < rows and 0 <= nx < cols:
                glcm[image[y, x], image[ny, nx]] += 1
    
    return glcm / (glcm.sum() + 1e-8)

def compute_glcm_features(glcm):
    """Extract features from GLCM."""
    n = glcm.shape[0]
    i, j = np.meshgrid(np.arange(n), np.arange(n), indexing='ij')
    
    contrast = np.sum((i - j)**2 * glcm)
    
    mu_i = np.sum(i * glcm)
    mu_j = np.sum(j * glcm)
    sigma_i = np.sqrt(np.sum((i - mu_i)**2 * glcm))
    sigma_j = np.sqrt(np.sum((j - mu_j)**2 * glcm))
    correlation = np.sum((i - mu_i) * (j - mu_j) * glcm) / (sigma_i * sigma_j + 1e-8)
    
    energy = np.sum(glcm**2)
    homogeneity = np.sum(glcm / (1 + np.abs(i - j)))
    entropy = -np.sum(glcm[glcm > 0] * np.log2(glcm[glcm > 0]))
    
    return {
        'contrast': contrast,
        'correlation': correlation,
        'energy': energy,
        'homogeneity': homogeneity,
        'entropy': entropy
    }

def first_order_features(masked_region):
    """Compute first-order statistics."""
    mean_val = np.mean(masked_region)
    std_val = np.std(masked_region)
    normalized = (masked_region - mean_val) / (std_val + 1e-8)
    
    return {
        'mean': mean_val,
        'std': std_val,
        'skewness': float(np.mean(normalized**3)),
        'kurtosis': float(np.mean(normalized**4) - 3),
        'entropy': -np.sum(
            np.histogram(masked_region, bins=16, density=True)[0]
            * np.log2(np.histogram(masked_region, bins=16, density=True)[0] + 1e-10)
        ),
        'energy': np.sum(masked_region**2)
    }

# Example usage
image = np.random.randint(0, 8, (8, 8))
glcm = compute_glcm(image, distance=1, angle=0)
features = compute_glcm_features(glcm)
print("GLCM Features:", features)

fo = first_order_features(image.flatten())
print("First-Order Features:", fo)`;
        Components.createCodeBlock(container.querySelector('#radCodeBlock'), code);
    },

    setupQuiz(container) {
        const questions = [
            {
                q: "What does GLCM Contrast measure?",
                options: [
                    "The total number of unique gray levels in the image",
                    "The intensity difference between neighboring pixel pairs",
                    "The overall brightness of the region of interest",
                    "The spatial arrangement of all pixels"
                ],
                correct: 1,
                explanation: "GLCM Contrast = Σ|i-j|² × P(i,j) measures the local intensity variations in an image. High contrast indicates large intensity differences between neighboring pixels, suggesting a coarse, heterogeneous texture pattern common in aggressive tumors."
            },
            {
                q: "A lesion has high GLCM Entropy and low Energy. What does this texture pattern suggest?",
                options: [
                    "The lesion is benign with uniform texture",
                    "The lesion has high internal heterogeneity, possibly malignant",
                    "The lesion is cystic with fluid content",
                    "The image has been denoised"
                ],
                correct: 1,
                explanation: "High entropy indicates randomness in the gray level distribution (complex texture), while low energy (ASM) means the GLCM values are spread out rather than concentrated. This combination suggests a heterogeneous internal structure, which is a common characteristic of malignant lesions."
            },
            {
                q: "In radiomics, what is the primary purpose of feature selection (e.g., mRMR, LASSO)?",
                options: [
                    "To increase the number of features for better training",
                    "To remove irrelevant and redundant features to prevent overfitting",
                    "To convert continuous features to categorical",
                    "To generate new features from existing ones"
                ],
                correct: 1,
                explanation: "Feature selection removes irrelevant, redundant, and highly correlated features. With radiomics yielding hundreds of features but small clinical datasets, overfitting is a major risk. Methods like mRMR maximize relevance to the outcome while minimizing inter-feature redundancy."
            },
            {
                q: "Which radiomics feature category is most useful for distinguishing between tumor sub-regions (e.g., enhancing core vs necrotic center)?",
                options: [
                    "First-order statistics (mean, variance)",
                    "Shape features (volume, sphericity)",
                    "Higher-order wavelet features",
                    "Second-order texture features (GLCM, GLRLM)"
                ],
                correct: 3,
                explanation: "Second-order texture features capture spatial relationships between pixels, which is essential for distinguishing between sub-regions with similar mean intensities but different spatial arrangements. GLCM captures local patterns, while GLRLM captures longer-range spatial dependencies."
            }
        ];
        Components.createQuiz(container.querySelector('#radQuizContainer'), questions);
    },

    destroy() {
        if (_m8AnimFrame) {
            cancelAnimationFrame(_m8AnimFrame);
            _m8AnimFrame = null;
        }
    }
});
