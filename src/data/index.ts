export const FARM_INFO = {
  name: 'Ferme Agricole Intégrée',
  location: 'Thiès, Sénégal',
  sectors: ['Maraîchage', 'Élevage', 'Aviculture', 'Aquaculture'],
} as const

export const INITIAL_DASHBOARD_DATA = {
  employees: 24,
  cultures: 10,
  animals: 86,
  stockLevel: 'Élevé',
  monthlyRevenue: 2400000,
  monthlyExpenses: 980000,
  profit: 850000,
  alerts: 4,
  weather: 'Ensoleillé',
}

export const INITIAL_SECTOR_DATA = [
  { sector: 'Maraîchage', revenue: 780000, expenses: 320000 },
  { sector: 'Élevage', revenue: 640000, expenses: 280000 },
  { sector: 'Aviculture', revenue: 420000, expenses: 180000 },
  { sector: 'Aquaculture', revenue: 360000, expenses: 140000 },
]
