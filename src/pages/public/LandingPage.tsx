import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BarChart3,
  Fish,
  Leaf,
  Shield,
  Sprout,
  Tractor,
  Users,
} from 'lucide-react'
import { APP_NAME, APP_TAGLINE, ROUTES } from '@/constants'
import { Button, Card, SectionTitle, StatCard } from '@/components/ui'
import { fadeInUp, staggerContainer, staggerItem } from '@/utils/animations'

const features = [
  {
    icon: Sprout,
    title: 'Maraîchage',
    description: 'Suivez vos cultures, récoltes et fiches techniques détaillées.',
  },
  {
    icon: Tractor,
    title: 'Élevage & Aviculture',
    description: 'Gérez vos animaux, vaccinations, alimentation et production.',
  },
  {
    icon: Fish,
    title: 'Aquaculture',
    description: 'Contrôlez vos bassins, qualité de l\'eau et récoltes piscicoles.',
  },
  {
    icon: Users,
    title: 'Ressources humaines',
    description: 'Organisez vos équipes par secteur d\'activité.',
  },
  {
    icon: BarChart3,
    title: 'Statistiques',
    description: 'Visualisez vos performances avec des graphiques interactifs.',
  },
  {
    icon: Shield,
    title: 'Traçabilité',
    description: 'Suivez l\'ensemble de votre chaîne de production.',
  },
]

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-to-br from-agri-950 via-agri-900 to-agri-800 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.16),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.2),_transparent_28%)]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggIGQ9Ik0zNiAzNGg2djZoLTZ6bTAtMzBoNnY2aC02em0tMzAgMzBoNnY2aC02em0wLTMwaDZ2NmgtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm backdrop-blur-sm">
              <Leaf className="h-4 w-4 text-agri-300" />
              <span>Solution AgriTech moderne</span>
            </div>
            <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              {APP_NAME}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-agri-100 sm:text-xl">{APP_TAGLINE}</p>
            <p className="mt-4 text-base text-agri-200/80">
              Centralisez la gestion de votre ferme agricole intégrée : maraîchage, élevage,
              aviculture, aquaculture et bien plus encore, avec une vue d’ensemble claire sur les opérations du jour.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to={ROUTES.ADMIN.DASHBOARD}>
                <Button size="lg" className="bg-white text-agri-800 hover:bg-agri-50">
                  Accéder au Dashboard
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to={ROUTES.ABOUT}>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  En savoir plus
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats preview */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-agri-600 dark:text-agri-400">Impact rapide</p>
          <h2 className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">Des résultats visibles dès les premiers jours</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Cultures actives" value="10" icon={Sprout} trend={{ value: 12, label: 'ce mois' }} />
          <StatCard title="Employés" value="24" icon={Users} trend={{ value: 5, label: 'ce mois' }} />
          <StatCard title="Production (t)" value="156" icon={BarChart3} trend={{ value: 8, label: 'ce mois' }} />
          <StatCard title="Secteurs" value="4" icon={Fish} />
        </div>
      </section>

      {/* Features */}
      <section className="bg-white/70 py-16 backdrop-blur-sm dark:bg-surface-card-dark/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            badge="Fonctionnalités"
            title="Une plateforme complète pour votre ferme"
            subtitle="Gérez l'ensemble de vos activités agricoles depuis une interface unique, moderne et intuitive."
            align="center"
          />
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature) => (
              <motion.div key={feature.title} variants={staggerItem}>
                <Card hover className="h-full">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-agri-100 text-agri-600 dark:bg-agri-900/40 dark:text-agri-400">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-linear-to-r from-agri-600 to-agri-700 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-heading text-3xl font-bold text-white">
            Prêt à moderniser votre ferme ?
          </h2>
          <p className="mt-4 text-lg text-agri-100">
            Rejoignez la révolution numérique de l'agriculture sénégalaise.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to={ROUTES.REGISTER}>
              <Button size="lg" className="bg-white text-agri-800 hover:bg-agri-50">
                Créer un compte
              </Button>
            </Link>
            <Link to={ROUTES.CONTACT}>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Nous contacter
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
