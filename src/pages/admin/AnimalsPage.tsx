import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Plus, Search, Filter, ArrowUpDown, Eye, Edit2, Trash2, ShieldAlert, LineChart, Banknote, Users } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle, Input, Button, SectionTitle, EmptyState } from '@/components/ui'
import { STORAGE_KEYS } from '@/constants'
import { StorageService } from '@/services'
import type { ElevageData } from '@/data/elevage-init'
import { getElevageImage, INITIAL_ELEVAGE_DATA } from '@/data/elevage-init'
import { AnimalDetailModal } from '@/components/elevage'
import { cn } from '@/utils'

const animalSchema = z.object({
  nomTroupeau: z.string().min(2, 'Obligatoire'),
  espece: z.enum(['Vaches', 'Moutons', 'Chèvres']),
  effectif: z.coerce.number().min(1, 'Obligatoire'),
  etatSante: z.enum(['Excellent', 'Bon', 'Surveillance', 'Quarantaine']),
  dateAcquisition: z.string().min(4, 'Obligatoire'),
})

type AnimalFormValues = z.infer<typeof animalSchema>

export default function AnimalsPage() {
  const [troupeaux, setTroupeaux] = useState<ElevageData[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEspece, setFilterEspece] = useState<string>('Tous')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedAnimal, setSelectedAnimal] = useState<ElevageData | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AnimalFormValues>({
    resolver: zodResolver(animalSchema) as any,
    defaultValues: { espece: 'Vaches', etatSante: 'Bon', effectif: 10 }
  })

  useEffect(() => {
    const stored = StorageService.get<ElevageData[]>(STORAGE_KEYS.ELEVAGE)
    if (!stored || stored.length === 0) {
      StorageService.set(STORAGE_KEYS.ELEVAGE, INITIAL_ELEVAGE_DATA)
      setTroupeaux(INITIAL_ELEVAGE_DATA)
    } else {
      setTroupeaux(stored)
    }
  }, [])

  const saveTroupeaux = (next: ElevageData[]) => {
    setTroupeaux(next)
    StorageService.set(STORAGE_KEYS.ELEVAGE, next)
  }

  const filteredTroupeaux = useMemo(() => {
    return troupeaux.filter(t => {
      const matchSearch = t.nomTroupeau.toLowerCase().includes(searchTerm.toLowerCase())
      const matchFilter = filterEspece === 'Tous' || t.espece === filterEspece
      return matchSearch && matchFilter
    })
  }, [troupeaux, searchTerm, filterEspece])

  const stats = useMemo(() => {
    const totalTetes = troupeaux.reduce((acc, t) => acc + t.effectif, 0)
    const enSurveillance = troupeaux.filter(t => t.etatSante === 'Surveillance' || t.etatSante === 'Quarantaine').length
    const totalRevenus = troupeaux.reduce((acc, t) => {
      const revenusTroupeau = t.economie.donneesGraphique.reduce((sum, d) => sum + d.revenus, 0)
      return acc + revenusTroupeau
    }, 0)
    return { totalTetes, enSurveillance, totalRevenus }
  }, [troupeaux])

  const chartData = useMemo(() => {
    return troupeaux.map(t => ({
      name: t.nomTroupeau,
      effectif: t.effectif,
      revenus: t.economie.donneesGraphique.reduce((acc, d) => acc + d.revenus, 0) / 1000 // en k€
    }))
  }, [troupeaux])

  const onSubmit = handleSubmit((data) => {
    if (editingId) {
      const next = troupeaux.map(t => t.id === editingId ? { ...t, ...data } : t)
      saveTroupeaux(next)
      toast.success('Troupeau mis à jour')
    } else {
      const newTroupeau: ElevageData = {
        id: crypto.randomUUID(),
        nomTroupeau: data.nomTroupeau,
        espece: data.espece,
        effectif: data.effectif,
        etatSante: data.etatSante,
        dateAcquisition: data.dateAcquisition,
        races: ['Indéfinie'],
        images: [getElevageImage(data.espece)],
        presentation: 'Nouveau troupeau ajouté manuellement.',
        description: 'En attente de complétion des données.',
        origine: 'Ferme locale',
        habitat: 'Standard',
        zootechnie: { alimentation: [], reproduction: { gestation: '-', periode: '-', tauxMiseBas: '-' } },
        sante: { vaccination: [], calendrierSanitaire: '-', maladies: [], traitements: [], conseilsVeterinaires: '-' },
        economie: { production: '0', typeProduction: 'Mixte', rentabilite: 'À évaluer', coutEntretien: '-', valorisationDejections: '-', donneesGraphique: [] },
        timeline: [],
        createdAt: new Date().toISOString()
      }
      saveTroupeaux([newTroupeau, ...troupeaux])
      toast.success('Troupeau ajouté')
    }
    setIsFormOpen(false)
    setEditingId(null)
    reset()
  })

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce troupeau ?')) {
      saveTroupeaux(troupeaux.filter(t => t.id !== id))
      toast.success('Troupeau supprimé')
    }
  }

  const openEditForm = (troupeau: ElevageData) => {
    setEditingId(troupeau.id)
    reset({
      nomTroupeau: troupeau.nomTroupeau,
      espece: troupeau.espece,
      effectif: troupeau.effectif,
      etatSante: troupeau.etatSante,
      dateAcquisition: troupeau.dateAcquisition
    })
    setIsFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <SectionTitle 
          title="Élevage" 
          subtitle="Gérez vos bovins, ovins et caprins, suivez leur santé et production." 
          badge="Animaux" 
        />
        <Button onClick={() => { setIsFormOpen(!isFormOpen); setEditingId(null); reset() }} leftIcon={<Plus className="w-4 h-4" />}>
          {isFormOpen ? 'Fermer le formulaire' : 'Nouveau Troupeau'}
        </Button>
      </div>

      {/* Formulaire CRUD */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <Card className="mb-6 border-agri-200 shadow-sm">
              <CardHeader>
                <CardTitle>{editingId ? 'Modifier le troupeau' : 'Ajouter un troupeau'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={onSubmit} className="grid md:grid-cols-3 gap-4">
                  <Input label="Nom du Troupeau" {...register('nomTroupeau')} error={errors.nomTroupeau?.message} />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Espèce</label>
                    <select {...register('espece')} className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-agri-500 focus:outline-none focus:ring-1 focus:ring-agri-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                      <option value="Vaches">Vaches</option>
                      <option value="Moutons">Moutons</option>
                      <option value="Chèvres">Chèvres</option>
                    </select>
                  </div>
                  <Input type="number" label="Effectif (têtes)" {...register('effectif')} error={errors.effectif?.message} />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">État de santé</label>
                    <select {...register('etatSante')} className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-agri-500 focus:outline-none focus:ring-1 focus:ring-agri-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                      <option value="Excellent">Excellent</option>
                      <option value="Bon">Bon</option>
                      <option value="Surveillance">Surveillance</option>
                      <option value="Quarantaine">Quarantaine</option>
                    </select>
                  </div>
                  <Input type="date" label="Date d'acquisition" {...register('dateAcquisition')} error={errors.dateAcquisition?.message} />
                  
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
                <p className="text-3xl font-bold mt-2">{stats.totalTetes} têtes</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"><Users className="w-6 h-6 text-white" /></div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm font-medium">Revenus Globaux</p>
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
                <p className="text-red-100 text-sm font-medium">Troupeaux en surveillance</p>
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
          <CardTitle className="flex items-center gap-2"><LineChart className="w-5 h-5 text-agri-500"/> Comparatif Effectif & Revenus</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" orientation="left" stroke="#8b5cf6" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <RechartsTooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend />
                <Bar yAxisId="left" dataKey="effectif" name="Effectif (Têtes)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
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
            placeholder="Rechercher un troupeau..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-agri-500"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Filter className="w-4 h-4" />
            <select
              value={filterEspece}
              onChange={(e) => setFilterEspece(e.target.value)}
              className="bg-transparent border-none focus:ring-0 font-medium cursor-pointer"
            >
              <option value="Tous">Toutes espèces</option>
              <option value="Vaches">Vaches</option>
              <option value="Moutons">Moutons</option>
              <option value="Chèvres">Chèvres</option>
            </select>
          </div>
          <Button variant="outline" size="sm" leftIcon={<ArrowUpDown className="w-4 h-4" />}>
            Trier
          </Button>
        </div>
      </div>

      {/* Grille des Troupeaux */}
      {filteredTroupeaux.length === 0 ? (
        <Card><CardContent className="p-8"><EmptyState title="Aucun troupeau trouvé" description="Modifiez vos filtres ou ajoutez un nouveau troupeau." /></CardContent></Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTroupeaux.map(troupeau => (
            <motion.div
              key={troupeau.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="relative h-48 overflow-hidden">
                <img src={getElevageImage(troupeau.espece, troupeau.images[0])} alt={`Troupeau de ${troupeau.espece} : ${troupeau.nomTroupeau}`} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  <span className={cn(
                    "px-2.5 py-1 text-xs font-semibold rounded-lg backdrop-blur-md text-white shadow-sm",
                    "bg-agri-600/80"
                  )}>
                    {troupeau.espece}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className={cn(
                    "px-2.5 py-1 text-xs font-bold rounded-lg shadow-sm border",
                    troupeau.etatSante === 'Excellent' ? "bg-green-100 text-green-700 border-green-200" :
                    troupeau.etatSante === 'Bon' ? "bg-blue-100 text-blue-700 border-blue-200" :
                    "bg-orange-100 text-orange-700 border-orange-200"
                  )}>
                    {troupeau.etatSante}
                  </span>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{troupeau.nomTroupeau}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{troupeau.effectif} têtes acquises le {new Date(troupeau.dateAcquisition).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-4 text-sm mb-6">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">Production</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{troupeau.economie?.production || '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">Type</p>
                    <p className="font-semibold text-agri-600 dark:text-agri-400">{troupeau.economie?.typeProduction || '-'}</p>
                  </div>
                </div>

                <div className="mt-auto flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setSelectedAnimal(troupeau)} leftIcon={<Eye className="w-4 h-4" />}>
                    Détails
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openEditForm(troupeau)} className="shrink-0 text-gray-500">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(troupeau.id)} className="shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimalDetailModal animal={selectedAnimal} isOpen={!!selectedAnimal} onClose={() => setSelectedAnimal(null)} />
    </div>
  )
}
