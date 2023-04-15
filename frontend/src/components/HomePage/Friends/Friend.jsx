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
import axios from 'axios';
import { setError, setFriends } from '../../../State/State';
import { Link } from 'react-router-dom';

const Friend = ({ friendId, name, subtitle, userPicturePath, userId }) => {
  const dispatch = useDispatch();
  const { colorMode } = useColorMode();
  const token = useSelector((state) => state.token);
  const { friends, _id } = useSelector((state) => state.user);

  const isFriend = friends.find((friend) => friend._id === friendId);

  const PicturePath = userPicturePath;

  const patchFriend = async () => {
    try {
      const { data } = await axios.patch(
        `http://localhost:8001/users/${_id}/${friendId}`,
        {},
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
