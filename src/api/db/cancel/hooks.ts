import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

const cancelKeys = { all: ["cancel"] as const };

type CancelRequest = {
  id: number;
  employeeCode: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CancelResponse = any;

export const useCancelMutation = (
  options?: Omit<
    UseMutationOptions<
      CancelResponse,
      AxiosError,
      CancelRequest,
      typeof cancelKeys.all
    >,
    "queryKey" | "queryFn"
  >
) => {
  return useMutation<
    CancelResponse,
    AxiosError,
    CancelRequest,
    typeof cancelKeys.all
  >({
    ...options,
    mutationFn: async (req: CancelRequest) => {
      const { data } = await axios.request({
        url: "/api/db/cancel",
        method: "POST",
        data: { id: req.id, employeeCode: req.employeeCode },
      });
      return data;
    },
  });
};
