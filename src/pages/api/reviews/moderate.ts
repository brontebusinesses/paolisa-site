/**
 * GET /api/reviews/moderate?id=<metaobject GID>&action=publish|reject
 *
 * Lien cliqué directement depuis l'email de notification Klaviyo (voir
 * trackReviewSubmission dans lib/klaviyo.ts) : permet à Bronté de publier ou
 * supprimer un avis en un clic, sans passer par l'admin Shopify. Route en
 * GET (pas POST) exprès, car un lien mailto/email ne peut déclencher qu'une
 * navigation GET classique.
 *
 * Protection volontairement légère : l'ID du metaobject sert de jeton, il
 * n'est communiqué qu'à Bronté par email. Risque jugé acceptable (avis
 * textuel, pas de donnée sensible) — voir lib/reviews.ts pour le détail.
 */
import type { APIRoute } from 'astro';
import { publishReview, rejectReview } from '../../../lib/reviews';

export const prerender = false;

const page = (title: string, message: string, ok: boolean) => `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title} — Paolisa</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #faf7f2; color: #2b2620; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 24px; text-align: center; }
    .card { max-width: 420px; }
    h1 { font-size: 1.25rem; margin-bottom: 0.5rem; color: ${ok ? '#2f6b3a' : '#a13a3a'}; }
    p { color: #55504a; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${title}</h1>
    <p>${message}</p>
  </div>
</body>
</html>`;

export const GET: APIRoute = async ({ url }) => {
  const id = url.searchParams.get('id');
  const action = url.searchParams.get('action');

  if (!id || (action !== 'publish' && action !== 'reject')) {
    return new Response(page('Lien invalide', "Ce lien de modération est incomplet ou incorrect.", false), {
      status: 400,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  try {
    if (action === 'publish') {
      await publishReview(id);
      return new Response(
        page('Avis publié', 'L’avis est désormais visible sur le site paolisa.eu.', true),
        { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }

    await rejectReview(id);
    return new Response(
      page('Avis supprimé', 'L’avis a été rejeté et supprimé, il ne sera pas publié.', true),
      { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  } catch (err) {
    console.error('[api/reviews/moderate]', err);
    const message = err instanceof Error ? err.message : 'Erreur inconnue.';
    return new Response(
      page(
        'Action impossible',
        `Une erreur est survenue (avis déjà traité, ou lien expiré). Détail : ${message}`,
        false
      ),
      { status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }
};
