// ============================================================
// Expenses Module — Data & Types
// ============================================================

export type CategorieDepense = 'Salaires' | 'Équipement' | 'Intrants' | 'Maintenance' | 'Transport' | 'Électricité & Eau' | 'Autre'
export type StatutDepense = 'Payée' | 'Planifiée' | 'Annulée'

export interface ExpenseRecord {
  id: string
  libelle: string
  categorie: CategorieDepense
  montant: number
  dateDepense: string
  statut: StatutDepense
  fournisseur?: string
  notes?: string
  justificatif?: string
  createdAt: string
}

export const CATEGORIES_DEPENSE: CategorieDepense[] = [
  'Salaires',
  'Équipement',
  'Intrants',
  'Maintenance',
  'Transport',
  'Électricité & Eau',
  'Autre'
]

export const INITIAL_EXPENSES_DATA: ExpenseRecord[] = [
  {
    id: 'exp-001',
    libelle: 'Facture Électricité Senelec',
    categorie: 'Électricité & Eau',
    montant: 150000,
    dateDepense: '2026-08-05',
    statut: 'Payée',
    fournisseur: 'Senelec',
    createdAt: new Date('2026-08-05T09:00:00Z').toISOString()
  },
  {
    id: 'exp-002',
    libelle: 'Achat Engrais NPK',
    categorie: 'Intrants',
    montant: 250000,
    dateDepense: '2026-08-08',
    statut: 'Payée',
    fournisseur: 'SenEngrais',
    createdAt: new Date('2026-08-08T11:30:00Z').toISOString()
  },
  {
    id: 'exp-003',
    libelle: 'Entretien Tracteur John Deere',
    categorie: 'Maintenance',
    montant: 75000,
    dateDepense: '2026-08-15',
    statut: 'Planifiée',
    fournisseur: 'Garage Agricole',
    notes: 'Vidange et filtres',
    createdAt: new Date('2026-08-10T14:00:00Z').toISOString()
  }
]
