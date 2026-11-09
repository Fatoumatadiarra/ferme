import type { MaterialCategory, MaterialRecord } from '@/types/material'

export const MATERIAL_CATEGORIES = [
  'Tracteur',
  'Drone',
  'Irrigation',
  'Pompe solaire',
  'Pulvérisateur',
  'Motoculteur',
  'Capteur',
  'Remorque',
] as const

const MATERIAL_IMAGES: Partial<Record<MaterialCategory, string>> = {
  Tracteur: '/images/materiels/tracteur.jpg',
  Drone: '/images/materiels/drone.jpg',
  'Pompe solaire': '/images/materiels/bombe solairee.jpg',
  Pulvérisateur: '/images/materiels/pulvalisateur.jpg',
  Motoculteur: '/images/materiels/monoculteur.jpg',
}

export function getMaterialImage(categorie: MaterialCategory, nom: string, fallback = ''): string {
  if (categorie === 'Capteur') {
    const normalizedName = nom.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    if (normalizedName.includes('humidite')) return '/images/materiels/humidite.jpg'
  }

  return MATERIAL_IMAGES[categorie] ?? fallback
}

export const INITIAL_MATERIALS_DATA: MaterialRecord[] = [
  {
    id: 'mat-001',
    nom: 'Tracteur agricole',
    categorie: 'Tracteur',
    marque: 'John Deere',
    modele: '5075E',
    numeroSerie: 'JD-5075E-001',
    description:
      'Tracteur polyvalent haute performance destiné aux travaux de préparation des sols, de labour intensif, et de transport de charges lourdes sur la ferme.',
    caracteristiques: [
      'Puissance : 75 CV',
      'Transmission : 4 roues motrices (4WD)',
      'Carburant : Diesel',
      'Capacité réservoir : 130 L',
      'Cabine : Climatisée avec isolation phonique'
    ],
    utilisation:
      'Préparation du sol, labour profond, transport de récoltes, et traction des équipements lourds (charrues, remorques).',
    dateAcquisition: '2025-01-15',
    coutAcquisition: 18500000,
    valeurActuelle: 16500000,
    etat: 'operationnel',
    localisation: 'Hangar principal',
    responsable: 'Chef de ferme',
    heuresUtilisation: 840,
    prochaineMaintenance: '2026-09-15',
    garantie: '3 ans (Moteur et Transmission)',
    images: ['/images/materiels/tracteur.jpg'],
    maintenances: [
      {
        id: 'maint-001',
        date: '2026-06-10',
        type: 'Entretien périodique',
        description: 'Vidange moteur, remplacement des filtres à huile et contrôle des niveaux hydrauliques.',
        cout: 125000,
        technicien: 'Atelier agricole',
      },
      {
        id: 'maint-002',
        date: '2026-02-15',
        type: 'Prévention',
        description: 'Contrôle de la pression des pneus et graissage des axes.',
        cout: 25000,
        technicien: 'Équipe interne',
      }
    ],
    historique: [
      {
        id: 'hist-001',
        date: '2025-01-15',
        action: 'Acquisition',
        description: 'Réception du tracteur et mise en service.',
        responsable: 'Direction',
      },
    ],
    createdAt: new Date().toISOString(),
  },

  {
    id: 'mat-002',
    nom: 'Drone agricole',
    categorie: 'Drone',
    marque: 'DJI',
    modele: 'Agras T40',
    numeroSerie: 'DJI-AGRI-001',
    description:
      'Drone professionnel nouvelle génération pour l\'observation aérienne, la cartographie multispectrale et l\'épandage de précision.',
    caracteristiques: [
      'Caméra : Haute résolution 4K & Multispectrale',
      'Charge utile : 40 Litres (Épandage)',
      'Autonomie vol : 25 minutes (avec charge)',
      'Navigation : GPS RTK ultra-précis',
      'Portée : 3 km'
    ],
    utilisation:
      'Surveillance des cultures, détection précoce des maladies (stress hydrique), cartographie topographique, et pulvérisation ciblée.',
    dateAcquisition: '2025-03-20',
    coutAcquisition: 4500000,
    valeurActuelle: 3900000,
    etat: 'operationnel',
    localisation: 'Bureau technique',
    responsable: 'Responsable agriculture',
    heuresUtilisation: 210,
    prochaineMaintenance: '2026-10-20',
    garantie: '2 ans (Électronique et Moteurs)',
    images: ['/images/materiels/drone.jpg'],
    maintenances: [
      {
        id: 'maint-003',
        date: '2026-01-10',
        type: 'Révision logicielle',
        description: 'Mise à jour du firmware et étalonnage des capteurs IMU/Compass.',
        cout: 15000,
        technicien: 'Support DJI',
      }
    ],
    historique: [
      {
        id: 'hist-002',
        date: '2025-03-20',
        action: 'Acquisition',
        description: 'Mise en service du drone et formation des pilotes.',
        responsable: 'Direction',
      },
    ],
    createdAt: new Date().toISOString(),
  },

  {
    id: 'mat-003',
    nom: "Système d'irrigation",
    categorie: 'Irrigation',
    marque: 'Netafim',
    modele: 'Smart Drip Pro',
    numeroSerie: 'IRR-001',
    description:
      'Réseau complet d\'irrigation goutte-à-goutte intelligent, conçu pour optimiser l\'utilisation de l\'eau avec des goutteurs auto-régulants.',
    caracteristiques: [
      'Type : Goutte-à-goutte de précision',
      'Débit : 1.6 L/h par goutteur',
      'Contrôle : Programmateur Wi-Fi automatisé',
      'Filtration : Filtre à disque automatique',
      'Surface couverte : 2 Hectares'
    ],
    utilisation:
      'Irrigation quotidienne des cultures maraîchères, apport en nutriments (fertirrigation) et maintien du taux d\'humidité du sol.',
    dateAcquisition: '2024-11-10',
    coutAcquisition: 2800000,
    valeurActuelle: 2300000,
    etat: 'operationnel',
    localisation: 'Parcelle maraîchère (Secteur A)',
    responsable: 'Responsable irrigation',
    heuresUtilisation: 1250,
    prochaineMaintenance: '2026-08-30',
    garantie: '5 ans (Tuyauterie et Vannes)',
    images: [
      '/images/materiels/irrigation1.jpg',
      '/images/materiels/irrigation2.jpg',
      '/images/materiels/irrigation3.jpg',
    ],
    maintenances: [
      {
        id: 'maint-004',
        date: '2025-11-15',
        type: 'Nettoyage',
        description: 'Purge des lignes et nettoyage à l\'acide des goutteurs bouchés.',
        cout: 45000,
        technicien: 'Équipe technique',
      }
    ],
    historique: [
      {
        id: 'hist-003',
        date: '2024-11-10',
        action: 'Installation',
        description: 'Mise en place des tuyaux et raccordement au système de pompage.',
        responsable: 'Installateur externe',
      }
    ],
    createdAt: new Date().toISOString(),
  },

  {
    id: 'mat-004',
    nom: 'Pompe solaire',
    categorie: 'Pompe solaire',
    marque: 'Grundfos',
    modele: 'SQFlex 5A-7',
    numeroSerie: 'SOL-001',
    description:
      'Pompe immergée alimentée par panneaux solaires, garantissant un pompage écologique et autonome pour l\'approvisionnement en eau.',
    caracteristiques: [
      'Alimentation : 100% Énergie Solaire (1500W)',
      'Débit max : 5 m³/h',
      'Profondeur d\'immersion : Jusqu\'à 70 mètres',
      'Onduleur : Intégré avec protection contre la marche à sec',
      'Matériau : Acier inoxydable anticorrosion'
    ],
    utilisation:
      'Pompage de l\'eau de la nappe phréatique vers le château d\'eau pour l\'irrigation et l\'abreuvement des animaux.',
    dateAcquisition: '2025-02-05',
    coutAcquisition: 1750000,
    valeurActuelle: 1500000,
    etat: 'operationnel',
    localisation: 'Forage Nord',
    responsable: 'Responsable irrigation',
    heuresUtilisation: 980,
    prochaineMaintenance: '2026-11-01',
    garantie: '2 ans',
    images: ['/images/materiels/bombe solairee.jpg'],
    maintenances: [],
    historique: [],
    createdAt: new Date().toISOString(),
  },

  {
    id: 'mat-005',
    nom: 'Pulvérisateur agricole',
    categorie: 'Pulvérisateur',
    marque: 'Kuhn',
    modele: 'Lexis 3000',
    numeroSerie: 'PUL-001',
    description:
      'Pulvérisateur traîné haute capacité pour un épandage uniforme et sécurisé des produits phytosanitaires.',
    caracteristiques: [
      'Capacité Cuve : 3000 Litres',
      'Largeur de rampe : 24 mètres (aluminium)',
      'Contrôle : Coupure de tronçons par GPS',
      'Pression : Réglable de 1 à 8 bars',
      'Système de rinçage : Automatique intégré'
    ],
    utilisation:
      'Application d\'engrais foliaires, traitements phytosanitaires préventifs et curatifs sur de grandes surfaces.',
    dateAcquisition: '2025-04-12',
    coutAcquisition: 2300000,
    valeurActuelle: 2000000,
    etat: 'maintenance',
    localisation: 'Hangar matériel',
    responsable: 'Responsable cultures',
    heuresUtilisation: 430,
    prochaineMaintenance: '2026-08-15',
    garantie: '1 an',
    images: ['/images/materiels/pulvalisateur.jpg'],
    maintenances: [
      {
        id: 'maint-005',
        date: '2026-08-10',
        type: 'Réparation',
        description: 'Changement de buses obstruées et réparation d\'une micro-fuite sur la rampe.',
        cout: 85000,
        technicien: 'Atelier',
      }
    ],
    historique: [],
    createdAt: new Date().toISOString(),
  },

  {
    id: 'mat-006',
    nom: 'Motoculteur',
    categorie: 'Motoculteur',
    marque: 'Honda',
    modele: 'F560',
    numeroSerie: 'MOTO-001',
    description:
      'Motoculteur maniable et robuste pour la préparation minutieuse des petites parcelles, le sarclage et le buttage.',
    caracteristiques: [
      'Moteur : Essence 4 Temps (GX160)',
      'Puissance : 4.8 CV',
      'Vitesses : 6 avant / 2 arrière',
      'Largeur de travail : Ajustable (60 à 90 cm)',
      'Guidon : Déportable et réglable en hauteur'
    ],
    utilisation:
      'Préparation fine du lit de semence, enfouissement du compost, sarclage entre les rangs et entretien des serres.',
    dateAcquisition: '2025-05-18',
    coutAcquisition: 1200000,
    valeurActuelle: 1000000,
    etat: 'operationnel',
    localisation: 'Magasin petit outillage',
    responsable: 'Chef de culture',
    heuresUtilisation: 360,
    prochaineMaintenance: '2026-12-01',
    garantie: '2 ans',
    images: ['/images/materiels/monoculteur.jpg'],
    maintenances: [],
    historique: [],
    createdAt: new Date().toISOString(),
  },

  {
    id: 'mat-007',
    nom: "Capteur d'humidité",
    categorie: 'Capteur',
    marque: 'AgriSense',
    modele: 'SoilMaster HS-100',
    numeroSerie: 'CAP-H-001',
    description:
      'Capteur capacitif connecté permettant de mesurer avec précision l\'humidité volumique du sol à différentes profondeurs.',
    caracteristiques: [
      'Profondeurs de mesure : 10cm, 20cm, 30cm',
      'Connectivité : LoRaWAN / sans fil',
      'Autonomie batterie : 3 ans',
      'Précision : ± 2%',
      'Résistance : Étanchéité IP68'
    ],
    utilisation:
      'Suivi en temps réel des besoins en eau de la plante, déclenchement automatique de l\'irrigation et prévention du stress hydrique.',
    dateAcquisition: '2025-06-01',
    coutAcquisition: 350000,
    valeurActuelle: 280000,
    etat: 'operationnel',
    localisation: 'Parcelle maraîchère (Secteur B)',
    responsable: 'Technicien agricole',
    heuresUtilisation: 600,
    prochaineMaintenance: '2027-06-01',
    garantie: '1 an',
    images: ['/images/materiels/humidite.jpg'],
    maintenances: [],
    historique: [],
    createdAt: new Date().toISOString(),
  },

  {
    id: 'mat-008',
    nom: 'Capteur de température',
    categorie: 'Capteur',
    marque: 'AgriSense',
    modele: 'ClimaTrack TS-100',
    numeroSerie: 'CAP-T-001',
    description:
      'Capteur environnemental pour le suivi continu de la température et de l\'hygrométrie de l\'air ambiant.',
    caracteristiques: [
      'Plage de mesure : -20°C à +60°C',
      'Précision : ± 0.3°C',
      'Transmission : Temps réel via Wi-Fi/LoRa',
      'Alerte : Notification SMS en cas de gel',
      'Protection : Bouclier anti-radiations solaires'
    ],
    utilisation:
      'Surveillance du microclimat des serres, anticipation des risques de maladies cryptogamiques et alertes climatiques.',
    dateAcquisition: '2025-06-10',
    coutAcquisition: 300000,
    valeurActuelle: 240000,
    etat: 'operationnel',
    localisation: 'Station météo centrale',
    responsable: 'Technicien agricole',
    heuresUtilisation: 580,
    prochaineMaintenance: '2027-06-10',
    garantie: '1 an',
    images: [
      '/images/materiels/capteur-temperature1.jpg',
      '/images/materiels/capteur-temperature2.jpg',
      '/images/materiels/capteur-temperature3.jpg',
    ],
    maintenances: [],
    historique: [],
    createdAt: new Date().toISOString(),
  },

  {
    id: 'mat-009',
    nom: 'Remorque agricole',
    categorie: 'Remorque',
    marque: 'FarmTrailer',
    modele: 'AgroLoad 3T',
    numeroSerie: 'REM-001',
    description:
      'Remorque basculante robuste à un essieu pour le transport polyvalent des charges agricoles.',
    caracteristiques: [
      'Capacité de charge : 3 Tonnes',
      'Basculement : Hydraulique arrière',
      'Ridelles : Acier galvanisé amovibles (50cm)',
      'Freinage : Mécanique à inertie',
      'Pneus : Basse pression pour protéger le sol'
    ],
    utilisation:
      'Transport de la récolte depuis les champs, livraison de fumier, déplacement d\'outillages et d\'intrants.',
    dateAcquisition: '2024-12-05',
    coutAcquisition: 3200000,
    valeurActuelle: 2700000,
    etat: 'operationnel',
    localisation: 'Hangar principal',
    responsable: 'Chef de ferme',
    heuresUtilisation: 710,
    prochaineMaintenance: '2026-10-05',
    garantie: '5 ans (Châssis)',
    images: [
      '/images/materiels/remorque1.jpg',
      '/images/materiels/remorque2.jpg',
      '/images/materiels/remorque3.jpg',
    ],
    maintenances: [],
    historique: [],
    createdAt: new Date().toISOString(),
  }
]