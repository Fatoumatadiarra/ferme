import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Plus, Search, Filter, Eye, Edit2, Trash2, ArrowDownRight, Wallet, CreditCard } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle, Input, Button, SectionTitle, EmptyState } from '@/components/ui'
import { STORAGE_KEYS } from '@/constants'
import { StorageService } from '@/services'
import type { ExpenseRecord, CategorieDepense } from '@/data/expenses-init'
import { INITIAL_EXPENSES_DATA, CATEGORIES_DEPENSE } from '@/data/expenses-init'
import { ExpenseDetailModal } from '@/components/expenses'
import { cn, formatCurrency, formatDate } from '@/utils'

const expenseSchema = z.object({
  libelle: z.string().min(2, 'Le libellé est obligatoire'),
  categorie: z.enum(CATEGORIES_DEPENSE as [CategorieDepense, ...CategorieDepense[]]),
  montant: z.coerce.number().min(1, 'Montant invalide'),
  dateDepense: z.string().min(1, 'Date obligatoire'),
  statut: z.enum(['Payée', 'Planifiée', 'Annulée']),
  fournisseur: z.string().optional(),
  notes: z.string().optional()
})

type ExpenseFormValues = z.infer<typeof expenseSchema>

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategorie, setFilterCategorie] = useState<string>('Toutes')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedExpense, setSelectedExpense] = useState<ExpenseRecord | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema) as any,
    defaultValues: { dateDepense: new Date().toISOString().split('T')[0], statut: 'Payée', categorie: 'Autre', montant: 0 }
  })

  useEffect(() => {
    const stored = StorageService.get<ExpenseRecord[]>(STORAGE_KEYS.DEPENSES)
    if (!stored || stored.length === 0) {
      StorageService.set(STORAGE_KEYS.DEPENSES, INITIAL_EXPENSES_DATA)
      setExpenses(INITIAL_EXPENSES_DATA)
    } else {
      setExpenses(stored)
    }
  }, [])

  const saveExpenses = (next: ExpenseRecord[]) => {
    setExpenses(next)
    StorageService.set(STORAGE_KEYS.DEPENSES, next)
  }

  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => {
      const matchSearch = e.libelle.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (e.fournisseur && e.fournisseur.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchFilter = filterCategorie === 'Toutes' || e.categorie === filterCategorie
      return matchSearch && matchFilter
    }).sort((a, b) => new Date(b.dateDepense).getTime() - new Date(a.dateDepense).getTime())
  }, [expenses, searchTerm, filterCategorie])

  const stats = useMemo(() => {
    const totalDepenses = expenses.filter(e => e.statut === 'Payée').reduce((acc, e) => acc + e.montant, 0)
    const planifiees = expenses.filter(e => e.statut === 'Planifiée').reduce((acc, e) => acc + e.montant, 0)
    
    // Répartition par catégorie
    const depensesParCategorie = expenses
      .filter(e => e.statut === 'Payée')
      .reduce((acc: any, e) => {
        acc[e.categorie] = (acc[e.categorie] || 0) + e.montant
        return acc
      }, {})

    const pieData = Object.keys(depensesParCategorie).map(cat => ({
      name: cat,
      value: depensesParCategorie[cat]
    })).sort((a, b) => b.value - a.value)

    return { totalDepenses, planifiees, pieData }
  }, [expenses])

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#06b6d4', '#8b5cf6', '#64748b']

  const onSubmit = handleSubmit((data: ExpenseFormValues) => {
    if (editingId) {
      const next = expenses.map(e => e.id === editingId ? { ...e, ...data } : e)
      saveExpenses(next)
      toast.success('Dépense mise à jour')
    } else {
      const newExpense: ExpenseRecord = {
        ...data,
        id: `exp-${Date.now()}`,
        createdAt: new Date().toISOString()
      }
      saveExpenses([newExpense, ...expenses])
      toast.success('Dépense enregistrée')
    }
    setIsFormOpen(false)
    setEditingId(null)
    reset()
  })

  const handleDelete = (id: string) => {
    if (confirm('Confirmez-vous la suppression de cette dépense ?')) {
      saveExpenses(expenses.filter(e => e.id !== id))
      toast.success('Dépense supprimée')
    }
  }

  const openEditForm = (exp: ExpenseRecord) => {
    setEditingId(exp.id)
    reset({
      libelle: exp.libelle,
      categorie: exp.categorie,
      montant: exp.montant,
      dateDepense: exp.dateDepense,
      statut: exp.statut,
      fournisseur: exp.fournisseur,
      notes: exp.notes
    })
    setIsFormOpen(true)
  }

  const STATUT_COLORS = {
    'Payée': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'Planifiée': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'Annulée': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <SectionTitle 
          title="Gestion des Dépenses" 
          subtitle="Suivez vos décaissements et analysez vos charges." 
          badge="Comptabilité" 
        />
        <Button onClick={() => { setIsFormOpen(!isFormOpen); setEditingId(null); reset() }} leftIcon={<Plus className="w-4 h-4" />}>
          {isFormOpen ? 'Fermer le formulaire' : 'Nouvelle Dépense'}
        </Button>
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <Card className="mb-6 border-agri-200 shadow-sm">
              <CardHeader>
                <CardTitle>{editingId ? 'Modifier la dépense' : 'Enregistrer une dépense'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={onSubmit} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Input label="Libellé de la dépense" {...register('libelle')} error={errors.libelle?.message} className="lg:col-span-2" />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Catégorie</label>
                    <select {...register('categorie')} className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-agri-500 focus:outline-none focus:ring-1 focus:ring-agri-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                      {CATEGORIES_DEPENSE.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  
                  <Input type="number" label="Montant (FCFA)" {...register('montant')} error={errors.montant?.message} />
                  <Input type="date" label="Date" {...register('dateDepense')} error={errors.dateDepense?.message} />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Statut</label>
                    <select {...register('statut')} className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-agri-500 focus:outline-none focus:ring-1 focus:ring-agri-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                      <option value="Payée">Payée</option>
                      <option value="Planifiée">Planifiée</option>
                      <option value="Annulée">Annulée</option>
                    </select>
                  </div>

                  <Input label="Bénéficiaire / Fournisseur (Optionnel)" {...register('fournisseur')} className="lg:col-span-2" />
                  <Input label="Notes (Optionnel)" {...register('notes')} />
                  
                  <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-2 mt-2">
                    <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>Annuler</Button>
                    <Button type="submit">Enregistrer</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="space-y-4">
          <Card className="bg-gradient-to-br from-red-500 to-rose-600 text-white border-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">Dépenses Réalisées (Payées)</p>
                  <p className="text-3xl font-bold mt-2">{(stats.totalDepenses / 1000000).toFixed(2)}M FCFA</p>
                </div>
                <div className="p-3 bg-white/20 rounded-2xl"><ArrowDownRight className="w-6 h-6 text-white" /></div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-500 to-sky-600 text-white border-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Charges Planifiées</p>
                  <p className="text-2xl font-bold mt-2">{formatCurrency(stats.planifiees)}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-2xl"><Wallet className="w-6 h-6 text-white" /></div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Répartition des charges (Payées)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
              {stats.pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={stats.pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value" label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                      {stats.pieData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <RechartsTooltip 
                      formatter={(value: any) => [formatCurrency(Number(value) || 0), 'Montant']}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">Aucune donnée de dépense</div>
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
            placeholder="Rechercher une dépense..."
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
              {CATEGORIES_DEPENSE.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {filteredExpenses.length === 0 ? (
            <div className="p-8"><EmptyState title="Aucune dépense trouvée" description="Enregistrez votre première dépense." /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
                    <th className="py-4 px-6 font-semibold text-sm text-gray-500 dark:text-gray-400">Libellé</th>
                    <th className="py-4 px-6 font-semibold text-sm text-gray-500 dark:text-gray-400">Date</th>
                    <th className="py-4 px-6 font-semibold text-sm text-gray-500 dark:text-gray-400">Catégorie</th>
                    <th className="py-4 px-6 font-semibold text-sm text-gray-500 dark:text-gray-400">Montant</th>
                    <th className="py-4 px-6 font-semibold text-sm text-gray-500 dark:text-gray-400">Statut</th>
                    <th className="py-4 px-6 font-semibold text-sm text-gray-500 dark:text-gray-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                  {filteredExpenses.map(expense => (
                    <tr key={expense.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                      <td className="py-4 px-6">
                        <p className="font-bold text-gray-900 dark:text-white">{expense.libelle}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><CreditCard className="w-3 h-3" /> {expense.fournisseur || 'Non spécifié'}</p>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500">
                        {formatDate(expense.dateDepense)}
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                          {expense.categorie}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-bold text-gray-900 dark:text-white">
                        {formatCurrency(expense.montant)}
                      </td>
                      <td className="py-4 px-6">
                        <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold", STATUT_COLORS[expense.statut])}>
                          {expense.statut}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" onClick={() => setSelectedExpense(expense)} className="h-8 w-8 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openEditForm(expense)} className="h-8 w-8 text-gray-500">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(expense.id)} className="h-8 w-8 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
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

      <ExpenseDetailModal expense={selectedExpense} isOpen={!!selectedExpense} onClose={() => setSelectedExpense(null)} />
    </div>
  )
}
