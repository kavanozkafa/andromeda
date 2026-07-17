import { createContext, useContext, useState, type ReactNode } from 'react'

interface User {
  username: string
  email: string
  role: string
  isLoggedIn: boolean
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const VALID_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
  email: 'admin@andromeda.com',
  role: 'Yönetici',
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('andromeda_user')
      return saved ? JSON.parse(saved) : null
    }
    return null
  })

  const login = (username: string, password: string): boolean => {
    if (
      username === VALID_CREDENTIALS.username &&
      password === VALID_CREDENTIALS.password
    ) {
      const newUser: User = {
        username: VALID_CREDENTIALS.username,
        email: VALID_CREDENTIALS.email,
        role: VALID_CREDENTIALS.role,
        isLoggedIn: true,
      }
      setUser(newUser)
      localStorage.setItem('andromeda_user', JSON.stringify(newUser))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('andromeda_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
