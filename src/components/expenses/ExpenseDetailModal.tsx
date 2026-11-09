import { motion, AnimatePresence } from 'framer-motion'
import { X, Receipt, CheckCircle2, Clock, XCircle, Calendar, Tag, CreditCard, FileText } from 'lucide-react'
import type { ExpenseRecord } from '@/data/expenses-init'
import { cn, formatDate, formatCurrency } from '@/utils'

interface ExpenseDetailModalProps {
  expense: ExpenseRecord | null
  isOpen: boolean
  onClose: () => void
}

const STATUT_CONFIG = {
  'Payée': { color: 'bg-green-100 text-green-700', icon: <CheckCircle2 className="w-5 h-5" /> },
  'Planifiée': { color: 'bg-blue-100 text-blue-700', icon: <Clock className="w-5 h-5" /> },
  'Annulée': { color: 'bg-red-100 text-red-700', icon: <XCircle className="w-5 h-5" /> }
}

export function ExpenseDetailModal({ expense, isOpen, onClose }: ExpenseDetailModalProps) {
  if (!expense) return null
  const config = STATUT_CONFIG[expense.statut]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900 flex flex-col">
            
            <div className="relative p-6 border-b border-gray-100 dark:border-gray-800">
              <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full text-gray-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 mb-1">
                <div className={cn("p-2 rounded-xl", config.color)}>{config.icon}</div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Détails de la dépense</h2>
                  <p className="text-sm text-gray-500">{expense.id}</p>
                </div>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Montant Total</p>
                <p className="text-4xl font-black text-gray-900 dark:text-white">{formatCurrency(expense.montant)}</p>
                <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold mt-3", config.color)}>
                  {expense.statut}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                  <Receipt className="w-5 h-5 text-gray-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Libellé</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{expense.libelle}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500 flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> Catégorie</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{expense.categorie}</p>
                  </div>
                  <div className="flex flex-col gap-1 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Date</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(expense.dateDepense)}</p>
                  </div>
                </div>

                {expense.fournisseur && (
                  <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                    <CreditCard className="w-5 h-5 text-gray-400 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Fournisseur / Bénéficiaire</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{expense.fournisseur}</p>
                    </div>
                  </div>
                )}

                {expense.notes && (
                  <div className="flex items-start gap-4 p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl border border-yellow-100 dark:border-yellow-900/30">
                    <FileText className="w-5 h-5 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-yellow-800 dark:text-yellow-600 uppercase tracking-wider font-semibold">Notes</p>
                      <p className="text-sm text-yellow-900 dark:text-yellow-200 mt-1">{expense.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
