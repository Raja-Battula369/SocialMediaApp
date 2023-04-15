import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  HStack,
  Input,
  SimpleGrid,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import axios from 'axios';
import { setError, setLogin } from '../../State/State';
import { Formik } from 'formik';
import Dropzone from 'react-dropzone';
import { MdOutlineModeEdit } from 'react-icons/md';

const registerSchema = yup.object().shape({
  firstName: yup.string().required('required'),
  lastName: yup.string().required('required'),
  email: yup.string().email('Invalid email').required('required'),
  password: yup.string().required('required'),
  location: yup.string().required('required'),
  occupation: yup.string().required('required'),
  picture: yup.string().required('required'),
});
const loginSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('required'),
  password: yup.string().required('required'),
});

const initialValuesRegister = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  location: '',
  occupation: '',
  picture: '',
};

const intialValuesLogin = {
  email: '',
  password: '',
};

const Form = () => {
  const toast = useToast();
  const [loginError, setLoginError] = useState('');
  const [pageType, setPageType] = useState('login');
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLogin = pageType === 'login';
  const isRegister = pageType === 'register';
  const registerPage = async (values, onSubmitProps) => {
    const formData = new FormData();

    for (let value in values) {
      formData.append(value, values[value]);
    }
    // formData.append('picturePath', values.picture);

    console.log(...formData);

    try {
      setIsLoading(true);
      const data = await axios.post(
        'https://socialmediaapp-9air.onrender.com/auth/register',
        formData
      );
      onSubmitProps.resetForm();
      setIsLoading(false);
      if (data) setPageType('login');
    } catch (error) {
      setIsLoading(false);
      setLoginError('Please Enter Unique Email');
      console.log(error);
    }
  };

  const login = async (values, onSubmitProps) => {
    try {
      setIsLoading(true);
      const { data } = await axios.post(
        'https://socialmediaapp-9air.onrender.com/login',
        values
      );
      dispatch(setError({ error: '' }));

      onSubmitProps.resetForm();
      if (data) {
        dispatch(
          setLogin({
            user: data.data,
            token: data.token,
          })
        );
        setIsLoading(false);
        navigate('/home');
      }
    } catch (error) {
      setIsLoading(false);
      setLoginError(error.response.data.message);
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await registerPage(values, onSubmitProps);
  };

  useEffect(() => {
    if (loginError) {
      setTimeout(
        () =>
          toast({
            title: loginError,
            status: 'error',
            isClosable: true,
          }),
        150
      );
    }
    return setLoginError('');
  }, [loginError]);

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? intialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <VStack gap={'1rem'} shadow="md" p="1rem" borderRadius={'3rem'}>
            {isRegister && (
              <>
                <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={10}>
                  <FormControl
                    isInvalid={touched.firstName && errors.firstName}
                  >
                    <Input
                      appearance={'none'}
                      title="firstName"
                      type={'text'}
                      value={values?.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="firstName"
                      placeholder="firstName"
                    />
                    <FormErrorMessage>
                      *{touched.firstName && errors.firstName}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={touched.lastName && errors.lastName}>
                    <Input
                      appearance={'none'}
                      title="lastName"
                      type={'text'}
                      value={values?.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="lastName"
                      placeholder="lastName"
                    />
                    <FormErrorMessage>
                      *{touched.lastName && errors.lastName}
                    </FormErrorMessage>
                  </FormControl>
                </SimpleGrid>

                <FormControl isInvalid={touched.location && errors.location}>
                  <Input
                    appearance={'none'}
                    title="loc"
                    type={'text'}
                    value={values?.location}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="location"
                    placeholder="location"
                  />
                  <FormErrorMessage>
                    *{touched.location && errors.location}
                  </FormErrorMessage>
                </FormControl>

                <FormControl
                  isInvalid={touched.occupation && errors.occupation}
                >
                  <Input
                    appearance={'none'}
                    title="occ"
                    type={'text'}
                    value={values?.occupation}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="occupation"
                    placeholder="occupation"
                  />
                  <FormErrorMessage>
                    *{touched.occupation && errors.occupation}
                  </FormErrorMessage>
                </FormControl>

                <Box w={'full'}>
                  <Dropzone
                    acceptedFiles=".jpg,.jpeg,.png"
                    multiple={false}
                    onDrop={(acceptedFiles) =>
                      setFieldValue('picture', acceptedFiles[0])
                    }
                  >
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        w={'full'}
                        {...getRootProps()}
                        border={'2px dashed grey'}
                        p="1rem"
                        sx={{ '&:hover': { cursor: 'pointer' } }}
                      >
                        <input
                          type="file"
                          accept="image/apng, image/jpg, image/gif, image/jpeg, image/png, image/svg+xml, image/webp"
                          appearance={'none'}
                          title="input"
                          {...getInputProps()}
                        />

                        {!values.picture ? (
                          <Text>Add Picture here</Text>
                        ) : (
                          <HStack justifyContent={'space-between'}>
                            <Text>{values.picture.name}</Text>
                            <MdOutlineModeEdit />
                          </HStack>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                </Box>

                <FormControl isInvalid={touched.email && errors.email}>
                  <Input
                    appearance={'none'}
                    title="email"
                    type={'email'}
                    value={values?.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="email"
                    placeholder="email"
                  />
                  <FormErrorMessage>
                    *{touched.email && errors.email}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={touched.password && errors.password}>
                  <Input
                    appearance={'none'}
                    title="pass"
                    type={'password'}
                    value={values?.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="password"
                    placeholder="password"
                  />
                  <FormErrorMessage>
                    *{touched.password && errors.password}
                  </FormErrorMessage>
                </FormControl>
              </>
            )}
            {isLogin && (
              <>
                <FormControl isInvalid={touched.email && errors.email}>
                  <Input
                    appearance={'none'}
                    title="email1"
                    type={'email'}
                    value={values?.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="email"
                    placeholder="email"
                  />
                  <FormErrorMessage>
                    *{touched.email && errors.email}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={touched.password && errors.password}>
                  <Input
                    appearance={'none'}
                    title="pass2"
                    type={'password'}
                    value={values?.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="password"
                    placeholder="password"
                  />
                  <FormErrorMessage>
                    *{touched.password && errors.password}
                  </FormErrorMessage>
                </FormControl>
              </>
            )}
            <Button
              isLoading={isLoading}
              maxWidth={'full'}
              appearance={'none'}
              title="submit"
              type="submit"
            >
              {isLogin ? 'LOGIN' : 'REGISTER'}
            </Button>
            <Text
              textDecoration={'underline'}
              sx={{ '&:hover': { cursor: 'pointer', opacity: 0.6 } }}
              fontSize={['0.5rem', '0.5rem', '0.7rem']}
              onClick={() => {
                setPageType(isLogin ? 'register' : 'login');
                resetForm();
              }}
            >
              {isLogin
                ? "Don't have an account? Sign Up here."
                : 'Already have an account? Login here.'}
            </Text>
          </VStack>
        </form>
      )}
    </Formik>
  );
};

export default Form;
