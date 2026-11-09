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

const fruitSchema = z.object({
  nom: z.string().trim().min(2, 'Le nom est obligatoire.'),
  variete: z.string().trim().min(2, 'La variété est obligatoire.'),
  surface: z.string().trim().min(1, 'La surface est obligatoire.'),
  etat: z.string().trim().min(2, 'L’état est obligatoire.'),
  datePlantation: z.string().trim().min(4, 'La date est obligatoire.'),
  rendementEstime: z.string().trim().min(1, 'Le rendement est obligatoire.'),
})

type FruitFormValues = z.infer<typeof fruitSchema>

interface FruitRecord extends FruitFormValues {
  id: string
  createdAt: string
}

const emptyValues: FruitFormValues = {
  nom: '',
  variete: '',
  surface: '',
  etat: '',
  datePlantation: '',
  rendementEstime: '',
}

export const INITIAL_FRUITS_DATA: FruitRecord[] = [
  {
    id: 'fruit-banane',
    nom: 'Banane',
    variete: 'Grande Naine / Poyo',
    surface: '3.5 ha',
    etat: 'En production',
    datePlantation: '2025-04-10',
    rendementEstime: '45 t/ha/an',
    createdAt: new Date('2025-04-10').toISOString(),
  },
  {
    id: 'fruit-mandarine',
    nom: 'Mandarine',
    variete: 'Clémentine Commune',
    surface: '2.0 ha',
    etat: 'En floraison',
    datePlantation: '2024-11-15',
    rendementEstime: '28 t/ha/an',
    createdAt: new Date('2024-11-15').toISOString(),
  },
  {
    id: 'fruit-papaye',
    nom: 'Papaye',
    variete: 'Solo Formosa',
    surface: '1.5 ha',
    etat: 'Récolte imminente',
    datePlantation: '2025-07-20',
    rendementEstime: '35 t/ha/an',
    createdAt: new Date('2025-07-20').toISOString(),
  },
  {
    id: 'fruit-mangue',
    nom: 'Mangue',
    variete: 'Kent & Keitt',
    surface: '4.0 ha',
    etat: 'En croissance',
    datePlantation: '2023-08-05',
    rendementEstime: '22 t/ha/an',
    createdAt: new Date('2023-08-05').toISOString(),
  }
]

export default function FruitsPage() {
  const [fruits, setFruits] = useState<FruitRecord[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedFruitId, setSelectedFruitId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FruitFormValues>({
    resolver: zodResolver(fruitSchema),
    defaultValues: emptyValues,
  })

  useEffect(() => {
    const stored = StorageService.get<FruitRecord[]>(STORAGE_KEYS.FRUITS)
    if (!stored || stored.length === 0) {
      StorageService.set(STORAGE_KEYS.FRUITS, INITIAL_FRUITS_DATA)
      setFruits(INITIAL_FRUITS_DATA)
      setSelectedFruitId(INITIAL_FRUITS_DATA[0].id)
    } else {
      setFruits(stored)
      if (stored[0]) {
        setSelectedFruitId(stored[0].id)
      }
    }
  }, [])

  const saveFruits = (next: FruitRecord[]) => {
    setFruits(next)
    StorageService.set(STORAGE_KEYS.FRUITS, next)
  }

  const selectedFruit = useMemo(
    () => fruits.find((fruit) => fruit.id === selectedFruitId) ?? null,
    [fruits, selectedFruitId],
  )

  const resetForm = () => {
    reset(emptyValues)
    setEditingId(null)
  }

  const onSubmit = handleSubmit((data) => {
    if (editingId) {
      const updated = fruits.map((fruit) => (fruit.id === editingId ? { ...fruit, ...data } : fruit))
      saveFruits(updated)
      toast.success('Culture fruitière mise à jour.')
    } else {
      const newFruit: FruitRecord = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      }
      const next = [newFruit, ...fruits]
      saveFruits(next)
      setSelectedFruitId(newFruit.id)
      toast.success('Culture fruitière ajoutée.')
    }
    resetForm()
  })

  const handleEdit = (fruit: FruitRecord) => {
    setEditingId(fruit.id)
    setSelectedFruitId(fruit.id)
    reset({
      nom: fruit.nom,
      variete: fruit.variete,
      surface: fruit.surface,
      etat: fruit.etat,
      datePlantation: fruit.datePlantation,
      rendementEstime: fruit.rendementEstime,
    })
  }

  const handleDelete = (id: string) => {
    const next = fruits.filter((fruit) => fruit.id !== id)
    saveFruits(next)
    if (selectedFruitId === id) {
      setSelectedFruitId(next[0]?.id ?? null)
    }
    toast.success('Culture fruitière supprimée.')
    if (editingId === id) {
      resetForm()
    }
  }

  return (
    <div className="space-y-6">
      <SectionTitle title="Gestion des fruits" subtitle="Suivez l’état des vergers et cultures fruitières." badge="Fruits" />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Modifier une culture fruitière' : 'Ajouter une culture fruitière'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Nom" {...register('nom')} error={errors.nom?.message} />
                <Input label="Variété" {...register('variete')} error={errors.variete?.message} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Surface" {...register('surface')} error={errors.surface?.message} />
                <Input label="État" {...register('etat')} error={errors.etat?.message} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Date de plantation" type="date" {...register('datePlantation')} error={errors.datePlantation?.message} />
                <Input label="Rendement estimé" {...register('rendementEstime')} error={errors.rendementEstime?.message} />
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
            {selectedFruit ? (
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedFruit.nom}</p>
                <p>Variété : {selectedFruit.variete}</p>
                <p>Surface : {selectedFruit.surface}</p>
                <p>État : {selectedFruit.etat}</p>
                <p>Date de plantation : {selectedFruit.datePlantation}</p>
                <p>Rendement estimé : {selectedFruit.rendementEstime}</p>
                <p>Ajoutée le : {formatDate(selectedFruit.createdAt)}</p>
              </div>
            ) : (
              <EmptyState title="Aucune culture sélectionnée" description="Choisissez une culture fruitière pour voir sa fiche détaillée." />
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des cultures fruitières</CardTitle>
        </CardHeader>
        <CardContent>
          {fruits.length === 0 ? (
            <EmptyState title="Aucune culture fruitière enregistrée" description="Ajoutez une culture pour démarrer le suivi des fruits." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeadCell>Nom</TableHeadCell>
                  <TableHeadCell>Variété</TableHeadCell>
                  <TableHeadCell>Surface</TableHeadCell>
                  <TableHeadCell>État</TableHeadCell>
                  <TableHeadCell>Actions</TableHeadCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fruits.map((fruit) => (
                  <TableRow key={fruit.id}>
                    <TableCell>{fruit.nom}</TableCell>
                    <TableCell>{fruit.variete}</TableCell>
                    <TableCell>{fruit.surface}</TableCell>
                    <TableCell>{fruit.etat}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" type="button" onClick={() => setSelectedFruitId(fruit.id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" type="button" onClick={() => handleEdit(fruit)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="danger" size="icon" type="button" onClick={() => handleDelete(fruit.id)}>
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
