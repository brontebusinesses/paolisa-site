/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly STRIPE_SECRET_KEY?: string;
  readonly STRIPE_PUBLISHABLE_KEY?: string;
  readonly STRIPE_PRICE_NO01?: string;
  readonly KLAVIYO_API_KEY?: string;
  readonly KLAVIYO_LIST_ID?: string;
  readonly PUBLIC_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
