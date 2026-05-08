/**
 * POST /api/checkout — crée un panier Shopify et redirige vers le checkout hosted.
 *
 * Body (form data) :
 *   productSlug : slug interne (ex. "no-01") — utilisé pour retrouver le shopifyHandle
 *   quantity    : 1..9
 *
 * Réponse : 303 See Other → URL de checkout Shopify (paiement hosted).
 */
import type { APIRoute } from 'astro';
import { getProduct } from '../../lib/products';
import { getProductByHandle, createCart, isShopifyConfigured } from '../../lib/shopify';

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return new Response('Invalid form data', { status: 400 });
  }

  const productSlug = String(formData.get('productSlug') ?? '');
  const quantityRaw = Number(formData.get('quantity') ?? 1);
  const quantity = Math.min(Math.max(1, Math.floor(quantityRaw || 1)), 9);

  const product = getProduct(productSlug);
  if (!product) {
    return new Response('Product not found', { status: 404 });
  }
  if (!product.available) {
    return new Response('Product not available', { status: 410 });
  }
  if (!product.shopifyHandle) {
    return new Response('Product not configured for Shopify', { status: 500 });
  }

  if (!isShopifyConfigured()) {
    return new Response(
      'Shopify non configuré (SHOPIFY_STORE_DOMAIN ou SHOPIFY_STOREFRONT_TOKEN manquant).',
      { status: 500 }
    );
  }

  try {
    // 1. Récupère le produit Shopify pour obtenir la variant ID.
    const shopifyProduct = await getProductByHandle(product.shopifyHandle);

    if (!shopifyProduct) {
      console.error('[api/checkout] Product not found in Shopify', product.shopifyHandle);
      return new Response('Product not found in Shopify', { status: 404 });
    }

    if (!shopifyProduct.availableForSale) {
      return new Response('Product not available for sale', { status: 410 });
    }

    // Pour v1 on prend le premier variant (un seul format 30ml).
    const variant = shopifyProduct.variants.nodes.find((v) => v.availableForSale)
      ?? shopifyProduct.variants.nodes[0];

    if (!variant) {
      return new Response('No variant available', { status: 500 });
    }

    // 2. Crée un panier avec la ligne demandée.
    const cart = await createCart(variant.id, quantity);

    // 3. Redirige vers le checkout Shopify hosted.
    return redirect(cart.checkoutUrl, 303);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown Shopify error';
    console.error('[api/checkout]', msg);
    return new Response(`Checkout error : ${msg}`, { status: 500 });
  }
};

export const ALL: APIRoute = () => new Response('Method not allowed', { status: 405 });
