/**
 * GET  /api/reviews/moderate?id=<metaobject GID>&action=publish|reject
 *   → Affiche une page de confirmation (AUCUNE écriture ici).
 * POST /api/reviews/moderate   (form-encoded : id, action)
 *   → Exécute réellement la publication/suppression.
 *
 * Pourquoi ce découpage GET (lecture) / POST (écriture) : le 29/08/2026, un
 * avis a été supprimé sans qu'aucun clic humain n'ait eu lieu — cause
 * identifiée : de nombreuses messageries (Outlook Safe Links, filtres anti-
 * phishing d'entreprise, etc.) « scannent » automatiquement TOUS les liens
 * d'un email en les appelant en GET, pour vérifier qu'ils ne sont pas
 * malveillants. Avec l'ancienne version (une simple requête GET qui
 * exécutait directement la mutation), ce scan suffisait à déclencher
 * « Supprimer ». Le GET est donc désormais strictement en lecture seule ; la
 * mutation n'a lieu que sur un vrai clic de bouton, qui soumet un formulaire
 * POST — un comportement qu'aucun scanner de lien automatique ne reproduit.
 *
 * Lien cliqué depuis l'email de notification Klaviyo (voir
 * trackReviewSubmission dans lib/klaviyo.ts) : permet à Bronté de publier ou
 * supprimer un avis en un clic + une confirmation, sans passer par l'admin
 * Shopify.
 *
 * Protection volontairement légère par ailleurs : l'ID du metaobject sert de
 * jeton, il n'est communiqué qu'à Bronté par email. Risque jugé acceptable
 * (avis textuel, pas de donnée sensible) — voir lib/reviews.ts pour le
 * détail.
 */
import type { APIRoute } from 'astro';
import { publishReview, rejectReview } from '../../../lib/reviews';

export const prerender = false;

const page = (title: string, bodyHtml: string, ok: boolean | null) => `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title} — Paolisa</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #faf7f2; color: #2b2620; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 24px; text-align: center; }
    .card { max-width: 460px; }
    h1 { font-size: 1.25rem; margin-bottom: 0.5rem; color: ${ok === null ? '#2b2620' : ok ? '#2f6b3a' : '#a13a3a'}; }
    p { color: #55504a; line-height: 1.5; }
    .avis { text-align: left; background: #fff; border: 1px solid #e7e1d8; border-radius: 8px; padding: 16px; margin: 16px 0; font-size: 0.9rem; }
    .btns { display: flex; gap: 12px; justify-content: center; margin-top: 20px; }
    button { border: none; border-radius: 6px; padding: 12px 24px; font-weight: bold; font-size: 0.95rem; cursor: pointer; color: #fff; }
    .publish { background: #2f6b3a; }
    .reject { background: #a13a3a; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${title}</h1>
    ${bodyHtml}
  </div>
</body>
</html>`;

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = async ({ url }) => {
  const id = url.searchParams.get('id');
  const action = url.searchParams.get('action');

  if (!id || (action !== 'publish' && action !== 'reject')) {
    return new Response(
      page('Lien invalide', '<p>Ce lien de modération est incomplet ou incorrect.</p>', false),
      { status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }

  const verb = action === 'publish' ? 'publier' : 'supprimer définitivement';
  const btnClass = action === 'publish' ? 'publish' : 'reject';
  const label = action === 'publish' ? 'Confirmer la publication' : 'Confirmer la suppression';

  const bodyHtml = `
    <p>Confirme cette action : <strong>${verb}</strong> cet avis ?</p>
    <form method="POST" action="/api/reviews/moderate">
      <input type="hidden" name="id" value="${escapeHtml(id)}" />
      <input type="hidden" name="action" value="${escapeHtml(action)}" />
      <div class="btns">
        <button type="submit" class="${btnClass}">${label}</button>
      </div>
    </form>
  `;

  return new Response(page('Confirmer', bodyHtml, null), {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
};

export const POST: APIRoute = async ({ request }) => {
  let id: string | null = null;
  let action: string | null = null;

  try {
    const form = await request.formData();
    id = String(form.get('id') ?? '') || null;
    action = String(form.get('action') ?? '') || null;
  } catch {
    // ignore, handled by validation below
  }

  if (!id || (action !== 'publish' && action !== 'reject')) {
    return new Response(
      page('Lien invalide', '<p>Ce lien de modération est incomplet ou incorrect.</p>', false),
      { status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }

  try {
    if (action === 'publish') {
      await publishReview(id);
      return new Response(
        page('Avis publié', '<p>L’avis est désormais visible sur le site paolisa.eu.</p>', true),
        { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }

    await rejectReview(id);
    return new Response(
      page('Avis supprimé', '<p>L’avis a été rejeté et supprimé, il ne sera pas publié.</p>', true),
      { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  } catch (err) {
    console.error('[api/reviews/moderate]', err);
    const message = err instanceof Error ? err.message : 'Erreur inconnue.';
    return new Response(
      page(
        'Action impossible',
        `<p>Une erreur est survenue (avis déjà traité, ou lien expiré). Détail : ${escapeHtml(message)}</p>`,
        false
      ),
      { status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }
};
