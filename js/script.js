document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initScrollEffects();
  initStatsCounter();
  initContactForm();
  initTeamAnimation();
  initQuoteRotator();
}); 

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
        }, index * 100); // efeito cascata
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  members.forEach(member => observer.observe(member));

}

  function initQuoteRotator() {
  const quotes = [
    { text: "Só o melhor é bom o suficiente.", author: "Ole Kirk Christiansen" },
    { text: "A criatividade é a inteligência se divertindo.", author: "Albert Einstein" },
    { text: "Sozinhos vamos mais rápido, juntos vamos mais longe.", author: "Provérbio africano" },
    { text: "O sucesso é a soma de pequenos esforços repetidos todos os dias.", author: "Robert Collier" }
  ];

  const textEl = document.getElementById('quote-text');
  const authorEl = document.getElementById('quote-author');
  if (!textEl || !authorEl) return;

  const typingSpeed = 60;   // velocidade digitando (ms por letra)
  const deletingSpeed = 30; // velocidade apagando (ms por letra)
  const pauseAfterTyping = 2500; // tempo parado depois de escrever
  const pauseAfterDeleting = 400; // tempo parado depois de apagar

  let quoteIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function tick() {
    const current = quotes[quoteIndex];
    const fullText = `"${current.text}"`;

    if (!isDeleting) {
      // digitando
      charIndex++;
      textEl.textContent = fullText.substring(0, charIndex);
      authorEl.textContent = charIndex === fullText.length ? `— ${current.author}` : '';

      if (charIndex === fullText.length) {
        isDeleting = true;
        setTimeout(tick, pauseAfterTyping);
        return;
      }
      setTimeout(tick, typingSpeed);
    } else {
      // apagando
      charIndex--;
      textEl.textContent = fullText.substring(0, charIndex);
      authorEl.textContent = '';

      if (charIndex === 0) {
        isDeleting = false;
        quoteIndex = (quoteIndex + 1) % quotes.length;
        setTimeout(tick, pauseAfterDeleting);
        return;
      }
      setTimeout(tick, deletingSpeed);
    }
  }

  tick();
}