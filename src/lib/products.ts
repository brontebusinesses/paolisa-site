/**
 * Catalogue produits — source unique pour la gamme, les fiches (PDP), le panier.
 *
 * Système « rituel numéroté » : N°01 Sérum → N°02 Contour → N°03 Huile/Crème,
 * puis Les Solaires (non numérotés).
 *
 * IMAGES — deux usages distincts :
 *   • `cardImage` = vignette STUDIO (fond gris uniforme, flacon seul) → utilisée
 *     sur les CARTES (home, page gamme, cross-sell).
 *   • `images[]`  = photos SHOPIFY (plusieurs vues) → utilisées sur les FICHES (PDP).
 *
 * PANIER : `shopifyVariantId` = variante postée sur /cart/add. Vérifié 07/07/2026.
 */

export type Tier = 'essentiel' | 'solaire';

export const ACCENTS = {
  vert: '#1FA85C',
  bleu: '#159BD4',
  rose: '#C8398C',
  jaune: '#F2A81D',
  corail: '#FF6B5E',
  ecru: '#ECE6D8',
} as const;

const CDN = 'https://cdn.shopify.com/s/files/1/1056/2155/3484/files';

export interface Product {
  slug: string;
  href: string;
  tier: Tier;
  number: string | null;
  texture?: string;
  category: string;
  ritual: string;
  title: string;
  subtitle: string;
  format: string;
  priceCents: number;
  priceLabel: string;
  shortDescription: string;
  longDescription: string;
  accentColor: string;
  accentName: string;
  accentInverted?: boolean;
  accentDarkText?: boolean;
  /** Vignette studio (fond gris) — cartes / home. */
  cardImage: string;
  /** Photos Shopify (plusieurs vues) — fiche produit (PDP). */
  images: string[];
  shopifyHandle: string;
  shopifyVariantId: string;
  available: boolean;
  status: string;
  actives: string[];
  inci?: string[];
  ingredients?: { index: string; name: string; origin: string; note?: string }[];
  certifications?: string[];
  application?: string;
  ritualSteps?: string[];
}

export const products: Record<string, Product> = {
  /* ===================== LES ESSENTIELS ===================== */

  'serum': {
    slug: 'serum',
    href: '/produit/serum',
    tier: 'essentiel',
    number: 'N°01',
    category: 'SÉRUM',
    ritual: 'PREMIER GESTE',
    title: 'Sérum éclat',
    subtitle: 'exosome & niacinamide · sans parfum',
    format: '30 ml',
    priceCents: 4200,
    priceLabel: '42 €',
    shortDescription:
      'La première étape du rituel. Exosomes, niacinamide et acide hyaluronique pour une peau repulpée, lumineuse.',
    longDescription:
      "Le geste qui ouvre le rituel, sur peau propre. Une texture fluide, sans parfum, qui pénètre vite. Les exosomes soutiennent le microbiome, la niacinamide affine le grain et ravive l'éclat, l'acide hyaluronique repulpe. Convient à toutes les peaux, même sensibles.",
    accentColor: ACCENTS.rose,
    accentName: 'Rose',
    cardImage: '/hero/hero-serum.jpg',
    images: [
      `${CDN}/RoFp4XusXuF8b2Y5tBhTelrKXFjNz5OC.jpg?v=1783437957`,
      `${CDN}/MqYtRQgqkc_g_9d91kdpmEGXLy-OQvhf.jpg?v=1783437957`,
    ],
    shopifyHandle: 'exosome-niacinamide-serum',
    shopifyVariantId: '57882087883084',
    available: true,
    status: 'DISPONIBLE',
    actives: [
      'Exosomes — soutiennent le microbiome',
      'Niacinamide (B3) — lisse le grain, éclat',
      'Acide hyaluronique — repulpe, hydrate',
      'Sans parfum · vegan · sans gluten',
    ],
  },

  'contour-yeux': {
    slug: 'contour-yeux',
    href: '/produit/contour-yeux',
    tier: 'essentiel',
    number: 'N°02',
    category: 'YEUX',
    ritual: 'DEUXIÈME GESTE',
    title: 'Contour des yeux',
    subtitle: 'regard reposé · effet rétinol',
    format: '15 ml',
    priceCents: 3500,
    priceLabel: '35 €',
    shortDescription:
      'Un regard reposé, sans agresser la zone la plus fragile. Alternative douce au rétinol, à base de Bidens Pilosa.',
    longDescription:
      "La zone du contour est fine, elle demande de la douceur. Ce soin mise sur une alternative naturelle au rétinol (Bidens Pilosa 2 %) et le jus d'aloe pour atténuer les cernes et lisser les ridules — sans l'irritation d'un rétinol classique.",
    accentColor: ACCENTS.jaune,
    accentName: 'Jaune',
    accentDarkText: true,
    cardImage: '/hero/hero-contour-yeux.jpg',
    images: [
      `${CDN}/MeRC2BjJ6Zb8Jgxj1PLRlq41mdi_v2j5.jpg?v=1783442493`,
      `${CDN}/6cm5N1ScGRn0d7qzUZMvXW1_cY9El4pH.jpg?v=1783442494`,
      `${CDN}/y4--P1doq2b9gLs2aYJ1arkBL2YBYugh.jpg?v=1783442493`,
    ],
    shopifyHandle: 'retinol-alternative-eye-serum-1',
    shopifyVariantId: '58004997833036',
    available: true,
    status: 'DISPONIBLE',
    actives: [
      'Bidens Pilosa 2 % — alternative au rétinol',
      'Jus d’aloe — apaise, hydrate',
      'Acide hyaluronique — repulpe le contour',
      'Vitamines C & E — éclat, antioxydant',
    ],
  },

  'no-01': {
    slug: 'no-01',
    href: '/huile/no-01',
    tier: 'essentiel',
    number: 'N°03',
    texture: 'Huile',
    category: 'VISAGE',
    ritual: 'RITUEL MATIN',
    title: 'Huile visage',
    subtitle: '5 huiles méditerranéennes · texture huile',
    format: '30 ml',
    priceCents: 4500,
    priceLabel: '45 €',
    shortDescription:
      'Une huile sèche, le matin. Olive, amande, abricot, avocat, églantier et plus — pressées à froid, elle pénètre vite.',
    longDescription:
      "Le soin hydratant du rituel, version huile — pour les peaux qui aiment le gras nourrissant. Une huile sèche qui pénètre vite : olive, amande, abricot, avocat, églantier, complétés de jojoba, onagre, argousier et framboise.",
    accentColor: ACCENTS.vert,
    accentName: 'Vert',
    cardImage: '/hero/hero-huile.jpg',
    images: [
      `${CDN}/QCaRgeWSatPMk_ALohJEVB4tGk8tBcWC.jpg?v=1783438123`,
      `${CDN}/dh10BtaU3z7-cZHhEKD_v-ib3xqQ_TIQ.jpg?v=1783438123`,
      `${CDN}/IqP-jOPER55aKuhok-syhSO6JCHrcWWE.jpg?v=1783438123`,
    ],
    shopifyHandle: 'all-in-one-facial-oil',
    shopifyVariantId: '57879675568460',
    available: true,
    status: 'DISPONIBLE',
    actives: [
      'Olive · Amande · Abricot · Avocat · Églantier',
      'Argousier & framboise — riches en oméga',
      'Vitamine E — antioxydant',
      'Multi-usage · ingrédients bio',
    ],
    inci: [
      'Simmondsia Chinensis (Jojoba) Seed Oil*',
      'Prunus Amygdalus Dulcis (Amande douce) Oil*',
      'Rosa Canina (Églantier) Fruit Extract*',
      'Hippophae Rhamnoides (Argousier) Fruit Oil*',
      'Olea Europaea (Olive) Fruit Oil*',
      'Persea Gratissima (Avocat) Oil*',
      'Prunus Armeniaca (Abricot) Kernel Oil*',
      'Oenothera Biennis (Onagre) Oil*',
      'Rubus Idaeus (Framboise) Seed Oil*',
      'Tocopherol (Vitamine E), Parfum, Limonene**, Linalool**, Citral**',
    ],
    ingredients: [
      { index: '01', name: 'OLIVE',    origin: 'Pression à froid', note: 'Restaure la barrière cutanée.' },
      { index: '02', name: 'AMANDE',   origin: 'Pression à froid', note: 'Apaise les peaux sensibles.' },
      { index: '03', name: 'ABRICOT',  origin: 'Pression à froid', note: 'Donne l\'éclat, texture sèche.' },
      { index: '04', name: 'AVOCAT',   origin: 'Pression à froid', note: 'Nourrit en profondeur.' },
      { index: '05', name: 'ÉGLANTIER (ROSEHIP)', origin: 'Pression à froid', note: 'Régénère, acides gras essentiels.' },
      { index: '06', name: 'argousier · framboise · onagre', origin: '—', note: 'Riches en oméga, souplesse.' },
    ],
    certifications: [
      'Ingrédients issus de l’agriculture biologique',
      'Vegan',
      'Multi-usage',
      'Conditionné en Belgique',
    ],
    application:
      'Trois gouttes dans la paume, qu\'on réchauffe. Une pression douce — front, joues, cou. Trente secondes, devant une fenêtre.',
    ritualSteps: [
      'Trois gouttes dans la paume, qu\'on réchauffe entre les mains.',
      'Une pression douce — front, joues, cou. Sans frotter.',
      'Trente secondes immobile, devant une fenêtre.',
    ],
  },

  'creme': {
    slug: 'creme',
    href: '/produit/creme',
    tier: 'essentiel',
    number: 'N°03',
    texture: 'Crème',
    category: 'VISAGE',
    ritual: 'TROISIÈME GESTE · TEXTURE CRÈME',
    title: 'Crème lissante',
    subtitle: 'alternative au rétinol · toutes peaux',
    format: '50 ml',
    priceCents: 3400,
    priceLabel: '34 €',
    shortDescription:
      'Le soin hydratant, version crème — pour les peaux qui n’aiment pas le gras. Un effet rétinol tout en douceur.',
    longDescription:
      "La même étape que l'huile, texture crème. Soyeuse, à absorption rapide, elle mise sur une alternative naturelle au rétinol (Bidens Pilosa 2 %) avec vitamines C et E et acide hyaluronique pour lisser les ridules et repulper — sans irritation.",
    accentColor: ACCENTS.corail,
    accentName: 'Corail',
    cardImage: '/hero/hero-creme.jpg',
    images: [
      `${CDN}/pIQfWAaB0Cd-47QqEBERPjuf-Mr3wZsR.jpg?v=1783438067`,
      `${CDN}/2uacT2WToKOUhuJiZkTiPa3NDidAEVDW.jpg?v=1783438067`,
      `${CDN}/1xKHb8VkFMLdSepKaAmEkXg8n_xEgqNA.jpg?v=1783438067`,
    ],
    shopifyHandle: 'retinol-alternative-moisturiser',
    shopifyVariantId: '57879856972108',
    available: true,
    status: 'DISPONIBLE',
    actives: [
      'Bidens Pilosa 2 % — alternative au rétinol',
      'Vitamines C & E — éclat, antioxydant',
      'Acide hyaluronique — repulpe, hydrate',
      'Toutes peaux · texture non grasse',
    ],
  },

  /* ===================== LES SOLAIRES ===================== */

  'solaire-teinte': {
    slug: 'solaire-teinte',
    href: '/produit/solaire-teinte',
    tier: 'solaire',
    number: null,
    category: 'SOLAIRE',
    ritual: 'PROTECTION · JOUR',
    title: 'Voile solaire teinté SPF30',
    subtitle: 'fini naturel embellisseur',
    format: 'SPF30',
    priceCents: 3900,
    priceLabel: '39 €',
    shortDescription:
      'Une protection haute qui unifie le teint d’un voile naturel. La dernière étape, avant de sortir.',
    longDescription:
      "Protection solaire teintée à filtres minéraux, SPF30. Fini naturel embellisseur, sans film blanc. Enrichie en argousier et acide hyaluronique pour ne pas dessécher. Le geste qui clôt le rituel les jours de lumière.",
    accentColor: ACCENTS.bleu,
    accentName: 'Bleu',
    cardImage: '/hero/hero-solaire-teinte.jpg',
    images: [
      `${CDN}/ybSYPTcTamRoE2WtnOYgMkz7ctRTor5j.jpg?v=1783438332`,
      `${CDN}/DTOjjlJpdI0oVAkDbrc-6wCz_a2G23dj.jpg?v=1783438331`,
    ],
    shopifyHandle: 'sunscreen-spf30-with-tint',
    shopifyVariantId: '57937479860556',
    available: true,
    status: 'DISPONIBLE',
    actives: [
      'Filtres minéraux — SPF30, haute protection',
      'Teinte unifiante, fini naturel',
      'Acide hyaluronique — hydrate',
      'Testé dermatologiquement',
    ],
  },

  'stick-solaire': {
    slug: 'stick-solaire',
    href: '/produit/stick-solaire',
    tier: 'solaire',
    number: null,
    category: 'SOLAIRE',
    ritual: 'PROTECTION · NOMADE',
    title: 'Stick solaire SPF50',
    subtitle: 'minéral · invisible · nomade',
    format: 'SPF50',
    priceCents: 2800,
    priceLabel: '28 €',
    shortDescription:
      'Un stick minéral SPF50, invisible, à glisser partout. La retouche solaire de la journée.',
    longDescription:
      "Protection minérale SPF50 en format stick — simple, sans effort, sans traces blanches. À glisser dans le sac pour retoucher pommettes, nez, contour des yeux au fil de la journée.",
    accentColor: ACCENTS.bleu,
    accentName: 'Bleu (inversé)',
    accentInverted: true,
    cardImage: '/hero/hero-stick-solaire.jpg',
    images: [
      `${CDN}/jkDaYg-_3OJcAxBzWvGDfVj8_lZPegGb.jpg?v=1783438212`,
      `${CDN}/AqNF9Hw1W4eZR6lZLt84n5NgMlxYZKmF.jpg?v=1783438212`,
      `${CDN}/IpJKYRawa0JV8sbOT6zOoTERQ2R9OCBN.jpg?v=1783438212`,
    ],
    shopifyHandle: 'sun-protection-spf50-stick-no-tint',
    shopifyVariantId: '57882125926732',
    available: true,
    status: 'DISPONIBLE',
    actives: [
      'Filtres minéraux — SPF50, très haute protection',
      'Invisible — sans traces blanches',
      'Format stick nomade',
      'Toutes peaux',
    ],
  },
};

const ORDER = ['serum', 'contour-yeux', 'no-01', 'creme', 'solaire-teinte', 'stick-solaire'];

export const getProduct = (slug: string): Product | undefined => products[slug];
export const productList = (): Product[] => ORDER.map((s) => products[s]).filter(Boolean);
export const essentials = (): Product[] => productList().filter((p) => p.tier === 'essentiel');
export const solaires = (): Product[] => productList().filter((p) => p.tier === 'solaire');

export const productLabel = (p: Product): string =>
  p.number ? (p.texture ? `${p.number} · ${p.texture}` : p.number) : 'SOLAIRE';
