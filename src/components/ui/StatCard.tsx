import type { LucideIcon } from 'lucide-react'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { cn } from '@/utils'
import { Card } from './Card'

export interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    label?: string
  }
  className?: string
  iconClassName?: string
}

export function StatCard({ title, value, icon: Icon, trend, className, iconClassName }: StatCardProps) {
  const isPositive = trend && trend.value >= 0

  return (
    <Card hover className={cn('group border-agri-100 bg-gradient-to-br from-white to-agri-50/70 dark:border-agri-900/40 dark:from-surface-card-dark dark:to-agri-950/30', className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold tracking-tight tabular-nums text-gray-900 dark:text-white">{value}</p>
          {trend && (
            <div className="flex items-center gap-1">
              {isPositive ? (
                <TrendingUp className="h-3.5 w-3.5 text-agri-500" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-red-500" />
              )}
              <span
                className={cn(
                  'text-xs font-medium',
                  isPositive ? 'text-agri-600 dark:text-agri-400' : 'text-red-600',
                )}
              >
                {isPositive ? '+' : ''}
                {trend.value}%
              </span>
              {trend.label && <span className="text-xs text-gray-400">{trend.label}</span>}
            </div>
          )}
        </div>
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-xl bg-agri-100 text-agri-600',
            'transition-transform duration-300 group-hover:rotate-[-6deg] group-hover:scale-110 dark:bg-agri-900/40 dark:text-agri-400',
            iconClassName,
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <div className="pointer-events-none absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-agri-500/5" />
    </Card>
  )
}
