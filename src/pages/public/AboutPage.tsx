import { Card, SectionTitle } from '@/components/ui'
import { Leaf, ShieldCheck, TrendingUp, Wheat, Cpu, BriefcaseBusiness } from 'lucide-react'
import { motion } from 'framer-motion'

const pillars = [
  {
    title: 'Modernisation',
    description: 'Digitaliser les opérations de la ferme pour gagner en rapidité et en précision.',
    icon: TrendingUp,
  },
  {
    title: 'Traçabilité',
    description: 'Suivre chaque activité, de la plantation à la récolte, avec une vue claire et fiable.',
    icon: ShieldCheck,
  },
  {
    title: 'Durabilité',
    description: 'Optimiser la production agricole avec des pratiques plus intelligentes et plus responsables.',
    icon: Leaf,
  },
]

const essentialCards = [
  {
    title: 'Sécurité alimentaire',
    description: 'La ferme est notre garantie de manger à notre faim. Elle assure notre sécurité alimentaire en produisant des aliments sains et locaux. Soutenir nos agriculteurs permet de réduire notre dépendance envers les importations alimentaires et garantit une alimentation de qualité pour toute la population.',
    icon: Wheat,
  },
  {
    title: "Innovation et protection de l'environnement",
    description: "Les fermes modernes utilisent des technologies innovantes telles que les drones, les systèmes d'irrigation intelligents, les capteurs et les pratiques agricoles durables. Ces innovations permettent de préserver les sols, la biodiversité et de contribuer à la lutte contre le changement climatique.",
    icon: Cpu,
  },
  {
    title: 'Développement économique',
    description: "Les fermes constituent un moteur essentiel de l'économie locale. Elles créent des emplois, soutiennent les familles rurales, développent les villages et renforcent les circuits courts en favorisant la consommation de produits locaux.",
    icon: BriefcaseBusiness,
  }
]

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionTitle
        badge="À propos"
        title="Notre ferme agricole intégrée"
        subtitle="Une exploitation moderne combinant maraîchage, élevage, aviculture et aquaculture au Sénégal."
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="bg-gradient-to-br from-agri-50 to-white dark:from-agri-950/20 dark:to-surface-card-dark">
          <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Notre mission</h3>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            Moderniser la gestion agricole en centralisant toutes les informations de l’exploitation dans une plateforme web intuitive.
            Notre objectif est d’améliorer la productivité, la traçabilité et la prise de décision pour les fermes agricoles intégrées.
          </p>
        </Card>

        <Card>
          <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Notre vision</h3>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            Devenir la référence en matière de digitalisation agricole au Sénégal, en proposant une solution complète qui combine gestion
            opérationnelle, analytics et accompagnement pédagogique à travers des fiches techniques détaillées.
          </p>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {pillars.map((pillar) => (
          <Card key={pillar.title} hover className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-agri-100 text-agri-600 dark:bg-agri-900/40 dark:text-agri-400">
              <pillar.icon className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{pillar.title}</h3>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{pillar.description}</p>
          </Card>
        ))}
      </div>

      <div className="mt-24">
        <SectionTitle
          title="Pourquoi les fermes sont essentielles pour nous ?"
          subtitle="Un pilier fondamental pour notre avenir commun."
        />
        
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-6">
            <div className="grid gap-5">
              {essentialCards.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card hover className="flex flex-col sm:flex-row gap-5 p-6 bg-white dark:bg-surface-card-dark border-gray-100 dark:border-gray-800">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-agri-100 text-agri-600 dark:bg-agri-900/40 dark:text-agri-400">
                      <item.icon className="h-7 w-7" />
                    </div>
                    <div>
                      <h4 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">{item.title}</h4>
                      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 font-medium">{item.description}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-8 rounded-2xl bg-gradient-to-br from-agri-600 to-agri-700 p-8 text-white shadow-xl shadow-agri-900/10"
            >
              <h4 className="mb-4 text-2xl font-bold flex items-center gap-2">
                <Leaf className="h-6 w-6 text-agri-300" />
                En résumé
              </h4>
              <p className="text-agri-50 leading-relaxed font-medium text-[15px]">
                Les fermes jouent un rôle fondamental dans notre société. Elles assurent notre alimentation, protègent notre environnement et participent activement au développement économique. Soutenir l'agriculture, c'est investir dans un avenir durable pour les générations présentes et futures.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative h-[400px] lg:h-[calc(100%-2rem)] min-h-[500px] overflow-hidden rounded-3xl shadow-xl lg:sticky lg:top-24 group"
          >
            <img
              src="/images/landing/importance-ferme.jpg"
              alt="Ferme moderne"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-md border border-white/20">
                <ShieldCheck className="h-4 w-4 text-green-300" />
                <span>Agriculture de Précision</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
