import express from 'express';
import Stripe from 'stripe';
const router = express.Router();

router.post('/create-checkout-session', async (req, res) => {
  const { name, email, phone, eventName, ticketType, quantity } = req.body;

  // Initialize Stripe here, after dotenv is loaded in index.ts
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Event Ticket' },
            unit_amount: 5000, // $50.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/receipt?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/attendeeinfo?canceled=true`,
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
