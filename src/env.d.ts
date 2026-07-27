/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  // Shopify Storefront API
  readonly SHOPIFY_STORE_DOMAIN?: string;       // ex. "paolisa-studio.myshopify.com"
  readonly SHOPIFY_STOREFRONT_TOKEN?: string;   // public storefront access token
  // Shopify Admin API — avis produit maison (lib/reviews.ts). App « Avis
  // produit — Admin API » créée via le Dev Dashboard Shopify (dev.shopify.com),
  // scopes read_metaobjects + write_metaobjects. Le Dev Dashboard ne révèle
  // plus de token statique : Client ID + Secret, échangés contre un access
  // token de 24h par le code (grant client_credentials).
  readonly SHOPIFY_ADMIN_CLIENT_ID?: string;
  readonly SHOPIFY_ADMIN_CLIENT_SECRET?: string;
  // Klaviyo
  readonly KLAVIYO_API_KEY?: string;
  readonly KLAVIYO_LIST_ID?: string;
  // Site
  readonly PUBLIC_SITE_URL?: string;
  // Mode boutique : "true" → ouvert (panier actif), sinon → mode pré-lancement (waitlist)
  readonly STORE_OPEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
