export const STORAGE_KEYS = {
  USERS: 'ferme_users',
  EMPLOYEES: 'ferme_employees',
  MATERIALS: 'ferme-materials',
  CULTURES: 'ferme_cultures',
  FRUITS: 'ferme_fruits',
  ELEVAGE: 'ferme_elevage',
  AVICULTURE: 'ferme_aviculture',
  AQUACULTURE: 'ferme_aquaculture',
  MATERIELS: 'ferme_materiels',
  STOCKS: 'ferme_stocks',
  CLIENTS: 'ferme_clients',
  VENTES: 'ferme_ventes',
  DEPENSES: 'ferme_depenses',
  AUTH: 'ferme_auth',
  THEME: 'ferme_theme',
  SETTINGS: 'ferme_settings',
  INITIALIZED: 'ferme_initialized',

} as const

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]
