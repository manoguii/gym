import { Avatar } from '@components/Avatar'
import { Button } from '@components/Button'
import { Input } from '@components/Input'
import { ScreenHeader } from '@components/ScreenHeader'
import { Center, Heading, Skeleton, Text, useToast, VStack } from 'native-base'
import { useState } from 'react'
import { TouchableOpacity, ScrollView } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'

const PHOTO_SIZE = 32

export function Profile() {
  const [photoIsLoading, setPhotoIsLoading] = useState(false)
  const [userPhoto, setUserPhoto] = useState(
    'https://www.github.com/manoguii.png',
  )

  const toast = useToast()

  async function handleUserPhotoSelect() {
    setPhotoIsLoading(true)
    try {
      const selectedPhoto = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      })

      if (selectedPhoto.canceled) {
        return null
      }

      if (selectedPhoto.assets[0].uri) {
        const photoInfo = FileSystem.getInfoAsync(selectedPhoto.assets[0].uri)

        const size = (await photoInfo).size

        if (size && size / 1024 / 1024 > 4) {
          return toast.show({
            title: 'Essa imagem e muito grande escolha uma de ate 4MB',
            placement: 'top',
            bgColor: 'red.500',
          })
        }

        setUserPhoto(selectedPhoto.assets[0].uri)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setPhotoIsLoading(false)
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt={6} px={10}>
          {photoIsLoading ? (
            <Skeleton
              w={PHOTO_SIZE}
              h={PHOTO_SIZE}
              rounded="full"
              startColor="gray.500"
              endColor="gray.400"
            />
          ) : (
            <Avatar
              source={{ uri: userPhoto }}
              alt="Imagem de perfil do usuario"
              size={PHOTO_SIZE}
            />
          )}

          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text
              color="green.500"
              fontWeight="bold"
              fontSize="md"
              mt={2}
              mb={8}
            >
              Alterar foto
            </Text>
          </TouchableOpacity>

          <Input placeholder="John Doe" bg="gray.600" />

          <Input placeholder="johndoe@example.com" bg="gray.600" isDisabled />

          <Heading
            color="gray.200"
            fontSize="md"
            mb={2}
            alignSelf="flex-start"
            mt={12}
            fontFamily="heading"
          >
            Alterar senha
          </Heading>

          <Input bg="gray.600" placeholder="Senha antiga" secureTextEntry />

          <Input bg="gray.600" placeholder="Nova antiga" secureTextEntry />

          <Input
            bg="gray.600"
            placeholder="Confirma a nova senha"
            secureTextEntry
          />

          <Button title="Atualizar" mt={4} />
        </Center>
      </ScrollView>
    </VStack>
  )
}
