export type Theme = 'light' | 'dark'

export type UserRole = 'admin' | 'directeur' | 'responsable' | 'employe'

export type UserStatut = 'actif' | 'en_attente' | 'desactive'

export type UserSecteur =
  | 'Administration'
  | 'Maraichage'
  | 'Elevage'
  | 'Aviculture'
  | 'Aquaculture'
  | 'Materiels'
  | 'Stocks'
  | 'Ventes'

export interface User {
  id: string
  email: string
  password: string
  nom: string
  prenom: string
  role: UserRole
  secteur?: UserSecteur
  telephone?: string
  adresse?: string
  statut: UserStatut
  avatar?: string
  derniereConnexion?: string
  createdAt: string
  updatedAt: string
}

export interface AuthSession {
  userId: string
  token: string
  expiresAt: string
}

export interface Employee {
  id: string
  photo?: string
  nom: string
  prenom: string
  telephone: string
  adresse: string
  poste: string
  secteur: string
  dateRecrutement: string
  statut: 'actif' | 'inactif' | 'conge'
  missions: string[]
  createdAt: string
  updatedAt: string
}

export interface AppSettings {
  farmName: string
  farmLocation: string
  currency: string
  language: string
  notificationsEnabled: boolean
}

export interface StorageSchema {
  users: User[]
  employees: Employee[]
  cultures: unknown[]
  fruits: unknown[]
  elevage: unknown[]
  aviculture: unknown[]
  aquaculture: unknown[]
  materiels: unknown[]
  stocks: unknown[]
  clients: unknown[]
  ventes: unknown[]
  depenses: unknown[]
  auth: AuthSession | null
  settings: AppSettings
}
