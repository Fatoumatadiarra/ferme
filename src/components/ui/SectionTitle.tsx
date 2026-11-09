import type { HTMLAttributes } from 'react'
import { cn } from '@/utils'

export interface SectionTitleProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  badge?: string
}

export function SectionTitle({
  title,
  subtitle,
  align = 'left',
  badge,
  className,
  ...props
}: SectionTitleProps) {
  return (
    <div
      className={cn('mb-8', align === 'center' && 'text-center', className)}
      {...props}
    >
      {badge && (
        <span className="mb-3 inline-block rounded-full bg-agri-100 px-3 py-1 text-xs font-semibold tracking-wide text-agri-700 uppercase dark:bg-agri-900/40 dark:text-agri-300">
          {badge}
        </span>
      )}
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl dark:text-white">
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'mt-2 max-w-2xl text-gray-500 dark:text-gray-400',
            align === 'center' && 'mx-auto',
          )}
        >
          {subtitle}
        </p>
      )}
      <div
        className={cn(
          'mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-agri-500 to-agri-300',
          align === 'center' && 'mx-auto',
        )}
      />
    </div>
  )
}
