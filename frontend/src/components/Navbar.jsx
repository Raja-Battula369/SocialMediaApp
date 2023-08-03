import {
  Button,
  ButtonGroup,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
  useMediaQuery,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import {
  MdDarkMode,
  MdExpandMore,
  MdLightMode,
  MdMenu,
  MdMessage,
  MdNotifications,
} from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLogout } from '../State/State';
import Search from './Search';

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [isNonMobile] = useMediaQuery('(min-width: 800px)');
  const [Shadow, setShadow] = useState(null);

  const userName = useSelector((state) => state.user.firstName);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setShadow(window.pageYOffset);
    document.addEventListener('wheel', handleScroll);
    return () => {
      document.removeEventListener('wheel', handleScroll);
    };
  }, []);
  return (
    <HStack
      maxW={'full'}
      px="2rem"
      py="1rem"
      justifyContent={'space-between'}
      shadow={Shadow > 0 ? 'xl' : ''}
      pos={'sticky'}
      top={0}
      bg={colorMode === 'light' ? 'white' : 'black'}
      zIndex={99}
    >
      <Text
        sx={{ '&:hover': { cursor: 'pointer', opacity: 0.6 } }}
        fontSize={['1rem', '1.5rem', '2.2rem']}
        fontWeight="bold"
        onClick={() => navigate('/home')}
      >
        Meta:Mates
      </Text>
      {isNonMobile ? (
        <>
          <Search />

          <ButtonGroup title="iconGroup" appearance={'none'} gap={'1rem'}>
            {colorMode === 'light' ? (
              <IconButton
                title="dark"
                appearance={'none'}
                isRound
                onClick={toggleColorMode}
                icon={<MdDarkMode />}
              />
            ) : (
              <IconButton
                title="light"
                appearance={'none'}
                isRound
                onClick={toggleColorMode}
                icon={<MdLightMode />}
              />
            )}
            <IconButton
              title="msg"
              appearance={'none'}
              isRound
              icon={<MdMessage />}
            />
            <IconButton
              title="notification"
              appearance={'none'}
              isRound
              icon={<MdNotifications />}
            />
          </ButtonGroup>

          <Menu>
            {({ isOpen }) => (
              <>
                <MenuButton
                  title="menubut"
                  appearance={'none'}
                  isActive={isOpen}
                  as={Button}
                  rightIcon={<MdExpandMore />}
                >
                  {isOpen ? 'Close' : userName}
                </MenuButton>
                <MenuList>
                  <MenuItem px="0.5rem">{userName}</MenuItem>
                  <MenuItem px="0.5rem" onClick={() => dispatch(setLogout())}>
                    LogOut{' '}
                  </MenuItem>
                </MenuList>
              </>
            )}
          </Menu>
        </>
      ) : (
        <VStack>
          <Menu>
            <MenuButton
              title="menubtn1"
              appearance={'none'}
              pr="0.5rem"
              as={IconButton}
              rightIcon={<MdMenu size={'1.5rem'} />}
              aria-label="Options1"
              variant="outline"
            />

            <MenuList>
              <ButtonGroup
                title="groupbtn"
                appearance={'none'}
                px="2rem"
                gap={'1rem'}
              >
                {colorMode === 'light' ? (
                  <IconButton
                    appearance={'none'}
                    title="dark"
                    isRound
                    onClick={toggleColorMode}
                    icon={<MdDarkMode />}
                  />
                ) : (
                  <IconButton
                    appearance={'none'}
                    title="light"
                    isRound
                    onClick={toggleColorMode}
                    icon={<MdLightMode />}
                  />
                )}
                <IconButton
                  appearance={'none'}
                  title="message"
                  isRound
                  icon={<MdMessage />}
                />
                <IconButton
                  appearance={'none'}
                  title="notifications"
                  isRound
                  icon={<MdNotifications />}
                />
              </ButtonGroup>
              <MenuItem
                my={'1rem'}
                alignSelf="center"
                px="0.5rem"
                onClick={() => dispatch(setLogout())}
              >
                LogOut
              </MenuItem>
            </MenuList>
          </Menu>
        </VStack>
      )}
      ;
    </HStack>
  );
};

export default Navbar;
