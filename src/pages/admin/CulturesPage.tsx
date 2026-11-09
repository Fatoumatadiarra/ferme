import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  Input,
  SectionTitle,
  Table,
  TableBody,
  TableCell,
  TableHeadCell,
  TableHeader,
  TableRow,
} from '@/components/ui'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import { StorageService } from '@/services'
import { formatDate } from '@/utils'

const cultureSchema = z.object({
  nom: z.string().trim().min(2, 'Le nom est obligatoire.'),
  type: z.string().trim().min(2, 'Le type est obligatoire.'),
  surface: z.string().trim().min(1, 'La surface est obligatoire.'),
  etat: z.string().trim().min(2, 'L’état est obligatoire.'),
  datePlantation: z.string().trim().min(4, 'La date est obligatoire.'),
  recolteEstimee: z.string().trim().min(1, 'La récolte estimée est obligatoire.'),
})

type CultureFormValues = z.infer<typeof cultureSchema>

interface CultureRecord extends CultureFormValues {
  id: string
  createdAt: string
}

const emptyValues: CultureFormValues = {
  nom: '',
  type: '',
  surface: '',
  etat: '',
  datePlantation: '',
  recolteEstimee: '',
}

export default function CulturesPage() {
  const [cultures, setCultures] = useState<CultureRecord[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedCultureId, setSelectedCultureId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CultureFormValues>({
    resolver: zodResolver(cultureSchema),
    defaultValues: emptyValues,
  })

  useEffect(() => {
    const stored = StorageService.get<CultureRecord[]>(STORAGE_KEYS.CULTURES) ?? []
    setCultures(stored)
    if (stored[0]) {
      setSelectedCultureId(stored[0].id)
    }
  }, [])

  const saveCultures = (next: CultureRecord[]) => {
    setCultures(next)
    StorageService.set(STORAGE_KEYS.CULTURES, next)
  }

  const selectedCulture = useMemo(
    () => cultures.find((culture) => culture.id === selectedCultureId) ?? null,
    [cultures, selectedCultureId],
  )

  const resetForm = () => {
    reset(emptyValues)
    setEditingId(null)
  }

  const onSubmit = handleSubmit((data) => {
    if (editingId) {
      const updated = cultures.map((culture) => (culture.id === editingId ? { ...culture, ...data } : culture))
      saveCultures(updated)
      toast.success('Culture mise à jour.')
    } else {
      const newCulture: CultureRecord = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      }
      const next = [newCulture, ...cultures]
      saveCultures(next)
      setSelectedCultureId(newCulture.id)
      toast.success('Culture ajoutée.')
    }
    resetForm()
  })

  const handleEdit = (culture: CultureRecord) => {
    setEditingId(culture.id)
    setSelectedCultureId(culture.id)
    reset({
      nom: culture.nom,
      type: culture.type,
      surface: culture.surface,
      etat: culture.etat,
      datePlantation: culture.datePlantation,
      recolteEstimee: culture.recolteEstimee,
    })
  }

  const handleDelete = (id: string) => {
    const next = cultures.filter((culture) => culture.id !== id)
    saveCultures(next)
    if (selectedCultureId === id) {
      setSelectedCultureId(next[0]?.id ?? null)
    }
    toast.success('Culture supprimée.')
    if (editingId === id) {
      resetForm()
    }
  }

  return (
    <div className="space-y-6">
      <SectionTitle title="Gestion des cultures" subtitle="Ajoutez, consultez et gérez vos cultures maraîchères." badge="Maraîchage" />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Modifier une culture' : 'Ajouter une culture'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Nom de la culture" {...register('nom')} error={errors.nom?.message} />
                <Input label="Type" {...register('type')} error={errors.type?.message} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Surface" {...register('surface')} error={errors.surface?.message} />
                <Input label="État" {...register('etat')} error={errors.etat?.message} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Date de plantation" type="date" {...register('datePlantation')} error={errors.datePlantation?.message} />
                <Input label="Récolte estimée" {...register('recolteEstimee')} error={errors.recolteEstimee?.message} />
              </div>
              <div className="flex gap-3">
                <Button type="submit" leftIcon={<Plus className="h-4 w-4" />}>
                  {editingId ? 'Enregistrer' : 'Ajouter la culture'}
                </Button>
                {editingId && (
                  <Button type="button" variant="ghost" onClick={resetForm}>
                    Annuler
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fiche détaillée</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedCulture ? (
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedCulture.nom}</p>
                <p>Type : {selectedCulture.type}</p>
                <p>Surface : {selectedCulture.surface}</p>
                <p>État : {selectedCulture.etat}</p>
                <p>Date de plantation : {selectedCulture.datePlantation}</p>
                <p>Récolte estimée : {selectedCulture.recolteEstimee}</p>
                <p>Ajoutée le : {formatDate(selectedCulture.createdAt)}</p>
              </div>
            ) : (
              <EmptyState title="Aucune culture sélectionnée" description="Choisissez une culture dans la liste pour ouvrir sa fiche détaillée." />
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des cultures</CardTitle>
        </CardHeader>
        <CardContent>
          {cultures.length === 0 ? (
            <EmptyState title="Aucune culture enregistrée" description="Ajoutez une culture pour commencer le suivi." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeadCell>Culture</TableHeadCell>
                  <TableHeadCell>Type</TableHeadCell>
                  <TableHeadCell>Surface</TableHeadCell>
                  <TableHeadCell>État</TableHeadCell>
                  <TableHeadCell>Actions</TableHeadCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cultures.map((culture) => (
                  <TableRow key={culture.id}>
                    <TableCell>{culture.nom}</TableCell>
                    <TableCell>{culture.type}</TableCell>
                    <TableCell>{culture.surface}</TableCell>
                    <TableCell>{culture.etat}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" type="button" onClick={() => setSelectedCultureId(culture.id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" type="button" onClick={() => handleEdit(culture)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="danger" size="icon" type="button" onClick={() => handleDelete(culture.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
