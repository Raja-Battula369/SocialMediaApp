import {
  Box,
  Grid,
  Image,
  Text,
  useColorMode,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../../App.css';

const News = () => {
  const [news, setNews] = useState([]);
  const { colorMode } = useColorMode();
  const toast = useToast();
  const getNews = async () => {
    const data = await axios.get(
      'https://newsapi.org/v2/top-headlines?country=in&apiKey=7688240262014795b2f1e7bfa3398426&category=sports&pageSize=40'
    );

    setNews(data.data.articles);
  };

  useEffect(() => {
    getNews();
    toast({
      title: 'Please wait for backend Server Load, Untill see News ',
      status: 'info',
      isClosable: true,
      duration: 2000,
    });
  }, []);

  return (
    <Grid
      className="animation"
      templateColumns={['repeat(1,1fr)', 'repeat(2,1fr)', 'repeat(3,1fr)']}
      w="100vw"
      p="1rem"
    >
      {news.map((article, index) => (
        <Box
          key={index}
          border={'1.5px solid'}
          shadow={'md'}
          m="0.4rem"
          p="1rem"
          borderRadius={'10px'}
          bgColor={colorMode === 'light' ? 'black' : 'white'}
          color={colorMode === 'light' ? 'white' : 'black'}
        >
          <a href={article.url} target="__black">
            <Text as={'b'}>{article.title}</Text>
            <Image
              objectFit={'cover'}
              boxSize={'25rem'}
              borderRadius={'20px'}
              shadow={'base'}
              src={article.urlToImage}
              alt="img"
            />
            <Text textDecor={'underline'} as={'b'}>
              author: {article.author}
            </Text>
            <Text>{article.description}</Text>
          </a>
        </Box>
      ))}
    </Grid>
  );
};

export default News;
