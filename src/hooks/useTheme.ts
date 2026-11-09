import { useCallback, useEffect, useState } from 'react'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import { StorageService } from '@/services/storage.service'
import type { Theme } from '@/types'

function getInitialTheme(): Theme {
  const stored = StorageService.get<Theme>(STORAGE_KEYS.THEME)
  if (stored) return stored

  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }

  return 'light'
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => getInitialTheme())

  useEffect(() => {
    applyTheme(theme)
    StorageService.set(STORAGE_KEYS.THEME, theme)
  }, [theme])

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'))
  }, [])

  return { theme, setTheme, toggleTheme, isDark: theme === 'dark' }
}
