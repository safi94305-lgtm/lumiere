(() => {
  const root = document.documentElement;
  const emailInput = document.querySelector('#waitlist-email');
  const message = document.querySelector('#form-message');

  function readPreference(key, fallback) {
    try {
      return localStorage.getItem(key) || fallback;
    } catch {
      return fallback;
    }
  }

  function savePreference(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      // The current page still works when browser storage is unavailable.
    }
  }

  function setLanguage(language) {
    const isArabic = language === 'ar';
    root.lang = isArabic ? 'ar' : 'en';
    root.dir = isArabic ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-en][data-ar]').forEach((element) => {
      element.innerHTML = element.dataset[isArabic ? 'ar' : 'en'];
    });
    if (emailInput) emailInput.placeholder = emailInput.dataset[isArabic ? 'placeholderAr' : 'placeholderEn'];
    document.querySelectorAll('.language-toggle').forEach((button) => {
      button.textContent = isArabic ? 'English' : 'عربي';
      button.setAttribute('aria-label', isArabic ? 'Switch language to English' : 'التبديل إلى العربية');
    });
    document.title = isArabic ? 'SquadFolio — أثبت مهاراتك' : 'SquadFolio — Make your skills count';
    savePreference('squadfolio-language', language);
  }

  function setTheme(theme) {
    root.dataset.theme = theme;
    const dark = theme === 'dark';
    document.querySelectorAll('.theme-toggle').forEach((button) => {
      button.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    });
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#111112' : '#ffffff');
    savePreference('squadfolio-theme', theme);
  }

  setLanguage(readPreference('squadfolio-language', 'en'));
  setTheme(readPreference('squadfolio-theme', 'light'));

  document.querySelectorAll('.language-toggle').forEach((button) => {
    button.addEventListener('click', () => setLanguage(root.lang === 'en' ? 'ar' : 'en'));
  });
  document.querySelectorAll('.theme-toggle').forEach((button) => {
    button.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
  });

  if (window.jQuery) {
    const roleCopy = {
      frontend: {
        en: ['Front-end developer', 'Build the product experience in code and collaborate through reviewed changes.'],
        ar: ['مطور الواجهة الأمامية', 'ابنِ تجربة المنتج بالكود وتعاون عبر تغييرات تخضع للمراجعة.']
      },
      backend: {
        en: ['Back-end developer', 'Design reliable services and APIs that support the product experience.'],
        ar: ['مطور الواجهة الخلفية', 'صمم خدمات وواجهات برمجية موثوقة تدعم تجربة المنتج.']
      },
      design: {
        en: ['UI/UX designer', 'Map user journeys, interaction patterns, and clear handoffs for the squad.'],
        ar: ['مصمم واجهات وتجربة', 'ارسم رحلات الاستخدام وأنماط التفاعل وسلّم تصاميم واضحة للفريق.']
      },
      qa: {
        en: ['QA engineer', 'Test key product journeys, find edge cases, and report reproducible issues.'],
        ar: ['مهندس ضمان الجودة', 'اختبر مسارات المنتج واكتشف الحالات الطرفية ووثق المشاكل القابلة لإعادة الإنتاج.']
      },
      reviewer: {
        en: ['Product / task reviewer', 'Clarify the brief, validate task outcomes, and give practical product feedback.'],
        ar: ['مراجع المنتج والمهام', 'وضح موجز المشروع وتحقق من نتائج المهام وقدم ملاحظات عملية على المنتج.']
      }
    };

    window.jQuery('.role-row').on('click', function () {
      const role = roleCopy[this.dataset.role];
      if (!role) return;
      window.jQuery('.role-row').removeClass('is-selected').attr('aria-pressed', 'false');
      window.jQuery(this).addClass('is-selected').attr('aria-pressed', 'true');
      const title = document.querySelector('#role-detail-title');
      const copy = document.querySelector('#role-detail-copy');
      const localizedRole = role[root.lang === 'ar' ? 'ar' : 'en'];
      title.dataset.en = role.en[0];
      title.dataset.ar = role.ar[0];
      copy.dataset.en = role.en[1];
      copy.dataset.ar = role.ar[1];
      title.textContent = localizedRole[0];
      copy.textContent = localizedRole[1];
    });

    window.jQuery('#faq-list').on('click', '.faq-question', function () {
      const $button = window.jQuery(this);
      const $item = $button.closest('.faq-item');
      const $answer = $item.find('.faq-answer');
      const isOpen = $item.hasClass('is-open');
      $button.attr('aria-expanded', String(!isOpen));
      $button.find('.faq-icon').text(isOpen ? '+' : '−');
      $item.toggleClass('is-open', !isOpen);
      if (isOpen) $answer.stop(true, true).slideUp(220, () => $answer.attr('hidden', true));
      else $answer.removeAttr('hidden').stop(true, true).hide().slideDown(220);
    });

    window.jQuery('#waitlist').on('submit', function (event) {
      event.preventDefault();
      const email = emailInput.value.trim();
      const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      message.classList.remove('error');
      if (!validEmail) {
        message.classList.add('error');
        message.textContent = root.lang === 'ar' ? 'أدخل بريداً إلكترونياً صحيحاً للمتابعة.' : 'Enter a valid email address to continue.';
        emailInput.focus();
        return;
      }
      try {
        const signups = JSON.parse(localStorage.getItem('squadfolio-waitlist') || '[]');
        if (!signups.includes(email)) signups.push(email);
        localStorage.setItem('squadfolio-waitlist', JSON.stringify(signups));
        message.textContent = root.lang === 'ar' ? 'شكراً لك. حُفظ اهتمامك على هذا الجهاز.' : 'Thanks. Your interest is saved on this device.';
        this.reset();
      } catch {
        message.classList.add('error');
        message.textContent = root.lang === 'ar' ? 'تعذر الحفظ في هذا المتصفح. حاول مرة أخرى.' : 'This browser could not save your interest. Please try again.';
      }
    });
  }

  if (window.gsap && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.from('.hero-content > *', { opacity: 0, y: 15, duration: 0.7, stagger: 0.1, ease: 'power2.out', delay: 0.1 });
    gsap.from('.hero-mascot', { opacity: 0, y: 34, duration: 0.9, ease: 'power2.out', delay: 0.3 });
    gsap.from('.chat-bubble', { opacity: 0, y: 12, duration: 0.5, stagger: 0.14, ease: 'power2.out', delay: 0.55 });
  }
})();
