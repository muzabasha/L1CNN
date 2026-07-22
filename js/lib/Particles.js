let _particleEngine = null;

function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let streams = [];
  let animId;
  let _resizeHandler;
  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;
  const PARTICLE_COUNT = window.innerWidth < 768 ? 40 : 80;
  const STREAM_COUNT = window.innerWidth < 768 ? 3 : 6;
  const COLORS = ['rgba(59,130,246,', 'rgba(45,212,191,', 'rgba(167,139,250,', 'rgba(56,189,248,'];
  let running = true;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Utils.randomBetween(1.2, 3.2),
      vx: Utils.randomBetween(-0.35, 0.35),
      vy: Utils.randomBetween(-0.35, 0.35),
      pulseSpeed: Utils.randomBetween(0.01, 0.03),
      pulsePhase: Math.random() * Math.PI * 2,
      opacity: Utils.randomBetween(0.2, 0.65),
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    };
  }

  function createStream() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      length: Utils.randomBetween(80, 200),
      speed: Utils.randomBetween(1, 2.5),
      angle: Utils.randomBetween(-Math.PI / 4, Math.PI / 4),
      color: 'rgba(56,189,248,0.3)'
    };
  }

  function init() {
    resize();
    particles = [];
    streams = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(createParticle());
    for (let i = 0; i < STREAM_COUNT; i++) streams.push(createStream());
  }

  function onMouseMove(e) {
    targetMouseX = (e.clientX - window.innerWidth / 2) * 0.05;
    targetMouseY = (e.clientY - window.innerHeight / 2) * 0.05;
  }

  window.addEventListener('mousemove', onMouseMove, { passive: true });

  function draw() {
    if (!running) return;
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Data Streams
    for (let s = 0; s < streams.length; s++) {
      const st = streams[s];
      st.x += Math.cos(st.angle) * st.speed;
      st.y += Math.sin(st.angle) * st.speed;
      if (st.x > canvas.width + 100 || st.y > canvas.height + 100) {
        st.x = -100;
        st.y = Math.random() * canvas.height;
      }
      const grad = ctx.createLinearGradient(
        st.x, st.y,
        st.x - Math.cos(st.angle) * st.length,
        st.y - Math.sin(st.angle) * st.length
      );
      grad.addColorStop(0, 'rgba(56,189,248,0.25)');
      grad.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.moveTo(st.x, st.y);
      ctx.lineTo(st.x - Math.cos(st.angle) * st.length, st.y - Math.sin(st.angle) * st.length);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Draw Neural Particles & Node Web
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.pulsePhase += p.pulseSpeed;

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      const currentOpacity = p.opacity + Math.sin(p.pulsePhase) * 0.15;
      const renderX = p.x + mouseX;
      const renderY = p.y + mouseY;

      ctx.beginPath();
      ctx.arc(renderX, renderY, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.max(0.05, currentOpacity) + ')';
      ctx.fill();

      // Connect nearby nodes
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = (p.x + mouseX) - (p2.x + mouseX);
        const dy = (p.y + mouseY) - (p2.y + mouseY);
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          ctx.beginPath();
          ctx.moveTo(renderX, renderY);
          ctx.lineTo(p2.x + mouseX, p2.y + mouseY);
          ctx.strokeStyle = p.color + ((1 - dist / 140) * 0.2) + ')';
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    animId = requestAnimationFrame(draw);
  }

  init();
  draw();
  _resizeHandler = Utils.debounce(resize, 300);
  window.addEventListener('resize', _resizeHandler);

  _particleEngine = {
    destroy() {
      running = false;
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', _resizeHandler);
    }
  };
}
