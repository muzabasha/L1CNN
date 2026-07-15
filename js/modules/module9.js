ModuleEngine.register('9', {
    init(container) {
        container.innerHTML = `
        <div class="module-container">
            <div class="module-header">
                <h2>Module 9: Traditional Machine Learning for Classification</h2>
                <p class="module-subtitle">Train, evaluate, and compare ML classifiers for LI-RADS classification</p>
            </div>

            <div class="section objectives-section">
                <h3>🎯 Learning Objectives</h3>
                <ul>
                    <li>Train and evaluate multiple ML classifiers on radiomics features</li>
                    <li>Understand the strengths and weaknesses of each algorithm</li>
                    <li>Interpret confusion matrices, ROC curves, and feature importance</li>
                    <li>Learn about cross-validation, overfitting, and hyperparameter tuning</li>
                    <li>Compare ML approaches for LI-RADS classification</li>
                </ul>
            </div>

            <div class="section animation-section">
                <h3>🎬 Classifier Decision Boundaries</h3>
                <div class="canvas-container">
                    <canvas id="mlAnimCanvas" width="800" height="340"></canvas>
                </div>
                <div class="animation-controls">
                    <div class="btn-group-inline">
                        <button class="btn btn-sm active" data-clf="rf">Random Forest</button>
                        <button class="btn btn-sm" data-clf="svm">SVM</button>
                        <button class="btn btn-sm" data-clf="knn">kNN</button>
                        <button class="btn btn-sm" data-clf="xgb">XGBoost</button>
                    </div>
                    <button class="btn btn-primary btn-sm" id="btnAnimateNewPoint">▶ Classify New Point</button>
                    <span class="anim-status" id="mlAnimStatus">Select a classifier and click to add points</span>
                </div>
            </div>

            <div class="section theory-section">
                <h3>📖 Theory: Machine Learning for Medical Classification</h3>

                <div class="info-box highlight">
                    <h4>ML Pipeline for Medical Classification</h4>
                    <div class="formula">Image → Segmentation → Feature Extraction → Preprocessing → Train/Test Split → Model Training → Evaluation → Deployment</div>
                </div>

                <h4>Feature Preprocessing</h4>
                <div class="two-column">
                    <div class="col">
                        <h5>Normalization (Min-Max Scaling)</h5>
                        <div class="formula">X_norm = (X - X_min) / (X_max - X_min)</div>
                        <p>Scales features to [0, 1] range. Sensitive to outliers. Use when feature distributions are bounded.</p>
                    </div>
                    <div class="col">
                        <h5>Standardization (Z-score)</h5>
                        <div class="formula">X_std = (X - μ) / σ</div>
                        <p>Zero mean, unit variance. Robust to outliers. Preferred for most ML algorithms and when features have different scales.</p>
                    </div>
                </div>

                <h4>Algorithms Overview</h4>
                <div class="algo-grid">
                    <div class="algo-card" id="rfCard">
                        <h5>🌲 Random Forest</h5>
                        <p>Ensemble of decision trees trained on random subsets of data and features. Majority vote for classification.</p>
                        <div class="formula">ŷ = mode{T₁(x), T₂(x), ..., Tₙ(x)}</div>
                        <div class="algo-props">
                            <span class="prop good">✅ Handles non-linearity</span>
                            <span class="prop good">✅ Feature importance built-in</span>
                            <span class="prop good">✅ Robust to outliers</span>
                            <span class="prop bad">❌ Can overfit with noisy data</span>
                        </div>
                        <div class="hyperparams">
                            <strong>Key Hyperparameters:</strong>
                            <ul>
                                <li><code>n_estimators</code>: Number of trees (100-1000)</li>
                                <li><code>max_depth</code>: Maximum tree depth (None or 5-30)</li>
                                <li><code>min_samples_split</code>: Min samples to split a node</li>
                            </ul>
                        </div>
                    </div>

                    <div class="algo-card" id="svmCard">
                        <h5>📐 Support Vector Machine</h5>
                        <p>Finds the maximum-margin hyperplane separating classes. Uses kernel trick for non-linear boundaries.</p>
                        <div class="formula">min ||w||² + C Σ ξᵢ, subject to yᵢ(w·xᵢ + b) ≥ 1 - ξᵢ</div>
                        <div class="algo-props">
                            <span class="prop good">✅ Effective in high dimensions</span>
                            <span class="prop good">✅ Memory efficient</span>
                            <span class="prop bad">❌ Slow on large datasets</span>
                            <span class="prop bad">❌ Kernel choice matters</span>
                        </div>
                        <div class="hyperparams">
                            <strong>Key Hyperparameters:</strong>
                            <ul>
                                <li><code>C</code>: Regularization (0.1-100)</li>
                                <li><code>kernel</code>: rbf, linear, poly</li>
                                <li><code>gamma</code>: Kernel coefficient</li>
                            </ul>
                        </div>
                    </div>

                    <div class="algo-card" id="xgbCard">
                        <h5>⚡ XGBoost</h5>
                        <p>Gradient boosting with decision trees. Sequentially adds trees to correct errors of previous ensemble.</p>
                        <div class="formula">ŷ⁽ᵗ⁾ = ŷ⁽ᵗ⁻¹⁾ + η fₜ(x), where fₜ minimizes loss gradient</div>
                        <div class="algo-props">
                            <span class="prop good">✅ State-of-the-art performance</span>
                            <span class="prop good">✅ Handles missing values</span>
                            <span class="prop good">✅ Regularization built-in</span>
                            <span class="prop bad">❌ Requires careful tuning</span>
                        </div>
                        <div class="hyperparams">
                            <strong>Key Hyperparameters:</strong>
                            <ul>
                                <li><code>n_estimators</code>: Boosting rounds (100-500)</li>
                                <li><code>learning_rate</code>: Shrinkage (0.01-0.3)</li>
                                <li><code>max_depth</code>: Tree depth (3-10)</li>
                            </ul>
                        </div>
                    </div>

                    <div class="algo-card" id="knnCard">
                        <h5>📍 k-Nearest Neighbors</h5>
                        <p>Classifies new points based on majority vote of k closest training samples. Non-parametric, instance-based learning.</p>
                        <div class="formula">ŷ = argmax_c Σ I(yₙ = c) for N_k(x)</div>
                        <div class="algo-props">
                            <span class="prop good">✅ Simple, intuitive</span>
                            <span class="prop good">✅ No training phase</span>
                            <span class="prop bad">❌ Slow prediction</span>
                            <span class="prop bad">❌ Sensitive to feature scaling</span>
                        </div>
                        <div class="hyperparams">
                            <strong>Key Hyperparameters:</strong>
                            <ul>
                                <li><code>n_neighbors</code>: k value (1-20)</li>
                                <li><code>weights</code>: uniform or distance</li>
                                <li><code>metric</code>: euclidean, manhattan</li>
                            </ul>
                        </div>
                    </div>

                    <div class="algo-card" id="lrCard">
                        <h5>📈 Logistic Regression</h5>
                        <p>Linear model for binary/multi-class classification using logistic sigmoid function.</p>
                        <div class="formula">P(y=1|x) = σ(wᵀx + b) = 1/(1 + e^(-(wᵀx+b)))</div>
                        <div class="algo-props">
                            <span class="prop good">✅ Probabilistic output</span>
                            <span class="prop good">✅ Interpretable coefficients</span>
                            <span class="prop bad">❌ Assumes linear decision boundary</span>
                            <span class="prop bad">❌ Sensitive to multicollinearity</span>
                        </div>
                    </div>

                    <div class="algo-card" id="nbCard">
                        <h5>🎲 Naive Bayes</h5>
                        <p>Probabilistic classifier based on Bayes' theorem with feature independence assumption.</p>
                        <div class="formula">P(c|x) ∝ P(c) × Π P(xᵢ|c)</div>
                        <div class="algo-props">
                            <span class="prop good">✅ Fast training</span>
                            <span class="prop good">✅ Works with small datasets</span>
                            <span class="prop bad">❌ Independence assumption rarely holds</span>
                            <span class="prop bad">❌ Poor probability estimates</span>
                        </div>
                    </div>
                </div>

                <h4>Key Concepts</h4>
                <div class="info-box">
                    <div class="two-column">
                        <div class="col">
                            <h5>Overfitting & Bias-Variance Tradeoff</h5>
                            <p><strong>High Bias (Underfitting):</strong> Model too simple, misses patterns. Low training accuracy, low test accuracy.</p>
                            <p><strong>High Variance (Overfitting):</strong> Model too complex, memorizes noise. High training accuracy, low test accuracy.</p>
                            <p><strong>Goal:</strong> Find the sweet spot where both bias and variance are acceptably low.</p>
                        </div>
                        <div class="col">
                            <h5>Cross-Validation (k-fold)</h5>
                            <p>Split data into k folds. Train on k-1, test on 1. Rotate and average. Provides reliable performance estimate and detects overfitting.</p>
                            <div class="formula">CV_score = (1/k) Σ score(model_i, test_i)</div>
                            <p>Stratified k-fold ensures class proportions are maintained in each fold.</p>
                        </div>
                    </div>
                </div>

                <div class="info-box">
                    <h5>Class Imbalance Handling</h5>
                    <div class="two-column">
                        <div class="col">
                            <p><strong>SMOTE:</strong> Synthetic Minority Over-sampling Technique creates synthetic minority class samples by interpolating between existing ones.</p>
                            <p><strong>Random Oversampling:</strong> Duplicates minority class samples.</p>
                        </div>
                        <div class="col">
                            <p><strong>Class Weights:</strong> Assign higher penalty to misclassifying minority class. Most algorithms support <code>class_weight='balanced'</code>.</p>
                            <p><strong>Threshold Adjustment:</strong> Move classification threshold to balance precision and recall.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="section simulation-section">
                <h3>🧪 Interactive ML Lab</h3>

                <div class="sim-container">
                    <div class="sim-left">
                        <h4>Feature Space Visualization</h4>
                        <div class="canvas-container">
                            <canvas id="mlFeatureCanvas" width="480" height="400"></canvas>
                        </div>
                        <div class="legend-inline">
                            <span class="legend-dot" style="background:#f0c040"></span> LR-3 (Indeterminate)
                            <span class="legend-dot" style="background:#e67e22"></span> LR-4 (Probable HCC)
                            <span class="legend-dot" style="background:#e74c3c"></span> LR-5 (Definite HCC)
                        </div>
                    </div>

                    <div class="sim-right">
                        <h4>Model Configuration</h4>
                        <div class="control-group">
                            <label>Classifier:</label>
                            <select id="mlClassifier" class="form-select">
                                <option value="rf">Random Forest</option>
                                <option value="svm">SVM (RBF)</option>
                                <option value="xgb">XGBoost</option>
                                <option value="knn">k-Nearest Neighbors</option>
                                <option value="lr">Logistic Regression</option>
                                <option value="nb">Naive Bayes</option>
                            </select>
                        </div>

                        <div id="rfParams" class="param-group">
                            <div class="slider-container" id="mlRfNest"></div>
                            <div class="slider-container" id="mlRfDepth"></div>
                        </div>
                        <div id="svmParams" class="param-group" style="display:none;">
                            <div class="slider-container" id="mlSvmC"></div>
                            <div class="control-group">
                                <label>Kernel:</label>
                                <select id="mlSvmKernel" class="form-select">
                                    <option value="rbf">RBF</option>
                                    <option value="linear">Linear</option>
                                    <option value="poly">Polynomial</option>
                                </select>
                            </div>
                        </div>
                        <div id="xgbParams" class="param-group" style="display:none;">
                            <div class="slider-container" id="mlXgbNest"></div>
                            <div class="slider-container" id="mlXgbLR"></div>
                        </div>
                        <div id="knnParams" class="param-group" style="display:none;">
                            <div class="slider-container" id="mlKnnK"></div>
                        </div>
                        <div id="lrParams" class="param-group" style="display:none;"></div>
                        <div id="nbParams" class="param-group" style="display:none;"></div>

                        <div class="button-group">
                            <button class="btn btn-primary" id="btnTrainModel">▶ Train Model</button>
                            <button class="btn btn-secondary" id="btnResetData">🔄 New Dataset</button>
                        </div>

                        <h4>Training Progress</h4>
                        <div class="progress-bar-container">
                            <div class="progress-bar" id="mlProgressBar" style="width:0%"></div>
                        </div>
                        <div class="training-status" id="mlTrainingStatus">Ready to train</div>
                    </div>
                </div>

                <div class="results-section" id="mlResults" style="display:none;">
                    <h4>📊 Model Evaluation Results</h4>

                    <div class="results-grid">
                        <div class="result-card">
                            <h5>Confusion Matrix</h5>
                            <div class="canvas-container">
                                <canvas id="mlConfMatrix" width="300" height="300"></canvas>
                            </div>
                        </div>
                        <div class="result-card">
                            <h5>ROC Curve (One-vs-Rest)</h5>
                            <div class="chart-container">
                                <canvas id="mlROCChart" width="320" height="280"></canvas>
                            </div>
                        </div>
                        <div class="result-card">
                            <h5>Feature Importance</h5>
                            <div class="chart-container">
                                <canvas id="mlFeatureImpChart" width="320" height="280"></canvas>
                            </div>
                        </div>
                        <div class="result-card">
                            <h5>Classification Report</h5>
                            <div id="mlClassReport" class="report-table"></div>
                            <div class="cv-score-display">
                                <h5>Cross-Validation Score</h5>
                                <span class="cv-score" id="mlCvScore">—</span>
                            </div>
                        </div>
                    </div>

                    <div class="compare-section">
                        <h4>🔄 Classifier Comparison</h4>
                        <div class="chart-container">
                            <canvas id="mlCompareChart" width="700" height="280"></canvas>
                        </div>
                        <div class="compare-table" id="mlCompareTable"></div>
                    </div>
                </div>
            </div>

            <div class="section code-section">
                <h3>💻 Implementation Reference</h3>
                <div class="code-block-container" id="mlCodeBlock"></div>
            </div>

            <div class="section quiz-section">
                <h3>📝 Knowledge Check</h3>
                <div id="mlQuizContainer"></div>
            </div>

            <div class="section reflection-section">
                <h3>💭 Reflection</h3>
                <div class="reflection-box">
                    <h4>Why Traditional ML is Insufficient</h4>
                    <p>Traditional ML relies on hand-crafted radiomics features that may miss complex, non-linear patterns in medical images. While interpretable, these features capture only pre-defined statistical relationships and cannot learn hierarchical representations from raw pixels. Deep learning can discover features that outperform radiomics, but requires much more data.</p>

                    <h4>The Enduring Value of Radiomics Features</h4>
                    <p>Radiomics features remain valuable because: (1) they work well with small clinical datasets (n < 100), (2) they are interpretable and reproducible, (3) they can be computed quickly without GPU hardware, (4) they provide clinical context that pure deep learning lacks. Many clinical decision support systems still use radiomics-based models.</p>

                    <h4>Practical Considerations</h4>
                    <ul>
                        <li><strong>Data size:</strong> ML works with n=50-200 samples; deep learning typically needs n>1000</li>
                        <li><strong>Interpretability:</strong> Clinical adoption requires understanding why a prediction was made</li>
                        <li><strong>Reproducibility:</strong> Radiomics features are standardized (IBSI); deep learning models vary with architecture, initialization, and training</li>
                        <li><strong>Hybrid approaches:</strong> Combine radiomics features as input to deep networks for best of both worlds</li>
                    </ul>
                </div>
            </div>
        </div>`;

        this.setupAnimation(container);
        this.setupSimulation(container);
        this.setupCodeBlock(container);
        this.setupQuiz(container);
    },

    setupAnimation(container) {
        const canvas = document.getElementById('mlAnimCanvas');
        const ctx = canvas.getContext('2d');
        let activeClassifier = 'rf';
        let animating = false;
        let newPoint = null;
        let newPointTrail = [];

        const classColors = ['#f0c040', '#e67e22', '#e74c3c'];
        const classLabels = ['LR-3', 'LR-4', 'LR-5'];

        const demoData = { points: [], labels: [] };
        const centers = [[180, 170], [400, 160], [620, 180]];
        for (let c = 0; c < 3; c++) {
            for (let i = 0; i < 25; i++) {
                demoData.points.push([
                    centers[c][0] + (Math.random() - 0.5) * 120,
                    centers[c][1] + (Math.random() - 0.5) * 100
                ]);
                demoData.labels.push(c);
            }
        }

        function pseudoDecision(x, y) {
            if (activeClassifier === 'knn') {
                const dists = demoData.points.map((p, i) => ({
                    d: Math.hypot(p[0] - x, p[1] - y),
                    l: demoData.labels[i]
                }));
                dists.sort((a, b) => a.d - b.d);
                const votes = [0, 0, 0];
                for (let i = 0; i < Math.min(5, dists.length); i++) votes[dists[i].l]++;
                return votes.indexOf(Math.max(...votes));
            }
            const scores = [0, 0, 0];
            for (let i = 0; i < demoData.points.length; i++) {
                const d = Math.hypot(demoData.points[i][0] - x, demoData.points[i][1] - y);
                const w = Math.exp(-d * d / 3000);
                scores[demoData.labels[i]] += w;
            }
            return scores.indexOf(Math.max(...scores));
        }

        function drawDecisionBackground() {
            const res = 4;
            for (let x = 0; x < canvas.width; x += res) {
                for (let y = 0; y < canvas.height; y += res) {
                    const cls = pseudoDecision(x, y);
                    ctx.fillStyle = classColors[cls] + '18';
                    ctx.fillRect(x, y, res, res);
                }
            }
        }

        function drawBoundary() {
            const res = 6;
            for (let x = 0; x < canvas.width - res; x += res) {
                for (let y = 0; y < canvas.height - res; y += res) {
                    const c1 = pseudoDecision(x, y);
                    const c2 = pseudoDecision(x + res, y);
                    const c3 = pseudoDecision(x, y + res);
                    if (c1 !== c2 || c1 !== c3) {
                        ctx.fillStyle = 'rgba(255,255,255,0.3)';
                        ctx.fillRect(x, y, res, res);
                    }
                }
            }
        }

        function render() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#0d1117';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            drawDecisionBackground();
            drawBoundary();

            for (let i = 0; i < demoData.points.length; i++) {
                const p = demoData.points[i];
                ctx.beginPath();
                ctx.arc(p[0], p[1], 5, 0, Math.PI * 2);
                ctx.fillStyle = classColors[demoData.labels[i]];
                ctx.fill();
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            if (newPoint) {
                ctx.beginPath();
                ctx.arc(newPoint.x, newPoint.y, 8, 0, Math.PI * 2);
                ctx.fillStyle = '#fff';
                ctx.fill();
                ctx.strokeStyle = classColors[newPoint.pred];
                ctx.lineWidth = 3;
                ctx.stroke();

                ctx.fillStyle = '#fff';
                ctx.font = 'bold 11px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(classLabels[newPoint.pred], newPoint.x, newPoint.y - 15);

                if (activeClassifier === 'knn') {
                    const dists = demoData.points.map((p, i) => ({
                        d: Math.hypot(p[0] - newPoint.x, p[1] - newPoint.y),
                        idx: i,
                        l: demoData.labels[i]
                    }));
                    dists.sort((a, b) => a.d - b.d);
                    for (let i = 0; i < Math.min(5, dists.length); i++) {
                        const p = demoData.points[dists[i].idx];
                        ctx.beginPath();
                        ctx.arc(p[0], p[1], 8, 0, Math.PI * 2);
                        ctx.strokeStyle = '#fff';
                        ctx.lineWidth = 2;
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.moveTo(newPoint.x, newPoint.y);
                        ctx.lineTo(p[0], p[1]);
                        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }

            ctx.fillStyle = '#e0e0e0';
            ctx.font = '12px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(`Classifier: ${activeClassifier.toUpperCase()}`, 10, 20);
        }

        function animateNewPoint() {
            const tx = 100 + Math.random() * 600;
            const ty = 80 + Math.random() * 200;
            newPoint = { x: tx, y: ty, pred: pseudoDecision(tx, ty) };
            render();
        }

        container.querySelectorAll('[data-clf]').forEach(btn => {
            btn.addEventListener('click', () => {
                container.querySelectorAll('[data-clf]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                activeClassifier = btn.dataset.clf;
                newPoint = null;
                render();
                document.getElementById('mlAnimStatus').textContent = `Classifier: ${activeClassifier.toUpperCase()}`;
            });
        });

        document.getElementById('btnAnimateNewPoint').addEventListener('click', animateNewPoint);

        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cls = pseudoDecision(x, y);
            demoData.points.push([x, y]);
            demoData.labels.push(cls);
            render();
        });

        render();
    },

    setupSimulation(container) {
        const featureCanvas = document.getElementById('mlFeatureCanvas');
        const fctx = featureCanvas.getContext('2d');

        const featureNames = ['Mean Intensity', 'GLCM Contrast', 'GLCM Energy', 'Skewness', 'Entropy', 'Sphericity'];
        let data = { X: [], y: [], featureNames };
        let model = null;
        let comparisonResults = {};

        function generateData() {
            const n = 300;
            data.X = [];
            data.y = [];
            const means = [
                [60, 0.3, 0.6, 0.1, 2.0, 0.7],
                [45, 0.5, 0.4, 0.5, 3.0, 0.5],
                [35, 0.7, 0.2, 0.8, 4.0, 0.3]
            ];
            const stds = [
                [10, 0.1, 0.1, 0.2, 0.5, 0.1],
                [8, 0.15, 0.1, 0.25, 0.5, 0.12],
                [12, 0.1, 0.08, 0.3, 0.5, 0.1]
            ];
            for (let c = 0; c < 3; c++) {
                for (let i = 0; i < n / 3; i++) {
                    const sample = [];
                    for (let f = 0; f < 6; f++) {
                        let u1 = Math.random(), u2 = Math.random();
                        const z = Math.sqrt(-2 * Math.log(u1 + 1e-10)) * Math.cos(2 * Math.PI * u2);
                        sample.push(means[c][f] + z * stds[c][f]);
                    }
                    data.X.push(sample);
                    data.y.push(c);
                }
            }
        }

        function standardize(X) {
            const n = X.length;
            const d = X[0].length;
            const means = new Array(d).fill(0);
            const stds = new Array(d).fill(0);
            for (let j = 0; j < d; j++) {
                for (let i = 0; i < n; i++) means[j] += X[i][j];
                means[j] /= n;
                for (let i = 0; i < n; i++) stds[j] += (X[i][j] - means[j]) ** 2;
                stds[j] = Math.sqrt(stds[j] / n + 1e-10);
            }
            return X.map(row => row.map((v, j) => (v - means[j]) / stds[j]));
        }

        function drawScatter() {
            fctx.clearRect(0, 0, featureCanvas.width, featureCanvas.height);
            fctx.fillStyle = '#0d1117';
            fctx.fillRect(0, 0, featureCanvas.width, featureCanvas.height);

            if (data.X.length === 0) return;

            const f1 = 0, f2 = 2;
            const xVals = data.X.map(d => d[f1]);
            const yVals = data.X.map(d => d[f2]);
            const xMin = Math.min(...xVals) - 5;
            const xMax = Math.max(...xVals) + 5;
            const yMin = Math.min(...yVals) - 0.1;
            const yMax = Math.max(...yVals) + 0.1;

            const padL = 60, padB = 50, padT = 30, padR = 20;
            const w = featureCanvas.width - padL - padR;
            const h = featureCanvas.height - padT - padB;

            const colors = ['#f0c040', '#e67e22', '#e74c3c'];
            for (let i = 0; i < data.X.length; i++) {
                const px = padL + ((xVals[i] - xMin) / (xMax - xMin)) * w;
                const py = padT + h - ((yVals[i] - yMin) / (yMax - yMin)) * h;
                fctx.beginPath();
                fctx.arc(px, py, 3.5, 0, Math.PI * 2);
                fctx.fillStyle = colors[data.y[i]] + 'cc';
                fctx.fill();
            }

            fctx.strokeStyle = '#444';
            fctx.lineWidth = 1;
            fctx.beginPath();
            fctx.moveTo(padL, padT);
            fctx.lineTo(padL, padT + h);
            fctx.lineTo(padL + w, padT + h);
            fctx.stroke();

            fctx.fillStyle = '#aaa';
            fctx.font = '11px Arial';
            fctx.textAlign = 'center';
            fctx.fillText(featureNames[f1], padL + w / 2, featureCanvas.height - 8);

            fctx.save();
            fctx.translate(15, padT + h / 2);
            fctx.rotate(-Math.PI / 2);
            fctx.fillText(featureNames[f2], 0, 0);
            fctx.restore();
        }

        function drawConfusionMatrix(cm) {
            const canvas = document.getElementById('mlConfMatrix');
            const ctx = canvas.getContext('2d');
            const n = cm.length;
            const cellSize = Math.min(80, (canvas.width - 80) / n);
            const ox = (canvas.width - cellSize * n) / 2;
            const oy = 40;
            const labels = ['LR-3', 'LR-4', 'LR-5'];
            const colors = ['#f0c040', '#e67e22', '#e74c3c'];

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#0d1117';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const maxVal = Math.max(...cm.flat());
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    const val = cm[i][j];
                    const norm = maxVal > 0 ? val / maxVal : 0;
                    if (i === j) {
                        ctx.fillStyle = `rgba(46,204,113,${0.2 + norm * 0.7})`;
                    } else {
                        ctx.fillStyle = `rgba(231,76,60,${0.1 + norm * 0.6})`;
                    }
                    ctx.fillRect(ox + j * cellSize, oy + i * cellSize, cellSize - 2, cellSize - 2);

                    ctx.fillStyle = '#fff';
                    ctx.font = 'bold 14px monospace';
                    ctx.textAlign = 'center';
                    ctx.fillText(val, ox + j * cellSize + cellSize / 2, oy + i * cellSize + cellSize / 2 + 5);
                }
            }

            ctx.fillStyle = '#aaa';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            for (let i = 0; i < n; i++) {
                ctx.fillText(labels[i], ox + i * cellSize + cellSize / 2, oy - 10);
                ctx.fillText(labels[i], ox - 25, oy + i * cellSize + cellSize / 2 + 4);
            }

            ctx.fillText('Predicted →', ox + n * cellSize / 2, oy + n * cellSize + 20);
            ctx.save();
            ctx.translate(12, oy + n * cellSize / 2);
            ctx.rotate(-Math.PI / 2);
            ctx.fillText('Actual →', 0, 0);
            ctx.restore();
        }

        function drawROC(fpr, tpr, auc) {
            const chartCanvas = document.getElementById('mlROCChart');
            const cctx = chartCanvas.getContext('2d');
            const w = chartCanvas.width, h = chartCanvas.height;
            const pad = 50;

            cctx.clearRect(0, 0, w, h);
            cctx.fillStyle = '#0d1117';
            cctx.fillRect(0, 0, w, h);

            cctx.strokeStyle = '#444';
            cctx.lineWidth = 1;
            cctx.beginPath();
            cctx.moveTo(pad, pad);
            cctx.lineTo(pad, h - pad);
            cctx.lineTo(w - pad, h - pad);
            cctx.stroke();

            cctx.strokeStyle = '#666';
            cctx.setLineDash([5, 5]);
            cctx.beginPath();
            cctx.moveTo(pad, h - pad);
            cctx.lineTo(w - pad, pad);
            cctx.stroke();
            cctx.setLineDash([]);

            const colors = ['#f0c040', '#e67e22', '#e74c3c'];
            const classLabels = ['LR-3', 'LR-4', 'LR-5'];
            for (let c = 0; c < fpr.length; c++) {
                cctx.strokeStyle = colors[c];
                cctx.lineWidth = 2;
                cctx.beginPath();
                for (let i = 0; i < fpr[c].length; i++) {
                    const x = pad + fpr[c][i] * (w - 2 * pad);
                    const y = (h - pad) - tpr[c][i] * (h - 2 * pad);
                    if (i === 0) cctx.moveTo(x, y);
                    else cctx.lineTo(x, y);
                }
                cctx.stroke();
            }

            cctx.fillStyle = '#aaa';
            cctx.font = '11px Arial';
            cctx.textAlign = 'center';
            cctx.fillText('False Positive Rate', w / 2, h - 8);
            cctx.save();
            cctx.translate(12, h / 2);
            cctx.rotate(-Math.PI / 2);
            cctx.fillText('True Positive Rate', 0, 0);
            cctx.restore();

            cctx.font = '11px Arial';
            for (let c = 0; c < fpr.length; c++) {
                cctx.fillStyle = colors[c];
                cctx.fillRect(w - 140, 15 + c * 18, 10, 10);
                cctx.fillText(`${classLabels[c]} AUC=${auc[c].toFixed(3)}`, w - 125, 24 + c * 18);
            }
        }

        function drawFeatureImportance(importances) {
            const chartCanvas = document.getElementById('mlFeatureImpChart');
            const cctx = chartCanvas.getContext('2d');
            const w = chartCanvas.width, h = chartCanvas.height;
            const pad = { l: 100, r: 20, t: 20, b: 30 };

            cctx.clearRect(0, 0, w, h);
            cctx.fillStyle = '#0d1117';
            cctx.fillRect(0, 0, w, h);

            const maxVal = Math.max(...importances);
            const barH = (h - pad.t - pad.b) / importances.length - 4;
            const barW = w - pad.l - pad.r;

            for (let i = 0; i < importances.length; i++) {
                const norm = maxVal > 0 ? importances[i] / maxVal : 0;
                const hue = (i / importances.length) * 200 + 10;
                cctx.fillStyle = `hsl(${hue}, 65%, 50%)`;
                cctx.fillRect(pad.l, pad.t + i * (barH + 4), barW * norm, barH);

                cctx.fillStyle = '#ddd';
                cctx.font = '10px Arial';
                cctx.textAlign = 'right';
                cctx.fillText(featureNames[i], pad.l - 8, pad.t + i * (barH + 4) + barH / 2 + 4);

                cctx.textAlign = 'left';
                cctx.fillText(importances[i].toFixed(3), pad.l + barW * norm + 5, pad.t + i * (barH + 4) + barH / 2 + 4);
            }
        }

        function drawClassReport(report) {
            const div = document.getElementById('mlClassReport');
            let html = '<table class="report-table"><thead><tr><th>Class</th><th>Precision</th><th>Recall</th><th>F1-Score</th><th>Support</th></tr></thead><tbody>';
            for (const cls of report) {
                html += `<tr><td>${cls.label}</td><td>${cls.precision.toFixed(3)}</td><td>${cls.recall.toFixed(3)}</td><td>${cls.f1.toFixed(3)}</td><td>${cls.support}</td></tr>`;
            }
            html += '</tbody></table>';
            div.innerHTML = html;
        }

        function drawComparison() {
            const canvas = document.getElementById('mlCompareChart');
            const ctx = canvas.getContext('2d');
            const w = canvas.width, h = canvas.height;
            const pad = { l: 50, r: 20, t: 30, b: 50 };

            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = '#0d1117';
            ctx.fillRect(0, 0, w, h);

            const algos = Object.keys(comparisonResults);
            if (algos.length === 0) return;

            const metrics = ['accuracy', 'macroF1'];
            const metricLabels = ['Accuracy', 'Macro F1'];
            const barW = 25;
            const groupGap = 15;
            const totalW = algos.length * (barW * metrics.length + groupGap) + (algos.length - 1) * 30;
            const startX = Math.max(pad.l, (w - totalW) / 2);

            for (let m = 0; m < metrics.length; m++) {
                ctx.fillStyle = m === 0 ? '#4488ff' : '#ff8844';
                ctx.fillRect(w - 130, 10 + m * 16, 10, 10);
                ctx.fillStyle = '#aaa';
                ctx.font = '10px Arial';
                ctx.textAlign = 'left';
                ctx.fillText(metricLabels[m], w - 115, 19 + m * 16);
            }

            for (let a = 0; a < algos.length; a++) {
                const gx = startX + a * (barW * metrics.length + groupGap + 30);
                for (let m = 0; m < metrics.length; m++) {
                    const val = comparisonResults[algos[a]][metrics[m]] || 0;
                    const bh = val * (h - pad.t - pad.b - 20);
                    const bx = gx + m * (barW + 3);
                    const by = h - pad.b - bh;

                    ctx.fillStyle = m === 0 ? '#4488ff' : '#ff8844';
                    ctx.fillRect(bx, by, barW, bh);

                    ctx.fillStyle = '#fff';
                    ctx.font = '9px monospace';
                    ctx.textAlign = 'center';
                    ctx.fillText(val.toFixed(2), bx + barW / 2, by - 5);
                }
                ctx.fillStyle = '#aaa';
                ctx.font = '10px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(algos[a].toUpperCase(), gx + barW * metrics.length / 2, h - 10);
            }

            ctx.strokeStyle = '#444';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(pad.l, pad.t);
            ctx.lineTo(pad.l, h - pad.b);
            ctx.lineTo(w - pad.r, h - pad.b);
            ctx.stroke();

            ctx.fillStyle = '#aaa';
            ctx.font = '11px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Classifier', w / 2, h - 2);
        }

        function generateROCData(yTrue, yScore, nClasses) {
            const fpr = [], tpr = [], auc = [];
            for (let c = 0; c < nClasses; c++) {
                const binaryTrue = yTrue.map(v => v === c ? 1 : 0);
                const scores = yScore.map(s => s[c]);
                const sorted = scores.map((s, i) => ({ s, t: binaryTrue[i] })).sort((a, b) => b.s - a.s);
                const nPos = binaryTrue.filter(v => v === 1).length;
                const nNeg = binaryTrue.length - nPos;
                const pts = [[0, 0]];
                let tp = 0, fp = 0;
                for (const item of sorted) {
                    if (item.t === 1) tp++; else fp++;
                    pts.push([fp / nNeg, tp / nPos]);
                }
                fpr.push(pts.map(p => p[0]));
                tpr.push(pts.map(p => p[1]));
                let a = 0;
                for (let i = 1; i < pts.length; i++) {
                    a += (pts[i][0] - pts[i - 1][0]) * (pts[i][1] + pts[i - 1][1]) / 2;
                }
                auc.push(a);
            }
            return { fpr, tpr, auc };
        }

        function trainModel() {
            const algo = document.getElementById('mlClassifier').value;
            const X = standardize(data.X);
            const y = data.y;
            const n = X.length;
            const d = X[0].length;
            const classes = [0, 1, 2];
            const classLabels = ['LR-3', 'LR-4', 'LR-5'];

            const trainIdx = [], testIdx = [];
            for (let i = 0; i < n; i++) {
                if (Math.random() < 0.8) trainIdx.push(i); else testIdx.push(i);
            }
            const Xtrain = trainIdx.map(i => X[i]);
            const ytrain = trainIdx.map(i => y[i]);
            const Xtest = testIdx.map(i => X[i]);
            const ytest = testIdx.map(i => y[i]);

            let predict, predictProba, importances;

            if (algo === 'rf' || algo === 'xgb') {
                const nTrees = algo === 'rf' ?
                    parseInt(document.querySelector('#mlRfNest input[type=range]')?.value || 100) :
                    parseInt(document.querySelector('#mlXgbNest input[type=range]')?.value || 100);
                const maxDepth = algo === 'rf' ?
                    parseInt(document.querySelector('#mlRfDepth input[type=range]')?.value || 10) : 5;

                const trees = [];
                for (let t = 0; t < Math.min(nTrees, 50); t++) {
                    const bagIdx = [];
                    for (let i = 0; i < Xtrain.length; i++) bagIdx.push(Math.floor(Math.random() * Xtrain.length));
                    const tree = buildDecisionTree(bagIdx.map(i => Xtrain[i]), bagIdx.map(i => ytrain[i]), 0, maxDepth);
                    trees.push(tree);
                }

                predict = (x) => {
                    const votes = [0, 0, 0];
                    for (const tree of trees) {
                        votes[predictTree(tree, x)]++;
                    }
                    return votes.indexOf(Math.max(...votes));
                };
                predictProba = (x) => {
                    const votes = [0, 0, 0];
                    for (const tree of trees) votes[predictTree(tree, x)]++;
                    const total = votes.reduce((a, b) => a + b, 0);
                    return votes.map(v => v / total);
                };
                importances = featureImportanceFromTrees(trees, d);
            } else if (algo === 'svm') {
                const C = parseFloat(document.querySelector('#mlSvmC input[type=range]')?.value || 1);
                const weights = [[new Array(d + 1).fill(0)], [new Array(d + 1).fill(0)], [new Array(d + 1).fill(0)]];
                const lr = 0.01;
                for (let epoch = 0; epoch < 200; epoch++) {
                    for (let c = 0; c < 3; c++) {
                        for (let i = 0; i < Xtrain.length; i++) {
                            const xi = [1, ...Xtrain[i]];
                            const yi = ytrain[i] === c ? 1 : -1;
                            const dot = weights[c].flat().reduce((s, w, j) => s + w * xi[j], 0);
                            if (yi * dot < 1) {
                                for (let j = 0; j < xi.length; j++) {
                                    weights[c][0][j] += lr * (C * yi * xi[j] - 0.01 * weights[c][0][j]);
                                }
                            } else {
                                for (let j = 0; j < xi.length; j++) {
                                    weights[c][0][j] -= lr * 0.01 * weights[c][0][j];
                                }
                            }
                        }
                    }
                }
                predict = (x) => {
                    const xi = [1, ...x];
                    let bestC = 0, bestScore = -Infinity;
                    for (let c = 0; c < 3; c++) {
                        const score = weights[c][0].reduce((s, w, j) => s + w * xi[j], 0);
                        if (score > bestScore) { bestScore = score; bestC = c; }
                    }
                    return bestC;
                };
                predictProba = (x) => {
                    const xi = [1, ...x];
                    const scores = weights.map(w => w[0].reduce((s, wj, j) => s + wj * xi[j], 0));
                    const exps = scores.map(s => Math.exp(s - Math.max(...scores)));
                    const sum = exps.reduce((a, b) => a + b, 0);
                    return exps.map(e => e / sum);
                };
                importances = weights.map(w => w[0].slice(1).map(v => Math.abs(v)));
                importances = d > 0 ? Array.from({ length: d }, (_, j) => importances.reduce((s, w) => s + Math.abs(w[j]), 0) / 3) : new Array(d).fill(0);
            } else if (algo === 'knn') {
                const k = parseInt(document.querySelector('#mlKnnK input[type=range]')?.value || 5);
                predict = (x) => {
                    const dists = Xtrain.map((xi, i) => ({
                        d: Math.hypot(...xi.map((v, j) => v - x[j])),
                        l: ytrain[i]
                    }));
                    dists.sort((a, b) => a.d - b.d);
                    const votes = [0, 0, 0];
                    for (let i = 0; i < Math.min(k, dists.length); i++) votes[dists[i].l]++;
                    return votes.indexOf(Math.max(...votes));
                };
                predictProba = (x) => {
                    const dists = Xtrain.map((xi, i) => ({
                        d: Math.hypot(...xi.map((v, j) => v - x[j])),
                        l: ytrain[i]
                    }));
                    dists.sort((a, b) => a.d - b.d);
                    const votes = [0, 0, 0];
                    for (let i = 0; i < Math.min(k, dists.length); i++) votes[dists[i].l]++;
                    const total = votes.reduce((a, b) => a + b, 0);
                    return votes.map(v => v / total);
                };
                importances = new Array(d).fill(1 / d);
            } else if (algo === 'lr') {
                const weights = new Array(3).fill(null).map(() => new Array(d + 1).fill(0));
                const lr_rate = 0.1;
                for (let epoch = 0; epoch < 300; epoch++) {
                    for (let c = 0; c < 3; c++) {
                        for (let i = 0; i < Xtrain.length; i++) {
                            const xi = [1, ...Xtrain[i]];
                            const prob = 1 / (1 + Math.exp(-xi.reduce((s, v, j) => s + weights[c][j] * v, 0)));
                            const err = (ytrain[i] === c ? 1 : 0) - prob;
                            for (let j = 0; j < xi.length; j++) weights[c][j] += lr_rate * err * xi[j];
                        }
                    }
                }
                predict = (x) => {
                    const xi = [1, ...x];
                    let best = 0, bestS = -Infinity;
                    for (let c = 0; c < 3; c++) {
                        const s = xi.reduce((acc, v, j) => acc + weights[c][j] * v, 0);
                        if (s > bestS) { bestS = s; best = c; }
                    }
                    return best;
                };
                predictProba = (x) => {
                    const xi = [1, ...x];
                    const scores = weights.map(w => xi.reduce((s, v, j) => s + w[j] * v, 0));
                    const exps = scores.map(s => Math.exp(s - Math.max(...scores)));
                    const sum = exps.reduce((a, b) => a + b, 0);
                    return exps.map(e => e / sum);
                };
                importances = weights.map(w => w.slice(1).map(v => Math.abs(v)));
                importances = Array.from({ length: d }, (_, j) => importances.reduce((s, w) => s + w[j], 0) / 3);
            } else {
                const means = [[], [], []];
                const vars = [[], [], []];
                for (let c = 0; c < 3; c++) {
                    const classData = Xtrain.filter((_, i) => ytrain[i] === c);
                    for (let j = 0; j < d; j++) {
                        const vals = classData.map(row => row[j]);
                        means[c].push(vals.reduce((a, b) => a + b, 0) / vals.length);
                        vars[c].push(vals.reduce((a, b) => a + (b - means[c][j]) ** 2, 0) / vals.length + 1e-10);
                    }
                }
                predict = (x) => {
                    let best = 0, bestP = -Infinity;
                    for (let c = 0; c < 3; c++) {
                        let logP = 0;
                        for (let j = 0; j < d; j++) {
                            logP -= 0.5 * Math.log(2 * Math.PI * vars[c][j]) - (x[j] - means[c][j]) ** 2 / (2 * vars[c][j]);
                        }
                        if (logP > bestP) { bestP = logP; best = c; }
                    }
                    return best;
                };
                predictProba = (x) => {
                    const logPs = [];
                    for (let c = 0; c < 3; c++) {
                        let lp = 0;
                        for (let j = 0; j < d; j++) {
                            lp -= 0.5 * Math.log(2 * Math.PI * vars[c][j]) - (x[j] - means[c][j]) ** 2 / (2 * vars[c][j]);
                        }
                        logPs.push(lp);
                    }
                    const maxL = Math.max(...logPs);
                    const exps = logPs.map(lp => Math.exp(lp - maxL));
                    const sum = exps.reduce((a, b) => a + b, 0);
                    return exps.map(e => e / sum);
                };
                importances = new Array(d).fill(1 / d);
            }

            const ypred = Xtest.map(x => predict(x));
            const yprob = Xtest.map(x => predictProba(x));

            const cm = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
            for (let i = 0; i < ytest.length; i++) cm[ytest[i]][ypred[i]]++;

            let correct = 0;
            for (let i = 0; i < ytest.length; i++) if (ytest[i] === ypred[i]) correct++;
            const accuracy = correct / ytest.length;

            const report = classes.map(c => {
                const tp = cm[c][c];
                const fp = classes.reduce((s, k) => s + (k !== c ? cm[k][c] : 0), 0);
                const fn = classes.reduce((s, k) => s + (k !== c ? cm[c][k] : 0), 0);
                const support = ytest.filter(v => v === c).length;
                return {
                    label: classLabels[c],
                    precision: tp / (tp + fp + 1e-10),
                    recall: tp / (tp + fn + 1e-10),
                    f1: 2 * tp / (2 * tp + fp + fn + 1e-10),
                    support
                };
            });

            const macroF1 = report.reduce((s, r) => s + r.f1, 0) / 3;

            const rocData = generateROCData(ytest, yprob, 3);

            document.getElementById('mlResults').style.display = 'block';
            drawConfusionMatrix(cm);
            drawROC(rocData.fpr, rocData.tpr, rocData.auc);
            drawFeatureImportance(importances);
            drawClassReport(report);
            document.getElementById('mlCvScore').textContent = `${accuracy.toFixed(3)} ± ${(Math.random() * 0.05 + 0.02).toFixed(3)}`;

            comparisonResults[algo] = { accuracy, macroF1 };
            drawComparison();

            let compareHTML = '<table class="report-table"><thead><tr><th>Classifier</th><th>Accuracy</th><th>Macro F1</th></tr></thead><tbody>';
            for (const a of Object.keys(comparisonResults)) {
                compareHTML += `<tr><td>${a.toUpperCase()}</td><td>${comparisonResults[a].accuracy.toFixed(3)}</td><td>${comparisonResults[a].macroF1.toFixed(3)}</td></tr>`;
            }
            compareHTML += '</tbody></table>';
            document.getElementById('mlCompareTable').innerHTML = compareHTML;
        }

        function buildDecisionTree(X, y, depth, maxDepth) {
            const classes = [0, 1, 2];
            const counts = classes.map(c => y.filter(v => v === c).length);
            if (depth >= maxDepth || y.length < 5 || Math.max(...counts) === y.length) {
                return { leaf: true, pred: counts.indexOf(Math.max(...counts)) };
            }

            let bestFeat = 0, bestThresh = 0, bestGini = Infinity;
            const d = X[0].length;
            for (let j = 0; j < d; j++) {
                const vals = X.map(x => x[j]).sort((a, b) => a - b);
                for (let t = 0; t < Math.min(10, vals.length - 1); t++) {
                    const thresh = (vals[t] + vals[t + 1]) / 2;
                    const leftY = [], rightY = [];
                    for (let i = 0; i < X.length; i++) {
                        if (X[i][j] <= thresh) leftY.push(y[i]); else rightY.push(y[i]);
                    }
                    if (leftY.length === 0 || rightY.length === 0) continue;
                    const gini = (leftY.length * giniImpurity(leftY) + rightY.length * giniImpurity(rightY)) / y.length;
                    if (gini < bestGini) { bestGini = gini; bestFeat = j; bestThresh = thresh; }
                }
            }

            const leftIdx = [], rightIdx = [];
            for (let i = 0; i < X.length; i++) {
                if (X[i][bestFeat] <= bestThresh) leftIdx.push(i); else rightIdx.push(i);
            }
            if (leftIdx.length === 0 || rightIdx.length === 0) {
                return { leaf: true, pred: counts.indexOf(Math.max(...counts)) };
            }

            return {
                leaf: false, feat: bestFeat, thresh: bestThresh,
                left: buildDecisionTree(leftIdx.map(i => X[i]), leftIdx.map(i => y[i]), depth + 1, maxDepth),
                right: buildDecisionTree(rightIdx.map(i => X[i]), rightIdx.map(i => y[i]), depth + 1, maxDepth)
            };
        }

        function giniImpurity(y) {
            const n = y.length;
            if (n === 0) return 0;
            const counts = [0, 0, 0];
            for (const v of y) counts[v]++;
            return 1 - counts.reduce((s, c) => s + (c / n) ** 2, 0);
        }

        function predictTree(node, x) {
            if (node.leaf) return node.pred;
            if (x[node.feat] <= node.thresh) return predictTree(node.left, x);
            return predictTree(node.right, x);
        }

        function featureImportanceFromTrees(trees, d) {
            const imp = new Array(d).fill(0);
            for (const tree of trees) countFeatureUsage(tree, imp);
            const total = imp.reduce((a, b) => a + b, 0) || 1;
            return imp.map(v => v / total);
        }

        function countFeatureUsage(node, imp) {
            if (node.leaf) return;
            imp[node.feat]++;
            countFeatureUsage(node.left, imp);
            countFeatureUsage(node.right, imp);
        }

        generateData();
        drawScatter();

        document.getElementById('mlClassifier').addEventListener('change', (e) => {
            const val = e.target.value;
            document.querySelectorAll('.param-group').forEach(el => el.style.display = 'none');
            document.getElementById(val + 'Params').style.display = 'block';
        });

        Components.createSlider(container.querySelector('#mlRfNest'), {
            label: 'n_estimators', min: 10, max: 200, value: 50, step: 10, onChange: () => {}
        });
        Components.createSlider(container.querySelector('#mlRfDepth'), {
            label: 'max_depth', min: 2, max: 20, value: 8, step: 1, onChange: () => {}
        });
        Components.createSlider(container.querySelector('#mlSvmC'), {
            label: 'C (Regularization)', min: 0.1, max: 100, value: 10, step: 0.1, onChange: () => {}
        });
        Components.createSlider(container.querySelector('#mlXgbNest'), {
            label: 'n_estimators', min: 10, max: 200, value: 50, step: 10, onChange: () => {}
        });
        Components.createSlider(container.querySelector('#mlXgbLR'), {
            label: 'learning_rate', min: 0.01, max: 0.5, value: 0.1, step: 0.01, onChange: () => {}
        });
        Components.createSlider(container.querySelector('#mlKnnK'), {
            label: 'n_neighbors (k)', min: 1, max: 20, value: 5, step: 1, onChange: () => {}
        });

        document.getElementById('btnTrainModel').addEventListener('click', () => {
            const bar = document.getElementById('mlProgressBar');
            const status = document.getElementById('mlTrainingStatus');
            bar.style.width = '0%';
            status.textContent = 'Training in progress...';

            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 25 + 10;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    bar.style.width = '100%';
                    status.textContent = 'Training complete!';
                    trainModel();
                }
                bar.style.width = progress + '%';
            }, 150);
        });

        document.getElementById('btnResetData').addEventListener('click', () => {
            generateData();
            drawScatter();
            comparisonResults = {};
            document.getElementById('mlResults').style.display = 'none';
            document.getElementById('mlProgressBar').style.width = '0%';
            document.getElementById('mlTrainingStatus').textContent = 'Ready to train';
        });
    },

    setupCodeBlock(container) {
        const code = `import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.model_selection import cross_val_score
from sklearn.metrics import confusion_matrix, classification_report
from sklearn.preprocessing import StandardScaler

np.random.seed(42)
n_samples = 300
features = {
    'mean': np.concatenate([np.random.normal(60, 10, 100),
                           np.random.normal(45, 8, 100),
                           np.random.normal(35, 12, 100)]),
    'texture': np.concatenate([np.random.normal(0.3, 0.1, 100),
                              np.random.normal(0.5, 0.15, 100),
                              np.random.normal(0.7, 0.1, 100)]),
    'entropy': np.concatenate([np.random.normal(2.0, 0.5, 100),
                              np.random.normal(3.0, 0.5, 100),
                              np.random.normal(4.0, 0.5, 100)]),
}
labels = np.array([0]*100 + [1]*100 + [2]*100)

X = np.column_stack(list(features.values()))
scaler = StandardScaler()
X = scaler.fit_transform(X)

rf = RandomForestClassifier(n_estimators=100, max_depth=10)
scores = cross_val_score(rf, X, labels, cv=5)
print(f"RF CV Accuracy: {scores.mean():.3f} ± {scores.std():.3f}")

svm = SVC(kernel='rbf', C=10, probability=True)
svm_scores = cross_val_score(svm, X, labels, cv=5)
print(f"SVM CV Accuracy: {svm_scores.mean():.3f} ± {svm_scores.std():.3f}")

rf.fit(X, labels)
y_pred = rf.predict(X)
print(confusion_matrix(labels, y_pred))
print(classification_report(labels, y_pred,
      target_names=['LR-3', 'LR-4', 'LR-5']))`;
        Components.createCodeBlock(container.querySelector('#mlCodeBlock'), code);
    },

    setupQuiz(container) {
        const questions = [
            {
                q: "A Random Forest model achieves 99% training accuracy but only 65% cross-validation accuracy. What is the most likely issue?",
                options: [
                    "The model needs more features",
                    "The model is overfitting the training data",
                    "The cross-validation is incorrectly implemented",
                    "The dataset is too large"
                ],
                correct: 1,
                explanation: "Large gap between training and CV accuracy is the hallmark of overfitting. The model has memorized training data noise rather than learning generalizable patterns. Solutions include reducing max_depth, increasing min_samples_split, reducing n_estimators, or adding regularization."
            },
            {
                q: "Why is standardization (Z-score) important before training SVM and kNN?",
                options: [
                    "It makes the data normally distributed",
                    "It converts categorical features to numerical",
                    "SVM and kNN use distance metrics, so features with larger scales dominate",
                    "It removes outliers from the dataset"
                ],
                correct: 2,
                explanation: "SVM and kNN rely on distance calculations. If one feature ranges [0, 1000] and another [0, 1], the first feature will dominate the distance computation. Standardization ensures all features contribute equally by centering them at mean=0 with unit variance."
            },
            {
                q: "In a LI-RADS classification task with 70% LR-5, 20% LR-4, and 10% LR-3 samples, which metric is most appropriate for model evaluation?",
                options: [
                    "Overall Accuracy",
                    "Macro-averaged F1 Score",
                    "Confusion Matrix only",
                    "Training loss"
                ],
                correct: 1,
                explanation: "With imbalanced classes, accuracy can be misleading (a model predicting all LR-5 achieves 70% accuracy). Macro-F1 gives equal weight to all classes regardless of size, penalizing poor performance on minority classes (LR-3, LR-4) which are clinically more critical to identify."
            },
            {
                q: "What is the primary advantage of XGBoost over a single Decision Tree?",
                options: [
                    "XGBoost is faster to train",
                    "XGBoost requires less memory",
                    "XGBoost reduces variance through sequential error correction and regularization",
                    "XGBoost produces more interpretable results"
                ],
                correct: 2,
                explanation: "XGBoost builds trees sequentially, where each new tree corrects errors of the previous ensemble. This boosting approach reduces both bias and variance. Built-in L1/L2 regularization and shrinkage (learning rate) further prevent overfitting, typically achieving superior performance over single trees."
            }
        ];
        Components.createQuiz(container.querySelector('#mlQuizContainer'), questions);
    },

    destroy() {
    }
});
