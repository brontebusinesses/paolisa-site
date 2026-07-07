/**
 * Catalogue produits — source unique pour la gamme, les fiches (PDP), le panier.
 *
 * Système « rituel numéroté » (juillet 2026, passage 1 → 6 produits) :
 *   Les Essentiels (numérotés, dans l'ordre du geste) :
 *     N°01 Sérum → N°02 Contour des yeux → N°03 Soin (Huile OU Crème, 2 textures)
 *   Les Solaires (non numérotés, occasionnels) : Voile teinté SPF30, Stick SPF50
 *
 * COULEURS : chaque flacon porte une couleur (façon Nespresso). Définies dans
 * `accentColor` — pour en corriger une, changer la valeur hex à UN seul endroit.
 * Confirmées : Sérum = rose, Yeux = jaune. Proposées : Huile = vert, Crème =
 * corail, Solaires = bleu (le stick en « étiquette inversée »).
 *
 * IMAGES : URLs du CDN Shopify (publiques, stables). Utilisées sur les fiches.
 * La gamme (grille) montre les arches colorées (système de marque), pas les photos.
 *
 * PANIER : `shopifyVariantId` = variante postée sur /cart/add. Prix/variants
 * vérifiés sur la boutique PAOLISA le 07/07/2026.
 */

export type Tier = 'essentiel' | 'solaire';

/** Palette gamme. Le terracotta reste réservé au point ●. */
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
  /** Photos produit (CDN Shopify). La première est l'image principale. */
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

  // N°01 — Sérum éclat
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
    images: ['/hero/hero-serum.jpg'],
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

  // N°02 — Contour des yeux
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
    images: ['/hero/hero-contour-yeux.jpg'],
    shopifyHandle: 'retinol-alternative-eye-serum',
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

  // N°03 · Huile — Huile visage (fiche crafted : /huile/no-01)
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
    images: ['/hero/hero-huile.jpg'],
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

  // N°03 · Crème — Crème lissante
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
    images: ['/hero/hero-creme.jpg'],
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

  // Voile solaire teinté SPF30
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
    images: ['/hero/hero-solaire-teinte.jpg'],
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

  // Stick solaire SPF50 (étiquette inversée)
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
    images: ['/hero/hero-stick-solaire.jpg'],
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

/** Ordre d'affichage de la gamme (rituel puis solaires). */
const ORDER = ['serum', 'contour-yeux', 'no-01', 'creme', 'solaire-teinte', 'stick-solaire'];

export const getProduct = (slug: string): Product | undefined => products[slug];

export const productList = (): Product[] =>
  ORDER.map((s) => products[s]).filter(Boolean);

export const essentials = (): Product[] =>
  productList().filter((p) => p.tier === 'essentiel');

export const solaires = (): Product[] =>
  productList().filter((p) => p.tier === 'solaire');

/** Étiquette N° + texture pour l'affichage, ex. "N°03 · Huile". */
export const productLabel = (p: Product): string =>
  p.number ? (p.texture ? `${p.number} · ${p.texture}` : p.number) : 'SOLAIRE';
