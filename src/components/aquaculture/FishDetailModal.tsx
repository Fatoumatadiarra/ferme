import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Droplets,
  Thermometer,
  FlaskConical,
  Activity,
  Stethoscope,
  ShieldAlert,
  HeartPulse,
  Wheat,
  Banknote,
  ShieldCheck,
  Info,
  Waves,
  RefreshCw,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { QRCodeSVG } from 'qrcode.react'
import type { AquacultureData } from '@/data/aquaculture-init'
import { getAquacultureImage } from '@/data/aquaculture-init'

interface FishDetailModalProps {
  fish: AquacultureData | null
  isOpen: boolean
  onClose: () => void
}

export function FishDetailModal({ fish, isOpen, onClose }: FishDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'elevage' | 'sante' | 'stats'>('general')

  if (!fish) return null

  const fishImage = getAquacultureImage(fish.nomEspece, fish.images[0])

  const tabs = [
    { id: 'general', label: 'Généralités & Eau' },
    { id: 'elevage', label: 'Élevage & Cycle' },
    { id: 'sante', label: 'Santé & Suivi' },
    { id: 'stats', label: 'Statistiques & Éco' },
  ]

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
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-5xl -translate-x-1/2 -translate-y-1/2 max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900 flex flex-col"
          >
            {/* Hero */}
            <div className="relative h-48 md:h-64 shrink-0 w-full bg-blue-100 dark:bg-blue-950">
              <img
                src={fishImage}
                alt={`Poisson ${fish.nomEspece}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white backdrop-blur-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white bg-blue-600 rounded-full">
                      {fish.nomEspece}
                    </span>
                    <span className="px-3 py-1 text-xs font-semibold text-white bg-black/40 backdrop-blur-md rounded-full italic">
                      {fish.race}
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white">{fish.nomEspece}</h2>
                  <p className="text-blue-200 text-sm mt-1">{fish.presentation.slice(0, 80)}…</p>
                </div>
                <div className="hidden md:flex gap-2">
                  <img src={getAquacultureImage(fish.nomEspece, fish.images[1] ?? fishImage)} alt={`Poisson ${fish.nomEspece}`} className="w-16 h-16 rounded-lg object-cover border-2 border-white/20" />
                  <img src={getAquacultureImage(fish.nomEspece, fish.images[2] ?? fishImage)} alt={`Poisson ${fish.nomEspece}`} className="w-16 h-16 rounded-lg object-cover border-2 border-white/20" />
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-800 shrink-0 px-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-4 py-4 text-sm font-medium transition-colors relative whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTabFish"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1">

              {/* TAB: GENERAL */}
              {activeTab === 'general' && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                        <Info className="w-5 h-5 text-blue-500" /> Présentation
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium mb-2">{fish.presentation}</p>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">{fish.description}</p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                        <Waves className="w-5 h-5 text-blue-500" /> Qualité de l'eau requise
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
                          <div className="flex items-center gap-1 mb-1"><Thermometer className="w-4 h-4 text-orange-500" /><span className="text-xs text-gray-500 dark:text-gray-400">Température</span></div>
                          <p className="font-bold text-blue-900 dark:text-blue-100 text-sm">{fish.qualiteEau.temperatureMin}–{fish.qualiteEau.temperatureMax}°C</p>
                        </div>
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
                          <div className="flex items-center gap-1 mb-1"><FlaskConical className="w-4 h-4 text-green-500" /><span className="text-xs text-gray-500 dark:text-gray-400">pH</span></div>
                          <p className="font-bold text-blue-900 dark:text-blue-100 text-sm">{fish.qualiteEau.phMin} – {fish.qualiteEau.phMax}</p>
                        </div>
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
                          <div className="flex items-center gap-1 mb-1"><Droplets className="w-4 h-4 text-blue-500" /><span className="text-xs text-gray-500 dark:text-gray-400">O² dissous</span></div>
                          <p className="font-bold text-blue-900 dark:text-blue-100 text-sm">{fish.qualiteEau.oxygeneDissouxMgL}</p>
                        </div>
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
                          <div className="flex items-center gap-1 mb-1"><RefreshCw className="w-4 h-4 text-teal-500" /><span className="text-xs text-gray-500 dark:text-gray-400">Turbidité</span></div>
                          <p className="font-bold text-blue-900 dark:text-blue-100 text-xs">{fish.qualiteEau.turbidite}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB: ELEVAGE */}
              {activeTab === 'elevage' && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-blue-500" /> Timeline du Cycle d'Élevage
                    </h3>
                    <div className="relative border-l-2 border-blue-200 dark:border-blue-900/30 ml-4 space-y-6">
                      {fish.timeline.map((step, i) => (
                        <div key={i} className="relative pl-6">
                          <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-white border-2 border-blue-500 dark:bg-gray-900" />
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mb-1">
                            <span className="font-bold text-gray-900 dark:text-white text-base">{step.phase}</span>
                            <span className="text-xs font-semibold px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md inline-block w-max">
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
                      <ul className="space-y-2 mb-4">
                        {fish.alimentation.typeAliment.map((a, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-300">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                            {a}
                          </li>
                        ))}
                      </ul>
                      <div className="pt-3 border-t border-amber-200 dark:border-amber-800/30 space-y-1 text-xs text-amber-700 dark:text-amber-400">
                        <p><strong>Taux :</strong> {fish.alimentation.tauxDistribution}</p>
                        <p><strong>Fréquence :</strong> {fish.alimentation.frequenceRepas}</p>
                      </div>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/10 p-5 rounded-xl border border-purple-100 dark:border-purple-900/20">
                      <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 flex items-center gap-2 mb-4">
                        <RefreshCw className="w-5 h-5" /> Reproduction & Croissance
                      </h3>
                      <div className="space-y-2 text-sm">
                        {[
                          { label: 'Maturité', val: fish.reproduction.maturitesSexuelle },
                          { label: 'Ponte', val: fish.reproduction.periodePonte },
                          { label: 'Œufs / femelle', val: fish.reproduction.nombreOeufs },
                          { label: 'Durée élevage', val: fish.croissance.dureeCroissance },
                          { label: 'Poids abattage', val: fish.croissance.poidsAbattage },
                          { label: 'ICC', val: fish.croissance.icc },
                        ].map(({ label, val }) => (
                          <div key={label} className="flex justify-between items-center border-b border-purple-100/50 dark:border-purple-900/30 pb-1">
                            <span className="text-purple-700/70 dark:text-purple-300/70">{label}</span>
                            <span className="font-medium text-purple-900 dark:text-purple-100 text-right max-w-[55%]">{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB: SANTE */}
              {activeTab === 'sante' && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div className="bg-red-50 dark:bg-red-900/10 p-5 rounded-xl border border-red-100 dark:border-red-900/20">
                        <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 flex items-center gap-2 mb-3">
                          <ShieldAlert className="w-5 h-5" /> Pathologies courantes
                        </h3>
                        <ul className="list-disc list-inside text-sm text-red-700 dark:text-red-300 space-y-1">
                          {fish.sante.maladies.map((m, i) => <li key={i}>{m}</li>)}
                        </ul>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/20">
                        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2 mb-3">
                          <Stethoscope className="w-5 h-5" /> Protocoles de traitement
                        </h3>
                        <ul className="list-disc list-inside text-sm text-blue-700 dark:text-blue-300 space-y-1">
                          {fish.sante.traitements.map((t, i) => <li key={i}>{t}</li>)}
                        </ul>
                      </div>
                    </div>
                    <div>
                      <div className="p-5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 h-full">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                          <HeartPulse className="w-5 h-5 text-pink-500" /> Conseil Expert
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 italic leading-relaxed">
                          "{fish.sante.conseilsTechniques}"
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB: STATS */}
              {activeTab === 'stats' && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { label: 'Rendement', val: fish.production.rendementKgM2 },
                      { label: 'Rentabilité', val: fish.production.rentabilite, color: 'text-blue-600 dark:text-blue-400' },
                      { label: 'Produit', val: fish.production.typeProduit },
                    ].map(({ label, val, color }) => (
                      <div key={label} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                        <p className={`text-sm font-bold ${color ?? 'text-gray-900 dark:text-white'}`}>{val}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid md:grid-cols-3 gap-8 items-start">
                    <div className="md:col-span-2 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                        <Banknote className="w-5 h-5 text-blue-500" /> Évolution de la Production & Revenus
                      </h3>
                      <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={fish.production.donneesGraphique}>
                            <defs>
                              <linearGradient id="colorAqua" x1="0" y1="0" x2="0" y2="1">
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
                            <Area type="monotone" dataKey="revenus" name="Revenus (€)" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorAqua)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center text-center">
                        <div className="bg-white p-3 rounded-xl shadow-sm mb-4 inline-block">
                          <QRCodeSVG
                            value={JSON.stringify({ id: fish.id, espece: fish.nomEspece, race: fish.race })}
                            size={110}
                          />
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Traçabilité Poisson</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Scannez pour accéder au dossier de production.</p>
                      </div>
                      <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2 mb-2 text-sm">
                          <ShieldCheck className="w-4 h-4" /> Valorisation des déchets
                        </h4>
                        <p className="text-xs text-blue-700 dark:text-blue-300">{fish.production.valorisationDechets}</p>
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
