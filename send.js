const form = document.querySelector('#sending-form');
const result = document.querySelector('#sending-result');

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const button = form.querySelector('button[type="submit"]');
  const payload = Object.fromEntries(new FormData(form));
  button.disabled = true;
  button.textContent = 'Creating…';
  try {
    const response = await fetch('/api/shipments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!response.ok) throw new Error('API unavailable');
    const shipment = await response.json();
    result.hidden = false;
    result.textContent = `Shipment ${shipment.trackingNumber} created. Estimated delivery: ${shipment.estimatedDelivery}.`;
    form.reset();
  } catch {
    result.hidden = false;
    result.textContent = 'The form is valid, but the shipment service is not connected yet. Connect POST /api/shipments to create labels.';
  } finally {
    button.disabled = false;
    button.innerHTML = 'Create shipment <span aria-hidden="true">→</span>';
  }
});
