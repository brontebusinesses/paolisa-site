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
  priceCents: number;    // 4800
  priceLabel: string;    // "€48"
  shortDescription: string;
  /** Stripe price ID — défini via env var STRIPE_PRICE_NO01 en runtime. */
  stripePriceEnv: string;
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
    priceCents: 4800,
    priceLabel: '€48',
    shortDescription:
      'Cinq huiles méditerranéennes, un seul geste, le matin. Certifié COSMOS Organic.',
    stripePriceEnv: 'STRIPE_PRICE_NO01',
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
      { index: '01', name: 'OLIVE',    origin: 'Italie',   note: 'Pression à froid, Toscane.' },
      { index: '02', name: 'AMANDE',   origin: 'Sicile',   note: 'Producteur familial, vallée de l\'Etna.' },
      { index: '03', name: 'ABRICOT',  origin: 'Provence', note: 'Noyaux issus du verger biologique du Vaucluse.' },
      { index: '04', name: 'AVOCAT',   origin: 'Espagne',  note: 'Andalousie, agriculture régénérative.' },
      { index: '05', name: 'ROSEHIP',  origin: 'Chili',    note: 'Patagonie, récolte sauvage certifiée.' },
      { index: '06', name: 'aroma · mandarine florale', origin: '—', note: 'Composition exclusive, dosage discret.' },
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
