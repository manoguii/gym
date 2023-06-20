import {
  getStorageAuthToken,
  saveStorageAuthToken,
} from '@storage/storageAuthToken'
import { AppError } from '@utils/AppError'
import axios, { AxiosError, AxiosInstance } from 'axios'

type SignOut = () => void

interface PromiseType {
  onSuccess: (token: string) => void
  onFailure: (error: AxiosError) => void
}

interface APIInstanceProps extends AxiosInstance {
  registerInterceptTokenManager: (signOut: SignOut) => () => void
}

const api = axios.create({
  baseURL: 'http://172.17.0.1:3333',
}) as APIInstanceProps

let failedQueue: Array<PromiseType> = []
let isRefreshing = false

api.registerInterceptTokenManager = (signOut) => {
  const interceptTokenManager = api.interceptors.response.use(
    (response) => response,
    async (requestError) => {
      if (requestError?.response?.status === 401) {
        // error 401(não autorizado) é indicio de um erro relacionado ao token .
        if (
          requestError.response.data?.message === 'token.expired' ||
          requestError.response.data?.message === 'token.invalid'
        ) {
          // se entrar nesse if, é um erro de token, então aqui implementa a estrategia de refresh_token !

          const { refresh_token } = await getStorageAuthToken()

          if (!refresh_token) {
            signOut()

            return Promise.reject(requestError)
          }

          const originalRequestConfig = requestError.config

          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({
                onSuccess: (token: string) => {
                  originalRequestConfig.headers = {
                    Authorization: `Bearer ${token}`,
                  }

                  resolve(api(originalRequestConfig))
                },

                onFailure: (error: AxiosError) => {
                  reject(error)
                },
              })
            })
          }

          isRefreshing = true

          return new Promise(async (resolve, reject) => {
            try {
              const { data } = await api.post('/sessions/refresh-token', {
                refresh_token,
              })

              await saveStorageAuthToken({
                token: data.token,
                refresh_token: data.refresh_token,
              })

              if (originalRequestConfig.data) {
                originalRequestConfig.data = JSON.parse(
                  originalRequestConfig.data,
                )
              }

              originalRequestConfig.headers = {
                Authorization: `Bearer ${data.token}`,
              }

              api.defaults.headers.common.Authorization = `Bearer ${data.token}`

              failedQueue.forEach((request) => {
                request.onSuccess(data.token)
              })

              console.log('TOKEN ATUALIZADO 🔥🔥🔥')

              resolve(api(originalRequestConfig))
            } catch (error: any) {
              failedQueue.forEach((request) => {
                request.onFailure(error)
              })

              signOut()

              reject(error)
            } finally {
              isRefreshing = false

              failedQueue = []
            }
          })
        }

        // se entrar no if de NÃO autorizado, e NÃO é um erro de token, desloga o usuario para gerar um novo token .
        signOut()
      }

      if (requestError.response && requestError.response.data) {
        return Promise.reject(new AppError(requestError.response.data.message))
      } else {
        return Promise.reject(requestError)
      }
    },
  )

  return () => {
    api.interceptors.response.eject(interceptTokenManager)
  }
}

export { api }
