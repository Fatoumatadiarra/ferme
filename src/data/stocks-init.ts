// ============================================================
// Stocks Module — Data & Types
// ============================================================

export type CategorieStock = 'Semences' | 'Engrais' | 'Produits Phytosanitaires' | 'Aliments pour bétail' | 'Carburant' | 'Emballages' | 'Matériel'

export interface MouvementStock {
  id: string
  date: string
  type: 'entree' | 'sortie'
  quantite: number
  motif: string
  responsable: string
}

export interface StockRecord {
  id: string
  nom: string
  categorie: CategorieStock
  quantite: number
  unite: string
  seuilAlerte: number
  statut: 'En stock' | 'Faible' | 'Rupture'
  fournisseur: string
  prixUnitaire: number
  mouvements: MouvementStock[]
  createdAt: string
  updatedAt?: string
}

export const CATEGORIES_STOCK: CategorieStock[] = [
  'Semences',
  'Engrais',
  'Produits Phytosanitaires',
  'Aliments pour bétail',
  'Carburant',
  'Emballages',
  'Matériel'
]

export const INITIAL_STOCKS_DATA: StockRecord[] = [
  {
    id: 'stk-001',
    nom: 'Semences Tomates Roma',
    categorie: 'Semences',
    quantite: 15,
    unite: 'kg',
    seuilAlerte: 5,
    statut: 'En stock',
    fournisseur: 'AgriSeed SN',
    prixUnitaire: 12000,
    mouvements: [
      { id: 'mvt-1', date: '2025-10-01T08:00:00Z', type: 'entree', quantite: 20, motif: 'Achat initial', responsable: 'Diallo M.' },
      { id: 'mvt-2', date: '2025-11-15T09:30:00Z', type: 'sortie', quantite: 5, motif: 'Semis saison', responsable: 'Diallo M.' }
    ],
    createdAt: new Date('2025-10-01').toISOString(),
  },
  {
    id: 'stk-002',
    nom: 'Engrais NPK 15-15-15',
    categorie: 'Engrais',
    quantite: 2,
    unite: 'sacs (50kg)',
    seuilAlerte: 10,
    statut: 'Faible',
    fournisseur: 'SenEngrais',
    prixUnitaire: 25000,
    mouvements: [
      { id: 'mvt-3', date: '2025-09-01T10:00:00Z', type: 'entree', quantite: 50, motif: 'Achat gros', responsable: 'Faye M.' },
      { id: 'mvt-4', date: '2026-02-10T14:00:00Z', type: 'sortie', quantite: 48, motif: 'Épandage champs', responsable: 'Diallo M.' }
    ],
    createdAt: new Date('2025-09-01').toISOString(),
  },
  {
    id: 'stk-003',
    nom: 'Aliment Volaille Croissance',
    categorie: 'Aliments pour bétail',
    quantite: 0,
    unite: 'sacs (25kg)',
    seuilAlerte: 20,
    statut: 'Rupture',
    fournisseur: 'NutriAnim',
    prixUnitaire: 15000,
    mouvements: [
      { id: 'mvt-5', date: '2026-05-01T11:00:00Z', type: 'entree', quantite: 100, motif: 'Approvisionnement', responsable: 'Sow I.' },
      { id: 'mvt-6', date: '2026-07-20T16:00:00Z', type: 'sortie', quantite: 100, motif: 'Consommation totale', responsable: 'Sow I.' }
    ],
    createdAt: new Date('2026-05-01').toISOString(),
  }
]
