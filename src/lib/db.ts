import { openDB, type DBSchema } from 'idb'

interface Note {
  id: string
  title: string
  content: string
  updated_at: string
  deleted: boolean
  synced: boolean
  user_id?: string
}

interface NotelyDB extends DBSchema {
  notes: {
    key: string
    value: Note
    indexes: {
      updated_at: string
      synced: string
    }
  }
}

export function getDB(userId: string) {
  return openDB<NotelyDB>(`notely-${userId}`, 1, {
    upgrade(db) {
      const store = db.createObjectStore('notes', { keyPath: 'id' })
      store.createIndex('updated_at', 'updated_at')
      store.createIndex('synced', 'synced')
    }
  })
}