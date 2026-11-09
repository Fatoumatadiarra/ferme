import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { MotionConfig } from 'framer-motion'
import { ThemeProvider } from '@/context'
import { router } from '@/routes'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <RouterProvider router={router} />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '10px',
              background: 'var(--color-surface-card-dark)',
              color: '#fff',
            },
          }}
        />
      </ThemeProvider>
    </MotionConfig>
  )
}
