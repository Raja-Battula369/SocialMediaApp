import { Container, Text, useColorMode, VStack } from '@chakra-ui/react';
import Form from './Form';

import { ErrorBoundary } from 'react-error-boundary';
import { fallbackRender } from '../Error/ErrorFallback';
const LoginPage = () => {
  const { colorMode } = useColorMode();
  return (
    <Container
      maxW={'full'}
      p="0"
      minH={'100vh'}
      bgPos={'center'}
      bgRepeat={'no-repeat'}
      bgSize={'cover'}
      className="login-card-bg"
    >
      <Text
        textAlign={'center'}
        py="1rem"
        fontSize={['1rem', '1.5rem', '2.2rem']}
        fontWeight="bold"
        shadow={'md'}
        color={colorMode === 'light' ? '#38e8d3' : '#f0131b'}
        bgColor={colorMode === 'light' ? 'white' : 'black'}
        borderRadius={'md'}
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
          <Text fontSize={['0.5rem', '0.5rem', '1rem']} color={'white'}>
            Welcome to Meta:Mates, the Social Media for Meta:Mates
          </Text>
          <ErrorBoundary fallbackRender={fallbackRender}>
            <Form />
          </ErrorBoundary>
        </VStack>
      </VStack>
    </Container>
  );
};

export default LoginPage;
