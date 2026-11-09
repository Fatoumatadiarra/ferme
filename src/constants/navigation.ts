import {
  LayoutDashboard,
  Users,
  UserCog,
  Sprout,
  Apple,
  Beef,
  Bird,
  Fish,
  Tractor,
  Package,
  UserCheck,
  ShoppingCart,
  Receipt,
  BarChart3,
  Settings,
  type LucideIcon,
} from 'lucide-react'
import { ROUTES } from './routes'

export interface NavItem {
  label: string
  path: string
  icon: LucideIcon
  description?: string
}

export const PUBLIC_NAV: NavItem[] = [
  { label: 'Accueil', path: ROUTES.HOME, icon: LayoutDashboard },
  { label: 'À propos', path: ROUTES.ABOUT, icon: Users },
  { label: 'Contact', path: ROUTES.CONTACT, icon: Receipt },
]

export const ADMIN_NAV: NavItem[] = [
  {
    label: 'Dashboard',
    path: ROUTES.ADMIN.DASHBOARD,
    icon: LayoutDashboard,
    description: 'Vue d\'ensemble',
  },
  {
    label: 'Utilisateurs',
    path: ROUTES.ADMIN.USERS,
    icon: Users,
    description: 'Gestion des comptes',
  },
  {
    label: 'Maraîchage',
    path: ROUTES.ADMIN.MARAICHAGE,
    icon: Sprout,
    description: 'Cultures & Champs',
  },
  {
    label: 'Employés',
    path: ROUTES.ADMIN.EMPLOYEES,
    icon: UserCog,
    description: 'Ressources humaines',
  },
  {
    label: 'Fruits',
    path: ROUTES.ADMIN.FRUITS,
    icon: Apple,
    description: 'Cultures fruitières',
  },
  {
    label: 'Élevage',
    path: ROUTES.ADMIN.ELEVAGE,
    icon: Beef,
    description: 'Bovins, ovins, caprins',
  },
  {
    label: 'Aviculture',
    path: ROUTES.ADMIN.AVICULTURE,
    icon: Bird,
    description: 'Volailles',
  },
  {
    label: 'Aquaculture',
    path: ROUTES.ADMIN.AQUACULTURE,
    icon: Fish,
    description: 'Pisciculture',
  },
  {
    label: 'Matériels',
    path: ROUTES.ADMIN.MATERIELS,
    icon: Tractor,
    description: 'Équipements',
  },
  {
    label: 'Stocks',
    path: ROUTES.ADMIN.STOCKS,
    icon: Package,
    description: 'Inventaire',
  },
  {
    label: 'Clients',
    path: ROUTES.ADMIN.CLIENTS,
    icon: UserCheck,
    description: 'Base clients',
  },
  {
    label: 'Ventes',
    path: ROUTES.ADMIN.VENTES,
    icon: ShoppingCart,
    description: 'Commercial',
  },
  {
    label: 'Dépenses',
    path: ROUTES.ADMIN.DEPENSES,
    icon: Receipt,
    description: 'Comptabilité',
  },
  {
    label: 'Statistiques',
    path: ROUTES.ADMIN.STATISTIQUES,
    icon: BarChart3,
    description: 'Analyses & rapports',
  },
  {
    label: 'Paramètres',
    path: ROUTES.ADMIN.PARAMETRES,
    icon: Settings,
    description: 'Configuration',
  },
]

export const FOOTER_LINKS = {
  navigation: [
    { label: 'Accueil', path: ROUTES.HOME },
    { label: 'À propos', path: ROUTES.ABOUT },
    { label: 'Contact', path: ROUTES.CONTACT },
  ],
  modules: [
    { label: 'Élevage', path: ROUTES.ADMIN.ELEVAGE },
    { label: 'Aviculture', path: ROUTES.ADMIN.AVICULTURE },
    { label: 'Aquaculture', path: ROUTES.ADMIN.AQUACULTURE },
  ],
  legal: [
    { label: 'Mentions légales', path: '#' },
    { label: 'Confidentialité', path: '#' },
  ],
} as const
