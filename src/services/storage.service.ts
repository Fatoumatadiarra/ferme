import { STORAGE_KEYS } from '@/constants/storage-keys'
import type { AppSettings, AuthSession, Employee, User } from '@/types'

const DEFAULT_SETTINGS: AppSettings = {
  farmName: 'Ferme Agricole Intégrée',
  farmLocation: 'Sénégal',
  currency: 'XOF',
  language: 'fr',
  notificationsEnabled: true,
}

export class StorageService {
  static get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key)
      if (!raw) return null
      return JSON.parse(raw) as T
    } catch {
      console.error(`Erreur de lecture LocalStorage pour la clé: ${key}`)
      return null
    }
  }

  static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      console.error(`Erreur d'écriture LocalStorage pour la clé: ${key}`)
    }
  }

  static remove(key: string): void {
    localStorage.removeItem(key)
  }

  static clear(): void {
    localStorage.clear()
  }

  static has(key: string): boolean {
    return localStorage.getItem(key) !== null
  }

  static init(): void {
    if (StorageService.get<boolean>(STORAGE_KEYS.INITIALIZED)) {
      return
    }

    const defaultUser: User = {
      id: crypto.randomUUID(),
      email: 'admin@ferme.sn',
      password: 'admin123',
      nom: 'Diop',
      prenom: 'Amadou',
      role: 'admin',
      secteur: 'Administration',
      statut: 'actif',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    StorageService.set<User[]>(STORAGE_KEYS.USERS, [defaultUser])
    StorageService.set<Employee[]>(STORAGE_KEYS.EMPLOYEES, [])
    StorageService.set<unknown[]>(STORAGE_KEYS.CULTURES, [])
    StorageService.set<unknown[]>(STORAGE_KEYS.FRUITS, [])
    StorageService.set<unknown[]>(STORAGE_KEYS.ELEVAGE, [])
    StorageService.set<unknown[]>(STORAGE_KEYS.AVICULTURE, [])
    StorageService.set<unknown[]>(STORAGE_KEYS.AQUACULTURE, [])
    StorageService.set<unknown[]>(STORAGE_KEYS.MATERIELS, [])
    StorageService.set<unknown[]>(STORAGE_KEYS.STOCKS, [])
    StorageService.set<unknown[]>(STORAGE_KEYS.CLIENTS, [])
    StorageService.set<unknown[]>(STORAGE_KEYS.VENTES, [])
    StorageService.set<unknown[]>(STORAGE_KEYS.DEPENSES, [])
    StorageService.set<AuthSession | null>(STORAGE_KEYS.AUTH, null)
    StorageService.set<AppSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS)
    StorageService.set<boolean>(STORAGE_KEYS.INITIALIZED, true)
  }

  static getUsers(): User[] {
    return StorageService.get<User[]>(STORAGE_KEYS.USERS) ?? []
  }

  static getEmployees(): Employee[] {
    return StorageService.get<Employee[]>(STORAGE_KEYS.EMPLOYEES) ?? []
  }

  static getSettings(): AppSettings {
    return StorageService.get<AppSettings>(STORAGE_KEYS.SETTINGS) ?? DEFAULT_SETTINGS
  }

  static getAuth(): AuthSession | null {
    return StorageService.get<AuthSession | null>(STORAGE_KEYS.AUTH)
  }
}

export { DEFAULT_SETTINGS }
