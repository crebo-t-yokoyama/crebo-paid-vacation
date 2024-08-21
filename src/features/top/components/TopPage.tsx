import {
  Button,
  Card,
  CardBody,
  Heading,
  Stack,
  StackDivider,
  Flex,
} from "@chakra-ui/react";
import { useState } from "react";

import { DatePicker } from "@/components/datepicker";
import { HistoryModal } from "@/features/history";

export const TopPage = () => {
  const [startDate, setStartDate] = useState(new Date());

  return (
    <Stack w="full" p={4}>
      <Card border="1px solid gray">
        <CardBody p={4}>
          <Stack divider={<StackDivider />} spacing="4">
            <Flex justify="space-between" alignItems="center">
              <Heading size="md">入社年月</Heading>
              <Heading size="md">2020/04</Heading>
            </Flex>
            <Flex justify="space-between" alignItems="center">
              <Heading size="md">有休更新日</Heading>
              <Heading size="md">10/01</Heading>
            </Flex>
          </Stack>
        </CardBody>
      </Card>
      <Card border="1px solid gray">
        <CardBody p={4}>
          <Flex justify="space-between" alignItems="center">
            <Heading size="md">残りの有休日数</Heading>
            <Heading size="2xl" textAlign="end">
              17日
            </Heading>
          </Flex>
        </CardBody>
      </Card>
      <Card border="1px solid gray">
        <CardBody p={4}>
          <Heading size="md" mb={4}>
            付与年度別残りの有休日数
          </Heading>
          <Stack divider={<StackDivider />} spacing="2">
            <Flex justify="space-between" alignItems="center">
              <Heading size="md">2023年度</Heading>
              <Heading size="md">14日</Heading>
              <HistoryModal />
            </Flex>
            <Flex justify="space-between" alignItems="center">
              <Heading size="md">2022年度</Heading>
              <Heading size="md">3日</Heading>
              <HistoryModal />
            </Flex>
          </Stack>
        </CardBody>
      </Card>
      <Flex justify="space-between" alignItems="center" pt={4} px={2}>
        <Heading size="md">有休取得日</Heading>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date ?? startDate)}
          dateFormat="yyyy/MM/dd"
          calendarStartDay={1}
        />
      </Flex>
      <Button colorScheme="teal" mt={2} h={12}>
        全休取得
      </Button>
      <Button colorScheme="teal" mt={2} h={12}>
        半休取得
      </Button>
    </Stack>
  );
};
