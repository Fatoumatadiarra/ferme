import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Plus, Search, Filter, ArrowUpDown, Eye, Edit2, Trash2, Package, AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle, Input, Button, SectionTitle, EmptyState } from '@/components/ui'
import { STORAGE_KEYS } from '@/constants'
import { StorageService } from '@/services'
import type { StockRecord, CategorieStock } from '@/data/stocks-init'
import { INITIAL_STOCKS_DATA, CATEGORIES_STOCK } from '@/data/stocks-init'
import { StockDetailModal } from '@/components/stocks'
import { cn } from '@/utils'

const stockSchema = z.object({
  nom: z.string().min(2, 'Le nom est obligatoire'),
  categorie: z.enum(CATEGORIES_STOCK as [CategorieStock, ...CategorieStock[]]),
  quantite: z.coerce.number().min(0, 'Quantité invalide'),
  unite: z.string().min(1, 'L\'unité est obligatoire'),
  seuilAlerte: z.coerce.number().min(0, 'Seuil invalide'),
  fournisseur: z.string().min(2, 'Le fournisseur est obligatoire'),
  prixUnitaire: z.coerce.number().min(0, 'Prix invalide'),
})

type StockFormValues = z.infer<typeof stockSchema>

export default function StocksPage() {
  const [stocks, setStocks] = useState<StockRecord[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategorie, setFilterCategorie] = useState<string>('Toutes')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedStock, setSelectedStock] = useState<StockRecord | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<StockFormValues>({
    resolver: zodResolver(stockSchema) as any,
    defaultValues: { categorie: 'Semences', quantite: 0, seuilAlerte: 10, prixUnitaire: 0 }
  })

  useEffect(() => {
    const stored = StorageService.get<StockRecord[]>(STORAGE_KEYS.STOCKS)
    if (!stored || stored.length === 0) {
      StorageService.set(STORAGE_KEYS.STOCKS, INITIAL_STOCKS_DATA)
      setStocks(INITIAL_STOCKS_DATA)
    } else {
      setStocks(stored)
    }
  }, [])

  const saveStocks = (next: StockRecord[]) => {
    setStocks(next)
    StorageService.set(STORAGE_KEYS.STOCKS, next)
  }

  const filteredStocks = useMemo(() => {
    return stocks.filter(s => {
      const matchSearch = s.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.fournisseur.toLowerCase().includes(searchTerm.toLowerCase())
      const matchFilter = filterCategorie === 'Toutes' || s.categorie === filterCategorie
      return matchSearch && matchFilter
    })
  }, [stocks, searchTerm, filterCategorie])

  const stats = useMemo(() => {
    const totalArticles = stocks.length
    const valeurTotale = stocks.reduce((acc, s) => acc + (s.quantite * s.prixUnitaire), 0)
    const enRupture = stocks.filter(s => s.quantite === 0).length
    const alerteStock = stocks.filter(s => s.quantite > 0 && s.quantite <= s.seuilAlerte).length
    
    return { totalArticles, valeurTotale, enRupture, alerteStock }
  }, [stocks])

  const getStatut = (quantite: number, seuil: number): 'En stock' | 'Faible' | 'Rupture' => {
    if (quantite === 0) return 'Rupture'
    if (quantite <= seuil) return 'Faible'
    return 'En stock'
  }

  const onSubmit = handleSubmit((data: StockFormValues) => {
    const statut = getStatut(data.quantite, data.seuilAlerte)
    
    if (editingId) {
      const next = stocks.map(s => {
        if (s.id === editingId) {
          // Si la quantité change manuellement, on logue un mouvement
          const diff = data.quantite - s.quantite
          let nouveauxMvts = s.mouvements
          if (diff !== 0) {
            nouveauxMvts = [
              ...s.mouvements,
              {
                id: crypto.randomUUID(),
                date: new Date().toISOString(),
                type: diff > 0 ? 'entree' : 'sortie',
                quantite: Math.abs(diff),
                motif: 'Ajustement manuel',
                responsable: 'Administrateur'
              }
            ]
          }
          return { ...s, ...data, statut, mouvements: nouveauxMvts, updatedAt: new Date().toISOString() }
        }
        return s
      })
      saveStocks(next)
      toast.success('Stock mis à jour')
    } else {
      const newStock: StockRecord = {
        ...data,
        id: crypto.randomUUID(),
        statut,
        mouvements: data.quantite > 0 ? [{
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          type: 'entree',
          quantite: data.quantite,
          motif: 'Stock initial',
          responsable: 'Administrateur'
        }] : [],
        createdAt: new Date().toISOString()
      }
      saveStocks([newStock, ...stocks])
      toast.success('Nouvel article ajouté au stock')
    }
    setIsFormOpen(false)
    setEditingId(null)
    reset()
  })

  const handleDelete = (id: string) => {
    if (confirm('Confirmez-vous la suppression de cet article ?')) {
      saveStocks(stocks.filter(s => s.id !== id))
      toast.success('Article supprimé')
    }
  }

  const openEditForm = (stock: StockRecord) => {
    setEditingId(stock.id)
    reset({
      nom: stock.nom,
      categorie: stock.categorie,
      quantite: stock.quantite,
      unite: stock.unite,
      seuilAlerte: stock.seuilAlerte,
      fournisseur: stock.fournisseur,
      prixUnitaire: stock.prixUnitaire
    })
    setIsFormOpen(true)
  }

  const STATUT_COLORS = {
    'En stock': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'Faible': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    'Rupture': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <SectionTitle 
          title="Gestion des Stocks" 
          subtitle="Suivez votre inventaire, gérez les alertes et les approvisionnements." 
          badge="Logistique" 
        />
        <Button onClick={() => { setIsFormOpen(!isFormOpen); setEditingId(null); reset() }} leftIcon={<Plus className="w-4 h-4" />}>
          {isFormOpen ? 'Fermer le formulaire' : 'Nouvel Article'}
        </Button>
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <Card className="mb-6 border-agri-200 shadow-sm">
              <CardHeader>
                <CardTitle>{editingId ? 'Modifier un article' : 'Ajouter au stock'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={onSubmit} className="grid md:grid-cols-3 gap-4">
                  <Input label="Nom de l'article" {...register('nom')} error={errors.nom?.message} className="md:col-span-2" />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Catégorie</label>
                    <select {...register('categorie')} className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-agri-500 focus:outline-none focus:ring-1 focus:ring-agri-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                      {CATEGORIES_STOCK.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <Input type="number" label="Quantité Actuelle" step="0.01" {...register('quantite')} error={errors.quantite?.message} />
                  <Input label="Unité (ex: kg, L, sacs)" {...register('unite')} error={errors.unite?.message} />
                  <Input type="number" label="Seuil d'Alerte" step="0.01" {...register('seuilAlerte')} error={errors.seuilAlerte?.message} />
                  <Input label="Fournisseur" {...register('fournisseur')} error={errors.fournisseur?.message} className="md:col-span-2" />
                  <Input type="number" label="Prix Unitaire (FCFA)" {...register('prixUnitaire')} error={errors.prixUnitaire?.message} />
                  
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
        <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-none">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-xs font-medium">Articles Référencés</p>
                <p className="text-3xl font-bold mt-1">{stats.totalArticles}</p>
              </div>
              <div className="p-2.5 bg-white/20 rounded-xl"><Package className="w-5 h-5 text-white" /></div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-none">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-xs font-medium">Valeur du Stock</p>
                <p className="text-2xl font-bold mt-1">{(stats.valeurTotale / 1000000).toFixed(2)}M FCFA</p>
              </div>
              <div className="p-2.5 bg-white/20 rounded-xl"><TrendingUp className="w-5 h-5 text-white" /></div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-none">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-xs font-medium">Alertes Stock Faible</p>
                <p className="text-3xl font-bold mt-1">{stats.alerteStock}</p>
              </div>
              <div className="p-2.5 bg-white/20 rounded-xl"><TrendingDown className="w-5 h-5 text-white" /></div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-500 to-rose-600 text-white border-none">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-xs font-medium">En Rupture</p>
                <p className="text-3xl font-bold mt-1">{stats.enRupture}</p>
              </div>
              <div className="p-2.5 bg-white/20 rounded-xl"><AlertTriangle className="w-5 h-5 text-white" /></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher un article..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Filter className="w-4 h-4" />
            <select
              value={filterCategorie}
              onChange={(e) => setFilterCategorie(e.target.value)}
              className="bg-transparent border-none focus:ring-0 font-medium cursor-pointer"
            >
              <option value="Toutes">Toutes les catégories</option>
              {CATEGORIES_STOCK.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <Button variant="outline" size="sm" leftIcon={<ArrowUpDown className="w-4 h-4" />}>
            Trier
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {filteredStocks.length === 0 ? (
            <div className="p-8"><EmptyState title="Aucun article trouvé" description="Ajustez vos filtres ou ajoutez un nouvel article." /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
                    <th className="py-4 px-6 font-semibold text-sm text-gray-500 dark:text-gray-400">Article</th>
                    <th className="py-4 px-6 font-semibold text-sm text-gray-500 dark:text-gray-400">Catégorie</th>
                    <th className="py-4 px-6 font-semibold text-sm text-gray-500 dark:text-gray-400">Quantité</th>
                    <th className="py-4 px-6 font-semibold text-sm text-gray-500 dark:text-gray-400">Statut</th>
                    <th className="py-4 px-6 font-semibold text-sm text-gray-500 dark:text-gray-400">Valeur</th>
                    <th className="py-4 px-6 font-semibold text-sm text-gray-500 dark:text-gray-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                  {filteredStocks.map(stock => (
                    <tr key={stock.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                      <td className="py-4 px-6">
                        <p className="font-bold text-gray-900 dark:text-white">{stock.nom}</p>
                        <p className="text-xs text-gray-500">{stock.fournisseur}</p>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                          {stock.categorie}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-semibold text-gray-900 dark:text-white">{stock.quantite} <span className="text-gray-500 text-sm font-normal">{stock.unite}</span></p>
                      </td>
                      <td className="py-4 px-6">
                        <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold", STATUT_COLORS[stock.statut])}>
                          {stock.statut}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-medium text-gray-900 dark:text-white">{(stock.quantite * stock.prixUnitaire).toLocaleString()} FCFA</p>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" onClick={() => setSelectedStock(stock)} className="h-8 w-8 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openEditForm(stock)} className="h-8 w-8 text-gray-500">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(stock.id)} className="h-8 w-8 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
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

      <StockDetailModal stock={selectedStock} isOpen={!!selectedStock} onClose={() => setSelectedStock(null)} />
    </div>
  )
}
