let _heroEngine = null;

function initHero3D() {
  const container = document.getElementById('hero-3d');
  if (!container || !window.THREE) return;

  if (_heroEngine && _heroEngine.destroy) {
    _heroEngine.destroy();
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(0, 0, 5.2);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const heroGroup = new THREE.Group();

  // 1. Organic Liver Mesh
  const liverMat = new THREE.MeshPhongMaterial({
    color: 0x2563eb,
    transparent: true,
    opacity: 0.5,
    shininess: 90,
    side: THREE.DoubleSide,
    wireframe: false
  });

  const liverGeo = new THREE.SphereGeometry(1.35, 48, 48);
  // Sculpt into organic liver lobe shape
  const posAttr = liverGeo.attributes.position;
  for (let i = 0; i < posAttr.count; i++) {
    let x = posAttr.getX(i);
    let y = posAttr.getY(i);
    let z = posAttr.getZ(i);

    // Asymmetric right & left lobes
    if (x > 0) {
      x *= 1.45;
      y *= 0.85;
    } else {
      x *= 0.95;
      y *= 0.75;
      z *= 0.85;
    }
    // Inferior notch
    if (y < -0.2 && x < 0.2 && x > -0.2) {
      z *= 0.6;
    }
    posAttr.setXYZ(i, x, y, z);
  }
  liverGeo.computeVertexNormals();

  const liverMesh = new THREE.Mesh(liverGeo, liverMat);
  heroGroup.add(liverMesh);

  // 2. Hologram Wireframe Overlay
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    wireframe: true,
    transparent: true,
    opacity: 0.22
  });
  const wireMesh = new THREE.Mesh(liverGeo.clone(), wireMat);
  wireMesh.scale.set(1.02, 1.02, 1.02);
  heroGroup.add(wireMesh);

  // 3. Portal Vein & Hepatic Vascular Tree
  const veinMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: false });
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.2, -1.2, -0.1),
    new THREE.Vector3(-0.1, -0.4, 0.1),
    new THREE.Vector3(0.3, 0.1, 0.2),
    new THREE.Vector3(0.8, 0.4, 0.1),
    new THREE.Vector3(1.1, 0.6, -0.1)
  ]);
  const veinGeo = new THREE.TubeGeometry(curve, 32, 0.06, 8, false);
  const veinMesh = new THREE.Mesh(veinGeo, veinMat);
  heroGroup.add(veinMesh);

  // Left branch
  const leftBranchCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.1, -0.4, 0.1),
    new THREE.Vector3(-0.4, 0.1, 0.1),
    new THREE.Vector3(-0.8, 0.3, -0.1)
  ]);
  const leftBranchGeo = new THREE.TubeGeometry(leftBranchCurve, 24, 0.045, 8, false);
  const leftBranchMesh = new THREE.Mesh(leftBranchGeo, veinMat);
  heroGroup.add(leftBranchMesh);

  // 4. Tumor Lesion Holographic Highlight (HCC / LR-5 Marker)
  const tumorGeo = new THREE.SphereGeometry(0.32, 24, 24);
  const tumorMat = new THREE.MeshStandardMaterial({
    color: 0xf43f5e,
    emissive: 0xe11d48,
    emissiveIntensity: 0.8,
    roughness: 0.3,
    transparent: true,
    opacity: 0.85
  });
  const tumorMesh = new THREE.Mesh(tumorGeo, tumorMat);
  tumorMesh.position.set(0.65, 0.2, 0.35);
  heroGroup.add(tumorMesh);

  // Tumor outer glow ring
  const ringGeo = new THREE.RingGeometry(0.38, 0.44, 32);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.position.copy(tumorMesh.position);
  ringMesh.rotation.x = Math.PI / 3;
  heroGroup.add(ringMesh);

  scene.add(heroGroup);

  // 5. Lighting Setup
  const ambientLight = new THREE.AmbientLight(0x1e1b4b, 0.8);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
  keyLight.position.set(4, 5, 4);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x2dd4bf, 0.8);
  rimLight.position.set(-4, -3, -4);
  scene.add(rimLight);

  // 6. Blood Flow Particles
  const bloodParticleCount = 45;
  const bloodGeo = new THREE.BufferGeometry();
  const bloodPos = new Float32Array(bloodParticleCount * 3);
  for (let i = 0; i < bloodParticleCount; i++) {
    const t = Math.random();
    const pt = curve.getPoint(t);
    bloodPos[i * 3] = pt.x;
    bloodPos[i * 3 + 1] = pt.y;
    bloodPos[i * 3 + 2] = pt.z;
  }
  bloodGeo.setAttribute('position', new THREE.BufferAttribute(bloodPos, 3));
  const bloodMat = new THREE.PointsMaterial({ color: 0x38bdf8, size: 0.05, transparent: true, opacity: 0.9 });
  const bloodParticles = new THREE.Points(bloodGeo, bloodMat);
  heroGroup.add(bloodParticles);

  // Interaction variables
  let targetRotX = 0, targetRotY = 0;
  let animId;
  let running = true;
  let _resizeHandler;

  function onMouseMove(e) {
    const rect = container.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    targetRotY = x * 0.8;
    targetRotX = y * 0.4;
  }

  window.addEventListener('mousemove', onMouseMove, { passive: true });

  function animate() {
    if (!running) return;
    animId = requestAnimationFrame(animate);

    // Smooth rotation lerp
    heroGroup.rotation.y += 0.005 + (targetRotY - heroGroup.rotation.y) * 0.05;
    heroGroup.rotation.x += (targetRotX - heroGroup.rotation.x) * 0.05;
    heroGroup.position.y = Math.sin(Date.now() * 0.0015) * 0.08;

    // Pulsing tumor marker
    const pulse = 1 + Math.sin(Date.now() * 0.004) * 0.12;
    tumorMesh.scale.set(pulse, pulse, pulse);
    ringMesh.scale.set(pulse * 1.1, pulse * 1.1, pulse * 1.1);

    renderer.render(scene, camera);
  }
  animate();

  _resizeHandler = Utils.debounce(() => {
    if (!container.isConnected) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }, 200);
  window.addEventListener('resize', _resizeHandler);

  _heroEngine = {
    destroy() {
      running = false;
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', _resizeHandler);
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    }
  };
}
