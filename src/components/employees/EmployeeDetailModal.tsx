import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  CircleDot,
  Banknote,
  User,
} from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { EmployeeRecord, StatutPresence } from '@/data/employees-init'
import { cn } from '@/utils'
import { EmployeeAvatar } from './EmployeeAvatar'

interface EmployeeDetailModalProps {
  employee: EmployeeRecord | null
  isOpen: boolean
  onClose: () => void
}

const STATUT_COLORS: Record<string, string> = {
  actif: 'bg-green-100 text-green-700 border-green-200',
  inactif: 'bg-gray-100 text-gray-700 border-gray-200',
  conge: 'bg-blue-100 text-blue-700 border-blue-200',
}

const PRESENCE_CONFIG: Record<StatutPresence, { label: string; color: string; icon: React.ReactNode }> = {
  present: { label: 'Présent', color: 'bg-green-100 text-green-700', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  absent: { label: 'Absent', color: 'bg-red-100 text-red-700', icon: <AlertCircle className="w-3.5 h-3.5" /> },
  retard: { label: 'Retard', color: 'bg-orange-100 text-orange-700', icon: <Clock className="w-3.5 h-3.5" /> },
  conge: { label: 'Congé', color: 'bg-blue-100 text-blue-700', icon: <CircleDot className="w-3.5 h-3.5" /> },
}

const TACHE_PRIORITE: Record<string, string> = {
  haute: 'bg-red-100 text-red-700',
  normale: 'bg-blue-100 text-blue-700',
  basse: 'bg-gray-100 text-gray-500',
}

const TACHE_STATUT: Record<string, string> = {
  a_faire: 'À faire',
  en_cours: 'En cours',
  terminee: 'Terminée',
}

export function EmployeeDetailModal({ employee, isOpen, onClose }: EmployeeDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'profil' | 'taches' | 'presences' | 'stats'>('profil')

  if (!employee) return null

  const presenceStats = employee.presences.reduce(
    (acc, p) => {
      acc[p.statut] = (acc[p.statut] ?? 0) + 1
      return acc
    },
    {} as Record<StatutPresence, number>,
  )

  const pieData = [
    { name: 'Présent', value: presenceStats.present ?? 0, color: '#22c55e' },
    { name: 'Absent', value: presenceStats.absent ?? 0, color: '#ef4444' },
    { name: 'Retard', value: presenceStats.retard ?? 0, color: '#f97316' },
    { name: 'Congé', value: presenceStats.conge ?? 0, color: '#3b82f6' },
  ].filter(d => d.value > 0)

  const tachesTerminees = employee.taches.filter(t => t.statut === 'terminee').length
  const tauxCompletion = employee.taches.length > 0
    ? Math.round((tachesTerminees / employee.taches.length) * 100)
    : 0

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900 flex flex-col"
          >
            {/* Hero */}
            <div className="relative shrink-0 bg-gradient-to-br from-agri-600 via-agri-700 to-agri-900 p-8">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-6">
                <div className="relative shrink-0">
                  <EmployeeAvatar
                    prenom={employee.prenom}
                    nom={employee.nom}
                    className="h-24 w-24 rounded-2xl border-4 border-white/30 text-2xl shadow-xl"
                  />
                  <span className={cn(
                    'absolute -bottom-2 -right-2 px-2 py-0.5 text-xs font-bold rounded-full border',
                    STATUT_COLORS[employee.statut]
                  )}>
                    {employee.statut === 'actif' ? 'Actif' : employee.statut === 'conge' ? 'En congé' : 'Inactif'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 text-xs font-semibold bg-white/20 text-white rounded-full">{employee.secteur}</span>
                    <span className="px-2.5 py-0.5 text-xs font-medium bg-white/10 text-white/80 rounded-full">{employee.sexe}</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">{employee.prenom} {employee.nom}</h2>
                  <p className="text-agri-200 font-medium mt-0.5">{employee.poste}</p>
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-white/70">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Depuis {new Date(employee.dateEmbauche).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}</span>
                    <span className="flex items-center gap-1.5"><Banknote className="w-3.5 h-3.5" /> {employee.salaire.toLocaleString('fr-FR')} FCFA/mois</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-800 shrink-0 px-6 overflow-x-auto">
              {[
                { id: 'profil', label: 'Profil & Coordonnées' },
                { id: 'taches', label: `Tâches (${employee.taches.length})` },
                { id: 'presences', label: 'Présences' },
                { id: 'stats', label: 'Statistiques' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-4 py-4 text-sm font-medium transition-colors relative whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-agri-600 dark:text-agri-400'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTabEmployee"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-agri-600 dark:bg-agri-400"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1">

              {/* PROFIL */}
              {activeTab === 'profil' && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Coordonnées</h3>
                      {[
                        { icon: <Mail className="w-4 h-4 text-blue-500" />, label: 'Email', val: employee.email },
                        { icon: <Phone className="w-4 h-4 text-green-500" />, label: 'Téléphone', val: employee.telephone },
                        { icon: <MapPin className="w-4 h-4 text-red-500" />, label: 'Adresse', val: employee.adresse },
                      ].map(({ icon, label, val }) => (
                        <div key={label} className="flex items-start gap-3">
                          <div className="mt-0.5">{icon}</div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
                            <p className="font-medium text-gray-900 dark:text-white">{val}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Informations professionnelles</h3>
                      {[
                        { icon: <Briefcase className="w-4 h-4 text-purple-500" />, label: 'Poste', val: employee.poste },
                        { icon: <User className="w-4 h-4 text-agri-500" />, label: 'Secteur', val: employee.secteur },
                        { icon: <Calendar className="w-4 h-4 text-orange-500" />, label: "Date d'embauche", val: new Date(employee.dateEmbauche).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) },
                        { icon: <Banknote className="w-4 h-4 text-green-600" />, label: 'Salaire mensuel', val: `${employee.salaire.toLocaleString('fr-FR')} FCFA` },
                      ].map(({ icon, label, val }) => (
                        <div key={label} className="flex items-start gap-3">
                          <div className="mt-0.5">{icon}</div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
                            <p className="font-medium text-gray-900 dark:text-white">{val}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TACHES */}
              {activeTab === 'taches' && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  {employee.taches.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">Aucune tâche assignée</div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">{tachesTerminees}/{employee.taches.length} tâches terminées</p>
                        <span className="text-sm font-bold text-agri-600 dark:text-agri-400">{tauxCompletion}%</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 mb-6">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${tauxCompletion}%` }}
                          className="bg-agri-500 h-2 rounded-full"
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                        />
                      </div>
                      {employee.taches.map(tache => (
                        <div key={tache.id} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                          <div className={cn('w-2 h-2 rounded-full mt-1.5 shrink-0', tache.statut === 'terminee' ? 'bg-green-500' : tache.statut === 'en_cours' ? 'bg-orange-400' : 'bg-gray-300')} />
                          <div className="flex-1 min-w-0">
                            <p className={cn('font-medium text-gray-900 dark:text-white', tache.statut === 'terminee' && 'line-through text-gray-400')}>{tache.titre}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Échéance : {new Date(tache.dateEcheance).toLocaleDateString('fr-FR')}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2 shrink-0">
                            <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', TACHE_PRIORITE[tache.priorite])}>{tache.priorite}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{TACHE_STATUT[tache.statut]}</span>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </motion.div>
              )}

              {/* PRESENCES */}
              {activeTab === 'presences' && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    {Object.entries(PRESENCE_CONFIG).map(([key, cfg]) => (
                      <div key={key} className={cn('flex items-center gap-2 px-3 py-2 rounded-lg', cfg.color)}>
                        {cfg.icon}
                        <span className="text-xs font-medium">{cfg.label}</span>
                        <span className="ml-auto font-bold">{presenceStats[key as StatutPresence] ?? 0}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    {employee.presences.map((p, i) => {
                      const cfg = PRESENCE_CONFIG[p.statut]
                      return (
                        <div key={i} className="flex items-center justify-between py-2.5 px-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                          <div className="flex items-center gap-3">
                            <span className={cn('flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium', cfg.color)}>
                              {cfg.icon}
                              {cfg.label}
                            </span>
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {new Date(p.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </span>
                          </div>
                          {p.heures && (
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{p.heures}h</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* STATS */}
              {activeTab === 'stats' && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6 items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Taux de présence</h3>
                      <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={90}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {pieData.map((entry, index) => (
                                <Cell key={index} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Performance</h3>
                      <div className="p-5 bg-agri-50 dark:bg-agri-900/20 rounded-2xl border border-agri-100 dark:border-agri-900/30">
                        <p className="text-sm text-agri-600 dark:text-agri-400 mb-1">Taux de complétion des tâches</p>
                        <p className="text-4xl font-bold text-agri-700 dark:text-agri-300">{tauxCompletion}%</p>
                      </div>
                      <div className="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Heures travaillées (semaine)</p>
                        <p className="text-4xl font-bold text-gray-900 dark:text-white">
                          {employee.presences.reduce((acc, p) => acc + (p.heures ?? 0), 0)}h
                        </p>
                      </div>
                      <div className="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Ancienneté</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {Math.floor((Date.now() - new Date(employee.dateEmbauche).getTime()) / (1000 * 60 * 60 * 24 * 365))} ans
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
