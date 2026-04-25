import { useEffect, useState } from 'react'

export default function StatusBar() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true)
      setShowBanner(true)
      setTimeout(() => setShowBanner(false), 3000) // hide after 3s
    }

    function handleOffline() {
      setIsOnline(false)
      setShowBanner(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!showBanner && isOnline) return null

  return (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-sm text-white shadow-lg transition-all z-50 ${
        isOnline ? 'bg-green-500' : 'bg-gray-700'
      }`}
    >
      {isOnline ? '☁️ Back online — syncing...' : '📴 Offline — saving locally'}
    </div>
  )
}