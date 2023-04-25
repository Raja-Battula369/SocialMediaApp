import { Text, VStack, useColorMode } from '@chakra-ui/react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Friend from './Friend';
import { RouterFetchForGet } from '../../../RouterFeatch';
import { useQuery } from '@tanstack/react-query';

const FriendList = ({ userId }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const { colorMode } = useColorMode();

  const getFriends = async () => {
    try {
      const data = await RouterFetchForGet(
        `/users/${userId}/friends`,
        `Bearer ${token}`
      );
      return data;
    } catch (error) {
      dispatch(
        import('../../../State/State').then((state) =>
          state.setError({
            error: error.response.data.message,
          })
        )
      );
    }
  };
  const { data } = useQuery(['getFriends'], getFriends);

  return (
    <VStack
      alignItems={'flex-start'}
      gap="1rem"
      shadow="md"
      m="2rem 0.5rem"
      p="1rem"
      bgColor={colorMode === 'light' ? 'white' : 'black'}
      borderRadius={'md'}
    >
      <Text as={'b'}>Friend list</Text>
      {data?.map(
        (friend, i) =>
          friend.firstName !== undefined && (
            <Friend
              key={friend?._id + i}
              friendId={friend?._id}
              name={`${friend?.firstName} ${friend?.lastName}`}
              subtitle={friend?.occupation}
              userPicturePath={friend?.picturePath}
            />
          )
      )}
    </VStack>
  );
};

export default FriendList;
