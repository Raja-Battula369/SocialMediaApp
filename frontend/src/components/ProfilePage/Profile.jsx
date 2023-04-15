import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  HStack,
  Image,
  Text,
  useColorMode,
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setError, setFriends } from '../../State/State';
import Error from '../Error/Error';
import Navbar from '../Navbar';

const Profile = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const [userData, setUserData] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [isMyFrnd, setIsMyFrnd] = useState(null);
  const { colorMode } = useColorMode();
  const token = useSelector((state) => state.token);
  const status = useSelector((state) => state.error);
  const { _id, friends } = useSelector((state) => state.user);

  const getUserData = async () => {
    try {
      const { data } = await axios.get(
        `https://socialmediaapp-9air.onrender.com/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await setUserData(data);
    } catch (error) {
      dispatch(
        setError({
          error: error.response.data.message,
        })
      );
    }
  };
  const getUserPosts = async () => {
    try {
      const { data } = await axios.get(
        `https://socialmediaapp-9air.onrender.com/posts/${userId}/posts`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserPosts(data);
    } catch (error) {
      dispatch(
        setError({
          error: error.response.data.message,
        })
      );
    }
  };
  const patchFriend = async () => {
    try {
      const { data } = await axios.patch(
        `http://localhost:8001/users/${userId}/${_id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      dispatch(setFriends({ friends: data }));
      const isFriend = await data.find((friend) => friend._id === _id);
      const isFollow = isFriend !== undefined ? true : false;
      setIsMyFrnd(isFollow);
    } catch (error) {
      dispatch(
        setError({
          error: error.response.data.message,
        })
      );
    }
  };

  const getFollowData = async () => {
    const isFriend = await friends.find((friend) => friend._id === userId);
    const isFollow = isFriend !== undefined ? true : false;
    setIsMyFrnd(isFollow);
  };
  useEffect(() => {
    getUserData();
    getUserPosts();
    getFollowData();
  }, []);

  return (
    <Container
      p="0"
      maxW={'full'}
      minH="100vh"
      bg={colorMode === 'light' ? '#bbecf0' : ''}
    >
      <Navbar />
      {status ? (
        <Error />
      ) : (
        <>
          <VStack p="0.4rem" maxW={'full'}>
            <HStack
              gap={['0.3rem', '2rem', '5rem']}
              justifyContent={['flex-start', 'center']}
            >
              <Avatar
                size={['lg', 'xl', '2xl']}
                src={userData?.picturePath}
                objectFit={'cover'}
              />
              <Box p={['0.5', '1rem']} maxW="full">
                <HStack gap={['0.5rem', '1rem']}>
                  <Text>
                    {userData?.firstName} {userData?.lastName}
                  </Text>
                  {_id !== userData._id && (
                    <Button
                      title="follow"
                      appearance={'none'}
                      size={['sm', 'md']}
                      fontWeight={'bold'}
                      onClick={() => patchFriend()}
                    >
                      {isMyFrnd ? 'Following' : 'Follow'}
                    </Button>
                  )}
                </HStack>
                <HStack gap={'1rem'}>
                  <Text>
                    <Text as={'b'}>{userPosts.length}</Text> posts
                  </Text>

                  {_id !== userData._id ? (
                    <>
                      <Text letterSpacing={1}>
                        <Text as={'b'}>{friends?.length}</Text> followers
                      </Text>
                      <Text letterSpacing={1}>
                        <Text as={'b'}>{0}</Text> following
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text letterSpacing={1}>
                        <Text as={'b'}>{0}</Text> followers
                      </Text>
                      <Text letterSpacing={1}>
                        <Text as={'b'}>{friends?.length}</Text> following
                      </Text>
                    </>
                  )}
                </HStack>
                <Box>
                  <Text as={'b'}>
                    {userData.firstName} {userData.lastName}
                  </Text>
                  <Text>{userData.occupation}</Text>
                </Box>
              </Box>
            </HStack>
            <Divider mx="3rem\" />
          </VStack>
          <VStack alignItems={'flex-start'}>
            <HStack wrap={'wrap'}>
              {userPosts.map((data, i) => (
                <Box key={i + data._id}>
                  {data?.picturePath && (
                    <Image
                      alt={data.picturePath}
                      m="0.4rem"
                      boxSize={['7rem', '12rem', '15rem', '18rem']}
                      objectFit="cover"
                      src={data.picturePath}
                    />
                  )}
                </Box>
              ))}
            </HStack>
          </VStack>
        </>
      )}
    </Container>
  );
};

export default Profile;
