import { useEffect } from 'react'
import { getDB } from '../lib/db'
import { supabase } from '../lib/supabase'

export function useSync(userId: string, onSynced: () => void) {
  useEffect(() => {
    if (!userId) {
      return
    }

    window.addEventListener('online', handleOnline)
    return () => window.removeEventListener('online', handleOnline)
  }, [userId])

  function handleOnline() {
    syncAll()
  }

  async function syncAll() {
    await pushUnsynced()
    await pullFromSupabase()
    onSynced()
  }

  async function pushUnsynced() {
    const db = await getDB(userId)
    const all = await db.getAll('notes')
    const unsynced = all.filter((n) => !n.synced)

    for (const note of unsynced) {
      const { synced, ...supabaseNote } = note

      const { error } = await supabase
        .from('notes')
        .upsert({ ...supabaseNote, user_id: userId })

      if (error) {
      } else {
        await db.put('notes', { ...note, synced: true })
      }
    }
  }

  async function pullFromSupabase() {

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)

    if (error) {
      return
    }

    if (!data) return

    const db = await getDB(userId)
    for (const note of data) {
      await db.put('notes', { ...note, synced: true })
    }
  }
}