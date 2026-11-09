export interface PoultryTimelineEvent {
  phase: string;
  duration: string;
  description: string;
}

export interface AvicultureData {
  id: string;
  nomLot: string;
  typeOiseau: 'Poulet de chair' | 'Poule pondeuse' | 'Canard' | 'Caille';
  race: string;
  effectif: number;
  etatSante: 'Excellent' | 'Bon' | 'Surveillance' | 'Quarantaine';
  dateArrivee: string;
  images: string[];
  presentation: string;
  description: string;
  habitat: string;
  temperatureIdeale: string;
  cycle: {
    dureeElevage: string;
    alimentation: string[];
  };
  sante: {
    vaccination: string[];
    maladies: string[];
    traitements: string[];
    conseilsTechniques: string;
  };
  production: {
    type: 'Viande' | 'Œufs' | 'Mixte';
    rendement: string; // ex: 90% taux de ponte ou Poids moyen 2.5kg
    rentabilite: string;
    dechetsValorisables: string; // ex: Fiente
    donneesGraphique: { mois: string; production: number; revenus: number }[];
  };
  timeline: PoultryTimelineEvent[];
  createdAt: string;
}

const AVICULTURE_IMAGES: Record<string, string> = {
  'Poulet de chair': '/images/aviculture/poulet de chair.jpg',
  'Poule pondeuse': '/images/aviculture/poule pondeuse.jpg',
  Canard: '/images/aviculture/canard de barbarie.jpg',
  Caille: '/images/aviculture/caille.jpg',
}

export function getAvicultureImage(typeOiseau: string, fallback = ''): string {
  return AVICULTURE_IMAGES[typeOiseau] ?? fallback
}

export const INITIAL_AVICULTURE_DATA: AvicultureData[] = [
  {
    id: 'lot-poulet-chair',
    nomLot: 'Lot Cobb 500 - Bâtiment A',
    typeOiseau: 'Poulet de chair',
    race: 'Cobb 500',
    effectif: 5000,
    etatSante: 'Excellent',
    dateArrivee: '2025-02-01',
    images: ['/images/aviculture/poulet de chair.jpg'],
    presentation: 'Lot d\'engraissement rapide pour la production de viande blanche.',
    description: 'Souche performante avec un excellent indice de consommation et une croissance rapide.',
    habitat: 'Bâtiment fermé, litière copeaux de bois, ventilation dynamique.',
    temperatureIdeale: 'Démarrage à 32°C, baisse progressive jusqu\'à 20°C en finition.',
    cycle: {
      dureeElevage: '45 jours',
      alimentation: [
        'Aliment Démarrage (J0-J14) : 22% Protéines',
        'Aliment Croissance (J15-J28) : 20% Protéines',
        'Aliment Finition (J29-J45) : 18% Protéines'
      ]
    },
    sante: {
      vaccination: ['Newcastle', 'Gumboro', 'Bronchite infectieuse'],
      maladies: ['Coccidiose', 'Colibacillose', 'Syndrome ascitique'],
      traitements: ['Anticoccidiens dans l\'aliment', 'Vitamines dans l\'eau de boisson', 'Antibiotiques (sur ordonnance uniquement)'],
      conseilsTechniques: 'Surveiller le taux d\'ammoniac dans le bâtiment. Retourner la litière régulièrement pour éviter les pododermatites.'
    },
    production: {
      type: 'Viande',
      rendement: 'Poids vif moyen : 2.6 kg à 45 jours',
      rentabilite: 'Moyenne (rotation rapide, marge au volume)',
      dechetsValorisables: 'Fumier de volaille très riche en azote pour les cultures céréalières.',
      donneesGraphique: [
        { mois: 'S1', production: 0, revenus: 0 },
        { mois: 'S2', production: 0, revenus: 0 },
        { mois: 'S3', production: 0, revenus: 0 },
        { mois: 'S4', production: 0, revenus: 0 },
        { mois: 'S6 (Vente)', production: 12500, revenus: 25000 },
      ]
    },
    timeline: [
      { phase: 'Démarrage', duration: 'J0 - J14', description: 'Chauffage crucial, accès eau/aliment immédiat.' },
      { phase: 'Croissance', duration: 'J15 - J28', description: 'Développement osseux et musculaire rapide.' },
      { phase: 'Finition', duration: 'J29 - J45', description: 'Prise de poids maximale, préparation à l\'abattage.' },
      { phase: 'Abattage', duration: 'J45', description: 'Ramassage et transfert à l\'abattoir.' },
    ],
    createdAt: new Date('2025-02-01').toISOString(),
  },
  {
    id: 'lot-poule-pondeuse',
    nomLot: 'Pondeuses Isa Brown',
    typeOiseau: 'Poule pondeuse',
    race: 'Isa Brown',
    effectif: 2000,
    etatSante: 'Bon',
    dateArrivee: '2024-05-15',
    images: ['/images/aviculture/poule pondeuse.jpg'],
    presentation: 'Lot de production d\'œufs de consommation (coquille rousse).',
    description: 'Poules rustiques, excellente persistance de ponte et œufs de bon calibre.',
    habitat: 'Élevage au sol avec parcours extérieur (Plein air), pondoirs automatiques.',
    temperatureIdeale: '18°C à 24°C',
    cycle: {
      dureeElevage: '72 à 80 semaines',
      alimentation: [
        'Aliment Poulette (jusqu\'à 18 semaines)',
        'Aliment Ponte 1 (Pic de ponte, 17% Protéines, 4% Calcium)',
        'Aliment Ponte 2 (Après 50 semaines, enrichi en minéraux pour la coquille)'
      ]
    },
    sante: {
      vaccination: ['Marek', 'Newcastle', 'Bronchite infectieuse', 'Salmonelle'],
      maladies: ['Coryza', 'Poux rouges', 'Picage'],
      traitements: ['Terre de diatomée (poux)', 'Compléments minéraux et coquilles d\'huîtres', 'Enrichissement du milieu (blocs à picorer)'],
      conseilsTechniques: 'Maintenir 14 à 16h de luminosité par jour pour stimuler et maintenir le taux de ponte.'
    },
    production: {
      type: 'Œufs',
      rendement: 'Taux de ponte : 92%',
      rentabilite: 'Élevée (Revenus quotidiens constants)',
      dechetsValorisables: 'Fientes séchées, coquilles d\'œufs invendus broyées pour amendement calcique.',
      donneesGraphique: [
        { mois: 'Fév', production: 50000, revenus: 7500 },
        { mois: 'Mar', production: 52000, revenus: 7800 },
        { mois: 'Avr', production: 54000, revenus: 8100 },
        { mois: 'Mai', production: 51000, revenus: 7650 },
      ]
    },
    timeline: [
      { phase: 'Élevage poulette', duration: '0 - 18 semaines', description: 'Développement du squelette et du format.' },
      { phase: 'Entrée en ponte', duration: '18 - 22 semaines', description: 'Premiers œufs, augmentation rapide du taux de ponte.' },
      { phase: 'Pic de ponte', duration: '24 - 40 semaines', description: 'Production maximale (>90%).' },
      { phase: 'Fin de ponte', duration: '72+ semaines', description: 'Baisse de ponte, fragilité de coquille, réforme prévue.' },
    ],
    createdAt: new Date('2024-05-15').toISOString(),
  },
  {
    id: 'lot-canard',
    nomLot: 'Canards de Barbarie',
    typeOiseau: 'Canard',
    race: 'Barbarie',
    effectif: 800,
    etatSante: 'Excellent',
    dateArrivee: '2025-01-10',
    images: ['/images/aviculture/canard de barbarie.jpg'],
    presentation: 'Lot de canards élevés pour leur chair de haute qualité.',
    description: 'Espèce robuste, moins bruyante que le canard commun, viande maigre très prisée.',
    habitat: 'Bâtiment sur paille avec grand parcours herbeux et point d\'eau.',
    temperatureIdeale: 'Démarrage à 30°C, puis acclimatation à l\'extérieur.',
    cycle: {
      dureeElevage: '12 semaines (84 jours)',
      alimentation: [
        'Miettes de démarrage riches en énergie',
        'Granulés de croissance',
        'Céréales (Maïs, Blé) en finition'
      ]
    },
    sante: {
      vaccination: ['Parvovirose', 'Maladie de Derzsy'],
      maladies: ['Botulisme', 'Choléra aviaire', 'Aspergillose'],
      traitements: ['Hygiène stricte des points d\'eau', 'Litière sèche', 'Antibiotiques (si foyer infectieux)'],
      conseilsTechniques: 'L\'accès à l\'eau pour se baigner est essentiel pour le lissage des plumes et le bien-être, mais l\'eau de boisson doit rester propre.'
    },
    production: {
      type: 'Viande',
      rendement: 'Mâles : 4.5 kg / Femelles : 2.5 kg',
      rentabilite: 'Bonne (Marché de niche, prix de vente élevé)',
      dechetsValorisables: 'Plumes et duvets, Lisier de canard.',
      donneesGraphique: [
        { mois: 'M1', production: 0, revenus: 0 },
        { mois: 'M2', production: 0, revenus: 0 },
        { mois: 'M3', production: 2800, revenus: 16800 }, // Poids et vente
      ]
    },
    timeline: [
      { phase: 'Démarrage', duration: 'Semaine 1-3', description: 'En bâtiment chauffé strictement.' },
      { phase: 'Croissance', duration: 'Semaine 4-8', description: 'Accès progressif au parcours extérieur.' },
      { phase: 'Finition', duration: 'Semaine 9-12', description: 'Développement de la masse musculaire, alimentation à base de maïs.' },
    ],
    createdAt: new Date('2025-01-10').toISOString(),
  },
  {
    id: 'lot-caille',
    nomLot: 'Cailles Japonaises - Ponte',
    typeOiseau: 'Caille',
    race: 'Coturnix japonica',
    effectif: 3000,
    etatSante: 'Bon',
    dateArrivee: '2024-11-20',
    images: ['/images/aviculture/caille.jpg'],
    presentation: 'Lot de production d\'œufs de caille, haut de gamme et diététiques.',
    description: 'Petits oiseaux très prolifiques, maturation sexuelle extrêmement rapide.',
    habitat: 'Batterie aménagée (cages confort) en bâtiment très bien ventilé et éclairé.',
    temperatureIdeale: '20°C à 22°C constants.',
    cycle: {
      dureeElevage: '8 à 10 mois de ponte',
      alimentation: [
        'Farine très fine (farine pour cailleteaux puis pondeuses)',
        'Teneur élevée en protéines (20-22%)',
        'Apport de calcium (6%) pour des coquilles solides'
      ]
    },
    sante: {
      vaccination: ['Newcastle', 'Rarement d\'autres vaccins nécessaires si bonne hygiène'],
      maladies: ['Colibacillose', 'Stress thermique'],
      traitements: ['Ventilation accrue', 'Vitamines C dans l\'eau en cas de canicule'],
      conseilsTechniques: 'Les cailles sont très sensibles aux bruits brusques. Maintenir un environnement calme pour éviter les mouvements de panique mortels.'
    },
    production: {
      type: 'Œufs',
      rendement: 'Taux de ponte : 85% (env. 250 œufs/an/femelle)',
      rentabilite: 'Très Élevée (Vente par barquettes à prix premium)',
      dechetsValorisables: 'Fiente très concentrée ("Guano de caille").',
      donneesGraphique: [
        { mois: 'Déc', production: 75000, revenus: 6000 },
        { mois: 'Jan', production: 76000, revenus: 6080 },
        { mois: 'Fév', production: 75000, revenus: 6000 },
        { mois: 'Mar', production: 74000, revenus: 5920 },
      ]
    },
    timeline: [
      { phase: 'Démarrage', duration: 'J0 - J21', description: 'Chauffage très élevé (37°C au J1), croissance fulgurante.' },
      { phase: 'Maturité', duration: 'J40 - J45', description: 'Apparition des premiers œufs.' },
      { phase: 'Pic de ponte', duration: 'Mois 2 à 8', description: 'Ponte quotidienne.' },
      { phase: 'Réforme', duration: 'Mois 10', description: 'Chute de la ponte, renouvellement du cheptel.' },
    ],
    createdAt: new Date('2024-11-20').toISOString(),
  }
];
