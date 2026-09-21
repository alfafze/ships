const form = document.querySelector('#standard-track-form');
const input = document.querySelector('#standard-track-number');
const result = document.querySelector('#tracking-result');
const status = document.querySelector('#tracking-status');

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const number = input.value.trim().toUpperCase();
  if (!number) return;
  status.textContent = 'In transit';
  result.hidden = false;
  result.innerHTML = `<strong>${number}</strong> is in transit. Last scanned 12 minutes ago at the Chicago regional hub.`;
});
