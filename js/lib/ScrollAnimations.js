function initScrollAnimations() {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray('.animate-in').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' } }
    );
  });

  const heroTitle = document.querySelector('.hero-glow');
  if (heroTitle) {
    gsap.fromTo(heroTitle, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: 'power3.out' });
  }

  gsap.utils.toArray('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target, duration: 2, ease: 'power1.out', delay: 0.5,
      scrollTrigger: { trigger: el, start: 'top 85%' },
      onUpdate() { el.textContent = Utils.formatNumber(Math.round(obj.val)); }
    });
  });
}
