import { Text, VStack } from '@chakra-ui/react';

export const fallbackRender = ({ error }) => {
  return (
    <VStack h="100%">
      <Text color={'red.500'} sx={{ textDecoration: 'underline' }}>
        Error Ocurred: {error.message}
      </Text>
    </VStack>
  );
};
