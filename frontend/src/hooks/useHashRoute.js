import { useEffect, useState } from 'react'

function getHashRoute() {
  return window.location.hash.replace('#', '') || 'home'
}

function useHashRoute() {
  const [route, setRoute] = useState(getHashRoute)

  useEffect(() => {
    const handleHashChange = () => setRoute(getHashRoute())

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return route
}

export default useHashRoute
