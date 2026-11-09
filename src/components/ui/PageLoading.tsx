export function PageLoading() {
  return (
    <div role="status" aria-label="Chargement de la page" className="space-y-6">
      <span className="sr-only">Chargement…</span>
      <div className="h-24 animate-pulse rounded-3xl bg-gray-200/70 dark:bg-gray-800/70" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-2xl bg-gray-200/70 dark:bg-gray-800/70"
          />
        ))}
      </div>
      <div className="h-72 animate-pulse rounded-2xl bg-gray-200/70 dark:bg-gray-800/70" />
    </div>
  )
}
