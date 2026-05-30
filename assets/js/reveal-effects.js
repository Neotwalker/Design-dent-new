
(()=>{
  const d=document, root=d.documentElement;
  const progress=d.querySelector('.progress');
  const prefersReduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

  function splitTitles(){
    d.querySelectorAll('.split-title').forEach(title=>{
      if(title.dataset.split) return;
      title.dataset.split='true';
      title.innerHTML = title.textContent.trim().split(/\s+/).map((w,i)=>
        `<span class="word"><span style="transition-delay:${Math.min(i*38,520)}ms">${w}</span></span>`
      ).join(' ');
    });
  }

  function revealItems(){
    const items=[...d.querySelectorAll('.reveal,.split-title')];
    if(!('IntersectionObserver' in window) || prefersReduced){
      items.forEach(x=>x.classList.add('in-view'));
      return;
    }
    const io=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, {rootMargin:'0px 0px -8% 0px', threshold:.12});
    items.forEach(x=>io.observe(x));
  }

  function onScroll(){
    const max=root.scrollHeight-innerHeight;
    const p=max>0?scrollY/max*100:0;
    if(progress) progress.style.width=p+'%';
  }

  splitTitles();
  revealItems();
  onScroll();
  addEventListener('scroll', onScroll, {passive:true});
})();
