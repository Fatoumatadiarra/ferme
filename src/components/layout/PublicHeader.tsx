import { Link, NavLink } from 'react-router-dom'
import { Leaf, Menu, Moon, Sun, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { APP_NAME, PUBLIC_NAV, ROUTES } from '@/constants'
import { useThemeContext } from '@/context'
import { cn } from '@/utils'
import { Button } from '@/components/ui'

interface PublicHeaderProps {
  transparent?: boolean
}

export function PublicHeader({ transparent = false }: PublicHeaderProps) {
  const { toggleTheme, isDark } = useThemeContext()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-300',
        transparent
          ? 'border-transparent bg-transparent'
          : 'border-b border-gray-200/80 bg-white/90 backdrop-blur-md dark:border-gray-800 dark:bg-surface-dark/90',
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to={ROUTES.HOME} className="group flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-agri shadow-sm">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <span className="font-heading text-lg font-bold text-gray-900 dark:text-white">
            {APP_NAME}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {PUBLIC_NAV.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === ROUTES.HOME}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-agri-50 text-agri-700 dark:bg-agri-900/30 dark:text-agri-300'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Changer le thème">
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <Link to={ROUTES.LOGIN} className="hidden sm:block">
            <Button variant="ghost" size="sm">
              Connexion
            </Button>
          </Link>
          <Link to={ROUTES.REGISTER} className="hidden sm:block">
            <Button size="sm">Inscription</Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-gray-200 md:hidden dark:border-gray-800"
          >
            <nav className="flex flex-col gap-1 px-4 py-4">
              {PUBLIC_NAV.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === ROUTES.HOME}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'rounded-lg px-4 py-3 text-sm font-medium',
                      isActive
                        ? 'bg-agri-50 text-agri-700 dark:bg-agri-900/30 dark:text-agri-300'
                        : 'text-gray-600 dark:text-gray-300',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <div className="mt-2 flex flex-col gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
                <Link to={ROUTES.LOGIN} onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Connexion
                  </Button>
                </Link>
                <Link to={ROUTES.REGISTER} onClick={() => setMobileOpen(false)}>
                  <Button className="w-full">Inscription</Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
