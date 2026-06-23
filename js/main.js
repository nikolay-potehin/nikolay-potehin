(() => {
  const themeStorageKey = 'theme-preference';
  const root = document.documentElement;
  const systemDarkMedia = window.matchMedia('(prefers-color-scheme: dark)');

  const getResolvedTheme = () => {
    if (root.dataset.theme === 'light' || root.dataset.theme === 'dark') {
      return root.dataset.theme;
    }
    return systemDarkMedia.matches ? 'dark' : 'light';
  };

  const syncThemeToggles = () => {
    const resolvedTheme = getResolvedTheme();
    const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark';

    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      if (!(button instanceof HTMLButtonElement)) return;
      button.dataset.themeState = resolvedTheme;
      button.setAttribute('aria-label', `Switch to ${nextTheme} theme`);
      button.setAttribute('title', `Switch to ${nextTheme} theme`);
    });
  };

  const applyTheme = (theme, persist = true) => {
    if (theme === 'light' || theme === 'dark') {
      root.dataset.theme = theme;
      if (persist) window.localStorage.setItem(themeStorageKey, theme);
    } else {
      root.removeAttribute('data-theme');
      if (persist) window.localStorage.removeItem(themeStorageKey);
    }
    syncThemeToggles();
  };

  const storedTheme = window.localStorage.getItem(themeStorageKey);
  if (storedTheme !== 'light' && storedTheme !== 'dark') {
    root.removeAttribute('data-theme');
  }

  document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
    if (!(button instanceof HTMLButtonElement)) return;
    button.addEventListener('click', () => {
      const nextTheme = getResolvedTheme() === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
    });
  });

  systemDarkMedia.addEventListener('change', () => {
    if (!window.localStorage.getItem(themeStorageKey)) {
      syncThemeToggles();
    }
  });

  syncThemeToggles();

  /* ===== Contact modal ===== */
  const contactModal = document.querySelector('[data-contact-modal]');
  const contactCloseButton = contactModal?.querySelector('.contact-modal-close[data-contact-close]');
  const contactOpenButtons = document.querySelectorAll('[data-contact-open]');
  const contactLinks = contactModal?.querySelectorAll('[data-contact-link]') ?? [];
  const emailCopyButton = contactModal?.querySelector('[data-contact-email-copy]');
  const emailCopyLabel = contactModal?.querySelector('[data-contact-email-label]');
  const emailCopyStatus = contactModal?.querySelector('[data-contact-email-status]');
  const headerEmailCopyButtons = document.querySelectorAll('[data-header-email-copy]');
  let emailCopyTimeout;
  let headerEmailCopyTimeout;
  let previousOverflow = '';
  let lastTrigger = null;

  const fallbackCopy = (text) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', 'true');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, text.length);
    const copyCommand = document['exec' + 'Command'];
    const copied = typeof copyCommand === 'function' ? copyCommand.call(document, 'copy') : false;
    textarea.remove();
    return copied;
  };

  const copyEmailText = async (email) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(email).catch(() => fallbackCopy(email));
    } else {
      fallbackCopy(email);
    }
  };

  const resetEmailCopyFeedback = () => {
    if (emailCopyLabel instanceof HTMLElement) emailCopyLabel.textContent = 'Email';
    if (emailCopyStatus instanceof HTMLElement) emailCopyStatus.textContent = '';
  };

  const syncContactTriggers = (expanded) => {
    contactOpenButtons.forEach((button) => {
      if (button instanceof HTMLElement) {
        button.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      }
    });
  };

  const openContactModal = (trigger) => {
    if (!(contactModal instanceof HTMLElement)) return;
    previousOverflow = document.body.style.overflow;
    document.body.classList.add('is-scroll-locked');
    document.body.style.overflow = 'hidden';
    contactModal.hidden = false;
    lastTrigger = trigger instanceof HTMLElement ? trigger : null;
    syncContactTriggers(true);
    if (contactCloseButton instanceof HTMLButtonElement) {
      requestAnimationFrame(() => contactCloseButton.focus());
      window.setTimeout(() => contactCloseButton.focus(), 0);
    }
  };

  const closeContactModal = (returnFocus = true) => {
    if (!(contactModal instanceof HTMLElement)) return;
    syncContactTriggers(false);
    resetEmailCopyFeedback();
    contactModal.hidden = true;
    document.body.classList.remove('is-scroll-locked');
    document.body.style.overflow = previousOverflow;
    if (returnFocus && lastTrigger instanceof HTMLElement) {
      lastTrigger.focus();
    }
  };

  contactOpenButtons.forEach((button) => {
    button.addEventListener('click', () => openContactModal(button));
  });

  if (contactModal instanceof HTMLElement) {
    contactModal.addEventListener('click', (event) => {
      if (event.target instanceof HTMLElement && event.target.closest('[data-contact-close]')) {
        closeContactModal();
      }
    });
  }

  contactLinks.forEach((link) => {
    link.addEventListener('click', () => closeContactModal(false));
  });

  if (emailCopyButton instanceof HTMLButtonElement) {
    emailCopyButton.addEventListener('click', async () => {
      const email = emailCopyButton.dataset.contactEmail ?? 'homecomp2018@gmail.com';
      await copyEmailText(email);
      if (emailCopyLabel instanceof HTMLElement) emailCopyLabel.textContent = 'Email copied';
      if (emailCopyStatus instanceof HTMLElement) emailCopyStatus.textContent = 'Email copied';
      window.clearTimeout(emailCopyTimeout);
      emailCopyTimeout = window.setTimeout(resetEmailCopyFeedback, 1800);
    });
  }

  headerEmailCopyButtons.forEach((button) => {
    if (!(button instanceof HTMLButtonElement)) return;
    button.addEventListener('click', async () => {
      const email = button.dataset.copyEmail ?? 'homecomp2018@gmail.com';
      const status = button.querySelector('.header-email-status');
      await copyEmailText(email);
      button.dataset.copyState = 'copied';
      button.dataset.copyTooltip = 'Email copied';
      button.setAttribute('aria-label', 'Copy email address');
      if (status instanceof HTMLElement) status.textContent = 'Email copied';
      window.clearTimeout(headerEmailCopyTimeout);
      headerEmailCopyTimeout = window.setTimeout(() => {
        button.dataset.copyState = '';
        button.dataset.copyTooltip = 'Copy email';
        button.setAttribute('aria-label', 'Copy email address');
        if (status instanceof HTMLElement) status.textContent = '';
      }, 1800);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && contactModal instanceof HTMLElement && !contactModal.hidden) {
      closeContactModal();
    }
  });
})();