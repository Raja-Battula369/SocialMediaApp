import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  HStack,
  Image,
  Text,
  useColorMode,
  VStack,
} from '@chakra-ui/react';

import React, { lazy } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { RouterFetchForGet, RouterFetchForPatch } from '../../RouterFeatch';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
const Error = lazy(() => import('../Error/Error'));

const Profile = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const { colorMode } = useColorMode();
  const token = useSelector((state) => state.token);
  const status = useSelector((state) => state.error);
  const { _id } = useSelector((state) => state.user);
  const queryClient = useQueryClient();

  const getUserData = async () => {
    try {
      const data = await RouterFetchForGet(
        `/users/${userId}`,
        `Bearer ${token}`
      );

      return data;
    } catch (error) {
      dispatch(
        import('../../State/State').then((state) =>
          state.setError({
            error: error.response.data.message,
          })
        )
      );
    }
  };
  const getUserPosts = async () => {
    try {
      const data = await RouterFetchForGet(
        `/posts/${userId}/posts`,
        `Bearer ${token}`
      );
      return data;
    } catch (error) {
      dispatch(
        import('../../State/State').then((state) =>
          state.setError({
            error: error.response.data.message,
          })
        )
      );
    }
  };
  const patchFriend = () => {
    PatchFriendHandler.mutate();
  };

  const { data } = useQuery(['personPersonalData'], getUserData);
  const { data: dataOfPersonPosts } = useQuery(
    ['personPersonalPosts'],
    getUserPosts
  );

  const PatchFriendHandler = useMutation(
    async () => {
      try {
        const data = await RouterFetchForPatch(
          `/users/${userId}/${_id}`,
          '',
          `Bearer ${token}`
        );
        return data;
      } catch (error) {
        dispatch(
          import('../../State/State').then((state) =>
            state.setError({
              error: error.response.data.message,
            })
          )
        );
      }
    },
    { onSuccess: () => queryClient.invalidateQueries(['personPersonalData']) }
  );

  const isFriend = data?.friends.find((friend) =>
    friend === _id ? true : false
  );

  return (
    <Container
      p="0"
      maxW={'full'}
      minH="100vh"
      // bg={colorMode === 'light' ? '#bbecf0' : ''}
      bgImage={`url(${data?.picturePath})`}
      bgPos={'center'}
      bgRepeat={'no-repeat'}
      bgSize={'cover'}
    >
      <div>
        {status ? (
          <Error />
        ) : (
          <>
            <VStack
              p="0.4rem"
              maxW={'full'}
              bgColor={colorMode === 'light' ? 'white' : 'black'}
              color={colorMode === 'light' ? 'black' : 'white'}
              // opacity={'0.7'}
              boxShadow={'md'}
            >
              <HStack
                gap={['0.3rem', '2rem', '5rem']}
                justifyContent={['flex-start', 'center']}
              >
                <Avatar
                  size={['lg', 'xl', '2xl']}
                  src={data?.picturePath}
                  objectFit={'cover'}
                />
                <Box p={['0.5', '1rem']} maxW="full">
                  <HStack gap={['0.5rem', '1rem']}>
                    <Text>
                      {data?.firstName} {data?.lastName}
                    </Text>
                    {_id !== data?._id && (
                      <Button
                        title="follow"
                        appearance={'none'}
                        size={['sm', 'md']}
                        fontWeight={'bold'}
                        onClick={() => patchFriend()}
                      >
                        {isFriend ? 'Following' : 'Follow'}
                      </Button>
                    )}
                  </HStack>
                  <HStack gap={'1rem'}>
                    <Text>
                      <Text as={'b'}>{dataOfPersonPosts?.length}</Text> posts
                    </Text>

                    {_id !== data?._id ? (
                      <>
                        <Text letterSpacing={1}>
                          <Text as={'b'}>{data?.friends?.length}</Text>{' '}
                          followers
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
                          <Text as={'b'}>{data?.friends?.length}</Text>{' '}
                          following
                        </Text>
                      </>
                    )}
                  </HStack>
                  <Box>
                    <Text as={'b'}>
                      {data?.firstName} {data?.lastName}
                    </Text>
                    <Text>{data?.occupation}</Text>
                  </Box>
                </Box>
              </HStack>
            </VStack>

            <div className="grid">
              {dataOfPersonPosts?.map((data, i) => (
                <Box margin={'1rem'} key={i + data._id}>
                  {data?.picturePath && (
                    <Image
                      shadow={'md'}
                      alt={data.picturePath}
                      my={'0.5rem'}
                      boxSize={['7rem', '12rem', '15rem', '18rem']}
                      objectFit="cover"
                      src={data.picturePath}
                    />
                  )}
                </Box>
              ))}
            </div>
          </>
        )}
      </div>
    </Container>
  );
};

export default Profile;
