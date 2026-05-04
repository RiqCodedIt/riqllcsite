import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { timingSafeEqual } from 'crypto';
import Stripe from 'stripe';
import { rateLimit } from 'express-rate-limit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

// Fail fast at startup if Stripe key is missing
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  console.error('Missing STRIPE_SECRET_KEY environment variable. Unable to start server.');
  process.exit(1);
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-04-30.basil',
});

// Load canonical pricing data for server-side price validation
const require = createRequire(import.meta.url);
const beatsJson = require('./src/data/beats.json');
const servicesJson = require('./src/data/services.json');

/** @type {Map<string, { lease: number, exclusive: number, title: string, cover_path: string }>} */
const beatPriceMap = new Map(
  beatsJson.beats.map((b) => [
    b.beat_id,
    { lease: b.lease_price, exclusive: b.exclusive_price, title: b.title, cover_path: b.cover_path },
  ])
);

/** @type {Map<string, { price: number, name: string, category: string }>} */
const servicePriceMap = new Map(
  servicesJson.services.map((s) => [
    s.service_id,
    { price: s.price, name: s.name, category: s.category },
  ])
);

/**
 * Returns an absolute URL for a given path. If path is already absolute,
 * it is returned as-is. Otherwise it is prefixed with baseUrl.
 * @param {string} imagePath
 * @param {string} baseUrl
 * @returns {string}
 */
function toAbsoluteUrl(imagePath, baseUrl) {
  return /^https?:\/\//.test(imagePath) ? imagePath : `${baseUrl}${imagePath}`;
}

app.set('trust proxy', 1);
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

// Server-side studio session hourly rate — never trust client-sent price
const STUDIO_HOURLY_RATE = parseInt(process.env.STUDIO_HOURLY_RATE || '75', 10);

// Stripe checkout session
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { items, customerInfo } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No items in cart' });
    }

    // Require server-configured PUBLIC_SITE_URL — never trust client-controlled Host header
    const publicSiteUrl = process.env.PUBLIC_SITE_URL;
    if (!publicSiteUrl) {
      console.error('Missing PUBLIC_SITE_URL environment variable');
      return res.status(500).json({ error: 'Server misconfiguration' });
    }
    const baseUrl = publicSiteUrl.replace(/\/$/, '');

    const lineItems = [];

    for (const item of items) {
      if (item.type === 'beat') {
        const beatData = beatPriceMap.get(item.beat_id);
        if (!beatData) {
          return res.status(400).json({ error: `Unknown beat: ${item.beat_id}` });
        }
        if (item.license_type !== 'lease' && item.license_type !== 'exclusive') {
          return res.status(400).json({ error: `Invalid license type: ${item.license_type}` });
        }
        const unitAmount = item.license_type === 'lease'
          ? Math.round(beatData.lease * 100)
          : Math.round(beatData.exclusive * 100);
        const coverImageUrl = beatData.cover_path
          ? toAbsoluteUrl(beatData.cover_path, baseUrl)
          : null;
        lineItems.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${beatData.title} — ${item.license_type === 'lease' ? 'WAV Lease' : 'Exclusive'} License`,
              ...(coverImageUrl ? { images: [coverImageUrl] } : {}),
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        });
      } else if (item.type === 'service') {
        const serviceData = servicePriceMap.get(item.service_id);
        if (!serviceData) {
          return res.status(400).json({ error: `Unknown service: ${item.service_id}` });
        }
        lineItems.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: serviceData.name,
              description: serviceData.category || undefined,
            },
            unit_amount: Math.round(serviceData.price * 100),
          },
          quantity: 1,
        });
      } else if (item.type === 'studio_session') {
        const duration = typeof item.duration === 'number' && item.duration > 0 ? item.duration : 1;
        const studioUnitAmount = Math.round(duration * STUDIO_HOURLY_RATE * 100);
        lineItems.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Studio Session — ${item.studio_name}`,
              description: `${item.date} • ${item.time_slot} • ${duration}h`,
            },
            unit_amount: studioUnitAmount,
          },
          quantity: 1,
        });
      } else {
        return res.status(400).json({ error: `Unknown item type: ${item.type}` });
      }
    }

    const hasConsultation = items.some(
      item => item.type === 'service' && item.service_id === 'artist_consultation'
    );

    const sessionParams = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}${hasConsultation ? '&has_consultation=1' : ''}`,
      cancel_url: `${baseUrl}/beats`,
    };

    if (customerInfo?.email) {
      sessionParams.customer_email = customerInfo.email;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    if (!session || !session.url) {
      console.error('Stripe error: Checkout session created without a URL');
      return res.status(500).json({ error: 'Failed to create checkout session' });
    }

    return res.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Stripe error:', message);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

const formRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

const adminAuthLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts, please try again later.' },
});

// Admin password auth — password stays server-side only
app.post('/admin/auth', adminAuthLimit, (req, res) => {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return res.status(503).json({ error: 'Admin access is not configured on the server.' });
  }
  const { password } = req.body;
  if (typeof password !== 'string' || password.length === 0) {
    return res.status(400).json({ error: 'Password is required.' });
  }
  try {
    const expected = Buffer.from(adminPassword, 'utf8');
    const provided = Buffer.from(password, 'utf8');
    const match = expected.length === provided.length &&
      timingSafeEqual(expected, provided);
    if (match) {
      return res.json({ success: true });
    }
    return res.status(401).json({ error: 'Incorrect password. Try again.' });
  } catch {
    return res.status(401).json({ error: 'Incorrect password. Try again.' });
  }
});

// Inquiry form submission
app.post('/submit-inquiry', formRateLimit, (req, res) => {
  const { name, email, service, notes } = req.body;
  if (!name || typeof name !== 'string' || name.trim().length === 0 || name.trim().length > 120) {
    return res.status(400).json({ error: 'Valid name is required (max 120 chars)' });
  }
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email is required' });
  }
  if (service !== undefined && service !== null) {
    if (typeof service !== 'string') {
      return res.status(400).json({ error: 'Service must be a string' });
    }
    if (service.trim().length > 120) {
      return res.status(400).json({ error: 'Service must be under 120 chars' });
    }
  }
  if (notes !== undefined && notes !== null) {
    if (typeof notes !== 'string') {
      return res.status(400).json({ error: 'Notes must be a string' });
    }
    if (notes.length > 2000) {
      return res.status(400).json({ error: 'Notes must be under 2000 characters' });
    }
  }
  const loggedService = typeof service === 'string' && service.trim() ? service.trim().slice(0, 120) : 'unspecified';
  // Log only non-PII metadata for audit trail
  console.log('[INQUIRY]', { service: loggedService, ts: new Date().toISOString() });
  return res.json({ success: true });
});

// Email capture / newsletter subscribe
app.post('/subscribe', formRateLimit, (req, res) => {
  const { email } = req.body;
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email is required' });
  }
  if (email.length > 254) {
    return res.status(400).json({ error: 'Email too long' });
  }
  // Log only non-PII metadata
  console.log('[SUBSCRIBE]', { ts: new Date().toISOString() });
  return res.json({ success: true });
});

// Handle React Router (SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
