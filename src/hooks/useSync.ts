import { useEffect } from 'react'
import { getDB } from '../lib/db'
import { supabase } from '../lib/supabase'

export function useSync(userId: string, onSynced: () => void) {
  useEffect(() => {
    if (!userId) return

    if (navigator.onLine) {
      syncAll()
    }

    window.addEventListener('online', handleOnline)
    return () => window.removeEventListener('online', handleOnline)
  }, [userId])

  function handleOnline() {
    syncAll()
  }

  async function syncAll() {
    await pushDeletes()
    await pushUnsynced()
    await pullFromSupabase()
    onSynced()
  }

  // Step 1 — push notes marked deleted while offline
  async function pushDeletes() {
    const db = await getDB(userId)
    const all = await db.getAll('notes')
    const toDelete = all.filter((n) => n.deleted && !n.synced)

    for (const note of toDelete) {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', note.id)

      if (!error) {
        await db.delete('notes', note.id)
      }
    }
  }

  async function pushUnsynced() {
    const db = await getDB(userId)
    const all = await db.getAll('notes')
    const unsynced = all.filter((n) => !n.synced && !n.deleted)

    for (const note of unsynced) {
      const { synced, ...supabaseNote } = note

      const { error } = await supabase
        .from('notes')
        .upsert({ ...supabaseNote, user_id: userId })

      if (!error) {
        await db.put('notes', { ...note, synced: true })
      }
    }
  }

  // Step 3 — pull latest from Supabase into IndexedDB
  async function pullFromSupabase() {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .eq('deleted', false)

    if (error || !data) return

    const db = await getDB(userId)
    for (const note of data) {
      await db.put('notes', { ...note, synced: true })
    }
  }
}