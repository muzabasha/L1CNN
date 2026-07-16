let _particleEngine = null;

function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;
  let _resizeHandler;
  const PARTICLE_COUNT = window.innerWidth < 768 ? 50 : 100;
  const COLORS = ['rgba(59,130,246,', 'rgba(34,211,238,', 'rgba(139,92,246,'];
  let running = true;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Utils.randomBetween(1, 3),
      vx: Utils.randomBetween(-0.4, 0.4),
      vy: Utils.randomBetween(-0.4, 0.4),
      opacity: Utils.randomBetween(0.2, 0.6),
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    };
  }

  function init() {
    resize();
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(createParticle());
  }

  function draw() {
    if (!running) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.opacity + ')';
      ctx.fill();
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = p.color + ((1 - dist / 150) * 0.25) + ')';
          ctx.lineWidth = 0.5;
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
      window.removeEventListener('resize', _resizeHandler);
    }
  };
}
