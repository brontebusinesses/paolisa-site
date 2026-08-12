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

export type Tier = 'essentiel' | 'solaire' | 'craquage';

export const ACCENTS = {
  vert: '#1FA85C',
  bleu: '#159BD4',
  rose: '#C8398C',
  jaune: '#F2A81D',
  corail: '#FF6B5E',
  ecru: '#ECE6D8',
  poudre: '#F2B8C6',
  chartreuse: '#CBDB39',
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
    inci: [
      'Aqua/Water',
      'Dicaprylyl Carbonate',
      'Glycerin',
      'Pentylene Glycol',
      'Cetearyl Alcohol',
      'Polyglyceryl-6 Stearate',
      'Butylene Glycol',
      'Niacinamide',
      'Simmondsia Chinensis (Jojoba) Seed Oil*',
      'Pyrus Malus Fruit Extract',
      'Polyglyceryl-6 Behenate',
      'Caprylic/Capric Triglyceride',
      'Xanthan Gum',
      'Phospholipids',
      'Lactobacillus Ferment',
      'Lactic Acid',
      'Sodium Phytate',
      'Centella Asiatica Leaf Extract',
      'Hydrolyzed Hyaluronic Acid',
      'Sodium Hyaluronate',
      'CI 77491 (Oxydes de fer)',
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
    subtitle: 'regard reposé · alternative au rétinol',
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
    inci: [
      'Aloe Barbadensis (Aloe) Leaf Juice*',
      'Glycerin*',
      'Coconut Alkanes',
      'Pentylene Glycol',
      'Aqua/Water',
      'Simmondsia Chinensis (Jojoba) Seed Oil*',
      'Sodium PCA',
      'Polyglyceryl-6 Stearate',
      'Glyceryl Stearate Citrate',
      'Borago Officinalis (Bourrache) Seed Oil*',
      'Caprylic/Capric Triglyceride',
      'Dipalmitoyl Hydroxyproline',
      'Ricinus Communis (Ricin) Seed Oil',
      'Astrocaryum Murumuru Seed Butter',
      'Gossypium Herbaceum Seed Oil',
      'Bidens Pilosa Extract',
      'Linum Usitatissimum Seed Oil',
      'Parfum/Fragrance',
      'CI 77163 (Oxychlorure de bismuth)',
      'Polyglyceryl-6 Behenate',
      'Rhus Verniciflua Peel Cera/Rhus Succedanea Fruit Cera',
      'Xanthan Gum',
      'Aesculus Hippocastanum (Marronnier d’Inde) Seed Extract',
      'Cellulose',
      'Tocopherol',
      'Ascorbyl Palmitate',
      'Potassium Hydroxide',
      'Mangifera Indica (Mangue) Seed Butter*',
      'Hydrolyzed Hyaluronic Acid',
      'Sodium Hyaluronate',
      'Sodium Phytate',
      'Octyldodecanol',
      'Alteromonas Ferment Extract',
      'Phenethyl Alcohol',
      'Escin',
      'Geraniol**',
      'Citronellol**',
      'Pelargonium Graveolens Flower Oil',
      'Linalool**',
      'Citral**',
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
      'Decyl Cocoate',
      'Prunus Amygdalus Dulcis (Amande douce) Oil*',
      'Dicaprylyl Carbonate',
      'Rosa Canina (Églantier) Fruit Extract*',
      'Coco-Caprylate/Caprate',
      'Hippophae Rhamnoides (Argousier) Fruit Oil*',
      'Parfum/Fragrance',
      'Tocopherol',
      'Undecane',
      'Olea Europaea (Olive) Fruit Oil*',
      'Persea Gratissima (Avocat) Oil*',
      'Prunus Armeniaca (Abricot) Kernel Oil*',
      'Tridecane',
      'Oenothera Biennis (Onagre) Oil*',
      'Prunus Domestica (Prune) Seed Oil',
      'Avena Sativa (Avoine) Kernel Oil*',
      'Rubus Idaeus (Framboise) Seed Oil*',
      'Solanum Lycopersicum (Tomate) Fruit Extract*',
      'Limonene**',
      'Citrus Aurantium Bergamia Peel Oil (Bergamote)',
      'Citrus Aurantium Peel Oil (Orange amère)',
      'Citrus Limon Peel Oil (Citron)',
      'Linalyl Acetate**',
      'Citronellol**',
      'Pinene**',
      'Linalool**',
      'Geranyl Acetate**',
      'Geraniol**',
      'Citral**',
      'Mentha Viridis Leaf Oil (Menthe verte)',
      'Terpinolene**',
      'Carvone**',
      'Benzyl Salicylate**',
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
      'Le soin hydratant, version crème — pour les peaux qui n’aiment pas le gras. Une alternative au rétinol tout en douceur.',
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
    inci: [
      'Aloe Barbadensis (Aloe) Leaf Juice*',
      'Simmondsia Chinensis (Jojoba) Seed Oil*',
      'Glycerin*',
      'Pentylene Glycol',
      'Polyglyceryl-6 Stearate',
      'Cetearyl Alcohol',
      'Aqua/Water',
      'Sodium PCA',
      'Dipalmitoyl Hydroxyproline',
      'Astrocaryum Murumuru Seed Butter',
      'Hippophae Rhamnoides (Argousier) Fruit Extract*',
      'Gossypium Herbaceum Seed Oil',
      'Propanediol',
      'Bidens Pilosa Extract',
      'Dicaprylyl Carbonate',
      'Polyglyceryl-6 Behenate',
      'Parfum/Fragrance',
      'Linum Usitatissimum Seed Oil',
      'Mangifera Indica (Mangue) Seed Butter*',
      'Caprylic/Capric Triglyceride',
      'Coco-Caprylate',
      'Xanthan Gum',
      'Octyldodecanol',
      'Palmitic Acid',
      'Stearic Acid',
      'Tocopherol',
      'Ascorbyl Palmitate',
      'Potassium Hydroxide',
      'Rhodomyrtus Tomentosa (Myrte rose) Fruit Extract',
      'Hydrolyzed Hyaluronic Acid',
      'Sodium Hyaluronate',
      'Sodium Phytate',
      'Alteromonas Ferment Extract',
      'Phenethyl Alcohol',
      'Geraniol**',
      'Citronellol**',
      'Pelargonium Graveolens Flower Oil',
      'Linalool**',
      'Citral**',
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
    inci: [
      'Zinc Oxide',
      'Aqua',
      'Dicaprylyl Carbonate',
      'Isoamyl Laurate',
      'Lecithin',
      'Polyglyceryl-3 Ricinoleate',
      'Glycerin',
      'Butylene Glycol',
      'Sorbitan Olivate',
      'CI 77891 (Dioxyde de titane)',
      'Oryza Sativa Bran Oil',
      'Vegetable Oil',
      'Helianthus Annuus Seed Wax',
      'Oryza Sativa Bran Wax',
      'Rhus Succedanea Fruit Wax',
      'Hydrated Silica',
      'Parfum',
      'Sodium Chloride',
      'Xanthan Gum',
      'Sorbitan Caprylate',
      'Caprylic/Capric Triglyceride',
      'Polyhydroxystearic Acid',
      'Jojoba Esters',
      'Hippophae Rhamnoides (Argousier) Fruit Extract*',
      'Citric Acid',
      'Propanediol',
      'Caprylyl Glycol',
      'Benzoic Acid',
      'Tocopherol',
      'Ascorbyl Palmitate',
      'Isostearic Acid',
      'Sodium Phytate',
      'Polyglyceryl-3 Polyricinoleate',
      'Glycolipids',
      'Hydrolyzed Hyaluronic Acid',
      'Sodium Hyaluronate',
      'Propylene Glycol',
      'CI 77491, CI 77492, CI 77499 (Oxydes de fer)',
      'Limonene**',
      'Citrus Aurantium Peel Oil',
      'Linalool**',
      'Citrus Limon Peel Oil',
      'Pinene**',
      'Vanillin',
      'Citral**',
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
    inci: [
      'Zinc Oxide',
      'Dicaprylyl Carbonate',
      'Oryza Sativa (Riz) Bran Oil',
      'Vegetable Oil',
      'Isoamyl Laurate',
      'CI 77891 (Dioxyde de titane)',
      'Helianthus Annuus (Tournesol) Seed Wax',
      'Oryza Sativa (Riz) Bran Wax',
      'Rhus Succedanea Fruit Wax',
      'Hydrated Silica',
      'Simmondsia Chinensis (Jojoba) Seed Oil*',
      'Silica',
      'Jojoba Esters',
      'Theobroma Cacao (Cacao) Seed Butter*',
      'Parfum/Fragrance',
      'Tocopherol',
      'Hippophae Rhamnoides (Argousier) Fruit Oil*',
      'Nigella Sativa (Cumin noir) Seed Oil*',
      'CI 77491, CI 77492, CI 77499 (Oxydes de fer)',
      'Glycolipids',
      'Glycosphingolipids',
      'Aqua/Water',
      'Vanillin',
      'Terpineol**',
      'Linalyl Acetate**',
      'Anethole**',
      'Geraniol**',
    ],
  },

  /* ===================== PETITS CRAQUAGES ===================== */

  'patchs-yeux': {
    slug: 'patchs-yeux',
    href: '/produit/patchs-yeux',
    tier: 'craquage',
    number: null,
    category: 'YEUX',
    ritual: 'PETIT CRAQUAGE',
    title: 'Patchs anti-âge',
    subtitle: 'niacinamide & acide hyaluronique · 7 paires',
    format: '7 g / 0,25 oz',
    priceCents: 2900,
    priceLabel: '29 €',
    shortDescription:
      'Deux patchs hydrogel, quinze minutes, pour un regard reposé et repulpé — même à la dernière minute.',
    longDescription:
      "La niacinamide unifie et illumine le teint, l'acide hyaluronique hydrate en profondeur pour lisser l'aspect des ridules de sécheresse, tandis que le panthénol et le jus d'aloe apaisent la zone la plus fine du visage. Une touche d'or signe la texture hydrogel, façon rituel K-beauty.",
    accentColor: ACCENTS.poudre,
    accentName: 'Rose poudré',
    cardImage: `${CDN}/uxZghpJrBBZN2qk9T2lXZrn1Anvqj1Ns.jpg?v=1786546564`,
    images: [
      `${CDN}/uxZghpJrBBZN2qk9T2lXZrn1Anvqj1Ns.jpg?v=1786546564`,
      `${CDN}/krudZFtosTCrTz8vEq-OyvkNj4DMC_N2.jpg?v=1786546564`,
    ],
    shopifyHandle: 'anti-age-hydrogel-eye-patches',
    shopifyVariantId: '58377596633420',
    available: false,
    status: 'ÉPUISÉ — BIENTÔT DE RETOUR',
    actives: [
      'Niacinamide (B3) — éclat, teint unifié',
      'Acide hyaluronique — hydrate et repulpe',
      "Panthénol & jus d'aloe — apaisent, hydratation multi-niveaux",
      'Or (CI 77480) — signature de la texture hydrogel',
    ],
    inci: [
      'Aqua/Water',
      'Glycerin',
      'Carrageenan',
      'Panthenol',
      'Mica',
      'Amorphophallus Konjac Root Extract',
      'Sucrose',
      'Hordeum Vulgare Stem Water',
      'CI 77891 (Dioxyde de titane)',
      'Sodium Levulinate',
      'Niacinamide',
      'Phenoxyethanol',
      'Sodium Anisate',
      'Sodium Hyaluronate',
      'CI 77491 (Oxydes de fer)',
      'Benzoic Acid',
      'Dehydroacetic Acid',
      'Lactic Acid',
      'Sorbic Acid',
      'Aloe Barbadensis Leaf Juice Powder*',
      'Sodium Benzoate',
      'Citric Acid',
      'CI 77480 (Or)',
      'Sodium Hydroxide',
    ],
    certifications: [
      'Vegan',
      'Sans parfum',
      'Testé sous contrôle dermatologique',
      'Fabriqué en France',
    ],
  },

  'patchs-yeux-fatigue': {
    slug: 'patchs-yeux-fatigue',
    href: '/produit/patchs-yeux-fatigue',
    tier: 'craquage',
    number: null,
    category: 'YEUX',
    ritual: 'PETIT CRAQUAGE',
    title: 'Patchs anti-fatigue',
    subtitle: 'antioxydants & acide hyaluronique · 7 paires',
    format: '7 g / 0,25 oz',
    priceCents: 2900,
    priceLabel: '29 €',
    shortDescription:
      'Le geste rafraîchissant après une nuit courte. Deux patchs hydrogel, quinze minutes, pour un regard visiblement moins fatigué.',
    longDescription:
      "Les antioxydants protègent et ravivent l'éclat, tandis que le panthénol, la glycérine et l'acide hyaluronique hydratent en profondeur pour un contour des yeux repulpé et confortable. Texture fraîche et gélifiée, façon rituel K-beauty.",
    accentColor: ACCENTS.chartreuse,
    accentName: 'Vert chartreuse',
    cardImage: `${CDN}/YRK594hnv5bpCkajODIcpnTvNUk04x2x.jpg?v=1786551033`,
    images: [
      `${CDN}/YRK594hnv5bpCkajODIcpnTvNUk04x2x.jpg?v=1786551033`,
      `${CDN}/KQb_sSb6ivVOIiREhGQ_lxCuK8tvRFYK.jpg?v=1786551034`,
    ],
    shopifyHandle: 'anti-fatigue-hydrogel-eye-patches',
    shopifyVariantId: '58378932519244',
    available: true,
    status: 'DISPONIBLE',
    actives: [
      "Antioxydants — protègent, ravivent l'éclat",
      'Panthénol — apaise, hydrate',
      'Glycérine — hydrate en profondeur',
      'Acide hyaluronique (sodium hyaluronate) — repulpe',
    ],
    inci: [
      'Aqua/Water',
      'Glycerin',
      'Annona Cherimola Fruit Extract*',
      'Carrageenan',
      'Panthenol',
      'Amorphophallus Konjac Root Extract',
      'Aspalathus Linearis Leaf',
      'Sucrose',
      'Phenethyl Alcohol',
      'Sodium Levulinate',
      'Sodium Anisate',
      'Sodium Hyaluronate',
      'Sodium Citrate',
      'Citric Acid',
      'Phenylpropanol',
      'Sodium Dehydroacetate',
      'Geraniol',
      'Linalool',
    ],
    certifications: [
      'Vegan',
      'Sans noix',
      'Convient aux peaux normales à sèches',
    ],
  },
};

const ORDER = ['serum', 'contour-yeux', 'no-01', 'creme', 'solaire-teinte', 'stick-solaire', 'patchs-yeux', 'patchs-yeux-fatigue'];

export const getProduct = (slug: string): Product | undefined => products[slug];
export const productList = (): Product[] => ORDER.map((s) => products[s]).filter(Boolean);
export const essentials = (): Product[] => productList().filter((p) => p.tier === 'essentiel');
export const solaires = (): Product[] => productList().filter((p) => p.tier === 'solaire');
export const craquages = (): Product[] => productList().filter((p) => p.tier === 'craquage');
/** La gamme « officielle » (essentiels + solaires), sans les Petits Craquages —
 *  à utiliser pour le hero d'accueil et les cross-sell « compléter le rituel ». */
export const gammeList = (): Product[] => productList().filter((p) => p.tier !== 'craquage');

export const productLabel = (p: Product): string => {
  if (p.number) return p.texture ? `${p.number} · ${p.texture}` : p.number;
  return p.tier === 'craquage' ? 'PETITS CRAQUAGES' : 'SOLAIRE';
};
