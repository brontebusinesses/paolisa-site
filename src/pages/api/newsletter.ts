/**
 * POST /api/newsletter — inscrit un email à la liste Klaviyo "Paolisa — Newsletter".
 *
 * Form fields :
 *   email  : string, requis
 *   source : string, optionnel — utilisé pour distinguer footer vs in-article
 *   product, group : string, optionnels — envoyés par les formulaires liste
 *     d'attente (data-restock-form) sur la fiche produit : product.title et
 *     product.tier, pour segmenter dans Klaviyo QUEL produit (ou quelle gamme,
 *     ex. "nuit" pour LA NOTTE) attend un email. Avant le 13/09/2026, ce champ
 *     n'existait pas et toutes les inscriptions liste d'attente (n'importe quel
 *     produit) étaient étiquetées en dur "liste d'attente N°01", ce qui rendait
 *     impossible de cibler juste les inscrites LA NOTTE pour le mail de lancement
 *     du 16/09 — corrigé ce jour.
 *   origine, origine_premiere : string, optionnels — canal d'acquisition
 *     (« instagram / story · notte »), remplis côté client par lib/attribution.ts
 *
 * Réponse : 303 redirect vers la même page avec ?newsletter=ok|erreur|deja-inscrit
 */
import type { APIRoute } from 'astro';
import { subscribeNewsletter } from '../../lib/klaviyo';

export const prerender = false;

const isValidEmail = (s: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) && s.length <= 200;

export const POST: APIRoute = async ({ request, redirect }) => {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return new Response('Invalid form data', { status: 400 });
  }

  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const source = String(formData.get('source') ?? 'footer');
  // Page de retour optionnelle — le formulaire peut passer ?return=/journal/foo
  const returnTo = String(formData.get('return') ?? '/');
  const birthday = String(formData.get('birthday') ?? '').trim();
  // Origine de la visite, posée par lib/attribution.ts au chargement de la page.
  const origine = String(formData.get('origine') ?? '').slice(0, 120);
  const originePremiere = String(formData.get('origine_premiere') ?? '').slice(0, 120);
  // Contexte liste d'attente (formulaires data-restock-form sur la fiche produit).
  const waitlistProduct = String(formData.get('product') ?? '').slice(0, 120);
  const waitlistGroup = String(formData.get('group') ?? '').slice(0, 60);

  if (!isValidEmail(email)) {
    return redirect(returnTo + '?newsletter=erreur', 303);
  }

  const sourceKey =
    source === 'article' ? 'article'
    : source === 'waitlist' ? 'waitlist'
    : source === 'popup' ? 'popup'
    : 'footer';
  const sourceLabel =
    sourceKey === 'article'
      ? 'Site paolisa.eu — fin d\'article journal'
      : sourceKey === 'waitlist'
        ? `Site paolisa.eu — liste d'attente${waitlistProduct ? ` ${waitlistProduct}` : ' (produit non précisé)'}`
        : sourceKey === 'popup'
          ? 'Site paolisa.eu — pop-up de bienvenue'
          : 'Site paolisa.eu — footer';

  const result = await subscribeNewsletter(
    email,
    sourceLabel,
    sourceKey,
    /^\d{4}-\d{2}-\d{2}$/.test(birthday) ? birthday : undefined,
    { courante: origine, premiere: originePremiere },
    sourceKey === 'waitlist' ? { product: waitlistProduct, group: waitlistGroup, page: returnTo } : undefined
  );

  if (result.ok) {
    return redirect(returnTo + '?newsletter=ok', 303);
  }

  console.error('[api/newsletter]', result.error);
  return redirect(returnTo + '?newsletter=erreur', 303);
};
