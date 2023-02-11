import { HistoryCard } from '@components/HistoryCard'
import { ScreenHeader } from '@components/ScreenHeader'
import { Heading, SectionList, Text, VStack } from 'native-base'
import { useState } from 'react'

export function History() {
  const [exercises] = useState([
    {
      title: '21/02/2023',
      data: ['Puxada frontal', 'Remada'],
    },
    {
      title: '22/02/2023',
      data: ['Puxada Unilateral'],
    },
  ])

  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico de Exercícios" />

      <SectionList
        sections={exercises}
        keyExtractor={(item) => item}
        renderItem={({ item }) => <HistoryCard />}
        renderSectionHeader={({ section }) => (
          <Heading
            color="gray.200"
            fontSize="md"
            mt={10}
            mb={3}
            fontFamily="heading"
          >
            {section.title}
          </Heading>
        )}
        px={8}
        contentContainerStyle={
          exercises.length === 0 && { flex: 1, justifyContent: 'center' }
        }
        ListEmptyComponent={() => (
          <Text color="gray.100" fontSize="md" textAlign="center">
            Não ha exercicios registrados ainda.{'\n'} Vamos treinar hoje ?
          </Text>
        )}
        showsVerticalScrollIndicator={false}
      />
    </VStack>
  )
}
