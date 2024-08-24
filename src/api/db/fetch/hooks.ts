import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

const fetchKeys = { all: ["fetch"] as const };

type FetchResponse = {
  employeeCode: string;
  name: string;
  joinDate: string;
  updateDate: string;
  vacationDays: {
    employeeCode: string;
    employmentYears: number;
    remainingDays: number;
    vacationHistory: {
      id: number;
      employeeCode: string;
      acquisitionDate: string;
      halfFlg: boolean;
    }[];
  }[];
};

export const useFetchQuery = <TData = FetchResponse>(
  email: string,
  options?: Omit<
    UseQueryOptions<FetchResponse, AxiosError, TData, typeof fetchKeys.all>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    ...options,
    queryKey: fetchKeys.all,
    queryFn: async () => {
      const { data } = await axios.request({
        url: "/api/db/fetch",
        method: "POST",
        data: { email },
      });
      return data;
    },
  });
};
