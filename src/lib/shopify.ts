/**
 * Client Shopify Storefront API — uniquement côté serveur (API routes Astro).
 * Documentation : https://shopify.dev/docs/api/storefront
 *
 * Architecture v1 (paolisa.eu) :
 *   - Le site Astro affiche le produit (titre/description/composition statiques
 *     via lib/products.ts pour garder le contrôle éditorial).
 *   - Le bouton "AJOUTER AU PANIER" appelle /api/checkout, qui :
 *       1. Récupère la variant ID via getProductByHandle()
 *       2. Crée un cart via createCart()
 *       3. Redirige vers cart.checkoutUrl (Shopify Checkout hosted)
 *   - Après paiement, Shopify gère la commande. La cliente reçoit un email,
 *     et l'admin Shopify a la commande pour fulfillment.
 */

const STOREFRONT_API_VERSION = '2024-10';

const SHOPIFY_DOMAIN = import.meta.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_TOKEN = import.meta.env.SHOPIFY_STOREFRONT_TOKEN;

export const isShopifyConfigured = (): boolean =>
  Boolean(SHOPIFY_DOMAIN && SHOPIFY_TOKEN);

/**
 * Wrapper GraphQL minimal pour la Storefront API.
 * Lance une exception si la requête HTTP échoue ou si Shopify renvoie des errors.
 */
async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  if (!isShopifyConfigured()) {
    throw new Error(
      'Shopify non configuré : SHOPIFY_STORE_DOMAIN et SHOPIFY_STOREFRONT_TOKEN requis.'
    );
  }

  const url = `https://${SHOPIFY_DOMAIN}/api/${STOREFRONT_API_VERSION}/graphql.json`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN ?? '',
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Shopify HTTP ${res.status} : ${text.slice(0, 300)}`);
  }

  const json = (await res.json()) as { data?: T; errors?: unknown[] };

  if (json.errors && json.errors.length > 0) {
    throw new Error(`Shopify GraphQL errors : ${JSON.stringify(json.errors).slice(0, 500)}`);
  }

  if (!json.data) {
    throw new Error('Shopify : réponse sans data');
  }

  return json.data;
}

// ----------------------------------------------------------------------------
// Types Shopify (sous-ensemble qu'on consomme)
// ----------------------------------------------------------------------------

export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: ShopifyMoney;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  availableForSale: boolean;
  priceRange: {
    minVariantPrice: ShopifyMoney;
  };
  variants: {
    nodes: ShopifyVariant[];
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
}

// ----------------------------------------------------------------------------
// Queries / Mutations
// ----------------------------------------------------------------------------

const PRODUCT_BY_HANDLE_QUERY = `
  query getProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      availableForSale
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      variants(first: 10) {
        nodes {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const data = await shopifyFetch<{ product: ShopifyProduct | null }>(
    PRODUCT_BY_HANDLE_QUERY,
    { handle }
  );
  return data.product;
}

const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

interface CartCreateResponse {
  cartCreate: {
    cart: ShopifyCart | null;
    userErrors: { field: string[]; message: string }[];
  };
}

/**
 * Crée un panier Shopify avec une seule ligne (un variant + une quantité).
 * Renvoie l'URL de checkout hosted Shopify.
 */
export async function createCart(
  merchandiseId: string,
  quantity: number
): Promise<ShopifyCart> {
  const data = await shopifyFetch<CartCreateResponse>(CART_CREATE_MUTATION, {
    input: {
      lines: [
        {
          merchandiseId,
          quantity,
        },
      ],
    },
  });

  const errors = data.cartCreate.userErrors;
  if (errors && errors.length > 0) {
    throw new Error(`cartCreate userErrors : ${JSON.stringify(errors).slice(0, 300)}`);
  }

  if (!data.cartCreate.cart) {
    throw new Error('cartCreate : cart est null');
  }

  return data.cartCreate.cart;
}
