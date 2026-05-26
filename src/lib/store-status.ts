/**
 * Mode pré-lancement (teasing) vs ouvert.
 *
 * Contrôlé par la variable d'environnement PUBLIC_STORE_OPEN :
 *   - PUBLIC_STORE_OPEN=true  → boutique ouverte, panier actif, achats possibles
 *   - PUBLIC_STORE_OPEN=false (ou non définie) → mode teasing, waitlist Klaviyo à la place du panier
 *
 * Le préfixe `PUBLIC_` est requis pour qu'Astro/Vite expose la variable
 * via `import.meta.env`. Sans ce préfixe, la valeur reste undefined au build
 * et le site affiche toujours le mode teasing.
 *
 * Pour ouvrir la boutique le jour du lancement :
 *   - Vercel → Settings → Environments → Production → PUBLIC_STORE_OPEN → "true"
 *   - Redeploy (sans cache la première fois pour être sûr)
 */
export function isStoreOpen(): boolean {
  return import.meta.env.PUBLIC_STORE_OPEN === 'true';
}

/**
 * Date de lancement prévue, affichée dans le bloc waitlist.
 * À ajuster si le lancement glisse.
 */
export const LAUNCH_LABEL = 'Juin 2026';
