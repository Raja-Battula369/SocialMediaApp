import { Alert, AlertIcon } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';

const Error = () => {
  const status = useSelector((state) => state.error);
  return (
    <>
      <Alert status="error">
        <AlertIcon />
        {status} Please Login again
      </Alert>
    </>
  );
};

export default Error;
