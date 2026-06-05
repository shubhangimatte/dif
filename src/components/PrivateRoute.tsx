import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { Role } from '../context/AuthContext'

interface PrivateRouteProps {
  children: ReactNode
  allowedRoles?: Role[]
}

export default function PrivateRoute({ children, allowedRoles }: PrivateRouteProps) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />
  return <>{children}</>
}
