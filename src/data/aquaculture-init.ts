// ============================================================
// Aquaculture Module — Data & Types
// ============================================================

export interface AquaTimelineEvent {
  phase: string;
  duration: string;
  description: string;
}

export interface BassinData {
  id: string;
  nomBassin: string;
  typePoissonEspeceId: string; // foreign key reference to espece
  surfaceM2: number;
  capaciteMax: number;
  etatSante: 'Excellent' | 'Bon' | 'Surveillance' | 'Quarantaine';
  dateMiseEnEau: string;
  notes?: string;
  createdAt: string;
}

export interface AquacultureData {
  id: string;
  nomEspece: 'Tilapia' | 'Clarias';
  race: string;
  images: string[];
  presentation: string;
  description: string;
  // Qualité de l'eau
  qualiteEau: {
    temperatureMin: number;
    temperatureMax: number;
    phMin: number;
    phMax: number;
    oxygeneDissouxMgL: string;
    turbidite: string;
  };
  alimentation: {
    typeAliment: string[];
    tauxDistribution: string;
    frequenceRepas: string;
  };
  reproduction: {
    maturitesSexuelle: string;
    periodePonte: string;
    nombreOeufs: string;
    incubation: string;
  };
  croissance: {
    poidsDepart: string;
    poidsAbattage: string;
    dureeCroissance: string;
    icc: string; // Indice de consommation
  };
  sante: {
    maladies: string[];
    traitements: string[];
    conseilsTechniques: string;
  };
  production: {
    rendementKgM2: string;
    rentabilite: string;
    typeProduit: 'Viande' | 'Alevins';
    valorisationDechets: string;
    donneesGraphique: { mois: string; production: number; revenus: number }[];
  };
  timeline: AquaTimelineEvent[];
  createdAt: string;
}

const AQUACULTURE_IMAGES: Record<string, string> = {
  Tilapia: '/images/aquaculture/tilapia.jpg',
  Clarias: '/images/aquaculture/clarias.jpg',
}

export function getAquacultureImage(nomEspece: string, fallback = ''): string {
  return AQUACULTURE_IMAGES[nomEspece] ?? fallback
}

export const INITIAL_AQUACULTURE_DATA: AquacultureData[] = [
  {
    id: 'espece-tilapia',
    nomEspece: 'Tilapia',
    race: 'Oreochromis niloticus',
    images: ['/images/aquaculture/tilapia.jpg'],
    presentation: 'Le Tilapia du Nil est le poisson d\'élevage le plus produit en Afrique subsaharienne, reconnu pour sa robustesse et sa croissance rapide.',
    description: 'Espèce herbivore-omnivore très tolérante aux conditions d\'élevage intensif. Sa chair blanche et ferme est très appréciée sur les marchés locaux et à l\'export.',
    qualiteEau: {
      temperatureMin: 25,
      temperatureMax: 30,
      phMin: 6.5,
      phMax: 8.5,
      oxygeneDissouxMgL: '>= 5 mg/L',
      turbidite: 'Eau claire à légèrement trouble (transparence 30-40 cm)',
    },
    alimentation: {
      typeAliment: [
        'Aliment granulé flotant 32% protéines (Démarrage)',
        'Aliment granulé 28% protéines (Grossissement)',
        'Son de riz et farine d\'herbe en complément possible',
      ],
      tauxDistribution: '3 à 5% du poids corporel par jour',
      frequenceRepas: '3 repas par jour minimum',
    },
    reproduction: {
      maturitesSexuelle: 'Dès 3-4 mois',
      periodePonte: 'Toute l\'année (si T° > 24°C)',
      nombreOeufs: '200 à 1500 œufs par femelle',
      incubation: '48 à 72 heures (incubation buccale)',
    },
    croissance: {
      poidsDepart: 'Alevins de 1-5g',
      poidsAbattage: '300 à 500g',
      dureeCroissance: '5 à 7 mois',
      icc: '1.5 à 1.8 kg d\'aliment / kg de poisson produit',
    },
    sante: {
      maladies: ['Ichtyophthiriose (points blancs)', 'Streptococcose', 'Aéromoniose', 'Parasites branchiaux'],
      traitements: ['Bain de sel (NaCl) 5-10g/L', 'Aération renforcée', 'Antibiotiques (sur prescription vétérinaire)', 'Densité d\'élevage réduite en cas d\'épidémie'],
      conseilsTechniques: 'Surveiller quotidiennement le comportement des poissons en surface. Un regroupement en surface le matin indique souvent un déficit en oxygène — agir immédiatement.',
    },
    production: {
      rendementKgM2: '10 à 20 kg/m² en élevage intensif',
      rentabilite: 'Élevée (faible coût de production, forte demande locale)',
      typeProduit: 'Viande',
      valorisationDechets: 'Eau riche en nitrates réutilisée pour l\'irrigation (aquaponie). Fientes séchées pour le maraîchage.',
      donneesGraphique: [
        { mois: 'M1', production: 0, revenus: 0 },
        { mois: 'M2', production: 0, revenus: 0 },
        { mois: 'M3', production: 500, revenus: 750 },
        { mois: 'M4', production: 1200, revenus: 1800 },
        { mois: 'M5', production: 2000, revenus: 3000 },
        { mois: 'M6', production: 3500, revenus: 5250 },
      ],
    },
    timeline: [
      { phase: 'Mise en charge', duration: 'Semaine 1', description: 'Introduction des alevins (densité 50-100 alevins/m²). Alimentation douce.' },
      { phase: 'Grossissement 1', duration: 'Mois 1 à 3', description: 'Croissance active avec aliments riches en protéines.' },
      { phase: 'Grossissement 2', duration: 'Mois 3 à 5', description: 'Suivi hebdomadaire du poids. Ajustement des rations.' },
      { phase: 'Pré-récolte', duration: 'Mois 5 à 6', description: 'Arrêt ou réduction de l\'alimentation 24h avant la pêche.' },
      { phase: 'Récolte', duration: 'Mois 6-7', description: 'Pêche au filet, pesée et commercialisation.' },
    ],
    createdAt: new Date('2024-06-01').toISOString(),
  },
  {
    id: 'espece-clarias',
    nomEspece: 'Clarias',
    race: 'Clarias gariepinus',
    images: ['/images/aquaculture/clarias.jpg'],
    presentation: 'Le Clarias (silure africain) est un poisson résistant capable de respirer l\'air atmosphérique, ce qui en fait un poisson idéal pour les zones à faible oxygénation.',
    description: 'Espèce carnivore-omnivore à croissance très rapide. Supporte des densités d\'élevage très élevées grâce à son organe supra-branchial.',
    qualiteEau: {
      temperatureMin: 22,
      temperatureMax: 32,
      phMin: 6.0,
      phMax: 8.5,
      oxygeneDissouxMgL: '>= 2 mg/L (respiration aérienne possible)',
      turbidite: 'Eau trouble tolérée (espèce benthique)',
    },
    alimentation: {
      typeAliment: [
        'Aliment granulé haute énergie 40-45% protéines (Démarrage)',
        'Aliment 35% protéines (Grossissement)',
        'Sous-produits de poisson (farines, entailles)',
      ],
      tauxDistribution: '4 à 6% du poids corporel par jour',
      frequenceRepas: 'Distribution unique le soir (espèce nocturne)',
    },
    reproduction: {
      maturitesSexuelle: 'Dès 12 mois',
      periodePonte: 'Saison des pluies (Mai à Août), reproductions hormonales possibles',
      nombreOeufs: '10 000 à 60 000 œufs par femelle',
      incubation: '24 à 28 heures',
    },
    croissance: {
      poidsDepart: 'Alevins de 1-3g',
      poidsAbattage: '500g à 1.5 kg',
      dureeCroissance: '4 à 6 mois',
      icc: '1.3 à 1.6 kg d\'aliment / kg de poisson produit',
    },
    sante: {
      maladies: ['Aéromoniose hémorragique', 'Columnariose', 'Infestations de trématodes'],
      traitements: ['Bain de sel lors de la manipulation', 'Hygiène stricte des bassins', 'Antibiotiques intégrés à l\'aliment (prescription vétérinaire)'],
      conseilsTechniques: 'Le Clarias est très sensible au stress lors des manipulations. Manipuler toujours de nuit ou en lumière tamisée pour limiter les pertes.',
    },
    production: {
      rendementKgM2: '25 à 50 kg/m² en élevage intensif hors-sol',
      rentabilite: 'Très Élevée (prix de vente marché > Tilapia)',
      typeProduit: 'Viande',
      valorisationDechets: 'Eau de bassin (effluent riche) utilisée pour les cultures maraîchères. La peau peut être tannée.',
      donneesGraphique: [
        { mois: 'M1', production: 0, revenus: 0 },
        { mois: 'M2', production: 0, revenus: 0 },
        { mois: 'M3', production: 800, revenus: 1600 },
        { mois: 'M4', production: 2200, revenus: 4400 },
        { mois: 'M5', production: 4500, revenus: 9000 },
      ],
    },
    timeline: [
      { phase: 'Mise en charge', duration: 'Semaine 1', description: 'Introduction des alevins en forte densité (100-200/m²).' },
      { phase: 'Alevin → Juvénile', duration: 'Mois 1 à 2', description: 'Croissance très rapide, compétition alimentaire à surveiller.' },
      { phase: 'Grossissement', duration: 'Mois 2 à 4', description: 'Paliers hebdomadaires, classement par taille si besoin.' },
      { phase: 'Finition', duration: 'Mois 4 à 5', description: 'Réduction de densité, poissons atteignent le poids marché.' },
      { phase: 'Récolte', duration: 'Mois 5-6', description: 'Vidange du bassin, pesée et vente directe ou via réseau.' },
    ],
    createdAt: new Date('2024-07-15').toISOString(),
  },
];

export const INITIAL_BASSINS_DATA: BassinData[] = [
  {
    id: 'bassin-01',
    nomBassin: 'Bassin A — Tilapia Nurserie',
    typePoissonEspeceId: 'espece-tilapia',
    surfaceM2: 50,
    capaciteMax: 2500,
    etatSante: 'Excellent',
    dateMiseEnEau: '2025-04-01',
    notes: 'Bassin de nurserie pour alevins. Filet de protection anti-oiseaux en place.',
    createdAt: new Date('2025-04-01').toISOString(),
  },
  {
    id: 'bassin-02',
    nomBassin: 'Bassin B — Tilapia Grossissement',
    typePoissonEspeceId: 'espece-tilapia',
    surfaceM2: 200,
    capaciteMax: 4000,
    etatSante: 'Bon',
    dateMiseEnEau: '2025-02-15',
    notes: 'Aération mécanique installée. Renouvellement eau hebdomadaire.',
    createdAt: new Date('2025-02-15').toISOString(),
  },
  {
    id: 'bassin-03',
    nomBassin: 'Bassin C — Clarias Intensif',
    typePoissonEspeceId: 'espece-clarias',
    surfaceM2: 100,
    capaciteMax: 10000,
    etatSante: 'Surveillance',
    dateMiseEnEau: '2025-01-10',
    notes: 'Bassin hors-sol en bâche EPDM. Surveillance paramètres eau 2x/j.',
    createdAt: new Date('2025-01-10').toISOString(),
  },
];
