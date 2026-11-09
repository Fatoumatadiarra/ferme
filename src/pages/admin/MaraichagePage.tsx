import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Plus, Search, Filter, ArrowUpDown, Eye, Edit2, Trash2, Sprout, Tractor, LineChart, Leaf } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle, Input, Button, SectionTitle, EmptyState } from '@/components/ui'
import { STORAGE_KEYS } from '@/constants'
import { StorageService } from '@/services'
import { getMaraichageImage, INITIAL_MARAICHAGE_DATA } from '@/data/maraichage-init'
import type { CropData } from '@/data/maraichage-init'
import { CropDetailModal } from '@/components/maraichage'
import { cn } from '@/utils'

const cropSchema = z.object({
  nom: z.string().min(2, 'Obligatoire'),
  type: z.enum(['Légume', 'Fruit']),
  surface: z.string().min(1, 'Obligatoire'),
  etat: z.enum(['En croissance', 'Récolte imminente', 'Plantation', 'Récolté']),
  datePlantation: z.string().min(4, 'Obligatoire'),
  recolteEstimee: z.string().min(1, 'Obligatoire'),
})
type CropFormValues = z.infer<typeof cropSchema>

export default function MaraichagePage() {
  const [crops, setCrops] = useState<CropData[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('Tous')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedCrop, setSelectedCrop] = useState<CropData | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CropFormValues>({
    resolver: zodResolver(cropSchema),
    defaultValues: { type: 'Légume', etat: 'En croissance' }
  })

  useEffect(() => {
    const stored = StorageService.get<CropData[]>(STORAGE_KEYS.CULTURES)
    if (!stored || stored.length === 0) {
      StorageService.set(STORAGE_KEYS.CULTURES, INITIAL_MARAICHAGE_DATA)
      setCrops(INITIAL_MARAICHAGE_DATA)
    } else {
      setCrops(stored)
    }
  }, [])

  const saveCrops = (next: CropData[]) => {
    setCrops(next)
    StorageService.set(STORAGE_KEYS.CULTURES, next)
  }

  const filteredCrops = useMemo(() => {
    return crops.filter(c => {
      const matchSearch = c.nom.toLowerCase().includes(searchTerm.toLowerCase())
      const matchFilter = filterType === 'Tous' || c.type === filterType
      return matchSearch && matchFilter
    })
  }, [crops, searchTerm, filterType])

  const stats = useMemo(() => {
    const totalSurface = crops.reduce((acc, c) => acc + parseFloat(c.surface.replace(',', '.')), 0)
    const enCroissance = crops.filter(c => c.etat === 'En croissance').length
    const recolteImminente = crops.filter(c => c.etat === 'Récolte imminente').length
    return { totalSurface, enCroissance, recolteImminente }
  }, [crops])

  const chartData = useMemo(() => {
    return crops.map(c => ({
      name: c.nom,
      rendement: parseInt(c.statistiques.rendementAttendu) || 0,
      revenus: c.statistiques.donneesGraphique.reduce((acc, d) => acc + d.revenus, 0) / 1000 // en k€
    }))
  }, [crops])

  const onSubmit = handleSubmit((data) => {
    if (editingId) {
      const next = crops.map(c => c.id === editingId ? { ...c, ...data } : c)
      saveCrops(next)
      toast.success('Culture mise à jour')
    } else {
      const newCrop: CropData = {
        id: crypto.randomUUID(),
        ...data,
        images: [getMaraichageImage(data.nom, 'https://images.unsplash.com/photo-1592842211516-1f6a157c9135?auto=format&fit=crop&w=800&q=80')],
        presentation: 'Nouvelle culture ajoutée.',
        origine: 'Inconnue',
        varietes: [],
        importanceEconomique: '-',
        climat: { sol: '-', temperature: '-', humidite: '-', besoinsEau: '-' },
        timeline: [],
        pratiques: { engrais: [], irrigation: '-', maladies: [], ravageurs: [], traitements: [], conseils: '-' },
        statistiques: { rendementAttendu: '0', dureeProduction: '0', rentabilite: '-', donneesGraphique: [] },
        valorisationDechets: '-',
        createdAt: new Date().toISOString()
      }
      saveCrops([newCrop, ...crops])
      toast.success('Culture ajoutée')
    }
    setIsFormOpen(false)
    setEditingId(null)
    reset()
  })

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette culture ?')) {
      saveCrops(crops.filter(c => c.id !== id))
      toast.success('Culture supprimée')
    }
  }

  const openEditForm = (crop: CropData) => {
    setEditingId(crop.id)
    reset({
      nom: crop.nom,
      type: crop.type,
      surface: crop.surface,
      etat: crop.etat,
      datePlantation: crop.datePlantation,
      recolteEstimee: crop.recolteEstimee
    })
    setIsFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <SectionTitle 
          title="Maraîchage & Arboriculture" 
          subtitle="Gérez vos cultures, suivez les rendements et analysez la rentabilité." 
          badge="Production" 
        />
        <Button onClick={() => { setIsFormOpen(!isFormOpen); setEditingId(null); reset() }} leftIcon={<Plus className="w-4 h-4" />}>
          {isFormOpen ? 'Fermer le formulaire' : 'Nouvelle Culture'}
        </Button>
      </div>

      {/* Formulaire CRUD */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <Card className="mb-6 border-agri-200 shadow-sm">
              <CardHeader>
                <CardTitle>{editingId ? 'Modifier la culture' : 'Ajouter une culture'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={onSubmit} className="grid md:grid-cols-3 gap-4">
                  <Input label="Nom" {...register('nom')} error={errors.nom?.message} />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                    <select {...register('type')} className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-agri-500 focus:outline-none focus:ring-1 focus:ring-agri-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                      <option value="Légume">Légume</option>
                      <option value="Fruit">Fruit</option>
                    </select>
                  </div>
                  <Input label="Surface (ha)" {...register('surface')} error={errors.surface?.message} />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">État</label>
                    <select {...register('etat')} className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-agri-500 focus:outline-none focus:ring-1 focus:ring-agri-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                      <option value="En croissance">En croissance</option>
                      <option value="Récolte imminente">Récolte imminente</option>
                      <option value="Plantation">Plantation</option>
                      <option value="Récolté">Récolté</option>
                    </select>
                  </div>
                  <Input type="date" label="Date de plantation" {...register('datePlantation')} error={errors.datePlantation?.message} />
                  <Input type="date" label="Date estimée (Récolte)" {...register('recolteEstimee')} error={errors.recolteEstimee?.message} />
                  
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
                <p className="text-agri-100 text-sm font-medium">Surface Totale Cultivée</p>
                <p className="text-3xl font-bold mt-2">{stats.totalSurface.toFixed(1)} ha</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"><Leaf className="w-6 h-6 text-white" /></div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm font-medium">Cultures en croissance</p>
                <p className="text-3xl font-bold mt-2">{stats.enCroissance}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"><Sprout className="w-6 h-6 text-white" /></div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Récolte Imminente</p>
                <p className="text-3xl font-bold mt-2">{stats.recolteImminente}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"><Tractor className="w-6 h-6 text-white" /></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><LineChart className="w-5 h-5 text-agri-500"/> Comparatif Rendements & Revenus</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" orientation="left" stroke="#22c55e" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <RechartsTooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend />
                <Bar yAxisId="left" dataKey="rendement" name="Rendement (Tonnes)" fill="#22c55e" radius={[4, 4, 0, 0]} />
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
            placeholder="Rechercher une culture..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-agri-500"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Filter className="w-4 h-4" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-transparent border-none focus:ring-0 font-medium cursor-pointer"
            >
              <option value="Tous">Tous les types</option>
              <option value="Légume">Légumes</option>
              <option value="Fruit">Fruits</option>
            </select>
          </div>
          <Button variant="outline" size="sm" leftIcon={<ArrowUpDown className="w-4 h-4" />}>
            Trier
          </Button>
        </div>
      </div>

      {/* Grille des Cultures */}
      {filteredCrops.length === 0 ? (
        <Card><CardContent className="p-8"><EmptyState title="Aucune culture trouvée" description="Modifiez vos filtres ou ajoutez une nouvelle culture." /></CardContent></Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCrops.map(crop => (
            <motion.div
              key={crop.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="relative h-48 overflow-hidden">
                <img src={getMaraichageImage(crop.nom, crop.images[0])} alt={`Culture de ${crop.nom}`} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  <span className={cn(
                    "px-2.5 py-1 text-xs font-semibold rounded-lg backdrop-blur-md text-white shadow-sm",
                    crop.type === 'Fruit' ? "bg-orange-500/80" : "bg-agri-500/80"
                  )}>
                    {crop.type}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className={cn(
                    "px-2.5 py-1 text-xs font-bold rounded-lg shadow-sm border",
                    crop.etat === 'Récolte imminente' ? "bg-blue-100 text-blue-700 border-blue-200" :
                    crop.etat === 'En croissance' ? "bg-amber-100 text-amber-700 border-amber-200" :
                    "bg-gray-100 text-gray-700 border-gray-200"
                  )}>
                    {crop.etat}
                  </span>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{crop.nom}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{crop.surface} plantés le {new Date(crop.datePlantation).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-4 text-sm mb-6">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">Rendement estimé</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{crop.statistiques?.rendementAttendu || '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">Récolte prévue</p>
                    <p className="font-semibold text-agri-600 dark:text-agri-400">{new Date(crop.recolteEstimee).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="mt-auto flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setSelectedCrop(crop)} leftIcon={<Eye className="w-4 h-4" />}>
                    Détails
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openEditForm(crop)} className="shrink-0 text-gray-500">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(crop.id)} className="shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <CropDetailModal crop={selectedCrop} isOpen={!!selectedCrop} onClose={() => setSelectedCrop(null)} />
    </div>
  )
}
