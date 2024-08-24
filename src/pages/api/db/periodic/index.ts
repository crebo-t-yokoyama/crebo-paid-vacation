import dayjs from "dayjs";
import ja from "dayjs/locale/ja";

import prisma from "@/lib/prisma";

dayjs.locale(ja);

export default async function handle(req, res) {
  try {
    // 月一実行処理

    // 1.当月が更新月のユーザー取得
    const now = dayjs().hour(0).minute(0).second(0).millisecond(0);

    const mEmployees = await prisma.mEmployee.findMany({
      include: {
        vacationDays: {
          where: { expiredFlg: false },
          orderBy: { employmentYears: "asc" },
        },
      },
    });

    const targetEmps = mEmployees.filter((mEmp) => {
      const joinDate = dayjs(mEmp.joinDate);
      const updateDate = joinDate.add(6, "M").year(now.year()).subtract(9, "h");
      // 1h以内
      const absDiff = Math.abs(now.diff(updateDate)) < 60 * 60;
      return absDiff;
    });

    // 2.年次別日数テーブル更新
    const updateTargetEmp = targetEmps.filter((x) => x.vacationDays.length > 1);
    const updateData = updateTargetEmp.map((emp) => {
      return {
        where: {
          employeeCode_employmentYears: {
            employeeCode: emp.employeeCode,
            employmentYears: emp.vacationDays[0].employmentYears,
          },
        },
        data: {
          expiredFlg: true,
          remainingDays: 0,
        },
      };
    });
    await prisma.$transaction(
      updateData.map((data) => prisma.tVacationDays.update(data))
    );

    // 3.年次別日数テーブル追加
    const mVacationDays = await prisma.mVacationDays.findMany({});

    const insData = targetEmps.map((emps) => {
      const vacationDays = emps.vacationDays;
      let employmentYears = 0.5;
      if (vacationDays.length > 0) {
        const latestEmploymentYears = vacationDays.reverse()[0].employmentYears;
        employmentYears = Number(latestEmploymentYears) + 1;
      }
      const remainingDays =
        mVacationDays.find((x) => Number(x.employmentYears) === employmentYears)
          ?.grantDays ?? 20;

      return {
        employeeCode: emps.employeeCode,
        employmentYears: employmentYears,
        remainingDays: remainingDays,
        expiredFlg: false,
      };
    });

    await prisma.tVacationDays.createMany({ data: insData });

    res.json(null);
  } catch {
    res.status(500).json({
      success: false,
      message: "サーバーエラーが発生しました。",
      code: "INTERNAL SERVER ERROR",
    });
  }
}
