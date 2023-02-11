import { Center, Heading, Image, ScrollView, Text, VStack } from 'native-base'
import IMGBackground from '@assets/background.png'
import SVGLogo from '@assets/logo.svg'
import { Input } from '@components/Input'
import { Button } from '@components/Button'
import { useNavigation } from '@react-navigation/native'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

interface FormDataProps {
  name: string
  email: string
  password: string
  passwordConfirm: string
}

const signUpSchema = yup.object({
  name: yup.string().required('Informe seu nome'),
  email: yup.string().required('Informe seu e-mail').email('Email invalido'),
  password: yup
    .string()
    .required('Informe sua senha')
    .min(6, 'A senha deve ter no minimo 6 digitos'),
  passwordConfirm: yup
    .string()
    .required('Confirme a senha')
    .min(6, 'A senha deve ter no minimo 6 digitos')
    .oneOf([yup.ref('password')], 'As senhas são diferentes'),
})

export function SignUp() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema),
  })

  const navigation = useNavigation()

  function handleGoBack() {
    navigation.goBack()
  }

  function handleSignUp(data: FormDataProps) {
    console.log(data)
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      background="gray.700"
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
            Crie sua conta
          </Heading>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Nome"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
          />

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
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="passwordConfirm"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Confirme a senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                onSubmitEditing={handleSubmit(handleSignUp)}
                returnKeyType="send"
                errorMessage={errors.passwordConfirm?.message}
              />
            )}
          />

          <Button
            title="Criar e acessar"
            onPress={handleSubmit(handleSignUp)}
          />
        </Center>

        <Button
          mt={12}
          title="Voltar para o login"
          variant="OUTLINE"
          onPress={handleGoBack}
        />
      </VStack>
    </ScrollView>
  )
}
