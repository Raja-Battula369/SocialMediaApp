import { Container, Text, useColorMode, VStack } from '@chakra-ui/react';
import Form from './Form';

const LoginPage = () => {
  const { colorMode } = useColorMode();
  return (
    <Container maxW={'full'} p="0">
      <Text
        textAlign={'center'}
        py="1rem"
        fontSize={['1rem', '1.5rem', '2.2rem']}
        fontWeight="bold"
        shadow={'md'}
        color={colorMode === 'light' ? '#38e8d3' : '#f0131b'}
      >
        Meta:Mates
      </Text>
      <VStack>
        <VStack
          gap="1rem"
          m="1rem"
          shadow="lg"
          maxW={['100%', '60%']}
          p="1rem"
          borderRadius={'2rem'}
        >
          <Text fontSize={['0.5rem', '0.5rem', '0.7rem']}>
            {' '}
            Welcome to Meta:Mates, the Social Media for Meta:Mates
          </Text>
          <Form />
        </VStack>
      </VStack>
    </Container>
  );
};

export default LoginPage;
