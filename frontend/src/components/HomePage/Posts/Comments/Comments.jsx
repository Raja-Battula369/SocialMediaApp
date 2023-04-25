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
import React, { lazy, useEffect, useState } from 'react';
import { MdChatBubbleOutline } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';

import {
  RouterFetchForGet,
  RouterFetchForPatch,
} from '../../../../RouterFeatch';

const Friend = lazy(() => import('../../Friends/Friend'));
const Comment = lazy(() => import('./Comment'));

const Comments = ({
  postId,
  name,
  userPicturePath,
  picturePath,
  postUserId,
  CommentS,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();

  const [msg, setMsg] = useState('');
  const [comments, setComments] = useState([]);
  const [isLoad, isSetLoad] = useState(false);

  const [isNonMobile] = useMediaQuery('(min-width: 500px)');
  const token = useSelector((state) => state.token);
  const { _id } = useSelector((state) => state.user);

  const updateComments = async () => {
    isSetLoad(true);
    const updateMessage = { message: { id: _id, message: msg } };
    try {
      await RouterFetchForPatch(
        `/posts/${postId}/comments`,
        updateMessage,
        `Bearer ${token}`
      );
      isSetLoad(false);
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

  const getComments = async () => {
    try {
      const data = await RouterFetchForGet(
        `/posts/${postId}/post`,
        `Bearer ${token}`
      );
      setComments(data?.comments);
      isSetLoad(false);
      setMsg('');
    } catch (error) {
      isSetLoad(false);
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
        <Text>{comments?.length}</Text>
      </HStack>

      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent minW={'80vw'} minH="80vh">
          <ModalHeader>Comments</ModalHeader>
          <ModalCloseButton appearance={'none'} />
          <ModalBody pb={6}>
            <SimpleGrid columns={['1', '1', '2']} gap="0.5rem">
              {isNonMobile && picturePath && (
                <Image
                  height={'100vh'}
                  alt={picturePath}
                  w={['100vw', '100vw', '50vw']}
                  src={picturePath}
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
                  {comments &&
                    [...comments]
                      ?.reverse()
                      ?.map(({ id, message }, i) => (
                        <Comment key={i + id} message={message} id={id} />
                      ))}
                </VStack>
                <HStack m="1rem">
                  <Input
                    title="commment"
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
