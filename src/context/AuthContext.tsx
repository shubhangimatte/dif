import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

export type Role = 'admin' | 'user'

export interface AuthUser {
  username: string
  role: Role
}

interface AuthContextType {
  user: AuthUser | null
  login: (username: string, password: string, role: Role) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const CREDENTIALS: Record<Role, { username: string; password: string }> = {
  admin: { username: 'admin', password: 'admin@123' },
  user:  { username: 'user',  password: 'user@123'  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem('dif_user')
      return stored ? (JSON.parse(stored) as AuthUser) : null
    } catch { return null }
  })

  const login = (username: string, password: string, role: Role): boolean => {
    const creds = CREDENTIALS[role]
    if (username === creds.username && password === creds.password) {
      const u: AuthUser = { username, role }
      setUser(u)
      localStorage.setItem('dif_user', JSON.stringify(u))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('dif_user')
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
