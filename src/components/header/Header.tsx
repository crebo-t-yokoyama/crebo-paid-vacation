import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";

export const Header = () => {
  const router = useRouter();

  const { data: session } = useSession();

  return (
    <Flex
      justify="space-between"
      px={2}
      py={1}
      bgColor="teal"
      alignItems="center"
    >
      <Flex alignItems="center" gap={4}>
        <Text>{session?.user?.name}</Text>
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
          <MenuItem onClick={() => signOut()}>ログアウト（未対応）</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};
