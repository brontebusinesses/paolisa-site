/**
 * POST /api/contact — push contact form vers Klaviyo (profil + événement).
 *
 * Bronté reçoit l'info dans Klaviyo (Profiles → filtre événement
 * "Contact form submitted") et peut configurer un Flow pour s'auto-notifier
 * par email à bonjour@paolisa.eu.
 *
 * Form fields : name, email, subject, message
 * Réponse : 303 redirect /contact?envoye=1 ou ?erreur=...
 */
import type { APIRoute } from 'astro';
import { trackContactSubmission } from '../../lib/klaviyo';

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

  const name = String(formData.get('name') ?? '').trim().slice(0, 200);
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const subject = String(formData.get('subject') ?? '').trim().slice(0, 200);
  const message = String(formData.get('message') ?? '').trim().slice(0, 5000);

  if (!isValidEmail(email)) {
    return redirect('/contact?erreur=email_invalide', 303);
  }
  if (!message) {
    return redirect('/contact?erreur=message_manquant', 303);
  }

  const result = await trackContactSubmission({ email, name, subject, message });

  if (result.ok) {
    return redirect('/contact?envoye=1', 303);
  }

  console.error('[api/contact]', result.error);
  return redirect('/contact?erreur=envoi', 303);
};
