// ============================================================
// Employees Module — Data & Types
// ============================================================

export type Sexe = 'Homme' | 'Femme'
export type StatutEmploye = 'actif' | 'inactif' | 'conge'
export type StatutPresence = 'present' | 'absent' | 'retard' | 'conge'

export interface TacheEmploye {
  id: string
  titre: string
  priorite: 'haute' | 'normale' | 'basse'
  statut: 'a_faire' | 'en_cours' | 'terminee'
  dateEcheance: string
}

export interface PresenceRecord {
  date: string
  statut: StatutPresence
  heures?: number
}

export interface EmployeeRecord {
  id: string
  nom: string
  prenom: string
  sexe: Sexe
  email: string
  telephone: string
  adresse: string
  poste: string
  secteur: string
  salaire: number
  dateEmbauche: string
  statut: StatutEmploye
  photo: string
  taches: TacheEmploye[]
  presences: PresenceRecord[]
  createdAt: string
}

export const SECTEURS = [
  'Maraîchage',
  'Élevage',
  'Aviculture',
  'Aquaculture',
  'Maintenance',
  'Administration',
  'Logistique',
] as const

export type Secteur = (typeof SECTEURS)[number]

export const INITIAL_EMPLOYEES_DATA: EmployeeRecord[] = [
  {
    id: 'emp-001',
    nom: 'Diallo',
    prenom: 'Moussa',
    sexe: 'Homme',
    email: 'moussa.diallo@ferme.sn',
    telephone: '+221 77 123 45 67',
    adresse: 'Thiès, Sénégal',
    poste: 'Responsable Maraîchage',
    secteur: 'Maraîchage',
    salaire: 350000,
    dateEmbauche: '2022-03-01',
    statut: 'actif',
    photo: '/images/avatars/avatar-1.jpg',
    taches: [
      { id: 't1', titre: 'Inspection des serres', priorite: 'haute', statut: 'en_cours', dateEcheance: '2026-08-10' },
      { id: 't2', titre: 'Planification récolte tomates', priorite: 'normale', statut: 'a_faire', dateEcheance: '2026-08-15' },
    ],
    presences: [
      { date: '2026-08-01', statut: 'present', heures: 8 },
      { date: '2026-08-02', statut: 'present', heures: 8 },
      { date: '2026-08-03', statut: 'absent' },
      { date: '2026-08-04', statut: 'present', heures: 8 },
      { date: '2026-08-05', statut: 'present', heures: 7 },
    ],
    createdAt: new Date('2022-03-01').toISOString(),
  },
  {
    id: 'emp-002',
    nom: 'Ndiaye',
    prenom: 'Fatou',
    sexe: 'Femme',
    email: 'fatou.ndiaye@ferme.sn',
    telephone: '+221 76 234 56 78',
    adresse: 'Dakar, Sénégal',
    poste: 'Technicienne Élevage',
    secteur: 'Élevage',
    salaire: 280000,
    dateEmbauche: '2023-01-15',
    statut: 'actif',
    photo: '/images/avatars/avatar-2.jpg',
    taches: [
      { id: 't3', titre: 'Vaccination troupeau ovin', priorite: 'haute', statut: 'terminee', dateEcheance: '2026-08-05' },
      { id: 't4', titre: 'Rapport sanitaire mensuel', priorite: 'normale', statut: 'en_cours', dateEcheance: '2026-08-20' },
    ],
    presences: [
      { date: '2026-08-01', statut: 'present', heures: 8 },
      { date: '2026-08-02', statut: 'retard', heures: 6 },
      { date: '2026-08-03', statut: 'present', heures: 8 },
      { date: '2026-08-04', statut: 'present', heures: 8 },
      { date: '2026-08-05', statut: 'present', heures: 8 },
    ],
    createdAt: new Date('2023-01-15').toISOString(),
  },
  {
    id: 'emp-003',
    nom: 'Sow',
    prenom: 'Ibrahima',
    sexe: 'Homme',
    email: 'ibrahima.sow@ferme.sn',
    telephone: '+221 70 345 67 89',
    adresse: 'Saint-Louis, Sénégal',
    poste: 'Aviculteur Senior',
    secteur: 'Aviculture',
    salaire: 240000,
    dateEmbauche: '2023-06-01',
    statut: 'actif',
    photo: '/images/avatars/avatar-3.jpg',
    taches: [
      { id: 't5', titre: 'Tri des œufs de caille', priorite: 'normale', statut: 'terminee', dateEcheance: '2026-08-04' },
    ],
    presences: [
      { date: '2026-08-01', statut: 'conge' },
      { date: '2026-08-02', statut: 'conge' },
      { date: '2026-08-03', statut: 'present', heures: 8 },
      { date: '2026-08-04', statut: 'present', heures: 8 },
      { date: '2026-08-05', statut: 'present', heures: 8 },
    ],
    createdAt: new Date('2023-06-01').toISOString(),
  },
  {
    id: 'emp-004',
    nom: 'Ba',
    prenom: 'Aminata',
    sexe: 'Femme',
    email: 'aminata.ba@ferme.sn',
    telephone: '+221 78 456 78 90',
    adresse: 'Ziguinchor, Sénégal',
    poste: 'Piscicultrice',
    secteur: 'Aquaculture',
    salaire: 260000,
    dateEmbauche: '2024-02-01',
    statut: 'actif',
    photo: '/images/avatars/avatar-4.jpg',
    taches: [
      { id: 't6', titre: 'Contrôle pH bassin Tilapia', priorite: 'haute', statut: 'en_cours', dateEcheance: '2026-08-06' },
      { id: 't7', titre: 'Commande aliments granulés', priorite: 'basse', statut: 'a_faire', dateEcheance: '2026-08-25' },
    ],
    presences: [
      { date: '2026-08-01', statut: 'present', heures: 8 },
      { date: '2026-08-02', statut: 'present', heures: 8 },
      { date: '2026-08-03', statut: 'present', heures: 8 },
      { date: '2026-08-04', statut: 'absent' },
      { date: '2026-08-05', statut: 'present', heures: 8 },
    ],
    createdAt: new Date('2024-02-01').toISOString(),
  },
  {
    id: 'emp-005',
    nom: 'Kane',
    prenom: 'Oumar',
    sexe: 'Homme',
    email: 'oumar.kane@ferme.sn',
    telephone: '+221 77 567 89 01',
    adresse: 'Kaolack, Sénégal',
    poste: 'Mécanicien Agricole',
    secteur: 'Maintenance',
    salaire: 300000,
    dateEmbauche: '2021-08-15',
    statut: 'actif',
    photo: '/images/avatars/avatar-5.jpg',
    taches: [
      { id: 't8', titre: 'Révision tracteur John Deere', priorite: 'haute', statut: 'en_cours', dateEcheance: '2026-08-08' },
    ],
    presences: [
      { date: '2026-08-01', statut: 'present', heures: 9 },
      { date: '2026-08-02', statut: 'present', heures: 9 },
      { date: '2026-08-03', statut: 'present', heures: 9 },
      { date: '2026-08-04', statut: 'present', heures: 8 },
      { date: '2026-08-05', statut: 'retard', heures: 7 },
    ],
    createdAt: new Date('2021-08-15').toISOString(),
  },
  {
    id: 'emp-006',
    nom: 'Faye',
    prenom: 'Marie',
    sexe: 'Femme',
    email: 'marie.faye@ferme.sn',
    telephone: '+221 76 678 90 12',
    adresse: 'Mbour, Sénégal',
    poste: 'Responsable Administration',
    secteur: 'Administration',
    salaire: 420000,
    dateEmbauche: '2020-01-10',
    statut: 'actif',
    photo: '/images/avatars/avatar-6.jpg',
    taches: [
      { id: 't9', titre: 'Préparation paie mensuelle', priorite: 'haute', statut: 'en_cours', dateEcheance: '2026-08-31' },
      { id: 't10', titre: 'Bilan RH trimestriel', priorite: 'normale', statut: 'a_faire', dateEcheance: '2026-09-15' },
    ],
    presences: [
      { date: '2026-08-01', statut: 'present', heures: 8 },
      { date: '2026-08-02', statut: 'present', heures: 8 },
      { date: '2026-08-03', statut: 'present', heures: 8 },
      { date: '2026-08-04', statut: 'present', heures: 8 },
      { date: '2026-08-05', statut: 'present', heures: 8 },
    ],
    createdAt: new Date('2020-01-10').toISOString(),
  },
];
