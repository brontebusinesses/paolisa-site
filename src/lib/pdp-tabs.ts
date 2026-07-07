/**
 * Construction des onglets PDP (§4.2) — extraite du .astro pour éviter les
 * conflits du parser de frontmatter avec les template literals multi-lignes.
 *
 * Tolérant : les produits sans contenu riche (inci/ingredients/certifications)
 * retombent sur `actives` + `longDescription`. Seuls les onglets disponibles
 * sont générés.
 */
import type { Product } from './products';

export interface PdpTab {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function buildPdpTabs(product: Product): PdpTab[] {
  const tabs: PdpTab[] = [];

  // — COMPOSITION : INCI complet si dispo, sinon actifs clés.
  if (product.inci && product.inci.length) {
    const inciList = product.inci
      .map((line) => '<li>' + escapeHtml(line) + '</li>')
      .join('');
    tabs.push({
      question: '— COMPOSITION',
      defaultOpen: true,
      answer:
        '<p class="mb-6">' +
        escapeHtml(product.longDescription) +
        '</p>' +
        '<p class="mono-label text-ink-tertiary mb-3">INCI COMPLET</p>' +
        '<ul class="space-y-2 body-m text-ink-tertiary">' +
        inciList +
        '</ul>' +
        '<p class="mono-micro text-ink-tertiary mt-6">* Issu de l’agriculture biologique &nbsp;·&nbsp; ** Composants naturels d’huiles essentielles.</p>',
    });
  } else {
    const activesList = product.actives
      .map((a) => '<li>· ' + escapeHtml(a) + '</li>')
      .join('');
    tabs.push({
      question: '— COMPOSITION',
      defaultOpen: true,
      answer:
        '<p class="mb-6">' +
        escapeHtml(product.longDescription) +
        '</p>' +
        '<p class="mono-label text-ink-tertiary mb-3">ACTIFS CLÉS</p>' +
        '<ul class="space-y-2 body-l">' +
        activesList +
        '</ul>',
    });
  }

  // — APPLICATION : uniquement si renseignée.
  if (product.application) {
    const ritualList = (product.ritualSteps ?? [])
      .map(
        (s, i) =>
          '<li><span class="mono-label text-ink-tertiary mr-3">0' +
          (i + 1) +
          '</span>' +
          escapeHtml(s) +
          '</li>'
      )
      .join('');
    tabs.push({
      question: '— APPLICATION',
      answer:
        '<p class="mb-6">' +
        escapeHtml(product.application) +
        '</p>' +
        (ritualList ? '<ol class="space-y-3 body-l">' + ritualList + '</ol>' : ''),
    });
  }

  // — ORIGINE DES INGRÉDIENTS : uniquement si détaillée.
  if (product.ingredients && product.ingredients.length) {
    const originList = product.ingredients
      .map((ing) => {
        const head =
          '<p class="mono-label text-ink-tertiary mb-1">' +
          ing.index +
          ' · ' +
          escapeHtml(ing.name.toUpperCase()) +
          ' — ' +
          escapeHtml(ing.origin) +
          '</p>';
        const note = ing.note ? '<p class="body-m">' + escapeHtml(ing.note) + '</p>' : '';
        return '<li>' + head + note + '</li>';
      })
      .join('');
    tabs.push({
      question: '— ORIGINE DES INGRÉDIENTS',
      answer: '<ul class="space-y-4">' + originList + '</ul>',
    });
  }

  // — CERTIFICATIONS : uniquement si renseignées.
  if (product.certifications && product.certifications.length) {
    const certList = product.certifications
      .map((c) => '<li>· ' + escapeHtml(c) + '</li>')
      .join('');
    tabs.push({
      question: '— CERTIFICATIONS',
      answer: '<ul class="space-y-2 body-l">' + certList + '</ul>',
    });
  }

  return tabs;
}
