const $ = (selector) => document.querySelector(selector);

$('#quote-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  $('.form-result', event.currentTarget).textContent = 'Thanks — our shipping team will be in touch shortly.';
  event.currentTarget.reset();
});

$('#tracking-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const number = $('#tracking-number').value.trim().toUpperCase();
  $('#tracking-result').textContent = number ? `${number} is in transit. Last scanned at the regional hub.` : 'Enter a tracking number.';
});
