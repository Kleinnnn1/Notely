import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setChecking(false)
    })
  }, [])

  if (checking) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>
  if (!session) return <Navigate to="/login" replace />

  return <>{children}</>
}