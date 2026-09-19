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
navMenu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navMenu.classList.remove('open');
  navToggle?.setAttribute('aria-expanded', 'false');
  if (navToggle) navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
}));

// Theme preference with local persistence
const themeToggle = $('.theme-toggle');
const savedTheme = localStorage.getItem('ships-theme');
if (savedTheme) document.documentElement.dataset.theme = savedTheme;
const updateThemeButton = () => {
  const dark = document.documentElement.dataset.theme === 'dark';
  if (!themeToggle) return;
  themeToggle.innerHTML = `<i class="fa-solid fa-${dark ? 'sun' : 'moon'}"></i>`;
  themeToggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
};
updateThemeButton();
themeToggle?.addEventListener('click', () => {
  const dark = document.documentElement.dataset.theme === 'dark';
  document.documentElement.dataset.theme = dark ? 'light' : 'dark';
  localStorage.setItem('ships-theme', dark ? 'light' : 'dark');
  updateThemeButton();
});

// Reveal sections only when they enter the viewport.
const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
}), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 80}ms`;
  observer.observe(element);
});

// Demo tracking interaction; replace with a real tracking API call.
$('#tracking-form')?.addEventListener('submit', event => {
  event.preventDefault();
  const input = $('#tracking-number');
  const result = $('#tracking-result');
  result.innerHTML = `Tracking <strong>${input.value.trim()}</strong> — package is currently <strong>in transit</strong>.`;
});

// Demo quote calculator; replace values with server-side rate calculation.
$('#quote-form')?.addEventListener('submit', event => {
  event.preventDefault();
  const size = $('#package-type').value;
  const prices = { small: 12.50, medium: 18.75, large: 29.00 };
  const amount = prices[size].toFixed(2);
  $('#quote-result').textContent = `Estimated delivery from ${$('#from').value} to ${$('#to').value}: $${amount}`;
});

// Optional Swiper setup for future service/testimonial slides.
if (window.Swiper && document.querySelector('.swiper')) {
  new Swiper('.swiper', { effect: 'coverflow', grabCursor: true, centeredSlides: true, slidesPerView: 'auto', coverflowEffect: { rotate: 30, stretch: 0, depth: 100, modifier: 1, slideShadows: true }, pagination: { el: '.swiper-pagination' } });
}
