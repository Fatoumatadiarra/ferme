import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Plus, Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, Eye, Edit2, Trash2, Users, Banknote, CalendarDays, Activity } from 'lucide-react'
import { Tooltip as RechartsTooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle, Input, Button, SectionTitle, EmptyState } from '@/components/ui'
import { STORAGE_KEYS } from '@/constants'
import { StorageService } from '@/services'
import type { EmployeeRecord } from '@/data/employees-init'
import { INITIAL_EMPLOYEES_DATA, SECTEURS } from '@/data/employees-init'
import { EmployeeAvatar, EmployeeDetailModal } from '@/components/employees'
import { cn } from '@/utils'

const employeeSchema = z.object({
  nom: z.string().min(2, 'Obligatoire'),
  prenom: z.string().min(2, 'Obligatoire'),
  sexe: z.enum(['Homme', 'Femme']),
  email: z.string().email('Email invalide').min(5, 'Obligatoire'),
  telephone: z.string().min(8, 'Obligatoire'),
  adresse: z.string().min(3, 'Obligatoire'),
  poste: z.string().min(2, 'Obligatoire'),
  secteur: z.enum(SECTEURS as unknown as [string, ...string[]]),
  salaire: z.coerce.number().min(1, 'Obligatoire'),
  dateEmbauche: z.string().min(4, 'Obligatoire'),
  statut: z.enum(['actif', 'inactif', 'conge']),
})

type EmployeeFormValues = z.infer<typeof employeeSchema>
const EMPLOYEE_PAGE_SIZE = 12

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<EmployeeRecord[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSecteur, setFilterSecteur] = useState<string>('Tous')
  const [currentPage, setCurrentPage] = useState(1)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeRecord | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema) as any,
    defaultValues: { sexe: 'Homme', secteur: 'Maraîchage', statut: 'actif', salaire: 250000 }
  })

  useEffect(() => {
    const stored = StorageService.get<EmployeeRecord[]>(STORAGE_KEYS.EMPLOYEES)
    if (!stored || stored.length === 0) {
      StorageService.set(STORAGE_KEYS.EMPLOYEES, INITIAL_EMPLOYEES_DATA)
      setEmployees(INITIAL_EMPLOYEES_DATA)
    } else {
      setEmployees(stored)
    }
  }, [])

  const saveEmployees = (next: EmployeeRecord[]) => {
    setEmployees(next)
    StorageService.set(STORAGE_KEYS.EMPLOYEES, next)
  }

  const filteredEmployees = useMemo(() => {
    return employees.filter(e => {
      const matchSearch = e.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          e.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.poste.toLowerCase().includes(searchTerm.toLowerCase())
      const matchFilter = filterSecteur === 'Tous' || e.secteur === filterSecteur
      return matchSearch && matchFilter
    })
  }, [employees, searchTerm, filterSecteur])
  const pageCount = Math.max(1, Math.ceil(filteredEmployees.length / EMPLOYEE_PAGE_SIZE))
  const activePage = Math.min(currentPage, pageCount)
  const visibleEmployees = useMemo(
    () => filteredEmployees.slice((activePage - 1) * EMPLOYEE_PAGE_SIZE, activePage * EMPLOYEE_PAGE_SIZE),
    [filteredEmployees, activePage],
  )

  const stats = useMemo(() => {
    const total = employees.length
    const actifs = employees.filter(e => e.statut === 'actif').length
    const conges = employees.filter(e => e.statut === 'conge').length
    const masseSalariale = employees.reduce((acc, e) => acc + (e.statut !== 'inactif' ? e.salaire : 0), 0)
    
    // Repartition par secteur
    const repartitionSecteur = SECTEURS.map(secteur => ({
      name: secteur,
      value: employees.filter(e => e.secteur === secteur).length
    })).filter(s => s.value > 0)

    return { total, actifs, conges, masseSalariale, repartitionSecteur }
  }, [employees])

  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#14b8a6', '#64748b']

  const onSubmit = handleSubmit((data: EmployeeFormValues) => {
    if (editingId) {
      const next = employees.map(e => e.id === editingId ? { ...e, ...data } : e)
      saveEmployees(next)
      toast.success('Employé mis à jour')
    } else {
      const newEmp: EmployeeRecord = {
        ...data,
        id: crypto.randomUUID(),
        photo: '',
        taches: [],
        presences: [],
        createdAt: new Date().toISOString()
      }
      saveEmployees([newEmp, ...employees])
      toast.success('Employé ajouté')
    }
    setIsFormOpen(false)
    setEditingId(null)
    reset()
  })

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
      saveEmployees(employees.filter(e => e.id !== id))
      toast.success('Employé supprimé')
    }
  }

  const openEditForm = (emp: EmployeeRecord) => {
    setEditingId(emp.id)
    reset({
      nom: emp.nom,
      prenom: emp.prenom,
      sexe: emp.sexe,
      email: emp.email,
      telephone: emp.telephone,
      adresse: emp.adresse,
      poste: emp.poste,
      secteur: emp.secteur,
      salaire: emp.salaire,
      dateEmbauche: emp.dateEmbauche,
      statut: emp.statut
    })
    setIsFormOpen(true)
  }

  const selectColor = `
    flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
    focus:border-agri-500 focus:outline-none focus:ring-1 focus:ring-agri-500
    dark:border-gray-700 dark:bg-gray-900 dark:text-white
  `

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <SectionTitle 
          title="Ressources Humaines" 
          subtitle="Gérez les employés, suivez les présences et analysez la masse salariale." 
          badge="Équipe" 
        />
        <Button onClick={() => { setIsFormOpen(!isFormOpen); setEditingId(null); reset() }} leftIcon={<Plus className="w-4 h-4" />}>
          {isFormOpen ? 'Fermer le formulaire' : 'Nouvel Employé'}
        </Button>
      </div>

      {/* Formulaire CRUD */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <Card className="mb-6 border-agri-200 shadow-sm">
              <CardHeader>
                <CardTitle>{editingId ? 'Modifier un employé' : 'Ajouter un employé'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={onSubmit} className="grid md:grid-cols-3 gap-4">
                  <Input label="Prénom" {...register('prenom')} error={errors.prenom?.message} />
                  <Input label="Nom" {...register('nom')} error={errors.nom?.message} />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sexe</label>
                    <select {...register('sexe')} className={selectColor}>
                      <option value="Homme">Homme</option>
                      <option value="Femme">Femme</option>
                    </select>
                  </div>
                  <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
                  <Input label="Téléphone" {...register('telephone')} error={errors.telephone?.message} />
                  <Input label="Adresse" {...register('adresse')} error={errors.adresse?.message} />
                  <Input label="Poste" {...register('poste')} error={errors.poste?.message} />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Secteur</label>
                    <select {...register('secteur')} className={selectColor}>
                      {SECTEURS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <Input type="number" label="Salaire (FCFA)" {...register('salaire')} error={errors.salaire?.message} />
                  <Input type="date" label="Date d'embauche" {...register('dateEmbauche')} error={errors.dateEmbauche?.message} />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Statut</label>
                    <select {...register('statut')} className={selectColor}>
                      <option value="actif">Actif</option>
                      <option value="conge">En congé</option>
                      <option value="inactif">Inactif</option>
                    </select>
                  </div>
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-agri-500 to-agri-600 text-white border-none">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-agri-100 text-xs font-medium">Total Employés</p>
                <p className="text-3xl font-bold mt-1">{stats.total}</p>
              </div>
              <div className="p-2.5 bg-white/20 rounded-xl"><Users className="w-5 h-5 text-white" /></div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs font-medium">Actifs</p>
                <p className="text-3xl font-bold mt-1">{stats.actifs}</p>
              </div>
              <div className="p-2.5 bg-white/20 rounded-xl"><Activity className="w-5 h-5 text-white" /></div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-none">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-xs font-medium">En Congé</p>
                <p className="text-3xl font-bold mt-1">{stats.conges}</p>
              </div>
              <div className="p-2.5 bg-white/20 rounded-xl"><CalendarDays className="w-5 h-5 text-white" /></div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-none">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-xs font-medium">Masse Salariale / Mois</p>
                <p className="text-2xl font-bold mt-1">{stats.masseSalariale.toLocaleString('fr-FR')} FCFA</p>
              </div>
              <div className="p-2.5 bg-white/20 rounded-xl"><Banknote className="w-5 h-5 text-white" /></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphique */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Répartition par Secteur</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.repartitionSecteur}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {stats.repartitionSecteur.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend />
              </PieChart>
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
            placeholder="Rechercher par nom, poste..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-agri-500"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Filter className="w-4 h-4" />
            <select
              value={filterSecteur}
              onChange={(e) => { setFilterSecteur(e.target.value); setCurrentPage(1) }}
              className="bg-transparent border-none focus:ring-0 font-medium cursor-pointer"
            >
              <option value="Tous">Tous les secteurs</option>
              {SECTEURS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <Button variant="outline" size="sm" leftIcon={<ArrowUpDown className="w-4 h-4" />}>
            Trier
          </Button>
        </div>
      </div>

      {/* Grille des Employés */}
      {filteredEmployees.length === 0 ? (
        <Card><CardContent className="p-8"><EmptyState title="Aucun employé trouvé" description="Modifiez vos filtres ou ajoutez un nouvel employé." /></CardContent></Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {visibleEmployees.map(emp => (
            <motion.div
              key={emp.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:-translate-y-1 hover:border-agri-200 hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="relative h-32 overflow-hidden bg-gradient-to-r from-agri-400 to-agri-700">
                <div className="absolute -right-4 -top-10 h-32 w-32 rounded-full border-[18px] border-white/10 transition-transform duration-500 group-hover:scale-125" />
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                  <EmployeeAvatar
                    prenom={emp.prenom}
                    nom={emp.nom}
                    className="h-20 w-20 border-4 border-white text-xl shadow-md dark:border-gray-800"
                  />
                  <div className={cn(
                    "absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800",
                    emp.statut === 'actif' ? 'bg-green-500' : emp.statut === 'conge' ? 'bg-amber-500' : 'bg-gray-500'
                  )} />
                </div>
              </div>
              <div className="pt-12 p-5 flex-1 flex flex-col text-center">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{emp.prenom} {emp.nom}</h3>
                <p className="text-sm font-medium text-agri-600 dark:text-agri-400 mt-0.5">{emp.poste}</p>
                
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 py-1.5 px-3 rounded-full mx-auto">
                  <span>{emp.secteur}</span>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-4 text-xs mb-6 text-left">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Embauche</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{new Date(emp.dateEmbauche).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Salaire</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{(emp.salaire / 1000).toFixed(0)}k FCFA</p>
                  </div>
                </div>

                <div className="mt-auto flex justify-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedEmployee(emp)} leftIcon={<Eye className="w-3.5 h-3.5" />}>
                    Profil
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openEditForm(emp)} className="shrink-0 text-gray-500 h-8 w-8">
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(emp.id)} className="shrink-0 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 w-8">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {filteredEmployees.length > EMPLOYEE_PAGE_SIZE && (
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {Math.min((activePage - 1) * EMPLOYEE_PAGE_SIZE + 1, filteredEmployees.length)}–
            {Math.min(activePage * EMPLOYEE_PAGE_SIZE, filteredEmployees.length)} sur {filteredEmployees.length} employés
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={activePage === 1}
              onClick={() => setCurrentPage((page) => Math.max(1, Math.min(page, pageCount) - 1))}
              aria-label="Page précédente"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="min-w-16 text-center text-sm text-gray-600 dark:text-gray-300">
              {activePage} / {pageCount}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={activePage >= pageCount}
              onClick={() => setCurrentPage((page) => Math.min(pageCount, Math.min(page, pageCount) + 1))}
              aria-label="Page suivante"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <EmployeeDetailModal employee={selectedEmployee} isOpen={!!selectedEmployee} onClose={() => setSelectedEmployee(null)} />
    </div>
  )
}