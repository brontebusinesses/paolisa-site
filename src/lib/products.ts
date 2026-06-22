/**
 * Catalogue produits — source unique pour PDP, panier, cart.
 * Les `priceId` Stripe seront renseignés en Étape 5.
 */
export interface Product {
  slug: string;
  number: string;        // "N°01"
  ritual: string;        // "RITUEL MATIN"
  title: string;         // "Huile visage rituelle"
  format: string;        // "30 ml"
  priceCents: number;    // 6400
  priceLabel: string;    // "€64"
  shortDescription: string;
  /** Shopify product handle (URL slug Shopify, ex. 'all-in-one-facial-oil'). */
  shopifyHandle: string;
  available: boolean;
  status: string;        // "DISPONIBLE" / "Q3 / 2026"
  inci: string[];        // liste INCI complète
  ingredients: { index: string; name: string; origin: string; note?: string }[];
  certifications: string[];
  application: string;
  ritualSteps: string[];
}

export const products: Record<string, Product> = {
  'no-01': {
    slug: 'no-01',
    number: 'N°01',
    ritual: 'RITUEL MATIN',
    title: 'Huile visage rituelle',
    format: '30 ml',
    priceCents: 4500,
    priceLabel: '€45',
    shortDescription:
      'Cinq huiles méditerranéennes, un seul geste, le matin. Certifié COSMOS Organic.',
    shopifyHandle: 'all-in-one-facial-oil',
    available: true,
    status: 'DISPONIBLE',
    inci: [
      'Olea Europaea (Olive) Fruit Oil*',
      'Prunus Amygdalus Dulcis (Sweet Almond) Oil*',
      'Prunus Armeniaca (Apricot) Kernel Oil*',
      'Persea Gratissima (Avocado) Oil*',
      'Rosa Canina (Rosehip) Fruit Oil*',
      'Citrus Reticulata (Mandarin) Peel Oil',
      'Tocopherol (Vitamin E)',
      'Linalool**, Limonene**, Citral**',
    ],
    ingredients: [
      { index: '01', name: 'OLIVE',    origin: 'Pression à froid', note: 'Restaure la barrière cutanée.' },
      { index: '02', name: 'AMANDE',   origin: 'Pression à froid', note: 'Apaise les peaux sensibles.' },
      { index: '03', name: 'ABRICOT',  origin: 'Pression à froid', note: 'Donne l\'éclat, texture sèche.' },
      { index: '04', name: 'AVOCAT',   origin: 'Pression à froid', note: 'Nourrit en profondeur.' },
      { index: '05', name: 'ROSEHIP',  origin: 'Pression à froid', note: 'Régénère, acides gras essentiels.' },
      { index: '06', name: 'aroma · mandarine florale', origin: '—', note: 'Issue d\'huiles essentielles naturelles.' },
    ],
    certifications: [
      'COSMOS Organic',
      'Vegan',
      'Cruelty-free (Leaping Bunny)',
      'Fabriqué en France et conditionné en Belgique',
    ],
    application:
      'Trois gouttes dans la paume, qu\'on réchauffe. Une pression douce — front, joues, cou. Trente secondes, devant une fenêtre.',
    ritualSteps: [
      'Trois gouttes dans la paume, qu\'on réchauffe entre les mains.',
      'Une pression douce — front, joues, cou. Sans frotter.',
      'Trente secondes immobile, devant une fenêtre.',
    ],
  },
};

export const getProduct = (slug: string): Product | undefined => products[slug];
export const productList = (): Product[] => Object.values(products);
