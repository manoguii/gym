import { Button as ButtonNativeBase, IButtonProps, Text } from 'native-base'

interface ButtonProps extends IButtonProps {
  title: string
  variant?: 'SOLID' | 'OUTLINE'
}

export function Button({ title, variant = 'SOLID', ...rest }: ButtonProps) {
  return (
    <ButtonNativeBase
      w="full"
      h="14"
      bg={variant === 'OUTLINE' ? 'transparent' : 'green.700'}
      borderWidth={variant === 'OUTLINE' ? 1 : 0}
      borderColor="green.500"
      rounded="sm"
      _pressed={{
        bg: variant === 'OUTLINE' ? 'green.700' : 'green.500',
        borderColor: 'transparent',
      }}
      {...rest}
    >
      <Text color="white" fontFamily="heading" fontSize="sm">
        {title}
      </Text>
    </ButtonNativeBase>
  )
}
