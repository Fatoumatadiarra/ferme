import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Plus, Search, Filter, Eye, Edit2, Trash2, Settings, AlertTriangle, CheckCircle, BarChart2, PieChart as PieChartIcon } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle, Input, Button, SectionTitle, EmptyState } from '@/components/ui'
import { STORAGE_KEYS } from '@/constants'
import { StorageService } from '@/services'
import type { MaterialRecord } from '@/types/material'
import { getMaterialImage, INITIAL_MATERIALS_DATA, MATERIAL_CATEGORIES } from '@/data/materials-init'
import { MaterialDetailModal } from '@/components/materials'
import { cn, formatCurrency } from '@/utils'

const materialSchema = z.object({
  nom: z.string().min(2, 'Nom requis'),
  categorie: z.enum(MATERIAL_CATEGORIES as any),
  marque: z.string().min(2, 'Marque requise'),
  modele: z.string().min(2, 'Modèle requis'),
  numeroSerie: z.string().min(2, 'Numéro de série requis'),
  description: z.string().min(2, 'Description requise'),
  utilisation: z.string().min(2, 'Utilisation requise'),
  dateAcquisition: z.string().min(2, 'Date requise'),
  coutAcquisition: z.coerce.number().min(0),
  valeurActuelle: z.coerce.number().min(0),
  etat: z.enum(['operationnel', 'maintenance', 'hors_service']),
  localisation: z.string().min(2, 'Localisation requise'),
  responsable: z.string().min(2, 'Responsable requis'),
  heuresUtilisation: z.coerce.number().min(0),
  garantie: z.string().optional()
})

type MaterialFormValues = z.infer<typeof materialSchema>

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<MaterialRecord[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEtat, setFilterEtat] = useState<string>('Tous')
  const [filterCategorie, setFilterCategorie] = useState<string>('Tous')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialRecord | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<MaterialFormValues>({
    resolver: zodResolver(materialSchema) as any
  })

  useEffect(() => {
    const stored = StorageService.get<MaterialRecord[]>(STORAGE_KEYS.MATERIELS)
    if (!stored || stored.length === 0) {
      StorageService.set(STORAGE_KEYS.MATERIELS, INITIAL_MATERIALS_DATA)
      setMaterials(INITIAL_MATERIALS_DATA)
    } else {
      setMaterials(stored)
    }
  }, [])

  const saveMaterials = (next: MaterialRecord[]) => {
    setMaterials(next)
    StorageService.set(STORAGE_KEYS.MATERIELS, next)
  }

  const filteredMaterials = useMemo(() => {
    const term = searchTerm.toLowerCase()
    return materials.filter(m => {
      const matchSearch = m.nom.toLowerCase().includes(term) || 
                          m.marque.toLowerCase().includes(term) ||
                          m.modele.toLowerCase().includes(term) ||
                          m.categorie.toLowerCase().includes(term) ||
                          m.numeroSerie.toLowerCase().includes(term) ||
                          m.localisation.toLowerCase().includes(term)
      const matchEtat = filterEtat === 'Tous' || m.etat === filterEtat
      const matchCat = filterCategorie === 'Tous' || m.categorie === filterCategorie
      return matchSearch && matchEtat && matchCat
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [materials, searchTerm, filterEtat, filterCategorie])

  const stats = useMemo(() => {
    const total = materials.length
    const operationnels = materials.filter(m => m.etat === 'operationnel').length
    const enMaintenance = materials.filter(m => m.etat === 'maintenance').length
    const horsService = materials.filter(m => m.etat === 'hors_service').length
    const valeurTotale = materials.reduce((acc, m) => acc + m.valeurActuelle, 0)
    
    // Graphique Répartition
    const byCategory: Record<string, number> = {}
    materials.forEach(m => {
      byCategory[m.categorie] = (byCategory[m.categorie] || 0) + 1
    })
    const pieData = Object.keys(byCategory).map(k => ({ name: k, value: byCategory[k] }))

    // Graphique Coûts d'acquisition (Top 5 plus chers)
    const barData = [...materials].sort((a, b) => b.coutAcquisition - a.coutAcquisition).slice(0, 5).map(m => ({
      nom: m.nom.length > 10 ? m.nom.substring(0,10) + '...' : m.nom,
      cout: m.coutAcquisition
    }))

    return { total, operationnels, enMaintenance, horsService, valeurTotale, pieData, barData }
  }, [materials])

  const onSubmit = handleSubmit((data: MaterialFormValues) => {
    if (editingId) {
      const next = materials.map(m => m.id === editingId ? { ...m, ...data } : m)
      saveMaterials(next)
      toast.success('Matériel mis à jour')
    } else {
      const newMaterial: MaterialRecord = {
        ...data,
        id: `material-${Date.now()}`,
        caracteristiques: ['Nouveau'],
        images: [getMaterialImage(data.categorie, data.nom)].filter(Boolean),
        maintenances: [],
        historique: [{
          id: `hist-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          action: 'Création',
          description: 'Ajout du matériel dans le système.',
          responsable: data.responsable
        }],
        createdAt: new Date().toISOString()
      }
      saveMaterials([newMaterial, ...materials])
      toast.success('Matériel ajouté')
    }
    setIsFormOpen(false)
    setEditingId(null)
    reset()
  })

  const handleDelete = (id: string) => {
    if (window.confirm('Confirmez-vous la suppression de ce matériel ?')) {
      saveMaterials(materials.filter(m => m.id !== id))
      toast.success('Matériel supprimé')
    }
  }

  const openEditForm = (material: MaterialRecord) => {
    setEditingId(material.id)
    reset({
      nom: material.nom,
      categorie: material.categorie,
      marque: material.marque,
      modele: material.modele,
      numeroSerie: material.numeroSerie,
      description: material.description,
      utilisation: material.utilisation,
      dateAcquisition: material.dateAcquisition,
      coutAcquisition: material.coutAcquisition,
      valeurActuelle: material.valeurActuelle,
      etat: material.etat,
      localisation: material.localisation,
      responsable: material.responsable,
      heuresUtilisation: material.heuresUtilisation,
      garantie: material.garantie || ''
    })
    setIsFormOpen(true)
  }

  const STATUS_COLORS = {
    'operationnel': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'maintenance': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    'hors_service': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  }
  const STATUS_LABELS = {
    'operationnel': 'Opérationnel',
    'maintenance': 'Maintenance',
    'hors_service': 'Hors service'
  }
  const PIE_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#d946ef', '#64748b']

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <SectionTitle 
          title="Matériels agricoles" 
          subtitle="Gérez vos équipements, leur état et leur maintenance." 
          badge="Infrastructures" 
        />
        <Button onClick={() => { setIsFormOpen(!isFormOpen); setEditingId(null); reset() }} leftIcon={<Plus className="w-4 h-4" />}>
          {isFormOpen ? 'Fermer le formulaire' : 'Nouveau matériel'}
        </Button>
      </div>

      {/* --- DASHBOARD --- */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-none">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <Settings className="w-5 h-5 mb-2 opacity-80" />
            <div>
              <p className="text-indigo-100 text-xs font-medium">Total Matériels</p>
              <p className="text-2xl font-bold mt-1">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-none">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <CheckCircle className="w-5 h-5 mb-2 opacity-80" />
            <div>
              <p className="text-green-100 text-xs font-medium">Opérationnels</p>
              <p className="text-2xl font-bold mt-1">{stats.operationnels}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-500 to-amber-600 text-white border-none">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <AlertTriangle className="w-5 h-5 mb-2 opacity-80" />
            <div>
              <p className="text-orange-100 text-xs font-medium">En Maintenance</p>
              <p className="text-2xl font-bold mt-1">{stats.enMaintenance}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-500 to-rose-600 text-white border-none">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <Trash2 className="w-5 h-5 mb-2 opacity-80" />
            <div>
              <p className="text-red-100 text-xs font-medium">Hors Service</p>
              <p className="text-2xl font-bold mt-1">{stats.horsService}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">Valeur totale</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white mt-1 break-words">
              {(stats.valeurTotale / 1000000).toFixed(1)} M FCFA
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><PieChartIcon className="w-5 h-5 text-indigo-500" /> Répartition par Catégorie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              {stats.pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={stats.pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value" label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                      {stats.pieData.map((_, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                    </Pie>
                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">Aucune donnée</div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><BarChart2 className="w-5 h-5 text-green-500" /> Top 5 Équipements les plus chers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              {stats.barData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.barData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="nom" axisLine={false} tickLine={false} tick={{fontSize: 11}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11}} tickFormatter={(val) => `${val / 1000000}M`} />
                    <RechartsTooltip formatter={(value: any) => [formatCurrency(Number(value) || 0), 'Coût']} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="cout" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">Aucune donnée</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* --- FORMULAIRE --- */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <Card className="mb-6 border-agri-200 shadow-sm">
              <CardHeader>
                <CardTitle>{editingId ? 'Modifier le matériel' : 'Nouveau matériel'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={onSubmit} className="grid md:grid-cols-4 gap-4">
                  <Input label="Nom" {...register('nom')} error={errors.nom?.message} />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Catégorie</label>
                    <select {...register('categorie')} className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-agri-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                      {MATERIAL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <Input label="Marque" {...register('marque')} error={errors.marque?.message} />
                  <Input label="Modèle" {...register('modele')} error={errors.modele?.message} />
                  
                  <Input label="Numéro de Série" {...register('numeroSerie')} error={errors.numeroSerie?.message} />
                  <Input type="date" label="Date d'achat" {...register('dateAcquisition')} error={errors.dateAcquisition?.message} />
                  <Input type="number" label="Coût Acquisition" {...register('coutAcquisition')} error={errors.coutAcquisition?.message} />
                  <Input type="number" label="Valeur Actuelle" {...register('valeurActuelle')} error={errors.valeurActuelle?.message} />

                  <div className="md:col-span-2">
                    <Input label="Description" {...register('description')} error={errors.description?.message} />
                  </div>
                  <div className="md:col-span-2">
                    <Input label="Utilisation" {...register('utilisation')} error={errors.utilisation?.message} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">État</label>
                    <select {...register('etat')} className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-agri-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                      <option value="operationnel">Opérationnel</option>
                      <option value="maintenance">En Maintenance</option>
                      <option value="hors_service">Hors Service</option>
                    </select>
                  </div>
                  <Input label="Localisation" {...register('localisation')} error={errors.localisation?.message} />
                  <Input label="Responsable" {...register('responsable')} error={errors.responsable?.message} />
                  <Input label="Garantie" {...register('garantie')} error={errors.garantie?.message} />
                  
                  <div className="md:col-span-4 mt-2">
                     <Input type="number" label="Heures d'utilisation" {...register('heuresUtilisation')} error={errors.heuresUtilisation?.message} />
                  </div>

                  <div className="md:col-span-4 flex justify-end gap-2 mt-2">
                    <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>Annuler</Button>
                    <Button type="submit">Enregistrer</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- FILTRES --- */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher (nom, catégorie, N° Série)..."
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
              <option value="Tous">Toutes les catégories</option>
              {MATERIAL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="h-4 w-px bg-gray-300 dark:bg-gray-700 hidden md:block" />
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <select
              value={filterEtat}
              onChange={(e) => setFilterEtat(e.target.value)}
              className="bg-transparent border-none focus:ring-0 font-medium cursor-pointer"
            >
              <option value="Tous">Tous les états</option>
              <option value="operationnel">Opérationnel</option>
              <option value="maintenance">Maintenance</option>
              <option value="hors_service">Hors service</option>
            </select>
          </div>
        </div>
      </div>

      {/* --- TABLEAU --- */}
      <Card>
        <CardContent className="p-0">
          {filteredMaterials.length === 0 ? (
            <div className="p-8"><EmptyState title="Aucun matériel" description="Modifiez vos critères de recherche ou ajoutez un nouvel équipement." /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
                    <th className="py-4 px-6 font-semibold text-sm text-gray-500 dark:text-gray-400">Équipement</th>
                    <th className="py-4 px-6 font-semibold text-sm text-gray-500 dark:text-gray-400">N° Série</th>
                    <th className="py-4 px-6 font-semibold text-sm text-gray-500 dark:text-gray-400">Catégorie</th>
                    <th className="py-4 px-6 font-semibold text-sm text-gray-500 dark:text-gray-400">État</th>
                    <th className="py-4 px-6 font-semibold text-sm text-gray-500 dark:text-gray-400">Localisation</th>
                    <th className="py-4 px-6 font-semibold text-sm text-gray-500 dark:text-gray-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                  {filteredMaterials.map(mat => (
                    <tr key={mat.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                      <td className="py-3 px-6 flex items-center gap-4">
                        {getMaterialImage(mat.categorie, mat.nom, mat.images[0]) ? (
                          <img src={getMaterialImage(mat.categorie, mat.nom, mat.images[0])} alt={`Image de ${mat.nom}`} loading="lazy" decoding="async" className="h-16 w-20 rounded-lg object-cover bg-gray-100" />
                        ) : (
                          <div className="h-16 w-20 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                            <Settings className="w-6 h-6" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{mat.nom}</p>
                          <p className="text-xs text-gray-500">{mat.marque} {mat.modele}</p>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-sm text-gray-600 dark:text-gray-300 font-mono">
                        {mat.numeroSerie}
                      </td>
                      <td className="py-3 px-6">
                        <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-md text-xs font-medium">
                          {mat.categorie}
                        </span>
                      </td>
                      <td className="py-3 px-6">
                        <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold", STATUS_COLORS[mat.etat])}>
                          {STATUS_LABELS[mat.etat]}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-sm text-gray-600 dark:text-gray-300">
                        {mat.localisation}
                      </td>
                      <td className="py-3 px-6 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" onClick={() => setSelectedMaterial(mat)} className="h-8 w-8 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20" title="Voir détails">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openEditForm(mat)} className="h-8 w-8 text-gray-500">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(mat.id)} className="h-8 w-8 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
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

      <MaterialDetailModal 
        material={selectedMaterial} 
        isOpen={!!selectedMaterial} 
        onClose={() => setSelectedMaterial(null)} 
      />
    </div>
  )
}
