import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Mail, Phone, MapPin, Shield, Briefcase,
  Clock, Key, CheckCircle, XCircle, AlertCircle, Calendar
} from 'lucide-react'
import { Button } from '@/components/ui'
import type { User } from '@/types'
import { cn, formatDate, getInitials } from '@/utils'

interface UserProfileModalProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
  onToggleStatus: (user: User) => void
  onResetPassword: (user: User) => void
}

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrateur',
  directeur: 'Directeur',
  responsable: 'Responsable',
  employe: 'Employé',
}

const STATUT_CONFIG = {
  actif: { label: 'Actif', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', Icon: CheckCircle },
  en_attente: { label: 'En attente', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', Icon: AlertCircle },
  desactive: { label: 'Désactivé', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', Icon: XCircle },
}

export function UserProfileModal({ user, isOpen, onClose, onToggleStatus, onResetPassword }: UserProfileModalProps) {
  if (!user) return null

  const statut = STATUT_CONFIG[user.statut]
  const initials = getInitials(user.nom, user.prenom)

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header coloré */}
            <div className="bg-gradient-to-r from-agri-600 to-agri-500 p-6 text-white">
              <button onClick={onClose} className="absolute top-4 right-4 p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-4">
                {user.avatar ? (
                  <img src={user.avatar} alt={`${user.prenom} ${user.nom}`} className="w-20 h-20 rounded-full object-cover border-4 border-white/30" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center text-2xl font-bold">
                    {initials}
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold">{user.prenom} {user.nom}</h2>
                  <p className="text-white/80 text-sm">{ROLE_LABELS[user.role]}</p>
                  <span className={cn('mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold', statut.color)}>
                    <statut.Icon className="w-3 h-3" /> {statut.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Infos */}
            <div className="p-6 space-y-4">
              {[
                { icon: Mail, label: 'Email', value: user.email },
                { icon: Phone, label: 'Téléphone', value: user.telephone || '—' },
                { icon: MapPin, label: 'Adresse', value: user.adresse || '—' },
                { icon: Briefcase, label: 'Secteur', value: user.secteur || '—' },
                { icon: Shield, label: 'Rôle', value: ROLE_LABELS[user.role] },
                { icon: Calendar, label: 'Membre depuis', value: formatDate(user.createdAt) },
                { icon: Clock, label: 'Dernière connexion', value: user.derniereConnexion ? formatDate(user.derniereConnexion) : 'Jamais' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="px-6 pb-6 flex flex-wrap gap-3 border-t border-gray-100 dark:border-gray-800 pt-4">
              <Button
                type="button"
                variant={user.statut === 'actif' ? 'danger' : 'primary'}
                onClick={() => onToggleStatus(user)}
                leftIcon={user.statut === 'actif' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
              >
                {user.statut === 'actif' ? 'Désactiver' : 'Activer'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onResetPassword(user)}
                leftIcon={<Key className="w-4 h-4" />}
              >
                Réinitialiser MDP
              </Button>
              <Button type="button" variant="ghost" onClick={onClose} className="ml-auto">
                Fermer
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
