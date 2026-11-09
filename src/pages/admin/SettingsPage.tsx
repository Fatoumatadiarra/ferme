import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Save, Download, Trash2, Moon, Sun, User as UserIcon, Database, Globe } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle, Input, Button, SectionTitle } from '@/components/ui'
import { STORAGE_KEYS } from '@/constants'
import { StorageService } from '@/services'
import { useTheme } from '@/hooks/useTheme'
import type { User, AuthSession } from '@/types'

const profileSchema = z.object({
  prenom: z.string().min(2, 'Le prénom est obligatoire'),
  nom: z.string().min(2, 'Le nom est obligatoire'),
  email: z.string().email('Email invalide'),
})

const farmSchema = z.object({
  farmName: z.string().min(2, 'Le nom de la ferme est obligatoire'),
  location: z.string().min(2, 'La localisation est obligatoire'),
  currency: z.string().min(1, 'La devise est obligatoire'),
})

type ProfileFormValues = z.infer<typeof profileSchema>
type FarmFormValues = z.infer<typeof farmSchema>

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema)
  })

  const farmForm = useForm<FarmFormValues>({
    resolver: zodResolver(farmSchema),
    defaultValues: {
      farmName: 'Ferme Agricole Moderne',
      location: 'Dakar, Sénégal',
      currency: 'FCFA',
    }
  })

  useEffect(() => {
    // Profil Utilisateur Connecté
    const session = StorageService.get<AuthSession>(STORAGE_KEYS.AUTH)
    const users = StorageService.get<User[]>(STORAGE_KEYS.USERS) || []
    
    if (session && session.userId) {
      const user = users.find(u => u.id === session.userId)
      if (user) {
        setCurrentUser(user)
        profileForm.reset({
          prenom: user.prenom,
          nom: user.nom,
          email: user.email,
        })
      }
    }

    // Paramètres Ferme
    const storedFarm = StorageService.get<FarmFormValues>('app_farm')
    if (storedFarm) farmForm.reset(storedFarm)
  }, [profileForm, farmForm])

  const onProfileSubmit = profileForm.handleSubmit((data) => {
    if (!currentUser) return
    
    const users = StorageService.get<User[]>(STORAGE_KEYS.USERS) || []
    const updatedUsers = users.map(u => 
      u.id === currentUser.id 
        ? { ...u, prenom: data.prenom, nom: data.nom, email: data.email } 
        : u
    )
    
    StorageService.set(STORAGE_KEYS.USERS, updatedUsers)
    setCurrentUser(updatedUsers.find(u => u.id === currentUser.id) || null)
    
    // Dispatch un event custom pour forcer le header à se re-rendre si besoin (optionnel mais recommandé)
    window.dispatchEvent(new Event('user-profile-updated'))
    
    toast.success('Profil mis à jour')
  })

  const onFarmSubmit = farmForm.handleSubmit((data) => {
    StorageService.set('app_farm', data)
    toast.success('Paramètres de la ferme mis à jour')
  })

  const handleExportData = () => {
    try {
      const allData: Record<string, any> = {}
      Object.values(STORAGE_KEYS).forEach((key) => {
        allData[key] = StorageService.get(key)
      })
      const dataStr = JSON.stringify(allData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `ferme_backup_${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      toast.success('Sauvegarde téléchargée avec succès')
    } catch (e) {
      toast.error('Erreur lors de la sauvegarde')
    }
  }

  const handleResetData = () => {
    if (window.confirm("⚠️ ATTENTION : Voulez-vous vraiment effacer TOUTES les données ? Cette action est irréversible !")) {
      if (window.confirm("Veuillez confirmer une deuxième fois. TOUT sera supprimé.")) {
        Object.values(STORAGE_KEYS).forEach((key) => {
          localStorage.removeItem(key)
        })
        toast.success('Données réinitialisées. Rechargement...')
        setTimeout(() => window.location.reload(), 1500)
      }
    }
  }

  const getInitials = (prenom: string, nom: string) => {
    if (!prenom && !nom) return 'U'
    return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase()
  }

  const displayName = currentUser ? `${currentUser.prenom} ${currentUser.nom}` : 'Utilisateur'
  const displayRole = currentUser?.role === 'admin' ? 'Administrateur' : currentUser?.role || 'Compte'
  const initials = currentUser ? getInitials(currentUser.prenom, currentUser.nom) : 'U'

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <SectionTitle 
        title="Paramètres" 
        subtitle="Gérez votre profil, vos préférences et vos données." 
        badge="Système" 
      />

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* --- Profil Utilisateur --- */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><UserIcon className="w-5 h-5 text-indigo-500" /> Profil Utilisateur</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              {currentUser?.avatar ? (
                <img src={currentUser.avatar} alt="Avatar" className="w-16 h-16 rounded-full object-cover border-2 border-indigo-100 dark:border-indigo-900" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-agri-600 text-xl font-bold text-white border-2 border-indigo-100 dark:border-indigo-900">
                  {initials}
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-900 dark:text-white capitalize">{displayName}</p>
                <p className="text-sm text-gray-500 capitalize">{displayRole}</p>
              </div>
            </div>
            <form onSubmit={onProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Prénom" {...profileForm.register('prenom')} error={profileForm.formState.errors.prenom?.message} />
                <Input label="Nom" {...profileForm.register('nom')} error={profileForm.formState.errors.nom?.message} />
              </div>
              <Input label="Email" type="email" {...profileForm.register('email')} error={profileForm.formState.errors.email?.message} />
              
              <Button type="submit" leftIcon={<Save className="w-4 h-4" />}>Enregistrer le profil</Button>
            </form>
          </CardContent>
        </Card>

        {/* --- Paramètres de la ferme --- */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5 text-green-500" /> Informations de la Ferme</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onFarmSubmit} className="space-y-4">
              <Input label="Nom de la plateforme / ferme" {...farmForm.register('farmName')} error={farmForm.formState.errors.farmName?.message} />
              <Input label="Localisation" {...farmForm.register('location')} error={farmForm.formState.errors.location?.message} />
              <Input label="Devise principale (ex: FCFA, EUR)" {...farmForm.register('currency')} error={farmForm.formState.errors.currency?.message} />
              <Button type="submit" leftIcon={<Save className="w-4 h-4" />}>Enregistrer les paramètres</Button>
            </form>
          </CardContent>
        </Card>

        {/* --- Apparence --- */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Sun className="w-5 h-5 text-orange-500" /> Apparence</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Choisissez votre thème préféré pour l'interface.</p>
            <div className="flex gap-4">
              <Button 
                type="button" 
                variant={theme === 'light' ? 'primary' : 'outline'} 
                onClick={() => setTheme('light')}
                leftIcon={<Sun className="w-4 h-4" />}
              >
                Clair
              </Button>
              <Button 
                type="button" 
                variant={theme === 'dark' ? 'primary' : 'outline'} 
                onClick={() => setTheme('dark')}
                leftIcon={<Moon className="w-4 h-4" />}
              >
                Sombre
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* --- Gestion des Données --- */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Database className="w-5 h-5 text-blue-500" /> Gestion des Données</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Sauvegarde Locale</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Exportez toutes vos données au format JSON pour en garder une copie sécurisée.</p>
              <Button type="button" variant="outline" onClick={handleExportData} leftIcon={<Download className="w-4 h-4" />}>
                Télécharger la sauvegarde
              </Button>
            </div>
            
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
              <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">Zone de danger</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Supprimez définitivement toutes les données de l'application.</p>
              <Button type="button" variant="danger" onClick={handleResetData} leftIcon={<Trash2 className="w-4 h-4" />}>
                Réinitialiser les données
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
