/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  // Shopify Storefront API
  readonly SHOPIFY_STORE_DOMAIN?: string;       // ex. "paolisa-studio.myshopify.com"
  readonly SHOPIFY_STOREFRONT_TOKEN?: string;   // public storefront access token
  // Klaviyo
  readonly KLAVIYO_API_KEY?: string;
  readonly KLAVIYO_LIST_ID?: string;
  // Site
  readonly PUBLIC_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
