/**
 * Panier côté client (localStorage). Le site Astro est headless : on gère le
 * panier localement, et on ne bascule vers le checkout Shopify qu'au paiement
 * (via un permalink /cart/{variant}:{qty},…).
 */
export interface CartLine {
  variantId: string;
  slug: string;
  title: string;
  priceCents: number;
  qty: number;
  image: string;
  href: string;
}

const KEY = 'paolisa_cart_v1';
export const SHOP = 'paolisa-studio.myshopify.com';

export function getCart(): CartLine[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CartLine[]) : [];
  } catch {
    return [];
  }
}

function save(cart: CartLine[]) {
  localStorage.setItem(KEY, JSON.stringify(cart));
  document.dispatchEvent(new CustomEvent('cart:change', { detail: cart }));
}

export function addItem(line: CartLine) {
  const cart = getCart();
  const existing = cart.find((l) => l.variantId === line.variantId);
  if (existing) existing.qty += line.qty;
  else cart.push({ ...line });
  save(cart);
}

export function setQty(variantId: string, qty: number) {
  const cart = getCart();
  const l = cart.find((x) => x.variantId === variantId);
  if (!l) return;
  l.qty = Math.max(1, Math.min(99, qty));
  save(cart);
}

export function removeItem(variantId: string) {
  save(getCart().filter((l) => l.variantId !== variantId));
}

export function clear() {
  save([]);
}

export function count(): number {
  return getCart().reduce((n, l) => n + l.qty, 0);
}

export function subtotalCents(): number {
  return getCart().reduce((n, l) => n + l.priceCents * l.qty, 0);
}

export function money(cents: number): string {
  return (cents / 100).toLocaleString('fr-BE', { style: 'currency', currency: 'EUR' });
}

/** Permalink Shopify : construit le panier puis redirige vers le checkout. */
export function checkoutUrl(): string {
  const cart = getCart();
  if (!cart.length) return '#';
  const items = cart.map((l) => `${l.variantId}:${l.qty}`).join(',');
  return `https://${SHOP}/cart/${items}?return_to=/checkout`;
}
