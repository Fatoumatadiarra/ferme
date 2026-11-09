import { Suspense, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AdminHeader, Sidebar } from '@/components/layout'
import { PageErrorBoundary, PageLoading } from '@/components/ui'
import { useIsMobile } from '@/hooks'
import { cn } from '@/utils'
import { pageTransition } from '@/utils/animations'

export default function AdminLayout() {
  const location = useLocation()
  const isMobile = useIsMobile()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="min-h-svh bg-surface-muted dark:bg-surface-dark">
      <Sidebar
        isOpen={sidebarOpen || !isMobile}
        onClose={() => setSidebarOpen(false)}
        collapsed={!isMobile && collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />

      <div
        className={cn(
          'flex min-h-svh flex-col transition-all duration-300',
          !isMobile && (collapsed ? 'lg:pl-[72px]' : 'lg:pl-64'),
        )}
      >
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} sidebarCollapsed={collapsed} />

        <AnimatePresence mode="wait" initial={false}>
          <motion.main
            key={location.pathname}
            className="flex-1 p-4 sm:p-6 lg:p-8"
            {...pageTransition}
          >
            <PageErrorBoundary key={location.pathname}>
              <Suspense fallback={<PageLoading />}>
                <Outlet />
              </Suspense>
            </PageErrorBoundary>
          </motion.main>
        </AnimatePresence>

        <footer className="border-t border-gray-200 px-6 py-3 text-center text-xs text-gray-400 dark:border-gray-800">
          AgriFerme &mdash; Plateforme de gestion agricole intégrée
        </footer>
      </div>
    </div>
  )
}
