/**
 * Mode boutique ouverte vs pré-lancement (teasing).
 *
 * Depuis le lancement officiel (11 juin 2026), la boutique est OUVERTE par
 * défaut : panier actif, achats possibles. Le mode teasing (waitlist Klaviyo)
 * ne s'active plus que si on le demande explicitement.
 *
 * Kill-switch via la variable d'environnement PUBLIC_STORE_OPEN :
 *   - non définie ou "true" → boutique ouverte (comportement par défaut)
 *   - "false"             → repasse en mode teasing / waitlist Klaviyo
 *
 * Le préfixe `PUBLIC_` est requis pour qu'Astro/Vite expose la variable
 * via `import.meta.env`. Pour fermer temporairement la boutique :
 *   - Vercel → Settings → Environments → Production → PUBLIC_STORE_OPEN → "false"
 *   - Redeploy. Repasser à "true" (ou supprimer la variable) pour rouvrir.
 */
export function isStoreOpen(): boolean {
  return import.meta.env.PUBLIC_STORE_OPEN !== 'false';
}

/**
 * Date de lancement prévue, affichée dans le bloc waitlist.
 * À ajuster si le lancement glisse.
 */
export const LAUNCH_LABEL = 'Juin 2026';
