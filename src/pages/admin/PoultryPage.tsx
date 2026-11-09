import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Plus, Search, Filter, ArrowUpDown, Eye, Edit2, Trash2, ShieldAlert, LineChart, Banknote, Egg } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle, Input, Button, SectionTitle, EmptyState } from '@/components/ui'
import { STORAGE_KEYS } from '@/constants'
import { StorageService } from '@/services'
import { getAvicultureImage, INITIAL_AVICULTURE_DATA } from '@/data/aviculture-init'
import type { AvicultureData } from '@/data/aviculture-init'
import { PoultryDetailModal } from '@/components/aviculture'
import { cn } from '@/utils'

const poultrySchema = z.object({
  nomLot: z.string().min(2, 'Obligatoire'),
  typeOiseau: z.enum(['Poulet de chair', 'Poule pondeuse', 'Canard', 'Caille']),
  effectif: z.coerce.number().min(1, 'Obligatoire'),
  etatSante: z.enum(['Excellent', 'Bon', 'Surveillance', 'Quarantaine']),
  dateArrivee: z.string().min(4, 'Obligatoire'),
})

type PoultryFormValues = z.infer<typeof poultrySchema>

export default function PoultryPage() {
  const [lots, setLots] = useState<AvicultureData[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterOiseau, setFilterOiseau] = useState<string>('Tous')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedPoultry, setSelectedPoultry] = useState<AvicultureData | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PoultryFormValues>({
    resolver: zodResolver(poultrySchema) as any,
    defaultValues: { typeOiseau: 'Poulet de chair', etatSante: 'Bon', effectif: 500 }
  })

  useEffect(() => {
    const stored = StorageService.get<AvicultureData[]>(STORAGE_KEYS.AVICULTURE)
    if (!stored || stored.length === 0) {
      StorageService.set(STORAGE_KEYS.AVICULTURE, INITIAL_AVICULTURE_DATA)
      setLots(INITIAL_AVICULTURE_DATA)
    } else {
      setLots(stored)
    }
  }, [])

  const saveLots = (next: AvicultureData[]) => {
    setLots(next)
    StorageService.set(STORAGE_KEYS.AVICULTURE, next)
  }

  const filteredLots = useMemo(() => {
    return lots.filter(l => {
      const matchSearch = l.nomLot.toLowerCase().includes(searchTerm.toLowerCase())
      const matchFilter = filterOiseau === 'Tous' || l.typeOiseau === filterOiseau
      return matchSearch && matchFilter
    })
  }, [lots, searchTerm, filterOiseau])

  const stats = useMemo(() => {
    const totalSujets = lots.reduce((acc, l) => acc + l.effectif, 0)
    const enSurveillance = lots.filter(l => l.etatSante === 'Surveillance' || l.etatSante === 'Quarantaine').length
    const totalRevenus = lots.reduce((acc, l) => {
      const revenusLot = l.production.donneesGraphique.reduce((sum, d) => sum + d.revenus, 0)
      return acc + revenusLot
    }, 0)
    return { totalSujets, enSurveillance, totalRevenus }
  }, [lots])

  const chartData = useMemo(() => {
    return lots.map(l => ({
      name: l.nomLot,
      effectif: l.effectif,
      revenus: l.production.donneesGraphique.reduce((acc, d) => acc + d.revenus, 0) / 1000 // en k€
    }))
  }, [lots])

  const onSubmit = handleSubmit((data) => {
    if (editingId) {
      const next = lots.map(l => l.id === editingId ? { ...l, ...data } : l)
      saveLots(next)
      toast.success('Lot avicole mis à jour')
    } else {
      const newLot: AvicultureData = {
        id: crypto.randomUUID(),
        nomLot: data.nomLot,
        typeOiseau: data.typeOiseau,
        effectif: data.effectif,
        etatSante: data.etatSante,
        dateArrivee: data.dateArrivee,
        race: 'Indéfinie',
        images: [getAvicultureImage(data.typeOiseau)],
        presentation: 'Nouveau lot ajouté manuellement.',
        description: 'En attente de complétion des données par le technicien.',
        habitat: 'Standard',
        temperatureIdeale: 'À définir',
        cycle: { dureeElevage: '-', alimentation: [] },
        sante: { vaccination: [], maladies: [], traitements: [], conseilsTechniques: '-' },
        production: { type: 'Mixte', rendement: '-', rentabilite: 'À évaluer', dechetsValorisables: '-', donneesGraphique: [] },
        timeline: [],
        createdAt: new Date().toISOString()
      }
      saveLots([newLot, ...lots])
      toast.success('Lot avicole ajouté')
    }
    setIsFormOpen(false)
    setEditingId(null)
    reset()
  })

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce lot ?')) {
      saveLots(lots.filter(l => l.id !== id))
      toast.success('Lot supprimé')
    }
  }

  const openEditForm = (lot: AvicultureData) => {
    setEditingId(lot.id)
    reset({
      nomLot: lot.nomLot,
      typeOiseau: lot.typeOiseau,
      effectif: lot.effectif,
      etatSante: lot.etatSante,
      dateArrivee: lot.dateArrivee
    })
    setIsFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <SectionTitle 
          title="Aviculture" 
          subtitle="Gérez vos lots de volailles, optimisez la ponte et l'engraissement." 
          badge="Oiseaux" 
        />
        <Button onClick={() => { setIsFormOpen(!isFormOpen); setEditingId(null); reset() }} leftIcon={<Plus className="w-4 h-4" />}>
          {isFormOpen ? 'Fermer le formulaire' : 'Nouveau Lot'}
        </Button>
      </div>

      {/* Formulaire CRUD */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <Card className="mb-6 border-agri-200 shadow-sm">
              <CardHeader>
                <CardTitle>{editingId ? 'Modifier le lot' : 'Ajouter un lot'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={onSubmit} className="grid md:grid-cols-3 gap-4">
                  <Input label="Nom du Lot" {...register('nomLot')} error={errors.nomLot?.message} />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type d'oiseau</label>
                    <select {...register('typeOiseau')} className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-agri-500 focus:outline-none focus:ring-1 focus:ring-agri-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                      <option value="Poulet de chair">Poulet de chair</option>
                      <option value="Poule pondeuse">Poule pondeuse</option>
                      <option value="Canard">Canard</option>
                      <option value="Caille">Caille</option>
                    </select>
                  </div>
                  <Input type="number" label="Effectif (sujets)" {...register('effectif')} error={errors.effectif?.message} />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">État de santé</label>
                    <select {...register('etatSante')} className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-agri-500 focus:outline-none focus:ring-1 focus:ring-agri-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                      <option value="Excellent">Excellent</option>
                      <option value="Bon">Bon</option>
                      <option value="Surveillance">Surveillance</option>
                      <option value="Quarantaine">Quarantaine</option>
                    </select>
                  </div>
                  <Input type="date" label="Date d'arrivée" {...register('dateArrivee')} error={errors.dateArrivee?.message} />
                  
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

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-agri-500 to-agri-600 text-white border-none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-agri-100 text-sm font-medium">Effectif Total</p>
                <p className="text-3xl font-bold mt-2">{stats.totalSujets} volailles</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"><Egg className="w-6 h-6 text-white" /></div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm font-medium">Revenus Estimés</p>
                <p className="text-3xl font-bold mt-2">{stats.totalRevenus.toLocaleString('fr-FR')} €</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"><Banknote className="w-6 h-6 text-white" /></div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Lots en surveillance</p>
                <p className="text-3xl font-bold mt-2">{stats.enSurveillance}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"><ShieldAlert className="w-6 h-6 text-white" /></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><LineChart className="w-5 h-5 text-agri-500"/> Comparatif Effectifs & Revenus Avicoles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" orientation="left" stroke="#f59e0b" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <RechartsTooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend />
                <Bar yAxisId="left" dataKey="effectif" name="Effectif (Sujets)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="revenus" name="Revenus (k€)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Outils de Liste */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher un lot..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-agri-500"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Filter className="w-4 h-4" />
            <select
              value={filterOiseau}
              onChange={(e) => setFilterOiseau(e.target.value)}
              className="bg-transparent border-none focus:ring-0 font-medium cursor-pointer"
            >
              <option value="Tous">Toutes volailles</option>
              <option value="Poulet de chair">Poulet de chair</option>
              <option value="Poule pondeuse">Poule pondeuse</option>
              <option value="Canard">Canard</option>
              <option value="Caille">Caille</option>
            </select>
          </div>
          <Button variant="outline" size="sm" leftIcon={<ArrowUpDown className="w-4 h-4" />}>
            Trier
          </Button>
        </div>
      </div>

      {/* Grille des Lots */}
      {filteredLots.length === 0 ? (
        <Card><CardContent className="p-8"><EmptyState title="Aucun lot trouvé" description="Modifiez vos filtres ou ajoutez un nouveau lot." /></CardContent></Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLots.map(lot => (
            <motion.div
              key={lot.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="relative h-48 overflow-hidden">
                <img src={getAvicultureImage(lot.typeOiseau, lot.images[0])} alt={`${lot.typeOiseau} : ${lot.nomLot}`} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  <span className={cn(
                    "px-2.5 py-1 text-xs font-semibold rounded-lg backdrop-blur-md text-white shadow-sm",
                    "bg-agri-600/80"
                  )}>
                    {lot.typeOiseau}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className={cn(
                    "px-2.5 py-1 text-xs font-bold rounded-lg shadow-sm border",
                    lot.etatSante === 'Excellent' ? "bg-green-100 text-green-700 border-green-200" :
                    lot.etatSante === 'Bon' ? "bg-blue-100 text-blue-700 border-blue-200" :
                    "bg-orange-100 text-orange-700 border-orange-200"
                  )}>
                    {lot.etatSante}
                  </span>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{lot.nomLot}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{lot.effectif} sujets arrivés le {new Date(lot.dateArrivee).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-4 text-sm mb-6">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">Rendement</p>
                    <p className="font-semibold text-gray-900 dark:text-white truncate">{lot.production?.rendement || '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">Cycle</p>
                    <p className="font-semibold text-agri-600 dark:text-agri-400">{lot.cycle?.dureeElevage || '-'}</p>
                  </div>
                </div>

                <div className="mt-auto flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setSelectedPoultry(lot)} leftIcon={<Eye className="w-4 h-4" />}>
                    Détails
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openEditForm(lot)} className="shrink-0 text-gray-500">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(lot.id)} className="shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <PoultryDetailModal poultry={selectedPoultry} isOpen={!!selectedPoultry} onClose={() => setSelectedPoultry(null)} />
    </div>
  )
}
