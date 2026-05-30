
(()=>{
  const d=document, body=d.body;
  const glow=d.querySelector('.cursor-glow');
  const burger=d.querySelector('.burger');
  const nav=d.querySelector('.nav');
  const prefersReduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

  function moveGlow(e){
    if(!glow || prefersReduced) return;
    glow.animate({left:e.clientX+'px', top:e.clientY+'px'}, {
      duration: 650,
      fill: 'forwards',
      easing: 'cubic-bezier(.16,1,.3,1)'
    });
  }

  function magnetic(e){
    if(prefersReduced || innerWidth < 1024) return;
    const t=e.currentTarget;
    const r=t.getBoundingClientRect();
    const x=e.clientX-r.left-r.width/2;
    const y=e.clientY-r.top-r.height/2;
    t.style.transform=`translate(${x*.14}px, ${y*.18}px)`;
  }

  function resetMag(e){ e.currentTarget.style.transform=''; }

  burger?.addEventListener('click',()=>{
    const isOpen=body.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', String(isOpen));
  });

  nav?.addEventListener('click', e=>{
    if(e.target.closest('a')){
      body.classList.remove('menu-open');
      burger?.setAttribute('aria-expanded','false');
    }
  });

  d.querySelectorAll('.magnetic,.btn').forEach(el=>{
    el.addEventListener('pointermove', magnetic);
    el.addEventListener('pointerleave', resetMag);
  });

  addEventListener('pointermove', moveGlow, {passive:true});
  addEventListener('keydown', e=>{
    if(e.key==='Escape'){
      body.classList.remove('menu-open');
      burger?.setAttribute('aria-expanded','false');
    }
  });
})();
