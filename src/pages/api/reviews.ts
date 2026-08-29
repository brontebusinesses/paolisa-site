/**
 * GET  /api/reviews?productId=gid://shopify/Product/xxx  — avis publiés
 * POST /api/reviews   { productId, rating, authorName, title?, body }
 *                      — crée un avis en Brouillon (voir lib/reviews.ts)
 *
 * Système maison qui remplace Judge.me (resté désactivé faute du plan
 * payant nécessaire au headless — voir lib/judgeme.ts).
 */
import type { APIRoute } from 'astro';
import { getPublishedReviews, submitReview } from '../../lib/reviews';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const productId = url.searchParams.get('productId');
  if (!productId) {
    return new Response(JSON.stringify({ error: 'productId requis.' }), { status: 400 });
  }

  try {
    const reviews = await getPublishedReviews(productId);
    return new Response(JSON.stringify({ reviews }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (err) {
    console.error('[api/reviews GET]', err);
    return new Response(JSON.stringify({ error: 'Impossible de charger les avis.' }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  let payload: {
    productId?: string;
    rating?: number;
    authorName?: string;
    title?: string;
    body?: string;
  };

  try {
    payload = await request.json();
  } catch {
    return new Response(JSON.stringify({ success: false, error: 'Corps de requête invalide.' }), { status: 400 });
  }

  const { productId, rating, authorName, title, body } = payload;

  if (!productId || !authorName || !body) {
    return new Response(
      JSON.stringify({ success: false, error: 'productId, authorName et body sont obligatoires.' }),
      { status: 400 }
    );
  }

  try {
    await submitReview({
      productGid: productId,
      rating: Number(rating),
      authorName: String(authorName),
      title: title ? String(title) : undefined,
      body: String(body),
    });
    return new Response(
      JSON.stringify({ success: true, message: 'Avis envoyé.' }),
      { status: 201 }
    );
  } catch (err) {
    console.error('[api/reviews POST]', err);
    const message = err instanceof Error ? err.message : 'Erreur inconnue.';
    return new Response(JSON.stringify({ success: false, error: message }), { status: 400 });
  }
};
