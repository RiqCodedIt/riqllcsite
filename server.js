import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import Stripe from 'stripe';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-04-30.basil',
});

app.use(express.json());

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Health check endpoint for Railway
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'riq-frontend-server',
    port: PORT
  });
});

// Stripe checkout session
app.post('/create-checkout-session', async (req, res) => {
  const { items, customerInfo } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'No items in cart' });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Stripe is not configured' });
  }

  const origin = req.headers.origin || `https://${req.headers.host}`;

  const lineItems = items.map((item) => {
    if (item.type === 'beat') {
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${item.beat_title} — ${item.license_type === 'lease' ? 'WAV Lease' : 'Exclusive'} License`,
            images: item.cover_path ? [item.cover_path] : [],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: 1,
      };
    } else if (item.type === 'service') {
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.service_name,
            description: item.category || undefined,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: 1,
      };
    } else {
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Studio Session — ${item.studio_name}`,
            description: `${item.date} • ${item.time_slot} • ${item.duration}h`,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: 1,
      };
    }
  });

  const sessionParams = {
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/beats`,
  };

  if (customerInfo?.email) {
    sessionParams.customer_email = customerInfo.email;
  }

  const session = await stripe.checkout.sessions.create(sessionParams).catch((err) => {
    console.error('Stripe error:', err.message);
    return res.status(500).json({ error: err.message });
  });

  if (session && session.url) {
    return res.json({ url: session.url });
  }
});

// Handle React Router (SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
