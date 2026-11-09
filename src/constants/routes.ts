export const ROUTES = {
  HOME: '/',
  ABOUT: '/a-propos',
  CONTACT: '/contact',
  LOGIN: '/connexion',
  REGISTER: '/inscription',
  ADMIN: {
    ROOT: '/admin',
    DASHBOARD: '/admin',
    MARAICHAGE: '/admin/maraichage',
    USERS: '/admin/utilisateurs',
    EMPLOYEES: '/admin/employes',
    FRUITS: '/admin/fruits',
    ELEVAGE: '/admin/elevage',
    AVICULTURE: '/admin/aviculture',
    AQUACULTURE: '/admin/aquaculture',
    MATERIELS: '/admin/materiels',
    STOCKS: '/admin/stocks',
    CLIENTS: '/admin/clients',
    VENTES: '/admin/ventes',
    DEPENSES: '/admin/depenses',
    STATISTIQUES: '/admin/statistiques',
    PARAMETRES: '/admin/parametres',
  },
} as const

export const APP_NAME = 'AgriFerme'
export const APP_TAGLINE = 'Gestion intelligente de votre ferme intégrée'
export const APP_VERSION = '1.0.0'
