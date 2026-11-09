import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { PublicHeader, Footer } from '@/components/layout'
import { PageErrorBoundary, PageLoading } from '@/components/ui'
import { pageTransition } from '@/utils/animations'

export default function PublicLayout() {
  const location = useLocation()

  return (
    <div className="flex min-h-svh flex-col">
      <PublicHeader />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main key={location.pathname} className="flex-1" {...pageTransition}>
          <PageErrorBoundary key={location.pathname}>
            <Suspense fallback={<PageLoading />}>
              <Outlet />
            </Suspense>
          </PageErrorBoundary>
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  )
}
