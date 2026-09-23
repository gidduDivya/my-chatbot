import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'

import { useToast } from './Toast'

export const TOKEN_KEY = 'chatbot_token'

export default function AuthCheckWrapper() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(localStorage.getItem(TOKEN_KEY)))
  const location = useLocation()
  const navigate = useNavigate()
  const { showToast } = useToast()

  useEffect(() => {
    if (isAuthenticated && location.pathname !== '/chat') navigate('/chat', { replace: true })
  }, [isAuthenticated, location.pathname, navigate])

  function handleAuthenticated(token, message) {
    localStorage.setItem(TOKEN_KEY, token)
    setIsAuthenticated(true)
    showToast(message || 'Authentication successful')
    navigate('/chat', { replace: true })
  }

  function handleLogout() {
    localStorage.removeItem(TOKEN_KEY)
    setIsAuthenticated(false)
    showToast('Logged out successfully')
    navigate('/login', { replace: true })
  }

  if (location.pathname === '/chat' && !isAuthenticated) return <Navigate to="/login" replace />
  if (isAuthenticated && location.pathname !== '/chat') return null

  return <Outlet context={{ onAuthenticated: handleAuthenticated, onLogout: handleLogout }} />
}
