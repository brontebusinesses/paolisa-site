/**
 * Attribution d'origine — d'où vient la visiteuse, et d'où venait-elle la
 * toute première fois.
 *
 * Pourquoi : le site est un front Astro sur Vercel, Shopify n'est qu'en
 * coulisse. Shopify ne voit donc aucune session et ne peut pas dire d'où
 * vient une commande. Ce module rattache l'origine au panier, de sorte que
 * chaque commande arrive dans l'admin Shopify avec sa provenance lisible.
 *
 * Vie privée : on n'enregistre que des étiquettes de campagne (utm_*) et le
 * nom de domaine du site référent. Aucun identifiant publicitaire (fbclid,
 * gclid), aucune URL complète, aucune donnée personnelle. Rien n'est envoyé
 * à un tiers : les valeurs voyagent uniquement vers le checkout Shopify,
 * c'est-à-dire vers le marchand lui-même.
 *
 * Deux mémoires :
 *   - première visite (localStorage) : le canal qui a fait découvrir la marque
 *   - visite en cours (sessionStorage) : le canal qui a ramené ce jour-là
 * Les deux comptent. Instagram fait souvent découvrir, l'email fait acheter.
 */

export interface Origine {
  /** Canal : instagram, pinterest, tiktok, email, google, direct… */
  source: string;
  /** Format : story, bio, post, reel, newsletter, organique, cpc… */
  medium: string;
  /** Nom de l'opération, libre : lancement-notte, avis-clientes… */
  campagne: string;
  /** Variante du visuel ou du lien, libre. */
  contenu: string;
  /** Date ISO (jour) du premier contact avec ce canal. */
  date: string;
}

const CLE_PREMIERE = 'paolisa_origine_premiere_v1';
const CLE_COURANTE = 'paolisa_origine_courante_v1';

/** Domaines référents qu'on sait nommer, pour ne pas tout ranger en « direct ». */
const REFERENTS: Array<[RegExp, string]> = [
  [/(^|\.)instagram\.com$/i, 'instagram'],
  [/(^|\.)l\.instagram\.com$/i, 'instagram'],
  [/(^|\.)pinterest\./i, 'pinterest'],
  [/(^|\.)tiktok\.com$/i, 'tiktok'],
  [/(^|\.)facebook\.com$/i, 'facebook'],
  [/(^|\.)google\./i, 'google'],
  [/(^|\.)bing\.com$/i, 'bing'],
  [/(^|\.)duckduckgo\.com$/i, 'duckduckgo'],
  [/(^|\.)ecosia\.org$/i, 'ecosia'],
  [/(^|\.)youtube\.com$/i, 'youtube'],
  [/(^|\.)linkedin\.com$/i, 'linkedin'],
];

const MOTEURS = new Set(['google', 'bing', 'duckduckgo', 'ecosia']);

function propre(valeur: string | null | undefined): string {
  if (!valeur) return '';
  return valeur.trim().toLowerCase().replace(/[^a-z0-9._\-\/ ]/g, '').slice(0, 60);
}

function lire(store: Storage, cle: string): Origine | null {
  try {
    const brut = store.getItem(cle);
    if (!brut) return null;
    const o = JSON.parse(brut) as Origine;
    return o && typeof o.source === 'string' ? o : null;
  } catch {
    return null;
  }
}

function ecrire(store: Storage, cle: string, o: Origine): void {
  try {
    store.setItem(cle, JSON.stringify(o));
  } catch {
    /* navigation privée, stockage plein : on continue sans mémoire */
  }
}

/** Déduit l'origine de l'URL courante, puis à défaut du site référent. */
function origineDeLaPage(): Origine | null {
  if (typeof window === 'undefined') return null;

  const p = new URLSearchParams(window.location.search);
  const date = new Date().toISOString().slice(0, 10);

  // 1. Liens marqués : c'est la source de vérité, elle prime sur tout.
  const utmSource = propre(p.get('utm_source'));
  if (utmSource) {
    return {
      source: utmSource,
      medium: propre(p.get('utm_medium')) || 'inconnu',
      campagne: propre(p.get('utm_campaign')),
      contenu: propre(p.get('utm_content')),
      date,
    };
  }

  // 2. Raccourci maison : ?ref=ig-story-notte → instagram / story / notte
  const ref = propre(p.get('ref'));
  if (ref) {
    const [a, b, ...reste] = ref.split('-');
    const alias: Record<string, string> = {
      ig: 'instagram', insta: 'instagram', pin: 'pinterest',
      tt: 'tiktok', fb: 'facebook', nl: 'email', mail: 'email',
    };
    return {
      source: alias[a] ?? a,
      medium: b || 'lien',
      campagne: reste.join('-'),
      contenu: '',
      date,
    };
  }

  // 3. Site référent : mieux que rien, mais Instagram masque souvent le sien.
  const referrer = document.referrer;
  if (referrer) {
    let hote = '';
    try {
      hote = new URL(referrer).hostname;
    } catch {
      hote = '';
    }
    if (hote && !hote.endsWith('paolisa.eu') && !hote.includes('myshopify.com')) {
      const trouve = REFERENTS.find(([re]) => re.test(hote));
      const source = trouve ? trouve[1] : hote.replace(/^www\./, '').slice(0, 60);
      return {
        source,
        medium: MOTEURS.has(source) ? 'recherche' : 'referent',
        campagne: '',
        contenu: '',
        date,
      };
    }
  }

  return null;
}

/**
 * Enregistre l'origine de la visite. Idempotent : peut être appelé à chaque
 * page et avant chaque checkout sans effet de bord.
 */
export function capturerOrigine(): void {
  if (typeof window === 'undefined') return;

  const detectee = origineDeLaPage();

  if (detectee) {
    // Visite en cours : la dernière source connue gagne.
    ecrire(sessionStorage, CLE_COURANTE, detectee);
    // Première visite : ne s'écrit qu'une fois, jamais écrasée.
    if (!lire(localStorage, CLE_PREMIERE)) {
      ecrire(localStorage, CLE_PREMIERE, detectee);
    }
    return;
  }

  // Aucune source détectable et aucune mémoire : accès direct.
  if (!lire(sessionStorage, CLE_COURANTE)) {
    const direct: Origine = {
      source: 'direct',
      medium: 'direct',
      campagne: '',
      contenu: '',
      date: new Date().toISOString().slice(0, 10),
    };
    ecrire(sessionStorage, CLE_COURANTE, direct);
    if (!lire(localStorage, CLE_PREMIERE)) ecrire(localStorage, CLE_PREMIERE, direct);
  }
}

export function origineCourante(): Origine | null {
  if (typeof window === 'undefined') return null;
  return lire(sessionStorage, CLE_COURANTE);
}

export function originePremiere(): Origine | null {
  if (typeof window === 'undefined') return null;
  return lire(localStorage, CLE_PREMIERE);
}

/**
 * Paramètres à coller sur le permalink de panier Shopify.
 *
 * Deux jeux, volontairement :
 *   - utm_*            → attribution native Shopify (rapports « source de commande »)
 *   - attributes[...]  → attributs visibles sur la commande dans l'admin,
 *                        et lisibles par l'API. C'est la mesure de secours,
 *                        celle qui ne dépend d'aucun réglage Shopify.
 */
export function parametresOrigine(): string {
  capturerOrigine();

  const courante = origineCourante();
  const premiere = originePremiere();
  if (!courante) return '';

  const p = new URLSearchParams();

  p.set('utm_source', courante.source);
  p.set('utm_medium', courante.medium || 'inconnu');
  if (courante.campagne) p.set('utm_campaign', courante.campagne);
  if (courante.contenu) p.set('utm_content', courante.contenu);

  const lisible = [courante.source, courante.medium].filter(Boolean).join(' / ');
  p.set('attributes[Origine]', courante.campagne ? `${lisible} · ${courante.campagne}` : lisible);

  if (premiere && (premiere.source !== courante.source || premiere.medium !== courante.medium)) {
    p.set(
      'attributes[Première visite]',
      `${[premiere.source, premiere.medium].filter(Boolean).join(' / ')} · ${premiere.date}`
    );
  }

  return p.toString();
}

/** Étiquette lisible d'une origine : « instagram / story · notte ». */
function etiquette(o: Origine | null): string {
  if (!o) return '';
  const base = [o.source, o.medium].filter(Boolean).join(' / ');
  return o.campagne ? `${base} · ${o.campagne}` : base;
}

/**
 * Étiquettes prêtes à être envoyées avec un formulaire.
 * `courante` = le canal qui a amené la visiteuse aujourd'hui.
 * `premiere` = le canal qui l'a fait découvrir la marque.
 */
export function etiquettesOrigine(): { courante: string; premiere: string } {
  capturerOrigine();
  return {
    courante: etiquette(origineCourante()),
    premiere: etiquette(originePremiere()),
  };
}

/**
 * Ajoute l'origine aux formulaires d'inscription newsletter, sous forme de
 * champs cachés. Appelée au chargement de chaque page, puis rejouée à l'envoi
 * pour couvrir les formulaires ajoutés après coup (pop-up, retour en stock).
 *
 * Un seul point d'injection pour les six formulaires du site, et pour ceux
 * qui viendront.
 */
export function injecterOrigineDansFormulaires(): void {
  if (typeof document === 'undefined') return;

  const remplir = (form: HTMLFormElement): void => {
    const { courante, premiere } = etiquettesOrigine();
    const poser = (nom: string, valeur: string): void => {
      if (!valeur) return;
      let champ = form.querySelector<HTMLInputElement>(`input[name="${nom}"]`);
      if (!champ) {
        champ = document.createElement('input');
        champ.type = 'hidden';
        champ.name = nom;
        form.appendChild(champ);
      }
      champ.value = valeur;
    };
    poser('origine', courante);
    poser('origine_premiere', premiere);
  };

  const cible = (el: Element | null): HTMLFormElement | null => {
    if (!(el instanceof HTMLFormElement)) return null;
    return el.getAttribute('action')?.includes('/api/newsletter') ? el : null;
  };

  document.querySelectorAll('form').forEach((f) => {
    const form = cible(f);
    if (form) remplir(form);
  });

  document.addEventListener(
    'submit',
    (e) => {
      const form = cible(e.target as Element);
      if (form) remplir(form);
    },
    true
  );
}
