import dayjs from "dayjs";
import ja from "dayjs/locale/ja";

import prisma from "@/lib/prisma";

dayjs.locale(ja);

export default async function handle(req, res) {
  const { acquisitionDate, employeeCode, halfFlg } = req.body;

  // acquisitionDateを解析してISO 8601形式に変換
  const parsedDate = dayjs(acquisitionDate, "YYYY/M/D").toISOString();

  const target = await prisma.tVacationDays.findFirst({
    where: { employeeCode: employeeCode, expiredFlg: false },
    orderBy: { employmentYears: "asc" },
  });

  if (target) {
    // update tVacationDays
    const updateTVacationDays = await prisma.tVacationDays.update({
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
        acquisitionDate: parsedDate, // 変換後の日付を使用
        employmentYears: target.employmentYears,
        halfFlg: halfFlg,
        insertUser: employeeCode,
        updateUser: employeeCode,
      },
    });
  }

  res.json(null);
}
