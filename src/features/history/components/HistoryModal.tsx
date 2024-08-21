import { RepeatClockIcon } from "@chakra-ui/icons";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  IconButton,
} from "@chakra-ui/react";
import { useState } from "react";

import { useWindowSize } from "@/hooks";

export const HistoryModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { width, height } = useWindowSize();
  const [size, setSize] = useState("md");

  const handleSizeClick = () => {
    let bp = "md";
    if (width < 400) bp = "xs";
    else if (width < 768) bp = "sm";

    setSize(bp);
    onOpen();
  };

  return (
    <>
      <IconButton
        colorScheme="teal"
        aria-label="History"
        icon={<RepeatClockIcon />}
        onClick={handleSizeClick}
      />

      <Modal isOpen={isOpen} onClose={onClose} size={size} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>2024年度</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <TableContainer overflowY={"scroll"} maxH={height * 0.8}>
              <Table size="sm" variant="simple" colorScheme="teal">
                <Thead>
                  <Tr>
                    <Th>取得日</Th>
                    <Th>全休/半休</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {[...Array(20)].map((_, i) => (
                    <Tr key={i}>
                      <Td>2022/05/12</Td>
                      <Td>全休</Td>
                      <Td isNumeric>
                        <Button colorScheme="teal" size="sm">
                          削除
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
