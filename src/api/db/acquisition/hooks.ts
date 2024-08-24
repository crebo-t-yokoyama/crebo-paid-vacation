import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

const acquisitionKeys = { all: ["acquisition"] as const };

type AcquisitionRequest = {
  acquisitionDate: string;
  employeeCode: string;
  halfFlg: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AcquisitionResponse = any;

export const useAcquisitionMutation = (
  options?: Omit<
    UseMutationOptions<
      AcquisitionResponse,
      AxiosError,
      AcquisitionRequest,
      typeof acquisitionKeys.all
    >,
    "queryKey" | "queryFn"
  >
) => {
  return useMutation<
    AcquisitionResponse,
    AxiosError,
    AcquisitionRequest,
    typeof acquisitionKeys.all
  >({
    ...options,
    mutationFn: async (req: AcquisitionRequest) => {
      const { data } = await axios.request({
        url: "/api/db/acquisition",
        method: "POST",
        data: {
          acquisitionDate: req.acquisitionDate,
          employeeCode: req.employeeCode,
          halfFlg: req.halfFlg,
        },
      });
      return data;
    },
  });
};
