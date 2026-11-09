import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ThermometerSun, Home, Activity, Stethoscope, Syringe, HeartPulse, ShieldAlert, Egg, Wheat, Banknote, Info } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { QRCodeSVG } from 'qrcode.react'
import type { AvicultureData } from '@/data/aviculture-init'
import { getAvicultureImage } from '@/data/aviculture-init'

interface PoultryDetailModalProps {
  poultry: AvicultureData | null
  isOpen: boolean
  onClose: () => void
}

export function PoultryDetailModal({ poultry, isOpen, onClose }: PoultryDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'production' | 'sante' | 'stats'>('general')

  if (!poultry) return null

  const poultryImage = getAvicultureImage(poultry.typeOiseau, poultry.images[0])

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
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-5xl -translate-x-1/2 -translate-y-1/2 max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-surface-card-dark flex flex-col"
          >
            {/* Header & Hero Image */}
            <div className="relative h-48 md:h-64 shrink-0 w-full bg-gray-100 dark:bg-gray-800">
              <img
                src={poultryImage}
                alt={`${poultry.typeOiseau} : ${poultry.nomLot}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white backdrop-blur-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white bg-agri-600 rounded-full">
                      {poultry.typeOiseau}
                    </span>
                    <span className={`px-3 py-1 text-xs font-semibold text-white backdrop-blur-md rounded-full ${poultry.etatSante === 'Excellent' ? 'bg-green-500/80' : poultry.etatSante === 'Bon' ? 'bg-blue-500/80' : 'bg-orange-500/80'}`}>
                      {poultry.etatSante}
                    </span>
                    <span className="px-3 py-1 text-xs font-semibold text-white bg-black/40 backdrop-blur-md rounded-full">
                      {poultry.effectif} sujets
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white">{poultry.nomLot}</h2>
                </div>
                
                <div className="hidden md:flex gap-2">
                  <img src={getAvicultureImage(poultry.typeOiseau, poultry.images[1] ?? poultryImage)} alt={`${poultry.typeOiseau} : ${poultry.nomLot}`} className="w-16 h-16 rounded-lg object-cover border-2 border-white/20" />
                  <img src={getAvicultureImage(poultry.typeOiseau, poultry.images[2] ?? poultryImage)} alt={`${poultry.typeOiseau} : ${poultry.nomLot}`} className="w-16 h-16 rounded-lg object-cover border-2 border-white/20" />
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-800 shrink-0 px-6 overflow-x-auto custom-scrollbar">
              {[
                { id: 'general', label: 'Généralités & Habitat' },
                { id: 'production', label: 'Cycle & Alimentation' },
                { id: 'sante', label: 'Santé & Suivi' },
                { id: 'stats', label: 'Statistiques & Éco' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-4 text-sm font-medium transition-colors relative whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-agri-600 dark:text-agri-400'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTabPoultry"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-agri-600 dark:bg-agri-400"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Content Scrollable Area */}
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              
              {/* TAB: GENERAL */}
              {activeTab === 'general' && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                        <Info className="w-5 h-5 text-agri-500" /> Présentation du lot
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium mb-2">
                        {poultry.presentation}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                        {poultry.description}
                      </p>
                      
                      <div className="mt-6">
                        <span className="text-gray-500 dark:text-gray-400 text-sm block mb-2">Race utilisée</span>
                        <span className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-lg text-sm font-medium shadow-sm inline-block">
                          {poultry.race}
                        </span>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-100 dark:border-gray-800 space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                          <Home className="w-5 h-5 text-blue-500" /> Environnement & Habitat
                        </h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {poultry.habitat}
                        </p>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
                          <ThermometerSun className="w-4 h-4 text-orange-500" /> Température idéale
                        </h3>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {poultry.temperatureIdeale}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB: PRODUCTION */}
              {activeTab === 'production' && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-agri-500" /> Cycle d'Élevage
                    </h3>
                    <div className="mb-4">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Durée totale du cycle : </span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{poultry.cycle.dureeElevage}</span>
                    </div>
                    
                    <div className="relative border-l-2 border-agri-200 dark:border-agri-900/30 ml-3 md:ml-4 space-y-6">
                      {poultry.timeline.map((step, i) => (
                        <div key={i} className="relative pl-6">
                          <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-white border-2 border-agri-500 dark:bg-gray-900" />
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mb-1">
                            <span className="font-bold text-gray-900 dark:text-white text-base">{step.phase}</span>
                            <span className="text-xs font-semibold px-2 py-1 bg-agri-50 dark:bg-agri-900/30 text-agri-600 dark:text-agri-400 rounded-md inline-block w-max">
                              {step.duration}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-amber-50 dark:bg-amber-900/10 p-5 rounded-xl border border-amber-100 dark:border-amber-900/20">
                      <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100 flex items-center gap-2 mb-4">
                        <Wheat className="w-5 h-5" /> Programme d'Alimentation
                      </h3>
                      <ul className="space-y-2">
                        {poultry.cycle.alimentation.map((alim, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-300">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                            {alim}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/10 p-5 rounded-xl border border-purple-100 dark:border-purple-900/20">
                      <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 flex items-center gap-2 mb-4">
                        <Egg className="w-5 h-5" /> Rendement & Production
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center pb-2 border-b border-purple-100/50 dark:border-purple-900/30">
                          <span className="text-purple-700/70 dark:text-purple-300/70 text-sm">Filière</span>
                          <span className="text-sm font-medium text-purple-900 dark:text-purple-100">{poultry.production.type}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-purple-700/70 dark:text-purple-300/70 text-sm">Rendement attendu</span>
                          <span className="text-sm font-bold text-purple-900 dark:text-purple-100 text-right max-w-[60%]">{poultry.production.rendement}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB: SANTE */}
              {activeTab === 'sante' && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div className="bg-red-50 dark:bg-red-900/10 p-5 rounded-xl border border-red-100 dark:border-red-900/20">
                        <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 flex items-center gap-2 mb-3">
                          <ShieldAlert className="w-5 h-5" /> Pathologies surveillées
                        </h3>
                        <ul className="list-disc list-inside text-sm text-red-700 dark:text-red-300 space-y-1">
                          {poultry.sante.maladies.map((m, i) => <li key={i}>{m}</li>)}
                        </ul>
                      </div>
                      
                      <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/20">
                        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2 mb-3">
                          <Stethoscope className="w-5 h-5" /> Protocoles de traitement
                        </h3>
                        <ul className="list-disc list-inside text-sm text-blue-700 dark:text-blue-300 space-y-1">
                          {poultry.sante.traitements.map((t, i) => <li key={i}>{t}</li>)}
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-green-50 dark:bg-green-900/10 p-5 rounded-xl border border-green-100 dark:border-green-900/20">
                        <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 flex items-center gap-2 mb-3">
                          <Syringe className="w-5 h-5" /> Programme Vaccinal
                        </h3>
                        <ul className="list-disc list-inside text-sm text-green-700 dark:text-green-300 space-y-1 mb-4">
                          {poultry.sante.vaccination.map((v, i) => <li key={i}>{v}</li>)}
                        </ul>
                      </div>

                      <div className="p-5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
                          <HeartPulse className="w-5 h-5 text-pink-500" /> Conseils d'Élevage
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                          "{poultry.sante.conseilsTechniques}"
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB: STATS */}
              {activeTab === 'stats' && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Rendement</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{poultry.production.rendement}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Type</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{poultry.production.type}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Rentabilité</p>
                      <p className="text-lg font-bold text-agri-600 dark:text-agri-400">{poultry.production.rentabilite}</p>
                    </div>
                    <div className="p-4 bg-agri-50 dark:bg-agri-900/20 rounded-xl border border-agri-100 dark:border-agri-800">
                      <p className="text-xs text-agri-600 dark:text-agri-400 uppercase tracking-wider mb-1">Valorisation</p>
                      <p className="text-xs font-bold text-agri-900 dark:text-agri-100">{poultry.production.dechetsValorisables}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-8 items-start">
                    <div className="md:col-span-2 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                        <Banknote className="w-5 h-5 text-agri-500" /> Évolution de la Production & Revenus
                      </h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={poultry.production.donneesGraphique}>
                            <defs>
                              <linearGradient id="colorProdAv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                            <XAxis dataKey="mois" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                            <Tooltip
                              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                              itemStyle={{ color: '#111827', fontWeight: 600 }}
                            />
                            <Area type="monotone" dataKey="revenus" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorProdAv)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center text-center">
                        <div className="bg-white p-3 rounded-xl shadow-sm mb-4 inline-block">
                          <QRCodeSVG 
                            value={JSON.stringify({
                              id: poultry.id,
                              lot: poultry.nomLot,
                              espece: poultry.typeOiseau,
                              arrivee: poultry.dateArrivee
                            })} 
                            size={120} 
                          />
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Traçabilité du Lot</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          Scannez ce QR Code pour la traçabilité sanitaire du lot d'oiseaux.
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
