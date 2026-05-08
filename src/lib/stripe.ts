/**
 * Client Stripe — uniquement côté serveur (API routes).
 * Ne jamais importer ce module dans un composant client.
 *
 * En local : la clé est dans .env.local (gitignored).
 * En prod  : la clé est dans Vercel → Project Settings → Environment Variables.
 */
import Stripe from 'stripe';

const secretKey = import.meta.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  // En dev, on log mais on ne crash pas — laisse l'API route renvoyer une 500.
  console.warn('[stripe] STRIPE_SECRET_KEY missing — checkout API will return 500.');
}

export const stripe = new Stripe(secretKey ?? 'sk_test_placeholder', {
  apiVersion: '2025-02-24.acacia',
  appInfo: {
    name: 'paolisa.eu',
    version: '0.1.0',
  },
});

/** Map slug → env var contenant le Stripe Price ID. */
export const stripePriceFor = (slug: string): string | undefined => {
  switch (slug) {
    case 'no-01':
      return import.meta.env.STRIPE_PRICE_NO01;
    default:
      return undefined;
  }
};
