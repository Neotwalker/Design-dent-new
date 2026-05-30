
(()=>{
  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scene = document.querySelector('[data-hero-scene]');
  if(!scene || prefersReduced || innerWidth < 768) return;

  const layers = [...scene.querySelectorAll('[data-depth]')];
  const photo = scene.querySelector('.hero-photo');

  const move = (e)=>{
    const r = scene.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;

    layers.forEach(layer => {
      const depth = parseFloat(layer.dataset.depth || '0');
      const tx = x * depth * 36;
      const ty = y * depth * 24;
      layer.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    });

    if(photo){
      const rx = y * -6;
      const ry = x * 7;
      photo.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) translate3d(${x*6}px, ${y*4}px, 0)`;
    }
  };

  const reset = ()=>{
    layers.forEach(layer => layer.style.transform = 'translate3d(0,0,0)');
    if(photo) photo.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translate3d(0,0,0)';
  };

  scene.addEventListener('pointermove', move);
  scene.addEventListener('pointerleave', reset);
})();
