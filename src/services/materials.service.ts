import type { MaterialRecord } from '@/types/material'
import { INITIAL_MATERIALS_DATA } from '@/data/materials-init'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import { StorageService } from '@/services/storage.service'

export const MaterialsService = {
  getAll(): MaterialRecord[] {
    const stored = StorageService.get<MaterialRecord[]>(
      STORAGE_KEYS.MATERIALS,
    )

    if (stored && stored.length > 0) {
      return stored
    }

    StorageService.set(
      STORAGE_KEYS.MATERIALS,
      INITIAL_MATERIALS_DATA,
    )

    return INITIAL_MATERIALS_DATA
  },

  save(materials: MaterialRecord[]) {
    StorageService.set(
      STORAGE_KEYS.MATERIALS,
      materials,
    )
  },

  create(material: MaterialRecord) {
    const materials = this.getAll()

    const updated = [material, ...materials]

    this.save(updated)

    return updated
  },

  update(material: MaterialRecord) {
    const materials = this.getAll()

    const updated = materials.map((item) =>
      item.id === material.id ? material : item,
    )

    this.save(updated)

    return updated
  },

  remove(id: string) {
    const materials = this.getAll()

    const updated = materials.filter(
      (item) => item.id !== id,
    )

    this.save(updated)

    return updated
  },
}