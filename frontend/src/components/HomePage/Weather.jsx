import { HStack, Image, Text } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Weather = () => {
  const [location, setLocation] = useState(null);
  const [weather, SetWeather] = useState(null);

  useEffect(() => {
    const getCoor = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (error) => console.log(error)
      );
    };
    getCoor();
  }, []);
  useEffect(() => {
    const getWeatherData = async () => {
      try {
        const { data } = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${location?.latitude}&lon=${location?.longitude}&appid=c9195d7364d04d950f4360722772ed4d&units=metric`
        );
        SetWeather(data);
      } catch (error) {
        console.log(error);
      }
    };

    getWeatherData();
  }, [location]);

  return (
    <>
      <HStack maxW={'12rem'}>
        <Image
          src={
            'https://openweathermap.org/img/w/' +
            weather?.weather[0].icon +
            '.png'
          }
          alt="weatherIcon"
          maxW={'sm'}
          objectFit="cover"
        />
        <Text fontSize={'small'} as="b">
          {weather?.main.temp}°C
        </Text>
        <Text fontSize={'small'}>{weather?.name}</Text>
      </HStack>
      {/* <Button onClick={getCoor} variant="outline">
        location
      </Button> */}
    </>
  );
};

export default Weather;
