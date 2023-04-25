import { Avatar, Box, HStack, Text } from '@chakra-ui/react';
import React, { memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouterFetchForGet } from '../../../../RouterFeatch';
import { useQuery } from '@tanstack/react-query';

const Comment = ({ id, message }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const [data, setData] = useState([]);

  const commentsPersonId = async () => {
    try {
      const data = await RouterFetchForGet(`/users/${id}`, `Bearer ${token}`);
      setData(data);
    } catch (error) {
      dispatch(
        import('../../../../State/State').then((state) =>
          state.setError({
            error: error.response.data.message,
          })
        )
      );
      console.log(error);
    }
  };

  // const { data } = useQuery(['commentOfThePerson'], commentsPersonId);
  useEffect(() => {
    commentsPersonId();
  }, []);

  return (
    <HStack w={'full'} alignItems="flex-start" p="0.5rem">
      <Avatar size={'sm'} src={data?.picturePath} />
      <Box>
        <Text as={'b'}>{data?.firstName}</Text>
        <Text minW={'95%'}>{message}</Text>
      </Box>
    </HStack>
  );
};

export default memo(Comment);
