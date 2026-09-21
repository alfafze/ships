// Vercel/Netlify-style serverless tracking endpoint.
// Replace the demo lookup with a carrier/database query in production.
export default function handler(request, response) {
  const trackingNumber = String(request.query?.number || '').trim().toUpperCase();
  if (!trackingNumber) return response.status(400).json({ error: 'Tracking number is required.' });
  return response.status(200).json({ trackingNumber, status: 'In transit', message: 'Last scanned 12 minutes ago at the Chicago regional hub.', estimatedDelivery: 'Tomorrow, Jun 18' });
}
