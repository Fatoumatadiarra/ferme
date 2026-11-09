import type { LucideIcon } from 'lucide-react'
import { Construction } from 'lucide-react'
import { Badge, Card, SectionTitle } from '@/components/ui'

interface ModulePlaceholderProps {
  title: string
  description: string
  icon?: LucideIcon
  badge?: string
}

export function ModulePlaceholder({ title, description, icon: Icon = Construction, badge }: ModulePlaceholderProps) {
  return (
    <div>
      <SectionTitle title={title} subtitle={description} badge={badge} />
      <Card className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-agri-100 text-agri-600 dark:bg-agri-900/40 dark:text-agri-400">
          <Icon className="h-8 w-8" />
        </div>
        <Badge variant="warning" className="mb-3">
          Module en cours de développement
        </Badge>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
          Ce module sera développé dans une prochaine étape. L'architecture est prête à recevoir
          les fonctionnalités complètes.
        </p>
      </Card>
    </div>
  )
}
