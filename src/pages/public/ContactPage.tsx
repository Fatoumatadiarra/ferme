import { Mail, MapPin, Phone } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Button, Card, Input, SectionTitle } from '@/components/ui'

const STORAGE_KEY = 'ferme_contact_messages'

const contactSchema = z.object({
  nom: z.string().trim().min(2, 'Le nom est obligatoire.'),
  email: z.string().trim().email('Veuillez saisir une adresse email valide.'),
  sujet: z.string().trim().min(3, 'Le sujet est obligatoire.'),
  message: z.string().trim().min(10, 'Le message doit contenir au moins 10 caractères.'),
})

type ContactFormValues = z.infer<typeof contactSchema>

interface ContactMessage extends ContactFormValues {
  id: string
  createdAt: string
}

function readStoredMessages(): ContactMessage[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return []
    }

    return JSON.parse(raw) as ContactMessage[]
  } catch {
    return []
  }
}

function writeStoredMessages(messages: ContactMessage[]): void {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
}

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      nom: '',
      email: '',
      sujet: '',
      message: '',
    },
  })

  const onSubmit = handleSubmit((data) => {
    const existingMessages = readStoredMessages()
    const normalizedMessage = `${data.nom.toLowerCase()}|${data.email.toLowerCase()}|${data.sujet.toLowerCase()}|${data.message.toLowerCase().trim()}`
    const isDuplicate = existingMessages.some((message) => {
      const candidate = `${message.nom.toLowerCase()}|${message.email.toLowerCase()}|${message.sujet.toLowerCase()}|${message.message.toLowerCase().trim()}`
      return candidate === normalizedMessage
    })

    if (isDuplicate) {
      toast('Ce message a déjà été enregistré.', { icon: 'ℹ️' })
      return
    }

    const newMessage: ContactMessage = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }

    const updatedMessages = [newMessage, ...existingMessages]
    writeStoredMessages(updatedMessages)
    reset()
    toast.success('Votre message a été envoyé avec succès.')
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionTitle
        badge="Contact"
        title="Contactez-nous"
        subtitle="Une question ? Notre équipe est à votre disposition."
        align="center"
      />
      <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-agri-600" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Adresse</p>
                <p className="text-sm text-gray-500">DAKAR/KOLDA, Sénégal</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-agri-600" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Téléphone</p>
                <p className="text-sm text-gray-500">+221 77 437 90 96</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-agri-600" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Email</p>
                <p className="text-sm text-gray-500">fatoumatadiarradab@gmail.com</p>
              </div>
            </div>
          </Card>
        </div>
        <Card className="lg:col-span-3">
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Nom"
                placeholder="Votre nom"
                {...register('nom')}
                error={errors.nom?.message}
              />
              <Input
                label="Email"
                type="email"
                placeholder="votre@email.com"
                {...register('email')}
                error={errors.email?.message}
              />
            </div>
            <Input
              label="Sujet"
              placeholder="Objet de votre message"
              {...register('sujet')}
              error={errors.sujet?.message}
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Message
              </label>
              <textarea
                rows={4}
                placeholder="Votre message..."
                {...register('message')}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-agri-500 focus:ring-2 focus:ring-agri-500/20 focus:outline-none dark:border-gray-700 dark:bg-surface-card-dark dark:text-gray-100"
              />
              {errors.message?.message && (
                <p className="mt-1.5 text-xs text-red-500">{errors.message.message}</p>
              )}
            </div>
            <Button type="submit" isLoading={isSubmitting}>
              Envoyer le message
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
