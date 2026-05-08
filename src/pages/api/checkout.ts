/**
 * POST /api/checkout — crée une session Stripe Checkout et redirige.
 *
 * Body (form data) :
 *   productSlug : "no-01"
 *   quantity    : "1" .. "9"
 *
 * Réponse : 303 See Other → URL Stripe Checkout (paiement hosted).
 */
import type { APIRoute } from 'astro';
import { stripe, stripePriceFor } from '../../lib/stripe';
import { getProduct } from '../../lib/products';

// API route à la demande (pas de pré-rendu).
export const prerender = false;

export const POST: APIRoute = async ({ request, redirect, url }) => {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return new Response('Invalid form data', { status: 400 });
  }

  const productSlug = String(formData.get('productSlug') ?? '');
  const quantityRaw = Number(formData.get('quantity') ?? 1);
  const quantity = Math.min(Math.max(1, Math.floor(quantityRaw || 1)), 9);

  const product = getProduct(productSlug);
  if (!product) {
    return new Response('Product not found', { status: 404 });
  }
  if (!product.available) {
    return new Response('Product not available', { status: 410 });
  }

  const priceId = stripePriceFor(productSlug);
  if (!priceId || priceId === 'price_REPLACE_ME') {
    return new Response(
      'Stripe price not configured. Set STRIPE_PRICE_NO01 in .env.local.',
      { status: 500 }
    );
  }

  const origin = import.meta.env.PUBLIC_SITE_URL || url.origin;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      ui_mode: 'hosted',
      line_items: [
        {
          price: priceId,
          quantity,
        },
      ],
      // Moyens de paiement EU — §8.2.
      payment_method_types: ['card', 'bancontact', 'ideal', 'sepa_debit'],
      // Stripe Tax — calcul TVA EU automatique. Suppose que le produit a
      // une `tax_behavior` configurée dans le dashboard.
      automatic_tax: { enabled: true },
      // Frais de port — Stripe Shipping. Configuration en dashboard.
      shipping_address_collection: {
        allowed_countries: [
          'BE', 'FR', 'LU', 'NL', 'DE', 'IT', 'ES', 'PT', 'AT', 'IE',
          'DK', 'SE', 'FI', 'PL', 'CZ', 'GR',
        ],
      },
      billing_address_collection: 'auto',
      locale: 'fr',
      // Codes promo (Stripe Coupons) activés.
      allow_promotion_codes: true,
      // Pages retour.
      success_url: `${origin}/merci?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/huile/${productSlug}?annule=1`,
      // Métadonnées pour le suivi interne.
      metadata: {
        productSlug,
        productNumber: product.number,
      },
    });

    if (!session.url) {
      return new Response('Stripe did not return a checkout URL', { status: 500 });
    }

    return redirect(session.url, 303);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown Stripe error';
    console.error('[api/checkout]', msg);
    return new Response(`Checkout error: ${msg}`, { status: 500 });
  }
};

// Bloque toute autre méthode HTTP.
export const ALL: APIRoute = () => new Response('Method not allowed', { status: 405 });
