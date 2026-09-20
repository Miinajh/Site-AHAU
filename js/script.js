document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initScrollEffects();
  initStatsCounter();
  initContactForm();
  initTeamAnimation();
  initThemeToggle();
  initCountdown();
}); 

function initThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  const root = document.documentElement;
  const icon = toggle.querySelector('i');
  const STORAGE_KEY = 'ahau-theme';

  function applyTheme(theme) {
    const isDark = theme === 'dark';
    root.setAttribute('data-theme', theme);
    toggle.setAttribute('aria-pressed', isDark);
    toggle.setAttribute('aria-label', isDark ? 'Desativar modo noturno' : 'Ativar modo noturno');
    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
  }

  let saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
  applyTheme(saved === 'dark' ? 'dark' : 'light');

  toggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
  });
}

function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navList = document.querySelector('.nav-list');

  if (menuToggle && navList) {
    menuToggle.addEventListener('click', () => {
      navList.classList.toggle('active');
      const isActive = navList.classList.contains('active');
      menuToggle.setAttribute('aria-expanded', isActive);
    });

    document.addEventListener('click', (e) => {
      if (!menuToggle.contains(e.target) && !navList.contains(e.target)) {
        navList.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

function initScrollEffects() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');

  const observerOptions = {
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const selector = target.getAttribute('data-count-selector');
        const finalValue = document.querySelectorAll(selector).length;
        animateCounter(target, finalValue);
        observer.unobserve(target);
      }
    });
  }, observerOptions);

  statNumbers.forEach(stat => observer.observe(stat));
}

function animateCounter(element, target) {
  let current = 0;
  const increment = target / 50;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.ceil(current);
    }
  }, 30);
}

function initContactForm() {
  const form = document.getElementById('contact-form');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Mensagem enviada com sucesso!');
      form.reset();
    });
  }
}

function initTeamAnimation() {
  const members = document.querySelectorAll('.team-member');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 100); // efeito cascat
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  members.forEach(member => observer.observe(member));

}


  function initCountdown() {
  const box = document.getElementById('countdown');
  if (!box) return;

  const target = new Date(box.dataset.date).getTime();
  if (Number.isNaN(target)) {
    console.warn('Contagem regressiva: data inválida em data-date.');
    return;
  }

  const finished = document.getElementById('countdown-finished');
  const days = document.getElementById('cd-days');
  const hours = document.getElementById('cd-hours');
  const minutes = document.getElementById('cd-minutes');
  const seconds = document.getElementById('cd-seconds');
  const pad = (n) => String(n).padStart(2, '0');

  function update() {
    const total = Math.max(0, Math.floor((target - Date.now()) / 1000));

    days.textContent = pad(Math.floor(total / 86400));
    hours.textContent = pad(Math.floor((total % 86400) / 3600));
    minutes.textContent = pad(Math.floor((total % 3600) / 60));
    seconds.textContent = pad(total % 60);

    if (total === 0) {
      if (finished) finished.hidden = false;
      clearInterval(timer);
    }
  }

  const timer = setInterval(update, 1000);
  update();
}


  function initPartnerForm() {
  const modal = document.getElementById('partner-modal');
  const openBtn = document.getElementById('open-partner-form');
  const closeBtn = document.getElementById('partner-modal-close');
  const form = document.getElementById('partner-form');
  if (!modal || !openBtn || !form) return;

  const status = document.getElementById('partner-status');
  const button = document.getElementById('partner-submit');
  const ENDPOINT = 'https://formsubmit.co/ajax/filhosdosol010@gmail.com';

  // abrir e fechar a janela
  openBtn.addEventListener('click', () => {
    status.textContent = '';
    status.className = 'form-status';
    modal.showModal();
  });

  closeBtn.addEventListener('click', () => modal.close());

  // clicar no fundo escuro, fora da caixa, também fecha
  modal.addEventListener('click', (e) => {
    const r = modal.getBoundingClientRect();
    const inside =
      e.clientX >= r.left && e.clientX <= r.right &&
      e.clientY >= r.top && e.clientY <= r.bottom;
    if (!inside) modal.close();
  });

  // enviar o formulário
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = new FormData(form);
    data.append('_subject', 'Novo contato de parceria - Site AHAU');
    data.append('_captcha', 'false');
    data.append('_template', 'table');

    button.disabled = true;
    status.className = 'form-status';
    status.textContent = 'Enviando...';

    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data
      });
      const result = await response.json();

      if (!response.ok || String(result.success) === 'false') {
        throw new Error(result.message || 'Erro no envio');
      }

      status.textContent = 'Mensagem enviada! Obrigado, entraremos em contato em breve. ☀';
      status.classList.add('success');
      form.reset();
      setTimeout(() => modal.close(), 2500);
    } catch (err) {
      status.textContent = 'Não foi possível enviar agora. Escreva para filhosdosol010@gmail.com ou chame a gente no Instagram.';
      status.classList.add('error');
    } finally {
      button.disabled = false;
    }
  });
}