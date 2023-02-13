import { UserDTO } from '@dtos/UserDTO'
import { api } from '@services/api'
import {
  getStorageAuthToken,
  removeStorageAuthToken,
  saveStorageAuthToken,
} from '@storage/storageAuthToken'
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

  async function storageUserAndToken(userData: UserDTO, token: string) {
    try {
      setIsLoadingStorageData(true)

      await saveUserStorage(userData)

      await saveStorageAuthToken(token)
    } catch (error) {
      throw error
    } finally {
      setIsLoadingStorageData(false)
    }
  }

  async function updateUserAndToken(userData: UserDTO, token: string) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`

    setUser(userData)
  }

  async function signIn(email: string, password: string) {
    try {
      const { data } = await api.post('/sessions', {
        email,
        password,
      })

      if (data.user && data.token) {
        await storageUserAndToken(data.user, data.token)

        updateUserAndToken(data.user, data.token)
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

      await removeStorageAuthToken()
    } catch (error) {
      throw error
    } finally {
      setIsLoadingStorageData(false)
    }
  }

  async function loadUserData() {
    try {
      setIsLoadingStorageData(true)

      const userLogged = await getUserStorage()

      const token = await getStorageAuthToken()

      if (token && userLogged) {
        updateUserAndToken(userLogged, token)
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoadingStorageData(false)
    }
  }

  useEffect(() => {
    loadUserData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, signIn, isLoadingStorageData, signOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}
