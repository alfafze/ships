const heroTrackForm = document.querySelector('#hero-track-form');
const heroTrackInput = document.querySelector('#hero-track-number');
const heroTrackResult = document.querySelector('#hero-track-result');

heroTrackForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = heroTrackInput.value.trim().toUpperCase();

  if (!value) {
    heroTrackResult.textContent = 'Please enter a tracking number.';
    return;
  }

  heroTrackResult.textContent = `${value} is in transit. Last scanned at the regional hub.`;
  heroTrackForm.reset();
});

const trackingForm = document.querySelector('#tracking-form');
const trackingInput = document.querySelector('#tracking-number');
const trackingResult = document.querySelector('#tracking-result');

trackingForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = trackingInput.value.trim().toUpperCase();

  if (!value) {
    trackingResult.textContent = 'Please enter a valid tracking number.';
    return;
  }

  trackingResult.textContent = `${value} is on schedule and due for delivery soon.`;
  trackingForm.reset();
});

const quoteForm = document.querySelector('#quote-form');
const quoteResult = quoteForm?.querySelector('.form-result');

quoteForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  quoteResult.textContent = 'Thanks — our shipping team will send a quote shortly.';
  quoteForm.reset();
});

const chips = document.querySelectorAll('.chip');
chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    const value = chip.dataset.value;
    const selected = chip.classList.toggle('active');
    chip.textContent = selected ? `${value} selected` : value;
    chip.style.borderColor = selected ? '#102f26' : '#dce5df';
  });
});
