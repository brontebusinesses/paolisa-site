/**
 * Avis produit — système maison (remplace Judge.me, resté désactivé faute du
 * plan payant nécessaire au headless — voir lib/judgeme.ts).
 *
 * Stockage : Metaobjects Shopify, type "avis_produit" (créé dans l'admin
 * Shopify le 27/07/2026 — Contenu > Définitions de metaobjects). Champs :
 *   rating (1-5), title, body, author_name, product (référence produit),
 *   submitted_at. Capacité "publishable" : chaque avis naît en Brouillon.
 *
 * Modération par lien email (29/08/2026) : à la soumission, Bronté reçoit un
 * mail (via Klaviyo, voir lib/klaviyo.ts) avec deux liens "Publier" /
 * "Supprimer" qui appellent /api/reviews/moderate?id=...&action=publish|reject.
 * Un clic suffit, aucune connexion à l'admin Shopify n'est nécessaire. La
 * protection est volontairement légère (l'ID du metaobject sert de jeton,
 * pas de secret séparé) : risque jugé acceptable vu l'enjeu (un avis texte,
 * pas une donnée sensible) et l'ID n'est communiqué qu'à Bronté par mail.
 *
 * Lecture (avis publiés) : Storefront API — le metaobject a l'accès
 * storefront PUBLIC_READ, donc on réutilise le token public déjà en place
 * pour le catalogue (SHOPIFY_STOREFRONT_TOKEN). Seuls les avis au statut
 * ACTIVE (publiés) sont accessibles par ce chemin.
 *
 * Écriture (nouvel avis, publication, suppression) : la Storefront API ne
 * permet pas d'écrire — il faut l'Admin API. App « Avis produit — Admin API »
 * créée le 27/07/2026 via le Dev Dashboard Shopify (scopes read_metaobjects +
 * write_metaobjects). Ce nouveau Dev Dashboard ne révèle plus de token
 * statique : on échange un Client ID + Client Secret contre un access token
 * de 24h à chaque appel (voir getAdminAccessToken ci-dessous). Variables
 * d'env : SHOPIFY_ADMIN_CLIENT_ID, SHOPIFY_ADMIN_CLIENT_SECRET.
 */

import { shopifyFetch } from './shopify';
import { trackReviewSubmission } from './klaviyo';

const METAOBJECT_TYPE = 'avis_produit';
const ADMIN_API_VERSION = '2025-01';

// slug produit (products.ts) → ID produit Shopify numérique.
// Dupliqué depuis lib/judgeme.ts pour ne pas dépendre d'un module Judge.me
// qui pourrait redevenir actif un jour. À terme, ces IDs ont vocation à
// vivre directement dans products.ts (source unique du catalogue).
const PRODUCT_IDS: Record<string, string> = {
  'serum': '15840699154764',
  'contour-yeux': '15882279190860',
  'no-01': '15840284606796',
  'creme': '15840333791564',
  'solaire-teinte': '15855525757260',
  'stick-solaire': '15840718946636',
};

export const productGidForSlug = (slug: string): string | undefined => {
  const numericId = PRODUCT_IDS[slug];
  return numericId ? `gid://shopify/Product/${numericId}` : undefined;
};

export interface ProductReview {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  authorName: string;
  submittedAt: string | null;
}

// ----------------------------------------------------------------------------
// Lecture — Storefront API (avis publiés uniquement)
// ----------------------------------------------------------------------------

const REVIEWS_QUERY = `
  query ReviewsForProduct($first: Int!, $after: String) {
    metaobjects(type: "${METAOBJECT_TYPE}", first: $first, after: $after) {
      edges {
        node {
          id
          rating: field(key: "rating") { value }
          title: field(key: "title") { value }
          body: field(key: "body") { value }
          author_name: field(key: "author_name") { value }
          product: field(key: "product") { value }
          submitted_at: field(key: "submitted_at") { value }
        }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
`;

interface MetaobjectField {
  value: string | null;
}
interface MetaobjectNode {
  id: string;
  rating: MetaobjectField;
  title: MetaobjectField;
  body: MetaobjectField;
  author_name: MetaobjectField;
  product: MetaobjectField;
  submitted_at: MetaobjectField;
}
interface MetaobjectsResponse {
  metaobjects: {
    edges: { node: MetaobjectNode }[];
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
  };
}

/**
 * Avis publiés pour un produit donné (gid Shopify), triés du plus récent au
 * plus ancien. La Storefront API ne renvoie que les metaobjects publiés
 * (statut ACTIVE) sur un accès PUBLIC_READ — pas de filtre de statut à faire
 * manuellement côté client.
 */
export async function getPublishedReviews(productGid: string): Promise<ProductReview[]> {
  const results: ProductReview[] = [];
  let after: string | null = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const variables: { first: number; after: string | null } = { first: 100, after };
    const data: MetaobjectsResponse = await shopifyFetch<MetaobjectsResponse>(REVIEWS_QUERY, variables);
    for (const { node } of data.metaobjects.edges) {
      // Certains champs (ex. title, optionnel) reviennent à `null` — et non
      // un objet { value: null } — côté Storefront API quand ils n'ont
      // jamais été renseignés. D'où l'optional chaining sur CHAQUE champ,
      // pas seulement sur .value (cause du bug « Cannot read properties of
      // null (reading 'value') » constaté le 29/08/2026 dès le premier avis
      // publié sans titre).
      if (node.product?.value !== productGid) continue;
      results.push({
        id: node.id,
        rating: Number(node.rating?.value ?? 0),
        title: node.title?.value ?? null,
        body: node.body?.value ?? '',
        authorName: node.author_name?.value ?? 'Client',
        submittedAt: node.submitted_at?.value ?? null,
      });
    }
    hasNextPage = data.metaobjects.pageInfo.hasNextPage;
    after = data.metaobjects.pageInfo.endCursor;
  }

  results.sort((a, b) => (b.submittedAt ?? '').localeCompare(a.submittedAt ?? ''));
  return results;
}

// ----------------------------------------------------------------------------
// Écriture — Admin API (création d'un avis en Brouillon)
//
// Grant OAuth2 "client_credentials" : on échange Client ID + Client Secret
// contre un access token valable 24h (86399s), mis en cache en mémoire le
// temps que la fonction serverless reste "chaude". Si l'instance redémarre
// (cold start), un nouveau token est simplement redemandé — gratuit, sans
// effet de bord. Doc Shopify :
// https://shopify.dev/docs/apps/build/dev-dashboard/get-api-access-tokens
// ----------------------------------------------------------------------------

let cachedAdminToken: string | null = null;
let cachedAdminTokenExpiresAt = 0;

async function getAdminAccessToken(domain: string): Promise<string> {
  if (cachedAdminToken && Date.now() < cachedAdminTokenExpiresAt - 60_000) {
    return cachedAdminToken;
  }

  const clientId = import.meta.env.SHOPIFY_ADMIN_CLIENT_ID;
  const clientSecret = import.meta.env.SHOPIFY_ADMIN_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      'Avis produit non configuré : SHOPIFY_ADMIN_CLIENT_ID et SHOPIFY_ADMIN_CLIENT_SECRET requis.'
    );
  }

  const res = await fetch(`https://${domain}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Shopify token endpoint ${res.status} : ${text.slice(0, 300)}`);
  }

  const json = (await res.json()) as { access_token: string; expires_in: number };
  cachedAdminToken = json.access_token;
  cachedAdminTokenExpiresAt = Date.now() + json.expires_in * 1000;
  return cachedAdminToken;
}

async function shopifyAdminFetch<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  const domain = import.meta.env.SHOPIFY_STORE_DOMAIN;

  if (!domain) {
    throw new Error('Avis produit non configuré : SHOPIFY_STORE_DOMAIN requis.');
  }

  const token = await getAdminAccessToken(domain);

  const res = await fetch(`https://${domain}/admin/api/${ADMIN_API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Shopify Admin API ${res.status} : ${text.slice(0, 300)}`);
  }

  const json = (await res.json()) as { data?: T; errors?: unknown[] };
  if (json.errors && json.errors.length > 0) {
    throw new Error(`Shopify Admin GraphQL errors : ${JSON.stringify(json.errors).slice(0, 500)}`);
  }
  if (!json.data) throw new Error('Shopify Admin API : réponse sans data');
  return json.data;
}

const CREATE_REVIEW_MUTATION = `
  mutation CreateReview($metaobject: MetaobjectCreateInput!) {
    metaobjectCreate(metaobject: $metaobject) {
      metaobject { id handle }
      userErrors { field message code }
    }
  }
`;

interface CreateReviewResponse {
  metaobjectCreate: {
    metaobject: { id: string; handle: string } | null;
    userErrors: { field: string[]; message: string; code: string }[];
  };
}

export interface NewReviewInput {
  productGid: string;
  rating: number;
  body: string;
  authorName: string;
  title?: string;
}

/**
 * Crée un nouvel avis en statut Brouillon (invisible sur le site) et notifie
 * Bronté par email avec un lien de publication / suppression en un clic —
 * voir moderate() plus bas et /api/reviews/moderate.
 */
export async function submitReview(input: NewReviewInput): Promise<void> {
  const { productGid, rating, body, authorName, title } = input;

  if (!productGid || !body.trim() || !authorName.trim()) {
    throw new Error('productGid, body et authorName sont obligatoires.');
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error('La note doit être un entier entre 1 et 5.');
  }
  if (body.length > 3000) {
    throw new Error("L'avis est trop long (3000 caractères max).");
  }
  if (authorName.length > 100) {
    throw new Error('Le nom est trop long (100 caractères max).');
  }

  const fields = [
    { key: 'rating', value: String(rating) },
    { key: 'body', value: body.trim() },
    { key: 'author_name', value: authorName.trim() },
    { key: 'product', value: productGid },
    { key: 'submitted_at', value: new Date().toISOString() },
  ];
  if (title?.trim()) fields.push({ key: 'title', value: title.trim().slice(0, 200) });

  const data = await shopifyAdminFetch<CreateReviewResponse>(CREATE_REVIEW_MUTATION, {
    metaobject: {
      type: METAOBJECT_TYPE,
      fields,
      capabilities: { publishable: { status: 'DRAFT' } },
    },
  });

  const { metaobject, userErrors } = data.metaobjectCreate;
  if (userErrors.length > 0) {
    throw new Error(userErrors.map((e) => e.message).join(', '));
  }

  // Notification best-effort : n'échoue jamais la soumission de l'avis si
  // Klaviyo est indisponible ou mal configuré. Voir lib/klaviyo.ts.
  try {
    const notif = await trackReviewSubmission({
      reviewId: metaobject?.id ?? '',
      productGid,
      rating,
      authorName,
      title,
      body,
    });
    if (!notif.ok) console.error('[reviews] notification Klaviyo échouée', notif.error);
  } catch (err) {
    console.error('[reviews] notification Klaviyo échouée', err);
  }
}

// ----------------------------------------------------------------------------
// Modération — appelée depuis /api/reviews/moderate (lien cliqué dans l'email)
// ----------------------------------------------------------------------------

const SET_REVIEW_STATUS_MUTATION = `
  mutation SetReviewStatus($id: ID!, $metaobject: MetaobjectUpdateInput!) {
    metaobjectUpdate(id: $id, metaobject: $metaobject) {
      metaobject { id }
      userErrors { field message code }
    }
  }
`;

interface SetReviewStatusResponse {
  metaobjectUpdate: {
    metaobject: { id: string } | null;
    userErrors: { field: string[]; message: string; code: string }[];
  };
}

/** Publie un avis en Brouillon (le rend visible sur le site). */
export async function publishReview(id: string): Promise<void> {
  const data = await shopifyAdminFetch<SetReviewStatusResponse>(SET_REVIEW_STATUS_MUTATION, {
    id,
    metaobject: { capabilities: { publishable: { status: 'ACTIVE' } } },
  });
  const { userErrors } = data.metaobjectUpdate;
  if (userErrors.length > 0) throw new Error(userErrors.map((e) => e.message).join(', '));
}

const DELETE_REVIEW_MUTATION = `
  mutation DeleteReview($id: ID!) {
    metaobjectDelete(id: $id) {
      deletedId
      userErrors { field message code }
    }
  }
`;

interface DeleteReviewResponse {
  metaobjectDelete: {
    deletedId: string | null;
    userErrors: { field: string[]; message: string; code: string }[];
  };
}

/** Rejette un avis : suppression définitive du Brouillon. */
export async function rejectReview(id: string): Promise<void> {
  const data = await shopifyAdminFetch<DeleteReviewResponse>(DELETE_REVIEW_MUTATION, { id });
  const { userErrors } = data.metaobjectDelete;
  if (userErrors.length > 0) throw new Error(userErrors.map((e) => e.message).join(', '));
}
