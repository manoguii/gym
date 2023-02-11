import { Heading, HStack, Icon, Text, VStack } from 'native-base'
import { Avatar } from './Avatar'
import { MaterialIcons } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native'

export function HomeHeader() {
  return (
    <HStack bg="gray.600" pt={16} pb={5} px={8} alignItems="center">
      <Avatar
        source={{ uri: 'https://github.com/manoguii.png' }}
        size={16}
        alt="Imagem de perfil do usuario"
        mr={4}
      />

      <VStack flex={1}>
        <Text color="gray.100" fontSize="md">
          Olá
        </Text>

        <Heading color="gray.100" fontSize="md" fontFamily="heading">
          Guilherme
        </Heading>
      </VStack>

      <TouchableOpacity>
        <Icon as={MaterialIcons} name="logout" color="gray.200" size={7} />
      </TouchableOpacity>
    </HStack>
  )
}
