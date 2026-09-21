// Vercel/Netlify-style serverless shipment creation endpoint.
// Connect this handler to your carrier, label, and persistence services.
export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed.' });
  const body = request.body || {};
  const required = ['senderName', 'senderEmail', 'origin', 'destination', 'weight'];
  const missing = required.filter((field) => !String(body[field] || '').trim());
  if (missing.length) return response.status(400).json({ error: `Missing fields: ${missing.join(', ')}` });
  const trackingNumber = `SH-${Date.now().toString().slice(-8)}`;
  return response.status(201).json({ trackingNumber, status: 'Label created', estimatedDelivery: body.service === 'overnight' ? 'Tomorrow' : 'Within 3–5 business days' });
}
