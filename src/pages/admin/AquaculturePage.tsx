import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  Edit2,
  Trash2,
  ShieldAlert,
  Banknote,
  Waves,
  Fish,
  Droplets,
  FlaskConical,
  Thermometer,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

import { Card, CardContent, CardHeader, CardTitle, Input, Button, SectionTitle, EmptyState } from '@/components/ui'
import { STORAGE_KEYS } from '@/constants'
import { StorageService } from '@/services'
import type { AquacultureData, BassinData } from '@/data/aquaculture-init'
import { getAquacultureImage, INITIAL_AQUACULTURE_DATA, INITIAL_BASSINS_DATA } from '@/data/aquaculture-init'
import { FishDetailModal } from '@/components/aquaculture'
import { cn } from '@/utils'

// ─────────────────────────────────────────────────────────
// Zod schemas
// ─────────────────────────────────────────────────────────
const bassinSchema = z.object({
  nomBassin: z.string().min(2, 'Obligatoire'),
  typePoissonEspeceId: z.enum(['espece-tilapia', 'espece-clarias']),
  surfaceM2: z.coerce.number().min(1, 'Obligatoire'),
  capaciteMax: z.coerce.number().min(1, 'Obligatoire'),
  etatSante: z.enum(['Excellent', 'Bon', 'Surveillance', 'Quarantaine']),
  dateMiseEnEau: z.string().min(4, 'Obligatoire'),
  notes: z.string().optional(),
})
type BassinFormValues = z.infer<typeof bassinSchema>

// ─────────────────────────────────────────────────────────
// Storage keys for Aquaculture data & bassins
// ─────────────────────────────────────────────────────────
const STORAGE_KEY_BASSINS = 'ferme_aquaculture_bassins'

export default function AquaculturePage() {
  // ─── State ───
  const [especes, setEspeces] = useState<AquacultureData[]>([])
  const [bassins, setBassins] = useState<BassinData[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEspece, setFilterEspece] = useState<string>('Tous')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedFish, setSelectedFish] = useState<AquacultureData | null>(null)
  const [activeView, setActiveView] = useState<'especes' | 'bassins'>('especes')

  // ─── Form ───
  const { register, handleSubmit, reset, formState: { errors } } = useForm<BassinFormValues>({
    resolver: zodResolver(bassinSchema) as any,
    defaultValues: { typePoissonEspeceId: 'espece-tilapia', etatSante: 'Bon', surfaceM2: 50, capaciteMax: 500 },
  })

  // ─── Init from LocalStorage ───
  useEffect(() => {
    const storedEspeces = StorageService.get<AquacultureData[]>(STORAGE_KEYS.AQUACULTURE)
    if (!storedEspeces || storedEspeces.length === 0) {
      StorageService.set(STORAGE_KEYS.AQUACULTURE, INITIAL_AQUACULTURE_DATA)
      setEspeces(INITIAL_AQUACULTURE_DATA)
    } else {
      setEspeces(storedEspeces)
    }

    const storedBassins = StorageService.get<BassinData[]>(STORAGE_KEY_BASSINS)
    if (!storedBassins || storedBassins.length === 0) {
      StorageService.set(STORAGE_KEY_BASSINS, INITIAL_BASSINS_DATA)
      setBassins(INITIAL_BASSINS_DATA)
    } else {
      setBassins(storedBassins)
    }
  }, [])

  const saveBassins = (next: BassinData[]) => {
    setBassins(next)
    StorageService.set(STORAGE_KEY_BASSINS, next)
  }

  // ─── Filtered list ───
  const filteredEspeces = useMemo(() =>
    especes.filter(e =>
      e.nomEspece.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterEspece === 'Tous' || e.nomEspece === filterEspece)
    ), [especes, searchTerm, filterEspece])

  const filteredBassins = useMemo(() =>
    bassins.filter(b =>
      b.nomBassin.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterEspece === 'Tous' ||
        especes.find(e => e.id === b.typePoissonEspeceId)?.nomEspece === filterEspece)
    ), [bassins, especes, searchTerm, filterEspece])

  // ─── Dashboard stats ───
  const stats = useMemo(() => {
    const totalBassins = bassins.length
    const totalCapacite = bassins.reduce((acc, b) => acc + b.capaciteMax, 0)
    const enAlerte = bassins.filter(b => b.etatSante === 'Surveillance' || b.etatSante === 'Quarantaine').length
    const totalRevenus = especes.reduce((acc, e) =>
      acc + e.production.donneesGraphique.reduce((s, d) => s + d.revenus, 0), 0)
    return { totalBassins, totalCapacite, enAlerte, totalRevenus }
  }, [bassins, especes])

  const chartData = useMemo(() =>
    bassins.map(b => ({
      name: b.nomBassin.split('—')[0].trim(),
      surface: b.surfaceM2,
      capacite: b.capaciteMax / 100,
    })), [bassins])

  // ─── CRUD Bassins ───
  const onSubmit = handleSubmit((data: BassinFormValues) => {
    if (editingId) {
      const next = bassins.map(b => b.id === editingId ? { ...b, ...data } : b)
      saveBassins(next)
      toast.success('Bassin mis à jour')
    } else {
      const nb: BassinData = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      }
      saveBassins([nb, ...bassins])
      toast.success('Bassin ajouté')
    }
    setIsFormOpen(false)
    setEditingId(null)
    reset()
  })

  const handleDeleteBassin = (id: string) => {
    if (confirm('Supprimer ce bassin ?')) {
      saveBassins(bassins.filter(b => b.id !== id))
      toast.success('Bassin supprimé')
    }
  }

  const openEditBassin = (bassin: BassinData) => {
    setEditingId(bassin.id)
    reset({
      nomBassin: bassin.nomBassin,
      typePoissonEspeceId: bassin.typePoissonEspeceId as BassinFormValues['typePoissonEspeceId'],
      surfaceM2: bassin.surfaceM2,
      capaciteMax: bassin.capaciteMax,
      etatSante: bassin.etatSante,
      dateMiseEnEau: bassin.dateMiseEnEau,
      notes: bassin.notes,
    })
    setIsFormOpen(true)
  }

  const especeNom = (id: string) =>
    especes.find(e => e.id === id)?.nomEspece ?? '—'

  const selectColor = `
    flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
    focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
    dark:border-gray-700 dark:bg-gray-900 dark:text-white
  `

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <SectionTitle
          title="Aquaculture"
          subtitle="Gérez vos espèces piscicoles et vos bassins, suivez la qualité de l'eau et la production."
          badge="Poissons"
        />
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setActiveView('especes')}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-all',
                activeView === 'especes'
                  ? 'bg-white dark:bg-gray-700 shadow text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400'
              )}
            >
              <Fish className="w-4 h-4 inline mr-1" /> Espèces
            </button>
            <button
              onClick={() => setActiveView('bassins')}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-all',
                activeView === 'bassins'
                  ? 'bg-white dark:bg-gray-700 shadow text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400'
              )}
            >
              <Waves className="w-4 h-4 inline mr-1" /> Bassins
            </button>
          </div>
          {activeView === 'bassins' && (
            <Button
              onClick={() => { setIsFormOpen(!isFormOpen); setEditingId(null); reset() }}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              {isFormOpen ? 'Fermer' : 'Nouveau Bassin'}
            </Button>
          )}
        </div>
      </div>

      {/* Formulaire CRUD Bassins */}
      <AnimatePresence>
        {isFormOpen && activeView === 'bassins' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <Card className="mb-4 border-blue-200 shadow-sm">
              <CardHeader>
                <CardTitle>{editingId ? 'Modifier le bassin' : 'Ajouter un bassin'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={onSubmit} className="grid md:grid-cols-3 gap-4">
                  <Input label="Nom du Bassin" {...register('nomBassin')} error={errors.nomBassin?.message} />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Espèce hébergée</label>
                    <select {...register('typePoissonEspeceId')} className={selectColor}>
                      <option value="espece-tilapia">Tilapia</option>
                      <option value="espece-clarias">Clarias</option>
                    </select>
                  </div>
                  <Input type="number" label="Surface (m²)" {...register('surfaceM2')} error={errors.surfaceM2?.message} />
                  <Input type="number" label="Capacité maximale" {...register('capaciteMax')} error={errors.capaciteMax?.message} />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">État de santé</label>
                    <select {...register('etatSante')} className={selectColor}>
                      <option value="Excellent">Excellent</option>
                      <option value="Bon">Bon</option>
                      <option value="Surveillance">Surveillance</option>
                      <option value="Quarantaine">Quarantaine</option>
                    </select>
                  </div>
                  <Input type="date" label="Date de mise en eau" {...register('dateMiseEnEau')} error={errors.dateMiseEnEau?.message} />
                  <div className="md:col-span-3">
                    <Input label="Notes (optionnel)" {...register('notes')} />
                  </div>
                  <div className="md:col-span-3 flex justify-end gap-2">
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs font-medium">Espèces</p>
                <p className="text-3xl font-bold mt-1">{especes.length}</p>
              </div>
              <div className="p-2.5 bg-white/20 rounded-xl"><Fish className="w-5 h-5 text-white" /></div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white border-none">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-100 text-xs font-medium">Bassins</p>
                <p className="text-3xl font-bold mt-1">{stats.totalBassins}</p>
              </div>
              <div className="p-2.5 bg-white/20 rounded-xl"><Waves className="w-5 h-5 text-white" /></div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-none">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-xs font-medium">Revenus estimés</p>
                <p className="text-2xl font-bold mt-1">{stats.totalRevenus.toLocaleString('fr-FR')} €</p>
              </div>
              <div className="p-2.5 bg-white/20 rounded-xl"><Banknote className="w-5 h-5 text-white" /></div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-none">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-xs font-medium">Bassins en alerte</p>
                <p className="text-3xl font-bold mt-1">{stats.enAlerte}</p>
              </div>
              <div className="p-2.5 bg-white/20 rounded-xl"><ShieldAlert className="w-5 h-5 text-white" /></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Waves className="w-5 h-5 text-blue-500" /> Surface & Capacité par Bassin
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                <YAxis yAxisId="l" orientation="left" stroke="#3b82f6" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                <YAxis yAxisId="r" orientation="right" stroke="#14b8a6" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                <RechartsTooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend />
                <Bar yAxisId="l" dataKey="surface" name="Surface (m²)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="r" dataKey="capacite" name="Capacité (x100)" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={activeView === 'especes' ? 'Rechercher une espèce…' : 'Rechercher un bassin…'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <option value="Tilapia">Tilapia</option>
              <option value="Clarias">Clarias</option>
            </select>
          </div>
          <Button variant="outline" size="sm" leftIcon={<ArrowUpDown className="w-4 h-4" />}>Trier</Button>
        </div>
      </div>

      {/* ─── Vue ESPÈCES ─── */}
      {activeView === 'especes' && (
        filteredEspeces.length === 0 ? (
          <Card><CardContent className="p-8"><EmptyState title="Aucune espèce trouvée" description="Modifiez vos filtres de recherche." /></CardContent></Card>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            {filteredEspeces.map(espece => (
              <motion.div
                key={espece.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative h-52 overflow-hidden">
                  <img src={getAquacultureImage(espece.nomEspece, espece.images[0])} alt={`Espèce piscicole ${espece.nomEspece}`} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-600/90 text-white backdrop-blur-md mr-2">
                      {espece.nomEspece}
                    </span>
                    <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-black/40 text-white backdrop-blur-md italic">
                      {espece.race}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4 line-clamp-2">
                    {espece.presentation}
                  </p>

                  {/* Indicateurs eau */}
                  <div className="grid grid-cols-3 gap-2 text-xs mb-4">
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <Thermometer className="w-3 h-3 text-orange-400 shrink-0" />
                      <span className="font-medium">{espece.qualiteEau.temperatureMin}–{espece.qualiteEau.temperatureMax}°C</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <FlaskConical className="w-3 h-3 text-green-400 shrink-0" />
                      <span className="font-medium">pH {espece.qualiteEau.phMin}–{espece.qualiteEau.phMax}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <Droplets className="w-3 h-3 text-blue-400 shrink-0" />
                      <span className="font-medium">{espece.qualiteEau.oxygeneDissouxMgL}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-4 text-sm mb-5">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">Rendement</p>
                      <p className="font-semibold text-gray-900 dark:text-white text-xs leading-tight">{espece.production.rendementKgM2}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">Durée cycle</p>
                      <p className="font-semibold text-blue-600 dark:text-blue-400">{espece.croissance.dureeCroissance}</p>
                    </div>
                  </div>

                  <div className="mt-auto flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => setSelectedFish(espece)} leftIcon={<Eye className="w-4 h-4" />}>
                      Fiche détaillée
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )
      )}

      {/* ─── Vue BASSINS ─── */}
      {activeView === 'bassins' && (
        filteredBassins.length === 0 ? (
          <Card><CardContent className="p-8"><EmptyState title="Aucun bassin trouvé" description="Ajoutez un bassin ou modifiez vos filtres." /></CardContent></Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBassins.map(bassin => (
              <motion.div
                key={bassin.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={getAquacultureImage(especeNom(bassin.typePoissonEspeceId), '/images/aquaculture/clarias.jpg')}
                    alt={`Bassin ${bassin.nomBassin} avec ${especeNom(bassin.typePoissonEspeceId)}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute top-3 right-3">
                    <span className={cn(
                      'px-2.5 py-1 text-xs font-bold rounded-lg shadow-sm border',
                      bassin.etatSante === 'Excellent' ? 'bg-green-100 text-green-700 border-green-200' :
                      bassin.etatSante === 'Bon' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                      'bg-orange-100 text-orange-700 border-orange-200'
                    )}>
                      {bassin.etatSante}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">{bassin.nomBassin}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    Espèce : <strong className="text-blue-600 dark:text-blue-400">{especeNom(bassin.typePoissonEspeceId)}</strong>
                  </p>

                  <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                      <p className="text-xs text-blue-500 dark:text-blue-400 mb-1">Surface</p>
                      <p className="font-bold text-blue-900 dark:text-blue-100">{bassin.surfaceM2} m²</p>
                    </div>
                    <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-3">
                      <p className="text-xs text-teal-500 dark:text-teal-400 mb-1">Capacité</p>
                      <p className="font-bold text-teal-900 dark:text-teal-100">{bassin.capaciteMax.toLocaleString()} poissons</p>
                    </div>
                  </div>

                  {bassin.notes && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic mb-4 line-clamp-2">
                      {bassin.notes}
                    </p>
                  )}

                  <div className="mt-auto flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditBassin(bassin)} className="shrink-0 text-gray-500">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteBassin(bassin.id)} className="shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <div className="flex-1" />
                    <span className="text-xs text-gray-400 dark:text-gray-500 self-center">
                      Mis en eau le {new Date(bassin.dateMiseEnEau).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )
      )}

      <FishDetailModal fish={selectedFish} isOpen={!!selectedFish} onClose={() => setSelectedFish(null)} />
    </div>
  )
}
