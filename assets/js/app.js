(() => {
  const body = document.body;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // Placeholder links are intentionally non-navigating until WordPress pages/contacts exist.
  $$('a[href="#"]').forEach(link => link.addEventListener('click', event => event.preventDefault()));

  // Mobile menu
  const menu = $('[data-mobile-menu]');
  const menuToggle = $('[data-menu-toggle]');
  const menuClose = $('[data-menu-close]');

  const openMenu = () => {
    if (!menu || !menuToggle) return;
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    body.classList.add('menu-open');
    menuClose?.focus();
  };

  const closeMenu = (returnFocus = true) => {
    if (!menu || !menuToggle) return;
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
    body.classList.remove('menu-open');
    if (returnFocus) menuToggle.focus();
  };

  menuToggle?.addEventListener('click', openMenu);
  menuClose?.addEventListener('click', () => closeMenu());
  menu?.addEventListener('click', event => {
    if (event.target === menu) closeMenu();
  });
  $$('.mobile-menu__nav a[href^="#"]', menu || document).forEach(link => link.addEventListener('click', () => closeMenu(false)));

  // Services horizontal carousel
  const serviceTrack = $('[data-service-track]');
  const scrollServices = direction => {
    if (!serviceTrack) return;
    const card = $('.service-card', serviceTrack);
    const amount = card ? card.getBoundingClientRect().width + 14 : 320;
    serviceTrack.scrollBy({ left: amount * direction, behavior: 'smooth' });
  };
  $('[data-service-prev]')?.addEventListener('click', () => scrollServices(-1));
  $('[data-service-next]')?.addEventListener('click', () => scrollServices(1));

  // Before / after
  const beforeRange = $('[data-before-range]');
  const afterLayer = $('[data-after-layer]');
  const beforeLine = $('[data-before-line]');
  const updateBeforeAfter = value => {
    const safeValue = Math.min(95, Math.max(5, Number(value) || 50));
    if (afterLayer) afterLayer.style.clipPath = `inset(0 0 0 ${safeValue}%)`;
    if (beforeLine) beforeLine.style.left = `${safeValue}%`;
  };
  beforeRange?.addEventListener('input', event => updateBeforeAfter(event.target.value));
  updateBeforeAfter(beforeRange?.value || 50);

  // FAQ
  $$('.faq__item button').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq__item');
      if (!item) return;
      const willOpen = !item.classList.contains('is-open');
      item.classList.toggle('is-open', willOpen);
      button.setAttribute('aria-expanded', String(willOpen));
    });
  });

  // Review source filters. Official widget containers can keep the same data-review-source hooks in WordPress.
  const reviewTabs = $$('[data-review-tab]');
  const reviewCards = $$('[data-review-source]');
  reviewTabs.forEach(tab => tab.addEventListener('click', () => {
    const source = tab.dataset.reviewTab;
    reviewTabs.forEach(item => {
      const active = item === tab;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-selected', String(active));
    });
    reviewCards.forEach(card => card.classList.toggle('is-hidden', source !== 'all' && card.dataset.reviewSource !== source));
  }));

  // Scroll-to-top. Bottom offset is intentionally isolated so a future chat widget can reserve the corner.
  const scrollTopButton = $('[data-scroll-top]');
  const updateScrollTop = () => {
    if (!scrollTopButton) return;
    scrollTopButton.classList.toggle('is-visible', window.scrollY > Math.max(520, window.innerHeight * 0.75));
  };
  window.addEventListener('scroll', updateScrollTop, { passive: true });
  updateScrollTop();
  scrollTopButton?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Map: coarse pointers must opt in, preventing iframe gestures from hijacking page scroll.
  const mapShell = $('[data-map-shell]');
  const mapActivate = $('[data-map-activate]');
  mapActivate?.addEventListener('click', () => {
    mapShell?.classList.add('is-active');
    mapActivate.setAttribute('aria-pressed', 'true');
  });
  document.addEventListener('click', event => {
    if (!mapShell?.classList.contains('is-active')) return;
    if (!mapShell.contains(event.target) && matchMedia('(pointer: coarse)').matches) mapShell.classList.remove('is-active');
  });

  // Phone mask: +_ (___) ___-__-__. For Russian numbers, an initial 8 is normalized to +7.
  const formatPhone = raw => {
    let digits = String(raw || '').replace(/\D/g, '').slice(0, 11);
    if (!digits) return '';
    if (digits[0] === '8' && digits.length > 1) digits = `7${digits.slice(1)}`;
    const country = digits[0] || '';
    const area = digits.slice(1, 4);
    const first = digits.slice(4, 7);
    const second = digits.slice(7, 9);
    const third = digits.slice(9, 11);
    let value = `+${country}`;
    if (area.length || digits.length > 1) value += ` (${area}`;
    if (area.length === 3) value += ')';
    if (first) value += ` ${first}`;
    if (second) value += `-${second}`;
    if (third) value += `-${third}`;
    return value;
  };

  $$('[data-phone-mask]').forEach(input => {
    input.addEventListener('input', () => {
      const formatted = formatPhone(input.value);
      input.value = formatted;
      input.setSelectionRange(input.value.length, input.value.length);
    });
    input.addEventListener('paste', event => {
      event.preventDefault();
      input.value = formatPhone(event.clipboardData?.getData('text') || '');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
  });

  // Lead tracking fields shared by inline and modal forms; ready to map to CF7/Flamingo/CRM on WordPress.
  const urlParams = new URLSearchParams(location.search);
  const trackingValues = {
    page_url: location.href,
    page_title: document.title,
    referrer: document.referrer,
    utm_source: urlParams.get('utm_source') || '',
    utm_medium: urlParams.get('utm_medium') || '',
    utm_campaign: urlParams.get('utm_campaign') || '',
    utm_content: urlParams.get('utm_content') || '',
    utm_term: urlParams.get('utm_term') || ''
  };

  const setField = (form, name, value) => {
    const field = form?.elements?.namedItem(name);
    if (field && 'value' in field) field.value = value ?? '';
  };

  const hydrateTracking = (form, values = {}) => {
    if (!form) return;
    Object.entries(trackingValues).forEach(([key, value]) => setField(form, key, value));
    Object.entries(values).forEach(([key, value]) => setField(form, key, value));
  };

  $$('[data-lead-form]').forEach(form => {
    hydrateTracking(form, {
      form_id: form.dataset.formId || '',
      form_name: form.dataset.formName || '',
      source_block: form.elements.namedItem('source_block')?.value || 'inline'
    });
  });

  // Modal form and focus / viewport handling
  const modal = $('[data-lead-modal]');
  const modalDialog = $('.lead-modal__dialog', modal || document);
  const modalForm = $('.lead-modal__form', modal || document);
  const modalClose = $('[data-modal-close]');
  const modalBackdrop = $('[data-modal-backdrop]');
  let lastFocused = null;
  let lockedScrollY = 0;

  let bodyLockSnapshot = null;

  const lockBody = () => {
    lockedScrollY = window.scrollY;
    const scrollbarWidth = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
    bodyLockSnapshot = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      paddingRight: body.style.paddingRight,
      boxSizing: body.style.boxSizing
    };
    body.style.boxSizing = 'border-box';
    body.style.position = 'fixed';
    body.style.top = `-${lockedScrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    body.style.paddingRight = scrollbarWidth ? `${scrollbarWidth}px` : '';
    body.classList.add('modal-open');
  };

  const unlockBody = () => {
    body.classList.remove('modal-open');
    const snapshot = bodyLockSnapshot || {};
    body.style.position = snapshot.position || '';
    body.style.top = snapshot.top || '';
    body.style.left = snapshot.left || '';
    body.style.right = snapshot.right || '';
    body.style.width = snapshot.width || '';
    body.style.paddingRight = snapshot.paddingRight || '';
    body.style.boxSizing = snapshot.boxSizing || '';

    const html = document.documentElement;
    const previousScrollBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';
    window.scrollTo({ top: lockedScrollY, left: 0, behavior: 'auto' });
    requestAnimationFrame(() => { html.style.scrollBehavior = previousScrollBehavior; });
    bodyLockSnapshot = null;
  };

  const openLeadModal = trigger => {
    if (!modal || !modalForm) return;
    if (menu?.classList.contains('is-open')) closeMenu(false);
    lastFocused = trigger || document.activeElement;
    const ctaText = trigger?.textContent?.replace(/\s+/g, ' ').trim() || '';
    const source = trigger?.dataset.source || 'unknown';
    const formName = trigger?.dataset.formName || 'Модальная форма';
    const doctor = trigger?.dataset.doctor || '';
    const service = trigger?.dataset.service || '';

    modalForm.reset();
    $('.form-success', modalForm)?.setAttribute('hidden', '');
    hydrateTracking(modalForm, {
      form_id: 'modal_lead',
      form_name: formName,
      source_block: source,
      cta_text: ctaText,
      doctor
    });
    if (service && modalForm.elements.service) modalForm.elements.service.value = service;

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    lockBody();
    requestAnimationFrame(() => modalForm.elements.name?.focus());
  };

  const closeLeadModal = () => {
    if (!modal?.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    unlockBody();
    if (lastFocused instanceof HTMLElement) lastFocused.focus({ preventScroll: true });
  };

  $$('[data-open-lead]').forEach(trigger => trigger.addEventListener('click', () => openLeadModal(trigger)));
  modalClose?.addEventListener('click', closeLeadModal);
  modalBackdrop?.addEventListener('click', closeLeadModal);

  const trapFocus = event => {
    if (event.key !== 'Tab' || !modal?.classList.contains('is-open') || !modalDialog) return;
    const focusable = $$('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])', modalDialog).filter(el => el.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      if (modal?.classList.contains('is-open')) closeLeadModal();
      else if (menu?.classList.contains('is-open')) closeMenu();
    }
    trapFocus(event);
  });

  // Demo submit. On WordPress replace this handler with CF7/REST/CRM integration while preserving fields.
  $$('[data-lead-form]').forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      hydrateTracking(form);
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const digits = String(form.elements.phone?.value || '').replace(/\D/g, '');
      if (digits.length < 11) {
        form.elements.phone?.setCustomValidity('Введите номер телефона полностью');
        form.reportValidity();
        form.elements.phone?.setCustomValidity('');
        return;
      }
      const success = $('.form-success', form);
      if (success) success.hidden = false;
      // Keep the values visible in the prototype so the user can inspect the completed form state.
    });
  });
})();
