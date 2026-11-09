import { cn } from '@/utils'

interface EmployeeAvatarProps {
  prenom: string
  nom: string
  className?: string
}

export function EmployeeAvatar({ prenom, nom, className }: EmployeeAvatarProps) {
  const initials = `${prenom.trim().charAt(0)}${nom.trim().charAt(0)}`.toLocaleUpperCase('fr-FR') || 'E'

  return (
    <div
      role="img"
      aria-label={`Avatar de ${prenom} ${nom}`}
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full border border-white/80 bg-gradient-to-br from-agri-100 via-gray-100 to-agri-200 font-heading font-bold tracking-wide text-agri-800 shadow-sm dark:border-gray-700 dark:from-agri-950 dark:via-gray-800 dark:to-agri-900 dark:text-agri-200',
        className,
      )}
    >
      {initials}
    </div>
  )
}
