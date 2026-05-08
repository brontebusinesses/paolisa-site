/**
 * Mode pré-lancement (teasing) vs ouvert.
 *
 * Contrôlé par la variable d'environnement STORE_OPEN :
 *   - STORE_OPEN=true  → boutique ouverte, panier actif, achats possibles
 *   - STORE_OPEN=false (ou non définie) → mode teasing, waitlist Klaviyo à la place du panier
 *
 * Pour ouvrir la boutique le jour du lancement :
 *   - Vercel → Settings → Environment Variables → STORE_OPEN → "true"
 *   - Redeploy
 */
export function isStoreOpen(): boolean {
  return import.meta.env.STORE_OPEN === 'true';
}

/**
 * Date de lancement prévue, affichée dans le bloc waitlist.
 * À ajuster si le lancement glisse.
 */
export const LAUNCH_LABEL = 'Juin 2026';
