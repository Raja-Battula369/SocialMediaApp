import '../../App.css';
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  HStack,
  IconButton,
  Input,
  Text,
  useColorMode,
  useMediaQuery,
  useToast,
  VStack,
} from '@chakra-ui/react';
import React, { lazy, useState } from 'react';
import {
  MdHome,
  MdImage,
  MdOutlineAttachFile,
  MdOutlineGif,
  MdOutlineMic,
  MdOutlineMoreHoriz,
} from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';

import { Link } from 'react-router-dom';

import RouterFetchForPost from '../../RouterFeatch';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import DropzoneComponent from './Drop_Zone';

import { setError } from '../../State/State';

const Weather = lazy(() => import('./Weather'));
const FriendList = lazy(() => import('./Friends/FriendList'));
const Posts = lazy(() => import('./Posts/Posts'));
const Error = lazy(() => import('../Error/Error'));

const Home = () => {
  const dispatch = useDispatch();
  const [isNonMobile] = useMediaQuery('(min-width: 1000px)');
  const [image, setImage] = useState(null);
  const [isImage, isSetImage] = useState(false);
  const [post, setPost] = useState('');
  const [isLoad, isSetLoad] = useState(false);
  const toast = useToast();

  const { _id, picturePath } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const status = useSelector((state) => state.error);

  const queryClient = useQueryClient();
  const { colorMode } = useColorMode();

  //create a post

  const handlePost = () => {
    if (image) {
      CreatePostHandler.mutate();
    } else {
      toast({
        title: 'Add Image',
        status: 'warning',
        isClosable: true,
      });
    }
  };
  const vibrateFunction = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(500);
    }
  };

  //this is react query updata

  const CreatePostHandler = useMutation(
    async () => {
      isSetLoad(true);

      const formData = new FormData();
      formData.append('userId', _id);
      formData.append('description', post);
      if (image) {
        formData.append('picture', image);
        formData.append('picturePath', image.name);
      }
      try {
        await RouterFetchForPost('/posts', formData, `Bearer ${token}`);
        setPost('');
        setImage(null);
        isSetLoad(false);
        vibrateFunction();
        toast({
          title: 'Post Uploaded',
          status: 'info',
          isClosable: true,
        });
      } catch (error) {
        console.log(error);
        dispatch(
          setError({
            error: error.response.data.message,
          })
        );
      }
    },
    {
      onSuccess: () => queryClient.invalidateQueries(['PostsGet']),
    }
  );

  return (
    <Container maxW={'full'} className="login-card-bg" p="0">
      <Box
        bgColor={colorMode === 'light' ? 'white' : 'black'}
        borderRadius={'md'}
        m="0"
        p="0"
        className="login-card"
        opacity={0.9}
      >
        {status ? (
          <Error />
        ) : (
          <Grid templateColumns={['', 'repeat(3,1fr)']}>
            {isNonMobile && (
              <VStack
                alignItems={'flex-start'}
                gap="1rem"
                shadow="md"
                m="2rem 0"
                p="1rem"
                maxW={'15rem'}
                bgColor={colorMode === 'light' ? 'white' : 'black'}
                borderRadius={'md'}
              >
                {/* weather Component */}

                <Weather />
                <HStack>
                  <IconButton
                    title="Home"
                    size={'sm'}
                    isRound
                    icon={<MdHome />}
                  />
                  <Text as={'b'}>Home</Text>
                </HStack>
                <HStack>
                  <Link to={`/profile/${_id}`}>
                    <Avatar size={'sm'} src={picturePath} objectFit="cover" />
                    <Text ml="0.5rem" as={'b'}>
                      Profile
                    </Text>
                  </Link>
                </HStack>
              </VStack>
            )}
            <VStack
              w={['90vw', '90vw', '90vw', '50vw']}
              maxH="90vh"
              overflowY={'scroll'}
              overflowX="hidden"
              scrollBehavior="smooth"
              sx={{
                '&::-webkit-scrollbar': { display: 'none' },
              }}
              bgColor={colorMode === 'light' ? 'white' : 'black'}
              borderRadius={'md'}
            >
              <VStack
                gridColumnStart={['2', '']}
                w={['100%', '28rem']}
                p="1rem"
                shadow="md"
                m="2rem 0"
                borderRadius={'1rem'}
              >
                {/* create POst Component part  */}
                <HStack w={'full'}>
                  <Avatar size={'md'} src={picturePath} objectFit="cover" />
                  <Input
                    title="addPost"
                    appearance={'none'}
                    type={'text'}
                    placeholder="What's on your mind..."
                    borderRadius={'10rem'}
                    value={post}
                    onChange={(e) => setPost(e.target.value)}
                  />
                </HStack>
                {isImage && (
                  <HStack
                    w={'full'}
                    p="0.5rem"
                    border={'2px solid grey'}
                    borderRadius=".5rem"
                  >
                    {/* <Dropzone
                      acceptedFiles=".jpg,.jpeg,.png"
                  
                      multiple={false}
                      onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <Box
                          w={image ? '80%' : 'full'}
                          {...getRootProps()}
                          border={'2px dashed grey'}
                          p="1rem"
                          sx={{ '&:hover': { cursor: 'pointer' } }}
                        >
                          <Input type="file" {...getInputProps()} />
                          <HStack justifyContent={'space-between'}>
                            {!image ? (
                              <Text fontSize={'small'}>Add Image</Text>
                            ) : (
                              <Text noOfLines={1} fontSize={'small'}>
                                {image.name}
                              </Text>
                            )}
                            <MdOutlineModeEdit />
                          </HStack>
                        </Box>
                      )}
                    </Dropzone> */}
                    <DropzoneComponent image={image} setImage={setImage} />
                  </HStack>
                )}
                ;
                <Divider mx="1rem" />
                <HStack gap="0.7rem" maxW="full">
                  <HStack
                    gap="0.2rem"
                    sx={{ '&:hover': { cursor: 'pointer', opacity: '0.8' } }}
                    onClick={() => isSetImage(!isImage)}
                  >
                    <IconButton
                      title="setImage"
                      appearance={'none'}
                      icon={<MdImage />}
                      isRound
                      size={'sm'}
                    />
                    <Text fontSize={'small'}>Image</Text>
                  </HStack>

                  {isNonMobile ? (
                    <>
                      <HStack>
                        <MdOutlineGif />
                        <Text fontSize={'small'}>clip</Text>
                      </HStack>

                      <HStack>
                        <MdOutlineAttachFile />
                        <Text fontSize={'small'}>Attchment</Text>
                      </HStack>

                      <HStack>
                        <MdOutlineMic />
                        <Text fontSize={'small'}>Audio</Text>
                      </HStack>
                    </>
                  ) : (
                    <MdOutlineMoreHoriz />
                  )}
                  <Button
                    title="post"
                    appearance={'none'}
                    isLoading={isLoad}
                    fontSize={'smaller'}
                    isDisabled={post ? false : true}
                    onClick={handlePost}
                    bgColor={colorMode === 'light' ? '#3fe8eb' : '#e81328'}
                    borderRadius={'0.2rem'}
                  >
                    POST
                  </Button>
                </HStack>
              </VStack>
              <VStack minW={'full'}>
                <Posts />
              </VStack>
            </VStack>
            {isNonMobile && <FriendList userId={_id} />}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default Home;
