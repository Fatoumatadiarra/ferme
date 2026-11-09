import { createContext, useContext, type ReactNode } from 'react'
import { useTheme } from '@/hooks/useTheme'
import type { Theme } from '@/types'

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  isDark: boolean
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const themeValue = useTheme()

  return <ThemeContext.Provider value={themeValue}>{children}</ThemeContext.Provider>
}

export function useThemeContext(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useThemeContext doit être utilisé dans un ThemeProvider')
  }
  return context
}
