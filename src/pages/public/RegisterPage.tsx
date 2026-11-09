import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Leaf } from 'lucide-react'
import { ROUTES } from '@/constants'
import { Button, Card, Input } from '@/components/ui'
import { StorageService } from '@/services'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import type { User } from '@/types'

const registerSchema = z
  .object({
    prenom: z.string().trim().min(2, 'Le prénom est obligatoire.'),
    nom: z.string().trim().min(2, 'Le nom est obligatoire.'),
    email: z.string().trim().email('Veuillez saisir une adresse email valide.'),
    password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères.'),
    confirmPassword: z.string().min(1, 'Veuillez confirmer le mot de passe.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas.',
    path: ['confirmPassword'],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { prenom: '', nom: '', email: '', password: '', confirmPassword: '' },
  })

  const onSubmit = handleSubmit((data) => {
    const users = StorageService.get<User[]>(STORAGE_KEYS.USERS) ?? []
    const exists = users.some((user) => user.email.toLowerCase() === data.email.toLowerCase())

    if (exists) {
      setMessage('Cet email est déjà utilisé.')
      return
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      email: data.email,
      password: data.password,
      nom: data.nom,
      prenom: data.prenom,
      role: 'admin',
      secteur: 'Administration',
      statut: 'actif',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    StorageService.set(STORAGE_KEYS.USERS, [...users, newUser])
    reset()
    setMessage('Compte créé avec succès.')
    navigate(ROUTES.LOGIN)
  })

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-agri">
            <Leaf className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inscription</h1>
          <p className="mt-1 text-sm text-gray-500">Créez votre compte de gestion</p>
        </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Prénom" placeholder="Amadou" {...register('prenom')} error={errors.prenom?.message} />
            <Input label="Nom" placeholder="Diop" {...register('nom')} error={errors.nom?.message} />
          </div>
          <Input label="Email" type="email" placeholder="votre@email.com" {...register('email')} error={errors.email?.message} />
          <Input
            label="Mot de passe"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            {...register('password')}
            error={errors.password?.message}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="flex h-5 w-5 items-center justify-center text-gray-500 transition hover:text-gray-700 focus:outline-none"
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />
          <Input
            label="Confirmer le mot de passe"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="••••••••"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="flex h-5 w-5 items-center justify-center text-gray-500 transition hover:text-gray-700 focus:outline-none"
                aria-label={showConfirmPassword ? 'Masquer la confirmation du mot de passe' : 'Afficher la confirmation du mot de passe'}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />
          {message && <p className="text-sm text-agri-600">{message}</p>}
          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Créer mon compte
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          Déjà un compte ?{' '}
          <Link to={ROUTES.LOGIN} className="font-medium text-agri-600 hover:text-agri-700">
            Se connecter
          </Link>
        </p>
      </Card>
    </div>
  )
}
