export type MaterialStatus =
  | 'operationnel'
  | 'maintenance'
  | 'hors_service'

export type MaterialCategory =
  | 'Tracteur'
  | 'Drone'
  | 'Irrigation'
  | 'Pompe solaire'
  | 'Pulvérisateur'
  | 'Motoculteur'
  | 'Capteur'
  | 'Remorque'

export interface MaterialMaintenance {
  id: string
  date: string
  type: string
  description: string
  cout: number
  technicien?: string
}

export interface MaterialHistory {
  id: string
  date: string
  action: string
  description: string
  responsable?: string
}

export interface MaterialRecord {
  id: string
  nom: string
  categorie: MaterialCategory
  marque: string
  modele: string
  numeroSerie: string

  description: string

  caracteristiques: string[]

  utilisation: string

  dateAcquisition: string

  coutAcquisition: number

  valeurActuelle: number

  etat: MaterialStatus

  localisation: string

  responsable: string

  heuresUtilisation: number

  prochaineMaintenance?: string

  images: string[]

  maintenances: MaterialMaintenance[]

  historique: MaterialHistory[]

  createdAt: string
  updatedAt?: string
  garantie?: string
}