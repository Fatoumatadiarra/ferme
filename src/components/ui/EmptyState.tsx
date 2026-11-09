import type { ReactNode } from 'react'
import { Inbox } from 'lucide-react'
import { cn } from '@/utils'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
  className?: string
}

export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50/70 p-10 text-center dark:border-gray-700 dark:bg-gray-900/20', className)}>
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-agri-100 text-agri-600 dark:bg-agri-900/40 dark:text-agri-400">
        {icon ?? <Inbox className="h-7 w-7" />}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      {description && <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
