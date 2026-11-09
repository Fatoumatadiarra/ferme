import { Component, type ErrorInfo, type ReactNode } from 'react'

interface PageErrorBoundaryProps {
  children: ReactNode
}

interface PageErrorBoundaryState {
  hasError: boolean
}

export class PageErrorBoundary extends Component<PageErrorBoundaryProps, PageErrorBoundaryState> {
  state: PageErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): PageErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Erreur lors du chargement de la page.', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm dark:border-red-900/50 dark:bg-surface-card-dark">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Impossible de charger cette page</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Une erreur inattendue est survenue. Rechargez la page pour réessayer.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 rounded-lg bg-agri-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-agri-700"
          >
            Recharger la page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
