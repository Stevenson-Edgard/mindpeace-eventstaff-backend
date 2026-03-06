import express from 'express';
import Stripe from 'stripe';
const router = express.Router();

const getStripeClient = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey || !secretKey.startsWith('sk_')) {
    throw new Error('STRIPE_SECRET_KEY is missing or invalid in backend environment');
  }
  return new Stripe(secretKey);
};

router.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body;

  if (typeof amount !== 'number' || Number.isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  try {
    const stripe = getStripeClient();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/create-checkout-session', async (req, res) => {
  const { amount = 50.0, name = 'Event Ticket' } = req.body;
  const normalizedAmount = Number(amount);

  try {
    if (Number.isNaN(normalizedAmount) || normalizedAmount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name },
            unit_amount: Math.round(normalizedAmount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/tickets?canceled=true`,
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
