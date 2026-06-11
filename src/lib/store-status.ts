/**
 * Mode boutique ouverte vs pré-lancement (teasing).
 *
 * Depuis le lancement officiel (11 juin 2026), la boutique est OUVERTE par
 * défaut : panier actif, achats possibles. Le mode teasing (waitlist Klaviyo)
 * ne s'active plus que si on le demande explicitement.
 *
 * NOTE : on n'utilise PLUS la variable PUBLIC_STORE_OPEN. Une ancienne valeur
 * `PUBLIC_STORE_OPEN=false` restée sur Vercel forçait le mode waitlist le jour
 * du lancement. Le kill-switch est désormais une variable dédiée,
 * PUBLIC_STORE_CLOSED, qui n'existe nulle part par défaut :
 *   - non définie ou "false" → boutique ouverte (comportement par défaut)
 *   - "true"                 → repasse en mode teasing / waitlist Klaviyo
 *
 * Le préfixe `PUBLIC_` est requis pour qu'Astro/Vite expose la variable.
 * Pour fermer temporairement la boutique : Vercel → Settings → Environment
 * Variables → PUBLIC_STORE_CLOSED = "true" → Redeploy. Supprimer la variable
 * (ou "false") pour rouvrir.
 */
export function isStoreOpen(): boolean {
  return import.meta.env.PUBLIC_STORE_CLOSED !== 'true';
}

/**
 * Date de lancement prévue, affichée dans le bloc waitlist.
 * À ajuster si le lancement glisse.
 */
export const LAUNCH_LABEL = 'Juin 2026';
