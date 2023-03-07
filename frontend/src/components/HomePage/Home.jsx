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
  VStack,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import {
  MdDeleteOutline,
  MdHome,
  MdImage,
  MdOutlineAttachFile,
  MdOutlineGif,
  MdOutlineMic,
  MdOutlineModeEdit,
  MdOutlineMoreHoriz,
} from 'react-icons/md';
import Dropzone from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setError, setPosts } from '../../State/State';
import FriendList from './Friends/FriendList';
import Posts from './Posts/Posts';
import Error from '../Error/Error';
import { Link } from 'react-router-dom';
import Weather from './Weather';

const Home = () => {
  const dispatch = useDispatch();
  const [isNonMobile] = useMediaQuery('(min-width: 1000px)');
  const [image, setImage] = useState(null);
  const [isImage, isSetImage] = useState(false);
  const [post, setPost] = useState('');
  const [isLoad, isSetLoad] = useState(false);
  const { colorMode } = useColorMode();

  const { _id, picturePath } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const status = useSelector((state) => state.error);

  const PicturePath = `https://socialmediaapp-9air.onrender.com/assets/${picturePath}`;
  const handlePost = async () => {
    isSetLoad(true);

    const formData = new FormData();
    formData.append('userId', _id);
    formData.append('description', post);
    if (image) {
      formData.append('picture', image);
      formData.append('picturePath', image.name);
    }
    try {
      const { data } = await axios.post(
        'https://socialmediaapp-9air.onrender.com/posts',
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const posts = data;
      dispatch(setPosts({ posts }));
      setPost('');
      setImage(null);
      isSetLoad(false);
    } catch (error) {
      dispatch(
        setError({
          error: error.response.data.message,
        })
      );
    }
  };
  return (
    <Container maxW={'full'} bg={colorMode === 'light' ? '#bbecf0' : ''}>
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
            >
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
                  <Avatar size={'sm'} src={PicturePath} objectFit="cover" />
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
          >
            <VStack
              gridColumnStart={['2', '']}
              w={['100%', '28rem']}
              p="1rem"
              shadow="md"
              m="2rem 0"
              borderRadius={'1rem'}
            >
              <HStack w={'full'}>
                <Avatar size={'md'} src={PicturePath} objectFit="cover" />
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
                  <Dropzone
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
                        <Input
                          appearance={'none'}
                          title="addImage"
                          {...getInputProps()}
                        />
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
                  </Dropzone>
                  {image && (
                    <IconButton
                      title="deleteImg"
                      appearance={'none'}
                      isRound
                      size={'sm'}
                      icon={<MdDeleteOutline />}
                      onClick={() => setImage(null)}
                    />
                  )}
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
                  isDisabled={!post}
                  onClick={handlePost}
                  bgColor={colorMode === 'light' ? '#3fe8eb' : '#e81328'}
                  borderRadius={'0.2rem'}
                >
                  POST
                </Button>
              </HStack>
            </VStack>
            <VStack>
              <Posts />
            </VStack>
          </VStack>
          {isNonMobile && <FriendList userId={_id} />}
        </Grid>
      )}
    </Container>
  );
};

export default Home;
