import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Plus, Search, Filter, Eye, Edit2, Trash2, Banknote, ShoppingCart, TrendingUp, Users } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle, Input, Button, SectionTitle, EmptyState } from '@/components/ui'
import { STORAGE_KEYS } from '@/constants'
import { StorageService } from '@/services'
import type { SaleRecord } from '@/data/sales-init'
import { INITIAL_SALES_DATA } from '@/data/sales-init'
import type { StockRecord } from '@/data/stocks-init'
import { SaleDetailModal } from '@/components/sales'
import { cn, formatCurrency } from '@/utils'

const saleSchema = z.object({
  produit: z.string().min(2, 'Le produit est obligatoire'),
  client: z.string().min(2, 'Le client est obligatoire'),
  telephoneClient: z.string().optional(),
  quantite: z.coerce.number().min(0.1, 'Quantité invalide'),
  prixUnitaire: z.coerce.number().min(1, 'Prix invalide'),
  dateVente: z.string().min(1, 'Date obligatoire'),
  statut: z.enum(['Payée', 'En attente', 'Annulée']),
  methodePaiement: z.enum(['Espèces', 'Virement', 'Mobile Money', 'Chèque']),
  notes: z.string().optional()
})

type SaleFormValues = z.infer<typeof saleSchema>

export default function SalesPage() {
  const [sales, setSales] = useState<SaleRecord[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatut, setFilterStatut] = useState<string>('Tous')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedSale, setSelectedSale] = useState<SaleRecord | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SaleFormValues>({
    resolver: zodResolver(saleSchema) as any,
    defaultValues: { dateVente: new Date().toISOString().split('T')[0], statut: 'Payée', methodePaiement: 'Espèces', quantite: 1, prixUnitaire: 0 }
  })

  useEffect(() => {
    const stored = StorageService.get<SaleRecord[]>(STORAGE_KEYS.VENTES)
    if (!stored || stored.length === 0) {
      StorageService.set(STORAGE_KEYS.VENTES, INITIAL_SALES_DATA)
      setSales(INITIAL_SALES_DATA)
    } else {
      setSales(stored)
    }
  }, [])

  const saveSales = (next: SaleRecord[]) => {
    setSales(next)
    StorageService.set(STORAGE_KEYS.VENTES, next)
  }

  const filteredSales = useMemo(() => {
    return sales.filter(s => {
      const matchSearch = s.produit.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.numeroFacture.toLowerCase().includes(searchTerm.toLowerCase())
      const matchFilter = filterStatut === 'Tous' || s.statut === filterStatut
      return matchSearch && matchFilter
    }).sort((a, b) => new Date(b.dateVente).getTime() - new Date(a.dateVente).getTime())
  }, [sales, searchTerm, filterStatut])

  const stats = useMemo(() => {
    const caTotal = sales.filter(s => s.statut === 'Payée').reduce((acc, s) => acc + s.montantTotal, 0)
    const enAttente = sales.filter(s => s.statut === 'En attente').reduce((acc, s) => acc + s.montantTotal, 0)
    const totalVentes = sales.length
    
    // Clients uniques
    const uniqueClients = new Set(sales.map(s => s.client)).size

    // Données pour le graphique (groupé par jour)
    const salesByDay = sales.reduce((acc: any, sale) => {
      if (sale.statut !== 'Annulée') {
        const date = sale.dateVente
        acc[date] = (acc[date] || 0) + sale.montantTotal
      }
      return acc
    }, {})

    const chartData = Object.keys(salesByDay)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .map(date => ({
        date: new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
        montant: salesByDay[date]
      }))

    return { caTotal, enAttente, totalVentes, uniqueClients, chartData }
  }, [sales])

  const onSubmit = handleSubmit((data: SaleFormValues) => {
    const montantTotal = data.quantite * data.prixUnitaire
    
    if (editingId) {
      const next = sales.map(s => s.id === editingId ? { ...s, ...data, montantTotal } : s)
      saveSales(next)
      toast.success('Vente mise à jour')
    } else {
      const generateInvoiceNumber = () => {
        const date = new Date()
        const yymm = `${date.getFullYear().toString().slice(-2)}${String(date.getMonth() + 1).padStart(2, '0')}`
        const random = Math.floor(100 + Math.random() * 900)
        return `FAC-${yymm}-${random}`
      }

      const newSale: SaleRecord = {
        ...data,
        id: crypto.randomUUID(),
        numeroFacture: generateInvoiceNumber(),
        montantTotal,
        createdAt: new Date().toISOString()
      }
      saveSales([newSale, ...sales])

      // 💡 BONUS: Mise à jour du stock
      const stocks = StorageService.get<StockRecord[]>(STORAGE_KEYS.STOCKS) || []
      const stockAssocie = stocks.find(s => s.nom.toLowerCase() === data.produit.toLowerCase())
      if (stockAssocie) {
        const nouveauStock = {
          ...stockAssocie,
          quantite: Math.max(0, stockAssocie.quantite - data.quantite),
          mouvements: [
            ...stockAssocie.mouvements,
            {
              id: crypto.randomUUID(),
              date: new Date().toISOString(),
              type: 'sortie' as const,
              quantite: data.quantite,
              motif: `Vente ${newSale.numeroFacture}`,
              responsable: 'Système'
            }
          ]
        }
        if (nouveauStock.quantite <= nouveauStock.seuilAlerte) {
          nouveauStock.statut = nouveauStock.quantite === 0 ? 'Rupture' : 'Faible'
        }
        StorageService.set(STORAGE_KEYS.STOCKS, stocks.map(s => s.id === stockAssocie.id ? nouveauStock : s))
        toast.success('Vente enregistrée et stock déduit automatiquement', { duration: 4000 })
      } else {
        toast.success('Vente enregistrée')
      }
    }
    setIsFormOpen(false)
    setEditingId(null)
    reset()
  })

  const handleDelete = (id: string) => {
    if (confirm('Confirmez-vous la suppression de cette vente ? (Attention, le stock ne sera pas re-crédité automatiquement)')) {
      saveSales(sales.filter(s => s.id !== id))
      toast.success('Vente supprimée')
    }
  }

  const openEditForm = (sale: SaleRecord) => {
    setEditingId(sale.id)
    reset({
      produit: sale.produit,
      client: sale.client,
      telephoneClient: sale.telephoneClient,
      quantite: sale.quantite,
      prixUnitaire: sale.prixUnitaire,
      dateVente: sale.dateVente,
      statut: sale.statut,
      methodePaiement: sale.methodePaiement,
      notes: sale.notes
    })
    setIsFormOpen(true)
  }

  const STATUT_COLORS = {
    'Payée': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'En attente': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    'Annulée': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <SectionTitle 
          title="Ventes & Facturation" 
          subtitle="Suivez votre chiffre d'affaires et générez des factures." 
          badge="Commercial" 
        />
        <Button onClick={() => { setIsFormOpen(!isFormOpen); setEditingId(null); reset() }} leftIcon={<Plus className="w-4 h-4" />}>
          {isFormOpen ? 'Fermer le formulaire' : 'Nouvelle Vente'}
        </Button>
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <Card className="mb-6 border-agri-200 shadow-sm">
              <CardHeader>
                <CardTitle>{editingId ? 'Modifier la vente' : 'Enregistrer une vente'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={onSubmit} className="grid md:grid-cols-3 gap-4">
                  <Input label="Produit vendu" {...register('produit')} error={errors.produit?.message} />
                  <Input label="Client" {...register('client')} error={errors.client?.message} />
                  <Input label="Téléphone Client (Optionnel)" {...register('telephoneClient')} />
                  
                  <Input type="number" step="0.01" label="Quantité" {...register('quantite')} error={errors.quantite?.message} />
                  <Input type="number" label="Prix Unitaire" {...register('prixUnitaire')} error={errors.prixUnitaire?.message} />
                  <Input type="date" label="Date de vente" {...register('dateVente')} error={errors.dateVente?.message} />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Statut</label>
                    <select {...register('statut')} className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-agri-500 focus:outline-none focus:ring-1 focus:ring-agri-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                      <option value="Payée">Payée</option>
                      <option value="En attente">En attente</option>
                      <option value="Annulée">Annulée</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Paiement</label>
                    <select {...register('methodePaiement')} className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-agri-500 focus:outline-none focus:ring-1 focus:ring-agri-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                      <option value="Espèces">Espèces</option>
                      <option value="Virement">Virement</option>
                      <option value="Mobile Money">Mobile Money</option>
                      <option value="Chèque">Chèque</option>
                    </select>
                  </div>
                  <Input label="Notes (Optionnel)" {...register('notes')} />
                  
                  <div className="md:col-span-3 flex justify-end gap-2 mt-2">
                    <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>Annuler</Button>
                    <Button type="submit">Enregistrer</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-none">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-xs font-medium">Chiffre d'Affaires</p>
                <p className="text-2xl font-bold mt-1">{(stats.caTotal / 1000000).toFixed(2)}M FCFA</p>
              </div>
              <div className="p-2.5 bg-white/20 rounded-xl"><Banknote className="w-5 h-5 text-white" /></div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-500 to-amber-600 text-white border-none">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-xs font-medium">Paiements en attente</p>
                <p className="text-2xl font-bold mt-1">{(stats.enAttente / 1000).toFixed(0)}k FCFA</p>
              </div>
              <div className="p-2.5 bg-white/20 rounded-xl"><TrendingUp className="w-5 h-5 text-white" /></div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-none">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-xs font-medium">Ventes Réalisées</p>
                <p className="text-3xl font-bold mt-1">{stats.totalVentes}</p>
              </div>
              <div className="p-2.5 bg-white/20 rounded-xl"><ShoppingCart className="w-5 h-5 text-white" /></div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs font-medium">Clients Uniques</p>
                <p className="text-3xl font-bold mt-1">{stats.uniqueClients}</p>
              </div>
              <div className="p-2.5 bg-white/20 rounded-xl"><Users className="w-5 h-5 text-white" /></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-[1fr_2fr] gap-6">
        
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Évolution du Chiffre d'Affaires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              {stats.chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorMontant" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(val) => `${val / 1000}k`} />
                    <RechartsTooltip 
                      formatter={(value: any) => [`${(Number(value) || 0).toLocaleString()} FCFA`, 'Montant']}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="montant" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorMontant)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">Aucune donnée de vente</div>
              )}
            </div>
          </CardContent>
        </Card>

      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher par produit, client, facture..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Filter className="w-4 h-4" />
            <select
              value={filterStatut}
              onChange={(e) => setFilterStatut(e.target.value)}
              className="bg-transparent border-none focus:ring-0 font-medium cursor-pointer"
            >
              <option value="Tous">Tous les statuts</option>
              <option value="Payée">Payée</option>
              <option value="En attente">En attente</option>
              <option value="Annulée">Annulée</option>
            </select>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {filteredSales.length === 0 ? (
            <div className="p-8"><EmptyState title="Aucune vente trouvée" description="Enregistrez votre première vente." /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
                    <th className="py-4 px-6 font-semibold text-sm text-gray-500 dark:text-gray-400">Facture</th>
                    <th className="py-4 px-6 font-semibold text-sm text-gray-500 dark:text-gray-400">Date</th>
                    <th className="py-4 px-6 font-semibold text-sm text-gray-500 dark:text-gray-400">Client</th>
                    <th className="py-4 px-6 font-semibold text-sm text-gray-500 dark:text-gray-400">Produit</th>
                    <th className="py-4 px-6 font-semibold text-sm text-gray-500 dark:text-gray-400">Montant</th>
                    <th className="py-4 px-6 font-semibold text-sm text-gray-500 dark:text-gray-400">Statut</th>
                    <th className="py-4 px-6 font-semibold text-sm text-gray-500 dark:text-gray-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                  {filteredSales.map(sale => (
                    <tr key={sale.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                      <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">
                        {sale.numeroFacture}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500">
                        {new Date(sale.dateVente).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">
                        {sale.client}
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-gray-900 dark:text-white">{sale.produit}</p>
                        <p className="text-xs text-gray-500">{sale.quantite} x {sale.prixUnitaire} FCFA</p>
                      </td>
                      <td className="py-4 px-6 font-bold text-gray-900 dark:text-white">
                        {formatCurrency(sale.montantTotal)}
                      </td>
                      <td className="py-4 px-6">
                        <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold", STATUT_COLORS[sale.statut])}>
                          {sale.statut}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" onClick={() => setSelectedSale(sale)} className="h-8 w-8 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20" title="Voir Facture">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openEditForm(sale)} className="h-8 w-8 text-gray-500">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(sale.id)} className="h-8 w-8 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <SaleDetailModal sale={selectedSale} isOpen={!!selectedSale} onClose={() => setSelectedSale(null)} />
    </div>
  )
}
