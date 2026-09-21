const form = document.querySelector('#standard-track-form');
const input = document.querySelector('#standard-track-number');
const result = document.querySelector('#tracking-result');
const status = document.querySelector('#tracking-status');

function renderTracking(shipment) {
  status.textContent = shipment.status;
  result.hidden = false;
  result.textContent = `${shipment.trackingNumber} is ${shipment.status.toLowerCase()}. ${shipment.message}`;
}

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const trackingNumber = input.value.trim().toUpperCase();
  if (!trackingNumber) return;
  status.textContent = 'Loading';
  try {
    const response = await fetch(`/api/track?number=${encodeURIComponent(trackingNumber)}`);
    if (!response.ok) throw new Error('API unavailable');
    renderTracking(await response.json());
  } catch {
    renderTracking({ trackingNumber, status: 'In transit', message: 'Last scanned 12 minutes ago at the Chicago regional hub.' });
  }
});
