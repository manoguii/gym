import { getStorageAuthToken } from '@storage/storageAuthToken'
import { AppError } from '@utils/AppError'
import axios, { AxiosInstance } from 'axios'

type SignOut = () => void

interface APIInstanceProps extends AxiosInstance {
  registerInterceptTokenManager: (signOut: SignOut) => () => void
}

const api = axios.create({
  baseURL: 'http://172.17.0.1:3333',
}) as APIInstanceProps

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
