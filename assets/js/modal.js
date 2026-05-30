
(()=>{
  const d=document, body=d.body;
  const modal=d.querySelector('.modal');
  function openModal(){
    modal?.classList.add('active');
    body.classList.add('modal-open');
    modal?.setAttribute('aria-hidden','false');
  }
  function closeModal(){
    modal?.classList.remove('active');
    body.classList.remove('modal-open');
    modal?.setAttribute('aria-hidden','true');
  }
  d.querySelectorAll('.modal-open').forEach(b=>b.addEventListener('click',openModal));
  d.querySelectorAll('.modal-close').forEach(b=>b.addEventListener('click',closeModal));
  modal?.addEventListener('click',e=>{ if(e.target===modal) closeModal(); });
  addEventListener('keydown',e=>{ if(e.key==='Escape') closeModal(); });
  d.querySelectorAll('form').forEach(f=>f.addEventListener('submit',e=>e.preventDefault()));
})();
