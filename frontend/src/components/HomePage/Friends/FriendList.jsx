import { HStack, Text, VStack } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setError, setFriends } from '../../../State/State';
import Friend from './Friend';

const FriendList = ({ userId }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const { friends } = useSelector((state) => state.user);
  const getFriends = async () => {
    try {
      const { data } = await axios.get(
        `https://socialmediaapp-9air.onrender.com/users/${userId}/friends`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      dispatch(setFriends({ friends: data }));
    } catch (error) {
      dispatch(
        setError({
          error: error.response.data.message,
        })
      );
    }
  };

  useEffect(() => {
    getFriends();
  }, []);
  return (
    <VStack
      alignItems={'flex-start'}
      gap="1rem"
      shadow="md"
      m="2rem 0.5rem"
      p="1rem"
    >
      <Text as={'b'}>Friend list</Text>
      {friends.map((friend, i) => (
        <Friend
          key={friend?._id + i}
          friendId={friend?._id}
          name={`${friend?.firstName} ${friend?.lastName}`}
          subtitle={friend?.occupation}
          userPicturePath={friend?.picturePath}
        />
      ))}
    </VStack>
  );
};

export default FriendList;
