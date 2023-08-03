import { Alert, AlertIcon } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Error = () => {
  const status = useSelector((state) => state.error);
  const navigate = useNavigate();
  return (
    <>
      <button
        style={{
          width: '10rem',
          height: '3rem',
          borderRadius: '1rem',
          margin: '1rem',
          border: '3px solid black',
        }}
        onClick={() => navigate('/home')}
      >
        back to Home
      </button>
      <Alert status="error">
        <AlertIcon />
        {status} Please Login again
      </Alert>
    </>
  );
};

export default Error;
