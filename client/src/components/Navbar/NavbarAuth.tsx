import {
  Avatar,
  Button,
  ButtonGroup,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { AVATAR_PATH } from '~/consts/avatar';
import { useAppSelector } from '~/hooks/use-app-selector';
import useRequestHandler from '~/hooks/use-request-handler';
import { useLogoutMutation } from '~/store/api/auth-slice';

const NavbarAuth = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.profile);

  const [logout] = useLogoutMutation();
  const { handler: logoutHandler } = useRequestHandler<void>({ f: logout });

  if (user.id) {
    return (
      <Menu>
        <HStack spacing={2}>
          <Text color="secondary" fontWeight="semibold">
            {user.login}
          </Text>
          <MenuButton as={Button} rounded="full" variant="link" cursor="pointer">
            <Avatar bgColor="tertiary" size="sm" name={user.fullName} src={AVATAR_PATH(user.picturePath)} />
          </MenuButton>
        </HStack>
        <MenuList>
          <MenuGroup title="Events">
            <MenuItem color="secondary" px={4} py={2} onClick={() => navigate('/profile/events')}>
              My events
            </MenuItem>
            <MenuItem color="secondary" px={4} py={2} onClick={() => navigate('/profile/tickets')}>
              My tickets
            </MenuItem>
          </MenuGroup>
          <MenuDivider />
          <MenuGroup title="Account">
            <MenuItem px={4} py={2} onClick={() => navigate('/profile')}>
              Settings
            </MenuItem>
            <MenuItem px={4} py={2} color="red" onClick={() => logoutHandler()}>
              Log out
            </MenuItem>
          </MenuGroup>
        </MenuList>
      </Menu>
    );
  }

  return (
    <ButtonGroup colorScheme="blue">
      <Button variant="outline" onClick={() => navigate('/login')}>
        Log in
      </Button>
      <Button variant="ghost" onClick={() => navigate('/register')}>
        Sign up
      </Button>
    </ButtonGroup>
  );
};

export default NavbarAuth;
