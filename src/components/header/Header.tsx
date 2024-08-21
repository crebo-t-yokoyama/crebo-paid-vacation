import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

export const Header = () => {
  const router = useRouter();

  return (
    <Flex
      justify="space-between"
      px={2}
      py={1}
      bgColor="teal"
      alignItems="center"
    >
      <Flex alignItems="center" gap={4}>
        <Avatar
          size="sm"
          name="Dan Abrahmov"
          src="https://bit.ly/dan-abramov"
        />
        <Text>横山 太軌</Text>
      </Flex>
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Options"
          icon={<HamburgerIcon fontSize="md" />}
          bgColor="transparent"
          _hover={{ bgColor: "transparent" }}
        />
        <MenuList>
          <MenuItem>ログアウト</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};
