import { useEffect, useMemo, useState } from 'react'
import { TrendingUp, TrendingDown, DollarSign, Activity, PieChart as PieChartIcon, BarChart2 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle, SectionTitle } from '@/components/ui'
import { STORAGE_KEYS } from '@/constants'
import { StorageService } from '@/services'
import type { SaleRecord } from '@/data/sales-init'
import type { ExpenseRecord } from '@/data/expenses-init'
import { INITIAL_SALES_DATA } from '@/data/sales-init'
import { INITIAL_EXPENSES_DATA } from '@/data/expenses-init'
import { cn, formatCurrency } from '@/utils'

export default function StatisticsPage() {
  const [sales, setSales] = useState<SaleRecord[]>([])
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([])

  useEffect(() => {
    const storedSales = StorageService.get<SaleRecord[]>(STORAGE_KEYS.VENTES)
    const storedExpenses = StorageService.get<ExpenseRecord[]>(STORAGE_KEYS.DEPENSES)
    
    setSales(storedSales && storedSales.length > 0 ? storedSales : INITIAL_SALES_DATA)
    setExpenses(storedExpenses && storedExpenses.length > 0 ? storedExpenses : INITIAL_EXPENSES_DATA)
  }, [])

  const stats = useMemo(() => {
    const payeesSales = sales.filter(s => s.statut === 'Payée')
    const payeesExpenses = expenses.filter(e => e.statut === 'Payée')
    
    // KPI
    const totalRevenus = payeesSales.reduce((acc, s) => acc + s.montantTotal, 0)
    const totalDepenses = payeesExpenses.reduce((acc, e) => acc + e.montant, 0)
    const beneficeNet = totalRevenus - totalDepenses
    const marge = totalRevenus > 0 ? (beneficeNet / totalRevenus) * 100 : 0

    // Groupement par mois pour BarChart & LineChart
    const byMonth: Record<string, { revenus: number, depenses: number, production: number }> = {}

    payeesSales.forEach(s => {
      const month = s.dateVente.substring(0, 7)
      if (!byMonth[month]) byMonth[month] = { revenus: 0, depenses: 0, production: 0 }
      byMonth[month].revenus += s.montantTotal
      byMonth[month].production += s.quantite
    })

    payeesExpenses.forEach(e => {
      const month = e.dateDepense.substring(0, 7)
      if (!byMonth[month]) byMonth[month] = { revenus: 0, depenses: 0, production: 0 }
      byMonth[month].depenses += e.montant
    })

    const chartData = Object.keys(byMonth)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .map(month => ({
        mois: new Date(month + '-01').toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
        'Revenus': byMonth[month].revenus,
        'Dépenses': byMonth[month].depenses,
        'Bénéfice': byMonth[month].revenus - byMonth[month].depenses,
        'Production': byMonth[month].production
      }))

    // Camembert (PieChart) des Ventes par Produit
    const salesByProduct: Record<string, number> = {}
    payeesSales.forEach(s => {
      salesByProduct[s.produit] = (salesByProduct[s.produit] || 0) + s.montantTotal
    })
    
    const pieData = Object.keys(salesByProduct).map(key => ({
      name: key,
      value: salesByProduct[key]
    })).sort((a, b) => b.value - a.value).slice(0, 5) // Top 5

    return { totalRevenus, totalDepenses, beneficeNet, marge, chartData, pieData }
  }, [sales, expenses])

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444']

  return (
    <div className="space-y-6">
      <SectionTitle 
        title="Rapports et Statistiques" 
        subtitle="Analysez la rentabilité, les revenus, les dépenses et l'évolution de vos productions." 
        badge="Statistiques" 
      />

      {/* --- KPI --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hover className="dashboard-metric bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded-xl">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Ventes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(stats.totalRevenus)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover className="dashboard-metric bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-xl">
                <TrendingDown className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Dépenses</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(stats.totalDepenses)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover className="dashboard-metric bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-xl">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Bénéfice Net</p>
                <p className={cn("text-2xl font-bold mt-1", stats.beneficeNet >= 0 ? "text-indigo-600 dark:text-indigo-400" : "text-red-600 dark:text-red-400")}>
                  {formatCurrency(stats.beneficeNet)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover className="dashboard-metric bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 rounded-xl">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Rentabilité (Marge)</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.marge.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* --- Histogrammes (Trésorerie) --- */}
        <Card hover>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><BarChart2 className="w-5 h-5 text-agri-500" /> Flux de Trésorerie Mensuel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {stats.chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.chartData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="mois" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} tickFormatter={(val) => `${val / 1000}k`} />
                    <RechartsTooltip 
                      formatter={(value: any) => [formatCurrency(Number(value) || 0), '']}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend />
                    <Bar dataKey="Revenus" fill="#10b981" radius={[4, 4, 0, 0]} animationDuration={850} />
                    <Bar dataKey="Dépenses" fill="#ef4444" radius={[4, 4, 0, 0]} animationDuration={850} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">Aucune donnée</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* --- Courbes (Bénéfice) --- */}
        <Card hover>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><TrendingUp className="w-5 h-5 text-indigo-500" /> Évolution de la Rentabilité (Bénéfice)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {stats.chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.chartData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="mois" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} tickFormatter={(val) => `${val / 1000}k`} />
                    <RechartsTooltip 
                      formatter={(value: any) => [formatCurrency(Number(value) || 0), 'Bénéfice Net']}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="Bénéfice" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 8 }} animationDuration={950} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">Aucune donnée</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* --- Courbes (Évolution des Productions) --- */}
        <Card hover>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Activity className="w-5 h-5 text-orange-500" /> Évolution des Productions (Volumes)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {stats.chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.chartData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="mois" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                    <RechartsTooltip 
                      formatter={(value: any) => [`${Number(value) || 0} unités`, 'Volume Produit/Vendu']}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="Production" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorProd)" animationDuration={950} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">Aucune donnée</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* --- Camemberts (Répartition des revenus) --- */}
        <Card hover>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><PieChartIcon className="w-5 h-5 text-blue-500" /> Répartition des Ventes (Top 5)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {stats.pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={stats.pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value" animationDuration={950} label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                      {stats.pieData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <RechartsTooltip 
                      formatter={(value: any) => [formatCurrency(Number(value) || 0), 'Revenus']}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">Aucune donnée</div>
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
