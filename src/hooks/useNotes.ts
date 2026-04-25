import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { getDB } from '../lib/db'
import { supabase } from '../lib/supabase'

interface Note {
  id: string
  title: string
  content: string
  updated_at: string
  deleted: boolean
  synced: boolean
  user_id?: string
}

export function useNotes(userId: string) {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    loadNotes()
  }, [userId])

  async function loadNotes() {
    const db = await getDB(userId)
    const all = await db.getAll('notes')
    const active = all.filter((n) => !n.deleted)
    active.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    setNotes(active)
    setLoading(false)
  }

  async function saveNote(note: Partial<Note>) {
    const db = await getDB(userId)

    const now = new Date().toISOString()
    const isNew = !note.id

    const noteToSave: Note = {
      id: note.id ?? uuidv4(),
      title: note.title ?? 'Untitled',
      content: note.content ?? '',
      updated_at: now,
      deleted: false,
      synced: false,
      user_id: userId
    }

    await db.put('notes', noteToSave)

    if (navigator.onLine) {
      const { synced, ...supabaseNote } = noteToSave

      const { data, error } = isNew
        ? await supabase.from('notes').insert(supabaseNote).select()
        : await supabase.from('notes').update(supabaseNote).eq('id', noteToSave.id).select()

      if (!error) {
        noteToSave.synced = true
        await db.put('notes', noteToSave)
      }
    }

    await loadNotes()
    return noteToSave
  }

  async function deleteNote(id: string) {
    const db = await getDB(userId)
    const note = await db.get('notes', id)
    if (!note) return

    if (navigator.onLine) {
      await db.delete('notes', id)

      await supabase
        .from('notes')
        .delete()
        .eq('id', id)
    } else {
      await db.put('notes', {
        ...note,
        deleted: true,
        synced: false,
        updated_at: new Date().toISOString()
      })
    }

    await loadNotes()
  }

  return { notes, loading, saveNote, deleteNote, loadNotes }
}