(() => {
  const body = document.body;
  const menu = document.querySelector('[data-mobile-menu]');
  const toggle = document.querySelector('[data-menu-toggle]');
  const close = document.querySelector('[data-menu-close]');

  const openMenu = () => {
    if (!menu || !toggle) return;
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    body.classList.add('menu-open');
    close?.focus();
  };
  const closeMenu = () => {
    if (!menu || !toggle) return;
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    body.classList.remove('menu-open');
    toggle.focus();
  };

  toggle?.addEventListener('click', openMenu);
  close?.addEventListener('click', closeMenu);
  menu?.addEventListener('click', e => { if (e.target === menu) closeMenu(); });
  menu?.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu?.classList.contains('is-open')) closeMenu(); });

  const track = document.querySelector('[data-service-track]');
  const scrollServices = dir => {
    if (!track) return;
    const card = track.querySelector('.service-card');
    const amount = card ? card.getBoundingClientRect().width + 14 : 320;
    track.scrollBy({ left: amount * dir, behavior: 'smooth' });
  };
  document.querySelector('[data-service-prev]')?.addEventListener('click', () => scrollServices(-1));
  document.querySelector('[data-service-next]')?.addEventListener('click', () => scrollServices(1));

  const range = document.querySelector('[data-before-range]');
  const layer = document.querySelector('[data-after-layer]');
  const line = document.querySelector('[data-before-line]');
  const updateBeforeAfter = value => {
    if (layer) layer.style.clipPath = `inset(0 0 0 ${value}%)`;
    if (line) line.style.left = `${value}%`;
  };
  range?.addEventListener('input', e => updateBeforeAfter(e.target.value));
  updateBeforeAfter(range?.value || 50);

  document.querySelectorAll('.faq__item button').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq__item');
      const willOpen = !item.classList.contains('is-open');
      item.classList.toggle('is-open', willOpen);
      btn.setAttribute('aria-expanded', String(willOpen));
    });
  });

  const reviewTabs = document.querySelectorAll('[data-review-tab]');
  const reviewCards = document.querySelectorAll('[data-review-source]');
  reviewTabs.forEach(tab => tab.addEventListener('click', () => {
    const source = tab.dataset.reviewTab;
    reviewTabs.forEach(t => {
      const active = t === tab;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', String(active));
    });
    reviewCards.forEach(card => card.classList.toggle('is-hidden', source !== 'all' && card.dataset.reviewSource !== source));
  }));

  const form = document.querySelector('[data-demo-form]');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const success = form.querySelector('.form-success');
    success.hidden = false;
    form.reset();
  });
})();
