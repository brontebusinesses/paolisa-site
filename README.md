# paolisa.eu

Site officiel de PAOLISA — marque-famille italo-belge de soin du visage.

Construit selon `PAOLISA_design_build_spec_v1.md`.

## Stack

- [Astro 5](https://astro.build) — framework, output static + API routes serverless
- [Tailwind CSS 3](https://tailwindcss.com) — styling, tokens design dans `tailwind.config.js`
- [Stripe Checkout](https://stripe.com/docs/payments/checkout) — paiement (v1)
- [Klaviyo](https://www.klaviyo.com) — newsletter + contact form
- [Vercel](https://vercel.com) — hébergement + déploiement continu
- TypeScript strict

## Développement local

```bash
npm install
cp .env.example .env.local   # puis remplir les clés
npm run dev                  # http://localhost:4321
```

## Scripts

| Commande | Action |
|---|---|
| `npm run dev` | Dev server local sur :4321 |
| `npm run build` | Build statique pour production |
| `npm run preview` | Sert le build production en local |
| `npm run astro check` | Type-check + diagnostics Astro |

## Variables d'environnement

Voir `.env.example`. À configurer en local dans `.env.local` (gitignored)
et en production dans Vercel → Project Settings → Environment Variables.

| Variable | Usage |
|---|---|
| `STRIPE_SECRET_KEY` | Clé serveur Stripe (test ou live) |
| `STRIPE_PUBLISHABLE_KEY` | Clé client Stripe (non secrète) |
| `STRIPE_PRICE_NO01` | Stripe Price ID pour N°01 (€48) |
| `KLAVIYO_API_KEY` | Clé privée Klaviyo (scopes : Profiles + Lists) |
| `KLAVIYO_LIST_ID` | ID de la liste newsletter |
| `PUBLIC_SITE_URL` | URL canonique du site |

## Structure

```
src/
├── pages/         routes Astro (pages + API)
├── components/    composants réutilisables
├── layouts/       layouts de page (BaseLayout)
├── content/       contenu markdown (journal)
├── styles/        global.css + tokens
└── lib/           utilitaires (stripe, klaviyo, products)
```

## Règles de design (extraits §2)

- Palette stricte : voir `tailwind.config.js`. Aucune couleur hors palette.
- Le point ● terracotta `#A85A35` est **réservé** au wordmark uniquement.
- Pas d'italique. Coins droits partout (sauf carte voûtée `.arch`).
- Aucune animation décorative. Transitions UI seulement (hover liens 150ms,
  hover boutons 200ms).

Toute évolution du système de design doit être versionnée dans la spec
(`PAOLISA_design_build_spec_v1.md` → v1.1, v1.2…).

## Roadmap

- ✅ v0.1 — Lancement N°01 (juin 2026)
- ⏳ v0.2 — N°02 Huile soir (Q3 2026)
- ⏳ v0.3 — éventuelle migration Astro + Shopify Storefront API si volume

## Licence

Propriétaire — © 2026 PAOLISA SRL. Tous droits réservés.
