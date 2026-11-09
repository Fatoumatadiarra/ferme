import { useRef } from 'react'
import { X, CheckCircle2, Clock, XCircle, Receipt, Download, Printer } from 'lucide-react'
import type { SaleRecord } from '@/data/sales-init'
import { AnimatePresence, motion } from 'framer-motion'
import { cn, formatCurrency, formatDate } from '@/utils'

interface SaleDetailModalProps {
  sale: SaleRecord | null
  isOpen: boolean
  onClose: () => void
}

const STATUT_CONFIG = {
  'Payée': { color: 'bg-green-100 text-green-700', icon: <CheckCircle2 className="w-4 h-4" /> },
  'En attente': { color: 'bg-orange-100 text-orange-700', icon: <Clock className="w-4 h-4" /> },
  'Annulée': { color: 'bg-red-100 text-red-700', icon: <XCircle className="w-4 h-4" /> }
}

export function SaleDetailModal({ sale, isOpen, onClose }: SaleDetailModalProps) {
  const invoiceRef = useRef<HTMLDivElement>(null)

  if (!sale) return null

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = async () => {
    if (invoiceRef.current) {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ])
      const canvas = await html2canvas(invoiceRef.current)
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save(`Facture_${sale.numeroFacture}.pdf`)
    }
  }

  const config = STATUT_CONFIG[sale.statut]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm print:hidden" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-gray-900 print:relative print:translate-x-0 print:translate-y-0 print:top-0 print:left-0 print:w-full print:h-auto print:shadow-none print:max-w-none print:overflow-visible print:bg-white print:text-black">
            
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800 print:hidden">
              <h2 className="text-xl font-bold flex items-center gap-2 dark:text-white"><Receipt className="w-5 h-5 text-agri-600" /> Détails de la vente</h2>
              <div className="flex gap-2">
                <button onClick={handleDownloadPDF} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 transition-colors" title="Télécharger PDF"><Download className="w-5 h-5" /></button>
                <button onClick={handlePrint} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 transition-colors" title="Imprimer"><Printer className="w-5 h-5" /></button>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 transition-colors"><X className="w-5 h-5" /></button>
              </div>
            </div>

            {/* Facture à imprimer / télécharger */}
            <div ref={invoiceRef} className="p-8 bg-white dark:bg-gray-900 print:p-0">
              
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="text-3xl font-black text-agri-600 dark:text-agri-500 print:text-agri-600">FERME AGRICOLE</h1>
                  <p className="text-sm text-gray-500 mt-1">Route Nationale, KM 15</p>
                  <p className="text-sm text-gray-500">contact@ferme-agricole.sn</p>
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white print:text-black">FACTURE</h2>
                  <p className="text-sm font-medium text-gray-500 mt-1">N° {sale.numeroFacture}</p>
                  <p className="text-sm text-gray-500">Date : {formatDate(sale.dateVente)}</p>
                  <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold mt-2", config.color)}>
                    {config.icon} {sale.statut}
                  </div>
                </div>
              </div>

              <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl print:bg-transparent print:border print:border-gray-200">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-semibold">Facturé à :</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white print:text-black">{sale.client}</p>
                {sale.telephoneClient && <p className="text-sm text-gray-600 dark:text-gray-400 print:text-gray-600">{sale.telephoneClient}</p>}
              </div>

              <table className="w-full mb-8 text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                    <th className="py-3 px-2 font-semibold text-gray-900 dark:text-gray-200 print:text-black">Désignation</th>
                    <th className="py-3 px-2 font-semibold text-gray-900 dark:text-gray-200 print:text-black text-center">Quantité</th>
                    <th className="py-3 px-2 font-semibold text-gray-900 dark:text-gray-200 print:text-black text-right">Prix Unitaire</th>
                    <th className="py-3 px-2 font-semibold text-gray-900 dark:text-gray-200 print:text-black text-right">Montant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  <tr>
                    <td className="py-4 px-2 text-gray-800 dark:text-gray-300 print:text-black">{sale.produit}</td>
                    <td className="py-4 px-2 text-center text-gray-800 dark:text-gray-300 print:text-black">{sale.quantite}</td>
                    <td className="py-4 px-2 text-right text-gray-800 dark:text-gray-300 print:text-black">{formatCurrency(sale.prixUnitaire)}</td>
                    <td className="py-4 px-2 text-right font-medium text-gray-900 dark:text-white print:text-black">{formatCurrency(sale.montantTotal)}</td>
                  </tr>
                </tbody>
              </table>

              <div className="flex justify-end mb-8">
                <div className="w-64 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Sous-total</span>
                    <span className="text-gray-900 dark:text-white print:text-black font-medium">{formatCurrency(sale.montantTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">TVA (0%)</span>
                    <span className="text-gray-900 dark:text-white print:text-black font-medium">0 FCFA</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-3">
                    <span className="text-base font-bold text-gray-900 dark:text-white print:text-black">TOTAL TTC</span>
                    <span className="text-lg font-black text-agri-600 dark:text-agri-500 print:text-agri-600">{formatCurrency(sale.montantTotal)}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                <div className="grid grid-cols-2 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Méthode de paiement :</p>
                    <p className="font-semibold text-gray-900 dark:text-white print:text-black">{sale.methodePaiement}</p>
                  </div>
                  {sale.notes && (
                    <div>
                      <p className="text-gray-500 mb-1">Notes :</p>
                      <p className="text-gray-700 dark:text-gray-300 print:text-gray-800">{sale.notes}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <p className="text-center text-xs text-gray-400 mt-12 print:mt-24">Merci pour votre confiance.</p>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
