import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/utils'

interface TableProps extends HTMLAttributes<HTMLTableElement> {
  children: ReactNode
}

export function Table({ children, className, ...props }: TableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-surface-card-dark">
      <table className={cn('min-w-full divide-y divide-gray-200 dark:divide-gray-800', className)} {...props}>
        {children}
      </table>
    </div>
  )
}

interface TableHeadProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode
}

export function TableHeader({ children, className, ...props }: TableHeadProps) {
  return (
    <thead className={cn('bg-gray-50 dark:bg-gray-900/40', className)} {...props}>
      {children}
    </thead>
  )
}

interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode
}

export function TableBody({ children, className, ...props }: TableBodyProps) {
  return (
    <tbody className={cn('divide-y divide-gray-200 dark:divide-gray-800', className)} {...props}>
      {children}
    </tbody>
  )
}

interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode
}

export function TableRow({ children, className, ...props }: TableRowProps) {
  return <tr className={cn('hover:bg-gray-50 dark:hover:bg-gray-900/20', className)} {...props}>{children}</tr>
}

interface TableCellProps extends HTMLAttributes<HTMLTableCellElement> {
  children: ReactNode
}

export function TableCell({ children, className, ...props }: TableCellProps) {
  return (
    <td className={cn('px-4 py-3 text-sm text-gray-700 dark:text-gray-300', className)} {...props}>
      {children}
    </td>
  )
}

interface TableHeadCellProps extends HTMLAttributes<HTMLTableCellElement> {
  children: ReactNode
}

export function TableHeadCell({ children, className, ...props }: TableHeadCellProps) {
  return (
    <th className={cn('px-4 py-3 text-left text-xs font-semibold tracking-wide text-gray-500 uppercase', className)} {...props}>
      {children}
    </th>
  )
}
