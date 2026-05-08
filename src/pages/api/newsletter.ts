/**
 * POST /api/newsletter — inscrit un email à la liste Klaviyo "Paolisa — Newsletter".
 *
 * Form fields :
 *   email  : string, requis
 *   source : string, optionnel — utilisé pour distinguer footer vs in-article
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

  if (!isValidEmail(email)) {
    return redirect(returnTo + '?newsletter=erreur', 303);
  }

  const result = await subscribeNewsletter(
    email,
    source === 'article'
      ? 'Site paolisa.eu — fin d\'article journal'
      : 'Site paolisa.eu — footer'
  );

  if (result.ok) {
    return redirect(returnTo + '?newsletter=ok', 303);
  }

  console.error('[api/newsletter]', result.error);
  return redirect(returnTo + '?newsletter=erreur', 303);
};
