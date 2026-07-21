let _m7AnimFrame = null;

ModuleEngine.register('7', {
    init(container) {
        container.innerHTML = `
        <div class="module-container">
            <div class="module-header">
                <h2>Module 7: Hands-on Segmentation</h2>
                <p class="module-subtitle">Implement and evaluate medical image segmentation algorithms</p>
            </div>

            <div class="section objectives-section">
                <h3>🎯 Learning Objectives</h3>
                <ul>
                    <li>Implement and run segmentation algorithms from scratch</li>
                    <li>Compare traditional vs deep learning segmentation approaches</li>
                    <li>Understand evaluation metrics (Dice, IoU, Hausdorff distance)</li>
                    <li>Visualize segmentation predictions vs ground truth</li>
                    <li>Learn to diagnose segmentation failures</li>
                </ul>
            </div>

            <div class="section animation-section">
                <h3>🎬 Animated Comparison: Segmentation Pipeline</h3>
                <div class="canvas-container">
                    <canvas id="segAnimCanvas" width="800" height="280"></canvas>
                </div>
                <div class="animation-controls">
                    <button class="btn btn-primary" id="btnPlaySegAnim">▶ Play Animation</button>
                    <button class="btn btn-secondary" id="btnResetSegAnim">↺ Reset</button>
                    <span class="anim-status" id="segAnimStatus">Click Play to start</span>
                </div>
            </div>

            <div class="section theory-section">
                <h3>📖 Theory: Image Segmentation</h3>
                
                <h4>What is Image Segmentation?</h4>
                <p>Image segmentation is the process of partitioning an image into multiple segments (regions) to simplify representation and make analysis easier. In medical imaging, segmentation aims to delineate anatomical structures, lesions, or organs of interest.</p>
                
                <div class="info-box">
                    <h4>Types of Segmentation</h4>
                    <div class="two-column">
                        <div class="col">
                            <strong>Semantic Segmentation:</strong>
                            <p>Assigns a class label to every pixel. All pixels belonging to the same class get the same label. Example: all lesion pixels labeled "lesion".</p>
                            <strong>Instance Segmentation:</strong>
                            <p>Distinguishes individual object instances. Each lesion instance gets a unique ID, enabling counting and tracking.</p>
                        </div>
                        <div class="col">
                            <strong>Panoptic Segmentation:</strong>
                            <p>Combines semantic and instance segmentation. Every pixel gets both a class label and an instance ID.</p>
                            <strong>In Medical Imaging:</strong>
                            <p>Liver segmentation, tumor delineation, organ boundary detection, lesion quantification for treatment planning.</p>
                        </div>
                    </div>
                </div>

                <h4>Traditional Methods</h4>
                <div class="method-grid">
                    <div class="method-card">
                        <h5>Thresholding</h5>
                        <p>Simplest method. Pixels above/below threshold belong to foreground. Otsu's method automatically determines optimal threshold.</p>
                        <div class="formula">T = argmax(σ²_b(T))</div>
                        <p class="pros">✅ Fast, simple</p>
                        <p class="cons">❌ Fails with overlapping intensities</p>
                    </div>
                    <div class="method-card">
                        <h5>Region Growing</h5>
                        <p>Starts from seed points and grows regions by adding neighboring pixels with similar intensity. Requires manual seed selection.</p>
                        <div class="formula">Region = {p | |I(p) - I(seed)| < T}</div>
                        <p class="pros">✅ Handles local variations</p>
                        <p class="cons">❌ Sensitive to seeds, slow</p>
                    </div>
                    <div class="method-card">
                        <h5>Watershed</h5>
                        <p>Treats image as topographic surface. Water fills from local minima, creating watershed lines at boundaries.</p>
                        <div class="formula">T(p,q) = min { h* | h* = min_{π} max_{(i,j)∈π} g(i,j)}</div>
                        <p class="pros">✅ Handles touching objects</p>
                        <p class="cons">❌ Over-segmentation</p>
                    </div>
                    <div class="method-card">
                        <h5>Active Contours (Snakes)</h5>
                        <p>Energy-minimizing contour that deforms to fit object boundaries. Combines internal smoothness with external image forces.</p>
                        <div class="formula">E = ∫(α|v'|² + β|v''|²) ds + ∫E_ext(v(s)) ds</div>
                        <p class="pros">✅ Smooth boundaries</p>
                        <p class="cons">❌ Initialization sensitive</p>
                    </div>
                </div>

                <h4>Deep Learning Methods</h4>
                <div class="info-box highlight">
                    <h5>U-Net Architecture</h5>
                    <p>The U-Net is the gold standard for medical image segmentation. It features:</p>
                    <ul>
                        <li><strong>Encoder path:</strong> Captures context through convolutions and pooling</li>
                        <li><strong>Decoder path:</strong> Enables precise localization through upsampling</li>
                        <li><strong>Skip connections:</strong> Bridge encoder and decoder features</li>
                        <li><strong>nnU-Net:</strong> Self-configuring framework that adapts U-Net to your dataset automatically</li>
                    </ul>
                </div>

                <h4>Evaluation Metrics</h4>
                <div class="metrics-grid">
                    <div class="metric-card">
                        <h5>Dice Similarity Coefficient (DSC)</h5>
                        <div class="formula">DSC = 2|A∩B| / (|A| + |B|)</div>
                        <p>Measures overlap between prediction and ground truth. Ranges from 0 (no overlap) to 1 (perfect match). Most commonly used metric for medical segmentation.</p>
                        <div class="bar-indicator" id="diceBar"></div>
                    </div>
                    <div class="metric-card">
                        <h5>Intersection over Union (IoU)</h5>
                        <div class="formula">IoU = |A∩B| / |A∪B|</div>
                        <p>Also called Jaccard Index. More conservative than Dice. Penalizes false positives and false negatives equally.</p>
                    </div>
                    <div class="metric-card">
                        <h5>Hausdorff Distance (HD95)</h5>
                        <div class="formula">HD95 = 95th percentile of max distances</div>
                        <p>Measures the maximum surface distance between prediction and ground truth. HD95 is robust to outliers.</p>
                    </div>
                    <div class="metric-card">
                        <h5>Sensitivity & Specificity</h5>
                        <div class="formula">Sens = TP/(TP+FN), Spec = TN/(TN+FP)</div>
                        <p>Sensitivity: proportion of true lesion pixels detected. Specificity: proportion of background correctly identified.</p>
                    </div>
                    <div class="metric-card">
                        <h5>Volume Similarity</h5>
                        <div class="formula">VS = 1 - |V_pred - V_gt| / (V_pred + V_gt)</div>
                        <p>Measures volumetric agreement regardless of spatial location. Important for treatment response assessment.</p>
                    </div>
                </div>
            </div>

            <div class="section simulation-section">
                <h3>🧪 Interactive Segmentation Lab</h3>
                
                <div class="sim-container">
                    <div class="sim-left">
                        <div class="canvas-container">
                            <canvas id="segSimCanvas" width="500" height="500"></canvas>
                        </div>
                        <div class="canvas-overlay" id="segOverlay"></div>
                        <div class="sim-controls">
                            <div class="control-group">
                                <label for="segAlgorithm">Select Algorithm:</label>
                                <select id="segAlgorithm" class="form-select">
                                    <option value="threshold">Threshold Segmentation</option>
                                    <option value="regionGrowing">Region Growing</option>
                                    <option value="kmeans">K-Means Clustering</option>
                                    <option value="watershed">Watershed</option>
                                </select>
                            </div>

                            <div id="thresholdControls" class="algo-controls">
                                <div class="slider-container" id="segThresholdLower"></div>
                                <div class="slider-container" id="segThresholdUpper"></div>
                            </div>

                            <div id="regionGrowingControls" class="algo-controls" style="display:none;">
                                <p class="hint">Click on canvas to set seed point</p>
                                <div class="slider-container" id="segRGSimilarity"></div>
                                <div id="seedPointDisplay" class="seed-info">Seed: Not set</div>
                            </div>

                            <div id="kmeansControls" class="algo-controls" style="display:none;">
                                <div class="slider-container" id="segKMeansClusters"></div>
                            </div>

                            <div id="watershedControls" class="algo-controls" style="display:none;">
                                <div class="slider-container" id="segWatershedMarkers"></div>
                            </div>

                            <div class="button-group">
                                <button class="btn btn-primary" id="btnRunSegmentation">▶ Run Segmentation</button>
                                <button class="btn btn-secondary" id="btnShowGT">👁 Show Ground Truth</button>
                                <button class="btn btn-secondary" id="btnShowDiff">📊 Show Difference Map</button>
                                <button class="btn btn-secondary" id="btnClearSeg">↺ Clear</button>
                            </div>
                        </div>
                    </div>

                    <div class="sim-right">
                        <div class="results-panel">
                            <h4>Segmentation Results</h4>
                            <div class="metrics-display" id="segMetricsDisplay">
                                <div class="metric-item">
                                    <span class="metric-label">Dice Coefficient:</span>
                                    <span class="metric-value" id="segDiceValue">—</span>
                                    <div class="metric-bar-container">
                                        <div class="metric-bar" id="segDiceBar" style="width:0%"></div>
                                    </div>
                                </div>
                                <div class="metric-item">
                                    <span class="metric-label">IoU (Jaccard):</span>
                                    <span class="metric-value" id="segIoUValue">—</span>
                                    <div class="metric-bar-container">
                                        <div class="metric-bar iou-bar" id="segIoUBar" style="width:0%"></div>
                                    </div>
                                </div>
                                <div class="metric-item">
                                    <span class="metric-label">Sensitivity:</span>
                                    <span class="metric-value" id="segSensValue">—</span>
                                </div>
                                <div class="metric-item">
                                    <span class="metric-label">Specificity:</span>
                                    <span class="metric-value" id="segSpecValue">—</span>
                                </div>
                                <div class="metric-item">
                                    <span class="metric-label">Volume Similarity:</span>
                                    <span class="metric-value" id="segVSValue">—</span>
                                </div>
                            </div>

                            <h4>Algorithm Performance Comparison</h4>
                            <div class="chart-container">
                                <canvas id="segCompareChart" width="350" height="220"></canvas>
                            </div>

                            <h4>Difference Map Legend</h4>
                            <div class="legend-grid">
                                <div class="legend-item">
                                    <span class="legend-color" style="background:#00cc44"></span>
                                    True Positive (Correct)
                                </div>
                                <div class="legend-item">
                                    <span class="legend-color" style="background:#ff3333"></span>
                                    False Positive (Over-segmentation)
                                </div>
                                <div class="legend-item">
                                    <span class="legend-color" style="background:#3366ff"></span>
                                    False Negative (Under-segmentation)
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="section code-section">
                <h3>💻 Implementation Reference</h3>
                <div class="code-block-container" id="segCodeBlock"></div>
            </div>

            <div class="section quiz-section">
                <h3>📝 Knowledge Check</h3>
                <div id="segQuizContainer"></div>
            </div>

            <div class="section reflection-section">
                <h3>💭 Reflection</h3>
                <div class="reflection-box">
                    <h4>Clinical Significance</h4>
                    <p>Accurate segmentation is critical for downstream tasks including volumetric measurement, treatment planning, and disease progression monitoring. Poor segmentation directly impacts clinical decisions.</p>
                    
                    <h4>Challenges with Small Lesions</h4>
                    <p>Small lesions present unique challenges: limited contextual information, partial volume effects, and class imbalance. A single missed lesion pixel in a small target can drastically reduce Dice scores. Clinical workflows often require minimum size thresholds for segmentation evaluation.</p>

                    <h4>Dice vs IoU: When to Use Which?</h4>
                    <p><strong>Dice</strong> emphasizes true positives relative to both masks equally — good for balanced evaluation. <strong>IoU</strong> is more punishing of false positives, making it preferable when over-segmentation has higher clinical cost (e.g., radiation therapy planning where you don't want to irradiate healthy tissue).</p>

                    <h4>Common Failure Modes</h4>
                    <ul>
                        <li><strong>Boundary ambiguity:</strong> Low contrast between lesion and liver parenchyma</li>
                        <li><strong>Variability:</strong> Inter-observer variability in ground truth annotation</li>
                        <li><strong>Imaging artifacts:</strong> Motion artifacts, beam hardening, metal implants</li>
                        <li><strong>Class imbalance:</strong> Lesion may occupy <1% of total image area</li>
                    </ul>
                </div>
            </div>
        </div>` + '<div style="padding:1rem 1.5rem 2rem;display:flex;justify-content:center;"><button data-navigate="home" class="px-6 py-3 rounded-xl border border-white/20 text-sm text-gray-300 hover:text-white hover:border-primary-400/50 transition-all cursor-pointer" style="background:rgba(255,255,255,0.04);min-height:44px;">&#x2190; Back to Home</button></div>';

        this.setupAnimation(container);
        this.setupSimulation(container);
        this.setupCodeBlock(container);
        this.setupQuiz(container);

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

    setupAnimation(container) {
        const canvas = document.getElementById('segAnimCanvas');
        const ctx = canvas.getContext('2d');
        let phase = 0;
        let t = 0;

        function drawLiver(cx, cy, rx, ry, color, alpha = 1) {
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.restore();
        }

        function drawLesion(cx, cy, r, color, alpha = 1) {
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.restore();
        }

        function addNoise(w, h, intensity) {
            const imgData = ctx.getImageData(0, 0, w, h);
            const data = imgData.data;
            for (let i = 0; i < data.length; i += 4) {
                const n = (Math.random() - 0.5) * intensity;
                data[i] = Math.max(0, Math.min(255, data[i] + n));
                data[i+1] = Math.max(0, Math.min(255, data[i+1] + n));
                data[i+2] = Math.max(0, Math.min(255, data[i+2] + n));
            }
            ctx.putImageData(imgData, 0, 0);
        }

        const labels = ['Original', 'Ground Truth', 'Prediction', 'Difference Map'];
        const panelWidth = 190;

        function drawFrame() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const segAlpha = Math.min(1, t * 2);

            for (let i = 0; i < 4; i++) {
                const px = 15 + i * (panelWidth + 10);
                const cx = px + panelWidth / 2;
                const cy = 150;

                ctx.fillStyle = '#1a1a2e';
                ctx.fillRect(px, 10, panelWidth, 230);
                ctx.strokeStyle = '#3a3a5e';
                ctx.strokeRect(px, 10, panelWidth, 230);

                ctx.fillStyle = '#e0e0e0';
                ctx.font = 'bold 11px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(labels[i], cx, 255);

                if (i <= phase) {
                    const alpha = i < phase ? 1 : segAlpha;

                    if (i === 0) {
                        drawLiver(cx, cy, 70, 55, '#8B4513', alpha);
                        drawLesion(cx + 15, cy + 10, 18, '#5C2D0A', alpha);
                        addNoise(panelWidth, 240, 15);
                    } else if (i === 1) {
                        drawLiver(cx, cy, 70, 55, '#22aa44', alpha * 0.5);
                        drawLesion(cx + 15, cy + 10, 18, '#ff4444', alpha);
                    } else if (i === 2) {
                        drawLiver(cx, cy, 70, 55, '#22aa44', alpha * 0.3);
                        const predR = 18 * (0.7 + 0.3 * segAlpha);
                        drawLesion(cx + 16, cy + 11, predR, '#4488ff', alpha * 0.8);
                    } else if (i === 3) {
                        drawLiver(cx, cy, 70, 55, '#22aa44', alpha * 0.15);
                        drawLesion(cx + 15, cy + 10, 18, '#00cc44', alpha * 0.7);
                        drawLesion(cx + 18, cy + 13, 8, '#ff3333', alpha * 0.6);
                        drawLesion(cx + 12, cy + 8, 6, '#3366ff', alpha * 0.6);
                    }
                }
            }

            if (phase < 3) {
                const arrowX = 15 + (phase + 1) * (panelWidth + 10) - 5;
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 24px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('→', arrowX, 145);
            }
        }

        function animate() {
            t += 0.008;
            if (t >= 1) {
                t = 0;
                phase++;
                if (phase > 3) {
                    phase = 0;
                }
            }
            drawFrame();
            _m7AnimFrame = requestAnimationFrame(animate);
        }

        document.getElementById('btnPlaySegAnim').addEventListener('click', () => {
            if (_m7AnimFrame) {
                cancelAnimationFrame(_m7AnimFrame);
                _m7AnimFrame = null;
                document.getElementById('btnPlaySegAnim').textContent = '▶ Play';
                document.getElementById('segAnimStatus').textContent = 'Paused';
            } else {
                animate();
                document.getElementById('btnPlaySegAnim').textContent = '⏸ Pause';
                document.getElementById('segAnimStatus').textContent = 'Playing...';
            }
        });

        document.getElementById('btnResetSegAnim').addEventListener('click', () => {
            if (_m7AnimFrame) cancelAnimationFrame(_m7AnimFrame);
            _m7AnimFrame = null;
            phase = 0;
            t = 0;
            drawFrame();
            document.getElementById('btnPlaySegAnim').textContent = '▶ Play';
            document.getElementById('segAnimStatus').textContent = 'Click Play to start';
        });

        drawFrame();
    },

    setupSimulation(container) {
        const canvas = document.getElementById('segSimCanvas');
        const ctx = canvas.getContext('2d');
        const size = 128;
        const scale = canvas.width / size;

        let liverImg = null;
        let liverMask = null;
        let lesionMask = null;
        let segmentationResult = null;
        let seedPoint = null;
        let showGT = false;
        let showDiff = false;
        let comparisonData = {};

        function generateSyntheticSlice() {
            const img = new Float32Array(size * size);
            const lmask = new Float32Array(size * size);
            const lesMask = new Float32Array(size * size);

            for (let y = 0; y < size; y++) {
                for (let x = 0; x < size; x++) {
                    const nx = (x / size) * 2 - 1;
                    const ny = (y / size) * 2 - 1;
                    const inLiver = (nx / 0.7) ** 2 + (ny / 0.6) ** 2 < 1;
                    const lcx = 0.2, lcy = 0.1;
                    const inLesion = (nx - lcx) ** 2 + (ny - lcy) ** 2 < 0.04;
                    
                    const noise = (Math.random() - 0.5) * 20;
                    if (inLiver && !inLesion) {
                        img[y * size + x] = 60 + noise;
                        lmask[y * size + x] = 1;
                    } else if (inLesion) {
                        img[y * size + x] = 35 + noise;
                        lmask[y * size + x] = 1;
                        lesMask[y * size + x] = 1;
                    } else {
                        img[y * size + x] = 10 + noise * 0.5;
                    }
                }
            }

            liverImg = img;
            liverMask = lmask;
            lesionMask = lesMask;
        }

        function renderImage() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const imgData = ctx.createImageData(canvas.width, canvas.height);

            for (let y = 0; y < size; y++) {
                for (let x = 0; x < size; x++) {
                    const val = liverImg[y * size + x];
                    const gray = Math.max(0, Math.min(255, val * 2.5));
                    const py = Math.floor(y * scale);
                    const px = Math.floor(x * scale);
                    const sy = Math.floor((y + 1) * scale);
                    const sx = Math.floor((x + 1) * scale);

                    for (let dy = py; dy < sy && dy < canvas.height; dy++) {
                        for (let ddx = px; ddx < sx && ddx < canvas.width; ddx++) {
                            const idx = (dy * canvas.width + ddx) * 4;
                            imgData.data[idx] = gray;
                            imgData.data[idx + 1] = gray;
                            imgData.data[idx + 2] = gray;
                            imgData.data[idx + 3] = 255;
                        }
                    }
                }
            }
            ctx.putImageData(imgData, 0, 0);

            if (showGT) {
                ctx.globalAlpha = 0.4;
                for (let y = 0; y < size; y++) {
                    for (let x = 0; x < size; x++) {
                        if (lesionMask[y * size + x] > 0) {
                            ctx.fillStyle = 'rgba(255, 68, 68, 0.6)';
                            ctx.fillRect(x * scale, y * scale, scale, scale);
                        }
                    }
                }
                ctx.globalAlpha = 1;
            }

            if (segmentationResult && !showDiff) {
                ctx.globalAlpha = 0.5;
                for (let y = 0; y < size; y++) {
                    for (let x = 0; x < size; x++) {
                        if (segmentationResult[y * size + x] > 0) {
                            ctx.fillStyle = 'rgba(68, 136, 255, 0.6)';
                            ctx.fillRect(x * scale, y * scale, scale, scale);
                        }
                    }
                }
                ctx.globalAlpha = 1;
            }

            if (showDiff && segmentationResult) {
                for (let y = 0; y < size; y++) {
                    for (let x = 0; x < size; x++) {
                        const idx = y * size + x;
                        const pred = segmentationResult[idx] > 0;
                        const gt = lesionMask[idx] > 0;
                        if (pred && gt) {
                            ctx.fillStyle = 'rgba(0, 204, 68, 0.7)';
                        } else if (pred && !gt) {
                            ctx.fillStyle = 'rgba(255, 51, 51, 0.7)';
                        } else if (!pred && gt) {
                            ctx.fillStyle = 'rgba(51, 102, 255, 0.7)';
                        } else {
                            continue;
                        }
                        ctx.fillRect(x * scale, y * scale, scale, scale);
                    }
                }
            }

            if (seedPoint) {
                ctx.beginPath();
                ctx.arc(seedPoint.x * scale, seedPoint.y * scale, 6, 0, Math.PI * 2);
                ctx.fillStyle = '#ffcc00';
                ctx.fill();
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }

        function thresholdSegmentation(low, high) {
            const result = new Float32Array(size * size);
            for (let i = 0; i < size * size; i++) {
                if (liverMask[i] > 0 && liverImg[i] >= low && liverImg[i] <= high) {
                    result[i] = 1;
                }
            }
            return result;
        }

        function regionGrowingSegmentation(seed, threshold) {
            const result = new Float32Array(size * size);
            const visited = new Uint8Array(size * size);
            const queue = [seed];
            const seedVal = liverImg[seed.y * size + seed.x];

            while (queue.length > 0) {
                const p = queue.shift();
                const idx = p.y * size + p.x;
                if (visited[idx]) continue;
                if (Math.abs(liverImg[idx] - seedVal) > threshold) continue;
                if (liverMask[idx] === 0) continue;
                visited[idx] = 1;
                result[idx] = 1;

                const neighbors = [
                    {x: p.x - 1, y: p.y}, {x: p.x + 1, y: p.y},
                    {x: p.x, y: p.y - 1}, {x: p.x, y: p.y + 1}
                ];
                for (const n of neighbors) {
                    if (n.x >= 0 && n.x < size && n.y >= 0 && n.y < size) {
                        const nIdx = n.y * size + n.x;
                        if (!visited[nIdx] && liverMask[nIdx] > 0) {
                            queue.push(n);
                        }
                    }
                }
            }
            return result;
        }

        function kMeansSegmentation(k) {
            const centroids = [];
            for (let i = 0; i < k; i++) {
                centroids.push(20 + Math.random() * 50);
            }
            const labels = new Int32Array(size * size);

            for (let iter = 0; iter < 20; iter++) {
                for (let i = 0; i < size * size; i++) {
                    if (liverMask[i] === 0) { labels[i] = -1; continue; }
                    let minDist = Infinity, minC = 0;
                    for (let c = 0; c < k; c++) {
                        const d = Math.abs(liverImg[i] - centroids[c]);
                        if (d < minDist) { minDist = d; minC = c; }
                    }
                    labels[i] = minC;
                }
                for (let c = 0; c < k; c++) {
                    let sum = 0, count = 0;
                    for (let i = 0; i < size * size; i++) {
                        if (labels[i] === c) { sum += liverImg[i]; count++; }
                    }
                    if (count > 0) centroids[c] = sum / count;
                }
            }

            const result = new Float32Array(size * size);
            let minCVal = Infinity, minCIdx = 0;
            for (let c = 0; c < k; c++) {
                if (centroids[c] < minCVal) { minCVal = centroids[c]; minCIdx = c; }
            }
            for (let i = 0; i < size * size; i++) {
                if (labels[i] === minCIdx) result[i] = 1;
            }
            return result;
        }

        function watershedSegmentation(numMarkers) {
            const markers = [];
            for (let i = 0; i < numMarkers; i++) {
                markers.push({
                    x: Math.floor(Math.random() * size),
                    y: Math.floor(Math.random() * size),
                    id: i + 1
                });
            }
            const labelMap = new Int32Array(size * size);
            for (const m of markers) {
                if (m.y >= 0 && m.y < size && m.x >= 0 && m.x < size) {
                    labelMap[m.y * size + m.x] = m.id;
                }
            }

            let changed = true;
            while (changed) {
                changed = false;
                for (let y = 1; y < size - 1; y++) {
                    for (let x = 1; x < size - 1; x++) {
                        const idx = y * size + x;
                        if (labelMap[idx] > 0) continue;
                        if (liverMask[idx] === 0) continue;
                        let minLabel = 0, minVal = Infinity;
                        for (let dy = -1; dy <= 1; dy++) {
                            for (let dx = -1; dx <= 1; dx++) {
                                const nIdx = (y + dy) * size + (x + dx);
                                if (labelMap[nIdx] > 0) {
                                    if (liverImg[idx] < minVal) {
                                        minVal = liverImg[idx];
                                        minLabel = labelMap[nIdx];
                                    }
                                }
                            }
                        }
                        if (minLabel > 0) {
                            labelMap[idx] = minLabel;
                            changed = true;
                        }
                    }
                }
            }

            const result = new Float32Array(size * size);
            const lesionLabels = new Set();
            for (let y = 0; y < size; y++) {
                for (let x = 0; x < size; x++) {
                    if (lesionMask[y * size + x] > 0 && labelMap[y * size + x] > 0) {
                        lesionLabels.add(labelMap[y * size + x]);
                    }
                }
            }
            for (let i = 0; i < size * size; i++) {
                if (lesionLabels.has(labelMap[i])) result[i] = 1;
            }
            return result;
        }

        function computeMetrics(pred, gt) {
            let tp = 0, fp = 0, fn = 0, tn = 0;
            for (let i = 0; i < pred.length; i++) {
                const p = pred[i] > 0;
                const g = gt[i] > 0;
                if (p && g) tp++;
                else if (p && !g) fp++;
                else if (!p && g) fn++;
                else tn++;
            }
            const dice = (2 * tp) / (2 * tp + fp + fn + 1e-8);
            const iou = tp / (tp + fp + fn + 1e-8);
            const sens = tp / (tp + fn + 1e-8);
            const spec = tn / (tn + fp + 1e-8);
            const volPred = tp + fp;
            const volGT = tp + fn;
            const vs = 1 - Math.abs(volPred - volGT) / (volPred + volGT + 1e-8);
            return { dice, iou, sens, spec, vs };
        }

        function updateMetrics(metrics) {
            document.getElementById('segDiceValue').textContent = metrics.dice.toFixed(4);
            document.getElementById('segIoUValue').textContent = metrics.iou.toFixed(4);
            document.getElementById('segSensValue').textContent = metrics.sens.toFixed(4);
            document.getElementById('segSpecValue').textContent = metrics.spec.toFixed(4);
            document.getElementById('segVSValue').textContent = metrics.vs.toFixed(4);
            document.getElementById('segDiceBar').style.width = (metrics.dice * 100) + '%';
            document.getElementById('segIoUBar').style.width = (metrics.iou * 100) + '%';
        }

        function drawCompareChart(data) {
            const chartCanvas = document.getElementById('segCompareChart');
            const cctx = chartCanvas.getContext('2d');
            const cw = chartCanvas.width, ch = chartCanvas.height;
            cctx.clearRect(0, 0, cw, ch);

            const algos = Object.keys(data);
            if (algos.length === 0) return;

            const metrics = ['dice', 'iou'];
            const colors = ['#4488ff', '#ff6644'];
            const barW = 30;
            const groupW = algos.length * (barW + 5);
            const startX = (cw - groupW * metrics.length) / 2;

            cctx.fillStyle = '#e0e0e0';
            cctx.font = '11px Arial';
            cctx.textAlign = 'center';

            for (let m = 0; m < metrics.length; m++) {
                const gx = startX + m * (groupW + 30);
                cctx.fillText(metrics[m].toUpperCase(), gx + groupW / 2, ch - 10);

                for (let a = 0; a < algos.length; a++) {
                    const val = data[algos[a]][metrics[m]] || 0;
                    const bh = val * (ch - 50);
                    const bx = gx + a * (barW + 5);
                    const by = ch - 30 - bh;

                    cctx.fillStyle = colors[m];
                    cctx.fillRect(bx, by, barW, bh);
                    cctx.fillStyle = '#fff';
                    cctx.font = '9px Arial';
                    cctx.fillText(val.toFixed(2), bx + barW / 2, by - 5);
                    cctx.fillText(algos[a].substring(0, 4), bx + barW / 2, ch - 20);
                }
            }
        }

        generateSyntheticSlice();
        renderImage();

        const algorithmSelect = document.getElementById('segAlgorithm');
        algorithmSelect.addEventListener('change', () => {
            const val = algorithmSelect.value;
            document.querySelectorAll('.algo-controls').forEach(el => el.style.display = 'none');
            document.getElementById(val + 'Controls').style.display = 'block';
            if (val !== 'regionGrowing') {
                seedPoint = null;
                renderImage();
            }
        });

        Components.createSlider(container.querySelector('#segThresholdLower'), {
            label: 'Lower Threshold', min: 0, max: 100, value: 25, step: 1,
            onChange: debounceRun
        });
        Components.createSlider(container.querySelector('#segThresholdUpper'), {
            label: 'Upper Threshold', min: 0, max: 100, value: 75, step: 1,
            onChange: debounceRun
        });
        Components.createSlider(container.querySelector('#segRGSimilarity'), {
            label: 'Similarity Threshold', min: 1, max: 50, value: 15, step: 1,
            onChange: debounceRun
        });
        Components.createSlider(container.querySelector('#segKMeansClusters'), {
            label: 'Number of Clusters (K)', min: 2, max: 8, value: 3, step: 1,
            onChange: debounceRun
        });
        Components.createSlider(container.querySelector('#segWatershedMarkers'), {
            label: 'Number of Markers', min: 5, max: 50, value: 15, step: 1,
            onChange: debounceRun
        });

        canvas.addEventListener('click', (e) => {
            if (algorithmSelect.value !== 'regionGrowing') return;
            const rect = canvas.getBoundingClientRect();
            const x = Math.floor(((e.clientX - rect.left) / rect.width) * size);
            const y = Math.floor(((e.clientY - rect.top) / rect.height) * size);
            seedPoint = { x, y };
            document.getElementById('seedPointDisplay').textContent = `Seed: (${x}, ${y})`;
            renderImage();
        });

        let _m7Timer = null;
        function runCurrentAlgorithm() {
            const algo = algorithmSelect.value;
            showGT = false;
            showDiff = false;

            switch (algo) {
                case 'threshold': {
                    const sliders = container.querySelectorAll('.slider-container');
                    let lowVal = 25, highVal = 75;
                    sliders.forEach(s => {
                        const lbl = s.querySelector('.slider-label')?.textContent;
                        const val = parseFloat(s.querySelector('input[type=range]')?.value || 0);
                        if (lbl && lbl.includes('Lower')) lowVal = val;
                        if (lbl && lbl.includes('Upper')) highVal = val;
                    });
                    segmentationResult = thresholdSegmentation(lowVal, highVal);
                    break;
                }
                case 'regionGrowing': {
                    if (!seedPoint) return;
                    let rgThresh = 15;
                    container.querySelectorAll('.slider-container input[type=range]').forEach(s => {
                        rgThresh = parseFloat(s.value);
                    });
                    segmentationResult = regionGrowingSegmentation(seedPoint, rgThresh);
                    break;
                }
                case 'kmeans': {
                    let k = 3;
                    container.querySelectorAll('.slider-container input[type=range]').forEach(s => {
                        k = parseInt(s.value);
                    });
                    segmentationResult = kMeansSegmentation(k);
                    break;
                }
                case 'watershed': {
                    let markers = 15;
                    container.querySelectorAll('.slider-container input[type=range]').forEach(s => {
                        markers = parseInt(s.value);
                    });
                    segmentationResult = watershedSegmentation(markers);
                    break;
                }
            }

            if (!segmentationResult) return;
            renderImage();
            const metrics = computeMetrics(segmentationResult, lesionMask);
            updateMetrics(metrics);
            comparisonData[algo] = metrics;
            drawCompareChart(comparisonData);
        }

        function debounceRun() {
            if (_m7Timer) clearTimeout(_m7Timer);
            _m7Timer = setTimeout(runCurrentAlgorithm, 200);
        }

        document.getElementById('btnRunSegmentation').addEventListener('click', runCurrentAlgorithm);

        document.getElementById('btnShowGT').addEventListener('click', () => {
            showGT = !showGT;
            document.getElementById('btnShowGT').textContent = showGT ? '🙈 Hide GT' : '👁 Show Ground Truth';
            renderImage();
        });

        document.getElementById('btnShowDiff').addEventListener('click', () => {
            if (!segmentationResult) { alert('Run segmentation first!'); return; }
            showDiff = !showDiff;
            document.getElementById('btnShowDiff').textContent = showDiff ? '📊 Show Overlay' : '📊 Show Difference Map';
            renderImage();
        });

        document.getElementById('btnClearSeg').addEventListener('click', () => {
            segmentationResult = null;
            showGT = false;
            showDiff = false;
            seedPoint = null;
            renderImage();
            document.getElementById('segDiceValue').textContent = '—';
            document.getElementById('segIoUValue').textContent = '—';
            document.getElementById('segSensValue').textContent = '—';
            document.getElementById('segSpecValue').textContent = '—';
            document.getElementById('segVSValue').textContent = '—';
            document.getElementById('segDiceBar').style.width = '0%';
            document.getElementById('segIoUBar').style.width = '0%';
            document.getElementById('seedPointDisplay').textContent = 'Seed: Not set';
            document.getElementById('btnShowGT').textContent = '👁 Show Ground Truth';
            document.getElementById('btnShowDiff').textContent = '📊 Show Difference Map';
        });
    },

    setupCodeBlock(container) {
        const code = `import numpy as np
from scipy import ndimage
import matplotlib.pyplot as plt

def generate_synthetic_slice(size=128):
    """Generate synthetic liver CT slice with lesion."""
    x, y = np.meshgrid(np.linspace(-1, 1, size), np.linspace(-1, 1, size))
    liver = ((x/0.7)**2 + (y/0.6)**2) < 1
    liver_mask = liver.astype(np.float32)
    
    liver_img = np.random.normal(60, 10, (size, size))
    liver_img *= liver_mask
    
    lesion_center = (0.2, 0.1)
    lesion = ((x - lesion_center[0])**2 + (y - lesion_center[1])**2) < 0.04
    lesion_mask = lesion.astype(np.float32)
    liver_img[lesion] = np.random.normal(35, 8, np.sum(lesion))
    
    return liver_img, liver_mask, lesion_mask

def threshold_segmentation(img, low=25, high=75):
    """Simple threshold-based segmentation."""
    return ((img >= low) & (img <= high)).astype(np.float32)

def region_growing(img, seed, threshold=10):
    """Region growing segmentation."""
    from collections import deque
    visited = np.zeros_like(img, dtype=bool)
    region = np.zeros_like(img, dtype=bool)
    queue = deque([seed])
    seed_val = img[seed]
    
    while queue:
        y, x = queue.popleft()
        if visited[y, x]: continue
        if abs(img[y, x] - seed_val) > threshold: continue
        visited[y, x] = True
        region[y, x] = True
        for dy, dx in [(-1,0),(1,0),(0,-1),(0,1)]:
            ny, nx = y+dy, x+dx
            if 0 <= ny < img.shape[0] and 0 <= nx < img.shape[1]:
                queue.append((ny, nx))
    return region.astype(np.float32)

def compute_dice(pred, gt):
    """Dice Similarity Coefficient."""
    intersection = np.sum(pred * gt)
    return 2 * intersection / (np.sum(pred) + np.sum(gt) + 1e-8)

def compute_iou(pred, gt):
    """Intersection over Union."""
    intersection = np.sum(pred * gt)
    union = np.sum(pred) + np.sum(gt) - intersection
    return intersection / (union + 1e-8)

# Generate data and compare
img, liver_mask, lesion_mask = generate_synthetic_slice()
threshold_result = threshold_segmentation(img, 25, 75)

dice = compute_dice(threshold_result, lesion_mask)
iou = compute_iou(threshold_result, lesion_mask)
print(f"Threshold - Dice: {dice:.4f}, IoU: {iou:.4f}")

fig, axes = plt.subplots(1, 4, figsize=(16, 4))
axes[0].imshow(img, cmap='gray'); axes[0].set_title('Original')
axes[1].imshow(lesion_mask, cmap='Reds'); axes[1].set_title('Ground Truth')
axes[2].imshow(threshold_result, cmap='Blues'); axes[2].set_title('Prediction')
diff = np.zeros((*img.shape, 3))
diff[lesion_mask > 0] = [0, 1, 0]
diff[(threshold_result > 0) & (lesion_mask == 0)] = [1, 0, 0]
diff[(threshold_result == 0) & (lesion_mask > 0)] = [0, 0, 1]
axes[3].imshow(diff); axes[3].set_title('Difference Map')
plt.tight_layout(); plt.show()`;
        Components.createCodeBlock(container.querySelector('#segCodeBlock'), code);
    },

    setupQuiz(container) {
        const questions = [
            {
                q: "A segmentation has Dice = 0.92 and IoU = 0.85. What does this indicate?",
                options: [
                    "The segmentation has a significant over-segmentation problem",
                    "The segmentation achieves good overlap between prediction and ground truth",
                    "The ground truth mask is corrupted",
                    "The algorithm failed completely"
                ],
                correct: 1,
                explanation: "A Dice of 0.92 and IoU of 0.85 indicate strong overlap. Dice > 0.9 is generally considered excellent in medical segmentation. The relationship Dice = 2IoU/(1+IoU) holds approximately, confirming consistency."
            },
            {
                q: "Which evaluation metric is most sensitive to false positives (over-segmentation)?",
                options: [
                    "Dice Similarity Coefficient",
                    "Sensitivity (Recall)",
                    "Intersection over Union (IoU)",
                    "Volume Similarity"
                ],
                correct: 2,
                explanation: "IoU penalizes both false positives and false negatives in the denominator (union), making it more sensitive to over-segmentation than Dice. Dice gives equal weight to prediction and ground truth, while IoU's denominator grows with any added pixels."
            },
            {
                q: "In region growing segmentation, what happens if the seed point is placed on a lesion boundary?",
                options: [
                    "The algorithm automatically corrects and finds the lesion center",
                    "The segmentation result will be unreliable and likely incorrect",
                    "Nothing changes, seed location doesn't matter",
                    "The algorithm runs faster with boundary seeds"
                ],
                correct: 1,
                explanation: "Region growing is highly sensitive to seed placement. A boundary seed starts the region at a transition zone, where intensity values may not represent the true lesion, leading to under-segmentation or inclusion of surrounding tissue. This is a key limitation of region growing."
            },
            {
                q: "Why is Hausdorff Distance (HD95) important for evaluating tumor segmentation?",
                options: [
                    "It measures volumetric accuracy only",
                    "It captures the worst-case boundary error, critical for radiation therapy planning",
                    "It is faster to compute than Dice",
                    "It ignores boundary information"
                ],
                correct: 1,
                explanation: "HD95 measures the maximum distance between prediction and ground truth boundaries (at 95th percentile to be robust to outliers). In radiation therapy, even small boundary errors can mean irradiating healthy tissue or missing tumor margins, making boundary accuracy critical."
            }
        ];
        Components.createQuiz(container.querySelector('#segQuizContainer'), questions);
    },

    destroy() {
        if (_m7AnimFrame) {
            cancelAnimationFrame(_m7AnimFrame);
            _m7AnimFrame = null;
        }
    }
});
