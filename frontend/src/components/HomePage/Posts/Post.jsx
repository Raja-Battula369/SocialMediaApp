import {
  AspectRatio,
  HStack,
  IconButton,
  Image,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import React, { lazy, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  MdDeleteOutline,
  MdFavoriteBorder,
  MdOutlineFavorite,
  MdShare,
} from 'react-icons/md';
import {
  RouterFetchForDelete,
  RouterFetchForPatch,
} from '../../../RouterFeatch';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setError } from '../../../State/State';

const Friend = lazy(() => import('../Friends/Friend'));
const Comments = lazy(() => import('./Comments/Comments'));

const Post = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
}) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const toast = useToast();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(
    likes[loggedInUserId] !== undefined ? likes[loggedInUserId] : false
  );
  const likeCount = Object.keys(likes).length;

  const patchLikes = () => {
    PatchLikeHandler.mutate();
  };
  const vibrateFunction = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(500);
    }
  };

  const handleShare = async () => {
    const url = `https://social-media-app-gamma-five.vercel.app/profile/${postUserId}`;
    await navigator.clipboard.writeText(url);
    toast({
      title: 'copied',
      status: 'success',
      isClosable: true,
    });
    await navigator.clipboard.readText();
  };

  const PatchLikeHandler = useMutation(
    async () => {
      try {
        const data = await RouterFetchForPatch(
          `/posts/${postId}/like`,
          { userId: loggedInUserId },
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
        queryClient.invalidateQueries(['PostsGet']);
        // queryClient.refetchQueries('PostsGet', { force: true });
      },
    }
  );

  const handleDelete = async () => {
    DeletePostHandler.mutate();
  };
  const DeletePostHandler = useMutation(
    async () => {
      try {
        const data = await RouterFetchForDelete(
          `/posts/${postId}/deletepost`,
          `Bearer ${token}`
        );

        toast({
          title: 'Post deleted',
          status: 'info',
          isClosable: true,
        });
        return data;
      } catch (error) {
        dispatch(
          setError({
            error: error.response.data.message,
          })
        );
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['PostsGet']);
        // queryClient.refetchQueries('PostsGet', { force: true });
      },
    }
  );

  return (
    <VStack m="1.5rem 0" shadow={'sm'} minW="full" p="1rem">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
        userId={postUserId}
      />

      <Text alignSelf={'flex-start'} maxW={['70vw', '65vw', '60vw', '50vw']}>
        {description}
      </Text>
      {picturePath && (
        <AspectRatio minW={['85vw', '25rem', '25rem']} ratio={1 / 1.5}>
          <Image alt={picturePath} src={picturePath} objectFit="cover" />
        </AspectRatio>
      )}

      <HStack w="full" justifyContent={'space-evenly'}>
        <HStack>
          <IconButton
            title="like"
            appearance={'none'}
            variant={'outline'}
            isRound
            size={'sm'}
            onClick={() => {
              patchLikes();
              vibrateFunction();
            }}
            icon={
              isLiked ? <MdOutlineFavorite color="red" /> : <MdFavoriteBorder />
            }
          />
          <Text as={'b'}>{likeCount}</Text>
        </HStack>
        <HStack>
          <Comments
            postId={postId}
            picturePath={picturePath}
            name={name}
            userPicturePath={userPicturePath}
            CommentS={comments}
            postUserId={postUserId}
          />
        </HStack>
        <IconButton
          title="share"
          appearance={'none'}
          variant={'outline'}
          isRound
          size={'sm'}
          onClick={handleShare}
          icon={<MdShare />}
        />
        {postUserId === loggedInUserId && (
          <IconButton
            title="delete"
            variant={'outline'}
            isRound
            size={'sm'}
            onClick={() => {
              handleDelete();
              vibrateFunction();
            }}
            icon={<MdDeleteOutline />}
          />
        )}
      </HStack>
    </VStack>
  );
};

export default memo(Post);
