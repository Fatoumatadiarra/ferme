// ============================================================
// Sales Module — Data & Types
// ============================================================

export type StatutVente = 'Payée' | 'En attente' | 'Annulée'
export type MethodePaiement = 'Espèces' | 'Virement' | 'Mobile Money' | 'Chèque'

export interface SaleRecord {
  id: string
  numeroFacture: string
  produit: string
  client: string
  telephoneClient?: string
  quantite: number
  prixUnitaire: number
  montantTotal: number
  dateVente: string
  statut: StatutVente
  methodePaiement: MethodePaiement
  notes?: string
  createdAt: string
}

export const INITIAL_SALES_DATA: SaleRecord[] = [
  {
    id: 'sale-001',
    numeroFacture: 'FAC-2608-001',
    produit: 'Tomates',
    client: 'Marché Central',
    telephoneClient: '+221 77 111 22 33',
    quantite: 500, // kg
    prixUnitaire: 400,
    montantTotal: 200000,
    dateVente: '2026-08-01',
    statut: 'Payée',
    methodePaiement: 'Virement',
    createdAt: new Date('2026-08-01T10:00:00Z').toISOString()
  },
  {
    id: 'sale-002',
    numeroFacture: 'FAC-2608-002',
    produit: 'Poulets de chair',
    client: 'Restaurant Le Gourmet',
    quantite: 50,
    prixUnitaire: 3500,
    montantTotal: 175000,
    dateVente: '2026-08-05',
    statut: 'En attente',
    methodePaiement: 'Mobile Money',
    createdAt: new Date('2026-08-05T14:30:00Z').toISOString()
  },
  {
    id: 'sale-003',
    numeroFacture: 'FAC-2608-003',
    produit: 'Lait de vache',
    client: 'Coopérative Laitière',
    telephoneClient: '+221 76 999 88 77',
    quantite: 200, // Litres
    prixUnitaire: 600,
    montantTotal: 120000,
    dateVente: '2026-08-10',
    statut: 'Payée',
    methodePaiement: 'Virement',
    createdAt: new Date('2026-08-10T08:15:00Z').toISOString()
  }
]
