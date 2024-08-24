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

import { useCancelMutation } from "@/api/db/cancel";
import { LoadingOverlay } from "@/components/overlay";
import { useWindowSize } from "@/hooks";

type HistoryModalProps = {
  employmentYears: number;
  vacationHistory: {
    id: number;
    employeeCode: string;
    acquisitionDate: string;
    halfFlg: boolean;
  }[];
  refetch: () => void;
};

export const HistoryModal = (props: HistoryModalProps) => {
  const { vacationHistory, employmentYears, refetch } = props;

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

  const cancelMutation = useCancelMutation();

  const cancel = (id: number, employeeCode: string) => {
    cancelMutation
      .mutateAsync({ id: id, employeeCode: employeeCode })
      .then(() => refetch());
  };

  return (
    <>
      <LoadingOverlay isLoading={cancelMutation.isPending} />
      <IconButton
        colorScheme="teal"
        aria-label="History"
        icon={<RepeatClockIcon />}
        onClick={handleSizeClick}
      />

      <Modal isOpen={isOpen} onClose={onClose} size={size} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{`${employmentYears}年目分`}</ModalHeader>
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
                  {vacationHistory.map((x, i) => (
                    <Tr key={i}>
                      <Td>{x.acquisitionDate}</Td>
                      <Td>{x.halfFlg ? "半休" : "全休"}</Td>
                      <Td isNumeric>
                        <Button
                          colorScheme="teal"
                          size="sm"
                          onClick={() => cancel(x.id, x.employeeCode)}
                        >
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
