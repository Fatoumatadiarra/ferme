import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Wrench, Clock, Settings, FileText, QrCode, TrendingDown, Tag, User, MapPin, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react'
import QRCode from 'react-qr-code'
import { Card, CardContent } from '@/components/ui'
import type { MaterialRecord } from '@/types/material'
import { getMaterialImage } from '@/data/materials-init'
import { cn, formatCurrency, formatDate } from '@/utils'

interface MaterialDetailModalProps {
  material: MaterialRecord | null
  isOpen: boolean
  onClose: () => void
}

export function MaterialDetailModal({ material, isOpen, onClose }: MaterialDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!material) return null

  const localImage = getMaterialImage(material.categorie, material.nom)
  const materialImages = localImage ? [localImage] : material.images
  const activeImageIndex = currentImageIndex < materialImages.length ? currentImageIndex : 0

  // Handle reset index when modal opens with new material
  if (isOpen && materialImages.length > 0 && currentImageIndex >= materialImages.length) {
    setCurrentImageIndex(0)
  }

  const STATUS_COLORS = {
    'operationnel': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'maintenance': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    'hors_service': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  }

  const STATUS_LABELS = {
    'operationnel': 'Opérationnel',
    'maintenance': 'En Maintenance',
    'hors_service': 'Hors Service'
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % materialImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + materialImages.length) % materialImages.length)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-5xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            
            {/* --- HEADER --- */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-agri-100 dark:bg-agri-900/30 flex items-center justify-center text-agri-600 dark:text-agri-400">
                  <Settings className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    {material.nom}
                    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-bold", STATUS_COLORS[material.etat])}>
                      {STATUS_LABELS[material.etat]}
                    </span>
                  </h2>
                  <p className="text-sm text-gray-500">N° Série: {material.numeroSerie} • Marque: {material.marque} • Modèle: {material.modele}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* --- BODY --- */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid lg:grid-cols-3 gap-8">
                
                <div className="lg:col-span-2 space-y-8">
                  {/* Galerie Interactive */}
                  <div>
                    {materialImages.length > 0 ? (
                      <div className="space-y-3">
                        <div className="relative group rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 h-[350px]">
                          <img src={materialImages[activeImageIndex]} alt={`${material.nom} agricole`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          <div className="absolute top-4 right-4 bg-black/60 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md">
                            {activeImageIndex + 1} / {materialImages.length}
                          </div>
                          {materialImages.length > 1 && (
                            <>
                              <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black text-gray-800 dark:text-white rounded-full flex items-center justify-center backdrop-blur-md shadow-lg transition-all opacity-0 group-hover:opacity-100">
                                <ChevronLeft className="w-6 h-6" />
                              </button>
                              <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black text-gray-800 dark:text-white rounded-full flex items-center justify-center backdrop-blur-md shadow-lg transition-all opacity-0 group-hover:opacity-100">
                                <ChevronRight className="w-6 h-6" />
                              </button>
                            </>
                          )}
                        </div>
                        {materialImages.length > 1 && (
                          <div className="flex gap-3">
                            {materialImages.map((img, i) => (
                              <button key={i} onClick={() => setCurrentImageIndex(i)} className={cn("relative w-24 h-16 rounded-lg overflow-hidden border-2 transition-all", currentImageIndex === i ? "border-agri-500 shadow-md scale-105" : "border-transparent opacity-70 hover:opacity-100")}>
                                <img src={img} alt={`${material.nom} - miniature ${i + 1}`} className="w-full h-full object-cover" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-[350px] bg-gray-100 dark:bg-gray-800 rounded-2xl flex flex-col items-center justify-center text-gray-400">
                        <Settings className="w-12 h-12 mb-2 opacity-50" />
                        <p>Aucune image disponible</p>
                      </div>
                    )}
                  </div>

                  {/* Description & Specs & Utilisation */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><FileText className="w-5 h-5 text-agri-500" /> Fiche Technique</h3>
                    <div className="space-y-6">
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Description</p>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">{material.description}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Utilisation Agricole</p>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">{material.utilisation}</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-100 dark:border-gray-800">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Caractéristiques Principales</p>
                        <ul className="grid sm:grid-cols-2 gap-y-3 gap-x-6">
                          {material.caracteristiques.map((c, i) => {
                            const parts = c.split(':')
                            return (
                              <li key={i} className="text-sm flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-agri-500 mt-1.5 shrink-0" />
                                {parts.length > 1 ? (
                                  <span className="text-gray-600 dark:text-gray-300">
                                    <strong className="text-gray-900 dark:text-white">{parts[0]} :</strong> {parts.slice(1).join(':')}
                                  </span>
                                ) : (
                                  <span className="text-gray-600 dark:text-gray-300">{c}</span>
                                )}
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Historique & Maintenance */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Wrench className="w-5 h-5 text-orange-500" /> Interventions</h3>
                      <div className="space-y-4">
                        {material.maintenances.length > 0 ? material.maintenances.map(m => (
                          <div key={m.id} className="p-4 border border-gray-100 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 shadow-sm">
                            <p className="font-semibold text-sm text-gray-900 dark:text-white">{m.type}</p>
                            <p className="text-xs text-gray-500 mb-2">{formatDate(m.date)} • {m.technicien}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{m.description}</p>
                            <div className="mt-3 pt-3 border-t border-gray-50 dark:border-gray-800">
                              <p className="text-xs font-bold text-orange-600 dark:text-orange-400">Coût: {formatCurrency(m.cout)}</p>
                            </div>
                          </div>
                        )) : <p className="text-sm text-gray-500">Aucune maintenance enregistrée.</p>}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-blue-500" /> Historique</h3>
                      <div className="space-y-0">
                        {material.historique.length > 0 ? material.historique.map((h) => (
                          <div key={h.id} className="relative pl-6 pb-6 border-l-2 border-blue-200 dark:border-blue-900/50 last:border-0 last:pb-0">
                            <div className="absolute left-[-5px] top-1 w-2 h-2 rounded-full bg-blue-500" />
                            <p className="font-semibold text-sm text-gray-900 dark:text-white">{h.action}</p>
                            <p className="text-xs text-gray-500 mb-1">{formatDate(h.date)} • {h.responsable}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{h.description}</p>
                          </div>
                        )) : <p className="text-sm text-gray-500">Aucun historique.</p>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Financials & Status */}
                  <Card className="bg-gray-50 dark:bg-gray-800/50 border-none shadow-none">
                    <CardContent className="p-5 space-y-5">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Valeur Actuelle</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(material.valeurActuelle)}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <TrendingDown className="w-4 h-4 text-red-500" /> Acquis à {formatCurrency(material.coutAcquisition)}
                      </div>
                      <div className="pt-5 border-t border-gray-200 dark:border-gray-700 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-medium text-gray-500">Date d'achat</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">{formatDate(material.dateAcquisition)}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500">Heures d'utilisation</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">{material.heuresUtilisation} h</p>
                        </div>
                      </div>
                      {material.prochaineMaintenance && (
                        <div className="pt-5 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-xs font-medium text-gray-500 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Prochaine maintenance</p>
                          <p className="text-sm font-semibold text-orange-600 dark:text-orange-400 mt-1">{formatDate(material.prochaineMaintenance)}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* QR Code */}
                  <Card className="border-agri-100 dark:border-gray-800 bg-white dark:bg-gray-900">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 mb-4">
                        <QRCode value={`{"id":"${material.id}","nom":"${material.nom}","sn":"${material.numeroSerie}"}`} size={140} />
                      </div>
                      <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2"><QrCode className="w-5 h-5" /> Code d'Inventaire</h4>
                      <p className="text-xs text-gray-500 mt-2 leading-relaxed">Scannez ce QR Code avec l'application mobile pour accéder instantanément à cette fiche.</p>
                    </CardContent>
                  </Card>

                  {/* Logistics */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                      <Tag className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Catégorie</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{material.categorie}</p>
                      </div>
                    </div>
                    {material.garantie && (
                      <div className="flex items-center gap-3 p-3.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <ShieldCheck className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="text-xs text-gray-500">Garantie</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{material.garantie}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3 p-3.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                      <User className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-xs text-gray-500">Responsable</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{material.responsable}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                      <MapPin className="w-5 h-5 text-orange-500" />
                      <div>
                        <p className="text-xs text-gray-500">Localisation</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{material.localisation}</p>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}