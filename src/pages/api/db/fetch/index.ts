import dayjs from "dayjs";
import ja from "dayjs/locale/ja";

import prisma from "@/lib/prisma";

dayjs.locale(ja);

export default async function handle(req, res) {
  const { email } = req.body;

  const result = await prisma.mEmployee.findUnique({
    where: { email },
    include: {
      vacationDays: {
        where: { expiredFlg: false },
        orderBy: { employmentYears: "desc" },
        take: 2,
        include: {
          vacationHistory: {
            where: { delFlg: false },
            orderBy: { acquisitionDate: "asc" },
          },
        },
      },
    },
  });

  if (result) {
    const joinDate = dayjs(result.joinDate);
    const updateDate = joinDate.add(6, "M");

    const response = {
      employeeCode: result.employeeCode,
      name: result.name,
      joinDate: joinDate.format("YYYY/MM"),
      updateDate: updateDate.startOf("month").format("MM/DD"),
      vacationDays: result.vacationDays.map((x) => {
        return {
          employeeCode: x.employeeCode,
          employmentYears: Number(x.employmentYears),
          remainingDays: Number(x.remainingDays),
          vacationHistory: x.vacationHistory.map((y) => {
            const acquisitionDate = dayjs(y.acquisitionDate).format(
              "YYYY/MM/DD"
            );
            return {
              id: y.id,
              employeeCode: y.employeeCode,
              acquisitionDate,
              halfFlg: y.halfFlg,
            };
          }),
        };
      }),
    };

    res.json(response);
  } else {
    res.json(result);
  }
}
