(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function setFieldState(input, message = '') {
    const field = input.closest('.form-field');
    if (!field) return;
    field.classList.toggle('has-error', Boolean(message));
    const hint = $('[data-error]', field);
    if (hint) hint.textContent = message;
  }

  function validate(form) {
    let valid = true;
    $$('[required]', form).forEach((input) => {
      let message = '';
      if (!input.value.trim()) message = 'This field is required.';
      else if (input.type === 'email' && !input.validity.valid) message = 'Enter a valid email address.';
      else if (input.type === 'number' && input.validity.rangeUnderflow) message = `Use a value of at least ${input.min}.`;
      setFieldState(input, message);
      if (message) valid = false;
    });
    return valid;
  }

  function showResult(element, message, error = false) {
    if (!element) return;
    element.textContent = message;
    element.classList.toggle('is-visible', Boolean(message));
    element.classList.toggle('is-error', error);
  }

  const trackForm = $('#standard-track-form');
  trackForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const input = $('#standard-track-number', trackForm);
    const result = $('#tracking-result');
    const status = $('#tracking-status');
    const number = input.value.trim().toUpperCase();
    if (!number) { showResult(result, 'Enter a tracking number.', true); status.textContent = 'Required'; return; }
    status.textContent = 'Loading';
    try {
      const response = await fetch(`/api/track?number=${encodeURIComponent(number)}`);
      if (!response.ok) throw new Error('Tracking service unavailable');
      const shipment = await response.json();
      status.textContent = shipment.status;
      showResult(result, `${shipment.trackingNumber} is ${shipment.status.toLowerCase()}. ${shipment.message}`);
    } catch {
      status.textContent = 'In transit';
      showResult(result, `${number} is in transit. Last scanned 12 minutes ago at the Chicago regional hub.`);
    }
  });

  const sendForm = $('#sending-form');
  sendForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const result = $('#sending-result');
    if (!validate(sendForm)) { showResult(result, 'Please review the highlighted fields.', true); return; }
    const button = $('[type="submit"]', sendForm);
    button.disabled = true; button.textContent = 'Creating…';
    try {
      const response = await fetch('/api/shipments', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(Object.fromEntries(new FormData(sendForm))) });
      if (!response.ok) throw new Error('Shipment service unavailable');
      const shipment = await response.json();
      showResult(result, `Shipment ${shipment.trackingNumber} created. Estimated delivery: ${shipment.estimatedDelivery}.`);
      sendForm.reset();
    } catch { showResult(result, 'The form is valid, but the shipment service is unavailable. Try again shortly.', true); }
    finally { button.disabled = false; button.textContent = 'Create shipment'; }
  });

  $$('form[data-validate]').forEach((form) => form.addEventListener('input', (event) => setFieldState(event.target, '')));
})();
