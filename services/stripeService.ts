export async function createStripeCheckoutSession(data: {
  name: string;
  email: string;
  phone: string;
  tier: 'GA' | 'VIP';
}) {
  const response = await fetch('/api/stripe/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create Stripe Checkout session');
  const result = await response.json();
  return result.url;
}
