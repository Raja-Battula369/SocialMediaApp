import React from 'react';
import './loading.css';
import { Box, Spinner } from '@chakra-ui/react';
const Loading = () => {
  return (
    <Box
      w="100vw"
      h="100vh"
      display={'flex'}
      flexDir={'column'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      <Spinner
        thickness="7px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    </Box>
  );
};

export default Loading;
