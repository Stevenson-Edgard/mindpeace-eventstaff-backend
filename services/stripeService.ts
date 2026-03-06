export async function createStripeCheckoutSession() {
  const response = await fetch('/api/stripe/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Failed to create Stripe Checkout session');
  const data = await response.json();
  return data.url;
}
