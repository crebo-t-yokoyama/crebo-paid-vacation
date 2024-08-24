import dayjs from "dayjs";
import ja from "dayjs/locale/ja";

import prisma from "@/lib/prisma";

dayjs.locale(ja);

export default async function handle(req, res) {
  const { acquisitionDate, employeeCode, halfFlg } = req.body;

  const target = await prisma.tVacationDays.findFirst({
    where: { employeeCode: employeeCode, expiredFlg: false },
    orderBy: { employmentYears: "asc" },
  });

  if (target) {
    // update tVacationDays
    const uodateTVacationDays = await prisma.tVacationDays.update({
      where: {
        employeeCode_employmentYears: {
          employeeCode: target.employeeCode,
          employmentYears: Number(target.employmentYears),
        },
      },
      data: {
        remainingDays: Number(target.remainingDays) - (halfFlg ? 0.5 : 1),
        updateUser: employeeCode,
      },
    });

    // insert tVacationHistory
    const updateTVacationHistory = await prisma.tVacationHistory.create({
      data: {
        employeeCode: target.employeeCode,
        acquisitionDate: acquisitionDate,
        employmentYears: target.employmentYears,
        halfFlg: halfFlg,
        insertUser: employeeCode,
        updateUser: employeeCode,
      },
    });
  }

  res.json(null);
}
