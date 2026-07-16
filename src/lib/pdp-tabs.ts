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

const USAGE_TIPS: Record<string, { lead: string; tips: string[] }> = {
  'contour-yeux': {
    lead:
      "Un soin actif, a introduire en douceur : l'alternative naturelle au retinol (Bidens Pilosa) est efficace, on laisse donc a la peau le temps de s'y habituer. On y va vraiment progressivement.",
    tips: [
      'Semaines 1 et 2 : 2 a 3 fois par semaine (un matin sur deux ou sur trois), le matin uniquement.',
      'Semaines 3 et 4 : chaque matin. Le soir, un soin hydratant pour les yeux, ou rien.',
      'Apres un mois, si la peau le tolere bien : matin et soir.',
      "Une tres petite quantite suffit : depose sur l'os du contour (jamais sur la paupiere mobile) et tapote du bout du doigt jusqu'a absorption.",
    ],
  },
  'serum': {
    lead: 'Le premier geste du rituel, sur peau propre.',
    tips: [
      'Une a deux pompes, matin et soir, avant le soin hydratant.',
      "Laisse penetrer quelques secondes avant l'etape suivante.",
    ],
  },
  'creme': {
    lead: 'Le soin hydratant du rituel, version creme - texture non grasse.',
    tips: [
      "Une a deux pompes selon ton besoin d'hydratation.",
      'Apres le serum (et le contour), matin et/ou soir. Fais penetrer en mouvements doux.',
    ],
  },
  'no-01': {
    lead:
      'Le soin nourrissant du rituel, version huile seche - pour les peaux normales a seches, et souvent tres bien toleree par les peaux mixtes.',
    tips: [
      'Quelques gouttes suffisent, en derniere etape le soir, ou melangees a ta creme le matin.',
      'Chauffe entre les paumes et presse sur le visage plutot que de frotter.',
    ],
  },
  'solaire-teinte': {
    lead: 'Couvrance moyenne et modulable : on construit petit a petit pour doser au plus juste.',
    tips: [
      'Au doigt : une demi-pompe a la fois, zone par zone, puis on ajoute si besoin.',
      'Au pinceau : depose d\'abord un peu sur le dos de la main, puis reprends et construis par petites touches.',
      'Derniere etape du matin, sur un soin hydratant bien absorbe.',
      'Haute protection a renouveler dans la journee, surtout apres transpiration ou baignade.',
    ],
  },
  'stick-solaire': {
    lead: 'La protection nomade, en retouche dans la journee.',
    tips: [
      'Passe le stick directement sur les zones exposees (pommettes, nez, front, arete).',
      'Superpose 2 a 3 passages pour une couche suffisante, puis estompe du bout des doigts si besoin.',
      'Haute protection a renouveler, surtout apres transpiration ou baignade.',
    ],
  },
};

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

  // — CONSEILS D'UTILISATION : si des conseils existent pour ce produit.
  const usage = USAGE_TIPS[product.slug];
  if (usage) {
    const tipsList = usage.tips
      .map((t) => '<li>' + escapeHtml(t) + '</li>')
      .join('');
    tabs.push({
      question: "— CONSEILS D'UTILISATION",
      answer:
        '<p class="mb-6">' +
        escapeHtml(usage.lead) +
        '</p>' +
        '<ul class="space-y-3 body-l">' +
        tipsList +
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
