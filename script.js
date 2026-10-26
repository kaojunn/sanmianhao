(() => {
  'use strict';
  const root = document.documentElement;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const items = [...document.querySelectorAll('.reveal')];
  const hero = document.querySelector('.hero');
  let observer;
  let frame = 0;
  const showAll = () => items.forEach(el => el.classList.add('visible'));
  function setupReveal() {
    observer?.disconnect();
    if (motion.matches || !('IntersectionObserver' in window)) {
      root.classList.remove('motion-ready');
      showAll();
      return;
    }
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {threshold: 0, rootMargin: '0px 0px -36px 0px'});
    root.classList.add('motion-ready');
    items.forEach(el => observer.observe(el));
  }
  function paint() {
    frame = 0;
    const max = Math.max(1, root.scrollHeight - innerHeight);
    root.style.setProperty('--progress', Math.max(0, Math.min(1, scrollY / max)).toFixed(4));
    const heroBottom = hero.getBoundingClientRect().bottom;
    const shift = !motion.matches && heroBottom > 0 ? Math.min(23, scrollY * 0.035) : 0;
    root.style.setProperty('--hero-shift', `${shift.toFixed(1)}px`);
  }
  function requestPaint() { if (!frame) frame = requestAnimationFrame(paint); }
  setupReveal();
  paint();
  addEventListener('scroll', requestPaint, {passive:true});
  addEventListener('resize', requestPaint, {passive:true});
  addEventListener('load', requestPaint, {once:true});
  if (motion.addEventListener) motion.addEventListener('change', () => {setupReveal();requestPaint();});
})();
