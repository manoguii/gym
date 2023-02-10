import {
  Center,
  Heading,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  VStack,
} from 'native-base'
import IMGBackground from '@assets/background.png'
import SVGLogo from '@assets/logo.svg'
import { Input } from '@components/Input'
import { Button } from '@components/Button'

export function SignIn() {
  return (
    <KeyboardAvoidingView behavior="padding" background="gray.700" flexGrow={1}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        background="gray.700"
      >
        <VStack flex={1} bg="gray.700" px={10} pb={16}>
          <Image
            source={IMGBackground}
            alt="Pessoas treinando"
            resizeMode="contain"
            position="absolute"
          />

          <Center my={24}>
            <SVGLogo />

            <Text color={'gray.100'} fontSize="sm">
              Treine sua mente e o seu corpo
            </Text>
          </Center>

          <Center>
            <Heading
              color={'gray.100'}
              fontSize="xl"
              mb={6}
              fontFamily="heading"
            >
              Acesse sua conta
            </Heading>

            <Input
              placeholder="E-mail"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input placeholder="Senha" secureTextEntry />

            <Button title="Acessar" />
          </Center>

          <Center mt={24}>
            <Text color="gray.100" fontSize="sm" mb={6} fontFamily="body">
              Ainda não tem acesso?
            </Text>

            <Button title="Criar conta" variant="OUTLINE" />
          </Center>
        </VStack>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
