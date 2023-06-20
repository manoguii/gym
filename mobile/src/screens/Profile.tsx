import { Avatar } from '@components/Avatar'
import DefaultUserAvatar from '@assets/userPhotoDefault.png'
import { Button } from '@components/Button'
import { Input } from '@components/Input'
import { ScreenHeader } from '@components/ScreenHeader'
import { Center, Heading, Skeleton, Text, useToast, VStack } from 'native-base'
import { useState } from 'react'
import { TouchableOpacity, ScrollView } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import { Controller, useForm } from 'react-hook-form'
import { useAuth } from '@hooks/useAuth'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { api } from '@services/api'
import { AppError } from '@utils/AppError'

interface FormDataProps {
  name: string
  email: string
  password: string
  old_password: string
  confirm_password: string
}

const profileSchema = yup.object({
  name: yup.string().required('Informe o nome'),
  password: yup
    .string()
    .min(6, 'A senha deve ter no minímo 6 dígitos')
    .nullable()
    .transform((value) => (!!value ? value : null)),
  confirm_password: yup
    .string()
    .nullable()
    .transform((value) => (!!value ? value : null))
    .oneOf([yup.ref('password')], 'As senhas devem ser iguais')
    .when('password', {
      is: (Field: any) => Field,
      then: (value) =>
        yup
          .string()
          .nullable()
          .required('Informe a confirmação da senha')
          .transform((value) => (!!value ? value : null)),
    }),
})

const PHOTO_SIZE = 32

export function Profile() {
  const [photoIsLoading, setPhotoIsLoading] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const { user, updateUserProfile } = useAuth()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  })

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

      const uriPhotoSelected = selectedPhoto.assets[0].uri

      const typePhotoSelected = selectedPhoto.assets[0].type

      if (uriPhotoSelected) {
        const photoInfo = FileSystem.getInfoAsync(uriPhotoSelected)

        const size = (await photoInfo).size

        if (size && size / 1024 / 1024 > 4) {
          return toast.show({
            title: 'Essa imagem e muito grande escolha uma de ate 4MB',
            placement: 'top',
            bgColor: 'red.500',
          })
        }

        const fileExtension = uriPhotoSelected.split('.').pop()

        const nameFormated = user.name.split(' ').join('')

        const photoFile = {
          name: `${nameFormated}.${fileExtension}`.toLocaleLowerCase(),
          uri: uriPhotoSelected,
          type: `${typePhotoSelected}/${fileExtension}`,
        } as any

        const userPhotoUploadForm = new FormData()

        userPhotoUploadForm.append('avatar', photoFile)

        const avatarUpdatedResponse = await api.patch(
          '/users/avatar',
          userPhotoUploadForm,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        )

        const userUpdated = user

        userUpdated.avatar = avatarUpdatedResponse.data.avatar

        updateUserProfile(userUpdated)

        toast.show({
          title: 'Foto atualizada com sucesso',
          placement: 'top',
          bgColor: 'green.700',
        })
      }
    } catch (error) {
      console.log(error)
    } finally {
      setPhotoIsLoading(false)
    }
  }

  async function handleProfileUpdate(data: FormDataProps) {
    try {
      setIsUpdating(true)

      const userUpdated = user

      userUpdated.name = data.name

      await api.put('/users', data)

      await updateUserProfile(userUpdated)

      toast.show({
        title: 'Perfil atualizado com sucesso',
        placement: 'top',
        bgColor: 'green.700',
      })
    } catch (error) {
      const isAppError = error instanceof AppError

      const title = isAppError
        ? error.message
        : 'Não foi possível atualizar os dados do usuario, tente novamente mais tarde'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsUpdating(false)
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
              source={
                user.avatar
                  ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
                  : DefaultUserAvatar
              }
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

          <Controller
            control={control}
            name="name"
            render={({ field: { value, onChange } }) => (
              <Input
                placeholder="John Doe"
                bg="gray.600"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange } }) => (
              <Input
                placeholder="johndoe@example.com"
                bg="gray.600"
                isDisabled
                onChangeText={onChange}
                value={value}
              />
            )}
          />

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

          <Controller
            control={control}
            name="old_password"
            render={({ field: { onChange } }) => (
              <Input
                bg="gray.600"
                placeholder="Senha antiga"
                secureTextEntry
                onChangeText={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange } }) => (
              <Input
                bg="gray.600"
                placeholder="Nova senha"
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="confirm_password"
            render={({ field: { onChange } }) => (
              <Input
                bg="gray.600"
                placeholder="Confirma a nova senha"
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.confirm_password?.message}
              />
            )}
          />

          <Button
            title="Atualizar"
            mt={4}
            onPress={handleSubmit(handleProfileUpdate)}
            isLoading={isUpdating}
          />
        </Center>
      </ScrollView>
    </VStack>
  )
}
