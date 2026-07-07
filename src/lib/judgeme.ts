/**
 * Judge.me — intégration headless.
 * Le site Astro/Vercel n'est pas servi par le thème Shopify, donc on utilise
 * le widget Judge.me « custom platform » : preloader JS + PUBLIC_TOKEN, et des
 * <div class="jdgm-widget …" data-id="<ID produit Shopify>"> sur les fiches.
 *
 * TOKEN : à mettre dans la variable d'environnement Vercel PUBLIC_JUDGEME_TOKEN
 * (Judge.me → Settings → Judge.me API → « Public token »). Sans elle, le
 * preloader n'est pas chargé (les widgets restent inertes, aucune erreur).
 */
export const JUDGEME_SHOP_DOMAIN = 'paolisa-studio.myshopify.com';

/** slug produit (products.ts) → ID produit Shopify numérique (data-id Judge.me). */
const IDS: Record<string, string> = {
  'serum': '15840699154764',
  'contour-yeux': '15882178068812',
  'no-01': '15840284606796',
  'creme': '15840333791564',
  'solaire-teinte': '15855525757260',
  'stick-solaire': '15840718946636',
};

export const judgemeProductId = (slug: string): string | undefined => IDS[slug];
