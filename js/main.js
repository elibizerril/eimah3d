(function () {
  'use strict';

  var root = document.documentElement;
  var THEME_KEY = 'eimah-theme';
  var WHATSAPP = '5585996253954';
  var EMAIL = 'eimah3d@gmail.com';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ------------------------------------------------------------------ */
  /* Tema claro/escuro                                                   */
  /* ------------------------------------------------------------------ */

  function currentTheme() {
    return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function syncThemeControls(theme) {
    var isDark = theme === 'dark';
    document.querySelectorAll('[data-theme-toggle]').forEach(function (button) {
      var label = button.querySelector('[data-theme-label]');
      button.setAttribute('aria-pressed', String(isDark));
      button.setAttribute('aria-label', isDark ? 'Ativar modo claro' : 'Ativar modo escuro');
      button.setAttribute('title', isDark ? 'Ativar modo claro' : 'Ativar modo escuro');
      if (label) {
        label.textContent = isDark ? 'Modo claro' : 'Modo escuro';
      }
    });
  }

  function setTheme(theme, persist) {
    root.setAttribute('data-theme', theme);
    if (persist) {
      try {
        localStorage.setItem(THEME_KEY, theme);
      } catch (error) {
        /* armazenamento indisponível: segue sem persistir */
      }
    }
    syncThemeControls(theme);
  }

  syncThemeControls(currentTheme());

  document.querySelectorAll('[data-theme-toggle]').forEach(function (button) {
    button.addEventListener('click', function () {
      setTheme(currentTheme() === 'dark' ? 'light' : 'dark', true);
    });
  });

  /* ------------------------------------------------------------------ */
  /* Menu mobile                                                         */
  /* ------------------------------------------------------------------ */

  var navToggle = document.querySelector('[data-nav-toggle]');
  var nav = document.querySelector('[data-nav]');

  function closeNav() {
    if (!nav || !navToggle) {
      return;
    }
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menu');
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    });

    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) {
        closeNav();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        closeNav();
        navToggle.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) {
        closeNav();
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* Carrossel                                                           */
  /* ------------------------------------------------------------------ */

  document.querySelectorAll('[data-carousel]').forEach(function (carousel) {
    var track = carousel.querySelector('[data-carousel-track]');
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.slide'));
    var prev = carousel.querySelector('[data-carousel-prev]');
    var next = carousel.querySelector('[data-carousel-next]');
    var dotsBox = carousel.querySelector('[data-carousel-dots]');
    var index = 0;
    var timer = null;
    var paused = false;

    if (!track || slides.length < 2) {
      return;
    }

    var dots = slides.map(function (_, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Ir para o slide ' + (i + 1));
      dot.setAttribute('aria-current', i === 0 ? 'true' : 'false');
      dot.addEventListener('click', function () {
        goTo(i);
      });
      if (dotsBox) {
        dotsBox.appendChild(dot);
      }
      return dot;
    });

    function render() {
      track.style.transform = 'translateX(-' + index * 100 + '%)';
      slides.forEach(function (slide, i) {
        slide.setAttribute('aria-hidden', i === index ? 'false' : 'true');
        slide.querySelectorAll('a, button').forEach(function (el) {
          if (i === index) {
            el.removeAttribute('tabindex');
          } else {
            el.setAttribute('tabindex', '-1');
          }
        });
      });
      dots.forEach(function (dot, i) {
        dot.setAttribute('aria-current', i === index ? 'true' : 'false');
      });
    }

    function goTo(target) {
      index = (target + slides.length) % slides.length;
      render();
      restartAutoplay();
    }

    function startAutoplay() {
      if (reduceMotion.matches || timer) {
        return;
      }
      timer = window.setInterval(function () {
        if (!paused && !document.hidden) {
          index = (index + 1) % slides.length;
          render();
        }
      }, 6000);
    }

    function stopAutoplay() {
      window.clearInterval(timer);
      timer = null;
    }

    function restartAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    function pause() {
      paused = true;
    }

    function resume() {
      paused = false;
    }

    prev.addEventListener('click', function () {
      goTo(index - 1);
    });

    next.addEventListener('click', function () {
      goTo(index + 1);
    });

    carousel.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goTo(index - 1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        goTo(index + 1);
      }
    });

    carousel.addEventListener('mouseenter', pause);
    carousel.addEventListener('mouseleave', resume);
    carousel.addEventListener('focusin', pause);
    carousel.addEventListener('focusout', function (event) {
      if (!carousel.contains(event.relatedTarget)) {
        resume();
      }
    });

    var touchX = null;
    carousel.addEventListener('touchstart', function (event) {
      touchX = event.changedTouches[0].clientX;
    }, { passive: true });

    carousel.addEventListener('touchend', function (event) {
      if (touchX === null) {
        return;
      }
      var delta = event.changedTouches[0].clientX - touchX;
      touchX = null;
      if (Math.abs(delta) > 45) {
        goTo(delta < 0 ? index + 1 : index - 1);
      }
    }, { passive: true });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        pause();
      } else {
        resume();
      }
    });

    render();
    startAutoplay();
  });

  /* ------------------------------------------------------------------ */
  /* Formulários                                                         */
  /* ------------------------------------------------------------------ */

  function showStatus(form, message, type) {
    var status = form.querySelector('[data-form-status]');
    if (!status) {
      return;
    }
    status.textContent = message;
    status.classList.remove('is-error', 'is-success');
    status.classList.add('is-visible', type);
  }

  function value(form, name) {
    var field = form.elements[name];
    return field && typeof field.value === 'string' ? field.value.trim() : '';
  }

  var fileInput = document.querySelector('[data-file-input]');
  var fileList = document.querySelector('[data-file-list]');

  if (fileInput && fileList) {
    fileInput.addEventListener('change', function () {
      fileList.innerHTML = '';
      Array.prototype.forEach.call(fileInput.files, function (file) {
        var item = document.createElement('li');
        item.textContent = file.name + ' (' + Math.max(1, Math.round(file.size / 1024)) + ' KB)';
        fileList.appendChild(item);
      });
    });
  }

  var contactForm = document.querySelector('[data-contact-form]');
  if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        showStatus(contactForm, 'Preencha os campos obrigatórios para continuar.', 'is-error');
        return;
      }

      var subject = 'Contato pelo site — ' + value(contactForm, 'assunto');
      var body = [
        'Nome: ' + value(contactForm, 'nome'),
        'E-mail: ' + value(contactForm, 'email'),
        '',
        value(contactForm, 'mensagem')
      ].join('\n');

      window.location.href = 'mailto:' + EMAIL +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      showStatus(contactForm, 'Abrindo seu aplicativo de e-mail para enviar a mensagem. Se nada acontecer, escreva direto para ' + EMAIL + '.', 'is-success');
    });
  }

  var orderForm = document.querySelector('[data-order-form]');
  if (orderForm) {
    orderForm.addEventListener('submit', function (event) {
      event.preventDefault();

      if (!orderForm.checkValidity()) {
        orderForm.reportValidity();
        showStatus(orderForm, 'Preencha os campos obrigatórios para continuar.', 'is-error');
        return;
      }

      var files = fileInput ? Array.prototype.map.call(fileInput.files, function (file) {
        return file.name;
      }) : [];

      var lines = [
        'Olá, Eimah 3D! Quero fazer um pedido especial.',
        '',
        'Nome: ' + value(orderForm, 'nome'),
        'Contato: ' + value(orderForm, 'contato'),
        'Tipo de peça: ' + value(orderForm, 'tipo'),
        'Quantidade: ' + value(orderForm, 'quantidade'),
        'Material: ' + value(orderForm, 'material'),
        'Prazo desejado: ' + (value(orderForm, 'prazo') || 'a combinar'),
        '',
        'Descrição do objeto:',
        value(orderForm, 'descricao')
      ];

      if (files.length) {
        lines.push('', 'Arquivos para anexar na conversa: ' + files.join(', '));
      }

      window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');

      showStatus(orderForm, 'Abrimos o WhatsApp com o resumo do pedido. Anexe os arquivos na conversa para concluir o envio.', 'is-success');
    });
  }
})();
