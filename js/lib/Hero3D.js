let _heroEngine = null;

function initHero3D() {
  const container = document.getElementById('hero-3d');
  if (!container || !window.THREE) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const group = new THREE.Group();

  const mainMat = new THREE.MeshPhongMaterial({ color: 0x2563eb, transparent: true, opacity: 0.55, shininess: 80, side: THREE.DoubleSide });
  const mainGeo = new THREE.SphereGeometry(1.2, 32, 32);
  mainGeo.scale(1.3, 0.9, 1.1);
  const mainMesh = new THREE.Mesh(mainGeo, mainMat);
  group.add(mainMesh);

  const wireMat = new THREE.MeshBasicMaterial({ color: 0x60a5fa, wireframe: true, transparent: true, opacity: 0.25 });
  const wireMesh = new THREE.Mesh(mainGeo.clone(), wireMat);
  wireMesh.scale.set(1.02, 1.02, 1.02);
  group.add(wireMesh);

  const lobeGeo = new THREE.SphereGeometry(0.6, 24, 24);
  const lobeR = new THREE.Mesh(lobeGeo, mainMat.clone());
  lobeR.position.set(0.8, 0.3, 0.2);
  lobeR.material.opacity = 0.45;
  group.add(lobeR);

  const lobeL = new THREE.Mesh(lobeGeo.clone(), mainMat.clone());
  lobeL.position.set(-0.85, 0.2, 0.15);
  lobeL.scale.set(0.85, 0.85, 0.85);
  lobeL.material.opacity = 0.4;
  group.add(lobeL);

  scene.add(group);

  const ambientLight = new THREE.AmbientLight(0x4c1d95, 0.6);
  scene.add(ambientLight);
  const dirLight = new THREE.DirectionalLight(0x7c3aed, 1.2);
  dirLight.position.set(3, 4, 5);
  scene.add(dirLight);
  const backLight = new THREE.DirectionalLight(0x06b6d4, 0.5);
  backLight.position.set(-3, -2, -4);
  scene.add(backLight);

  const particleCount = 60;
  const pGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = Utils.randomBetween(-3, 3);
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const pMat = new THREE.PointsMaterial({ color: 0x60a5fa, size: 0.04, transparent: true, opacity: 0.7 });
  const threeParticles = new THREE.Points(pGeo, pMat);
  scene.add(threeParticles);

  let animId;
  let running = true;
  let _resizeHandler;

  function animate() {
    if (!running) return;
    animId = requestAnimationFrame(animate);
    group.rotation.y += 0.004;
    group.rotation.x = Math.sin(Date.now() * 0.0005) * 0.1;
    threeParticles.rotation.y += 0.001;
    threeParticles.rotation.x += 0.0005;
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
      window.removeEventListener('resize', _resizeHandler);
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    }
  };
}
