import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import {
  Apple,
  Award,
  BarChart3,
  Beef,
  Bird,
  CalendarDays,
  CheckCircle2,
  CloudSun,
  Droplets,
  Fish,
  Package,
  Receipt,
  Settings,
  ShieldAlert,
  ShoppingCart,
  Sprout,
  Tractor,
  TrendingDown,
  TrendingUp,
  UserCheck,
  UserCog,
  Users,
  Wallet,
  Wind,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Badge, Card, CardContent, CardHeader, CardTitle, SectionTitle, StatCard } from '@/components/ui'
import { INITIAL_DASHBOARD_DATA } from '@/data'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import { StorageService } from '@/services'
import { formatCurrency } from '@/utils'
import type { SaleRecord } from '@/data/sales-init'
import type { ExpenseRecord } from '@/data/expenses-init'
import type { StockRecord } from '@/data/stocks-init'
import { useInView } from 'react-intersection-observer'

const DashboardCharts = lazy(() => import('./DashboardCharts'))

interface DashboardChartPoint {
  mois: string
  Revenus: number
  Dépenses: number
  Bénéfice: number
  Production: number
}

interface DashboardSnapshot {
  employees: number
  cultures: number
  animals: number
  stocksTotal: number
  stocksAlertes: number
  sales: number
  expenses: number
  profit: number
}

interface AgriculturalTask {
  id: string
  date: string
  activite: string
  parcelle: string
  secteur: 'Maraîchage' | 'Élevage' | 'Aviculture' | 'Aquaculture' | 'Maintenance'
  statut: 'Planifié' | 'En cours' | 'Urgent' | 'Terminé'
}

interface FarmAlert {
  id: string
  titre: string
  description: string
  type: 'danger' | 'warning' | 'info' | 'success'
  date: string
}

function LazyDashboardCharts({ chartData }: { chartData: DashboardChartPoint[] }) {
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: '250px 0px' })

  return (
    <div ref={ref} className="min-h-[360px]">
      {inView ? (
        <Suspense
          fallback={
            <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]" aria-label="Chargement des graphiques">
              <div className="h-[390px] animate-pulse rounded-2xl bg-gray-200/70 dark:bg-gray-800/70" />
              <div className="h-[390px] animate-pulse rounded-2xl bg-gray-200/70 dark:bg-gray-800/70" />
            </div>
          }
        >
          <DashboardCharts chartData={chartData} />
        </Suspense>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]" aria-hidden="true">
          <div className="h-[390px] rounded-2xl bg-gray-100/70 dark:bg-gray-900/40" />
          <div className="h-[390px] rounded-2xl bg-gray-100/70 dark:bg-gray-900/40" />
        </div>
      )}
    </div>
  )
}

export default function DashboardPage() {
  const [snapshot, setSnapshot] = useState<DashboardSnapshot>({
    employees: 0,
    cultures: 0,
    animals: 0,
    stocksTotal: 0,
    stocksAlertes: 0,
    sales: 0,
    expenses: 0,
    profit: 0,
  })

  const [salesRecords, setSalesRecords] = useState<SaleRecord[]>([])
  const [expensesRecords, setExpensesRecords] = useState<ExpenseRecord[]>([])

  useEffect(() => {
    const employees = StorageService.get<Array<{ id: string }>>(STORAGE_KEYS.EMPLOYEES) ?? []
    const cultures = StorageService.get<Array<{ id: string }>>(STORAGE_KEYS.CULTURES) ?? []
    const fruits = StorageService.get<Array<{ id: string }>>(STORAGE_KEYS.FRUITS) ?? []
    const elevage = StorageService.get<Array<{ effectif?: number }>>(STORAGE_KEYS.ELEVAGE) ?? []
    const aviculture = StorageService.get<Array<{ effectif?: number }>>(STORAGE_KEYS.AVICULTURE) ?? []
    const stocks = StorageService.get<StockRecord[]>(STORAGE_KEYS.STOCKS) ?? []
    const sales = StorageService.get<SaleRecord[]>(STORAGE_KEYS.VENTES) ?? []
    const expenses = StorageService.get<ExpenseRecord[]>(STORAGE_KEYS.DEPENSES) ?? []

    setSalesRecords(sales)
    setExpensesRecords(expenses)

    const totalCultures = Math.max(cultures.length + fruits.length, INITIAL_DASHBOARD_DATA.cultures)
    const totalEmployees = Math.max(employees.length, INITIAL_DASHBOARD_DATA.employees)
    
    // Total animaux (bétail + volaille)
    const sumElevage = elevage.reduce((sum, item) => sum + (item.effectif ?? 1), 0)
    const sumAviculture = aviculture.reduce((sum, item) => sum + (item.effectif ?? 1), 0)
    const totalAnimals = Math.max(sumElevage + sumAviculture, INITIAL_DASHBOARD_DATA.animals)

    const totalSales = sales.length > 0
      ? sales.reduce((sum, s) => sum + (s.statut === 'Payée' ? s.montantTotal : 0), 0)
      : INITIAL_DASHBOARD_DATA.monthlyRevenue

    const totalExpenses = expenses.length > 0
      ? expenses.reduce((sum, e) => sum + (e.statut === 'Payée' ? e.montant : 0), 0)
      : INITIAL_DASHBOARD_DATA.monthlyExpenses

    const stocksLow = stocks.filter(stk => stk.statut === 'Faible' || stk.statut === 'Rupture').length

    setSnapshot({
      employees: totalEmployees,
      cultures: totalCultures,
      animals: totalAnimals,
      stocksTotal: stocks.length > 0 ? stocks.length : 8,
      stocksAlertes: stocks.length > 0 ? stocksLow : 2,
      sales: totalSales,
      expenses: totalExpenses,
      profit: totalSales - totalExpenses,
    })
  }, [])

  // Graphique d'évolution financière et de production
  const chartData = useMemo<DashboardChartPoint[]>(() => {
    if (salesRecords.length > 0 || expensesRecords.length > 0) {
      const byMonth: Record<string, { revenus: number; depenses: number; production: number }> = {}

      salesRecords
        .filter((s) => s.statut === 'Payée')
        .forEach((s) => {
          const month = s.dateVente.substring(0, 7)
          if (!byMonth[month]) byMonth[month] = { revenus: 0, depenses: 0, production: 0 }
          byMonth[month].revenus += s.montantTotal
          byMonth[month].production += s.quantite
        })

      expensesRecords
        .filter((e) => e.statut === 'Payée')
        .forEach((e) => {
          const month = e.dateDepense.substring(0, 7)
          if (!byMonth[month]) byMonth[month] = { revenus: 0, depenses: 0, production: 0 }
          byMonth[month].depenses += e.montant
        })

      const sorted = Object.keys(byMonth)
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
        .map((month) => ({
          mois: new Date(month + '-01').toLocaleDateString('fr-FR', { month: 'short' }),
          Revenus: byMonth[month].revenus,
          Dépenses: byMonth[month].depenses,
          Bénéfice: byMonth[month].revenus - byMonth[month].depenses,
          Production: byMonth[month].production,
        }))

      if (sorted.length >= 2) return sorted
    }

    // Données de tendance réalistes basées sur les saisons agricoles sénégalaises
    return [
      { mois: 'Janv', Revenus: 1850000, Dépenses: 920000, Bénéfice: 930000, Production: 420 },
      { mois: 'Févr', Revenus: 2100000, Dépenses: 880000, Bénéfice: 1220000, Production: 510 },
      { mois: 'Mars', Revenus: 2400000, Dépenses: 980000, Bénéfice: 1420000, Production: 630 },
      { mois: 'Avr', Revenus: 2650000, Dépenses: 1100000, Bénéfice: 1550000, Production: 710 },
      { mois: 'Mai', Revenus: 2300000, Dépenses: 1050000, Bénéfice: 1250000, Production: 590 },
      { mois: 'Juin', Revenus: 2950000, Dépenses: 1150000, Bénéfice: 1800000, Production: 820 },
    ]
  }, [salesRecords, expensesRecords])

  // Calendrier agricole des opérations
  const calendarTasks: AgriculturalTask[] = [
    {
      id: 'tsk-1',
      date: 'Aujourd’hui',
      activite: 'Irrigation goutte-à-goutte & fertilisation foliaire',
      parcelle: 'Parcelle A (Tomates Roma)',
      secteur: 'Maraîchage',
      statut: 'En cours',
    },
    {
      id: 'tsk-2',
      date: 'Demain, 07:30',
      activite: 'Rappel vaccin péripneumonie contagieuse',
      parcelle: 'Enclos Bovins Lot 1',
      secteur: 'Élevage',
      statut: 'Urgent',
    },
    {
      id: 'tsk-3',
      date: 'Dans 2 jours',
      activite: 'Pesée de contrôle & renouvellement eau',
      parcelle: 'Bassin 1 & 2 (Tilapias)',
      secteur: 'Aquaculture',
      statut: 'Planifié',
    },
    {
      id: 'tsk-4',
      date: '05 Octobre',
      activite: 'Récolte et conditionnement caisses',
      parcelle: 'Parcelle C (Choux)',
      secteur: 'Maraîchage',
      statut: 'Planifié',
    },
    {
      id: 'tsk-5',
      date: '08 Octobre',
      activite: 'Contrôle technique et vidange tracteur',
      parcelle: 'Hangar central',
      secteur: 'Maintenance',
      statut: 'Planifié',
    },
  ]

  // Alertes actives de la ferme
  const farmAlerts: FarmAlert[] = [
    {
      id: 'alt-1',
      titre: 'Stock critique Engrais',
      description: 'NPK 15-15-15 inférieur au seuil de sécurité (2 sacs restants).',
      type: 'warning',
      date: 'Il y a 2h',
    },
    {
      id: 'alt-2',
      titre: 'Campagne de vaccination',
      description: 'Rappel de vaccination sanitaire bétail programmé pour le 04 Octobre.',
      type: 'danger',
      date: 'Il y a 5h',
    },
    {
      id: 'alt-3',
      titre: 'Récolte imminente',
      description: '2.5 hectares de Tomates Roma à maturité optimale pour la cueillette.',
      type: 'success',
      date: 'Aujourd’hui',
    },
    {
      id: 'alt-4',
      titre: 'Pression irrigation stable',
      description: 'Pompage solaire et niveaux des réservoirs d’eau à 95% de capacité.',
      type: 'info',
      date: 'Aujourd’hui',
    },
  ]

  // Grille des modules avec tous les secteurs dont Maraîchage
  const modules = [
    { label: 'Maraîchage', icon: Sprout, path: 'maraichage', desc: 'Légumes & parcelles' },
    { label: 'Fruits', icon: Apple, path: 'fruits', desc: 'Vergers & bananiers' },
    { label: 'Élevage', icon: Beef, path: 'elevage', desc: 'Bovins, ovins, caprins' },
    { label: 'Aviculture', icon: Bird, path: 'aviculture', desc: 'Volailles & œufs' },
    { label: 'Aquaculture', icon: Fish, path: 'aquaculture', desc: 'Bassins & poissons' },
    { label: 'Employés', icon: UserCog, path: 'employes', desc: 'Équipes & RH' },
    { label: 'Matériels', icon: Tractor, path: 'materiels', desc: 'Équipements & engins' },
    { label: 'Stocks', icon: Package, path: 'stocks', desc: 'Semences & intrants' },
    { label: 'Clients', icon: UserCheck, path: 'clients', desc: 'Base commerciale' },
    { label: 'Ventes', icon: ShoppingCart, path: 'ventes', desc: 'Commandes & factures' },
    { label: 'Dépenses', icon: Receipt, path: 'depenses', desc: 'Charges & achats' },
    { label: 'Statistiques', icon: BarChart3, path: 'statistiques', desc: 'Analyses & KPI' },
    { label: 'Utilisateurs', icon: Users, path: 'utilisateurs', desc: 'Droits & comptes' },
    { label: 'Paramètres', icon: Settings, path: 'parametres', desc: 'Configuration' },
  ]

  const getStatusBadge = (statut: AgriculturalTask['statut']) => {
    switch (statut) {
      case 'Urgent':
        return <Badge variant="danger">Urgent</Badge>
      case 'En cours':
        return <Badge variant="warning">En cours</Badge>
      case 'Planifié':
        return <Badge variant="info">Planifié</Badge>
      case 'Terminé':
        return <Badge variant="success">Terminé</Badge>
      default:
        return <Badge>{statut}</Badge>
    }
  }

  const getAlertBadge = (type: FarmAlert['type']) => {
    switch (type) {
      case 'danger':
        return <Badge variant="danger">Action requise</Badge>
      case 'warning':
        return <Badge variant="warning">Attention</Badge>
      case 'success':
        return <Badge variant="success">Favorable</Badge>
      case 'info':
        return <Badge variant="info">Info</Badge>
    }
  }

  return (
    <div className="space-y-8">
      {/* --- Bannière Titre --- */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative overflow-hidden rounded-3xl border border-agri-200/70 bg-gradient-to-br from-agri-50 via-white to-earth-50 p-6 shadow-sm dark:border-agri-900/40 dark:from-agri-950/50 dark:via-surface-card-dark dark:to-earth-900/20"
      >
        <div className="pointer-events-none absolute -right-10 -top-14 h-44 w-44 rounded-full border-[24px] border-agri-500/5" />
        <SectionTitle
          title="Tableau de bord"
          subtitle="Supervision globale en temps réel de votre exploitation intégrée (Thiès, Sénégal)"
          badge="AgriTech Dashboard"
        />
      </motion.div>

      {/* --- KPIs Principaux (Ligne 1) --- */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08 }}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard
          title="Employés actifs"
          value={snapshot.employees}
          icon={Users}
          trend={{ value: 5, label: 'vs mois dernier' }}
        />
        <StatCard
          title="Cultures actives"
          value={`${snapshot.cultures} parcelles`}
          icon={Sprout}
          trend={{ value: 12, label: 'sur 12 ha' }}
        />
        <StatCard
          title="Chiffre d’affaires"
          value={formatCurrency(snapshot.sales)}
          icon={TrendingUp}
          trend={{ value: 18, label: 'encaissements' }}
        />
        <StatCard
          title="Bénéfice net"
          value={formatCurrency(snapshot.profit)}
          icon={Wallet}
          trend={{ value: 8, label: 'marge positive' }}
        />
      </motion.div>

      {/* --- KPIs Secondaires (Ligne 2 : Cheptel, Stocks, Dépenses, Rendement) --- */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.14 }}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <div className="dashboard-metric rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-4 shadow-sm dark:border-gray-800 dark:from-gray-900/30 dark:to-gray-950/20">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total animaux suivis</span>
            <span className="rounded-lg bg-emerald-100 p-2 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
              <Beef className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{snapshot.animals} têtes</p>
          <p className="mt-1 text-xs text-gray-500">Bovins, Ovins, Caprins & Volailles</p>
        </div>

        <div className="dashboard-metric rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-4 shadow-sm dark:border-gray-800 dark:from-gray-900/30 dark:to-gray-950/20">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Niveau des stocks</span>
            <span className="rounded-lg bg-amber-100 p-2 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
              <Package className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            {snapshot.stocksTotal} références
          </p>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>{snapshot.stocksAlertes} article(s) sous seuil d'alerte</span>
          </div>
        </div>

        <div className="dashboard-metric rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-4 shadow-sm dark:border-gray-800 dark:from-gray-900/30 dark:to-gray-950/20">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Dépenses engagées</span>
            <span className="rounded-lg bg-red-100 p-2 text-red-700 dark:bg-red-950/50 dark:text-red-400">
              <TrendingDown className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(snapshot.expenses)}
          </p>
          <p className="mt-1 text-xs text-gray-500">Intrants, énergie, aliments & salaires</p>
        </div>

        <div className="dashboard-metric rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-4 shadow-sm dark:border-gray-800 dark:from-gray-900/30 dark:to-gray-950/20">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Taux de rentabilité</span>
            <span className="rounded-lg bg-agri-100 p-2 text-agri-700 dark:bg-agri-950/50 dark:text-agri-400">
              <Award className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-agri-600 dark:text-agri-400">
            {snapshot.sales > 0 ? ((snapshot.profit / snapshot.sales) * 100).toFixed(1) : '35.4'}%
          </p>
          <p className="mt-1 text-xs text-gray-500">Marge brute moyenne globale</p>
        </div>
      </motion.div>

      {/* --- Graphiques Interactifs (Recharts) --- */}
      <LazyDashboardCharts chartData={chartData} />

      {/* --- Météo Agricole Simulée & Alertes & Meilleures Filières --- */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Météo agricole simulée */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <CloudSun className="h-5 w-5 text-amber-500" />
                Météo agricole (Simulation Thiès)
              </CardTitle>
              <Badge variant="primary">Temps réel</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 p-4 dark:from-amber-950/30 dark:to-orange-950/20 border border-amber-100 dark:border-amber-900/30">
              <div>
                <span className="text-3xl font-extrabold text-gray-900 dark:text-white">29°C</span>
                <p className="text-sm font-medium text-amber-700 dark:text-amber-400 mt-0.5">Ensoleillé & Climat sec</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Région de Thiès, Sénégal</p>
              </div>
              <CloudSun className="h-12 w-12 text-amber-500" />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-2.5 dark:border-gray-800 dark:bg-gray-900/30">
                <Droplets className="mx-auto h-4 w-4 text-blue-500" />
                <span className="mt-1 block text-xs font-semibold text-gray-900 dark:text-white">65%</span>
                <span className="text-[10px] text-gray-500">Humidité</span>
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-2.5 dark:border-gray-800 dark:bg-gray-900/30">
                <Wind className="mx-auto h-4 w-4 text-teal-500" />
                <span className="mt-1 block text-xs font-semibold text-gray-900 dark:text-white">14 km/h</span>
                <span className="text-[10px] text-gray-500">Vent NE</span>
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-2.5 dark:border-gray-800 dark:bg-gray-900/30">
                <Droplets className="mx-auto h-4 w-4 text-indigo-500" />
                <span className="mt-1 block text-xs font-semibold text-gray-900 dark:text-white">0 mm</span>
                <span className="text-[10px] text-gray-500">Pluie 24h</span>
              </div>
            </div>

            <div className="rounded-xl border border-agri-200 bg-agri-50/50 p-3 text-xs text-agri-800 dark:border-agri-900/40 dark:bg-agri-950/30 dark:text-agri-300">
              <p className="font-semibold flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="h-4 w-4 text-agri-600" /> Conseil agronomique du jour :
              </p>
              Conditions idéales pour l'irrigation goutte-à-goutte matinale et le traitement foliaire des tomates.
            </div>
          </CardContent>
        </Card>

        {/* Alertes d'exploitation */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-red-500" />
                Alertes & Vigies agricoles
              </CardTitle>
              <Badge variant="warning">{farmAlerts.length} actives</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {farmAlerts.map((alt) => (
              <div
                key={alt.id}
                className="rounded-xl border border-gray-100 bg-gray-50/60 p-3 transition-colors hover:bg-gray-100/60 dark:border-gray-800 dark:bg-gray-900/20 dark:hover:bg-gray-900/40"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-gray-900 dark:text-white">{alt.titre}</p>
                  {getAlertBadge(alt.type)}
                </div>
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  {alt.description}
                </p>
                <span className="mt-1.5 block text-[10px] text-gray-400">{alt.date}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Meilleure culture & Meilleur élevage */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              Performances & Rentabilité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Meilleure culture */}
            <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/70 to-white p-4 shadow-xs dark:border-emerald-900/40 dark:from-emerald-950/20 dark:to-surface-card-dark">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Meilleure culture maraîchère
                </span>
                <Badge variant="success">Top Rentabilité</Badge>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                  <Sprout className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-base">Tomate Roma</p>
                  <p className="text-xs text-gray-500">Rendement : 45 tonnes/ha • Marge brute 68%</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 border-t border-emerald-100 dark:border-emerald-900/30 pt-2">
                <span>Production : 2.5 ha</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-300">CA : 3 500 000 XOF</span>
              </div>
            </div>

            {/* Meilleur élevage */}
            <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/70 to-white p-4 shadow-xs dark:border-blue-900/40 dark:from-blue-950/20 dark:to-surface-card-dark">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                  Meilleur élevage / rotation
                </span>
                <Badge variant="info">Cycle court</Badge>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                  <Bird className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-base">Poulets de chair</p>
                  <p className="text-xs text-gray-500">Rotation 45 jours • Mortalité &lt; 2.5%</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 border-t border-blue-100 dark:border-blue-900/30 pt-2">
                <span>Lot actif : 1 200 sujets</span>
                <span className="font-semibold text-blue-700 dark:text-blue-300">Rentabilité : +48%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* --- Calendrier Agricole & Planification --- */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-agri-600" />
              Calendrier agricole & planning des opérations
            </CardTitle>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Opérations de semis, récoltes, traitements et maintenances programmées
            </p>
          </div>
          <Badge variant="primary">Semaine en cours</Badge>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {calendarTasks.map((task) => (
              <div
                key={task.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between py-3.5 gap-2 hover:bg-gray-50/50 dark:hover:bg-gray-900/20 px-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-agri-100 text-agri-700 dark:bg-agri-900/30 dark:text-agri-400 font-semibold text-xs">
                    <CalendarDays className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{task.activite}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{task.parcelle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:ml-auto">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{task.date}</span>
                  <Badge variant="default" size="sm">
                    {task.secteur}
                  </Badge>
                  {getStatusBadge(task.statut)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* --- Grille de Navigation vers tous les Modules --- */}
      <div>
        <div className="mb-4">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Accès rapide aux modules de gestion</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Accédez directement à chaque section de votre ferme agricole intégrée
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          {modules.map((mod) => (
            <Link
              key={mod.path}
              to={`/admin/${mod.path}`}
              className="group flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-agri-300 hover:shadow-sm dark:border-gray-800 dark:bg-surface-card-dark"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-agri-100 text-agri-700 transition-colors group-hover:bg-agri-600 group-hover:text-white dark:bg-agri-900/40 dark:text-agri-400">
                  <mod.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-2.5">
                <span className="block text-sm font-semibold text-gray-800 group-hover:text-agri-600 dark:text-gray-200 dark:group-hover:text-agri-400">
                  {mod.label}
                </span>
                <span className="text-[11px] text-gray-500 dark:text-gray-400">{mod.desc}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
