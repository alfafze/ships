const $ = (selector, scope = document) => scope.querySelector(selector);

// Mobile navigation
const navToggle = $('.nav-toggle');
const navMenu = $('#site-menu');
navToggle?.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  navToggle.innerHTML = `<i class="fa-solid fa-${open ? 'xmark' : 'bars'}"></i>`;
});
navMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
    if (navToggle) navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  });
});

// Theme preference
const themeToggle = $('.theme-toggle');
const savedTheme = localStorage.getItem('ships-theme');
if (savedTheme) {
  document.documentElement.dataset.theme = savedTheme;
}
const updateThemeButton = () => {
  const dark = document.documentElement.dataset.theme === 'dark';
  if (themeToggle) {
    themeToggle.innerHTML = `<i class="fa-solid fa-${dark ? 'sun' : 'moon'}"></i>`;
    themeToggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  }
};
updateThemeButton();
themeToggle?.addEventListener('click', () => {
  const dark = document.documentElement.dataset.theme === 'dark';
  document.documentElement.dataset.theme = dark ? 'light' : 'dark';
  localStorage.setItem('ships-theme', dark ? 'light' : 'dark');
  updateThemeButton();
});

// Reveal sections
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 5, 4) * 70}ms`;
  revealObserver.observe(element);
});

// Tracking form interaction
$('#tracking-form')?.addEventListener('submit', event => {
  event.preventDefault();
  const input = $('#tracking-number');
  const result = $('#tracking-result');
  const value = input.value.trim();

  if (!value) {
    result.innerHTML = 'Please enter a tracking number.';
    return;
  }

  result.innerHTML = `Tracking <strong>${value}</strong> — package is currently <strong>in transit</strong>.`;
});

// Quote calculator
$('#quote-form')?.addEventListener('submit', event => {
  event.preventDefault();
  const from = $('#from')?.value || 'New York';
  const to = $('#to')?.value || 'Los Angeles';
  const packageType = $('#package-type')?.value || 'small';
  const prices = { small: 12.5, medium: 18.75, large: 29.0 };
  const amount = prices[packageType]?.toFixed(2) ?? '12.50';
  $('#quote-result').textContent = `Estimated delivery from ${from} to ${to}: $${amount}`;
});

// FAQ accordion
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
  const button = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');

  if (item.classList.contains('active')) {
    answer.style.maxHeight = `${answer.scrollHeight}px`;
  }

  button?.addEventListener('click', () => {
    const isOpen = item.classList.contains('active');

    faqItems.forEach(other => {
      other.classList.remove('active');
      other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      other.querySelector('.faq-answer').style.maxHeight = null;
    });

    if (!isOpen) {
      item.classList.add('active');
      button.setAttribute('aria-expanded', 'true');
      answer.style.maxHeight = `${answer.scrollHeight}px`;
    }
  });
});

// Swiper testimonial carousel
if (window.Swiper) {
  new Swiper('.testimonials-swiper', {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 3,
      }
    }
  });
}
