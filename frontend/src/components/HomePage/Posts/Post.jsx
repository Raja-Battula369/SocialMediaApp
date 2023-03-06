import {
  AspectRatio,
  HStack,
  IconButton,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPost } from '../../../State/State';
import Friend from '../Friends/Friend';
import {
  MdDeleteOutline,
  MdFavoriteBorder,
  MdOutlineFavorite,
  MdShare,
} from 'react-icons/md';
import { setError } from '../../../State/State';
import Comments from './Comments/Comments';

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
  feed,
}) => {
  const dispatch = useDispatch();

  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const patchLikes = async () => {
    try {
      const { data } = await axios.patch(
        `https://socialmediaapp-9air.onrender.com/posts/${postId}/like`,
        { userId: loggedInUserId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      dispatch(setPost({ post: data }));
    } catch (error) {
      dispatch(
        setError({
          error: error.response.data.message,
        })
      );
    }
  };

  const handleDelete = async () => {
    try {
      const { data } = await axios.delete(
        `https://socialmediaapp-9air.onrender.com/posts/${postId}/deletepost`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch(setPost({ post: data }));
      feed();
    } catch (error) {
      dispatch(
        setError({
          error: error.response.data.message,
        })
      );
    }
  };
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
        <AspectRatio minW={['full', '25rem', '25rem']} ratio={1 / 1.5}>
          <Image
            alt={picturePath}
            src={`https://socialmediaapp-9air.onrender.com/assets/${picturePath}`}
            objectFit="cover"
          />
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
            onClick={patchLikes}
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
            comments={comments}
            postUserId={postUserId}
          />
        </HStack>
        <IconButton
          title="share"
          appearance={'none'}
          variant={'outline'}
          isRound
          size={'sm'}
          icon={<MdShare />}
        />
        {postUserId === loggedInUserId && (
          <IconButton
            title="delete"
            variant={'outline'}
            isRound
            size={'sm'}
            onClick={handleDelete}
            icon={<MdDeleteOutline />}
          />
        )}
      </HStack>
    </VStack>
  );
};

export default Post;
