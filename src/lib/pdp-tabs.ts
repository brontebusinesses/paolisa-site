/**
 * Construction des onglets PDP (§4.2) — extraite du .astro pour éviter les
 * conflits du parser de frontmatter avec les template literals multi-lignes.
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
  const inciList = product.inci
    .map((line) => '<li>' + escapeHtml(line) + '</li>')
    .join('');

  const ritualList = product.ritualSteps
    .map(
      (s, i) =>
        '<li><span class="mono-label text-ink-tertiary mr-3">0' +
        (i + 1) +
        '</span>' +
        escapeHtml(s) +
        '</li>'
    )
    .join('');

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

  const certList = product.certifications
    .map((c) => '<li>· ' + escapeHtml(c) + '</li>')
    .join('');

  return [
    {
      question: '— COMPOSITION',
      defaultOpen: true,
      answer:
        '<p class="mb-6">Cinq huiles végétales pures + l’aroma signature, dans une base certifiée COSMOS Organic. 99% naturel.</p>' +
        '<p class="mono-label text-ink-tertiary mb-3">INCI COMPLET</p>' +
        '<ul class="space-y-2 body-m text-ink-tertiary">' +
        inciList +
        '</ul>' +
        '<p class="mono-micro text-ink-tertiary mt-6">* Issu de l’agriculture biologique &nbsp;·&nbsp; ** Composants naturels d’huiles essentielles.</p>',
    },
    {
      question: '— APPLICATION',
      answer:
        '<p class="mb-6">' +
        escapeHtml(product.application) +
        '</p>' +
        '<ol class="space-y-3 body-l">' +
        ritualList +
        '</ol>',
    },
    {
      question: '— ORIGINE DES INGRÉDIENTS',
      answer: '<ul class="space-y-4">' + originList + '</ul>',
    },
    {
      question: '— CERTIFICATIONS',
      answer: '<ul class="space-y-2 body-l">' + certList + '</ul>',
    },
  ];
}
