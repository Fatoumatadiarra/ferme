import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import {
  Users, UserPlus, Search, Filter, Eye, Edit2, Trash2,
  CheckCircle, XCircle, AlertCircle, Shield, MoreVertical,
} from 'lucide-react'
import {
  Card, CardContent, CardHeader, CardTitle,
  Input, Button, SectionTitle, EmptyState,
} from '@/components/ui'
import { STORAGE_KEYS } from '@/constants'
import { StorageService } from '@/services'
import type { User, UserRole, UserStatut } from '@/types'
import { INITIAL_USERS_DATA, USER_ROLES, USER_SECTEURS, USER_STATUTS } from '@/data/users-init'
import { UserProfileModal } from '@/components/users'
import { cn, formatDate, getInitials } from '@/utils'

// ─── Schéma de validation ────────────────────────────────────────
const userSchema = z.object({
  prenom: z.string().min(2, 'Prénom requis'),
  nom: z.string().min(2, 'Nom requis'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, '6 caractères minimum').or(z.literal('')),
  telephone: z.string().optional(),
  adresse: z.string().optional(),
  role: z.enum(['admin', 'directeur', 'responsable', 'employe']),
  secteur: z.enum([
    'Administration', 'Maraichage', 'Elevage', 'Aviculture',
    'Aquaculture', 'Materiels', 'Stocks', 'Ventes',
  ]),
  statut: z.enum(['actif', 'en_attente', 'desactive']),
})

type UserFormValues = z.infer<typeof userSchema>

// ─── Config affichage ──────────────────────────────────────────────
const STATUT_CONFIG: Record<UserStatut, { label: string; color: string; Icon: React.ComponentType<{ className?: string }> }> = {
  actif: { label: 'Actif', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', Icon: CheckCircle },
  en_attente: { label: 'En attente', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', Icon: AlertCircle },
  desactive: { label: 'Désactivé', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', Icon: XCircle },
}

const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrateur',
  directeur: 'Directeur',
  responsable: 'Responsable',
  employe: 'Employé',
}

const ROLE_COLORS: Record<UserRole, string> = {
  admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  directeur: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  responsable: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  employe: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
}

// ─── Composant Principal ───────────────────────────────────────────
export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('Tous')
  const [filterSecteur, setFilterSecteur] = useState('Tous')
  const [filterStatut, setFilterStatut] = useState('Tous')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [profileUser, setProfileUser] = useState<User | null>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: { role: 'employe', secteur: 'Administration', statut: 'en_attente' },
  })

  // ─── Chargement depuis localStorage ───────────────────────────
  useEffect(() => {
    const stored = StorageService.get<User[]>(STORAGE_KEYS.USERS)
    if (!stored || stored.length === 0) {
      StorageService.set(STORAGE_KEYS.USERS, INITIAL_USERS_DATA)
      setUsers(INITIAL_USERS_DATA)
    } else {
      // Assurer la rétrocompatibilité (statut manquant sur anciens enregistrements)
      const patched = stored.map(u => ({ ...u, statut: u.statut || ('actif' as UserStatut) }))
      setUsers(patched)
    }
  }, [])

  const saveUsers = (next: User[]) => {
    setUsers(next)
    StorageService.set(STORAGE_KEYS.USERS, next)
  }

  // ─── Filtrage ──────────────────────────────────────────────────
  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase()
    return users.filter(u => {
      const matchSearch =
        u.prenom.toLowerCase().includes(term) ||
        u.nom.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        (u.telephone ?? '').toLowerCase().includes(term)
      const matchRole = filterRole === 'Tous' || u.role === filterRole
      const matchSecteur = filterSecteur === 'Tous' || u.secteur === filterSecteur
      const matchStatut = filterStatut === 'Tous' || u.statut === filterStatut
      return matchSearch && matchRole && matchSecteur && matchStatut
    })
  }, [users, searchTerm, filterRole, filterSecteur, filterStatut])

  // ─── Statistiques ──────────────────────────────────────────────
  const stats = useMemo(() => ({
    total: users.length,
    actifs: users.filter(u => u.statut === 'actif').length,
    enAttente: users.filter(u => u.statut === 'en_attente').length,
    desactives: users.filter(u => u.statut === 'desactive').length,
    admins: users.filter(u => u.role === 'admin').length,
  }), [users])

  // ─── CRUD ─────────────────────────────────────────────────────
  const onSubmit = handleSubmit((data) => {
    const now = new Date().toISOString()
    if (editingId) {
      const next = users.map(u =>
        u.id === editingId
          ? {
              ...u,
              ...data,
              password: data.password ? data.password : u.password,
              updatedAt: now,
            }
          : u,
      )
      saveUsers(next)
      toast.success('Utilisateur mis à jour')
    } else {
      if (!data.password) {
        toast.error('Le mot de passe est obligatoire à la création')
        return
      }
      const newUser: User = {
        ...data,
        password: data.password,
        id: `usr-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      }
      saveUsers([newUser, ...users])
      toast.success('Utilisateur créé')
    }
    setIsFormOpen(false)
    setEditingId(null)
    reset()
  })

  const handleEdit = (user: User) => {
    setEditingId(user.id)
    reset({
      prenom: user.prenom,
      nom: user.nom,
      email: user.email,
      password: '',
      telephone: user.telephone ?? '',
      adresse: user.adresse ?? '',
      role: user.role,
      secteur: user.secteur ?? 'Administration',
      statut: user.statut,
    })
    setIsFormOpen(true)
    setOpenMenuId(null)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Confirmer la suppression définitive de cet utilisateur ?')) {
      saveUsers(users.filter(u => u.id !== id))
      toast.success('Utilisateur supprimé')
    }
    setOpenMenuId(null)
  }

  const handleToggleStatus = (user: User) => {
    const next = users.map(u =>
      u.id === user.id
        ? { ...u, statut: (u.statut === 'actif' ? 'desactive' : 'actif') as UserStatut, updatedAt: new Date().toISOString() }
        : u,
    )
    saveUsers(next)
    const updated = next.find(u => u.id === user.id)!
    setProfileUser(updated)
    toast.success(updated.statut === 'actif' ? 'Compte activé' : 'Compte désactivé')
  }

  const handleResetPassword = (user: User) => {
    const tempPwd = `Ferme${Math.floor(1000 + Math.random() * 9000)}`
    const next = users.map(u => u.id === user.id ? { ...u, password: tempPwd, updatedAt: new Date().toISOString() } : u)
    saveUsers(next)
    toast.success(`Nouveau MDP : ${tempPwd} (copier avant de fermer)`, { duration: 8000 })
  }

  const openNew = () => {
    setEditingId(null)
    reset({ role: 'employe', secteur: 'Administration', statut: 'en_attente' })
    setIsFormOpen(true)
  }

  // ─── JSX ──────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <SectionTitle
          title="Gestion des utilisateurs"
          subtitle="Gérez les comptes, rôles, secteurs et accès de votre équipe."
          badge="Administration"
        />
        <Button onClick={openNew} leftIcon={<UserPlus className="w-4 h-4" />}>
          Nouvel utilisateur
        </Button>
      </div>

      {/* ─── Dashboard Stats ─── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'from-indigo-500 to-indigo-600', Icon: Users, text: 'text-white' },
          { label: 'Actifs', value: stats.actifs, color: 'from-green-500 to-emerald-600', Icon: CheckCircle, text: 'text-white' },
          { label: 'En attente', value: stats.enAttente, color: 'from-yellow-400 to-amber-500', Icon: AlertCircle, text: 'text-white' },
          { label: 'Désactivés', value: stats.desactives, color: 'from-red-500 to-rose-600', Icon: XCircle, text: 'text-white' },
          { label: 'Administrateurs', value: stats.admins, color: 'from-purple-500 to-violet-600', Icon: Shield, text: 'text-white' },
        ].map(({ label, value, color, Icon, text }) => (
          <Card key={label} className={cn('bg-gradient-to-br border-none shadow-sm', color)}>
            <CardContent className="p-4 flex flex-col gap-2">
              <Icon className={cn('w-5 h-5 opacity-80', text)} />
              <p className={cn('text-xs font-medium opacity-80', text)}>{label}</p>
              <p className={cn('text-2xl font-bold', text)}>{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ─── Formulaire Ajout/Modif ─── */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <Card className="border-agri-200 shadow-sm">
              <CardHeader>
                <CardTitle>{editingId ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={onSubmit} className="grid md:grid-cols-4 gap-4">
                  <Input label="Prénom" {...register('prenom')} error={errors.prenom?.message} />
                  <Input label="Nom" {...register('nom')} error={errors.nom?.message} />
                  <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
                  <Input
                    label={editingId ? 'Nouveau MDP (laisser vide = inchangé)' : 'Mot de passe'}
                    type="password"
                    {...register('password')}
                    error={errors.password?.message}
                  />
                  <Input label="Téléphone" {...register('telephone')} />
                  <Input label="Adresse" {...register('adresse')} />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rôle</label>
                    <select {...register('role')} className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-agri-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                      {USER_ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                    {errors.role && <p className="mt-1 text-xs text-red-500">{errors.role.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Secteur</label>
                    <select {...register('secteur')} className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-agri-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                      {USER_SECTEURS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Statut</label>
                    <select {...register('statut')} className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-agri-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                      {USER_STATUTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>

                  <div className="md:col-span-4 flex justify-end gap-3 pt-2">
                    <Button type="button" variant="ghost" onClick={() => { setIsFormOpen(false); setEditingId(null); reset() }}>
                      Annuler
                    </Button>
                    <Button type="submit">{editingId ? 'Enregistrer les modifications' : 'Créer l\'utilisateur'}</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Barre de recherche & Filtres ─── */}
      <div className="flex flex-col md:flex-row gap-3 items-center bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Nom, prénom, email, téléphone..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-agri-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 ml-0 md:ml-2">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />

          <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-agri-500">
            <option value="Tous">Tous les rôles</option>
            {USER_ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>

          <select value={filterSecteur} onChange={e => setFilterSecteur(e.target.value)} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-agri-500">
            <option value="Tous">Tous les secteurs</option>
            {USER_SECTEURS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select value={filterStatut} onChange={e => setFilterStatut(e.target.value)} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-agri-500">
            <option value="Tous">Tous les statuts</option>
            {USER_STATUTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        <p className="text-xs text-gray-400 md:ml-auto shrink-0">
          {filteredUsers.length} / {users.length} utilisateur{users.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* ─── Tableau ─── */}
      <Card>
        <CardContent className="p-0">
          {filteredUsers.length === 0 ? (
            <div className="p-8">
              <EmptyState title="Aucun utilisateur" description="Modifiez vos critères ou créez un nouvel utilisateur." />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
                    {['Utilisateur', 'Rôle', 'Secteur', 'Statut', 'Dernière connexion', ''].map(h => (
                      <th key={h} className="py-3.5 px-5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                  {filteredUsers.map(user => {
                    const cfg = STATUT_CONFIG[user.statut]
                    return (
                      <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors group">
                        {/* Avatar + Nom */}
                        <td className="py-3 px-5">
                          <div className="flex items-center gap-3">
                            {user.avatar ? (
                              <img src={user.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-agri-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                                {getInitials(user.nom, user.prenom)}
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.prenom} {user.nom}</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                              {user.telephone && <p className="text-xs text-gray-400">{user.telephone}</p>}
                            </div>
                          </div>
                        </td>
                        {/* Rôle */}
                        <td className="py-3 px-5">
                          <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold', ROLE_COLORS[user.role])}>
                            {ROLE_LABELS[user.role]}
                          </span>
                        </td>
                        {/* Secteur */}
                        <td className="py-3 px-5 text-sm text-gray-600 dark:text-gray-300">
                          {user.secteur ?? '—'}
                        </td>
                        {/* Statut */}
                        <td className="py-3 px-5">
                          <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold', cfg.color)}>
                            <cfg.Icon className="w-3 h-3" /> {cfg.label}
                          </span>
                        </td>
                        {/* Dernière connexion */}
                        <td className="py-3 px-5 text-sm text-gray-500 dark:text-gray-400">
                          {user.derniereConnexion ? formatDate(user.derniereConnexion) : <span className="italic text-gray-400">Jamais</span>}
                        </td>
                        {/* Actions */}
                        <td className="py-3 px-5">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost" size="icon"
                              onClick={() => setProfileUser(user)}
                              className="h-8 w-8 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Voir le profil"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost" size="icon"
                              onClick={() => handleEdit(user)}
                              className="h-8 w-8 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Modifier"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            {/* Menu contextuel */}
                            <div className="relative">
                              <Button
                                variant="ghost" size="icon"
                                onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                                className="h-8 w-8 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Plus d'actions"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                              <AnimatePresence>
                                {openMenuId === user.id && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                    className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-20 py-1"
                                  >
                                    <button
                                      onClick={() => handleToggleStatus(user)}
                                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                    >
                                      {user.statut === 'actif'
                                        ? <><XCircle className="w-4 h-4 text-red-500" /> Désactiver</>
                                        : <><CheckCircle className="w-4 h-4 text-green-500" /> Activer</>}
                                    </button>
                                    <button
                                      onClick={() => { handleResetPassword(user); setOpenMenuId(null) }}
                                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                    >
                                      🔑 Réinitialiser MDP
                                    </button>
                                    <div className="border-t border-gray-100 dark:border-gray-800 my-1" />
                                    <button
                                      onClick={() => handleDelete(user.id)}
                                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                                    >
                                      <Trash2 className="w-4 h-4" /> Supprimer
                                    </button>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ─── Modale Profil ─── */}
      <UserProfileModal
        user={profileUser}
        isOpen={!!profileUser}
        onClose={() => setProfileUser(null)}
        onToggleStatus={handleToggleStatus}
        onResetPassword={(u) => { handleResetPassword(u); setProfileUser(null) }}
      />
    </div>
  )
}
