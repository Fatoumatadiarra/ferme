import { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, Menu, Moon, Search, Sun, LogOut, Settings, User as UserIcon, Check } from 'lucide-react'
import { useThemeContext } from '@/context'
import { Button, Input } from '@/components/ui'
import { cn } from '@/utils'
import { StorageService } from '@/services'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import type { User, AuthSession } from '@/types'
import { ROUTES } from '@/constants'

interface AdminHeaderProps {
  onMenuClick: () => void
  sidebarCollapsed?: boolean
}

export interface AppNotification {
  id: string
  title: string
  message: string
  date: string
  read: boolean
}

const DEFAULT_NOTIFS: AppNotification[] = [
  { id: '1', title: 'Nouvelle vente', message: 'Nouvelle vente enregistrée.', date: new Date().toISOString(), read: false },
  { id: '2', title: 'Stock faible', message: 'Le stock de tomates est bas.', date: new Date(Date.now() - 3600000).toISOString(), read: false },
  { id: '3', title: 'Maintenance', message: 'Maintenance tracteur prévue.', date: new Date(Date.now() - 86400000).toISOString(), read: true }
]

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { toggleTheme, isDark } = useThemeContext()
  const navigate = useNavigate()
  
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifMenu, setShowNotifMenu] = useState(false)
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  
  const notifRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Récupérer l'utilisateur connecté
    const session = StorageService.get<AuthSession>(STORAGE_KEYS.AUTH)
    const users = StorageService.get<User[]>(STORAGE_KEYS.USERS) || []
    if (session && session.userId) {
      const user = users.find(u => u.id === session.userId)
      if (user) setCurrentUser(user)
    }

    // Récupérer les notifications
    const storedNotifs = StorageService.get<AppNotification[]>('app_notifications')
    if (!storedNotifs || storedNotifs.length === 0) {
      StorageService.set('app_notifications', DEFAULT_NOTIFS)
      setNotifications(DEFAULT_NOTIFS)
    } else {
      setNotifications(storedNotifs)
    }
  }, [])

  useEffect(() => {
    // Fermer les dropdowns quand on clique ailleurs
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifMenu(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    StorageService.remove(STORAGE_KEYS.AUTH)
    navigate(ROUTES.LOGIN)
  }

  const markAsRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n)
    setNotifications(updated)
    StorageService.set('app_notifications', updated)
  }

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }))
    setNotifications(updated)
    StorageService.set('app_notifications', updated)
  }

  const unreadCount = notifications.filter(n => !n.read).length

  // Générer initiales
  const getInitials = (prenom: string, nom: string) => {
    if (!prenom && !nom) return 'U'
    return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase()
  }

  const displayName = currentUser ? `${currentUser.prenom} ${currentUser.nom}` : 'Utilisateur'
  const displayRole = currentUser?.role === 'admin' ? 'Administrateur' : currentUser?.role || 'Compte'
  const initials = currentUser ? getInitials(currentUser.prenom, currentUser.nom) : 'U'
  const avatar = currentUser?.avatar

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200/80 bg-white/90 px-4 shadow-sm backdrop-blur-md sm:px-6 dark:border-gray-800 dark:bg-surface-dark/90">
      <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden" aria-label="Ouvrir le menu">
        <Menu className="h-5 w-5" />
      </Button>

      <div className="hidden flex-1 sm:block sm:max-w-md">
        <Input placeholder="Rechercher..." leftIcon={<Search className="h-4 w-4" />} className="h-9" />
      </div>

      <div className="ml-auto flex items-center gap-2 relative">
        
        {/* --- NOTIFICATIONS --- */}
        <div ref={notifRef} className="relative">
          <Button variant="ghost" size="icon" aria-label="Notifications" className="relative" onClick={() => setShowNotifMenu(!showNotifMenu)}>
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl overflow-hidden z-50">
              <div className="p-3 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                <span className="font-semibold text-sm text-gray-900 dark:text-white">Notifications</span>
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="text-xs text-agri-600 hover:text-agri-700 font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" /> Tout lire
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? notifications.map(n => (
                  <div key={n.id} onClick={() => markAsRead(n.id)} className={cn("p-3 border-b border-gray-50 dark:border-gray-800/50 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors", !n.read && "bg-agri-50/50 dark:bg-agri-900/10")}>
                    <p className={cn("text-sm", !n.read ? "font-semibold text-gray-900 dark:text-white" : "font-medium text-gray-700 dark:text-gray-300")}>{n.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{n.message}</p>
                    <p className="text-[10px] text-gray-400 mt-2">{new Date(n.date).toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                )) : (
                  <div className="p-4 text-center text-sm text-gray-500">Aucune notification</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* --- THEME TOGGLE --- */}
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Changer le thème">
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        {/* --- USER MENU --- */}
        <div ref={userMenuRef} className="relative">
          <button onClick={() => setShowUserMenu(!showUserMenu)} className={cn('flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800', showUserMenu && 'bg-gray-100 dark:bg-gray-800')}>
            {avatar ? (
              <img src={avatar} alt="Avatar" className="h-8 w-8 rounded-full object-cover border border-gray-200" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-agri-600 text-xs font-bold text-white">
                {initials}
              </div>
            )}
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{displayName}</p>
              <p className="text-xs text-gray-500 capitalize">{displayRole}</p>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl overflow-hidden z-50 py-1">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 md:hidden">
                <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{displayName}</p>
                <p className="text-xs text-gray-500 capitalize">{displayRole}</p>
              </div>
              <Link to="/admin/parametres" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                <UserIcon className="w-4 h-4" /> Mon profil
              </Link>
              <Link to="/admin/parametres" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                <Settings className="w-4 h-4" /> Paramètres
              </Link>
              <div className="border-t border-gray-100 dark:border-gray-800 my-1"></div>
              <button onClick={handleLogout} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10">
                <LogOut className="w-4 h-4" /> Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
