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

const loginSchema = z.object({
  email: z.string().trim().email('Veuillez saisir une adresse email valide.'),
  password: z.string().min(1, 'Le mot de passe est obligatoire.'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = handleSubmit((data) => {
    const users = StorageService.get<User[]>(STORAGE_KEYS.USERS) ?? []
    const matchingUser = users.find(
      (user) => user.email.toLowerCase() === data.email.toLowerCase() && user.password === data.password,
    )

    if (!matchingUser) {
      setErrorMessage('Email ou mot de passe incorrect.')
      return
    }

    StorageService.set(STORAGE_KEYS.AUTH, {
      userId: matchingUser.id,
      token: crypto.randomUUID(),
      expiresAt: new Date().toISOString(),
    })
    setErrorMessage('')
    navigate(ROUTES.ADMIN.DASHBOARD)
  })

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-agri">
            <Leaf className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Connexion</h1>
          <p className="mt-1 text-sm text-gray-500">Accédez à votre espace de gestion</p>
        </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          <Input label="Email" type="email" placeholder="admin@ferme.sn" {...register('email')} error={errors.email?.message} />
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
          {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Se connecter
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          Pas encore de compte ?{' '}
          <Link to={ROUTES.REGISTER} className="font-medium text-agri-600 hover:text-agri-700">
            S'inscrire
          </Link>
        </p>
      </Card>
    </div>
  )
}
