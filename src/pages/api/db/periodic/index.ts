import dayjs from "dayjs";
import ja from "dayjs/locale/ja";

import prisma from "@/lib/prisma";

dayjs.locale(ja);

export default async function handle(req, res) {
  try {
    // 月一実行処理

    // 1.当月が更新月のユーザー取得 強制的に00:00:00:000扱い
    const now = dayjs().hour(0).minute(0).second(0).millisecond(0);

    console.warn(now);

    // cronはUTCで起動
    // UTCで月末日の15時に起動しないといけない
    // cronで月末日の指定ができない
    // 代案として、UTCで28,29,30,31日の15時に起動とする
    // cron = 0 15 28,29,30,31 * *
    // 日本時間1日かどうかはここで判断行い、そうでない場合は処理を終了
    // if (now.date() !== 1) {
    //   res.json(null);
    //   return;
    // }

    const mEmployees = await prisma.mEmployee.findMany({
      where: { quitFlg: false },
      include: {
        vacationDays: {
          where: { expiredFlg: false },
          orderBy: { employmentYears: "asc" },
        },
      },
    });
    console.warn(mEmployees);

    const targetEmps = mEmployees.filter((mEmp) => {
      // 入社日 JSTに変換しているので 09:00
      const joinDate = dayjs(mEmp.joinDate);
      // 半年後なので +6 month, year設定 ex.YYYY/MM/01 09:00:00
      let updateDate = joinDate.add(7, "M").year(now.year());
      // 強制的に00:00:00:000扱い
      updateDate = updateDate.hour(0).minute(0).second(0).millisecond(0);

      // ミリ秒まで合わせているので===で比較可能
      return now.diff(updateDate) === 0;
    });
    console.warn(targetEmps);

    // 対象ユーザいなければ終了
    if (targetEmps.length < 1) {
      console.warn("dddddddddddddddddddddddddd");
      res.json(null);
    }

    // 2.年次別日数テーブル更新
    const updateTargetEmp = targetEmps.filter((x) => x.vacationDays.length > 1);
    console.warn("updateTargetEmp");
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
