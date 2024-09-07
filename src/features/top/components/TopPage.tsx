import {
  Button,
  Card,
  CardBody,
  Heading,
  Stack,
  StackDivider,
  Flex,
  useToast,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import ja from "dayjs/locale/ja";
import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";

import { useAcquisitionMutation } from "@/api/db/acquisition";
import { useFetchQuery } from "@/api/db/fetch";
import { DatePicker } from "@/components/datepicker";
import { LoadingOverlay } from "@/components/overlay";
import { HistoryModal } from "@/features/history";

dayjs.locale(ja);

export const TopPage = () => {
  const { data: session, status } = useSession();

  const toast = useToast();

  const [startDate, setStartDate] = useState(new Date());

  const { data, isFetching, refetch } = useFetchQuery(
    session?.user?.email ?? "",
    {
      enabled: session?.user?.email ? true : false,
    }
  );

  const acquisitionMutation = useAcquisitionMutation();

  const acquisition = (halfFlg: boolean) => {
    acquisitionMutation
      .mutateAsync({
        acquisitionDate: startDate.toLocaleDateString(),
        employeeCode: data?.employeeCode ?? "",
        halfFlg,
      })
      .then(() => {
        refetch();
        toast({
          title: `${halfFlg ? "半休" : "全休"}を取得しました`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      })
      .catch(({ response }: AxiosError<{ code: string; message: string }>) => {
        toast({
          title: response?.data?.code ?? "",
          description: response?.data?.message ?? "",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      });
  };

  const loading = status === "loading";

  useEffect(() => {
    if (!loading && !session) {
      signIn("azure-ad"); // プロバイダーを明示的に指定
    }
  }, [session, loading]);

  if (loading) {
    return <p>Loading...</p>; // ローディング中の表示
  }

  if (!session) {
    return null; // 未ログイン時は何も表示しない（リダイレクト処理が行われる）
  }

  return (
    <>
      <LoadingOverlay isLoading={isFetching || acquisitionMutation.isPending} />
      <Stack w="full" p={4}>
        <Card border="1px solid gray">
          <CardBody p={4}>
            <Stack divider={<StackDivider />} spacing="4">
              <Flex justify="space-between" alignItems="center">
                <Heading size="md">入社年月</Heading>
                <Heading size="md">{data?.joinDate}</Heading>
              </Flex>
              <Flex justify="space-between" alignItems="center">
                <Heading size="md">有休更新日</Heading>
                <Heading size="md">{data?.updateDate}</Heading>
              </Flex>
            </Stack>
          </CardBody>
        </Card>
        <Card border="1px solid gray">
          <CardBody p={4}>
            <Flex justify="space-between" alignItems="center">
              <Heading size="md">残りの有休日数</Heading>
              <Heading size="2xl" textAlign="end">
                {data?.vacationDays.reduce(
                  (r: number, c) => r + c.remainingDays,
                  0
                ) ?? 0}
                日
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
              {data?.vacationDays.map((x, i) => (
                <Flex key={i} justify="space-between" alignItems="center">
                  <Heading size="md">{`${x.employmentYears}年目分`}</Heading>
                  <Heading size="md">{`${x.remainingDays}日`}</Heading>
                  <HistoryModal
                    employmentYears={x.employmentYears}
                    vacationHistory={x.vacationHistory}
                    refetch={refetch}
                  />
                </Flex>
              ))}
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
        <Button
          colorScheme="teal"
          mt={2}
          h={12}
          onClick={() => acquisition(false)}
        >
          全休取得
        </Button>
        <Button
          colorScheme="teal"
          mt={2}
          h={12}
          onClick={() => acquisition(true)}
        >
          半休取得
        </Button>
      </Stack>
    </>
  );
};
