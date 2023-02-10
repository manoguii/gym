import { Image, VStack } from 'native-base'
import IMGBackground from '@assets/background.png'

export function SignIn() {
  return (
    <VStack flex={1} bg="gray.700">
      <Image
        source={IMGBackground}
        alt="Pessoas treinando"
        resizeMode="contain"
        position="absolute"
      />
    </VStack>
  )
}
