const $ = (s, c=document) => c.querySelector(s);
const $$ = (s, c=document) => [...c.querySelectorAll(s)];

// Scroll progress
const progress = $('.progress');
function updateProgress(){
  const h = document.documentElement;
  const p = h.scrollTop / (h.scrollHeight - h.clientHeight) * 100;
  if(progress) progress.style.width = `${p}%`;
}
window.addEventListener('scroll', updateProgress, {passive:true}); updateProgress();

// Mobile menu
const burger = $('.burger'); const nav = $('.nav');
burger?.addEventListener('click', () => nav?.classList.toggle('active'));
$$('.nav a').forEach(a => a.addEventListener('click', () => nav?.classList.remove('active')));

// Split heading animation
$$('.split-title').forEach(title => {
  const text = title.textContent.trim();
  title.textContent = '';
  [...text].forEach((ch, i) => {
    const span = document.createElement('span');
    span.className = 'char';
    span.style.setProperty('--i', i);
    span.innerHTML = ch === ' ' ? '&nbsp;' : ch;
    title.appendChild(span);
  });
});

// Reveal on scroll
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){ entry.target.classList.add('visible'); io.unobserve(entry.target); }
  });
}, {threshold:.16});
$$('.reveal, [data-animate]').forEach(el => io.observe(el));

// Magnetic buttons
$$('.magnetic').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    el.style.transform = `translate(${(e.clientX-r.left-r.width/2)*.12}px, ${(e.clientY-r.top-r.height/2)*.12}px)`;
  });
  el.addEventListener('mouseleave', () => el.style.transform = '');
});

// Cursor glow
const glow = $('.cursor-glow');
window.addEventListener('pointermove', e => {
  if(glow){ glow.style.transform = `translate(${e.clientX-170}px, ${e.clientY-170}px)`; }
}, {passive:true});

// Modal
const modal = $('.modal');
$$('.modal-open').forEach(btn => btn.addEventListener('click', () => modal?.classList.add('active')));
$('.modal-close')?.addEventListener('click', () => modal?.classList.remove('active'));
modal?.addEventListener('click', e => { if(e.target === modal) modal.classList.remove('active'); });
document.addEventListener('keydown', e => { if(e.key === 'Escape') modal?.classList.remove('active'); });

// Tiny parallax for cards
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  $$('.tooth-card').forEach((card, i) => card.style.translate = `0 ${Math.sin(y/260+i)*10}px`);
}, {passive:true});
