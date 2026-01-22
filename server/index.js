import express from 'express';
import cors from 'cors';
import { z } from 'zod';
import { Resend } from 'resend';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Simple order notification API
 *
 * POST /api/order
 * - sends a confirmation email to the customer
 * - sends a notification email to the shop owner
 */

const app = express();

// Allow your frontend to call this API from another domain during development.
// In production you can restrict this to your real website domain.
app.use(cors({ origin: true }));
app.use(express.json({ limit: '200kb' }));

const OrderSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  country: z.string().min(1),
  city: z.string().min(1),
  address: z.string().min(1),
  phoneNumber: z.string().min(3),
  email: z.string().email(),
  quantity: z.number().int().min(1).default(1)
});

const BodySchema = z.object({
  order: OrderSchema,
  // Optional: any extra notes later
  notes: z.string().optional()
});

function moneyEUR(n) {
  return `${Number(n).toFixed(2)}€`;
}

function generateOrderId() {
  // Human-friendly 8 chars
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

app.get('/health', (_req, res) => res.json({ ok: true }));

app.post('/api/order', async (req, res) => {
  try {
    const parsed = BodySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: 'Invalid order data.' });
    }

    const { order, notes } = parsed.data;

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const OWNER_EMAIL = process.env.OWNER_EMAIL;
    const FROM_EMAIL = process.env.FROM_EMAIL;
    const SHOP_NAME = process.env.SHOP_NAME || 'ECU Stand';

    if (!RESEND_API_KEY || !OWNER_EMAIL || !FROM_EMAIL) {
      return res.status(500).json({
        ok: false,
        error:
          'Server email is not configured. Missing RESEND_API_KEY / OWNER_EMAIL / FROM_EMAIL.'
      });
    }

    const orderId = generateOrderId();
    const createdAt = new Date().toISOString();

    // Pricing logic (matches the frontend)
    const basePrice = 14.99;
    const qty = order.quantity ?? 1;
    const shippingCost = order.country === 'Shqipëri' || order.country === 'Maqedoni e Veriut' ? 5.0 : 0;
    const totalPrice = basePrice * qty + shippingCost;

    const resend = new Resend(RESEND_API_KEY);

    // Customer confirmation
    const customerSubject = `Porosia u pranua (#${orderId}) — ${SHOP_NAME}`;
    const customerHtml = `
      <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; line-height: 1.5;">
        <h2 style="margin: 0 0 12px;">Faleminderit, ${order.firstName}!</h2>
        <p style="margin: 0 0 16px;">Porosia juaj u pranua me sukses. Do t'ju kontaktojmë së shpejti.</p>
        <div style="padding: 12px 14px; border: 1px solid #eee; border-radius: 10px;">
          <p style="margin: 0 0 6px;"><strong>Order ID:</strong> ${orderId}</p>
          <p style="margin: 0 0 6px;"><strong>Sasia:</strong> ${qty}</p>
          <p style="margin: 0 0 6px;"><strong>Transporti:</strong> ${moneyEUR(shippingCost)}</p>
          <p style="margin: 0;"><strong>Totali:</strong> ${moneyEUR(totalPrice)}</p>
        </div>
        <p style="margin: 16px 0 0; color: #555; font-size: 13px;">Nëse keni pyetje, përgjigjuni këtij emaili.</p>
      </div>
    `;

    // Owner notification
    const ownerSubject = `New order received (#${orderId})`;
    const ownerText = [
      `New order received: #${orderId}`,
      `Name: ${order.firstName} ${order.lastName}`,
      `Email: ${order.email}`,
      `Phone: ${order.phoneNumber}`,
      `Address: ${order.address}, ${order.city}, ${order.country}`,
      `Quantity: ${qty}`,
      `Shipping: ${moneyEUR(shippingCost)}`,
      `Total: ${moneyEUR(totalPrice)}`,
      notes ? `Notes: ${notes}` : null,
      `Created: ${createdAt}`
    ]
      .filter(Boolean)
      .join('\n');

    // Send both emails
    await Promise.all([
      resend.emails.send({
        from: FROM_EMAIL,
        to: order.email,
        subject: customerSubject,
        html: customerHtml
      }),
      resend.emails.send({
        from: FROM_EMAIL,
        to: OWNER_EMAIL,
        subject: ownerSubject,
        text: ownerText
      })
    ]);

    return res.json({
      ok: true,
      orderId,
      createdAt,
      pricing: { basePrice, shippingCost, totalPrice }
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: 'Failed to send email.' });
  }
});

const port = Number(process.env.PORT || 8787);


// --- Serve the built frontend (Vite) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// SPA fallback: serve index.html for any non-API route
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Order API listening on http://localhost:${port}`);
});