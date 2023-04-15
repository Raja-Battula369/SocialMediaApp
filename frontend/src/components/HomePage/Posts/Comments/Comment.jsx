import { Avatar, Box, HStack, Text } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setError } from '../../../../State/State';

const Comment = ({ id, message }) => {
  const [name, setName] = useState('');
  const [picId, setPicId] = useState(null);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);

  const commentsPersonId = async () => {
    try {
      const { data } = await axios.get(`http://localhost:8001/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const pic = data.picturePath;
      setPicId(pic);
      setName(data.firstName);
    } catch (error) {
      dispatch(
        setError({
          error: error.response.data.message,
        })
      );
      console.log(error);
    }
  };
  useEffect(() => {
    commentsPersonId();
  }, []);

  return (
    <HStack w={'full'} alignItems="flex-start" p="0.5rem">
      <Avatar size={'sm'} src={picId} />
      <Box>
        <Text as={'b'}>{name}</Text>
        <Text minW={'95%'}>{message}</Text>
      </Box>
    </HStack>
  );
};

export default Comment;
