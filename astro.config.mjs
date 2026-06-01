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
  // Cache HORS de node_modules : Vercel restaure node_modules depuis son
  // cache de dépendances (que « redeploy sans build cache » ne vide pas).
  // Quand le cache Vite y vivait, Vite croyait que rien n'avait changé et
  // NE ré-émettait PAS le bundle CSS /_astro/*.css → site servi sans style.
  // On le met dans /tmp (éphémère sur Vercel) pour forcer un build CSS propre.
  cacheDir: '/tmp/paolisa-astro-cache',
  vite: {
    cacheDir: '/tmp/paolisa-vite-cache',
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
