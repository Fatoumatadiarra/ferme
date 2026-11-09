import { useCallback, useEffect, useState } from 'react'
import { StorageService } from '@/services/storage.service'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = StorageService.get<T>(key)
    return item ?? initialValue
  })

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      setStoredValue((prev) => {
        const newValue = value instanceof Function ? value(prev) : value
        StorageService.set(key, newValue)
        return newValue
      })
    },
    [key],
  )

  useEffect(() => {
    const item = StorageService.get<T>(key)
    if (item !== null) {
      setStoredValue(item)
    }
  }, [key])

  return [storedValue, setValue] as const
}
