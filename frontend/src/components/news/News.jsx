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
    const options = {
      method: 'GET',
      url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/news/list',
      params: {
        category: 'generalnews',
        region: 'IN',
      },
      headers: {
        'content-type': 'application/octet-stream',
        'X-RapidAPI-Key': '9f28ed6536msh6e36d22ce1844aap1181efjsn647ac1018fbe',
        'X-RapidAPI-Host': 'apidojo-yahoo-finance-v1.p.rapidapi.com',
      },
    };
    try {
      const response = await axios.request(options);
      setNews(response.data.items.result);
      // console.log(response.data);
    } catch (error) {
      console.error(error);
    }

    // setNews(data.data.articles);
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
      {news.slice(0, 20).map((article, index) => (
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
          <a href={article.link} target="__black">
            <Text as={'b'}>{article.title}</Text>
            <Image
              objectFit={'cover'}
              boxSize={'25rem'}
              borderRadius={'20px'}
              shadow={'base'}
              src={article.main_image.original_url}
              alt="img"
            />
            <Text textDecor={'underline'} as={'b'}>
              author: {article.author}
            </Text>
            <Text>{article.summary}</Text>
          </a>
        </Box>
      ))}
    </Grid>
  );
};

export default News;
