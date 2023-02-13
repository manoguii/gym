import { UserDTO } from '@dtos/UserDTO'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { USER_STORAGE } from './storageConfig'

async function saveUserStorage(user: UserDTO) {
  await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user))
}

async function getUserStorage() {
  const storage = await AsyncStorage.getItem(USER_STORAGE)

  const user: UserDTO = storage ? JSON.parse(storage) : {}

  return user
}

export { getUserStorage, saveUserStorage }
