import { BarChart3, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { INITIAL_SECTOR_DATA } from '@/data'
import { formatCurrency } from '@/utils'

interface DashboardChartPoint {
  mois: string
  Revenus: number
  Dépenses: number
  Bénéfice: number
  Production: number
}

export default function DashboardCharts({ chartData }: { chartData: DashboardChartPoint[] }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
      <Card hover>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-agri-600" />
              Évolution de la production & rentabilité mensuelle
            </CardTitle>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Suivi comparatif des Revenus, Dépenses et Bénéfices nets (XOF)
            </p>
          </div>
          <Link to="/admin/statistiques">
            <Button variant="ghost" size="sm" className="text-xs text-agri-600 dark:text-agri-400">
              Détails statistiques
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="h-[290px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorBenefice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="mois" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <RechartsTooltip
                  formatter={(value) => [formatCurrency(Number(value) || 0), '']}
                  contentStyle={{
                    borderRadius: '10px',
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="Revenus"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRevenus)"
                  animationDuration={950}
                />
                <Area
                  type="monotone"
                  dataKey="Bénéfice"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorBenefice)"
                  animationDuration={950}
                />
                <Area
                  type="monotone"
                  dataKey="Dépenses"
                  stroke="#ef4444"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fill="none"
                  animationDuration={950}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card hover>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-agri-600" />
            Dépenses & Revenus par secteur
          </CardTitle>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Performance sectorielle de l'exploitation intégrée
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-[210px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={INITIAL_SECTOR_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="sector" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <RechartsTooltip
                  formatter={(value) => [formatCurrency(Number(value) || 0), '']}
                  contentStyle={{
                    borderRadius: '10px',
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Legend />
                <Bar
                  dataKey="revenue"
                  name="Revenus"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  animationDuration={850}
                />
                <Bar
                  dataKey="expenses"
                  name="Dépenses"
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                  animationDuration={850}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 space-y-2 border-t border-gray-100 pt-3 dark:border-gray-800">
            {INITIAL_SECTOR_DATA.map((item) => (
              <div key={item.sector} className="flex items-center justify-between text-xs">
                <span className="font-medium text-gray-700 dark:text-gray-300">{item.sector}</span>
                <div className="flex gap-3">
                  <span className="font-semibold text-agri-600">{formatCurrency(item.revenue)}</span>
                  <span className="text-gray-400">|</span>
                  <span className="font-medium text-emerald-700 dark:text-emerald-400">
                    Net: {formatCurrency(item.revenue - item.expenses)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
