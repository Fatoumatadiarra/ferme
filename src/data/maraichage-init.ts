export interface CropTimelineEvent {
  phase: string;
  duration: string;
  description: string;
}

export interface CropData {
  id: string;
  nom: string;
  type: 'Légume' | 'Fruit';
  surface: string;
  etat: 'En croissance' | 'Récolte imminente' | 'Plantation' | 'Récolté';
  datePlantation: string;
  recolteEstimee: string;
  images: string[];
  presentation: string;
  origine: string;
  varietes: string[];
  importanceEconomique: string;
  climat: {
    sol: string;
    temperature: string;
    humidite: string;
    besoinsEau: string;
  };
  timeline: CropTimelineEvent[];
  pratiques: {
    engrais: string[];
    irrigation: string;
    maladies: string[];
    ravageurs: string[];
    traitements: string[];
    conseils: string;
  };
  statistiques: {
    rendementAttendu: string;
    dureeProduction: string;
    rentabilite: string;
    donneesGraphique: { mois: string; rendement: number; revenus: number }[];
  };
  valorisationDechets: string;
  createdAt: string;
}

export const INITIAL_MARAICHAGE_DATA: CropData[] = [
  {
    id: 'crop-tomate',
    nom: 'Tomate',
    type: 'Légume',
    surface: '2.5 ha',
    etat: 'En croissance',
    datePlantation: '2026-06-15',
    recolteEstimee: '2026-09-01',
    images: [
      '/images/maraichage/tomate.jpg',
    ],
    presentation: 'La tomate est une plante herbacée sensible au froid, cultivée pour son fruit charnu.',
    origine: 'Amérique du Sud (Andes)',
    varietes: ['Marmande', 'Roma', 'Cœur de Bœuf', 'Cerise'],
    importanceEconomique: 'Culture maraîchère la plus consommée et transformée au monde.',
    climat: {
      sol: 'Léger, meuble, riche en humus, bien drainé',
      temperature: '18°C à 25°C',
      humidite: '60% à 70%',
      besoinsEau: 'Importants (irrigation régulière, au goutte-à-goutte)',
    },
    timeline: [
      { phase: 'Semis', duration: 'Jour 0', description: 'Semis en pépinière' },
      { phase: 'Levée', duration: 'Jour 8-10', description: 'Apparition des premières feuilles' },
      { phase: 'Repiquage', duration: 'Semaine 4-5', description: 'Mise en terre au champ' },
      { phase: 'Floraison', duration: 'Semaine 8-9', description: 'Développement des premières fleurs' },
      { phase: 'Fructification', duration: 'Semaine 10-12', description: 'Grossissement des fruits' },
      { phase: 'Récolte', duration: 'Semaine 12-20', description: 'Cueillette échelonnée' },
    ],
    pratiques: {
      engrais: ['Compost organique (fondation)', 'Engrais NPK (10-10-20) pendant la floraison', 'Calcium pour éviter la nécrose apicale'],
      irrigation: 'Goutte-à-goutte quotidien sans mouiller les feuilles.',
      maladies: ['Mildiou', 'Oïdium', 'Alternariose'],
      ravageurs: ['Pucerons', 'Mouches blanches', 'Nématodes'],
      traitements: ['Bouillie bordelaise (préventif)', 'Purin d\'ortie', 'Lutte biologique (coccinelles)'],
      conseils: 'Tuteurer tôt et pincer les gourmands pour favoriser les beaux fruits.',
    },
    statistiques: {
      rendementAttendu: '40 à 60 tonnes/ha',
      dureeProduction: '4 à 5 mois',
      rentabilite: 'Haute (Forte demande locale et industrielle)',
      donneesGraphique: [
        { mois: 'Juin', rendement: 0, revenus: 0 },
        { mois: 'Juil', rendement: 5, revenus: 1500 },
        { mois: 'Août', rendement: 20, revenus: 6000 },
        { mois: 'Sept', rendement: 30, revenus: 9000 },
        { mois: 'Oct', rendement: 10, revenus: 3000 },
      ],
    },
    valorisationDechets: 'Compostage des tiges et feuilles non malades pour enrichir le sol de la prochaine rotation.',
    createdAt: new Date('2026-06-15').toISOString(),
  },
  {
    id: 'crop-carotte',
    nom: 'Carotte',
    type: 'Légume',
    surface: '1.2 ha',
    etat: 'Récolte imminente',
    datePlantation: '2026-05-10',
    recolteEstimee: '2026-08-15',
    images: [
      '/images/maraichage/carotte.jpg',
    ],
    presentation: 'Plante bisannuelle cultivée pour sa racine pivotante charnue.',
    origine: 'Moyen-Orient et Asie centrale',
    varietes: ['Nantaise', 'Touchon', 'Colmar'],
    importanceEconomique: 'Légume racine très populaire, riche en carotène.',
    climat: {
      sol: 'Sableux, limoneux, profond et sans cailloux',
      temperature: '15°C à 20°C',
      humidite: 'Modérée',
      besoinsEau: 'Réguliers pour éviter l\'éclatement des racines',
    },
    timeline: [
      { phase: 'Semis', duration: 'Jour 0', description: 'Semis direct en pleine terre' },
      { phase: 'Levée', duration: 'Semaine 2-3', description: 'Germination lente' },
      { phase: 'Éclaircissage', duration: 'Semaine 5-6', description: 'Retrait des plants en surnombre' },
      { phase: 'Grossissement', duration: 'Semaine 8-12', description: 'Développement de la racine pivotante' },
      { phase: 'Récolte', duration: 'Semaine 12-16', description: 'Arrachage mécanique ou manuel' },
    ],
    pratiques: {
      engrais: ['Fumure de fond bien décomposée', 'Potassium (K) favorisant le sucre et la conservation'],
      irrigation: 'Aspersion fine et régulière, surtout après le semis.',
      maladies: ['Alternariose', 'Fonte des semis', 'Oïdium'],
      ravageurs: ['Mouche de la carotte', 'Pucerons', 'Nématodes'],
      traitements: ['Filet anti-insectes', 'Rotation stricte des cultures (4 ans minimum)'],
      conseils: 'Ne jamais utiliser de fumier frais, cela provoque la fourche des carottes.',
    },
    statistiques: {
      rendementAttendu: '30 à 45 tonnes/ha',
      dureeProduction: '3 à 4 mois',
      rentabilite: 'Moyenne à Bonne',
      donneesGraphique: [
        { mois: 'Juin', rendement: 0, revenus: 0 },
        { mois: 'Juil', rendement: 0, revenus: 0 },
        { mois: 'Août', rendement: 40, revenus: 12000 },
        { mois: 'Sept', rendement: 5, revenus: 1500 },
      ],
    },
    valorisationDechets: 'Fanes utilisées comme fourrage pour l\'élevage (lapins, moutons) ou intégrées au compost.',
    createdAt: new Date('2026-05-10').toISOString(),
  },
  {
    id: 'crop-chou',
    nom: 'Chou',
    type: 'Légume',
    surface: '1.8 ha',
    etat: 'En croissance',
    datePlantation: '2026-07-01',
    recolteEstimee: '2026-10-15',
    images: [
      '/images/maraichage/chou.jpg',
    ],
    presentation: 'Légume feuille robuste, avec une pomme centrale compacte.',
    origine: 'Europe occidentale (régions côtières)',
    varietes: ['Chou cabus', 'Chou de Milan', 'Chou-fleur', 'Brocoli'],
    importanceEconomique: 'Légume d\'hiver majeur, excellente conservation.',
    climat: {
      sol: 'Lourd, argileux, frais et bien fumé',
      temperature: '15°C à 18°C',
      humidite: 'Forte',
      besoinsEau: 'Très importants, sol toujours humide',
    },
    timeline: [
      { phase: 'Semis', duration: 'Jour 0', description: 'Pépinière' },
      { phase: 'Repiquage', duration: 'Semaine 4-6', description: 'Mise en place avec un bon espacement' },
      { phase: 'Formation', duration: 'Semaine 8-10', description: 'Début de formation de la pomme' },
      { phase: 'Pommaison', duration: 'Semaine 12-16', description: 'Grossissement compact' },
      { phase: 'Récolte', duration: 'Semaine 16-20', description: 'Coupe franche à la base' },
    ],
    pratiques: {
      engrais: ['Forte exigence en Azote (N)', 'Compost très riche', 'Soufre'],
      irrigation: 'Abondante et régulière (aspersion ou goutte-à-goutte).',
      maladies: ['Hernie du chou', 'Mildiou'],
      ravageurs: ['Piéride du chou (chenilles)', 'Altises', 'Pucerons cendrés'],
      traitements: ['Bacillus thuringiensis contre les chenilles', 'Voiles anti-insectes', 'Amendement calcaire (contre la hernie)'],
      conseils: 'Butter les plants pour favoriser un bon enracinement de soutien.',
    },
    statistiques: {
      rendementAttendu: '35 à 50 tonnes/ha',
      dureeProduction: '3 à 5 mois',
      rentabilite: 'Stable',
      donneesGraphique: [
        { mois: 'Août', rendement: 0, revenus: 0 },
        { mois: 'Sept', rendement: 5, revenus: 1000 },
        { mois: 'Oct', rendement: 30, revenus: 6000 },
        { mois: 'Nov', rendement: 10, revenus: 2000 },
      ],
    },
    valorisationDechets: 'Feuilles extérieures abîmées distribuées en complément alimentaire à la volaille et aux ruminants.',
    createdAt: new Date('2026-07-01').toISOString(),
  },
  {
    id: 'crop-banane',
    nom: 'Banane',
    type: 'Fruit',
    surface: '4.0 ha',
    etat: 'En croissance',
    datePlantation: '2025-11-20',
    recolteEstimee: '2026-09-30',
    images: [
      '/images/maraichage/banane.jpg',
    ],
    presentation: 'Plante herbacée géante produisant des régimes de fruits sucrés.',
    origine: 'Asie du Sud-Est',
    varietes: ['Cavendish', 'Plantain', 'Gros Michel', 'Frécinette'],
    importanceEconomique: 'Un des fruits les plus exportés et consommés au monde.',
    climat: {
      sol: 'Profond, meuble, riche en matière organique, pH 5.5-6.5',
      temperature: '25°C à 30°C (Ne supporte pas le gel)',
      humidite: 'Très élevée (75-85%)',
      besoinsEau: 'Massifs (1500 à 2500 mm par an)',
    },
    timeline: [
      { phase: 'Plantation', duration: 'Mois 0', description: 'Plantation des rejets ou vitroplants' },
      { phase: 'Croissance', duration: 'Mois 1-7', description: 'Émission de nouvelles feuilles géantes' },
      { phase: 'Floraison', duration: 'Mois 7-9', description: 'Sortie de la jetée (fleur de bananier)' },
      { phase: 'Fructification', duration: 'Mois 9-11', description: 'Développement du régime' },
      { phase: 'Récolte', duration: 'Mois 11-12', description: 'Coupe du régime entier (stade vert)' },
    ],
    pratiques: {
      engrais: ['Très exigeant en Potassium (K) et Azote (N)', 'Apports fractionnés mensuels'],
      irrigation: 'Micro-aspersion sous frondaison quotidienne en saison sèche.',
      maladies: ['Cercosporiose (Maladie de Sigatoka)', 'Maladie de Panama (Fusariose)'],
      ravageurs: ['Charançon du bananier', 'Nématodes', 'Thrips'],
      traitements: ['Effeuillage sanitaire', 'Pièges à phéromones', 'Gaines protectrices sur les régimes'],
      conseils: 'Pratiquer l\'œilletonnage (ne conserver qu\'un seul rejet successeur par plant mère).',
    },
    statistiques: {
      rendementAttendu: '40 à 60 tonnes/ha',
      dureeProduction: '9 à 12 mois (cycle 1)',
      rentabilite: 'Très Haute (Culture pérenne sur plusieurs années)',
      donneesGraphique: [
        { mois: 'Juil', rendement: 0, revenus: 0 },
        { mois: 'Août', rendement: 10, revenus: 4000 },
        { mois: 'Sept', rendement: 40, revenus: 16000 },
        { mois: 'Oct', rendement: 10, revenus: 4000 },
      ],
    },
    valorisationDechets: 'Troncs (pseudo-troncs) hachés et laissés au sol (mulch) pour conserver l\'humidité et recycler le potassium.',
    createdAt: new Date('2025-11-20').toISOString(),
  },
  {
    id: 'crop-mandarine',
    nom: 'Mandarine',
    type: 'Fruit',
    surface: '3.0 ha',
    etat: 'En croissance',
    datePlantation: '2023-04-10',
    recolteEstimee: '2026-11-15',
    images: [
      '/images/maraichage/manderin.jpg',
    ],
    presentation: 'Agrume d\'hiver sucré et parfumé, issu d\'un arbre à feuillage persistant.',
    origine: 'Chine et Asie du Sud-Est',
    varietes: ['Clémentine', 'Satsuma', 'Tangerine'],
    importanceEconomique: 'Agrume incontournable des fêtes de fin d\'année, forte demande.',
    climat: {
      sol: 'Bien drainé, sablo-limoneux, neutre à légèrement acide',
      temperature: '15°C à 30°C (Craint les fortes gelées)',
      humidite: 'Modérée',
      besoinsEau: 'Moyens, surtout critiques pendant la nouaison (été)',
    },
    timeline: [
      { phase: 'Plantation', duration: 'Année 0', description: 'Mise en place de scions greffés' },
      { phase: 'Croissance', duration: 'Année 1-3', description: 'Taille de formation de l\'arbre' },
      { phase: 'Floraison', duration: 'Mars-Avril', description: 'Fleurs blanches parfumées' },
      { phase: 'Grossissement', duration: 'Mai-Octobre', description: 'Développement des fruits' },
      { phase: 'Récolte', duration: 'Novembre-Janvier', description: 'Cueillette minutieuse pour ne pas abîmer la peau' },
    ],
    pratiques: {
      engrais: ['NPK équilibré au printemps', 'Oligo-éléments (Zinc, Fer, Manganèse)', 'Fumier en automne'],
      irrigation: 'Goutte-à-goutte, éviter les stress hydriques en été.',
      maladies: ['Gommose', 'Mal secco', 'Tristeza (virus)'],
      ravageurs: ['Cochenilles', 'Pucerons', 'Mineuse des agrumes', 'Acariens'],
      traitements: ['Huile blanche contre les cochenilles', 'Savon noir', 'Porte-greffes résistants'],
      conseils: 'Éclaircir les fruits si l\'arbre est trop chargé pour éviter l\'alternance de production.',
    },
    statistiques: {
      rendementAttendu: '20 à 30 tonnes/ha (à maturité)',
      dureeProduction: 'Pérenne (Production dès la 3-4ème année)',
      rentabilite: 'Haute (Fruits à forte valeur ajoutée)',
      donneesGraphique: [
        { mois: 'Oct', rendement: 5, revenus: 2500 },
        { mois: 'Nov', rendement: 25, revenus: 12500 },
        { mois: 'Déc', rendement: 30, revenus: 15000 },
        { mois: 'Jan', rendement: 10, revenus: 5000 },
      ],
    },
    valorisationDechets: 'Les fruits écartés du tri peuvent être transformés en jus ou confiture. Écorces valorisables en huiles essentielles.',
    createdAt: new Date('2023-04-10').toISOString(),
  }
];

const MARAICHAGE_IMAGES: Record<string, string> = {
  tomate: '/images/maraichage/tomate.jpg',
  tomates: '/images/maraichage/tomate.jpg',
  carotte: '/images/maraichage/carotte.jpg',
  carottes: '/images/maraichage/carotte.jpg',
  chou: '/images/maraichage/chou.jpg',
  choux: '/images/maraichage/chou.jpg',
  banane: '/images/maraichage/banane.jpg',
  bananes: '/images/maraichage/banane.jpg',
  mandarin: '/images/maraichage/manderin.jpg',
  mandarine: '/images/maraichage/manderin.jpg',
  mandarines: '/images/maraichage/manderin.jpg',
  clementine: '/images/maraichage/manderin.jpg',
  tangerine: '/images/maraichage/manderin.jpg',
}

export function getMaraichageImage(cropName: string, fallback = ''): string {
  const normalizedName = cropName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
  const firstWord = normalizedName.split(/[\s-]+/)[0]

  return MARAICHAGE_IMAGES[normalizedName] ?? MARAICHAGE_IMAGES[firstWord] ?? fallback
}
