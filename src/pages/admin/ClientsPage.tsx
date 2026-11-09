import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
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

const clientSchema = z.object({
  nom: z.string().trim().min(2, 'Le nom est obligatoire.'),
  telephone: z.string().trim().min(8, 'Le téléphone est obligatoire.'),
  email: z.string().trim().email('Email invalide.'),
  ville: z.string().trim().min(2, 'La ville est obligatoire.'),
  categorie: z.string().trim().min(2, 'La catégorie est obligatoire.'),
})

type ClientFormValues = z.infer<typeof clientSchema>

interface ClientRecord extends ClientFormValues {
  id: string
  createdAt: string
}

const emptyValues: ClientFormValues = {
  nom: '',
  telephone: '',
  email: '',
  ville: '',
  categorie: '',
}

export const INITIAL_CLIENTS_DATA: ClientRecord[] = [
  {
    id: 'client-001',
    nom: 'Marché Central de Thiès',
    telephone: '+221 77 111 22 33',
    email: 'marche.central@senegal.sn',
    ville: 'Thiès',
    categorie: 'Grossiste',
    createdAt: new Date('2025-08-01').toISOString(),
  },
  {
    id: 'client-002',
    nom: 'Restaurant Le Gourmet',
    telephone: '+221 78 222 33 44',
    email: 'contact@legourmet-sn.com',
    ville: 'Saly / Mbour',
    categorie: 'Restauration',
    createdAt: new Date('2025-08-05').toISOString(),
  },
  {
    id: 'client-003',
    nom: 'Coopérative Laitière du Baol',
    telephone: '+221 76 999 88 77',
    email: 'coop.laitiere@baol.sn',
    ville: 'Bambey',
    categorie: 'Coopérative',
    createdAt: new Date('2025-08-10').toISOString(),
  },
  {
    id: 'client-004',
    nom: 'Supermarché Auchan Thiès',
    telephone: '+221 33 800 00 00',
    email: 'appro.thies@auchan.sn',
    ville: 'Thiès',
    categorie: 'Grande distribution',
    createdAt: new Date('2025-08-12').toISOString(),
  },
  {
    id: 'client-005',
    nom: 'Hôtel Teranga Somone',
    telephone: '+221 77 555 44 33',
    email: 'direction@hotelteranga.sn',
    ville: 'Somone',
    categorie: 'Hôtellerie',
    createdAt: new Date('2025-08-15').toISOString(),
  },
]

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientRecord[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: emptyValues,
  })

  useEffect(() => {
    const stored = StorageService.get<ClientRecord[]>(STORAGE_KEYS.CLIENTS)
    if (!stored || stored.length === 0) {
      StorageService.set(STORAGE_KEYS.CLIENTS, INITIAL_CLIENTS_DATA)
      setClients(INITIAL_CLIENTS_DATA)
    } else {
      setClients(stored)
    }
  }, [])

  const saveClients = (next: ClientRecord[]) => {
    setClients(next)
    StorageService.set(STORAGE_KEYS.CLIENTS, next)
  }

  const filteredClients = useMemo(() => {
    const term = search.toLowerCase()
    return clients.filter((client) =>
      client.nom.toLowerCase().includes(term) ||
      client.email.toLowerCase().includes(term) ||
      client.ville.toLowerCase().includes(term),
    )
  }, [clients, search])

  const resetForm = () => {
    reset(emptyValues)
    setEditingId(null)
  }

  const onSubmit = handleSubmit((data) => {
    if (editingId) {
      const updated = clients.map((client) => (client.id === editingId ? { ...client, ...data } : client))
      saveClients(updated)
      toast.success('Client mis à jour.')
    } else {
      const newClient: ClientRecord = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      }
      saveClients([newClient, ...clients])
      toast.success('Client ajouté.')
    }
    resetForm()
  })

  const handleEdit = (client: ClientRecord) => {
    setEditingId(client.id)
    reset({
      nom: client.nom,
      telephone: client.telephone,
      email: client.email,
      ville: client.ville,
      categorie: client.categorie,
    })
  }

  const handleDelete = (id: string) => {
    const next = clients.filter((client) => client.id !== id)
    saveClients(next)
    toast.success('Client supprimé.')
    if (editingId === id) {
      resetForm()
    }
  }

  return (
    <div className="space-y-6">
      <SectionTitle title="Gestion des clients" subtitle="Construisez et maintenez votre base client commerciale." badge="Commercial" />

      <Card>
        <CardHeader>
          <CardTitle>{editingId ? 'Modifier un client' : 'Ajouter un client'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Nom" {...register('nom')} error={errors.nom?.message} />
              <Input label="Téléphone" {...register('telephone')} error={errors.telephone?.message} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
              <Input label="Ville" {...register('ville')} error={errors.ville?.message} />
            </div>
            <Input label="Catégorie" {...register('categorie')} error={errors.categorie?.message} />
            <div className="flex gap-3">
              <Button type="submit" leftIcon={<Plus className="h-4 w-4" />}>
                {editingId ? 'Enregistrer' : 'Ajouter le client'}
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
          <CardTitle>Liste des clients</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input placeholder="Rechercher un client" value={search} onChange={(event) => setSearch(event.target.value)} className="pl-10" />
          </div>

          {filteredClients.length === 0 ? (
            <EmptyState title="Aucun client trouvé" description="Ajoutez un client pour alimenter la base commerciale." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeadCell>Nom</TableHeadCell>
                  <TableHeadCell>Téléphone</TableHeadCell>
                  <TableHeadCell>Email</TableHeadCell>
                  <TableHeadCell>Ville</TableHeadCell>
                  <TableHeadCell>Actions</TableHeadCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>{client.nom}</TableCell>
                    <TableCell>{client.telephone}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.ville}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" type="button" onClick={() => handleEdit(client)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="danger" size="icon" type="button" onClick={() => handleDelete(client.id)}>
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
