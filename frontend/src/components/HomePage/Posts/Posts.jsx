import { Skeleton } from '@chakra-ui/react';

import React, { lazy, memo } from 'react';
import { useSelector } from 'react-redux';
import { RouterFetchForGet } from '../../../RouterFeatch';
import { useQuery } from '@tanstack/react-query';

const Post = lazy(() => import('./Post'));

const Posts = () => {
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  const getPosts = async () => {
    const data = await RouterFetchForGet(`/posts`, `Bearer ${token}`);
    return data;
  };

  const { data } = useQuery(['PostsGet'], getPosts);

  return (
    <Skeleton isLoaded={posts}>
      {data?.map(
        ({
          _id,
          userId,
          firstName,
          lastName,
          description,
          location,
          picturePath,
          userPicturePath,
          likes,
          comments,
        }) => (
          <Post
            key={_id}
            postId={_id}
            postUserId={userId}
            name={`${firstName} ${lastName}`}
            description={description}
            location={location}
            picturePath={picturePath}
            userPicturePath={userPicturePath}
            likes={likes}
            CommentS={comments}
          />
        )
      )}
    </Skeleton>
  );
};

export default memo(Posts);
