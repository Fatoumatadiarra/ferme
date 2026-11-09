import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Package, AlertTriangle, TrendingDown, TrendingUp, Calendar } from 'lucide-react'
import type { StockRecord } from '@/data/stocks-init'
import { cn, formatDate } from '@/utils'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

interface StockDetailModalProps {
  stock: StockRecord | null
  isOpen: boolean
  onClose: () => void
}

const STATUT_COLORS = {
  'En stock': 'bg-green-100 text-green-700',
  'Faible': 'bg-orange-100 text-orange-700',
  'Rupture': 'bg-red-100 text-red-700'
}

export function StockDetailModal({ stock, isOpen, onClose }: StockDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'mouvements'>('details')

  if (!stock) return null

  const totalEntrees = stock.mouvements.filter(m => m.type === 'entree').reduce((sum, m) => sum + m.quantite, 0)
  const totalSorties = stock.mouvements.filter(m => m.type === 'sortie').reduce((sum, m) => sum + m.quantite, 0)

  const pieData = [
    { name: 'Entrées', value: totalEntrees, color: '#22c55e' },
    { name: 'Sorties', value: totalSorties, color: '#f97316' }
  ].filter(d => d.value > 0)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed left-1/2 top-1/2 z-50 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900 flex flex-col">
            
            <div className="relative shrink-0 bg-linear-to-br from-indigo-600 to-indigo-800 p-6 md:p-8">
              <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex gap-2 items-center mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/30">{stock.categorie}</span>
                <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-bold bg-white', STATUT_COLORS[stock.statut].split(' ')[1])}>{stock.statut}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{stock.nom}</h2>
              <div className="flex items-center gap-4 text-indigo-100 text-sm">
                <span className="flex items-center gap-1.5"><Package className="w-4 h-4" /> {stock.quantite} {stock.unite}</span>
                <span className="flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" /> Seuil: {stock.seuilAlerte}</span>
              </div>
            </div>

            <div className="flex border-b border-gray-200 dark:border-gray-800 px-6 shrink-0">
              {['details', 'mouvements'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={cn(
                    "px-4 py-4 text-sm font-medium transition-colors relative capitalize",
                    activeTab === tab ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  )}
                >
                  {tab === 'mouvements' ? `Mouvements (${stock.mouvements.length})` : 'Détails du stock'}
                  {activeTab === tab && <motion.div layoutId="stockTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400" />}
                </button>
              ))}
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-gray-50 dark:bg-gray-900/50">
              {activeTab === 'details' && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                      <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">Informations Générales</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-gray-500">Fournisseur</p>
                          <p className="font-medium text-gray-900 dark:text-white">{stock.fournisseur}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Prix Unitaire Estimé</p>
                          <p className="font-medium text-gray-900 dark:text-white">{stock.prixUnitaire.toLocaleString()} FCFA</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Valeur Totale du Stock</p>
                          <p className="font-bold text-indigo-600 dark:text-indigo-400">{(stock.quantite * stock.prixUnitaire).toLocaleString()} FCFA</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Date d'ajout</p>
                          <p className="font-medium text-gray-900 dark:text-white">{formatDate(stock.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col">
                    <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">Analyse des flux</h3>
                    {pieData.length > 0 ? (
                      <div className="flex-1 min-h-50">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                              {pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">Aucun mouvement enregistré</div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'mouvements' && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
                  {stock.mouvements.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">Aucun mouvement historique pour ce stock.</div>
                  ) : (
                    stock.mouvements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((mvt) => (
                      <div key={mvt.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className={cn("p-2.5 rounded-xl", mvt.type === 'entree' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600')}>
                            {mvt.type === 'entree' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white capitalize">{mvt.type}</p>
                            <p className="text-xs text-gray-500">{mvt.motif} • {mvt.responsable}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={cn("font-bold", mvt.type === 'entree' ? 'text-green-600' : 'text-orange-600')}>
                            {mvt.type === 'entree' ? '+' : '-'}{mvt.quantite} {stock.unite}
                          </p>
                          <p className="text-xs text-gray-400 flex items-center justify-end gap-1"><Calendar className="w-3 h-3" /> {formatDate(mvt.date)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
