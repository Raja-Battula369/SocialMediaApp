import {
  Avatar,
  Box,
  HStack,
  IconButton,
  Text,
  useColorMode,
} from '@chakra-ui/react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MdOutlinePersonAdd, MdOutlinePersonRemove } from 'react-icons/md';

import { Link } from 'react-router-dom';
import { RouterFetchForGet, RouterFetchForPatch } from '../../../RouterFeatch';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const Friend = ({ friendId, name, subtitle, userPicturePath, userId }) => {
  const dispatch = useDispatch();
  const { colorMode } = useColorMode();
  const token = useSelector((state) => state.token);
  const { _id } = useSelector((state) => state.user);

  const queryClient = useQueryClient();

  const PicturePath = userPicturePath;

  const patchFriend = async () => {
    FriendAddAndRemoveHandler.mutate();
  };
  const FriendAddAndRemoveHandler = useMutation(
    async () => {
      try {
        const data = await RouterFetchForPatch(
          `/users/${_id}/${friendId}`,
          '',
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
        console.log(error);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['getFriends']);
        queryClient.invalidateQueries(['getFriendsAgin']);
      },
    }
  );
  const getFriendsDataHandler = async () => {
    try {
      const data = await RouterFetchForGet(`/users/${_id}`, `Bearer ${token}`);
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
  const { data: friendsInMyList } = useQuery(
    ['getFriendsAgin'],
    getFriendsDataHandler
  );
  // console.log(friendsInMyList.friends);

  const isFriend = friendsInMyList?.friends?.find((friend) =>
    friend === friendId ? true : false
  );
  return (
    <HStack minW="full" justifyContent={'space-between'}>
      <Link to={`/profile/${friendId}`}>
        <HStack
          gap={'0.5rem'}
          w="full"
          sx={{ '&:hover': { cursor: 'pointer', opacity: 0.6 } }}
        >
          <Avatar src={PicturePath} />
          <Box w="full">
            <Text as={'b'}> {name}</Text>
            <Text opacity={'0.8'} fontSize={'small'}>
              {subtitle}
            </Text>
          </Box>
        </HStack>
      </Link>
      {_id !== userId && (
        <Box>
          <IconButton
            bgColor={colorMode === 'light' ? '#98b0b5' : '#333c3d'}
            appearance={'none'}
            title={'person'}
            variant={'outline'}
            isRound
            size={'sm'}
            onClick={patchFriend}
            icon={isFriend ? <MdOutlinePersonRemove /> : <MdOutlinePersonAdd />}
          />
        </Box>
      )}
    </HStack>
  );
};

export default Friend;
