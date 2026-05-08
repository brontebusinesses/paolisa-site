// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';

// https://astro.build/config
// Astro 5 : output 'static' avec opt-out par route via `export const prerender = false`.
// Les API routes (/api/checkout, /api/newsletter, /api/contact) sont rendues à la
// demande via les fonctions serverless Vercel.
export default defineConfig({
  site: 'https://paolisa.eu',
  output: 'static',
  adapter: vercel(),
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  build: {
    format: 'directory',
  },
  trailingSlash: 'never',
  cacheDir: './node_modules/.cache/astro',
  vite: {
    cacheDir: './node_modules/.cache/vite',
  },
  // Désactive la vérif CSRF d'Astro pour les routes SSR.
  // Sur Vercel, le host vu par la serverless function diffère de celui
  // côté navigateur (alias public vs ID de déploiement), ce qui fait
  // échouer le check Origin par défaut. On laisse Stripe gérer la
  // validation côté serveur via priceId.
  security: {
    checkOrigin: false,
  },
});
