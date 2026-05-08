/**
 * Klaviyo — helpers serveur uniquement.
 * Documentation : https://developers.klaviyo.com/en/reference/api_overview
 *
 * Ne jamais importer ce module dans un composant client.
 */

const KLAVIYO_BASE = 'https://a.klaviyo.com/api';
const KLAVIYO_REVISION = '2024-10-15';

const apiKey = import.meta.env.KLAVIYO_API_KEY;
const listId = import.meta.env.KLAVIYO_LIST_ID;

const baseHeaders = (): Record<string, string> => ({
  Authorization: `Klaviyo-API-Key ${apiKey ?? ''}`,
  Accept: 'application/vnd.api+json',
  'Content-Type': 'application/vnd.api+json',
  revision: KLAVIYO_REVISION,
});

export const isKlaviyoConfigured = (): boolean => Boolean(apiKey && listId);

export type NewsletterSourceKey = 'footer' | 'waitlist' | 'article';

/**
 * Inscrit un email à la liste newsletter avec consentement.
 * Référence : https://developers.klaviyo.com/en/reference/subscribe_profiles
 *
 * En plus de l'inscription à la liste, déclenche un événement Klaviyo
 * « Newsletter Signup » avec la source précise (footer/waitlist/article).
 * Les événements s'accumulent (un par inscription), contrairement à $source
 * qui s'écrase à chaque update — ce qui permet de segmenter durablement.
 *
 * Renvoie { ok: true } en succès, { ok: false, error } en cas d'échec.
 */
export async function subscribeNewsletter(
  email: string,
  source = 'Site paolisa.eu — formulaire footer',
  sourceKey: NewsletterSourceKey = 'footer'
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isKlaviyoConfigured()) {
    return { ok: false, error: 'KLAVIYO_API_KEY ou KLAVIYO_LIST_ID manquante.' };
  }

  const body = {
    data: {
      type: 'profile-subscription-bulk-create-job',
      attributes: {
        custom_source: source,
        profiles: {
          data: [
            {
              type: 'profile',
              attributes: {
                email,
                subscriptions: {
                  email: {
                    marketing: {
                      consent: 'SUBSCRIBED',
                    },
                  },
                },
              },
            },
          ],
        },
      },
      relationships: {
        list: {
          data: {
            type: 'list',
            id: listId,
          },
        },
      },
    },
  };

  try {
    const res = await fetch(
      `${KLAVIYO_BASE}/profile-subscription-bulk-create-jobs/`,
      {
        method: 'POST',
        headers: baseHeaders(),
        body: JSON.stringify(body),
      }
    );

    if (res.status === 202 || res.status === 200) {
      // Tracking événement source — ne bloque pas l'inscription si ça échoue.
      try {
        await trackNewsletterSignupEvent(email, sourceKey, source);
      } catch (eventErr) {
        console.error('[klaviyo] event tracking failed (non-blocking)', eventErr);
      }
      return { ok: true };
    }

    const text = await res.text();
    return { ok: false, error: `Klaviyo ${res.status} : ${text.slice(0, 300)}` };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Unknown Klaviyo error',
    };
  }
}

/**
 * Déclenche un événement « Newsletter Signup » sur le profil. Idéal pour
 * segmenter par source d'inscription (waitlist vs footer vs article).
 *
 * Les événements Klaviyo s'accumulent (un par inscription), contrairement à
 * $source qui s'écrase à chaque update.
 */
async function trackNewsletterSignupEvent(
  email: string,
  sourceKey: NewsletterSourceKey,
  sourceLabel: string
): Promise<void> {
  const eventBody = {
    data: {
      type: 'event',
      attributes: {
        properties: {
          source: sourceKey,
          source_label: sourceLabel,
          page: sourceKey === 'waitlist' ? '/huile/no-01' : '/',
        },
        time: new Date().toISOString(),
        metric: {
          data: {
            type: 'metric',
            attributes: { name: 'Newsletter Signup' },
          },
        },
        profile: {
          data: {
            type: 'profile',
            attributes: { email },
          },
        },
      },
    },
  };

  const res = await fetch(`${KLAVIYO_BASE}/events/`, {
    method: 'POST',
    headers: baseHeaders(),
    body: JSON.stringify(eventBody),
  });

  if (res.status !== 202 && res.status !== 200) {
    const text = await res.text();
    throw new Error(`Klaviyo event ${res.status} : ${text.slice(0, 200)}`);
  }
}

/**
 * Crée ou met à jour un profil Klaviyo + déclenche un événement.
 * Utilisé pour le formulaire de contact (§4.6).
 *
 * Référence : https://developers.klaviyo.com/en/reference/create_event
 */
export async function trackContactSubmission(input: {
  email: string;
  name?: string;
  subject?: string;
  message: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!apiKey) {
    return { ok: false, error: 'KLAVIYO_API_KEY manquante.' };
  }

  // Étape 1 — upsert le profil avec ses attributs.
  const profileBody = {
    data: {
      type: 'profile',
      attributes: {
        email: input.email,
        first_name: input.name,
        properties: {
          last_contact_subject: input.subject ?? '',
          last_contact_at: new Date().toISOString(),
        },
      },
    },
  };

  try {
    await fetch(`${KLAVIYO_BASE}/profiles/`, {
      method: 'POST',
      headers: baseHeaders(),
      body: JSON.stringify(profileBody),
    });
  } catch {
    // Profile peut déjà exister — on continue, l'événement se rattachera quand même.
  }

  // Étape 2 — événement « Contact form submitted ».
  const eventBody = {
    data: {
      type: 'event',
      attributes: {
        properties: {
          subject: input.subject ?? '(sans sujet)',
          message: input.message,
          source: 'paolisa.eu',
        },
        time: new Date().toISOString(),
        metric: {
          data: {
            type: 'metric',
            attributes: { name: 'Contact form submitted' },
          },
        },
        profile: {
          data: {
            type: 'profile',
            attributes: { email: input.email, first_name: input.name },
          },
        },
      },
    },
  };

  try {
    const res = await fetch(`${KLAVIYO_BASE}/events/`, {
      method: 'POST',
      headers: baseHeaders(),
      body: JSON.stringify(eventBody),
    });

    if (res.status === 202 || res.status === 200) {
      return { ok: true };
    }

    const text = await res.text();
    return { ok: false, error: `Klaviyo ${res.status} : ${text.slice(0, 300)}` };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Unknown Klaviyo error',
    };
  }
}
