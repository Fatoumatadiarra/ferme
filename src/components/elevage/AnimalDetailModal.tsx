import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Target, Activity, Stethoscope, Syringe, HeartPulse, ShieldAlert, Baby, Wheat, Banknote, ShieldCheck, Info } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { QRCodeSVG } from 'qrcode.react'
import type { ElevageData } from '@/data/elevage-init'
import { getElevageImage } from '@/data/elevage-init'

interface AnimalDetailModalProps {
  animal: ElevageData | null
  isOpen: boolean
  onClose: () => void
}

export function AnimalDetailModal({ animal, isOpen, onClose }: AnimalDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'zootechnie' | 'sante' | 'stats'>('general')

  if (!animal) return null

  const animalImage = getElevageImage(animal.espece, animal.images[0])

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
                src={animalImage}
                alt={`Troupeau de ${animal.espece} : ${animal.nomTroupeau}`}
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
                      {animal.espece}
                    </span>
                    <span className={`px-3 py-1 text-xs font-semibold text-white backdrop-blur-md rounded-full ${animal.etatSante === 'Excellent' ? 'bg-green-500/80' : animal.etatSante === 'Bon' ? 'bg-blue-500/80' : 'bg-orange-500/80'}`}>
                      {animal.etatSante}
                    </span>
                    <span className="px-3 py-1 text-xs font-semibold text-white bg-black/40 backdrop-blur-md rounded-full">
                      {animal.effectif} têtes
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white">{animal.nomTroupeau}</h2>
                </div>
                
                <div className="hidden md:flex gap-2">
                  <img src={getElevageImage(animal.espece, animal.images[1] ?? animalImage)} alt={`Troupeau de ${animal.espece} : ${animal.nomTroupeau}`} className="w-16 h-16 rounded-lg object-cover border-2 border-white/20" />
                  <img src={getElevageImage(animal.espece, animal.images[2] ?? animalImage)} alt={`Troupeau de ${animal.espece} : ${animal.nomTroupeau}`} className="w-16 h-16 rounded-lg object-cover border-2 border-white/20" />
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-800 shrink-0 px-6 overflow-x-auto custom-scrollbar">
              {[
                { id: 'general', label: 'Généralités' },
                { id: 'zootechnie', label: 'Zootechnie & Repro' },
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
                      layoutId="activeTabElevage"
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
                        <Info className="w-5 h-5 text-agri-500" /> Présentation
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium mb-2">
                        {animal.presentation}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                        {animal.description}
                      </p>
                      
                      <div className="mt-6 space-y-4">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Origine</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{animal.origine}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-100 dark:border-gray-800">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                        <Target className="w-5 h-5 text-blue-500" /> Habitat & Races
                      </h3>
                      <div className="mb-4">
                        <span className="text-gray-500 dark:text-gray-400 text-sm block mb-1">Habitat Principal</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{animal.habitat}</span>
                      </div>
                      
                      <div>
                        <span className="text-gray-500 dark:text-gray-400 text-sm block mb-2">Races du troupeau</span>
                        <div className="flex flex-wrap gap-2">
                          {animal.races.map((r, i) => (
                            <span key={i} className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-lg text-sm font-medium shadow-sm">
                              {r}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB: ZOOTECHNIE */}
              {activeTab === 'zootechnie' && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-agri-500" /> Cycle de Vie & Timeline
                    </h3>
                    <div className="relative border-l-2 border-agri-200 dark:border-agri-900/30 ml-3 md:ml-4 space-y-6">
                      {animal.timeline.map((step, i) => (
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
                        <Wheat className="w-5 h-5" /> Alimentation
                      </h3>
                      <ul className="space-y-2">
                        {animal.zootechnie.alimentation.map((alim, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-300">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                            {alim}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/10 p-5 rounded-xl border border-purple-100 dark:border-purple-900/20">
                      <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 flex items-center gap-2 mb-4">
                        <Baby className="w-5 h-5" /> Reproduction
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center pb-2 border-b border-purple-100/50 dark:border-purple-900/30">
                          <span className="text-purple-700/70 dark:text-purple-300/70 text-sm">Gestation</span>
                          <span className="text-sm font-medium text-purple-900 dark:text-purple-100">{animal.zootechnie.reproduction.gestation}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-purple-100/50 dark:border-purple-900/30">
                          <span className="text-purple-700/70 dark:text-purple-300/70 text-sm">Période</span>
                          <span className="text-sm font-medium text-purple-900 dark:text-purple-100 text-right max-w-[60%]">{animal.zootechnie.reproduction.periode}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-purple-700/70 dark:text-purple-300/70 text-sm">Taux de réussite</span>
                          <span className="text-sm font-bold text-purple-900 dark:text-purple-100">{animal.zootechnie.reproduction.tauxMiseBas}</span>
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
                          <ShieldAlert className="w-5 h-5" /> Maladies courantes
                        </h3>
                        <ul className="list-disc list-inside text-sm text-red-700 dark:text-red-300 space-y-1">
                          {animal.sante.maladies.map((m, i) => <li key={i}>{m}</li>)}
                        </ul>
                      </div>
                      
                      <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/20">
                        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2 mb-3">
                          <Stethoscope className="w-5 h-5" /> Traitements
                        </h3>
                        <ul className="list-disc list-inside text-sm text-blue-700 dark:text-blue-300 space-y-1">
                          {animal.sante.traitements.map((t, i) => <li key={i}>{t}</li>)}
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-green-50 dark:bg-green-900/10 p-5 rounded-xl border border-green-100 dark:border-green-900/20">
                        <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 flex items-center gap-2 mb-3">
                          <Syringe className="w-5 h-5" /> Protocole Vaccinal
                        </h3>
                        <ul className="list-disc list-inside text-sm text-green-700 dark:text-green-300 space-y-1 mb-4">
                          {animal.sante.vaccination.map((v, i) => <li key={i}>{v}</li>)}
                        </ul>
                        <div className="pt-3 border-t border-green-200 dark:border-green-800/50">
                          <p className="text-xs text-green-600/80 dark:text-green-400/80 mb-1 uppercase tracking-wider">Calendrier Sanitaire</p>
                          <p className="text-sm text-green-800 dark:text-green-200">{animal.sante.calendrierSanitaire}</p>
                        </div>
                      </div>

                      <div className="p-5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
                          <HeartPulse className="w-5 h-5 text-pink-500" /> Conseil du Vétérinaire
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                          "{animal.sante.conseilsVeterinaires}"
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
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Production</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{animal.economie.production}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Type</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{animal.economie.typeProduction}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Coût entretien</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{animal.economie.coutEntretien}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Rentabilité</p>
                      <p className="text-lg font-bold text-agri-600 dark:text-agri-400">{animal.economie.rentabilite}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-8 items-start">
                    <div className="md:col-span-2 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                        <Banknote className="w-5 h-5 text-agri-500" /> Évolution de la Production & Revenus
                      </h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={animal.economie.donneesGraphique}>
                            <defs>
                              <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                            <XAxis dataKey="mois" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                            <Tooltip
                              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                              itemStyle={{ color: '#111827', fontWeight: 600 }}
                            />
                            <Area type="monotone" dataKey="production" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorProd)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center text-center">
                        <div className="bg-white p-3 rounded-xl shadow-sm mb-4 inline-block">
                          <QRCodeSVG 
                            value={JSON.stringify({
                              id: animal.id,
                              troupeau: animal.nomTroupeau,
                              espece: animal.espece,
                              sante: animal.etatSante
                            })} 
                            size={120} 
                          />
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Traçabilité du Troupeau</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          Scannez ce QR Code pour accéder au registre de santé et l'historique des naissances.
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-agri-50 dark:bg-agri-900/20 border border-agri-100 dark:border-agri-900/30">
                        <h4 className="font-semibold text-agri-900 dark:text-agri-100 flex items-center gap-2 mb-2">
                          <ShieldCheck className="w-4 h-4" /> Valorisation
                        </h4>
                        <p className="text-sm text-agri-800 dark:text-agri-300">
                          {animal.economie.valorisationDejections}
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
