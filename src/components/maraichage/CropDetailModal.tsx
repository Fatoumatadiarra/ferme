import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Tag, Target, Droplets, Thermometer, ShieldAlert, Bug, Syringe, Sprout, TrendingUp, ShieldCheck, Info } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { QRCodeSVG } from 'qrcode.react'
import type { CropData } from '@/data/maraichage-init'
import { getMaraichageImage } from '@/data/maraichage-init'

interface CropDetailModalProps {
  crop: CropData | null
  isOpen: boolean
  onClose: () => void
}

export function CropDetailModal({ crop, isOpen, onClose }: CropDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'culture' | 'stats'>('general')

  if (!crop) return null

  const cropImage = getMaraichageImage(crop.nom, crop.images[0])

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
                src={cropImage}
                alt={`Culture de ${crop.nom}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white backdrop-blur-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white bg-agri-500 rounded-full">
                      {crop.type}
                    </span>
                    <span className="px-3 py-1 text-xs font-semibold text-white bg-black/40 backdrop-blur-md rounded-full">
                      {crop.etat}
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white">{crop.nom}</h2>
                </div>
                
                <div className="hidden md:flex gap-2">
                  <img src={cropImage} alt={`Culture de ${crop.nom}`} className="w-16 h-16 rounded-lg object-cover border-2 border-white/20 opacity-80" />
                  <img src={cropImage} alt={`Culture de ${crop.nom}`} className="w-16 h-16 rounded-lg object-cover border-2 border-white/20 opacity-60" />
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-800 shrink-0 px-6">
              {[
                { id: 'general', label: 'Généralités' },
                { id: 'culture', label: 'Pratiques & Timeline' },
                { id: 'stats', label: 'Statistiques & Traçabilité' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-4 text-sm font-medium transition-colors relative ${
                    activeTab === tab.id
                      ? 'text-agri-600 dark:text-agri-400'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
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
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {crop.presentation}
                      </p>
                      
                      <div className="mt-6 space-y-4">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Origine</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{crop.origine}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Target className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Importance Économique</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{crop.importanceEconomique}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                        <Thermometer className="w-5 h-5 text-orange-500" /> Conditions Climatiques
                      </h3>
                      <ul className="space-y-3">
                        <li className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                          <span className="text-gray-500 dark:text-gray-400 text-sm">Sol</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white text-right max-w-[60%]">{crop.climat.sol}</span>
                        </li>
                        <li className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                          <span className="text-gray-500 dark:text-gray-400 text-sm">Température</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{crop.climat.temperature}</span>
                        </li>
                        <li className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                          <span className="text-gray-500 dark:text-gray-400 text-sm">Humidité</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{crop.climat.humidite}</span>
                        </li>
                        <li className="flex justify-between items-center py-2">
                          <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1">
                            <Droplets className="w-3.5 h-3.5" /> Eau
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white text-right max-w-[60%]">{crop.climat.besoinsEau}</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                      <Tag className="w-5 h-5 text-agri-500" /> Variétés Cultivées
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {crop.varietes.map((v, i) => (
                        <span key={i} className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium">
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB: CULTURE */}
              {activeTab === 'culture' && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Timeline de Croissance</h3>
                    <div className="relative border-l-2 border-agri-200 dark:border-agri-900/30 ml-3 md:ml-4 space-y-6">
                      {crop.timeline.map((step, i) => (
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
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Santé & Protection</h3>
                      
                      <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/20">
                        <div className="flex items-center gap-2 mb-2 text-red-700 dark:text-red-400 font-medium">
                          <ShieldAlert className="w-5 h-5" /> Maladies courantes
                        </div>
                        <ul className="list-disc list-inside text-sm text-red-600 dark:text-red-300 space-y-1 ml-1">
                          {crop.pratiques.maladies.map((m, i) => <li key={i}>{m}</li>)}
                        </ul>
                      </div>

                      <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-100 dark:border-amber-900/20">
                        <div className="flex items-center gap-2 mb-2 text-amber-700 dark:text-amber-400 font-medium">
                          <Bug className="w-5 h-5" /> Ravageurs
                        </div>
                        <ul className="list-disc list-inside text-sm text-amber-600 dark:text-amber-300 space-y-1 ml-1">
                          {crop.pratiques.ravageurs.map((m, i) => <li key={i}>{m}</li>)}
                        </ul>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/20">
                        <div className="flex items-center gap-2 mb-2 text-blue-700 dark:text-blue-400 font-medium">
                          <Syringe className="w-5 h-5" /> Traitements & Lutte
                        </div>
                        <ul className="list-disc list-inside text-sm text-blue-600 dark:text-blue-300 space-y-1 ml-1">
                          {crop.pratiques.traitements.map((m, i) => <li key={i}>{m}</li>)}
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Nutrition & Pratiques</h3>
                      
                      <div className="bg-green-50 dark:bg-agri-900/10 p-4 rounded-xl border border-green-100 dark:border-agri-900/20">
                        <div className="flex items-center gap-2 mb-2 text-agri-700 dark:text-agri-400 font-medium">
                          <Sprout className="w-5 h-5" /> Engrais recommandés
                        </div>
                        <ul className="list-disc list-inside text-sm text-agri-600 dark:text-agri-300 space-y-1 ml-1">
                          {crop.pratiques.engrais.map((m, i) => <li key={i}>{m}</li>)}
                        </ul>
                      </div>

                      <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <strong className="block text-gray-900 dark:text-white mb-1">Irrigation:</strong>
                          {crop.pratiques.irrigation}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                        <div className="flex items-center gap-2 mb-2 text-gray-900 dark:text-white font-medium">
                          <ShieldCheck className="w-5 h-5 text-agri-500" /> Conseils de l'Expert
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {crop.pratiques.conseils}
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
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Surface</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{crop.surface}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Rendement</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{crop.statistiques.rendementAttendu}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Durée Cycle</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{crop.statistiques.dureeProduction}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Rentabilité</p>
                      <p className="text-xl font-bold text-agri-600 dark:text-agri-400">{crop.statistiques.rentabilite}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-8 items-start">
                    <div className="md:col-span-2 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                        <TrendingUp className="w-5 h-5 text-agri-500" /> Évolution du Rendement (Tonnes)
                      </h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={crop.statistiques.donneesGraphique}>
                            <defs>
                              <linearGradient id="colorRendement" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                            <XAxis dataKey="mois" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                            <Tooltip
                              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                              itemStyle={{ color: '#111827', fontWeight: 600 }}
                            />
                            <Area type="monotone" dataKey="rendement" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorRendement)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center text-center">
                        <div className="bg-white p-3 rounded-xl shadow-sm mb-4 inline-block">
                          <QRCodeSVG 
                            value={JSON.stringify({
                              id: crop.id,
                              nom: crop.nom,
                              date: crop.datePlantation,
                              origine: 'Ferme AgriTech Inc.'
                            })} 
                            size={120} 
                          />
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Traçabilité</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          Scannez ce QR Code pour accéder à l'historique de traitement et au passeport phytosanitaire.
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-agri-50 dark:bg-agri-900/20 border border-agri-100 dark:border-agri-900/30">
                        <h4 className="font-semibold text-agri-900 dark:text-agri-100 mb-2">Valorisation des déchets</h4>
                        <p className="text-sm text-agri-800 dark:text-agri-300">
                          {crop.valorisationDechets}
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
