import {
  Box,
  Button,
  Container,
  Divider,
  HStack,
  IconButton,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  useDisclosure,
  useMediaQuery,
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { MdChatBubbleOutline } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { setError } from '../../../../State/State';
import Comment from './Comment';
import Friend from '../../Friends/Friend';
const Comments = ({
  postId,
  name,
  userPicturePath,
  picturePath,
  postUserId,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();

  const [msg, setMsg] = useState('');
  const [comments, setComments] = useState([]);
  const [isLoad, isSetLoad] = useState(false);

  const [isNonMobile] = useMediaQuery('(min-width: 425px)');
  const token = useSelector((state) => state.token);
  const { _id } = useSelector((state) => state.user);

  const updateComments = async () => {
    isSetLoad(true);
    const updateMessage = { message: { id: _id, message: msg } };
    try {
      await axios.patch(
        `https://socialmediaapp-9air.onrender.com/posts/${postId}/comments`,
        updateMessage,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      dispatch(
        setError({
          error: error.request.response
            .split(' ')[0]
            .split(':')[2]
            .split(',')[0],
        })
      );
      console.log(error);
    }
  };

  const getComments = async () => {
    try {
      const { data } = await axios.get(
        `https://socialmediaapp-9air.onrender.com/posts/${postId}/post`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComments(data.comments);
      isSetLoad(false);
      setMsg('');
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getComments();
  }, []);
  return (
    <Container>
      <HStack>
        <IconButton
          appearance={'none'}
          variant={'outline'}
          isRound
          size={'sm'}
          icon={<MdChatBubbleOutline />}
          onClick={onOpen}
        />
        <Text>{comments.length}</Text>
      </HStack>

      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent minW={'80vw'} minH="80vh">
          <ModalHeader>Comments</ModalHeader>
          <ModalCloseButton appearance={'none'} />
          <ModalBody pb={6}>
            <SimpleGrid columns={['1', '1', '2']} gap="0.5rem">
              {isNonMobile && (
                <Image
                  height={'100vh'}
                  w={['100vw', '100vw', '50vw']}
                  src={`https://socialmediaapp-9air.onrender.com/assets/${picturePath}`}
                  objectFit={'cover'}
                />
              )}

              <Box>
                <VStack
                  p={'0.5rem'}
                  alignItems={'flex-start'}
                  maxH="90vh"
                  overflowY={'scroll'}
                  sx={{
                    '&::-webkit-scrollbar': { display: 'none' },
                  }}
                >
                  <Friend
                    name={name}
                    userPicturePath={userPicturePath}
                    friendId={postUserId}
                    userId={postUserId}
                  />
                  <Divider />
                  {[...comments].reverse().map(({ id, message }, i) => (
                    <Comment key={i + id} message={message} id={id} />
                  ))}
                </VStack>
                <HStack m="1rem">
                  <Input
                    pattern="^[\u0020-\u007E\u00A0-\u00FF\u0100-\u017F\u0180-\u024F\u2000-\u206F\u20A0-\u20CF\u2100-\u214F\u2200-\u22FF\u2300-\u23FF\u2460-\u24FF\u2500-\u257F\u2580-\u259F\u25A0-\u25FF\u2600-\u26FF\u27C0-\u27EF\u2900-\u297F\u2B00-\u2BFF\u2C60-\u2C7F\u2E00-\u2E7F\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\u3100-\u312F\u3130-\u318F\u3190-\u319F\u31A0-\u31BF\u31C0-\u31EF\u31F0-\u31FF\u3200-\u32FF\u3300-\u33FF\u3400-\u4DBF\u4E00-\u9FFF\uA000-\uA48F\uA490-\uA4CF\uA960-\uA97F\uAC00-\uD7AF\uD800-\uDB7F\uDC00-\uDFFF\uE000-\uF8FF\uF900-\uFAFF\uFE00-\uFE0F\uFE10-\uFE1F\uFE30-\uFE4F\uFE50-\uFE6F\uFE70-\uFEFF\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDE4F\uDE80-\uDEFF]|\uD83E[\uDD00-\uDDFF]]*$"
                    title="comm"
                    appearance={'none'}
                    placeholder="Add comment"
                    value={msg}
                    type="text"
                    onChange={(e) => {
                      setMsg(e.target.value);
                    }}
                  />
                  <Button
                    title="comment"
                    appearance={'none'}
                    isLoading={isLoad}
                    isDisabled={!msg}
                    onClick={() => {
                      updateComments();
                      setTimeout(() => getComments(), 2000);
                    }}
                  >
                    Post
                  </Button>
                </HStack>
              </Box>
            </SimpleGrid>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Comments;
