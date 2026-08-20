(() => {
  const body = document.body;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // Placeholder links are intentionally non-navigating until WordPress pages/contacts exist.
  $$('a[href="#"]').forEach(link => link.addEventListener('click', event => event.preventDefault()));

  // Fancybox: hero video opens as an inline modal. The 2GIS iframe remains accompanied by a direct fallback link.
  if (window.Fancybox) {
    window.Fancybox.bind('[data-fancybox]', {
      dragToClose: true,
      hideScrollbar: false,
      placeFocusBack: true,
      Toolbar: { display: { left: [], middle: [], right: ['close'] } }
    });
  }

  // Sticky chrome: use hysteresis instead of reacting to every tiny scroll delta.
  // This keeps the topbar stable and prevents modal scroll-lock from toggling it.
  const siteChrome = $('[data-site-chrome]');
  let lastChromeScrollY = window.scrollY;
  let chromeTicking = false;
  let chromeDownDistance = 0;
  let chromeUpDistance = 0;
  let chromeFrozen = false;

  const setChromeFrozen = frozen => {
    chromeFrozen = frozen;
    siteChrome?.classList.toggle('is-chrome-frozen', frozen);
    if (!frozen) {
      lastChromeScrollY = window.scrollY;
      chromeDownDistance = 0;
      chromeUpDistance = 0;
    }
  };

  const updateSiteChrome = () => {
    chromeTicking = false;
    if (!siteChrome || chromeFrozen || body.classList.contains('modal-open') || body.classList.contains('menu-open')) return;
    const y = Math.max(0, window.scrollY);
    const delta = y - lastChromeScrollY;
    siteChrome.classList.toggle('is-scrolled', y > 12);

    if (!matchMedia('(min-width: 921px)').matches) {
      siteChrome.classList.remove('is-topbar-hidden');
      lastChromeScrollY = y;
      return;
    }

    if (y < 64) {
      siteChrome.classList.remove('is-topbar-hidden');
      chromeDownDistance = 0;
      chromeUpDistance = 0;
    } else if (delta > 0) {
      chromeDownDistance += delta;
      chromeUpDistance = 0;
      if (y > 120 && chromeDownDistance >= 24) {
        siteChrome.classList.add('is-topbar-hidden');
        chromeDownDistance = 0;
      }
    } else if (delta < 0) {
      chromeUpDistance += -delta;
      chromeDownDistance = 0;
      if (chromeUpDistance >= 14) {
        siteChrome.classList.remove('is-topbar-hidden');
        chromeUpDistance = 0;
      }
    }

    lastChromeScrollY = y;
  };

  window.addEventListener('scroll', () => {
    if (chromeTicking) return;
    chromeTicking = true;
    requestAnimationFrame(updateSiteChrome);
  }, { passive: true });
  updateSiteChrome();

  // Mobile menu
  const menu = $('[data-mobile-menu]');
  const menuToggle = $('[data-menu-toggle]');
  const menuClose = $('[data-menu-close]');

  let menuScrollY = 0;
  let menuBodySnapshot = null;

  const lockMenuBody = () => {
    menuScrollY = window.scrollY;
    menuBodySnapshot = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow
    };
    body.style.position = 'fixed';
    body.style.top = `-${menuScrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    body.style.overflow = 'hidden';
  };

  const unlockMenuBody = () => {
    if (!menuBodySnapshot) return;
    const snapshot = menuBodySnapshot;
    body.style.position = snapshot.position || '';
    body.style.top = snapshot.top || '';
    body.style.left = snapshot.left || '';
    body.style.right = snapshot.right || '';
    body.style.width = snapshot.width || '';
    body.style.overflow = snapshot.overflow || '';

    const html = document.documentElement;
    const previousBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';
    window.scrollTo({ top: menuScrollY, left: 0, behavior: 'auto' });
    requestAnimationFrame(() => { html.style.scrollBehavior = previousBehavior; });
    menuBodySnapshot = null;
  };

  const openMenu = () => {
    if (!menu || !menuToggle) return;
    lockMenuBody();
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    body.classList.add('menu-open');
    requestAnimationFrame(() => menuClose?.focus({ preventScroll: true }));
  };

  const closeMenu = (returnFocus = true) => {
    if (!menu || !menuToggle) return;
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
    body.classList.remove('menu-open');
    unlockMenuBody();
    if (returnFocus) requestAnimationFrame(() => menuToggle.focus({ preventScroll: true }));
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
  const servicePrevButton = $('[data-service-prev]');
  const serviceNextButton = $('[data-service-next]');
  const serviceButtonsWrap = servicePrevButton?.closest('.slider-buttons');
  servicePrevButton?.addEventListener('click', () => scrollServices(-1));
  serviceNextButton?.addEventListener('click', () => scrollServices(1));


  // Desktop services slider is controlled by arrows only.
  // Touch devices keep the browser's native swipe behaviour.



  // Licenses and certificates slider.
  const credentialsTrack = $('[data-credentials-track]');
  const scrollCredentials = direction => {
    if (!credentialsTrack) return;
    const card = $('.document-card', credentialsTrack);
    const styles = card ? getComputedStyle(credentialsTrack) : null;
    const gap = styles ? parseFloat(styles.columnGap || styles.gap || 16) : 16;
    const amount = card ? card.getBoundingClientRect().width + gap : 320;
    credentialsTrack.scrollBy({ left: amount * direction, behavior: 'smooth' });
  };
  const credentialsPrevButton = $('[data-credentials-prev]');
  const credentialsNextButton = $('[data-credentials-next]');
  const credentialsButtonsWrap = credentialsPrevButton?.closest('.slider-buttons');
  credentialsPrevButton?.addEventListener('click', () => scrollCredentials(-1));
  credentialsNextButton?.addEventListener('click', () => scrollCredentials(1));

  const syncSliderControls = () => {
    const toggleWrap = (track, wrap) => {
      if (!track || !wrap) return;
      const hasOverflow = track.scrollWidth - track.clientWidth > 8;
      wrap.hidden = !hasOverflow;
    };
    toggleWrap(serviceTrack, serviceButtonsWrap);
    toggleWrap(credentialsTrack, credentialsButtonsWrap);
  };

  syncSliderControls();
  window.addEventListener('resize', syncSliderControls);
  if (window.ResizeObserver) {
    if (serviceTrack && serviceButtonsWrap) new ResizeObserver(syncSliderControls).observe(serviceTrack);
    if (credentialsTrack && credentialsButtonsWrap) new ResizeObserver(syncSliderControls).observe(credentialsTrack);
  }

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

  // Yandex reviews uses a fixed inner canvas on tablet widths. Scale it uniformly to the available column width.
  const yandexReviewsWidget = $('.yandex-reviews-widget');
  const yandexReviewsFrame = $('iframe', yandexReviewsWidget || document);
  const syncYandexReviewsWidget = () => {
    if (!yandexReviewsWidget || !yandexReviewsFrame) return;
    if (!matchMedia('(min-width: 621px) and (max-width: 1180px)').matches) {
      yandexReviewsWidget.style.removeProperty('--yandex-scale');
      yandexReviewsWidget.style.removeProperty('--yandex-scaled-height');
      return;
    }
    const baseWidth = 760;
    const baseHeight = 520;
    const availableWidth = yandexReviewsWidget.clientWidth;
    if (!availableWidth) return;
    const scale = availableWidth / baseWidth;
    yandexReviewsWidget.style.setProperty('--yandex-scale', String(scale));
    yandexReviewsWidget.style.setProperty('--yandex-scaled-height', `${Math.round(baseHeight * scale)}px`);
  };
  syncYandexReviewsWidget();
  yandexReviewsFrame?.addEventListener('load', syncYandexReviewsWidget);
  window.addEventListener('resize', syncYandexReviewsWidget);
  if (window.ResizeObserver && yandexReviewsWidget) {
    new ResizeObserver(syncYandexReviewsWidget).observe(yandexReviewsWidget);
  }

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
    if (!mapShell) return;
    mapShell.classList.add('is-active');
    mapActivate.setAttribute('aria-pressed', 'true');

    // The iframe has always remained interactive underneath the activation cover.
    // Focusing it after the cover disappears makes touch/keyboard activation more predictable.
    const iframe = $('iframe', mapShell);
    requestAnimationFrame(() => {
      try { iframe?.focus({ preventScroll: true }); } catch (_) { iframe?.focus(); }
    });
  });

  // Smooth internal anchors with a stable header offset.
  $$('a[href^="#"]:not([href="#"])').forEach(link => {
    link.addEventListener('click', event => {
      const hash = link.getAttribute('href');
      if (!hash || hash.length < 2) return;
      const target = document.querySelector(hash);
      if (!target) return;

      event.preventDefault();

      const performScroll = () => {
        const chromeHeight = siteChrome?.getBoundingClientRect().height || 0;
        const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - chromeHeight - 16);
        window.scrollTo({ top, behavior: 'smooth' });
        try { history.replaceState(null, '', hash); } catch (_) {}
      };

      if (menu?.classList.contains('is-open')) {
        closeMenu(false);
        requestAnimationFrame(() => requestAnimationFrame(performScroll));
      } else {
        performScroll();
      }
    });
  });

  // Russian phone mask. Placeholder stays visible while empty; Backspace removes the last entered digit even when the caret sits after a formatting character.
  const formatPhone = raw => {
    let digits = String(raw || '').replace(/\D/g, '');
    if (!digits) return '';
    if (digits[0] === '8') digits = `7${digits.slice(1)}`;
    else if (digits[0] !== '7') digits = `7${digits}`;
    digits = digits.slice(0, 11);

    const area = digits.slice(1, 4);
    const first = digits.slice(4, 7);
    const second = digits.slice(7, 9);
    const third = digits.slice(9, 11);
    let value = '+7';
    if (area.length) value += ` (${area}`;
    if (area.length === 3) value += ')';
    if (first) value += ` ${first}`;
    if (second) value += `-${second}`;
    if (third) value += `-${third}`;
    return value;
  };

  $$('[data-phone-mask]').forEach(input => {
    const digitsOnly = value => String(value || '').replace(/\D/g, '');
    const moveCaretToEnd = () => {
      requestAnimationFrame(() => {
        const pos = input.value.length;
        input.setSelectionRange(pos, pos);
      });
    };

    if (digitsOnly(input.value)) input.value = formatPhone(input.value);

    input.addEventListener('input', () => {
      const digits = digitsOnly(input.value);
      input.value = digits ? formatPhone(digits) : '';
      moveCaretToEnd();
    });

    input.addEventListener('paste', event => {
      event.preventDefault();
      const digits = digitsOnly(event.clipboardData?.getData('text') || '');
      input.value = digits ? formatPhone(digits) : '';
      moveCaretToEnd();
    });

    input.addEventListener('keydown', event => {
      if (event.key !== 'Backspace') return;
      const start = input.selectionStart ?? input.value.length;
      const end = input.selectionEnd ?? start;
      const digits = digitsOnly(input.value);
      if (!digits) return;

      // If there is a selection, let the browser remove it and then normalize on input.
      if (start !== end) return;

      event.preventDefault();
      const normalized = digits[0] === '7' ? digits.slice(1) : digits;
      const shortened = normalized.slice(0, -1);
      input.value = shortened ? formatPhone(`7${shortened}`) : '';
      moveCaretToEnd();
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
  const modalSuccess = $('[data-lead-success]');
  const modalSuccessClose = $('[data-success-close]');
  let lastFocused = null;
  let lockedScrollY = 0;

  let bodyLockSnapshot = null;

  const lockBody = () => {
    lockedScrollY = window.scrollY;
    setChromeFrozen(true);
    const scrollbarWidth = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
    const coarsePointer = matchMedia('(pointer: coarse)').matches;
    bodyLockSnapshot = {
      mode: coarsePointer ? 'fixed' : 'overflow',
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
      boxSizing: body.style.boxSizing
    };

    body.style.boxSizing = 'border-box';
    body.style.paddingRight = scrollbarWidth ? `${scrollbarWidth}px` : '';

    if (coarsePointer) {
      body.style.position = 'fixed';
      body.style.top = `-${lockedScrollY}px`;
      body.style.left = '0';
      body.style.right = '0';
      body.style.width = '100%';
    } else {
      body.style.overflow = 'hidden';
    }
    body.classList.add('modal-open');
  };

  const unlockBody = () => {
    const snapshot = bodyLockSnapshot || {};
    body.classList.remove('modal-open');
    body.style.position = snapshot.position || '';
    body.style.top = snapshot.top || '';
    body.style.left = snapshot.left || '';
    body.style.right = snapshot.right || '';
    body.style.width = snapshot.width || '';
    body.style.overflow = snapshot.overflow || '';
    body.style.paddingRight = snapshot.paddingRight || '';
    body.style.boxSizing = snapshot.boxSizing || '';

    if (snapshot.mode === 'fixed') {
      const html = document.documentElement;
      const previousScrollBehavior = html.style.scrollBehavior;
      html.style.scrollBehavior = 'auto';
      window.scrollTo({ top: lockedScrollY, left: 0, behavior: 'auto' });
      requestAnimationFrame(() => { html.style.scrollBehavior = previousScrollBehavior; });
    }

    bodyLockSnapshot = null;
    requestAnimationFrame(() => requestAnimationFrame(() => setChromeFrozen(false)));
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
    modalSuccess?.classList.remove('is-visible');
    modalSuccess?.setAttribute('aria-hidden', 'true');
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
    modalSuccess?.classList.remove('is-visible');
    modalSuccess?.setAttribute('aria-hidden', 'true');
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    unlockBody();
    if (lastFocused instanceof HTMLElement) lastFocused.focus({ preventScroll: true });
  };

  $$('[data-open-lead]').forEach(trigger => trigger.addEventListener('click', () => openLeadModal(trigger)));
  modalClose?.addEventListener('click', closeLeadModal);
  modalBackdrop?.addEventListener('click', closeLeadModal);
  modalSuccessClose?.addEventListener('click', closeLeadModal);

  const trapFocus = event => {
    if (event.key !== 'Tab' || !modal?.classList.contains('is-open') || !modalDialog) return;
    const focusRoot = modalSuccess?.classList.contains('is-visible') ? modalSuccess : modalDialog;
    const focusable = $$('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])', focusRoot).filter(el => el.offsetParent !== null);
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

  // Demo submit. On WordPress replace this handler with CF7/REST/CRM integration while preserving these UI states.
  $$('[data-lead-form]').forEach(form => {
    let inlineSuccessTimer = 0;
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

      if (form === modalForm) {
        modalSuccess?.classList.add('is-visible');
        modalSuccess?.setAttribute('aria-hidden', 'false');
        requestAnimationFrame(() => modalSuccessClose?.focus());
        return;
      }

      const inlineSuccess = $('.inline-success-overlay', form);
      if (!inlineSuccess) return;
      clearTimeout(inlineSuccessTimer);
      form.classList.add('is-success-inline');
      inlineSuccess.setAttribute('aria-hidden', 'false');
      requestAnimationFrame(() => inlineSuccess.classList.add('is-visible'));

      inlineSuccessTimer = window.setTimeout(() => {
        inlineSuccess.classList.remove('is-visible');
        form.classList.remove('is-success-inline');
        window.setTimeout(() => { inlineSuccess.setAttribute('aria-hidden', 'true'); }, 220);
        form.reset();
        hydrateTracking(form, {
          form_id: form.dataset.formId || '',
          form_name: form.dataset.formName || '',
          source_block: form.elements.namedItem('source_block')?.value || 'inline'
        });
      }, 2600);
    });
  });

  // Compact cookie consent banner. The preference is stored locally so the banner does not reappear on every visit.
  const cookieBanner = $('[data-cookie-banner]');
  const cookieAccept = $('[data-cookie-accept]');
  const cookieEssential = $('[data-cookie-essential]');
  const cookieKey = 'designDentCookieConsent';

  const hideCookieBanner = preference => {
    try { localStorage.setItem(cookieKey, preference); } catch (_) {}
    if (!cookieBanner) return;
    cookieBanner.classList.remove('is-visible');
    cookieBanner.setAttribute('aria-hidden', 'true');
  };

  if (cookieBanner) {
    let saved = '';
    try { saved = localStorage.getItem(cookieKey) || ''; } catch (_) {}
    if (!saved) {
      cookieBanner.setAttribute('aria-hidden', 'false');
      requestAnimationFrame(() => requestAnimationFrame(() => cookieBanner.classList.add('is-visible')));
    } else {
      cookieBanner.setAttribute('aria-hidden', 'true');
      cookieBanner.classList.remove('is-visible');
    }
  }
  cookieAccept?.addEventListener('click', () => hideCookieBanner('all'));
  cookieEssential?.addEventListener('click', () => hideCookieBanner('essential'));

})();
