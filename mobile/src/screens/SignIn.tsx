import {
  Center,
  Heading,
  Image,
  ScrollView,
  Text,
  useToast,
  VStack,
} from 'native-base'
import IMGBackground from '@assets/background.png'
import SVGLogo from '@assets/logo.svg'
import { Input } from '@components/Input'
import { Button } from '@components/Button'
import { useNavigation } from '@react-navigation/native'
import { AuthNavigatorRoutesProps } from '@routes/auth.routes'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '@hooks/useAuth'
import { AppError } from '@utils/AppError'
import { useState } from 'react'

const signInFormData = z
  .object({
    email: z.string().email('Digite um e-mail valido'),
    password: z.string().min(6, 'A senha deve ter no minimo 6 caracteres'),
  })
  .required()

type SignInFormDataType = z.infer<typeof signInFormData>

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignInFormDataType>({
    resolver: zodResolver(signInFormData),
  })

  const { signIn } = useAuth()

  const toast = useToast()

  const navigation = useNavigation<AuthNavigatorRoutesProps>()

  function handleNewAccount() {
    navigation.navigate('signUp')
  }

  async function handleSignIn({ email, password }: SignInFormDataType) {
    try {
      setIsLoading(true)

      await signIn(email, password)
    } catch (error) {
      const isAppError = error instanceof AppError

      const title = isAppError
        ? error.message
        : 'Não foi possível fazer login, tente novamente mais tarde'

      setIsLoading(false)

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1} px={10} pb={16}>
        <Image
          source={IMGBackground}
          alt="Pessoas treinando"
          resizeMode="contain"
          position="absolute"
          defaultSource={IMGBackground}
        />

        <Center my={24}>
          <SVGLogo />

          <Text color={'gray.100'} fontSize="sm">
            Treine sua mente e o seu corpo
          </Text>
        </Center>

        <Center>
          <Heading color={'gray.100'} fontSize="xl" mb={6} fontFamily="heading">
            Acesse sua conta
          </Heading>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { value, onChange } }) => (
              <Input
                placeholder="Senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
                onSubmitEditing={handleSubmit(handleSignIn)}
                returnKeyType="send"
              />
            )}
          />

          <Button
            title="Acessar"
            isLoading={isLoading}
            onPress={handleSubmit(handleSignIn)}
          />
        </Center>

        <Center mt={24}>
          <Text color="gray.100" fontSize="sm" mb={6} fontFamily="body">
            Ainda não tem acesso?
          </Text>

          <Button
            title="Criar conta"
            variant="OUTLINE"
            onPress={handleNewAccount}
          />
        </Center>
      </VStack>
    </ScrollView>
  )
}
