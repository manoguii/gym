import { UserDTO } from '@dtos/UserDTO'
import { api } from '@services/api'
import {
  getUserStorage,
  saveUserStorage,
  removeUserStorage,
} from '@storage/storageUser'
import { createContext, ReactNode, useEffect, useState } from 'react'

interface AuthContextProviderProps {
  children: ReactNode
}

export interface AuthContextDataProps {
  user: UserDTO
  signIn: (email: string, password: string) => Promise<void>
  isLoadingStorageData: boolean
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps,
)

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO)
  const [isLoadingStorageData, setIsLoadingStorageData] = useState(true)

  async function signIn(email: string, password: string) {
    try {
      const { data } = await api.post('/sessions', {
        email,
        password,
      })

      if (data.user) {
        setUser(data.user)

        await saveUserStorage(data.user)
      }
    } catch (error) {
      throw error
    }
  }

  async function signOut() {
    try {
      setIsLoadingStorageData(true)

      setUser({} as UserDTO)

      await removeUserStorage()
    } catch (error) {
      throw error
    } finally {
      setIsLoadingStorageData(false)
    }
  }

  async function loadUserData() {
    try {
      const userLogged = await getUserStorage()

      if (userLogged) {
        setUser(userLogged)

        setIsLoadingStorageData(false)
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoadingStorageData(false)
    }
  }

  useEffect(() => {
    loadUserData()
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, signIn, isLoadingStorageData, signOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}
