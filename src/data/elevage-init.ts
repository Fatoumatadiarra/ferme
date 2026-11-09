export interface AnimalTimelineEvent {
  phase: string;
  duration: string;
  description: string;
}

export interface ElevageData {
  id: string;
  nomTroupeau: string;
  espece: 'Vaches' | 'Moutons' | 'Chèvres';
  races: string[];
  effectif: number;
  etatSante: 'Excellent' | 'Bon' | 'Surveillance' | 'Quarantaine';
  dateAcquisition: string;
  images: string[];
  presentation: string;
  description: string;
  origine: string;
  habitat: string;
  zootechnie: {
    alimentation: string[];
    reproduction: {
      gestation: string;
      periode: string;
      tauxMiseBas: string;
    };
  };
  sante: {
    vaccination: string[];
    calendrierSanitaire: string;
    maladies: string[];
    traitements: string[];
    conseilsVeterinaires: string;
  };
  economie: {
    production: string; // ex: 25 L/jour/tête
    typeProduction: 'Lait' | 'Viande' | 'Mixte';
    rentabilite: string;
    coutEntretien: string;
    valorisationDejections: string;
    donneesGraphique: { mois: string; production: number; revenus: number }[];
  };
  timeline: AnimalTimelineEvent[];
  createdAt: string;
}

const ELEVAGE_IMAGES: Record<string, string> = {
  Vaches: '/images/elevage/vache.jpg',
  Moutons: '/images/elevage/mouton.jpg',
  Chèvres: '/images/elevage/chevre.jpg',
}

export function getElevageImage(espece: string, fallback = ''): string {
  return ELEVAGE_IMAGES[espece] ?? fallback
}

export const INITIAL_ELEVAGE_DATA: ElevageData[] = [
  {
    id: 'troupeau-vaches',
    nomTroupeau: 'Troupeau Laitier Nord',
    espece: 'Vaches',
    races: ['Prim\'Holstein', 'Montbéliarde'],
    effectif: 120,
    etatSante: 'Excellent',
    dateAcquisition: '2024-03-10',
    images: ['/images/elevage/vache.jpg'],
    presentation: 'Troupeau de vaches laitières à haute productivité sélectionné pour la qualité de son lait.',
    description: 'Bovins dociles, adaptés à la traite robotisée et aux étables modernes en stabulation libre.',
    origine: 'Europe (Pays-Bas, France)',
    habitat: 'Stabulation libre avec logettes paillées, accès au pâturage 6 mois par an.',
    zootechnie: {
      alimentation: [
        'Ensilage de maïs (50%)',
        'Foin de luzerne (20%)',
        'Tourteaux de soja et colza',
        'Minéraux et vitamines'
      ],
      reproduction: {
        gestation: '9 mois (environ 283 jours)',
        periode: 'Insémination artificielle tout au long de l\'année',
        tauxMiseBas: '85% de réussite en première IA'
      }
    },
    sante: {
      vaccination: ['Fièvre catarrhale', 'BVD (Diarrhée virale bovine)', 'IBR'],
      calendrierSanitaire: 'Vermifugation au printemps avant la mise à l\'herbe. Parage des onglons 2 fois/an.',
      maladies: ['Mammite', 'Boiterie', 'Fièvre de lait'],
      traitements: ['Antibiotiques ciblés (hors lactation si possible)', 'Calcium par voie veineuse', 'Bains de pieds réguliers'],
      conseilsVeterinaires: 'Surveiller le taux de cellules somatiques dans le lait pour détecter précocement les mammites subcliniques.'
    },
    economie: {
      production: '28 L/jour/vache en moyenne',
      typeProduction: 'Lait',
      rentabilite: 'Haute (Lait vendu en circuit court et laiterie locale)',
      coutEntretien: '4.5 € / jour / vache',
      valorisationDejections: 'Lisier méthanisé pour produire de l\'électricité et de la chaleur pour la ferme.',
      donneesGraphique: [
        { mois: 'Jan', production: 95000, revenus: 38000 },
        { mois: 'Fév', production: 92000, revenus: 36800 },
        { mois: 'Mar', production: 105000, revenus: 42000 },
        { mois: 'Avr', production: 110000, revenus: 44000 },
        { mois: 'Mai', production: 115000, revenus: 46000 },
      ]
    },
    timeline: [
      { phase: 'Gestation', duration: '9 mois', description: 'Surveillance et tarissement les 2 derniers mois' },
      { phase: 'Vêlage', duration: 'Jour J', description: 'Naissance du veau, apport de colostrum' },
      { phase: 'Pic de lactation', duration: 'Mois 2-3', description: 'Production maximale (jusqu\'à 40L/j)' },
      { phase: 'Fin de lactation', duration: 'Mois 10', description: 'Baisse de production, préparation au tarissement' },
    ],
    createdAt: new Date('2024-03-10').toISOString(),
  },
  {
    id: 'troupeau-moutons',
    nomTroupeau: 'Troupeau Ovin Viande',
    espece: 'Moutons',
    races: ['Ile-de-France', 'Suffolk'],
    effectif: 250,
    etatSante: 'Bon',
    dateAcquisition: '2025-01-15',
    images: ['/images/elevage/mouton.jpg'],
    presentation: 'Troupeau de moutons spécialisés pour la production de viande de haute qualité (agneaux).',
    description: 'Animaux rustiques avec une excellente conformation bouchère et un bon instinct maternel.',
    origine: 'Royaume-Uni et France',
    habitat: 'Bergerie semi-ouverte en hiver, pâturage tournant dynamique d\'avril à novembre.',
    zootechnie: {
      alimentation: [
        'Pâturage (Ray-grass, trèfle blanc)',
        'Foin de pré en hiver',
        'Céréales aplaties (orge) en finition'
      ],
      reproduction: {
        gestation: '5 mois (environ 150 jours)',
        periode: 'Lutte de printemps (désaisonnement) et automne',
        tauxMiseBas: '160% (forte proportion de jumeaux)'
      }
    },
    sante: {
      vaccination: ['Entérotoxémie', 'Clavelée', 'Fièvre Q'],
      calendrierSanitaire: 'Tonte en mai. Vermifugation ciblée selon analyses coprologiques.',
      maladies: ['Piétin', 'Parasitisme gastro-intestinal', 'Myiases'],
      traitements: ['Pédiluve au sulfate de zinc', 'Anthelminthiques rotatifs', 'Tonte préventive'],
      conseilsVeterinaires: 'Mettre en place un pâturage tournant pour briser le cycle des parasites.'
    },
    economie: {
      production: 'Agneaux de 35-40 kg vifs à 100 jours',
      typeProduction: 'Viande',
      rentabilite: 'Moyenne à Bonne (Vente directe au printemps/Pâques)',
      coutEntretien: '0.80 € / jour / brebis',
      valorisationDejections: 'Fumier de mouton très riche, composté et revendu aux maraîchers locaux.',
      donneesGraphique: [
        { mois: 'Mar', production: 0, revenus: 0 },
        { mois: 'Avr', production: 4500, revenus: 27000 }, // Poids viande, revenus
        { mois: 'Mai', production: 2000, revenus: 12000 },
        { mois: 'Juin', production: 500, revenus: 3000 },
      ]
    },
    timeline: [
      { phase: 'Lutte', duration: 'Mois 1', description: 'Mise des béliers dans le troupeau' },
      { phase: 'Gestation', duration: '5 mois', description: 'Échographie à 60 jours' },
      { phase: 'Agnelage', duration: 'Mois 6', description: 'Naissance en bergerie, adoption si nécessaire' },
      { phase: 'Engraissement', duration: '100 jours', description: 'Allaitement puis transition aux céréales/herbe' },
    ],
    createdAt: new Date('2025-01-15').toISOString(),
  },
  {
    id: 'troupeau-chevres',
    nomTroupeau: 'Chèvrerie Fromagère',
    espece: 'Chèvres',
    races: ['Alpine', 'Saanen'],
    effectif: 85,
    etatSante: 'Surveillance',
    dateAcquisition: '2023-09-01',
    images: ['/images/elevage/chevre.jpg'],
    presentation: 'Troupeau caprin à haut potentiel laitier dédié à la transformation fromagère à la ferme.',
    description: 'Chèvres curieuses et très agiles. Lait riche en protéines, idéal pour le fromage.',
    origine: 'Alpes et Suisse',
    habitat: 'Chèvrerie lumineuse avec parcours extérieur broussailleux.',
    zootechnie: {
      alimentation: [
        'Foin sec à volonté (très important pour les chèvres)',
        'Luzerne déshydratée',
        'Concentrés énergétiques lors de la traite'
      ],
      reproduction: {
        gestation: '5 mois (environ 150 jours)',
        periode: 'Saisonnière (Automne)',
        tauxMiseBas: '180% (jumeaux très fréquents)'
      }
    },
    sante: {
      vaccination: ['Fièvre Q', 'Entérotoxémie', 'Paratuberculose'],
      calendrierSanitaire: 'Taille des onglons 3 fois/an. Test CAEV annuel.',
      maladies: ['CAEV (Arthrite encéphalite)', 'Mammites staphylococciques', 'Strongles'],
      traitements: ['Isolement des animaux positifs CAEV', 'Antibiothérapie locale', 'Cure de vitamines'],
      conseilsVeterinaires: 'Les chèvres sont très sensibles à l\'humidité. Maintenir une litière toujours sèche et bien ventilée.'
    },
    economie: {
      production: '3 L/jour/chèvre en moyenne',
      typeProduction: 'Lait',
      rentabilite: 'Très Haute (Transformation en fromages AOP/IGP)',
      coutEntretien: '1.20 € / jour / chèvre',
      valorisationDejections: 'Fumier très apprécié en arboriculture. Petits rendements mais forte valeur.',
      donneesGraphique: [
        { mois: 'Fév', production: 7600, revenus: 15200 }, // Fromages vendus
        { mois: 'Mar', production: 7800, revenus: 15600 },
        { mois: 'Avr', production: 8000, revenus: 16000 },
        { mois: 'Mai', production: 8500, revenus: 17000 },
        { mois: 'Juin', production: 8200, revenus: 16400 },
      ]
    },
    timeline: [
      { phase: 'Mise bas', duration: 'Février-Mars', description: 'Début de la lactation' },
      { phase: 'Pic de lactation', duration: 'Avril-Juin', description: 'Traite 2 fois par jour, fabrication fromagère intense' },
      { phase: 'Baisse lactation', duration: 'Juillet-Octobre', description: 'Adaptation des rations' },
      { phase: 'Tarissement', duration: 'Décembre-Janvier', description: 'Arrêt de la traite pour repos' },
    ],
    createdAt: new Date('2023-09-01').toISOString(),
  }
];
