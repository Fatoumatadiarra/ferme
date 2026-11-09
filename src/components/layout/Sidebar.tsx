import { Link, NavLink } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Leaf, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ADMIN_NAV, APP_NAME, ROUTES } from '@/constants'
import { cn } from '@/utils'
import { Button } from '@/components/ui'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  collapsed: boolean
  onToggleCollapse: () => void
}

export function Sidebar({ isOpen, onClose, collapsed, onToggleCollapse }: SidebarProps) {
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          'fixed top-0 left-0 z-50 flex h-full flex-col border-r border-gray-200 bg-white transition-all duration-300',
          'dark:border-gray-800 dark:bg-surface-card-dark',
          collapsed ? 'w-[72px]' : 'w-64',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
        style={{ boxShadow: 'var(--shadow-sidebar)' }}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-100 px-4 dark:border-gray-800">
          <Link to={ROUTES.ADMIN.DASHBOARD} className="group flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-agri shadow-sm transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-105">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="truncate font-heading text-base font-bold text-gray-900 dark:text-white"
              >
                {APP_NAME}
              </motion.span>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="hidden h-8 w-8 lg:flex"
            aria-label={collapsed ? 'Étendre' : 'Réduire'}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {ADMIN_NAV.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === ROUTES.ADMIN.DASHBOARD}
              onClick={onClose}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                cn(
                  'group relative flex items-center gap-3 overflow-hidden rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-agri-700 to-agri-600 text-white shadow-md shadow-agri-900/15'
                    : 'text-gray-600 hover:translate-x-0.5 hover:bg-agri-50 hover:text-agri-700 dark:text-gray-400 dark:hover:bg-agri-900/20 dark:hover:text-agri-300',
                )
              }
            >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="sidebar-active-indicator"
                        className="absolute inset-y-2 left-0 w-0.5 rounded-r-full bg-white/80"
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      />
                    )}
                    <motion.span
                      className="relative z-10 flex shrink-0"
                      whileHover={{ scale: 1.12, rotate: isActive ? 0 : -5 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                    >
                      <item.icon className="h-5 w-5" />
                    </motion.span>
                    {!collapsed && (
                      <div className="relative z-10 min-w-0 flex-1">
                        <span className="block truncate">{item.label}</span>
                      </div>
                    )}
                  </>
                )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-gray-100 p-3 dark:border-gray-800">
          <Link to={ROUTES.HOME}>
            <Button
              variant="ghost"
              className={cn('w-full text-gray-500', collapsed ? 'px-0' : 'justify-start')}
              title="Retour au site"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="ml-2">Retour au site</span>}
            </Button>
          </Link>
        </div>
      </aside>
    </>
  )
}
